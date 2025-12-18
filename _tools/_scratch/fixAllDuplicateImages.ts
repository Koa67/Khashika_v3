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

async function scrapeImage(slug: string): Promise<string | null> {
  const urls = [
    `${WP_BASE_URL}/produit/${slug}/`,
    `${WP_BASE_URL}/product/${slug}/`,
  ];
  
  for (const url of urls) {
    try {
      const res = await fetch(url, { 
        headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
        timeout: 10000 
      });
      if (!res.ok) continue;
      
      const $ = cheerio.load(await res.text());
      const img = $('[data-large_image]').first().attr('data-large_image') ||
                  $('.woocommerce-product-gallery__image img').first().attr('data-src') ||
                  $('.woocommerce-product-gallery__image img').first().attr('src') ||
                  $('.wp-post-image').first().attr('src');
      
      if (img && img.includes('/wp-content/uploads/')) {
        return img;
      }
    } catch {}
  }
  return null;
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('CORRECTION DE TOUTES LES IMAGES DUPLIQUÉES');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}\n`);
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, image_url');
  
  if (!products) return;
  
  // Trouver les images dupliquées
  const imageCount: Record<string, any[]> = {};
  products.forEach(p => {
    const img = p.image_url || '';
    if (!img) return;
    if (!imageCount[img]) imageCount[img] = [];
    imageCount[img].push(p);
  });
  
  const duplicates = Object.entries(imageCount)
    .filter(([img, prods]) => prods.length > 1);
  
  console.log(`${duplicates.length} images dupliquées trouvées\n`);
  
  if (duplicates.length === 0) {
    console.log('✅ Aucune duplication à corriger !');
    return;
  }
  
  let totalFixed = 0;
  let totalAttempted = 0;
  
  for (const [img, prods] of duplicates) {
    const filename = img.split('/').pop() || img;
    console.log(`\n📷 ${filename} (${prods.length} produits)`);
    
    // Garder le premier produit avec cette image (probablement correct)
    console.log(`   ✓ [${prods[0].slug}] ${prods[0].name} (gardé)`);
    
    // Corriger les autres
    for (let i = 1; i < prods.length; i++) {
      const p = prods[i];
      totalAttempted++;
      console.log(`   🔍 [${p.slug}] ${p.name}`);
      
      const newImg = await scrapeImage(p.slug);
      
      if (newImg && newImg !== img) {
        console.log(`      ✅ Nouvelle: ${newImg.split('/').pop()}`);
        
        if (!isDryRun) {
          const { error } = await supabase
            .from('products')
            .update({ image_url: newImg })
            .eq('id', p.id);
          
          if (error) {
            console.log(`      ❌ Erreur: ${error.message}`);
          } else {
            console.log(`      💾 Mis à jour`);
            totalFixed++;
          }
        } else {
          console.log(`      [DRY-RUN] Serait mis à jour`);
          totalFixed++;
        }
      } else {
        console.log(`      ⚠️ Pas d'alternative trouvée sur WordPress`);
      }
      
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`RÉSULTAT:`);
  console.log(`  - Produits analysés: ${totalAttempted}`);
  console.log(`  - Produits ${isDryRun ? 'à corriger' : 'corrigés'}: ${totalFixed}`);
  console.log(`  - Sans alternative: ${totalAttempted - totalFixed}`);
}

main().catch(console.error);





