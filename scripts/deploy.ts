import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Script de déploiement autonome pour Supabase
 * Orchestre : Migrations → Seeding → Vérification
 */

console.log('🚀 Démarrage du protocole de déploiement Supabase\n');
console.log('='.repeat(60));

// Étape 1: Vérification des migrations
console.log('\n📦 ÉTAPE 1: Vérification des migrations');
console.log('-'.repeat(60));

const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
const migrationFiles = [
  '01_create_products_table.sql',
  '02_create_cart_items_table.sql',
];

let migrationsOk = true;
for (const file of migrationFiles) {
  const filePath = path.join(migrationsDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} trouvé`);
  } else {
    console.log(`❌ ${file} introuvable`);
    migrationsOk = false;
  }
}

if (!migrationsOk) {
  console.log('\n⚠️  Certaines migrations sont manquantes');
} else {
  console.log('\n✅ Toutes les migrations sont présentes');
  console.log('\n📝 Note: Pour appliquer les migrations, utilisez:');
  console.log('   npx supabase db push');
  console.log('   Ou exécutez-les manuellement dans le dashboard Supabase');
}

// Étape 2: Vérification du CSV de produits
console.log('\n📦 ÉTAPE 2: Vérification du CSV de produits');
console.log('-'.repeat(60));

const csvPath = path.join(process.cwd(), 'products_to_import.csv');
if (fs.existsSync(csvPath)) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  const productCount = lines.length - 1; // -1 pour l'en-tête
  console.log(`✅ CSV trouvé: ${productCount} produits à importer`);
} else {
  console.log(`❌ CSV introuvable: ${csvPath}`);
  console.log('   Exécutez d\'abord: python3 scripts/scrape_products.py');
}

// Étape 3: Exécution du seeding
console.log('\n📦 ÉTAPE 3: Seeding des produits');
console.log('-'.repeat(60));

try {
  console.log('🔄 Exécution de scripts/seed_supabase.py...');
  const seedOutput = execSync('python3 scripts/seed_supabase.py', {
    cwd: process.cwd(),
    encoding: 'utf-8',
    stdio: 'inherit',
  });
  console.log('✅ Seeding terminé');
} catch (error: any) {
  console.log(`⚠️  Erreur lors du seeding: ${error.message}`);
  console.log('   Continuez manuellement si nécessaire');
}

// Étape 4: Vérification de l'API (optionnel)
console.log('\n📦 ÉTAPE 4: Vérification de l\'API (optionnel)');
console.log('-'.repeat(60));

console.log('ℹ️  Pour vérifier l\'API, démarrez le serveur de développement:');
console.log('   npm run dev');
console.log('   Puis testez: curl http://localhost:3000/api/products');

// Résumé final
console.log('\n' + '='.repeat(60));
console.log('✅ Protocole de déploiement terminé');
console.log('='.repeat(60));
console.log('\n📋 Prochaines étapes:');
console.log('   1. Vérifiez que les migrations sont appliquées dans Supabase');
console.log('   2. Vérifiez que les produits sont importés');
console.log('   3. Testez l\'API: npm run dev');
console.log('\n');













