import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

async function backup() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Variables d\'environnement manquantes!');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('📦 Création du backup...');
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*');
  
  if (error) {
    console.error('Erreur:', error);
    return;
  }
  
  const backup = {
    timestamp: new Date().toISOString(),
    count: products?.length || 0,
    products: products,
  };
  
  const filename = `backup-images-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(backup, null, 2));
  
  console.log(`✅ Backup créé: ${filename}`);
  console.log(`   ${products?.length || 0} produits sauvegardés`);
}

backup().catch(console.error);





