import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WP_BASE_URL = 'https://www.khashika.com';

const isDryRun = process.argv.includes('--dry-run');

// Produits à corriger avec leurs slugs WordPress connus
const PRODUCTS_TO_FIX = [
  {
    name: 'BOUCLES D\'OREILLES rondes en argent filigrane et pierre de lune',
    searchTerms: ['boucles', 'filigrane', 'pierre de lune'],
    knownWpImage: 'https://www.khashika.com/wp-content/uploads/DSC05430-1-768x512.jpeg',
  },
  {
    name: 'CHAINE DE CHEVILLES argent avec perles',
    searchTerms: ['chaine', 'chevilles', 'perles'],
    knownWpImage: 'https://www.khashika.com/wp-content/uploads/DSC05585-768x512.jpeg',
  },
  {
    name: 'BOUCLES D\'OREILLES fantaisie noir et blanc',
    searchTerms: ['fantaisie', 'noir', 'blanc'],
    knownWpImage: 'https://www.khashika.com/wp-content/uploads/BOFA2004-1024x683.jpg',
  },
  {
    name: 'Boucles d\'oreille argent avec pierre naturelle onyx noir',
    searchTerms: ['boucles', 'onyx', 'noir'],
    knownWpImage: null, // À scraper
  },
  {
    name: 'Boucles d\'oreille argent avec pierre naturelle saphir',
    searchTerms: ['boucles', 'saphir'],
    knownWpImage: null, // À scraper
  },
  {
    name: 'Bracelet perles argentées et corail',
    searchTerms: ['bracelet', 'perles', 'corail'],
    knownWpImage: null, // À scraper
  },
];

// Image à ne JAMAIS utiliser (le faux générique)
const BLACKLISTED_IMAGES = [
  'boucles-doreilles-fantaisie.jpg',
  'boucles-doreilles-fantaisie',
];

async function scrapeProductImage(slug: string): Promise<string | null> {
  const urls = [
    `${WP_BASE_URL}/produit/${slug}/`,
    `${WP_BASE_URL}/product/${slug}/`,
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        timeout: 10000,
      });
      
      if (!res.ok) continue;
      
      const html = await res.text();
      const $ = cheerio.load(html);
      
      // Chercher l'image principale
      const selectors = [
        '.woocommerce-product-gallery__image img',
        '[data-large_image]',
        '.wp-post-image',
      ];
      
      for (const sel of selectors) {
        const img = $(sel).first();
        const src = img.attr('data-large_image') || img.attr('data-src') || img.attr('src');
        
        if (src && src.includes('/wp-content/uploads/')) {
          // Vérifier que ce n'est pas une image blacklistée
          const isBlacklisted = BLACKLISTED_IMAGES.some(bl => src.toLowerCase().includes(bl.toLowerCase()));
          if (!isBlacklisted) {
            return src;
          }
        }
      }
    } catch (err: any) {
      console.log(`      Erreur scraping ${url}: ${err.message}`);
    }
  }
  
  return null;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('CORRECTION DES IMAGES MAL ASSOCIÉES');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}\n`);
  
  // Récupérer tous les produits
  const { data: allProducts } = await supabase
    .from('products')
    .select('id, name, slug, image_url');
  
  if (!allProducts) {
    console.error('Erreur récupération produits');
    return;
  }
  
  let fixed = 0;
  
  for (const toFix of PRODUCTS_TO_FIX) {
    console.log(`\n📦 Recherche: "${toFix.name}"`);
    
    // Trouver le produit dans la base
    const product = allProducts.find(p => {
      const nameLower = p.name.toLowerCase();
      return toFix.searchTerms.every(term => nameLower.includes(term.toLowerCase()));
    });
    
    if (!product) {
      console.log('   ❌ Produit non trouvé dans Supabase');
      continue;
    }
    
    console.log(`   Trouvé: [${product.slug}] ${product.name}`);
    console.log(`   Image actuelle: ${product.image_url?.split('/').pop() || 'aucune'}`);
    
    // Déterminer la nouvelle image
    let newImage = toFix.knownWpImage;
    
    if (!newImage && product.slug) {
      console.log(`   🔍 Scraping WordPress pour slug: ${product.slug}`);
      newImage = await scrapeProductImage(product.slug);
    }
    
    if (newImage) {
      console.log(`   ✅ Nouvelle image: ${newImage.split('/').pop()}`);
      
      if (!isDryRun) {
        const { error } = await supabase
          .from('products')
          .update({ image_url: newImage })
          .eq('id', product.id);
        
        if (error) {
          console.log(`   ❌ Erreur mise à jour: ${error.message}`);
        } else {
          console.log(`   💾 Mis à jour !`);
          fixed++;
        }
      } else {
        console.log(`   [DRY-RUN] Serait mis à jour`);
        fixed++;
      }
    } else {
      console.log(`   ⚠️ Aucune image trouvée sur WordPress`);
    }
    
    // Pause
    await new Promise(r => setTimeout(r, 1000));
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`RÉSULTAT: ${fixed} produits ${isDryRun ? 'à corriger' : 'corrigés'}`);
}

main().catch(console.error);





