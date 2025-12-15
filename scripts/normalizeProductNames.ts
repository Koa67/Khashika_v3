import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const isDryRun = process.argv.includes('--dry-run');

// Mots à garder en minuscules (articles, prépositions, conjonctions, déterminants)
const LOWERCASE_WORDS = new Set([
  'de', 'du', 'des', 'd', 'le', 'la', 'les', 'un', 'une',
  'et', 'ou', 'à', 'au', 'aux', 'en', 'avec', 'sans', 'pour',
  'sur', 'sous', 'par', 'dans', 'entre', 'parmi',
  'son', 'sa', 'ses', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes',
  'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
]);

// Mots spéciaux à garder en majuscule (acronymes, marques)
const UPPERCASE_WORDS = new Set([
  'ARGENT', 'DSC', 'IMG', 'BOAP', 'BRPI', 'AUM', 'CGV',
]);

function capitalizeWord(word: string): string {
  if (!word) return word;
  
  const upperWord = word.toUpperCase();
  
  // Si c'est un mot spécial exact (pas un mot qui contient le mot spécial)
  // Ex: "ARGENT" → "ARGENT", mais "ARGENTéE" → "Argentée"
  if (UPPERCASE_WORDS.has(upperWord) && word.length === upperWord.length) {
    return word.toUpperCase();
  }
  
  // Première lettre en majuscule, reste en minuscule
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function normalizeProductName(name: string): string {
  if (!name) return name;
  
  // Nettoyer les espaces multiples
  let cleaned = name.trim().replace(/\s+/g, ' ');
  
  // Séparer en mots en préservant les espaces
  const tokens = cleaned.split(/(\s+)/);
  
  const normalized: string[] = [];
  let isFirstWord = true;
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    
    // Si c'est un espace, le garder tel quel
    if (/^\s+$/.test(token)) {
      normalized.push(token);
      continue;
    }
    
    // Traiter le mot avec ses caractères spéciaux
    // Exemples: "d'oreilles", "vert/blanc", "100%", "lapis-lazuli", "Améthyste"
    
    // Séparer en parties en préservant les apostrophes, traits d'union et slashes
    // Utiliser une regex qui capture les mots (avec accents) et la ponctuation
    const parts = token.match(/([a-zA-ZÀ-ÿ]+|['\-/]|[^\w\s])/g) || [];
    const processedParts: string[] = [];
    
    for (let j = 0; j < parts.length; j++) {
      const part = parts[j];
      
      // Si c'est une apostrophe, un trait d'union ou un slash, le garder tel quel
      if (part === "'" || part === "-" || part === "/") {
        processedParts.push(part);
        continue;
      }
      
      // Si c'est un caractère spécial (%, ., etc.), le garder tel quel
      if (!/^[a-zA-ZÀ-ÿ]+$/.test(part)) {
        processedParts.push(part);
        continue;
      }
      
      // Traiter les lettres (avec accents)
      const lowerPart = part.toLowerCase();
      
      let processed: string;
      
      if (isFirstWord) {
        // Premier mot : toujours capitaliser (gérer les accents)
        processed = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        isFirstWord = false;
      } else if (LOWERCASE_WORDS.has(lowerPart)) {
        // Mots en minuscules (articles, prépositions)
        processed = lowerPart;
      } else {
        // Autres mots : capitaliser (gérer les accents)
        processed = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      }
      
      processedParts.push(processed);
    }
    
    normalized.push(processedParts.join(''));
  }
  
  return normalized.join('').trim();
}

async function main() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  console.log('='.repeat(60));
  console.log('NORMALISATION DES NOMS DE PRODUITS');
  console.log('='.repeat(60));
  console.log(`Mode: ${isDryRun ? 'DRY-RUN' : 'RÉEL'}\n`);
  
  // Récupérer tous les produits
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name');
  
  if (error || !products) {
    console.error('❌ Erreur:', error?.message);
    return;
  }
  
  console.log(`📦 Total produits: ${products.length}\n`);
  
  // Normaliser les noms
  const updates: Array<{ id: string; oldName: string; newName: string }> = [];
  
  for (const product of products) {
    const normalized = normalizeProductName(product.name);
    
    if (normalized !== product.name) {
      updates.push({
        id: product.id,
        oldName: product.name,
        newName: normalized,
      });
    }
  }
  
  console.log(`🔧 Produits à mettre à jour: ${updates.length}\n`);
  
  if (updates.length === 0) {
    console.log('✅ Tous les noms sont déjà normalisés !');
    return;
  }
  
  // Afficher quelques exemples
  console.log('Exemples de modifications:');
  updates.slice(0, 10).forEach(({ oldName, newName }) => {
    console.log(`  "${oldName.substring(0, 50)}"`);
    console.log(`  → "${newName.substring(0, 50)}"`);
    console.log('');
  });
  
  if (updates.length > 10) {
    console.log(`  ... et ${updates.length - 10} autres\n`);
  }
  
  if (!isDryRun) {
    console.log('💾 Mise à jour en cours...\n');
    
    let success = 0;
    let errors = 0;
    
    // Mettre à jour par lots de 50
    for (let i = 0; i < updates.length; i += 50) {
      const batch = updates.slice(i, i + 50);
      
      for (const update of batch) {
        const { error: updateError } = await supabase
          .from('products')
          .update({ name: update.newName })
          .eq('id', update.id);
        
        if (updateError) {
          console.error(`❌ Erreur [${update.id}]: ${updateError.message}`);
          errors++;
        } else {
          success++;
        }
      }
      
      console.log(`✅ Lot ${i + 1}-${Math.min(i + 1 + 50, updates.length)}: ${success} mis à jour`);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ ${success} produits mis à jour`);
    if (errors > 0) {
      console.log(`❌ ${errors} erreurs`);
    }
  } else {
    console.log(`[DRY-RUN] ${updates.length} produits seraient mis à jour`);
  }
}

main().catch(console.error);





