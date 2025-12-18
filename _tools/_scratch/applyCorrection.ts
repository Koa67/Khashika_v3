import { createClient } from '@supabase/supabase-js';
import { validateProductImage } from '../lib/imageAssociation';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run');

interface SupabaseProduct {
  id: string;
  slug: string;
  name: string;
  images?: string[] | null;
  image?: string;
  image_url?: string;
}

interface ModificationReport {
  productId: number;
  productName: string;
  productSlug: string;
  removedImages: string[];
  keptImages: string[];
}

async function correctProductImages() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    console.error('   NEXT_PUBLIC_SUPABASE_URL:', SUPABASE_URL ? '✅' : '❌');
    console.error('   SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_KEY ? '✅' : '❌');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('CORRECTION DES ASSOCIATIONS D\'IMAGES - KHASHIKA v2.0');
  if (isDryRun) {
    console.log('🔍 MODE DRY-RUN - Aucune modification ne sera effectuée');
  } else {
    console.log('⚡ MODE PRODUCTION - Les modifications seront appliquées');
  }
  console.log('='.repeat(60));
  
  // Select all columns to be compatible with any schema
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error || !products) {
    console.error('Erreur de connexion Supabase:', error);
    process.exit(1);
  }
  
  console.log(`\n📦 ${products.length} produits trouvés\n`);
  
  let modified = 0;
  let removed = 0;
  let unchanged = 0;
  const reports: ModificationReport[] = [];
  
  for (const product of products) {
    // Collecter toutes les sources d'images possibles
    const allImages = [
      product.image_url,
      product.image,
      ...(product.images || []),
    ].filter(Boolean) as string[];
    
    // Dédupliquer
    const uniqueImages = [...new Set(allImages)];
    
    if (uniqueImages.length === 0) {
      unchanged++;
      continue;
    }
    
    const validImages: string[] = [];
    const removedImages: string[] = [];
    
    for (const img of uniqueImages) {
      const validation = validateProductImage(img);
      if (validation.isValid) {
        // Éviter les doublons dans les images valides
        if (!validImages.includes(img)) {
          validImages.push(img);
        }
      } else {
        removedImages.push(img);
      }
    }
    
    if (removedImages.length > 0) {
      modified++;
      removed += removedImages.length;
      
      const report: ModificationReport = {
        productId: product.id,
        productName: product.name,
        productSlug: product.slug,
        removedImages,
        keptImages: validImages,
      };
      reports.push(report);
      
      console.log(`\n⚠️  "${product.name}" (ID: ${product.id})`);
      console.log(`    Slug: ${product.slug}`);
      console.log(`    Images retirées (${removedImages.length}):`);
      removedImages.forEach(img => console.log(`      ❌ ${img.split('/').pop()}`));
      console.log(`    Images conservées: ${validImages.length}`);
      if (validImages.length > 0) {
        validImages.forEach(img => console.log(`      ✅ ${img.split('/').pop()}`));
      }
      
      if (!isDryRun) {
        // Mettre à jour en base
        const { error: updateError } = await supabase
          .from('products')
          .update({
            images: validImages,
            image: validImages[0] || null,
            image_url: validImages[0] || null,
          })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`    ⛔ Erreur de mise à jour:`, updateError.message);
        } else {
          console.log(`    ✅ Base de données mise à jour`);
        }
      } else {
        console.log(`    🔍 [DRY-RUN] Aucune modification effectuée`);
      }
    } else {
      unchanged++;
    }
  }
  
  // Rapport final
  console.log('\n' + '='.repeat(60));
  console.log('RAPPORT FINAL');
  console.log('='.repeat(60));
  console.log(`📊 Produits analysés:     ${products.length}`);
  console.log(`✏️  Produits modifiés:     ${modified}`);
  console.log(`✅ Produits inchangés:    ${unchanged}`);
  console.log(`🗑️  Images supprimées:     ${removed}`);
  
  if (isDryRun) {
    console.log('\n🔍 MODE DRY-RUN - Aucune modification n\'a été effectuée');
    console.log('   Pour appliquer les modifications, exécutez sans --dry-run');
  } else if (modified > 0) {
    console.log('\n✅ Toutes les modifications ont été appliquées');
  }
  
  // Afficher la liste détaillée des produits modifiés
  if (reports.length > 0) {
    console.log('\n' + '='.repeat(60));
    console.log('LISTE DES PRODUITS MODIFIÉS');
    console.log('='.repeat(60));
    reports.forEach((report, index) => {
      console.log(`\n${index + 1}. ${report.productName}`);
      console.log(`   ID: ${report.productId} | Slug: ${report.productSlug}`);
      console.log(`   Anciennes images retirées: ${report.removedImages.map(i => i.split('/').pop()).join(', ')}`);
      console.log(`   Nouvelles images: ${report.keptImages.length > 0 ? report.keptImages.map(i => i.split('/').pop()).join(', ') : 'AUCUNE'}`);
    });
  }
}

// Exécution
correctProductImages().catch(console.error);





