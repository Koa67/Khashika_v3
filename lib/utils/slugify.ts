/**
 * Convertit une chaîne en slug URL-friendly
 */
export function slugify(text: string | null | undefined): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/\s+/g, '-') // Remplace les espaces par des tirets
    .replace(/[^\w\-]+/g, '') // Supprime les caractères non alphanumériques
    .replace(/\-\-+/g, '-') // Remplace les tirets multiples par un seul
    .replace(/^-+/, '') // Supprime les tirets au début
    .replace(/-+$/, ''); // Supprime les tirets à la fin
}





