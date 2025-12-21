// ============================================================================
// KHASHIKA - HOOK DE GESTION DES FILTRES
// ============================================================================
// Hook centralisé pour gérer l'état, la logique et la persistance des filtres
// ============================================================================

import { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';

// Types pour les filtres
export interface FilterState {
  priceRange: [number, number];
  materials: string[];
  stones: string[];
  styles: string[];
  occasions: string[];
  colors: string[];
  sizes: string[];
  origins: string[];
  availability: {
    inStock: boolean;
    newArrivals: boolean;
    onSale: boolean;
  };
  sortBy: SortOption;
}

export type SortOption = 
  | 'relevance' 
  | 'newest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'popularity';

export interface FilterCounts {
  materials: Record<string, number>;
  stones: Record<string, number>;
  styles: Record<string, number>;
  occasions: Record<string, number>;
  colors: Record<string, number>;
  sizes: Record<string, number>;
  origins: Record<string, number>;
  total: number;
}

// Valeurs par défaut
const defaultFilters: FilterState = {
  priceRange: [0, 500],
  materials: [],
  stones: [],
  styles: [],
  occasions: [],
  colors: [],
  sizes: [],
  origins: [],
  availability: {
    inStock: false,
    newArrivals: false,
    onSale: false,
  },
  sortBy: 'relevance',
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
    { id: 'turquoise', label: 'Turquoise', color: '#40E0D0', texture: '/images/stones/turquoise.jpg' },
    { id: 'lapis-lazuli', label: 'Lapis Lazuli', color: '#26619C', texture: '/images/stones/lapis.jpg' },
    { id: 'corail', label: 'Corail', color: '#FF6B6B', texture: '/images/stones/corail.jpg' },
    { id: 'onyx', label: 'Onyx', color: '#353839', texture: '/images/stones/onyx.jpg' },
    { id: 'jade', label: 'Jade', color: '#00A86B', texture: '/images/stones/jade.jpg' },
    { id: 'amethyste', label: 'Améthyste', color: '#9966CC', texture: '/images/stones/amethyste.jpg' },
    { id: 'grenat', label: 'Grenat', color: '#7B1113', texture: '/images/stones/grenat.jpg' },
    { id: 'perle', label: 'Perle', color: '#FDEEF4', texture: '/images/stones/perle.jpg' },
    { id: 'moonstone', label: 'Pierre de Lune', color: '#E8E4D9', texture: '/images/stones/moonstone.jpg' },
    { id: 'labradorite', label: 'Labradorite', color: '#6699CC', texture: '/images/stones/labradorite.jpg' },
  ],
  
  styles: [
    { id: 'traditionnel', label: 'Traditionnel', image: '/images/styles/traditionnel.jpg' },
    { id: 'moderne', label: 'Moderne', image: '/images/styles/moderne.jpg' },
    { id: 'boheme', label: 'Bohème', image: '/images/styles/boheme.jpg' },
    { id: 'tribal', label: 'Tribal', image: '/images/styles/tribal.jpg' },
    { id: 'kundan', label: 'Kundan', image: '/images/styles/kundan.jpg' },
    { id: 'temple', label: 'Temple Jewelry', image: '/images/styles/temple.jpg' },
  ],
  
  occasions: [
    { id: 'mariage', label: 'Mariage', emoji: '💒' },
    { id: 'quotidien', label: 'Quotidien', emoji: '☀️' },
    { id: 'soiree', label: 'Soirée', emoji: '🌙' },
    { id: 'cadeau', label: 'Cadeau', emoji: '🎁' },
    { id: 'bureau', label: 'Bureau', emoji: '💼' },
    { id: 'festival', label: 'Festival', emoji: '🎉' },
  ],
  
  colors: [
    { id: 'or', label: 'Doré', hex: '#D4AF37' },
    { id: 'argent', label: 'Argenté', hex: '#C0C0C0' },
    { id: 'bleu', label: 'Bleu', hex: '#2596BE' },
    { id: 'rouge', label: 'Rouge', hex: '#C41E3A' },
    { id: 'vert', label: 'Vert', hex: '#228B22' },
    { id: 'noir', label: 'Noir', hex: '#1A1A1A' },
    { id: 'blanc', label: 'Blanc', hex: '#FFFAF0' },
    { id: 'rose', label: 'Rose', hex: '#FFB6C1' },
    { id: 'violet', label: 'Violet', hex: '#8B5CF6' },
    { id: 'multicolore', label: 'Multicolore', hex: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #FFE66D)' },
  ],
  
  sizes: {
    bagues: ['46', '48', '50', '52', '54', '56', '58', '60', 'Ajustable'],
    bracelets: ['16cm', '17cm', '18cm', '19cm', '20cm', 'Ajustable'],
    colliers: ['40cm', '45cm', '50cm', '60cm', '80cm'],
  },
  
  origins: [
    { id: 'rajasthan', label: 'Rajasthan', flag: '🇮🇳' },
    { id: 'gujarat', label: 'Gujarat', flag: '🇮🇳' },
    { id: 'birmanie', label: 'Birmanie', flag: '🇲🇲' },
    { id: 'tibet', label: 'Tibet', flag: '🏔️' },
    { id: 'nepal', label: 'Népal', flag: '🇳🇵' },
  ],
  
  sortOptions: [
    { id: 'relevance', label: 'Pertinence' },
    { id: 'newest', label: 'Nouveautés' },
    { id: 'price-asc', label: 'Prix croissant' },
    { id: 'price-desc', label: 'Prix décroissant' },
    { id: 'popularity', label: 'Popularité' },
  ],
};

// Hook principal
export function useFilters(products: Product[]) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // État des filtres
  const [filters, setFilters] = useState<FilterState>(() => {
    // Restaurer depuis URL ou localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('khashika-filters');
      if (saved) {
        try {
          return { ...defaultFilters, ...JSON.parse(saved) };
        } catch {}
      }
    }
    return defaultFilters;
  });
  
  // Sauvegarder dans localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('khashika-filters', JSON.stringify(filters));
    }
  }, [filters]);
  
  // Générer URL SEO-friendly
  const generateFilterUrl = useCallback((currentFilters: FilterState) => {
    const params = new URLSearchParams();
    
    if (currentFilters.materials.length) {
      params.set('materiau', currentFilters.materials.join(','));
    }
    if (currentFilters.stones.length) {
      params.set('pierre', currentFilters.stones.join(','));
    }
    if (currentFilters.styles.length) {
      params.set('style', currentFilters.styles.join(','));
    }
    if (currentFilters.priceRange[0] > 0 || currentFilters.priceRange[1] < 500) {
      params.set('prix', `${currentFilters.priceRange[0]}-${currentFilters.priceRange[1]}`);
    }
    if (currentFilters.sortBy !== 'relevance') {
      params.set('tri', currentFilters.sortBy);
    }
    
    return params.toString() ? `?${params.toString()}` : '';
  }, []);
  
  // Appliquer les filtres aux produits
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filtre prix
    result = result.filter(p => {
      const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
      const priceValue = price || 0;
      return priceValue >= filters.priceRange[0] && priceValue <= filters.priceRange[1];
    });
    
    // Filtre matériaux
    if (filters.materials.length > 0) {
      result = result.filter(p => 
        filters.materials.some(m => 
          p.material?.toLowerCase().includes(m)
        )
      );
    }
    
    // Filtre pierres
    if (filters.stones.length > 0) {
      result = result.filter(p =>
        filters.stones.some(s =>
          p.stone?.toLowerCase().includes(s) ||
          p.name?.toLowerCase().includes(s) ||
          p.description?.toLowerCase().includes(s)
        )
      );
    }
    
    // Filtre styles
    if (filters.styles.length > 0) {
      result = result.filter(p =>
        filters.styles.some(s =>
          p.style?.toLowerCase().includes(s)
        )
      );
    }
    
    // Filtre occasions
    if (filters.occasions.length > 0) {
      result = result.filter(p =>
        filters.occasions.some(o =>
          p.category?.toLowerCase().includes(o)
        )
      );
    }
    
    // Filtre couleurs
    if (filters.colors.length > 0) {
      result = result.filter(p =>
        filters.colors.some(c =>
          p.characteristics?.color?.toLowerCase().includes(c)
        )
      );
    }
    
    // Filtre origines
    if (filters.origins.length > 0) {
      result = result.filter(p =>
        filters.origins.some(o =>
          p.attributes?.origin?.toLowerCase().includes(o)
        )
      );
    }
    
    // Filtre disponibilité
    if (filters.availability.inStock) {
      result = result.filter(p => p.inStock !== false && p.stock !== 0);
    }
    if (filters.availability.newArrivals) {
      // Use a fixed cutoff date for new arrivals (30 days)
      result = result.filter(p => {
        if (!p.createdAt) return false;
        const createdDate = new Date(p.createdAt);
        const now = new Date();
        const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysDiff <= 30;
      });
    }
    if (filters.availability.onSale) {
      result = result.filter(p => p.salePrice || p.discount);
    }
    
    // Tri
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => {
          const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return bDate - aDate;
        });
        break;
      case 'price-asc':
        result.sort((a, b) => {
          const aPrice = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          const bPrice = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
          return (aPrice || 0) - (bPrice || 0);
        });
        break;
      case 'price-desc':
        result.sort((a, b) => {
          const aPrice = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          const bPrice = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
          return (bPrice || 0) - (aPrice || 0);
        });
        break;
      case 'popularity':
        // No views field in Product type, skip for now
        break;
    }
    
    return result;
  }, [products, filters]);
  
  // Calculer les compteurs pour chaque option
  const filterCounts = useMemo((): FilterCounts => {
    const counts: FilterCounts = {
      materials: {},
      stones: {},
      styles: {},
      occasions: {},
      colors: {},
      sizes: {},
      origins: {},
      total: filteredProducts.length,
    };
    
    // Compter les occurrences pour chaque filtre
    FILTER_CONFIG.materials.forEach(m => {
      counts.materials[m.id] = products.filter(p =>
        p.material?.toLowerCase().includes(m.id)
      ).length;
    });
    
    FILTER_CONFIG.stones.forEach(s => {
      counts.stones[s.id] = products.filter(p =>
        p.stone?.toLowerCase().includes(s.id) ||
        p.name?.toLowerCase().includes(s.id)
      ).length;
    });
    
    return counts;
  }, [products, filteredProducts]);
  
  // Actions
  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: value };
      // Mettre à jour l'URL
      const url = generateFilterUrl(newFilters);
      window.history.replaceState({}, '', `/boutique${url}`);
      return newFilters;
    });
  }, [generateFilterUrl]);
  
  const toggleArrayFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: string
  ) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      const newFilters = { ...prev, [key]: newArray };
      const url = generateFilterUrl(newFilters);
      window.history.replaceState({}, '', `/boutique${url}`);
      return newFilters;
    });
  }, [generateFilterUrl]);
  
  const clearAllFilters = useCallback(() => {
    setFilters(defaultFilters);
    window.history.replaceState({}, '', '/boutique');
  }, []);
  
  const clearFilter = useCallback((key: keyof FilterState) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: defaultFilters[key] };
      const url = generateFilterUrl(newFilters);
      window.history.replaceState({}, '', `/boutique${url}`);
      return newFilters;
    });
  }, [generateFilterUrl]);
  
  // Compter les filtres actifs
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.materials.length) count += filters.materials.length;
    if (filters.stones.length) count += filters.stones.length;
    if (filters.styles.length) count += filters.styles.length;
    if (filters.occasions.length) count += filters.occasions.length;
    if (filters.colors.length) count += filters.colors.length;
    if (filters.sizes.length) count += filters.sizes.length;
    if (filters.origins.length) count += filters.origins.length;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) count++;
    if (filters.availability.inStock) count++;
    if (filters.availability.newArrivals) count++;
    if (filters.availability.onSale) count++;
    return count;
  }, [filters]);
  
  // Obtenir tous les filtres actifs sous forme de chips
  const activeFilters = useMemo(() => {
    const chips: { key: keyof FilterState; value: string; label: string }[] = [];
    
    filters.materials.forEach(m => {
      const config = FILTER_CONFIG.materials.find(c => c.id === m);
      chips.push({ key: 'materials', value: m, label: config?.label || m });
    });
    
    filters.stones.forEach(s => {
      const config = FILTER_CONFIG.stones.find(c => c.id === s);
      chips.push({ key: 'stones', value: s, label: config?.label || s });
    });
    
    filters.styles.forEach(s => {
      const config = FILTER_CONFIG.styles.find(c => c.id === s);
      chips.push({ key: 'styles', value: s, label: config?.label || s });
    });
    
    filters.occasions.forEach(o => {
      const config = FILTER_CONFIG.occasions.find(c => c.id === o);
      chips.push({ key: 'occasions', value: o, label: config?.label || o });
    });
    
    filters.colors.forEach(c => {
      const config = FILTER_CONFIG.colors.find(conf => conf.id === c);
      chips.push({ key: 'colors', value: c, label: config?.label || c });
    });
    
    filters.origins.forEach(o => {
      const config = FILTER_CONFIG.origins.find(c => c.id === o);
      chips.push({ key: 'origins', value: o, label: config?.label || o });
    });
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      chips.push({
        key: 'priceRange',
        value: 'price',
        label: `${filters.priceRange[0]}€ - ${filters.priceRange[1]}€`,
      });
    }
    
    return chips;
  }, [filters]);
  
  return {
    filters,
    filteredProducts,
    filterCounts,
    activeFilterCount,
    activeFilters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    clearFilter,
    isFiltered: activeFilterCount > 0,
  };
}

export default useFilters;
