// Configuration centralisée des filtres pour la boutique Khashika
// Les IDs doivent correspondre EXACTEMENT aux valeurs "type" dans products-ultimate.json

export interface FilterOption {
  id: string;
  label: string;
  emoji?: string;      // Emoji optionnel pour affichage
  color?: string;      // Couleur hex pour affichage visuel (pierres)
  texture?: string;    // URL texture optionnelle
  searchTerms?: string[];
}

export interface FilterGroup {
  id: string;
  label: string;
  type: 'checkbox' | 'range';
  options?: FilterOption[];
  range?: {
    min: number;
    max: number;
    step: number;
    unit: string;
  };
}

// Options de tri
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';

// État de disponibilité
export interface AvailabilityState {
  inStock: boolean;
  newArrivals: boolean;
  onSale: boolean;
}

// État des filtres actifs
export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  types: string[];
  accessories: string[];
  materials: string[];
  stones: string[];
  styles: string[];
  occasions: string[];
  availability: AvailabilityState;
  sort: SortOption;
  search: string;
}

// État initial des filtres
export const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 50],
  categories: [],
  types: [],
  accessories: [],
  materials: [],
  stones: [],
  styles: [],
  occasions: [],
  availability: {
    inStock: false,
    newArrivals: false,
    onSale: false,
  },
  sort: 'default',
  search: '',
};

// Variantes d'onyx
export const ONYX_VARIANT_IDS = ['onyx noir', 'onyx vert', 'onyx bleu', 'onyx rouge'];

// Pierres les plus populaires (pour affichage prioritaire)
export const TOP_STONES = [
  'turquoise',
  'lapis-lazuli', 
  'améthyste',
  'pierre de lune',
  'corail',
  'agate',
  'onyx',
  'quartz',
];

// Types de bijoux - correspondent aux valeurs "type" du JSON
export const JEWELRY_TYPES: FilterOption[] = [
  { id: 'bague', label: 'Bagues', searchTerms: ['bague', 'ring', 'anneau'] },
  { id: "boucles d'oreilles", label: "Boucles d'oreilles", searchTerms: ['boucle', 'oreille', 'earring', 'créole'] },
  { id: 'bracelet', label: 'Bracelets', searchTerms: ['bracelet', 'jonc', 'manchette'] },
  { id: 'collier', label: 'Colliers', searchTerms: ['collier', 'necklace', 'sautoir'] },
  { id: 'pendentif', label: 'Pendentifs', searchTerms: ['pendentif', 'pendant', 'médaillon'] },
  { id: 'chaîne', label: 'Chaînes', searchTerms: ['chaîne', 'chaine', 'chain'] },
  { id: 'cheville', label: 'Chevilles', searchTerms: ['cheville', 'anklet'] },
];

// Accessoires - correspondent aux valeurs "type" du JSON
export const ACCESSORY_TYPES: FilterOption[] = [
  { id: 'pashmina', label: 'Pashminas', searchTerms: ['pashmina', 'châle', 'shawl', 'étole'] },
  { id: 'foulard', label: 'Foulards', searchTerms: ['foulard', 'scarf', 'écharpe', 'soie'] },
  { id: 'sac', label: 'Sacs', searchTerms: ['sac', 'bag', 'pochette', 'trousse'] },
  { id: 'accessoire cheveux', label: 'Accessoires cheveux', searchTerms: ['cheveux', 'chouchou', 'bandana', 'barrette', 'pince', 'broche'] },
  { id: 'accessoire', label: 'Porte-clés & Divers', searchTerms: ['porte-clé', 'porte-cle', 'porte clé', 'keychain', 'accessoire', 'divers'] },
  { id: 'papeterie', label: 'Papeterie & Déco', searchTerms: ['carnet', 'marque-page', 'marque page', 'notebook', 'cahier', 'signet', 'bookmark', 'figurine', 'statue', 'bouddha', 'décoration', 'décor', 'papeterie'] },
];

// Matériaux
export const MATERIALS: FilterOption[] = [
  { id: 'argent', label: 'Argent', searchTerms: ['argent', 'silver', '925', 'sterling'] },
  { id: 'plaqué or', label: 'Plaqué Or', searchTerms: ['plaqué or', 'gold plated', 'doré'] },
  { id: 'laiton', label: 'Laiton', searchTerms: ['laiton', 'brass'] },
  { id: 'cuivre', label: 'Cuivre', searchTerms: ['cuivre', 'copper'] },
  { id: 'acier', label: 'Acier', searchTerms: ['acier', 'steel', 'inoxydable'] },
  { id: 'soie', label: 'Soie', searchTerms: ['soie', 'silk'] },
  { id: 'coton', label: 'Coton', searchTerms: ['coton', 'cotton'] },
];

