#!/usr/bin/env tsx
/**
 * Script de consolidation des images
 * Déplace toutes les images de products_reconciled/ vers products/
 * Et met à jour products-ultimate.json en conséquence
 */

import fs from 'fs';
import path from 'path';

const SOURCE_DIR = path.join(process.cwd(), 'public/images/products_reconciled');
const TARGET_DIR = path.join(process.cwd(), 'public/images/products');
const PRODUCTS_JSON = path.join(process.cwd(), 'lib/data/products-ultimate.json');

interface Product {
  id: string;
  slug: string;
  name: string;
  images: string[];
  image?: string;
  image_url?: string;
  [key: string]: any;
}

async function main() {
  console.log('🚀 Consolidation des images - Démarrage\n');

  // 1. Vérifier que les dossiers existent
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`❌ Dossier source introuvable: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(TARGET_DIR)) {
    console.error(`❌ Dossier cible introuvable: ${TARGET_DIR}`);
    process.exit(1);
  }

  // 2. Lister les fichiers à déplacer
  const files = fs.readdirSync(SOURCE_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
  });

  console.log(`📦 ${files.length} images trouvées dans products_reconciled/\n`);

  // 3. Déplacer les images (avec gestion des conflits)
  let movedCount = 0;
  let skippedCount = 0;
  const conflicts: string[] = [];

  for (const file of files) {
    const sourcePath = path.join(SOURCE_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);

    // Vérifier si le fichier existe déjà dans la cible
    if (fs.existsSync(targetPath)) {
      // Comparer les tailles pour détecter les doublons exacts
      const sourceStats = fs.statSync(sourcePath);
      const targetStats = fs.statSync(targetPath);

      if (sourceStats.size === targetStats.size) {
        // Même taille = probablement le même fichier, on skip
        skippedCount++;
        console.log(`⏭️  Skipped (duplicate): ${file}`);
      } else {
        // Tailles différentes = conflit, on renomme
        const baseName = path.basename(file, path.extname(file));
        const ext = path.extname(file);
        const newName = `${baseName}_reconciled${ext}`;
        const newTargetPath = path.join(TARGET_DIR, newName);
        
        fs.copyFileSync(sourcePath, newTargetPath);
        conflicts.push(`${file} → ${newName}`);
        movedCount++;
        console.log(`⚠️  Conflict resolved: ${file} → ${newName}`);
      }
    } else {
      // Pas de conflit, déplacement simple
      fs.copyFileSync(sourcePath, targetPath);
      movedCount++;
      console.log(`✅ Moved: ${file}`);
    }
  }

  console.log(`\n📊 Résumé du déplacement:`);
  console.log(`   - Images déplacées: ${movedCount}`);
  console.log(`   - Images skippées (doublons): ${skippedCount}`);
  console.log(`   - Conflits résolus: ${conflicts.length}\n`);

  if (conflicts.length > 0) {
    console.log(`⚠️  Fichiers renommés (conflits):`);
    conflicts.forEach(c => console.log(`   - ${c}`));
    console.log('');
  }

  // 4. Mettre à jour products-ultimate.json
  console.log('📝 Mise à jour de products-ultimate.json...\n');

  const productsData = JSON.parse(fs.readFileSync(PRODUCTS_JSON, 'utf-8'));
  let updatedCount = 0;

  const updatedProducts = productsData.map((product: Product) => {
    let hasChanges = false;

    // Mettre à jour le tableau images
    if (product.images && Array.isArray(product.images)) {
      product.images = product.images.map((img: string) => {
        if (img.includes('/images/products_reconciled/')) {
          hasChanges = true;
          return img.replace('/images/products_reconciled/', '/images/products/');
        }
        return img;
      });
    }

    // Mettre à jour image_url
    if (product.image_url && product.image_url.includes('/images/products_reconciled/')) {
      product.image_url = product.image_url.replace('/images/products_reconciled/', '/images/products/');
      hasChanges = true;
    }

    // Mettre à jour image
    if (product.image && product.image.includes('/images/products_reconciled/')) {
      product.image = product.image.replace('/images/products_reconciled/', '/images/products/');
      hasChanges = true;
    }

    if (hasChanges) updatedCount++;
    return product;
  });

  // 5. Sauvegarder le backup et le nouveau JSON
  const backupPath = PRODUCTS_JSON + `.backup-consolidation-${Date.now()}`;
  fs.copyFileSync(PRODUCTS_JSON, backupPath);
  console.log(`💾 Backup créé: ${path.basename(backupPath)}`);

  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(updatedProducts, null, 2), 'utf-8');
  console.log(`✅ products-ultimate.json mis à jour (${updatedCount} produits modifiés)\n`);

  // 6. Résumé final
  console.log('✨ Consolidation terminée avec succès!\n');
  console.log('📋 Prochaines étapes:');
  console.log('   1. Vérifier que les images s\'affichent correctement');
  console.log('   2. Tester quelques pages produit');
  console.log('   3. Si tout fonctionne, supprimer products_reconciled/');
  console.log('   4. Committer les changements\n');
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});



