import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function generateReport() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  const { data: products } = await supabase
    .from('products')
    .select('*');
  
  if (!products) return;
  
  const stats = {
    total: products.length,
    withImages: 0,
    withoutImages: 0,
    totalImages: 0,
    bySource: {
      wordpress: 0,
      dsc: 0,
      photoroom: 0,
      other: 0,
    }
  };
  
  products.forEach(p => {
    const images = p.images || [];
    const allImages = [...images, p.image, p.image_url].filter(Boolean);
    
    // Remove duplicates
    const uniqueImages = [...new Set(allImages)];
    
    if (uniqueImages.length > 0) {
      stats.withImages++;
      stats.totalImages += uniqueImages.length;
      
      uniqueImages.forEach((img: string) => {
        if (img.includes('wp-content/uploads')) stats.bySource.wordpress++;
        else if (img.includes('DSC')) stats.bySource.dsc++;
        else if (img.includes('Photoroom')) stats.bySource.photoroom++;
        else stats.bySource.other++;
      });
    } else {
      stats.withoutImages++;
    }
  });
  
  console.log('='.repeat(60));
  console.log('📊 RAPPORT FINAL - CORRECTION IMAGES KHASHIKA');
  console.log('='.repeat(60));
  console.log(`\nDate: ${new Date().toLocaleString('fr-FR')}\n`);
  console.log(`Total produits: ${stats.total}`);
  console.log(`✅ Avec images: ${stats.withImages} (${(stats.withImages/stats.total*100).toFixed(1)}%)`);
  console.log(`❌ Sans images: ${stats.withoutImages} (${(stats.withoutImages/stats.total*100).toFixed(1)}%)`);
  console.log(`\nTotal images valides: ${stats.totalImages}`);
  console.log(`\nRépartition par source:`);
  console.log(`  - WordPress uploads: ${stats.bySource.wordpress}`);
  console.log(`  - Photos DSC: ${stats.bySource.dsc}`);
  console.log(`  - Photos Photoroom: ${stats.bySource.photoroom}`);
  console.log(`  - Autres: ${stats.bySource.other}`);
  console.log('\n' + '='.repeat(60));
}

generateReport().catch(console.error);





