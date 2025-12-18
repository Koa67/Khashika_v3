import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(50));
  console.log('MISE À JOUR DES EXTENSIONS PLACEHOLDER');
  console.log('='.repeat(50));
  
  const { data: products } = await supabase
    .from('products')
    .select('id, image_url')
    .like('image_url', '%placeholder%');
  
  if (!products) {
    console.log('❌ Aucun produit trouvé');
    return;
  }
  
  console.log(`\n📦 Produits avec placeholder: ${products.length}\n`);
  
  let updated = 0;
  
  for (const p of products) {
    if (p.image_url && p.image_url.includes('.jpg')) {
      const newUrl = p.image_url.replace('.jpg', '.svg');
      const { error } = await supabase
        .from('products')
        .update({ image_url: newUrl })
        .eq('id', p.id);
      
      if (!error) {
        updated++;
      }
    }
  }
  
  console.log(`✅ ${updated} produits mis à jour (.jpg → .svg)`);
  
  // Vérification
  const { data: check } = await supabase
    .from('products')
    .select('image_url')
    .like('image_url', '%placeholder%.svg');
  
  console.log(`\n📊 Produits avec .svg: ${check?.length || 0}`);
}

main().catch(console.error);





