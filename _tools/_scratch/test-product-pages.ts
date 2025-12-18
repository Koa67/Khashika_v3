#!/usr/bin/env tsx
/**
 * Script de test des pages produit
 * Vérifie que les produits se chargent correctement et que leurs images sont accessibles
 */

import { getProductBySlug } from '../lib/utils/products';

const TEST_SLUGS = [
  'collier-sur-cordon-avec-une-pierre-naturelle-ronde-en-pierre-de-lune', // Image pierre blacklistée (avant fix)
  'bracelet-en-cuire-avec-une-pierre-en-turquoise', // Image dans products_reconciled (avant consolidation)
  'boucles-doreilles-rondes-en-argent-filigrane-et-pierre-de-lune', // Image dupliquée
  'bracelet-argent-avec-de-grandes-pierres-ovales-en-pierre-de-lune', // Image dans products_reconciled
  'bague-argent-filigrane-pierre-smoky-quartz', // Test général
];

async function testProductPage(slug: string) {
  console.log(`\n🔍 Test: ${slug}`);
  console.log('─'.repeat(60));

  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      console.log(`❌ ERREUR: Produit introuvable (404)`);
      return false;
    }

    console.log(`✅ Produit trouvé: ${product.name}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Prix: ${product.price > 0 ? product.price + ' €' : 'Prix sur demande'}`);

    // Vérifier les images
    if (!product.images || product.images.length === 0) {
      console.log(`⚠️  Aucune image disponible`);
      return true; // Pas une erreur critique
    }

    console.log(`   Images (${product.images.length}):`);
    product.images.forEach((img, i) => {
      const isPlaceholder = img.includes('placeholder');
      const isReconciled = img.includes('products_reconciled');
      const status = isPlaceholder ? '📋' : isReconciled ? '⚠️ ' : '✅';
      console.log(`      ${status} [${i + 1}] ${img}`);
    });

    // Vérifier l'image principale
    const mainImage = product.image_url || product.image || product.images[0];
    if (mainImage.includes('placeholder')) {
      console.log(`⚠️  Image principale est un placeholder`);
    } else if (mainImage.includes('products_reconciled')) {
      console.log(`❌ ERREUR: Image principale dans products_reconciled (non consolidée)`);
      return false;
    } else {
      console.log(`✅ Image principale OK: ${mainImage}`);
    }

    return true;
  } catch (error) {
    console.log(`❌ ERREUR: ${error}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Test des pages produit - Démarrage\n');
  console.log(`📋 ${TEST_SLUGS.length} produits à tester\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const slug of TEST_SLUGS) {
    const success = await testProductPage(slug);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log('\n' + '═'.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS\n');
  console.log(`   ✅ Réussis: ${successCount}/${TEST_SLUGS.length}`);
  console.log(`   ❌ Échoués: ${failureCount}/${TEST_SLUGS.length}`);
  console.log('═'.repeat(60));

  if (failureCount > 0) {
    console.log('\n❌ Certains tests ont échoué\n');
    process.exit(1);
  } else {
    console.log('\n✅ Tous les tests sont passés!\n');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('❌ Erreur:', err);
  process.exit(1);
});



