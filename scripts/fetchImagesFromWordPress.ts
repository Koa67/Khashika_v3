import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WP_BASE_URL = 'https://www.khashika.com';
const DELAY_MS = 1500;

const isDryRun = process.argv.includes('--dry-run');
const isVerbose = process.argv.includes('--verbose');
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

// Liste des noms de fichiers génériques à rejeter
const BLACKLISTED_FILENAMES = [
  'grenat.jpg', 'amethyste.jpg', 'onyx.jpg', 'aventurine.jpg',
  'turquoise.jpg', 'lapis-lazuli.jpg', 'citrine.jpg', 'quartz-rose.jpg',
  'jade.jpg', 'perle.jpg', 'corail.jpg', 'topaze.jpg', 'peridot.jpg',
  'moonstone.jpg', 'labradorite.jpg', 'agate.jpg', 'jaspe.jpg',
  'oeil-de-tigre.jpg', 'malachite.jpg', 'rubis.jpg', 'saphir.jpg', 'emeraude.jpg',
];

interface ProductData {
  id: string;
  name: string;
  slug: string;
  images?: string[];
  image?: string;
  image_url?: string;
}

async function scrapeProductPage(slug: string): Promise<string[]> {
  const urlVariants = [
    `${WP_BASE_URL}/produit/${slug}/`,
    `${WP_BASE_URL}/product/${slug}/`,
    `${WP_BASE_URL}/boutique/${slug}/`,
  ];

  for (const url of urlVariants) {
    try {
      if (isVerbose) console.log(`   Essai: ${url}`);
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        timeout: 10000,
      });

      if (!response.ok) continue;

      const html = await response.text();
      return extractImagesFromHtml(html);
    } catch (error: any) {
      if (isVerbose) console.log(`   → Erreur: ${error.message}`);
      continue;
    }
  }
  return [];
}

function extractImagesFromHtml(html: string): string[] {
  const $ = cheerio.load(html);
  const images: string[] = [];
  const seen = new Set<string>();

  // Sélecteurs WooCommerce
  const selectors = [
    '.woocommerce-product-gallery__image img',
    '.woocommerce-product-gallery img',
    '.wp-post-image',
    '[data-large_image]',
    'figure.woocommerce-product-gallery__wrapper img',
  ];

  selectors.forEach(selector => {
    $(selector).each((_, el) => {
      const urls = [
        $(el).attr('data-large_image'),
        $(el).attr('data-src'),
        $(el).attr('src'),
      ].filter(Boolean);

      urls.forEach(url => {
        if (url && isValidImage(url) && !seen.has(url)) {
          seen.add(url);
          images.push(url);
        }
      });
    });
  });

  // Chercher aussi dans les liens
  $('a[data-large_image]').each((_, el) => {
    const url = $(el).attr('data-large_image');
    if (url && isValidImage(url) && !seen.has(url)) {
      seen.add(url);
      images.push(url);
    }
  });

  return images;
}

function isValidImage(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  
  // Doit être une image
  if (!lower.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/)) return false;
  
  // Doit être dans wp-content/uploads
  if (!lower.includes('/wp-content/uploads/')) return false;
  
  // Pas de la page informative
  if (lower.includes('autour-du-bijou-indien')) return false;
  
  // Pas un nom générique de pierre
  const filename = lower.split('/').pop()?.split('?')[0] || '';
  if (BLACKLISTED_FILENAMES.includes(filename)) return false;
  
  // Pas trop petit (thumbnail)
  if (lower.match(/-\d{2}x\d{2}\./)) return false;
  
  return true;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('🔍 RÉCUPÉRATION IMAGES WORDPRESS - KHASHIKA');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}\n`);
  
  // Charger les produits sans images
  let productsToProcess: ProductData[] = [];
  
  if (fs.existsSync('produits-sans-images.json')) {
    productsToProcess = JSON.parse(fs.readFileSync('produits-sans-images.json', 'utf-8'));
    console.log(`📄 Chargé depuis produits-sans-images.json: ${productsToProcess.length} produits`);
  } else {
    const { data } = await supabase
      .from('products')
      .select('*');
    
    productsToProcess = (data || []).filter((p: any) => {
      const hasImg = (p.images?.length > 0) || p.image || p.image_url;
      return !hasImg;
    });
  }
  
  if (limit) {
    productsToProcess = productsToProcess.slice(0, limit);
    console.log(`⚡ Limité à ${limit} produits`);
  }
  
  console.log(`\n🚀 Traitement de ${productsToProcess.length} produits...\n`);
  
  let success = 0, noImages = 0, errors = 0, totalFound = 0;
  const results: any[] = [];
  
  for (let i = 0; i < productsToProcess.length; i++) {
    const p = productsToProcess[i];
    console.log(`\n[${i+1}/${productsToProcess.length}] 📦 "${p.name}"`);
    
    try {
      const images = await scrapeProductPage(p.slug);
      
      if (images.length > 0) {
        console.log(`   ✅ ${images.length} image(s) trouvée(s)`);
        images.forEach(img => console.log(`      - ${img.split('/').pop()}`));
        
        success++;
        totalFound += images.length;
        
        if (!isDryRun) {
          // Only image_url column exists in Supabase schema
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: images[0] })
            .eq('id', p.id);
          
          if (updateError) {
            console.log(`   ⛔ Erreur: ${updateError.message}`);
          } else {
            console.log(`   💾 Mis à jour: ${images[0]}`);
          }
        }
        
        results.push({ ...p, status: 'success', images });
      } else {
        console.log(`   ❌ Aucune image trouvée`);
        noImages++;
        results.push({ ...p, status: 'no_images', images: [] });
      }
    } catch (err: any) {
      console.log(`   ❌ Erreur: ${err.message}`);
      errors++;
      results.push({ ...p, status: 'error', error: err.message });
    }
    
    if (i < productsToProcess.length - 1) await sleep(DELAY_MS);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT');
  console.log('='.repeat(60));
  console.log(`✅ Succès: ${success}`);
  console.log(`⚠️ Sans images: ${noImages}`);
  console.log(`❌ Erreurs: ${errors}`);
  console.log(`📷 Total images: ${totalFound}`);
  
  // Sauvegarder les résultats
  fs.writeFileSync('fetch-report.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Rapport sauvegardé: fetch-report.json');
  
  // Lister ceux qui restent sans images
  const stillMissing = results.filter(r => r.status !== 'success');
  if (stillMissing.length > 0) {
    console.log(`\n⚠️ ${stillMissing.length} produits nécessitent une intervention manuelle`);
    fs.writeFileSync('produits-manuels.json', JSON.stringify(stillMissing, null, 2));
    console.log('📄 Liste sauvegardée: produits-manuels.json');
  }
}

main().catch(console.error);





