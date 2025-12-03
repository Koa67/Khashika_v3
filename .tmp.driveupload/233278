/**
 * 🔄 MISE À JOUR DU JSON AVEC LES IMAGES EXTRAITES
 * 
 * Ce script lit le dernier rapport d'extraction et met à jour
 * products-ultimate.json avec les chemins d'images corrects.
 * 
 * USAGE:
 *   npx tsx update-json.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const CONFIG = {
  PRODUCTS_JSON: './products-ultimate.json',
  REPORTS_DIR: './reports',
  OUTPUT_JSON: './products-updated.json',
  // Préfixe pour les URLs d'images dans le JSON
  IMAGE_PREFIX: '/images/products/',
};

interface Product {
  id?: string;
  name: string;
  slug: string;
  price?: number;
  category?: string;
  images?: string[];
  image?: string;
  image_url?: string;
  original_url?: string;
  [key: string]: any;
}

interface ExtractionResult {
  slug: string;
  productName: string;
  success: boolean;
  imageUrl?: string;
  localPath?: string;
  altText?: string;
  confidence: string;
}

interface Report {
  timestamp: string;
  results: ExtractionResult[];
}

function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🔄 MISE À JOUR DU JSON AVEC LES IMAGES EXTRAITES');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Trouve le dernier rapport
  if (!fs.existsSync(CONFIG.REPORTS_DIR)) {
    console.error('❌ Dossier reports/ non trouvé. Lance d\'abord extract-images-bulletproof.ts');
    process.exit(1);
  }
  
  const reportFiles = fs.readdirSync(CONFIG.REPORTS_DIR)
    .filter(f => f.startsWith('extraction-') && f.endsWith('.json'))
    .sort()
    .reverse();
  
  if (reportFiles.length === 0) {
    console.error('❌ Aucun rapport trouvé. Lance d\'abord extract-images-bulletproof.ts');
    process.exit(1);
  }
  
  const latestReportPath = path.join(CONFIG.REPORTS_DIR, reportFiles[0]);
  console.log(`📋 Rapport utilisé: ${latestReportPath}\n`);
  
  // Charge le rapport
  const report: Report = JSON.parse(fs.readFileSync(latestReportPath, 'utf-8'));
  
  // Crée un index slug -> result
  const resultsBySlug = new Map<string, ExtractionResult>();
  for (const result of report.results) {
    if (result.success && result.localPath) {
      resultsBySlug.set(result.slug, result);
    }
  }
  
  console.log(`✅ ${resultsBySlug.size} images réussies dans le rapport\n`);
  
  // Charge les produits
  if (!fs.existsSync(CONFIG.PRODUCTS_JSON)) {
    console.error(`❌ Fichier non trouvé: ${CONFIG.PRODUCTS_JSON}`);
    process.exit(1);
  }
  
  const products: Product[] = JSON.parse(fs.readFileSync(CONFIG.PRODUCTS_JSON, 'utf-8'));
  console.log(`📦 ${products.length} produits dans le JSON\n`);
  
  // Met à jour les produits
  let updatedCount = 0;
  let skippedCount = 0;
  let notFoundCount = 0;
  
  const updatedProducts = products.map(product => {
    const result = resultsBySlug.get(product.slug);
    
    if (!result) {
      notFoundCount++;
      return product;
    }
    
    // Détermine le nom du fichier image
    const ext = path.extname(result.localPath!);
    const imageFileName = `${product.slug}${ext}`;
    const imagePath = `${CONFIG.IMAGE_PREFIX}${imageFileName}`;
    
    // Vérifie si le produit a déjà une image correcte
    if (product.image_url === imagePath || product.image === imagePath) {
      skippedCount++;
      return product;
    }
    
    updatedCount++;
    
    return {
      ...product,
      image: imagePath,
      image_url: imagePath,
      images: [imagePath],
      _extraction_confidence: result.confidence,
      _extraction_date: new Date().toISOString(),
    };
  });
  
  // Sauvegarde le nouveau JSON
  fs.writeFileSync(CONFIG.OUTPUT_JSON, JSON.stringify(updatedProducts, null, 2));
  
  // Backup de l'ancien JSON
  const backupPath = `./products-ultimate.backup-${Date.now()}.json`;
  fs.copyFileSync(CONFIG.PRODUCTS_JSON, backupPath);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`  ✅ Mis à jour:     ${updatedCount}`);
  console.log(`  ⏭️  Déjà OK:        ${skippedCount}`);
  console.log(`  ❓ Non trouvés:    ${notFoundCount}`);
  console.log('');
  console.log(`  📄 Nouveau JSON:   ${CONFIG.OUTPUT_JSON}`);
  console.log(`  💾 Backup:         ${backupPath}`);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📝 PROCHAINES ÉTAPES');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('1. Vérifie products-updated.json');
  console.log('2. Si OK, remplace products-ultimate.json:');
  console.log('   mv products-updated.json products-ultimate.json');
  console.log('3. Copie les images dans ton projet:');
  console.log('   cp -r extracted-images/* /chemin/vers/khashika/public/images/products/');
  console.log('4. Lance sync-supabase.ts pour mettre à jour la base');
  console.log('');
}

main();
