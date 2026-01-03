import { useState, useMemo, useCallback } from 'react';
import { Product } from '@/lib/types';
import { FilterState, INITIAL_FILTERS, FILTER_CONFIG, SortOption } from '@/lib/types/filters';
import { inferCategory } from '@/lib/utils/inferCategory';

const DEFAULT_PRODUCTS_PER_PAGE = 24;

interface UseShopFiltersOptions {
  initialFilters?: Partial<FilterState>;
}

export function useShopFilters(products: Product[], options?: UseShopFiltersOptions) {
  const initialFiltersState: FilterState = {
    ...INITIAL_FILTERS,
    ...options?.initialFilters,
  };
  const [filters, setFilters] = useState<FilterState>(initialFiltersState);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_PRODUCTS_PER_PAGE);

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
        // Use inferred category from product name ONLY (not description) to avoid false positives
        const inferredCategory = inferCategory(p.name || '');
        
        // Map inferred category to typeId (inferCategory returns 'boucle' but typeId is 'boucles-oreilles')
        const inferredToTypeId: Record<string, string> = {
          'boucle': "boucles d'oreilles",
        };
        const mappedCategory = inferredToTypeId[inferredCategory || ''] || inferredCategory;
        
        // Check if matches any type - compare mapped category directly with typeId
        // Only match if inferred category exactly matches the typeId (no fallback to prevent false positives)
        const matchesType = hasTypeFilter && filters.types.some(typeId => {
          // Direct match: mapped category must match the typeId
          return mappedCategory === typeId;
        });
        
        // Check if matches any accessory - same logic
        const matchesAccessory = hasAccessoryFilter && filters.accessories.some(accId => {
          // For accessories, we need to check the name since inferCategory returns 'accessoire' generically
          const accConfig = FILTER_CONFIG.accessories.find(a => a.id === accId);
          if (!accConfig) return false;
          const nameLower = (p.name || '').toLowerCase();
          return accConfig.searchTerms.some(term => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('\\b' + escapedTerm + 's?\\b', 'i');
            return regex.test(nameLower);
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

    // Stone filter - use stones array (enriched by script)
    if (filters.stones.length > 0) {
      result = result.filter(p => {
        if (!p.stones || !Array.isArray(p.stones)) return false;
        
        // Normalize strings to handle accents (améthyste vs amethyste)
        const normalizeString = (str: string): string => {
          return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove accents
        };
        
        return filters.stones.some(filterStone => {
          const normalizedFilterStone = normalizeString(filterStone);
          return p.stones!.some(stone => {
            const normalizedStone = normalizeString(stone);
            return normalizedStone === normalizedFilterStone;
          });
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

    // Deduplicate products by slug (or name if no slug)
    const seen = new Set<string>();
    const deduplicatedResult = result.filter(product => {
      const key = product.slug || product.name || product.id;
      if (seen.has(key)) {
        return false; // Duplicate, skip it
      }
      seen.add(key);
      return true;
    });

    return deduplicatedResult;
  }, [products, filters]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    // Si -1 (Tout), afficher tous les produits
    if (itemsPerPage === -1) {
      return filteredProducts;
    }
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    if (itemsPerPage === -1) return 1; // Tout = 1 page
    return Math.ceil(filteredProducts.length / itemsPerPage);
  }, [filteredProducts.length, itemsPerPage]);

  // Helper function to apply filters excluding specific categories (for cross-filter counts)
  const applyFiltersExcept = useCallback((productsToFilter: Product[], excludeCategories: string[] = []) => {
    let result = [...productsToFilter];

    // Category filter
    if (!excludeCategories.includes('categories') && filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Price filter
    if (!excludeCategories.includes('price')) {
      result = result.filter(p => 
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    // Types + Accessories filter (exclude if counting types/accessories)
    // When excluding types/accessories, we exclude the entire UNION filter to get accurate cross-filter counts
    const excludeTypesAndAccessories = excludeCategories.includes('types') && excludeCategories.includes('accessories');
    if (!excludeTypesAndAccessories) {
      const hasTypeFilter = filters.types.length > 0 && !excludeCategories.includes('types');
      const hasAccessoryFilter = filters.accessories.length > 0 && !excludeCategories.includes('accessories');
      
      if (hasTypeFilter || hasAccessoryFilter) {
        result = result.filter(p => {
          const inferredCategory = inferCategory(p.name || '');
          const inferredToTypeId: Record<string, string> = {
            'boucle': "boucles d'oreilles",
          };
          const mappedCategory = inferredToTypeId[inferredCategory || ''] || inferredCategory;
          
          const matchesType = hasTypeFilter && filters.types.some(typeId => {
            return mappedCategory === typeId;
          });
          
          const matchesAccessory = hasAccessoryFilter && filters.accessories.some(accId => {
            const accConfig = FILTER_CONFIG.accessories.find(a => a.id === accId);
            if (!accConfig) return false;
            const nameLower = (p.name || '').toLowerCase();
            return accConfig.searchTerms.some(term => {
              const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp('\\b' + escapedTerm + 's?\\b', 'i');
              return regex.test(nameLower);
            });
          });
          
          return matchesType || matchesAccessory;
        });
      }
    }

    // Material filter
    if (!excludeCategories.includes('materials') && filters.materials.length > 0) {
      result = result.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.material || ''}`.toLowerCase();
        return filters.materials.some(m => {
          const term = m.replace('-', ' ').trim();
          const regex = new RegExp('\\b' + term + '\\b', 'i');
          return regex.test(searchText);
        });
      });
    }

    // Stone filter - use stones array (enriched by script)
    if (!excludeCategories.includes('stones') && filters.stones.length > 0) {
      result = result.filter(p => {
        if (!p.stones || !Array.isArray(p.stones)) return false;
        
        // Normalize strings to handle accents (améthyste vs amethyste)
        const normalizeString = (str: string): string => {
          return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, ''); // Remove accents
        };
        
        return filters.stones.some(filterStone => {
          const normalizedFilterStone = normalizeString(filterStone);
          return p.stones!.some(stone => {
            const normalizedStone = normalizeString(stone);
            return normalizedStone === normalizedFilterStone;
          });
        });
      });
    }

    // Style filter
    if (!excludeCategories.includes('styles') && filters.styles.length > 0) {
      result = result.filter(p => {
        const style = (p.style || '').toLowerCase();
        return filters.styles.some(s => style.includes(s));
      });
    }

    // Availability filter
    if (!excludeCategories.includes('availability')) {
      if (filters.availability.newArrivals) {
        result = result.filter(p => p.isNew);
      }
      if (filters.availability.onSale) {
        result = result.filter(p => p.isOnSale);
      }
    }

    return result;
  }, [filters]);

  // Filter counts - cross-filter aware (apply all filters except the category being counted)
  const filterCounts = useMemo(() => {
    const counts = {
      materials: {} as Record<string, number>,
      stones: {} as Record<string, number>,
      styles: {} as Record<string, number>,
      types: {} as Record<string, number>,
      accessories: {} as Record<string, number>,
    };

    // Apply all filters except materials to get base set for material counts
    const productsForMaterialCounts = applyFiltersExcept(products, ['materials']);
    FILTER_CONFIG.materials.forEach(m => {
      const term = m.id.replace('-', ' ').trim();
      const regex = new RegExp('\\b' + term + '\\b', 'i');
      counts.materials[m.id] = productsForMaterialCounts.filter(p => {
        const searchText = `${p.name || ''} ${p.description || ''} ${p.material || ''}`.toLowerCase();
        return regex.test(searchText);
      }).length;
    });

    // Apply all filters except stones to get base set for stone counts
    const productsForStoneCounts = applyFiltersExcept(products, ['stones']);
    FILTER_CONFIG.stones.forEach(s => {
      // Normalize strings to handle accents (améthyste vs amethyste)
      const normalizeString = (str: string): string => {
        return str
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''); // Remove accents
      };
      
      const normalizedFilterStone = normalizeString(s.id);
      counts.stones[s.id] = productsForStoneCounts.filter(p => {
        if (!p.stones || !Array.isArray(p.stones)) return false;
        return p.stones.some(stone => {
          const normalizedStone = normalizeString(stone);
          return normalizedStone === normalizedFilterStone;
        });
      }).length;
    });

    // Apply all filters except types to get base set for type counts
    const productsForTypeCounts = applyFiltersExcept(products, ['types', 'accessories']);
    FILTER_CONFIG.types.forEach(t => {
      counts.types[t.id] = productsForTypeCounts.filter(p => {
        const inferredCategory = inferCategory(p.name || '');
        const inferredToTypeId: Record<string, string> = {
          'boucle': "boucles d'oreilles",
        };
        const mappedCategory = inferredToTypeId[inferredCategory || ''] || inferredCategory;
        
        if (mappedCategory === t.id) {
          return true;
        }
        
        if (inferredCategory === null) {
          const nameLower = (p.name || '').toLowerCase();
          return t.searchTerms.some(term => {
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('\\b' + escapedTerm + 's?\\b', 'i');
            return regex.test(nameLower);
          });
        }
        return false;
      }).length;
    });

    // Apply all filters except accessories to get base set for accessory counts
    const productsForAccessoryCounts = applyFiltersExcept(products, ['types', 'accessories']);
    FILTER_CONFIG.accessories.forEach(a => {
      counts.accessories[a.id] = productsForAccessoryCounts.filter(p => {
        const nameLower = (p.name || '').toLowerCase();
        return a.searchTerms.some(term => {
          const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp('\\b' + escapedTerm + 's?\\b', 'i');
          return regex.test(nameLower);
        });
      }).length;
    });

    return { ...counts, total: filteredProducts.length };
  }, [products, filters, applyFiltersExcept, filteredProducts.length]);

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
  }, [totalPages]);

  const handleItemsPerPageChange = useCallback((count: number) => {
    setItemsPerPage(count);
    setCurrentPage(1); // Reset à la page 1
  }, []);

  return {
    filters,
    filteredProducts: paginatedProducts,
    allFilteredCount: filteredProducts.length,
    filterCounts,
    priceRange,
    activeFilterCount,
    currentPage,
    totalPages,
    itemsPerPage,
    handleToggleFilter,
    handleUpdateFilter,
    handleClearAll,
    handleSort,
    handlePageChange,
    handleItemsPerPageChange,
  };
}

