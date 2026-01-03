export type SortOption = 
  | 'relevance' 
  | 'newest' 
  | 'price_asc' 
  | 'price_desc' 
  | 'popularity';

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  materials: string[];
  stones: string[];
  styles: string[];
  occasions: string[];
  colors: string[];
  origins: string[];
  types: string[];
  accessories: string[];
  availability: {
    inStock: boolean;
    newArrivals: boolean;
    onSale: boolean;
  };
  sort: SortOption;
}

export const INITIAL_FILTERS: FilterState = {
  priceRange: [1, 50],
  categories: [],
  materials: [],
  stones: [],
  styles: [],
  occasions: [],
  colors: [],
  origins: [],
  types: [],
  accessories: [],
  availability: {
    inStock: false,
    newArrivals: false,
    onSale: false,
  },
  sort: 'relevance',
};

// IDs des variantes d'onyx
export const ONYX_VARIANT_IDS = ['onyx noir', 'onyx vert', 'onyx bleu', 'onyx rouge'];

// Configuration des filtres disponibles
// IDs DOIVENT correspondre EXACTEMENT aux valeurs dans products-ultimate.json
export const FILTER_CONFIG = {
  // Types de bijoux (match exact avec le champ "type" du JSON)
  types: [
    { id: 'bague', label: 'Bagues', searchTerms: ['bague', 'ring', 'anneau'] },
    { id: "boucles d'oreilles", label: "Boucles d'oreilles", searchTerms: ['boucle', 'oreille', 'earring', 'créole', 'puce'] },
    { id: 'collier', label: 'Colliers', searchTerms: ['collier', 'necklace', 'sautoir', 'ras du cou'] },
    { id: 'pendentif', label: 'Pendentifs', searchTerms: ['pendentif', 'pendant', 'médaillon'] },
    { id: 'bracelet', label: 'Bracelets', searchTerms: ['bracelet', 'jonc', 'manchette', 'chaînette'] },
    { id: 'chaîne', label: 'Chaînes', searchTerms: ['chaîne', 'chain', 'maille'] },
    { id: 'cheville', label: 'Chevilles', searchTerms: ['cheville', 'anklet', 'chaîne cheville'] },
  ],
  
  // Accessoires (match exact avec le champ "type" du JSON)
  accessories: [
    { id: 'pashmina', label: 'Pashminas', searchTerms: ['pashmina', 'châle', 'étole'] },
    { id: 'foulard', label: 'Foulards', searchTerms: ['foulard', 'scarf', 'écharpe', 'étole'] },
    { id: 'sac', label: 'Sacs', searchTerms: ['sac', 'bag', 'cabas', 'pochette'] },
    { id: 'accessoire', label: 'Accessoires', searchTerms: ['accessoire', 'porte-clé', 'marque-page'] },
    { id: 'accessoire cheveux', label: 'Accessoires cheveux', searchTerms: ['chouchou', 'bandana', 'cheveux'] },
  ],
  
  materials: [
    { id: 'argent', label: 'Argent', count: 272 },
    { id: 'métal', label: 'Métal', count: 74 },
    { id: 'laiton', label: 'Laiton', count: 41 },
    { id: 'cordon', label: 'Cordon / Macramé', count: 41 },
    { id: 'bois', label: 'Bois', count: 11 },
    { id: 'cuir', label: 'Cuir', count: 11 },
  ],
  // PIERRES TRIÉES PAR POPULARITÉ (40 pierres totales)
  // INCLUT les variantes d'onyx pour que ActiveFilters puisse les trouver
  stones: [
    // === TOP 8 (affichées dans navbar et sidebar "Populaires") ===
    { id: 'turquoise', label: 'Turquoise', color: '#40E0D0', count: 75 },
    { id: 'lapis-lazuli', label: 'Lapis Lazuli', color: '#26619C', count: 49 },
    { id: 'agate', label: 'Agate', color: '#B5651D', count: 48 },
    { id: 'onyx', label: 'Onyx (toutes couleurs)', color: '#353839', count: 43, isOnyxMaster: true },
    { id: 'pierre de lune', label: 'Pierre de Lune', color: '#E8E4D9', count: 36 },
    { id: 'corail', label: 'Corail', color: '#FF6B6B', count: 27 },
    { id: 'améthyste', label: 'Améthyste', color: '#9966CC', count: 25 },
    { id: 'quartz', label: 'Quartz', color: '#FFB6C1', count: 20 },
    // === Pierres moyennes (10-19 produits) ===
    { id: 'oeil de tigre', label: 'Œil de Tigre', color: '#B8860B', count: 18 },
    { id: 'cornaline', label: 'Cornaline', color: '#CD5C5C', count: 14 },
    { id: 'péridot', label: 'Péridot', color: '#9ACD32', count: 9 },
    // === Pierres standard (5-9 produits) ===
    { id: 'grenat', label: 'Grenat', color: '#7B1113', count: 8 },
    { id: 'jade', label: 'Jade', color: '#00A86B', count: 8 },
    { id: 'calcédoine', label: 'Calcédoine', color: '#9FC5E8', count: 8 },
    { id: 'perle', label: 'Perle', color: '#FDEEF4', count: 8 },
    { id: 'jaspe', label: 'Jaspe', color: '#D2691E', count: 7 },
    { id: 'labradorite', label: 'Labradorite', color: '#6699CC', count: 6 },
    { id: 'topaze', label: 'Topaze', color: '#FFC87C', count: 6 },
    { id: 'obsidienne', label: 'Obsidienne', color: '#1C1C1C', count: 5 },
    { id: 'rubis', label: 'Rubis', color: '#E0115F', count: 5 },
    { id: 'citrine', label: 'Citrine', color: '#E4D00A', count: 5 },
    { id: 'aigue-marine', label: 'Aigue-Marine', color: '#7FFFD4', count: 5 },
    { id: 'howlite', label: 'Howlite', color: '#F5F5F5', count: 5 },
    // === Pierres moins fréquentes (3-4 produits) ===
    { id: 'amazonite', label: 'Amazonite', color: '#00C4B0', count: 4 },
    { id: 'émeraude', label: 'Émeraude', color: '#50C878', count: 3 },
    { id: 'cristal', label: 'Cristal', color: '#E0E0E0', count: 3 },
    { id: 'aventurine', label: 'Aventurine', color: '#568203', count: 3 },
    { id: 'saphir', label: 'Saphir', color: '#0F52BA', count: 3 },
    { id: 'malachite', label: 'Malachite', color: '#0BDA51', count: 3 },
    // === Pierres rares (1-2 produits) ===
    { id: 'dzi', label: 'Dzi (Tibétaine)', color: '#8B4513', count: 2 },
    { id: 'larimar', label: 'Larimar', color: '#87CEEB', count: 2 },
    { id: 'jaspe dalmatien', label: 'Jaspe Dalmatien', color: '#F5F5DC', count: 1 },
    { id: 'tourmaline', label: 'Tourmaline', color: '#86608E', count: 1 },
    { id: 'nacre', label: 'Nacre', color: '#FAFAD2', count: 1 },
    { id: 'zircon', label: 'Zircon', color: '#E6E6FA', count: 1 },
    { id: 'rhodonite', label: 'Rhodonite', color: '#E75480', count: 1 },
    // === Variantes d'onyx (pour ActiveFilters et vue "Par couleurs") ===
    { id: 'onyx noir', label: 'Onyx Noir', color: '#353839', count: 31, isOnyxVariant: true, colorGroup: 'Neutres' },
    { id: 'onyx vert', label: 'Onyx Vert', color: '#355E3B', count: 8, isOnyxVariant: true, colorGroup: 'Verts' },
    { id: 'onyx bleu', label: 'Onyx Bleu', color: '#4169E1', count: 2, isOnyxVariant: true, colorGroup: 'Bleus' },
    { id: 'onyx rouge', label: 'Onyx Rouge', color: '#8B0000', count: 1, isOnyxVariant: true, colorGroup: 'Rouges & Roses' },
  ],
  
  styles: [
    { id: 'traditionnel', label: 'Traditionnel' },
    { id: 'moderne', label: 'Moderne' },
    { id: 'boheme', label: 'Bohème' },
    { id: 'tribal', label: 'Tribal' },
  ],
  
  occasions: [
    { id: 'mariage', label: 'Mariage', emoji: '💒' },
    { id: 'quotidien', label: 'Quotidien', emoji: '☀️' },
    { id: 'soiree', label: 'Soirée', emoji: '🌙' },
    { id: 'cadeau', label: 'Cadeau', emoji: '🎁' },
  ],
  
  colors: [
    { id: 'or', label: 'Doré', hex: '#EAB615' },
    { id: 'argent', label: 'Argenté', hex: '#C0C0C0' },
    { id: 'bleu', label: 'Bleu', hex: '#2596BE' },
    { id: 'rouge', label: 'Rouge', hex: '#C41E3A' },
    { id: 'vert', label: 'Vert', hex: '#228B22' },
    { id: 'noir', label: 'Noir', hex: '#1A1A1A' },
  ],
  
  origins: [
    { id: 'rajasthan', label: 'Rajasthan', flag: '🇮🇳' },
    { id: 'gujarat', label: 'Gujarat', flag: '🇮🇳' },
    { id: 'birmanie', label: 'Birmanie', flag: '🇲🇲' },
    { id: 'tibet', label: 'Tibet', flag: '🏔️' },
  ],
};

// Helper: Pierres avec > 7 produits pour navbar et sidebar (sans variantes d'onyx)
export const TOP_STONES = FILTER_CONFIG.stones
  .filter(s => !s.isOnyxVariant && s.count && s.count > 7);

// Helper: Toutes les pierres SANS variantes d'onyx (pour vue "Populaires")
export const STONES_WITHOUT_ONYX_VARIANTS = FILTER_CONFIG.stones
  .filter(s => !s.isOnyxVariant);

// Helper: Seulement les variantes d'onyx (pour vue "Par couleurs")
export const ONYX_VARIANTS = FILTER_CONFIG.stones
  .filter(s => s.isOnyxVariant);

// Helper: Vérifier si une pierre est une variante d'onyx
export function isOnyxVariant(stoneId: string): boolean {
  return ONYX_VARIANT_IDS.includes(stoneId);
}

// Helper: Obtenir tous les IDs d'onyx pour le filtrage
export function getAllOnyxIds(): string[] {
  return ONYX_VARIANT_IDS;
}

// Helper: Trouver une pierre par ID (inclut variantes d'onyx)
export function findStoneById(stoneId: string) {
  return FILTER_CONFIG.stones.find(s => s.id === stoneId);
}
