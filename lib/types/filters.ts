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
  availability: {
    inStock: boolean;
    newArrivals: boolean;
    onSale: boolean;
  };
  sort: SortOption;
}

export const INITIAL_FILTERS: FilterState = {
  priceRange: [0, 500],
  categories: [],
  materials: [],
  stones: [],
  styles: [],
  occasions: [],
  colors: [],
  origins: [],
  availability: {
    inStock: false,
    newArrivals: false,
    onSale: false,
  },
  sort: 'relevance',
};

// Configuration des filtres disponibles
export const FILTER_CONFIG = {
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





