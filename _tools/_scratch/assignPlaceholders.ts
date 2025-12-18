import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isDryRun = process.argv.includes('--dry-run');

// Images de catégorie génériques à remplacer
const BAD_IMAGES = [
  'boucles-doreilles-fantaisie.jpg',
  'bracelets.jpeg',
  'bracelets.jpg',
  'colliers.jpeg',
  'colliers.jpg',
  'pendentifs.jpeg',
  'bagues.jpeg',
  'chaines.jpeg',
  'chaine.jpg',
  'logo-khashika-200x52.png',
  'bijoux-d-inde-et-ethniques-accessoires-de-mode.jpeg',
  'bijoux-d-inde-et-ethniques-accessoires-de-mode.jpg',
  'Image Manquante',
  'agate.jpg',
  'pierre-de-lune.jpg',
  'lapis-lazuli.jpg',
  'corail.jpg',
  'quartz-rose.jpg',
  'amethyste.jpg',
  'oeil-du-tigre.jpg',
  'onyx.jpg',
  'turquoise.jpg',
  'cornaline.jpg',
  'malachite.jpg',
  'labradorite.jpg',
  'grenat.jpg',
  'citrine.jpg',
  'jade.jpg',
  'peridot.jpg',
  'topaze.jpg',
];

// Placeholders par catégorie de produit
const PLACEHOLDERS: Record<string, string> = {
  bague: '/images/products/placeholder-bague.jpg',
  boucle: '/images/products/placeholder-boucles.jpg',
  oreille: '/images/products/placeholder-boucles.jpg',
  collier: '/images/products/placeholder-collier.jpg',
  pendentif: '/images/products/placeholder-pendentif.jpg',
  bracelet: '/images/products/placeholder-bracelet.jpg',
  chaine: '/images/products/placeholder-chaine.jpg',
  cheville: '/images/products/placeholder-chaine.jpg',
  foulard: '/images/products/placeholder-accessoire.jpg',
  pashmina: '/images/products/placeholder-accessoire.jpg',
  etole: '/images/products/placeholder-accessoire.jpg',
  echarpe: '/images/products/placeholder-accessoire.jpg',
  sac: '/images/products/placeholder-accessoire.jpg',
  pochette: '/images/products/placeholder-accessoire.jpg',
  trousse: '/images/products/placeholder-accessoire.jpg',
  'porte-cle': '/images/products/placeholder-accessoire.jpg',
  default: '/placeholder-image.svg',
};

function getPlaceholder(name: string): string {
  const nameLower = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  for (const [keyword, placeholder] of Object.entries(PLACEHOLDERS)) {
    if (keyword !== 'default' && nameLower.includes(keyword)) {
      return placeholder;
    }
  }
  
  return PLACEHOLDERS.default;
}

function hasBadImage(imageUrl: string | null): boolean {
  if (!imageUrl) return true;
  if (imageUrl.trim() === '') return true;
  
  const filename = imageUrl.split('/').pop()?.toLowerCase() || '';
  return BAD_IMAGES.some(bad => filename.includes(bad.toLowerCase()));
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('ASSIGNATION DES PLACEHOLDERS PAR CATÉGORIE');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}\n`);
  
  // Récupérer tous les produits
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, image_url');
  
  if (error || !products) {
    console.error('❌ Erreur:', error?.message);
    return;
  }
  
  // Trouver les produits avec des mauvaises images
  const toFix = products.filter(p => hasBadImage(p.image_url));
  
  console.log(`📦 Total produits: ${products.length}`);
  console.log(`🔧 Produits avec mauvaises images: ${toFix.length}\n`);
  
  // Compter par catégorie
  const byCategoryCount: Record<string, number> = {};
  toFix.forEach(p => {
    const placeholder = getPlaceholder(p.name);
    const category = placeholder.split('/').pop()?.replace('.jpg', '').replace('.svg', '') || 'default';
    byCategoryCount[category] = (byCategoryCount[category] || 0) + 1;
  });
  
  console.log('Répartition par catégorie:');
  Object.entries(byCategoryCount)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => console.log(`  - ${cat}: ${count}`));
  
  console.log('');
  
  if (!isDryRun) {
    let updated = 0;
    
    for (const p of toFix) {
      const placeholder = getPlaceholder(p.name);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: placeholder })
        .eq('id', p.id);
      
      if (!updateError) {
        updated++;
      }
    }
    
    console.log(`✅ ${updated} produits mis à jour avec des placeholders`);
  } else {
    console.log(`[DRY-RUN] ${toFix.length} produits seraient mis à jour`);
    
    // Montrer quelques exemples
    console.log('\nExemples:');
    toFix.slice(0, 10).forEach(p => {
      const placeholder = getPlaceholder(p.name);
      console.log(`  "${p.name.substring(0, 40)}..." → ${placeholder.split('/').pop()}`);
    });
  }
}

main().catch(console.error);





