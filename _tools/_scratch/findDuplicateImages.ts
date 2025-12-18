import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function findDuplicates() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, image_url');
  
  if (!products) return;
  
  // Trouver les images utilisées plusieurs fois
  const imageCount: Record<string, any[]> = {};
  
  products.forEach(p => {
    const img = p.image_url || '';
    if (!img) return; // Ignorer les produits sans image
    if (!imageCount[img]) imageCount[img] = [];
    imageCount[img].push(p);
  });
  
  console.log('='.repeat(60));
  console.log('IMAGES DUPLIQUÉES (utilisées par plusieurs produits)');
  console.log('='.repeat(60));
  
  const duplicates = Object.entries(imageCount)
    .filter(([_, prods]) => prods.length > 1)
    .sort((a, b) => b[1].length - a[1].length);
  
  if (duplicates.length === 0) {
    console.log('\n✅ Aucune image dupliquée trouvée !');
    return;
  }
  
  console.log(`\n⚠️ ${duplicates.length} images utilisées par plusieurs produits:\n`);
  
  duplicates.forEach(([img, prods]) => {
    const filename = img.split('/').pop() || img;
    console.log(`\n📷 ${filename}`);
    console.log(`   Utilisée par ${prods.length} produits:`);
    prods.forEach(p => console.log(`   - [${p.slug}] ${p.name}`));
  });
  
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL: ${duplicates.reduce((sum, [_, p]) => sum + p.length, 0)} produits concernés`);
}

findDuplicates().catch(console.error);





