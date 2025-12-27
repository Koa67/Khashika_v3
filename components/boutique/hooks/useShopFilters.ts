import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/lib/types';
import { FilterState, INITIAL_FILTERS, FILTER_CONFIG, SortOption } from '@/lib/types/filters';

const PRODUCTS_PER_PAGE = 24;

export function useShopFilters(products: Product[]) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);

  // Price range fixed to 1-50€
  const priceRange = useMemo(() => {
    return { min: 1, max: 50 };
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Price filter
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Types + Accessories filter (UNION/OR between them, AND with other filters)
    const hasTypeFilter = filters.types.length > 0;
    const hasAccessoryFilter = filters.accessories.length > 0;
    
    if (hasTypeFilter || hasAccessoryFilter) {
      result = result.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        
        // Check if matches any type
        const matchesType = hasTypeFilter && filters.types.some(typeId => {
          const typeConfig = FILTER_CONFIG.types.find(t => t.id === typeId);
          if (!typeConfig) return false;
          return typeConfig.searchTerms.some(term => {
            const regex = new RegExp('\\b' + term + '\\b', 'i');
            return regex.test(searchText);
          });
        });
        
        // Check if matches any accessory
        const matchesAccessory = hasAccessoryFilter && filters.accessories.some(accId => {
          const accConfig = FILTER_CONFIG.accessories.find(a => a.id === accId);
          if (!accConfig) return false;
          return accConfig.searchTerms.some(term => {
            const regex = new RegExp('\\b' + term + '\\b', 'i');
            return regex.test(searchText);
          });
        });
        
        // UNION: pass if matches type OR accessory
        return matchesType || matchesAccessory;
      });
    }

    // Material filter - use word boundary matching to avoid false positives
    if (filters.materials.length > 0) {
      result = result.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.material || ''}`.toLowerCase();
        return filters.materials.some(m => {
          const term = m.replace('-', ' ').trim();
          // Use word boundary regex for accurate matching
          const regex = new RegExp('\\b' + term + '\\b', 'i');
          return regex.test(searchText);
        });
      });
    }

    // Stone filter - use word boundary matching
    if (filters.stones.length > 0) {
      result = result.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.stone || ''}`.toLowerCase();
        return filters.stones.some(s => {
          const term = s.replace('-', ' ');
          const regex = new RegExp('\\b' + term + '\\b', 'i');
          return regex.test(searchText);
        });
      });
    }

    // Style filter
    if (filters.styles.length > 0) {
      result = result.filter(p => {
        const style = (p.style || '').toLowerCase();
        return filters.styles.some(s => style.includes(s));
      });
    }

    // Availability filter
    if (filters.availability.newArrivals) {
      result = result.filter(p => p.isNew);
    }
    if (filters.availability.onSale) {
      result = result.filter(p => p.isOnSale);
    }

    // Sort
    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    const end = start + PRODUCTS_PER_PAGE;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Filter counts - use word boundary matching for accurate counts
  const filterCounts = useMemo(() => {
    const counts = {
      materials: {} as Record<string, number>,
      stones: {} as Record<string, number>,
      styles: {} as Record<string, number>,
      types: {} as Record<string, number>,
      accessories: {} as Record<string, number>,
    };

    FILTER_CONFIG.materials.forEach(m => {
      const term = m.id.replace('-', ' ').trim();
      const regex = new RegExp('\\b' + term + '\\b', 'i');
      counts.materials[m.id] = products.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.material || ''}`.toLowerCase();
        return regex.test(searchText);
      }).length;
    });

    FILTER_CONFIG.stones.forEach(s => {
      const term = s.id.replace('-', ' ');
      const regex = new RegExp('\\b' + term + '\\b', 'i');
      counts.stones[s.id] = products.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.stone || ''}`.toLowerCase();
        return regex.test(searchText);
      }).length;
    });

    FILTER_CONFIG.types.forEach(t => {
      counts.types[t.id] = products.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        return t.searchTerms.some(term => {
          const regex = new RegExp('\\b' + term + '\\b', 'i');
          return regex.test(searchText);
        });
      }).length;
    });

    FILTER_CONFIG.accessories.forEach(a => {
      counts.accessories[a.id] = products.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        return a.searchTerms.some(term => {
          const regex = new RegExp('\\b' + term + '\\b', 'i');
          return regex.test(searchText);
        });
      }).length;
    });

    return { ...counts, total: filteredProducts.length };
  }, [products, filteredProducts]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.materials.length) count += filters.materials.length;
    if (filters.stones.length) count += filters.stones.length;
    if (filters.styles.length) count += filters.styles.length;
    if (filters.occasions.length) count += filters.occasions.length;
    if (filters.types.length) count += filters.types.length;
    if (filters.accessories.length) count += filters.accessories.length;
    if (filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max) count++;
    if (filters.availability.inStock) count++;
    if (filters.availability.newArrivals) count++;
    if (filters.availability.onSale) count++;
    return count;
  }, [filters, priceRange]);

  // Handlers
  const handleToggleFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const handleUpdateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS, priceRange: [priceRange.min, priceRange.max] });
    setCurrentPage(1);
  }, [priceRange]);

  const handleSort = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort }));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  return {
    filters,
    filteredProducts: paginatedProducts,
    allFilteredCount: filteredProducts.length,
    filterCounts,
    priceRange,
    activeFilterCount,
    currentPage,
    totalPages,
    handleToggleFilter,
    handleUpdateFilter,
    handleClearAll,
    handleSort,
    handlePageChange,
  };
}

