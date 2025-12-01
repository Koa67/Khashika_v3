'use client';

import { useMemo, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Product } from '@/lib/types';
import productsData from '@/lib/data/products-full.json';

// Extraire le tableau de produits depuis le JSON
const getProductsArray = (): Product[] => {
  const data = productsData as { products?: Product[] } | Product[];
  return Array.isArray(data) ? data : (data.products || []);
};

interface SearchResult {
  products: Product[];
  suggestions: string[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger tous les produits une seule fois au montage
  useEffect(() => {
    // Simuler un léger délai pour l'UX
    const timer = setTimeout(() => {
      const products = getProductsArray();
      setAllProducts(products);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Configurer Fuse.js avec les poids et includeMatches
  const fuse = useMemo(() => {
    if (allProducts.length === 0) return null;
    
    return new Fuse(allProducts, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'category', weight: 0.5 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.4, // Tolérance aux fautes
      includeMatches: true, // Pour le highlighting
      minMatchCharLength: 2,
    });
  }, [allProducts]);

  // Calculer les résultats : produits + suggestions
  const results: SearchResult = useMemo(() => {
    if (!query || query.length < 2 || !fuse) {
      return { products: [], suggestions: [] };
    }

    const fuseResults = fuse.search(query, { limit: 5 });
    
    // Extraire les produits (top 5)
    const products = fuseResults.map((result) => result.item);

    // Extraire les catégories uniques des résultats pour les suggestions
    const categories = new Set<string>();
    fuseResults.forEach((result) => {
      if (result.item.category) {
        categories.add(result.item.category);
      }
    });
    
    const suggestions = Array.from(categories).slice(0, 3); // Max 3 suggestions

    return { products, suggestions };
  }, [query, fuse]);

  return { 
    query, 
    setQuery, 
    results: results.products,
    suggestions: results.suggestions,
    isLoading,
    fuseInstance: fuse, // Exposer pour le highlighting
  };
}
