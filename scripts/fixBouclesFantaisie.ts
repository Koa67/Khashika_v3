import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { config } from 'dotenv';
import { resolve } from 'path';
import * as fs from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const WP_BASE_URL = 'https://www.khashika.com';
const isDryRun = process.argv.includes('--dry-run');
const limitArg = process.argv.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;

// L'image problématique à remplacer
const BAD_IMAGE = 'boucles-doreilles-fantaisie.jpg';

async function scrapeImage(slug: string): Promise<string | null> {
  // Nettoyer le slug pour différentes variantes d'URL
  const cleanSlug = slug
    .replace(/^br/, '') // Retirer les préfixes "br"
    .replace(/-ce-.*$/, '') // Retirer les descriptions longues
    .substring(0, 60); // Limiter la longueur
  
  const slugVariants = [slug, cleanSlug];
  const urlPrefixes = ['produit', 'product'];
  
  for (const prefix of urlPrefixes) {
    for (const s of slugVariants) {
      const url = `${WP_BASE_URL}/${prefix}/${s}/`;
      
      try {
        const res = await fetch(url, { 
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' },
          timeout: 10000 
        });
        
        if (!res.ok) continue;
        
        const $ = cheerio.load(await res.text());
        
        // Chercher l'image principale WooCommerce
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
  }
  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('CORRECTION DES PRODUITS AVEC IMAGE "boucles-doreilles-fantaisie"');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}`);
  if (limit) console.log(`Limite: ${limit} produits`);
  console.log('');
  
  // Récupérer les produits avec la mauvaise image
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, image_url')
    .like('image_url', `%${BAD_IMAGE}%`);
  
  if (!products || products.length === 0) {
    console.log('✅ Aucun produit avec cette image trouvé !');
    return;
  }
  
  // Filtrer les vrais produits (exclure celui qui est censé avoir cette image)
  const productsToFix = products.filter(p => 
    !p.slug.includes('boucles-doreilles-fantaisie') || 
    p.slug !== 'boucles-doreilles-fantaisie'
  );
  
  let toProcess = limit ? productsToFix.slice(0, limit) : productsToFix;
  
  console.log(`📦 ${products.length} produits trouvés avec image "${BAD_IMAGE}"`);
  console.log(`🔧 ${productsToFix.length} produits à corriger (excluant le légitime)`);
  console.log(`🚀 Traitement de ${toProcess.length} produits...\n`);
  
  let fixed = 0;
  let noImage = 0;
  const results: any[] = [];
  
  for (let i = 0; i < toProcess.length; i++) {
    const p = toProcess[i];
    console.log(`[${i+1}/${toProcess.length}] 📦 "${p.name.substring(0, 50)}..."`);
    console.log(`   Slug: ${p.slug.substring(0, 50)}`);
    
    const newImg = await scrapeImage(p.slug);
    
    if (newImg) {
      console.log(`   ✅ Trouvé: ${newImg.split('/').pop()}`);
      
      if (!isDryRun) {
        const { error } = await supabase
          .from('products')
          .update({ image_url: newImg })
          .eq('id', p.id);
        
        if (error) {
          console.log(`   ❌ Erreur: ${error.message}`);
        } else {
          console.log(`   💾 Mis à jour`);
          fixed++;
          results.push({ ...p, newImage: newImg, status: 'fixed' });
        }
      } else {
        fixed++;
        results.push({ ...p, newImage: newImg, status: 'would_fix' });
      }
    } else {
      console.log(`   ⚠️ Pas d'image WordPress trouvée`);
      noImage++;
      results.push({ ...p, status: 'no_image' });
    }
    
    // Pause pour ne pas surcharger le serveur
    if (i < toProcess.length - 1) {
      await sleep(1500);
    }
  }
  
  // Sauvegarder le rapport
  fs.writeFileSync('fix-boucles-report.json', JSON.stringify(results, null, 2));
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT');
  console.log('='.repeat(60));
  console.log(`✅ ${isDryRun ? 'À corriger' : 'Corrigés'}: ${fixed}`);
  console.log(`⚠️ Sans image WordPress: ${noImage}`);
  console.log(`📄 Rapport: fix-boucles-report.json`);
  
  // Lister ceux sans image
  const stillBad = results.filter(r => r.status === 'no_image');
  if (stillBad.length > 0) {
    console.log(`\n⚠️ ${stillBad.length} produits nécessitent une correction manuelle`);
    fs.writeFileSync('produits-correction-manuelle.json', JSON.stringify(stillBad, null, 2));
    console.log('📄 Liste: produits-correction-manuelle.json');
  }
}

main().catch(console.error);





