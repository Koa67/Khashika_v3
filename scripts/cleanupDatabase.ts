import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isDryRun = process.argv.includes('--dry-run');

// Noms de pages de catégorie/pierres (pas de vrais produits)
const CATEGORY_PAGE_NAMES = [
  'Bijoux d\'Inde et ethniques. Accessoires de mode.',
  'Les nouveaux bijoux et accessoires indiens de la boutique',
];

// Pages de pierres (fiches informatives, pas des produits)
const STONE_PAGE_PATTERNS = [
  /^Rubis$/i, /^Saphir$/i, /^Émeraude$/i, /^Emeraude$/i, /^Grenat$/i,
  /^Onyx$/i, /^Turquoise$/i, /^Jade$/i, /^Améthyste$/i, /^Amethyste$/i,
  /^Topaze$/i, /^Perle$/i, /^Corail$/i, /^Citrine$/i, /^Agate$/i,
  /^Jaspe$/i, /^Moonstone$/i, /^Pierre de lune$/i, /^Labradorite$/i,
  /^Malachite$/i, /^Péridot$/i, /^Peridot$/i, /^Quartz$/i, /^Quartz rose$/i,
  /^Howlite$/i, /^Apatite$/i, /^Lapis-lazuli$/i, /^Lapis lazuli$/i,
  /^Aventurine$/i, /^Oeil de tigre$/i, /^Œil de tigre$/i, /^Cornaline$/i,
  /^Onacre$/i, /^Glass stone$/i, /^Multi-Stone$/i, /^Sand Stone$/i,
  /^Calcédoine$/i, /^Obsidienne$/i, /^Amazonite$/i, /^Rhodonite$/i,
  /^Aigue Marine$/i, /^Aigue-Marine$/i,
];

// Pages de catégorie
const CATEGORY_PAGE_PATTERNS = [
  /^Bagues$/i, /^Colliers$/i, /^Bracelets$/i, /^Pendentifs$/i,
  /^Boucles$/i, /^Chaînes$/i, /^Chaines$/i, /^Accessoires$/i,
  /^Bijoux$/i, /^Clous$/i, /^Créoles$/i,
  /^Bagues avec pierre$/i, /^Bagues sans pierre$/i,
  /^Boucles avec pierre$/i, /^Boucles sans pierre$/i,
  /^Colliers avec pierre$/i, /^Colliers sans pierre$/i,
  /^Bracelets avec pierre$/i, /^Bracelets sans pierre$/i,
  /^Pendentifs avec pierre$/i, /^Pendentifs sans pierre$/i,
  /^Chaines cheville$/i, /^Chaines cheville argent$/i,
  /^Chaines cheville fantaisie$/i,
  /^Bagues fantaisie$/i, /^Bracelets fantaisie$/i,
  /^Colliers fantaisie$/i, /^Pendentifs fantaisie$/i,
  /^Clous d'oreilles$/i,
  /^Pashminas indiens$/i, /^Foulards  indiens$/i, /^Pochettes  indiennes$/i,
  /^Sacs  indiens$/i, /^Soie  inde$/i,
];

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('NETTOYAGE DE LA BASE DE DONNÉES');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}\n`);
  
  // Récupérer tous les produits
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, image_url, price');
  
  if (error || !products) {
    console.error('❌ Erreur:', error?.message);
    return;
  }
  
  console.log(`📦 Total produits: ${products.length}\n`);
  
  // 1. Trouver les doublons "Bijoux d'Inde..."
  const bijouxDinde = products.filter(p => 
    CATEGORY_PAGE_NAMES.some(name => p.name.includes(name))
  );
  
  console.log('--- ÉTAPE 1: Entrées "Bijoux d\'Inde..." ---');
  console.log(`Trouvées: ${bijouxDinde.length}`);
  
  // Garder la première, supprimer les autres
  const bijouxDindeToDelete = bijouxDinde.slice(1);
  console.log(`À supprimer: ${bijouxDindeToDelete.length}`);
  
  // 2. Trouver les pages de pierres
  const stonePages = products.filter(p => 
    STONE_PAGE_PATTERNS.some(pattern => pattern.test(p.name.trim()))
  );
  
  console.log('\n--- ÉTAPE 2: Pages de pierres (fiches info) ---');
  console.log(`Trouvées: ${stonePages.length}`);
  stonePages.slice(0, 10).forEach(p => console.log(`  - ${p.name}`));
  if (stonePages.length > 10) console.log(`  ... et ${stonePages.length - 10} autres`);
  
  // 3. Trouver les pages de catégorie
  const categoryPages = products.filter(p => 
    CATEGORY_PAGE_PATTERNS.some(pattern => pattern.test(p.name.trim())) &&
    (p.price === 0 || p.price === null)
  );
  
  console.log('\n--- ÉTAPE 3: Pages de catégorie ---');
  console.log(`Trouvées: ${categoryPages.length}`);
  categoryPages.slice(0, 10).forEach(p => console.log(`  - ${p.name}`));
  if (categoryPages.length > 10) console.log(`  ... et ${categoryPages.length - 10} autres`);
  
  // Combiner toutes les entrées à supprimer
  const allToDelete = new Map<string, any>();
  
  bijouxDindeToDelete.forEach(p => allToDelete.set(p.id, { ...p, reason: 'duplicate_bijoux_dinde' }));
  stonePages.forEach(p => allToDelete.set(p.id, { ...p, reason: 'stone_info_page' }));
  categoryPages.forEach(p => allToDelete.set(p.id, { ...p, reason: 'category_page' }));
  
  const toDeleteList = [...allToDelete.values()];
  
  console.log('\n' + '='.repeat(60));
  console.log(`TOTAL À SUPPRIMER: ${toDeleteList.length} entrées`);
  console.log('='.repeat(60));
  
  // Résumé par raison
  const byReason: Record<string, number> = {};
  toDeleteList.forEach(p => {
    byReason[p.reason] = (byReason[p.reason] || 0) + 1;
  });
  Object.entries(byReason).forEach(([reason, count]) => {
    console.log(`  - ${reason}: ${count}`);
  });
  
  if (!isDryRun && toDeleteList.length > 0) {
    console.log('\n🗑️ Suppression en cours...');
    
    const ids = toDeleteList.map(p => p.id);
    
    // Supprimer par lots de 50
    for (let i = 0; i < ids.length; i += 50) {
      const batch = ids.slice(i, i + 50);
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .in('id', batch);
      
      if (deleteError) {
        console.log(`❌ Erreur lot ${i}-${i + batch.length}: ${deleteError.message}`);
      } else {
        console.log(`✅ Supprimé lot ${i + 1}-${i + batch.length}`);
      }
    }
    
    console.log(`\n✅ ${toDeleteList.length} entrées supprimées`);
  } else if (isDryRun) {
    console.log('\n[DRY-RUN] Aucune suppression effectuée');
  }
  
  // Vérification finale
  if (!isDryRun) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    console.log(`\n📦 Produits restants: ${count}`);
  }
}

main().catch(console.error);





