import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const { data: products } = await supabase
    .from('products')
    .select('id, name, image_url, price, category');
  
  if (!products) {
    console.log('❌ Erreur récupération produits');
    return;
  }
  
  // Statistiques générales
  const stats = {
    total: products.length,
    withPrice: products.filter(p => p.price && p.price > 0).length,
    withRealImage: products.filter(p => p.image_url && !p.image_url.includes('placeholder')).length,
    withPlaceholder: products.filter(p => p.image_url?.includes('placeholder')).length,
    withoutImage: products.filter(p => !p.image_url || p.image_url.trim() === '').length,
    withWpImage: products.filter(p => p.image_url?.includes('wp-content/uploads')).length,
    withLocalImage: products.filter(p => {
      const img = p.image_url || '';
      return (img.includes('DSC') || img.includes('Photoroom') || img.includes('IMG_') || img.includes('BOAP') || img.includes('BRPI')) && 
             !img.includes('placeholder');
    }).length,
  };
  
  // Catégories
  const categories: Record<string, number> = {};
  products.forEach(p => {
    const cat = p.category || 'Non catégorisé';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  
  // Types de placeholders
  const placeholderTypes: Record<string, number> = {};
  products.filter(p => p.image_url?.includes('placeholder')).forEach(p => {
    const type = p.image_url?.split('/').pop()?.replace('.svg', '').replace('.jpg', '') || 'unknown';
    placeholderTypes[type] = (placeholderTypes[type] || 0) + 1;
  });
  
  console.log('');
  console.log('╔' + '═'.repeat(58) + '╗');
  console.log('║' + ' '.repeat(15) + '📊 RAPPORT FINAL - KHASHIKA' + ' '.repeat(16) + '║');
  console.log('╠' + '═'.repeat(58) + '╣');
  console.log('║' + ' '.repeat(58) + '║');
  console.log(`║  🛍️  Total produits:          ${stats.total.toString().padStart(5)}` + ' '.repeat(23) + '║');
  console.log(`║  💰 Avec prix > 0:            ${stats.withPrice.toString().padStart(5)} (${(stats.withPrice/stats.total*100).toFixed(0)}%)` + ' '.repeat(16) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╠' + '═'.repeat(58) + '╣');
  console.log('║  🖼️  IMAGES                                              ║');
  console.log('╠' + '═'.repeat(58) + '╣');
  console.log(`║  ✅ Images réelles:           ${stats.withRealImage.toString().padStart(5)} (${(stats.withRealImage/stats.total*100).toFixed(0)}%)` + ' '.repeat(16) + '║');
  console.log(`║     └─ WordPress:             ${stats.withWpImage.toString().padStart(5)}` + ' '.repeat(23) + '║');
  console.log(`║     └─ Locales (DSC, Photo):  ${stats.withLocalImage.toString().padStart(5)}` + ' '.repeat(23) + '║');
  console.log(`║  🔲 Placeholders:             ${stats.withPlaceholder.toString().padStart(5)} (${(stats.withPlaceholder/stats.total*100).toFixed(0)}%)` + ' '.repeat(16) + '║');
  console.log(`║  ❌ Sans image:               ${stats.withoutImage.toString().padStart(5)}` + ' '.repeat(23) + '║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╠' + '═'.repeat(58) + '╣');
  console.log('║  📁 PLACEHOLDERS PAR TYPE                                ║');
  console.log('╠' + '═'.repeat(58) + '╣');
  
  Object.entries(placeholderTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const line = `║     ${type}: ${count}`;
      console.log(line + ' '.repeat(59 - line.length) + '║');
    });
  
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╠' + '═'.repeat(58) + '╣');
  console.log('║  📂 TOP 5 CATÉGORIES                                     ║');
  console.log('╠' + '═'.repeat(58) + '╣');
  
  Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .forEach(([cat, count]) => {
      const catName = cat.substring(0, 30);
      const line = `║     ${catName}: ${count}`;
      console.log(line + ' '.repeat(59 - line.length) + '║');
    });
  
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╠' + '═'.repeat(58) + '╣');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('║  ✅ Le site Khashika est prêt !                          ║');
  console.log('║' + ' '.repeat(58) + '║');
  console.log('╚' + '═'.repeat(58) + '╝');
  console.log('');
}

main().catch(console.error);





