import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import * as fs from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WP_BASE_URL = 'https://www.khashika.com';
const isDryRun = process.argv.includes('--dry-run');
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

// Pages info/catégorie à ignorer
const NON_PRODUCT_PATTERNS = [
  /^rubis$/i, /^saphir$/i, /^emeraude$/i, /^grenat$/i, /^onyx$/i, /^turquoise$/i,
  /^jade$/i, /^amethyste$/i, /^améthyste$/i, /^topaze$/i, /^perle$/i, /^corail$/i,
  /^citrine$/i, /^agate$/i, /^jaspe$/i, /^moonstone$/i, /^labradorite$/i,
  /^malachite$/i, /^peridot$/i, /^péridot$/i, /^quartz$/i, /^howlite$/i,
  /^apatite$/i, /^lapis$/i, /^aventurine$/i,
  /^bagues$/i, /^colliers$/i, /^bracelets$/i, /^boucles$/i, /^pendentifs$/i,
  /^chaines$/i, /^accessoires$/i, /^bijoux$/i, /^clous$/i,
];

// Générer des variations de slug
function generateSlugVariations(name: string, currentSlug: string): string[] {
  const variations = new Set<string>();
  
  // Slug actuel
  variations.add(currentSlug);
  
  // Générer depuis le nom - version simple
  const fromName = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/['']/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
  
  variations.add(fromName);
  
  // Tronquer le slug long
  if (currentSlug.length > 50) {
    variations.add(currentSlug.substring(0, 50));
    variations.add(currentSlug.substring(0, 40));
  }
  
  // Variations sans mots communs
  const withoutCommon = fromName
    .replace(/-argent-/g, '-')
    .replace(/-avec-/g, '-')
    .replace(/-en-/g, '-')
    .replace(/-et-/g, '-')
    .replace(/-de-/g, '-')
    .replace(/-pierre-naturelle-/g, '-')
    .replace(/-pierres-naturelles-/g, '-')
    .replace(/-bijou-/g, '-')
    .replace(/-indien-/g, '-')
    .replace(/-indienne-/g, '-')
    .replace(/-fantaisie-/g, '-')
    .replace(/-tibetain-/g, '-')
    .replace(/-tibetaine-/g, '-')
    .replace(/-tibetaines-/g, '-')
    .replace(/-tibetains-/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  variations.add(withoutCommon);
  
  // Nettoyer et retourner
  return [...variations]
    .filter(s => s && s.length > 3)
    .slice(0, 8); // Limiter à 8 variations max
}

async function tryFetchImage(slug: string): Promise<string | null> {
  const urls = [
    `${WP_BASE_URL}/produit/${slug}/`,
    `${WP_BASE_URL}/product/${slug}/`,
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        timeout: 8000,
      });
      
      if (!res.ok) continue;
      
      const html = await res.text();
      const $ = cheerio.load(html);
      
      const imgSources = [
        $('[data-large_image]').first().attr('data-large_image'),
        $('.woocommerce-product-gallery__image img').first().attr('data-src'),
        $('.woocommerce-product-gallery__image img').first().attr('src'),
        $('.wp-post-image').first().attr('src'),
      ];
      
      for (const img of imgSources) {
        if (img && 
            img.includes('/wp-content/uploads/') && 
            !img.toLowerCase().includes('boucles-doreilles-fantaisie') &&
            !img.toLowerCase().includes('placeholder')) {
          return img;
        }
      }
    } catch {}
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Charger les produits à corriger
  let toFix: any[];
  
  if (fs.existsSync('produits-correction-manuelle.json')) {
    toFix = JSON.parse(fs.readFileSync('produits-correction-manuelle.json', 'utf-8'));
  } else {
    console.error('❌ Fichier produits-correction-manuelle.json non trouvé');
    return;
  }
  
  // Filtrer les pages info/catégorie
  const realProducts = toFix.filter(p => {
    return !NON_PRODUCT_PATTERNS.some(pattern => pattern.test(p.name.trim()));
  });
  
  console.log('='.repeat(60));
  console.log('CORRECTION AVEC VARIATIONS DE SLUGS');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}`);
  console.log(`Total à corriger: ${toFix.length}`);
  console.log(`Pages info/catégorie ignorées: ${toFix.length - realProducts.length}`);
  console.log(`Vrais produits à traiter: ${realProducts.length}`);
  if (limit) console.log(`Limite: ${limit}`);
  console.log('');
  
  let products = limit ? realProducts.slice(0, limit) : realProducts;
  
  let fixed = 0;
  let notFound = 0;
  const stillMissing: any[] = [];
  const fixedProducts: any[] = [];
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`\n[${i+1}/${products.length}] 📦 "${p.name.substring(0, 50)}"`);
    
    const slugVariations = generateSlugVariations(p.name, p.slug);
    
    let foundImage: string | null = null;
    let successSlug: string | null = null;
    
    for (const slug of slugVariations) {
      foundImage = await tryFetchImage(slug);
      if (foundImage) {
        successSlug = slug;
        break;
      }
    }
    
    if (foundImage) {
      console.log(`   ✅ Trouvé: ${foundImage.split('/').pop()}`);
      
      if (!isDryRun) {
        const { error } = await supabase
          .from('products')
          .update({ image_url: foundImage })
          .eq('id', p.id);
        
        if (!error) {
          console.log('   💾 Mis à jour');
          fixed++;
          fixedProducts.push({ ...p, newImage: foundImage, slug: successSlug });
        } else {
          console.log(`   ❌ Erreur: ${error.message}`);
        }
      } else {
        fixed++;
        fixedProducts.push({ ...p, newImage: foundImage, slug: successSlug });
      }
    } else {
      console.log('   ❌ Non trouvé');
      notFound++;
      stillMissing.push(p);
    }
    
    // Pause pour ne pas surcharger le serveur
    await sleep(1200);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('RÉSULTAT');
  console.log('='.repeat(60));
  console.log(`✅ ${isDryRun ? 'À corriger' : 'Corrigés'}: ${fixed}`);
  console.log(`❌ Non trouvés: ${notFound}`);
  
  // Sauvegarder les rapports
  if (fixedProducts.length > 0) {
    fs.writeFileSync('produits-fixed-variations.json', JSON.stringify(fixedProducts, null, 2));
    console.log(`\n📄 Produits corrigés: produits-fixed-variations.json`);
  }
  
  if (stillMissing.length > 0) {
    fs.writeFileSync('produits-still-missing.json', JSON.stringify(stillMissing, null, 2));
    console.log(`📄 Produits non trouvés: produits-still-missing.json`);
  }
}

main().catch(console.error);





