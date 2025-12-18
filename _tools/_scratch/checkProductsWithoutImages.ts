import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function checkMissingImages() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('🔍 Recherche des produits sans images...\n');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error || !products) {
    console.error('Erreur:', error);
    return;
  }
  
  const productsWithoutImages = products.filter(p => {
    const hasImages = (p.images && p.images.length > 0) || p.image || p.image_url;
    return !hasImages;
  });
  
  console.log('='.repeat(60));
  console.log('PRODUITS SANS IMAGES');
  console.log('='.repeat(60));
  console.log(`\nTotal: ${productsWithoutImages.length} produits sans images\n`);
  
  if (productsWithoutImages.length > 0) {
    console.log('Liste des produits à traiter manuellement:\n');
    productsWithoutImages.forEach((p, i) => {
      console.log(`${i + 1}. [ID: ${p.id}] ${p.name}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   URL WordPress: https://www.khashika.com/produit/${p.slug}/`);
      console.log('');
    });
    
    // Sauvegarder la liste
    fs.writeFileSync(
      'produits-sans-images.json',
      JSON.stringify(productsWithoutImages, null, 2)
    );
    console.log('📄 Liste sauvegardée dans: produits-sans-images.json');
  } else {
    console.log('✅ Tous les produits ont au moins une image !');
  }
}

checkMissingImages().catch(console.error);





