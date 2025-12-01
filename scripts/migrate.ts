import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Chargement des variables d'environnement
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erreur: Variables d\'environnement Supabase manquantes');
  console.error('   Vérifiez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local');
  process.exit(1);
}

// Utiliser le client avec la service role key pour avoir les permissions
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Exécute une requête SQL via l'API REST de Supabase
 */
async function executeSQL(sql: string): Promise<void> {
  try {
    // Méthode 1: Utiliser l'API REST directement pour exécuter du SQL
    // Note: Supabase nécessite une extension ou une fonction RPC pour exécuter du SQL arbitraire
    // On va plutôt utiliser une approche avec des requêtes individuelles
    
    // Pour les migrations complexes, on peut utiliser le client avec des requêtes directes
    // ou utiliser Supabase CLI qui est la méthode recommandée
    
    // Tentative avec l'API REST
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey || '',
        'Authorization': `Bearer ${supabaseServiceKey || ''}`,
      } as HeadersInit,
      body: JSON.stringify({ query: sql }),
    });

    if (!response.ok) {
      // Si la fonction RPC n'existe pas, on essaie une autre méthode
      // On va simplement afficher un avertissement et continuer
      console.warn('⚠️  Impossible d\'exécuter le SQL directement via RPC');
      console.warn('   Utilisez Supabase CLI: supabase db push');
      console.warn('   Ou exécutez les migrations manuellement dans le dashboard Supabase');
      return;
    }
  } catch (error) {
    console.warn('⚠️  Erreur lors de l\'exécution SQL:', error);
    console.warn('   Utilisez Supabase CLI pour les migrations:');
    console.warn('   npx supabase db push');
  }
}

/**
 * Parse le SQL et exécute chaque instruction individuellement via le client
 */
async function runMigrations(): Promise<void> {
  const sqlFiles = [
    '01_create_products_table.sql',
    '02_create_cart_items_table.sql',
  ];

  console.log('🚀 Démarrage des migrations Supabase...\n');

  for (const file of sqlFiles) {
    const filePath = path.join(process.cwd(), 'supabase', 'migrations', file);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Fichier de migration introuvable: ${filePath}`);
      continue;
    }

    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`📄 Lecture: ${file}`);
    
    // Pour les migrations, Supabase CLI est la méthode recommandée
    // Mais on peut vérifier si les tables existent déjà
    try {
      // Vérifier si la table products existe
      if (file.includes('products')) {
        const { data, error } = await supabase
          .from('products')
          .select('id')
          .limit(1);
        
        if (!error) {
          console.log(`✅ Table 'products' existe déjà`);
          continue;
        }
      }
      
      // Vérifier si la table cart_items existe
      if (file.includes('cart_items')) {
        const { data, error } = await supabase
          .from('cart_items')
          .select('id')
          .limit(1);
        
        if (!error) {
          console.log(`✅ Table 'cart_items' existe déjà`);
          continue;
        }
      }
      
      console.log(`⚠️  Pour exécuter cette migration, utilisez:`);
      console.log(`   npx supabase db push`);
      console.log(`   Ou exécutez le SQL manuellement dans le dashboard Supabase\n`);
      
    } catch (error: any) {
      // Si les tables n'existent pas, c'est normal
      if (error?.code === 'PGRST116' || error?.message?.includes('does not exist')) {
        console.log(`ℹ️  Table n'existe pas encore - migration nécessaire`);
        console.log(`   Utilisez: npx supabase db push\n`);
      } else {
        console.error(`❌ Erreur: ${error?.message || error}`);
      }
    }
  }

  console.log('✅ Vérification des migrations terminée');
  console.log('\n📝 Note: Pour exécuter les migrations SQL, utilisez:');
  console.log('   1. Supabase CLI: npx supabase db push');
  console.log('   2. Dashboard Supabase: copiez-collez le SQL dans l\'éditeur SQL');
  console.log('   3. Les migrations sont dans: supabase/migrations/\n');
}

// Exécution
runMigrations().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
