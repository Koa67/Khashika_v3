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
export const FILTER_CONFIG = {
  types: [
    { id: 'bague', label: 'Bagues', searchTerms: ['bague', 'ring', 'anneau'] },
    { id: 'boucles-oreilles', label: "Boucles d'oreilles", searchTerms: ['boucle', 'oreille', 'earring', 'créole', 'puce'] },
    { id: 'collier', label: 'Colliers', searchTerms: ['collier', 'necklace', 'sautoir', 'ras du cou', 'chaîne cou'] },
    { id: 'pendentif', label: 'Pendentifs', searchTerms: ['pendentif', 'pendant', 'médaillon'] },
    { id: 'bracelet', label: 'Bracelets', searchTerms: ['bracelet', 'jonc', 'manchette', 'chaînette'] },
    { id: 'chaine', label: 'Chaînes', searchTerms: ['chaîne', 'chain', 'maille'] },
    { id: 'cheville', label: 'Chevilles', searchTerms: ['cheville', 'anklet', 'chaîne cheville'] },
    { id: 'parure', label: 'Parures', searchTerms: ['parure', 'set', 'ensemble'] },
  ],
  
  accessories: [
    { id: 'pashmina', label: 'Pashminas', searchTerms: ['pashmina', 'châle', 'étole'] },
    { id: 'foulard', label: 'Foulards', searchTerms: ['foulard', 'scarf', 'écharpe'] },
    { id: 'pochette', label: 'Pochettes', searchTerms: ['pochette', 'pouch', 'sacoche'] },
    { id: 'sac', label: 'Sacs', searchTerms: ['sac', 'bag', 'cabas'] },
    { id: 'soie', label: 'Soie', searchTerms: ['soie', 'silk'] },
    { id: 'porte-cles', label: 'Porte-clés', searchTerms: ['porte-clé', 'porte-cles', 'keychain', 'clé'] },
    { id: 'chouchou', label: 'Chouchous', searchTerms: ['chouchou', 'scrunchie', 'élastique cheveux'] },
    { id: 'bandana', label: 'Bandanas', searchTerms: ['bandana', 'foulard tête'] },
    { id: 'marque-page', label: 'Marque-pages', searchTerms: ['marque-page', 'bookmark', 'signet'] },
    { id: 'carnet', label: 'Carnets', searchTerms: ['carnet', 'notebook', 'cahier'] },
  ],
  
  materials: [
    { id: 'argent-925', label: 'Argent 925', icon: '🥈' },
    { id: 'or', label: 'Or', icon: '🥇' },
    { id: 'plaque-or', label: 'Plaqué Or', icon: '✨' },
    { id: 'laiton', label: 'Laiton', icon: '🔶' },
    { id: 'metal', label: 'Métal', icon: '⚙️' },
    { id: 'vermeil', label: 'Vermeil', icon: '💫' },
  ],
  
  stones: [
    { id: 'turquoise', label: 'Turquoise', color: '#40E0D0' },
    { id: 'lapis-lazuli', label: 'Lapis Lazuli', color: '#26619C' },
    { id: 'corail', label: 'Corail', color: '#FF6B6B' },
    { id: 'onyx', label: 'Onyx', color: '#353839' },
    { id: 'jade', label: 'Jade', color: '#00A86B' },
    { id: 'amethyste', label: 'Améthyste', color: '#9966CC' },
    { id: 'grenat', label: 'Grenat', color: '#7B1113' },
    { id: 'perle', label: 'Perle', color: '#FDEEF4' },
    { id: 'moonstone', label: 'Pierre de Lune', color: '#E8E4D9' },
    { id: 'labradorite', label: 'Labradorite', color: '#6699CC' },
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
    { id: 'or', label: 'Doré', hex: '#D4AF37' },
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




