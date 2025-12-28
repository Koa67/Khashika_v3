/**
 * Infère la catégorie d'un produit à partir de son nom
 * Utilisé pour corriger les catégories corrompues dans les données
 * 
 * @param productName - Le nom du produit
 * @returns La catégorie normalisée ou null si aucune correspondance
 */
export function inferCategory(productName: string): string | null {
  if (!productName) return null;
  
  const name = productName.toLowerCase().trim();
  
  // Bagues
  if (/\b(bague|ring|anneau)s?\b/i.test(name)) {
    return 'bague';
  }
  
  // Bracelets
  if (/\b(bracelet|jonc|manchette|chaînette)s?\b/i.test(name)) {
    return 'bracelet';
  }
  
  // Colliers
  if (/\b(collier|necklace|sautoir|ras\s+du\s+cou|chaîne\s+cou)s?\b/i.test(name)) {
    return 'collier';
  }
  
  // Boucles d'oreilles / Créoles
  if (/\b(boucle|oreille|earring|créole|puce)s?\b/i.test(name) || 
      /\bboucles?\s+d'?oreilles?\b/i.test(name)) {
    return 'boucle';
  }
  
  // Pendentifs
  if (/\b(pendentif|pendant|médaillon)s?\b/i.test(name)) {
    return 'pendentif';
  }
  
  // Chaînes
  if (/\b(chaîne|chain|maille)s?\b/i.test(name) && !/\bchaîne\s+cou\b/i.test(name)) {
    return 'chaine';
  }
  
  // Accessoires (étole, foulard, pashmina)
  if (/\b(étole|foulard|pashmina|châle|écharpe|scarf)s?\b/i.test(name)) {
    return 'accessoire';
  }
  
  // Cheville / Anklet
  if (/\b(cheville|anklet|chaîne\s+cheville)s?\b/i.test(name)) {
    return 'cheville';
  }
  
  // Parures / Sets
  if (/\b(parure|set|ensemble)s?\b/i.test(name)) {
    return 'parure';
  }
  
  return null;
}

