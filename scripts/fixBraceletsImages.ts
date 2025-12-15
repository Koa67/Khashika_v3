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

// Image de catégorie à remplacer
const BAD_IMAGE = 'bracelets.jpeg';

// Images à ne pas utiliser
const BLACKLISTED = ['bracelets.jpeg', 'bracelets.jpg', 'boucles-doreilles-fantaisie'];

async function scrapeImage(slug: string): Promise<string | null> {
  const slugVariations = [
    slug,
    slug.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
    slug.substring(0, 50),
    slug.replace(/-ce-.*$/, ''),
  ].filter(s => s && s.length > 5);
  
  for (const prefix of ['produit', 'product']) {
    for (const s of slugVariations) {
      const url = `${WP_BASE_URL}/${prefix}/${s}/`;
      
      try {
        const res = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
          timeout: 8000,
        });
        
        if (!res.ok) continue;
        
        const $ = cheerio.load(await res.text());
        
        const imgSources = [
          $('[data-large_image]').first().attr('data-large_image'),
          $('.woocommerce-product-gallery__image img').first().attr('data-src'),
          $('.woocommerce-product-gallery__image img').first().attr('src'),
          $('.wp-post-image').first().attr('src'),
        ];
        
        for (const img of imgSources) {
          if (img && img.includes('/wp-content/uploads/')) {
            const filename = img.split('/').pop()?.toLowerCase() || '';
            if (!BLACKLISTED.some(bl => filename.includes(bl))) {
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
  console.log('CORRECTION DES BRACELETS AVEC IMAGE GÉNÉRIQUE');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}`);
  if (limit) console.log(`Limite: ${limit}`);
  console.log('');
  
  // Récupérer les bracelets avec l'image générique
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, image_url')
    .like('image_url', `%${BAD_IMAGE}%`);
  
  if (!products) {
    console.error('❌ Erreur récupération produits');
    return;
  }
  
  // Exclure le produit légitime "Bracelets" (catégorie)
  const toFix = products.filter(p => 
    p.slug !== 'bracelets' && 
    !p.name.toLowerCase().includes('bijoux d\'inde')
  );
  
  console.log(`📦 ${products.length} produits avec image "${BAD_IMAGE}"`);
  console.log(`🔧 ${toFix.length} produits à corriger`);
  
  let productList = limit ? toFix.slice(0, limit) : toFix;
  console.log(`🚀 Traitement de ${productList.length} produits...\n`);
  
  let fixed = 0;
  let notFound = 0;
  const results: any[] = [];
  
  for (let i = 0; i < productList.length; i++) {
    const p = productList[i];
    console.log(`[${i+1}/${productList.length}] 📦 "${p.name.substring(0, 50)}"`);
    
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
  
  fs.writeFileSync('fix-bracelets-report.json', JSON.stringify(results, null, 2));
  console.log('\n📄 Rapport: fix-bracelets-report.json');
}

main().catch(console.error);





