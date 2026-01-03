// Fonction de recherche fuzzy pour les pierres
// Tolère les fautes de frappe, accents manquants, et variations

/**
 * Normalise une chaîne pour la comparaison
 * - Minuscules
 * - Supprime les accents
 * - Supprime les caractères spéciaux
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime accents
    .replace(/[^a-z0-9]/g, ''); // Garde que alphanum
}

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * (nombre minimum d'opérations pour transformer a en b)
 */
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Vérifie si une chaîne contient une sous-chaîne (fuzzy)
 * Retourne un score de 0 (pas de match) à 100 (match parfait)
 */
export function fuzzyMatch(text: string, query: string): number {
  const normalizedText = normalize(text);
  const normalizedQuery = normalize(query);
  
  // Si la query est vide, pas de match
  if (!normalizedQuery) return 0;
  
  // Match exact = score parfait
  if (normalizedText === normalizedQuery) return 100;
  
  // Contient la query = très bon score
  if (normalizedText.includes(normalizedQuery)) return 90;
  
  // Commence par la query = bon score
  if (normalizedText.startsWith(normalizedQuery)) return 95;
  
  // Query contenue dans un mot du texte
  const words = normalizedText.split(/\s+/);
  for (const word of words) {
    if (word.startsWith(normalizedQuery)) return 85;
    if (word.includes(normalizedQuery)) return 80;
  }
  
  // Fuzzy match avec Levenshtein pour les fautes de frappe
  // Seulement si query assez longue (>=3 chars)
  if (normalizedQuery.length >= 3) {
    // Vérifier chaque mot du texte
    for (const word of words) {
      const distance = levenshtein(word, normalizedQuery);
      const maxLen = Math.max(word.length, normalizedQuery.length);
      const similarity = 1 - distance / maxLen;
      
      // Si similarité > 60%, c'est un match fuzzy
      if (similarity > 0.6) {
        return Math.round(similarity * 70); // Score max 70 pour fuzzy
      }
    }
    
    // Vérifier aussi le texte complet
    const distance = levenshtein(normalizedText, normalizedQuery);
    const maxLen = Math.max(normalizedText.length, normalizedQuery.length);
    const similarity = 1 - distance / maxLen;
    
    if (similarity > 0.5) {
      return Math.round(similarity * 60);
    }
  }
  
  return 0;
}

/**
 * Filtre et trie une liste d'items par pertinence fuzzy
 */
export function fuzzyFilter<T extends { label: string }>(
  items: T[],
  query: string,
  minScore: number = 30
): T[] {
  if (!query.trim()) return items;
  
  const scored = items
    .map(item => ({
      item,
      score: fuzzyMatch(item.label, query)
    }))
    .filter(({ score }) => score >= minScore)
    .sort((a, b) => b.score - a.score);
  
  return scored.map(({ item }) => item);
}
