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

// Images de catégorie génériques à remplacer
const CATEGORY_IMAGES = [
  'bracelets.jpeg',
  'bracelets.jpg',
  'boucles-doreilles-fantaisie.jpg',
  'colliers.jpeg',
  'colliers.jpg',
  'pendentifs.jpeg',
  'pendentifs.jpg',
  'bagues.jpeg',
  'bagues.jpg',
  'chaines.jpeg',
  'chaines.jpg',
  'bijoux-d-inde-et-ethniques-accessoires-de-mode',
];

async function scrapeImage(slug: string): Promise<string | null> {
  // Générer des variations de slug
  const slugs = [
    slug,
    slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    slug.replace(/-ce-.*$/, '').substring(0, 60),
    slug.substring(0, 50),
  ];
  
  const prefixes = ['produit', 'product'];
  
  for (const prefix of prefixes) {
    for (const s of slugs) {
      if (!s || s.length < 5) continue;
      
      const url = `${WP_BASE_URL}/${prefix}/${s}/`;
      
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
          if (img && img.includes('/wp-content/uploads/')) {
            // Vérifier que ce n'est pas une image de catégorie
            const filename = img.split('/').pop()?.toLowerCase() || '';
            const isCategory = CATEGORY_IMAGES.some(cat => filename.includes(cat.toLowerCase()));
            if (!isCategory) {
              return img;
            }
          }
        }
      } catch {}
    }
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('CORRECTION DES IMAGES DE CATÉGORIE');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}`);
  if (limit) console.log(`Limite: ${limit}`);
  console.log('');
  
  // Récupérer tous les produits
  const { data: allProducts } = await supabase
    .from('products')
    .select('id, name, slug, image_url');
  
  if (!allProducts) {
    console.error('❌ Erreur récupération produits');
    return;
  }
  
  // Trouver les produits avec images de catégorie
  const productsToFix = allProducts.filter(p => {
    if (!p.image_url) return false;
    const filename = p.image_url.split('/').pop()?.toLowerCase() || '';
    return CATEGORY_IMAGES.some(cat => filename.includes(cat.toLowerCase()));
  });
  
  // Exclure le produit légitime pour chaque catégorie
  const realProductsToFix = productsToFix.filter(p => {
    const slugLower = p.slug?.toLowerCase() || '';
    // Ne pas toucher aux vrais produits de catégorie
    return !['bracelets', 'boucles-doreilles-fantaisie', 'colliers', 'pendentifs', 'bagues', 'chaines'].includes(slugLower);
  });
  
  console.log(`📦 ${productsToFix.length} produits avec images de catégorie`);
  console.log(`🔧 ${realProductsToFix.length} produits à corriger (excluant les légitimes)`);
  
  let products = limit ? realProductsToFix.slice(0, limit) : realProductsToFix;
  console.log(`🚀 Traitement de ${products.length} produits...\n`);
  
  let fixed = 0;
  let notFound = 0;
  const results: any[] = [];
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const currentImg = p.image_url?.split('/').pop() || 'aucune';
    console.log(`[${i+1}/${products.length}] 📦 "${p.name.substring(0, 45)}..." (${currentImg})`);
    
    const newImg = await scrapeImage(p.slug);
    
    if (newImg) {
      console.log(`   ✅ ${newImg.split('/').pop()}`);
      
      if (!isDryRun) {
        const { error } = await supabase
          .from('products')
          .update({ image_url: newImg })
          .eq('id', p.id);
        
        if (!error) {
          console.log('   💾 Mis à jour');
          fixed++;
          results.push({ ...p, newImage: newImg, status: 'fixed' });
        }
      } else {
        fixed++;
        results.push({ ...p, newImage: newImg, status: 'would_fix' });
      }
    } else {
      console.log('   ❌ Non trouvé');
      notFound++;
      results.push({ ...p, status: 'not_found' });
    }
    
    await sleep(1200);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSULTAT');
  console.log('='.repeat(60));
  console.log(`✅ ${isDryRun ? 'À corriger' : 'Corrigés'}: ${fixed}`);
  console.log(`❌ Non trouvés: ${notFound}`);
  
  // Sauvegarder le rapport
  fs.writeFileSync('fix-category-images-report.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Rapport: fix-category-images-report.json');
}

main().catch(console.error);





