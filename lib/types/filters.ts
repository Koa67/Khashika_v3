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
    { id: 'argent', label: 'Argent', icon: '🥈' },
    { id: 'or', label: 'Or', icon: '🥇' },
    { id: 'plaqué or', label: 'Plaqué Or', icon: '✨' },
    { id: 'laiton', label: 'Laiton', icon: '🔶' },
    { id: 'métal', label: 'Métal', icon: '⚙️' },
    { id: 'coton', label: 'Coton', icon: '🧵' },
    { id: 'soie', label: 'Soie', icon: '✨' },
    { id: 'cuir', label: 'Cuir', icon: '🟤' },
  ],
  
  // Pierres (IDs EXACTS du champ "stones" dans le JSON)
  stones: [
    // Top pierres (par fréquence)
    { id: 'turquoise', label: 'Turquoise', color: '#40E0D0' },
    { id: 'lapis-lazuli', label: 'Lapis Lazuli', color: '#26619C' },
    { id: 'agate', label: 'Agate', color: '#B5651D' },
    { id: 'onyx noir', label: 'Onyx Noir', color: '#353839' },
    { id: 'onyx vert', label: 'Onyx Vert', color: '#355E3B' },
    { id: 'onyx bleu', label: 'Onyx Bleu', color: '#4169E1' },
    { id: 'onyx rouge', label: 'Onyx Rouge', color: '#8B0000' },
    { id: 'pierre de lune', label: 'Pierre de Lune', color: '#E8E4D9' },
    { id: 'corail', label: 'Corail', color: '#FF6B6B' },
    { id: 'améthyste', label: 'Améthyste', color: '#9966CC' },
    { id: 'quartz', label: 'Quartz', color: '#F5F5F5' },
    // Pierres moyennes
    { id: 'perle', label: 'Perle', color: '#FDEEF4' },
    { id: 'jade', label: 'Jade', color: '#00A86B' },
    { id: 'grenat', label: 'Grenat', color: '#7B1113' },
    { id: 'calcédoine', label: 'Calcédoine', color: '#9FC5E8' },
    { id: 'jaspe', label: 'Jaspe', color: '#D2691E' },
    { id: 'topaze', label: 'Topaze', color: '#FFC87C' },
    { id: 'labradorite', label: 'Labradorite', color: '#6699CC' },
    // Pierres moins fréquentes
    { id: 'obsidienne', label: 'Obsidienne', color: '#1C1C1C' },
    { id: 'howlite', label: 'Howlite', color: '#F5F5F5' },
    { id: 'citrine', label: 'Citrine', color: '#E4D00A' },
    { id: 'amazonite', label: 'Amazonite', color: '#00C4B0' },
    { id: 'malachite', label: 'Malachite', color: '#0BDA51' },
    { id: 'aventurine', label: 'Aventurine', color: '#568203' },
    { id: 'cristal', label: 'Cristal', color: '#E0E0E0' },
    { id: 'tourmaline', label: 'Tourmaline', color: '#86608E' },
    { id: 'rhodonite', label: 'Rhodonite', color: '#E75480' },
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