// Pierres avec couleurs pour affichage visuel
export const STONES: FilterOption[] = [
  // Pierres populaires
  { id: 'turquoise', label: 'Turquoise', color: '#40E0D0', searchTerms: ['turquoise'] },
  { id: 'lapis-lazuli', label: 'Lapis Lazuli', color: '#26619C', searchTerms: ['lapis', 'lazuli', 'lapis-lazuli'] },
  { id: 'améthyste', label: 'Améthyste', color: '#9966CC', searchTerms: ['améthyste', 'amethyste', 'amethyst'] },
  { id: 'pierre de lune', label: 'Pierre de Lune', color: '#E8E8E8', searchTerms: ['pierre de lune', 'moonstone', 'lune'] },
  { id: 'corail', label: 'Corail', color: '#FF6F61', searchTerms: ['corail', 'coral'] },
  { id: 'agate', label: 'Agate', color: '#8B7355', searchTerms: ['agate'] },
  { id: 'onyx', label: 'Onyx', color: '#353839', searchTerms: ['onyx'] },
  { id: 'quartz', label: 'Quartz', color: '#F7CAC9', searchTerms: ['quartz', 'rose'] },
  // Pierres moyennes
  { id: 'oeil de tigre', label: 'Œil de Tigre', color: '#B8860B', searchTerms: ['oeil de tigre', 'oeil du tigre', 'tiger eye'] },
  { id: 'cornaline', label: 'Cornaline', color: '#D2691E', searchTerms: ['cornaline', 'carnelian'] },
  { id: 'péridot', label: 'Péridot', color: '#9ACD32', searchTerms: ['péridot', 'peridot'] },
  { id: 'grenat', label: 'Grenat', color: '#722F37', searchTerms: ['grenat', 'garnet'] },
  { id: 'jade', label: 'Jade', color: '#00A86B', searchTerms: ['jade'] },
  { id: 'labradorite', label: 'Labradorite', color: '#5F9EA0', searchTerms: ['labradorite'] },
  // Pierres rares
  { id: 'émeraude', label: 'Émeraude', color: '#50C878', searchTerms: ['émeraude', 'emeraude', 'emerald'] },
  { id: 'rubis', label: 'Rubis', color: '#E0115F', searchTerms: ['rubis', 'ruby'] },
  { id: 'saphir', label: 'Saphir', color: '#0F52BA', searchTerms: ['saphir', 'sapphire'] },
  { id: 'topaze', label: 'Topaze', color: '#FFC87C', searchTerms: ['topaze', 'topaz'] },
  { id: 'citrine', label: 'Citrine', color: '#E4D00A', searchTerms: ['citrine'] },
  { id: 'perle', label: 'Perle', color: '#FDEEF4', searchTerms: ['perle', 'pearl'] },
  // Variantes d'onyx
  { id: 'onyx noir', label: 'Onyx Noir', color: '#0A0A0A', searchTerms: ['onyx noir'] },
  { id: 'onyx vert', label: 'Onyx Vert', color: '#355E3B', searchTerms: ['onyx vert'] },
  { id: 'onyx bleu', label: 'Onyx Bleu', color: '#1C3A5F', searchTerms: ['onyx bleu'] },
  { id: 'onyx rouge', label: 'Onyx Rouge', color: '#722F37', searchTerms: ['onyx rouge'] },
];

// Styles
export const STYLES: FilterOption[] = [
  { id: 'traditionnel', label: 'Traditionnel', searchTerms: ['traditionnel', 'traditional', 'classique'] },
  { id: 'moderne', label: 'Moderne', searchTerms: ['moderne', 'modern', 'contemporain'] },
  { id: 'bohème', label: 'Bohème', searchTerms: ['bohème', 'boheme', 'boho'] },
  { id: 'minimaliste', label: 'Minimaliste', searchTerms: ['minimaliste', 'minimal', 'simple'] },
];

// Occasions
export const OCCASIONS: FilterOption[] = [
  { id: 'quotidien', label: 'Quotidien', emoji: '🌅', searchTerms: ['quotidien', 'everyday', 'casual'] },
  { id: 'mariage', label: 'Mariage', emoji: '💍', searchTerms: ['mariage', 'wedding', 'bridal'] },
  { id: 'soirée', label: 'Soirée', emoji: '🌙', searchTerms: ['soirée', 'soiree', 'evening', 'fête'] },
  { id: 'cadeau', label: 'Cadeau', emoji: '🎁', searchTerms: ['cadeau', 'gift'] },
];

// Pierres sans les variantes d'onyx (pour affichage simplifié)
export const STONES_WITHOUT_ONYX_VARIANTS: FilterOption[] = STONES.filter(
  stone => !ONYX_VARIANT_IDS.includes(stone.id)
);

// Configuration des filtres - OBJET avec propriétés directes
export const FILTER_CONFIG = {
  types: JEWELRY_TYPES,
  accessories: ACCESSORY_TYPES,
  materials: MATERIALS,
  stones: STONES,
  styles: STYLES,
  occasions: OCCASIONS,
  price: {
    min: 0,
    max: 50,
    step: 1,
    unit: '€'
  }
};

// Helper: obtenir toutes les options d'un groupe
export function getFilterOptions(groupId: keyof typeof FILTER_CONFIG): FilterOption[] {
  const group = FILTER_CONFIG[groupId];
  if (Array.isArray(group)) {
    return group;
  }
  return [];
}

// Helper: obtenir un filtre par son ID
export function getFilterById(groupId: keyof typeof FILTER_CONFIG, filterId: string): FilterOption | undefined {
  const options = getFilterOptions(groupId);
  return options.find(opt => opt.id === filterId);
}

// Helper: recherche par terme (inclut searchTerms)
export function findFilterByTerm(groupId: keyof typeof FILTER_CONFIG, term: string): FilterOption | undefined {
  const options = getFilterOptions(groupId);
  const normalizedTerm = term.toLowerCase().trim();
  
  return options.find(opt => {
    if (opt.id.toLowerCase() === normalizedTerm) return true;
    if (opt.label.toLowerCase() === normalizedTerm) return true;
    if (opt.searchTerms?.some(st => st.toLowerCase() === normalizedTerm)) return true;
    return false;
  });
}
