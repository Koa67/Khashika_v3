/**
 * 🔄 SYNCHRONISATION AVEC SUPABASE
 * 
 * Ce script met à jour la table products dans Supabase avec les
 * nouvelles URLs d'images.
 * 
 * PRÉREQUIS:
 *   - Variables d'environnement NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 *   - Ou fichier .env.local avec ces variables
 * 
 * USAGE:
 *   npx tsx sync-supabase.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Essaie de charger dotenv si disponible
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv non disponible, utilise les variables d'environnement système
}

const CONFIG = {
  PRODUCTS_JSON: './products-updated.json',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  BATCH_SIZE: 50, // Nombre de produits par batch
  DELAY_MS: 500,  // Délai entre les batches
};

interface Product {
  slug: string;
  image_url?: string;
  [key: string]: any;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function updateProduct(product: Product): Promise<{ success: boolean; error?: string }> {
  if (!product.image_url) {
    return { success: false, error: 'Pas d\'image_url' };
  }
  
  try {
    const response = await fetch(
      `${CONFIG.SUPABASE_URL}/rest/v1/products?slug=eq.${encodeURIComponent(product.slug)}`,
      {
        method: 'PATCH',
        headers: {
          'apikey': CONFIG.SUPABASE_KEY,
          'Authorization': `Bearer ${CONFIG.SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          image_url: product.image_url,
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: `HTTP ${response.status}: ${error}` };
    }
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔄 SYNCHRONISATION AVEC SUPABASE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Vérifie la configuration
  if (!CONFIG.SUPABASE_URL || !CONFIG.SUPABASE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.log('\nConfigurer:');
    console.log('  export NEXT_PUBLIC_SUPABASE_URL="https://xxx.supabase.co"');
    console.log('  export SUPABASE_SERVICE_ROLE_KEY="xxx"');
    console.log('\nOu créer un fichier .env.local avec ces variables.');
    process.exit(1);
  }
  
  console.log(`✅ Supabase URL: ${CONFIG.SUPABASE_URL.substring(0, 30)}...`);
  
  // Charge les produits
  if (!fs.existsSync(CONFIG.PRODUCTS_JSON)) {
    console.error(`❌ Fichier non trouvé: ${CONFIG.PRODUCTS_JSON}`);
    console.log('   Lance d\'abord update-json.ts');
    process.exit(1);
  }
  
  const products: Product[] = JSON.parse(fs.readFileSync(CONFIG.PRODUCTS_JSON, 'utf-8'));
  
  // Filtre les produits avec image_url
  const productsWithImages = products.filter(p => p.image_url && p.image_url.length > 0);
  console.log(`📦 ${productsWithImages.length} produits avec images à synchroniser\n`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors: { slug: string; error: string }[] = [];
  
  // Traite par batches
  const batches = [];
  for (let i = 0; i < productsWithImages.length; i += CONFIG.BATCH_SIZE) {
    batches.push(productsWithImages.slice(i, i + CONFIG.BATCH_SIZE));
  }
  
  console.log(`📦 ${batches.length} batches de ${CONFIG.BATCH_SIZE} produits\n`);
  
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`[Batch ${i + 1}/${batches.length}] Traitement de ${batch.length} produits...`);
    
    const results = await Promise.all(batch.map(updateProduct));
    
    for (let j = 0; j < results.length; j++) {
      if (results[j].success) {
        successCount++;
      } else {
        errorCount++;
        errors.push({
          slug: batch[j].slug,
          error: results[j].error || 'Erreur inconnue',
        });
      }
    }
    
    console.log(`  ✅ ${results.filter(r => r.success).length} OK | ❌ ${results.filter(r => !r.success).length} erreurs`);
    
    if (i < batches.length - 1) {
      await sleep(CONFIG.DELAY_MS);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`  ✅ Succès:   ${successCount}`);
  console.log(`  ❌ Erreurs:  ${errorCount}`);
  
  if (errors.length > 0 && errors.length <= 20) {
    console.log('\n  Erreurs détaillées:');
    for (const err of errors) {
      console.log(`    - ${err.slug}: ${err.error}`);
    }
  } else if (errors.length > 20) {
    console.log(`\n  (${errors.length} erreurs - voir sync-errors.json pour détails)`);
    fs.writeFileSync('./sync-errors.json', JSON.stringify(errors, null, 2));
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('✅ SYNCHRONISATION TERMINÉE');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('Vérifie ton site sur http://localhost:3000/boutique');
  console.log('');
}

main().catch(console.error);
