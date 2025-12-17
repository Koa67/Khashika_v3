'use client';

import { useMemo, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Product } from '@/lib/types';

interface SearchResult {
  products: Product[];
  suggestions: string[];
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charger tous les produits une seule fois au montage via API uniquement
  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          signal: controller.signal,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const json = await response.json();
        // Handle API response format: { success: true, data: [...] }
        const products = Array.isArray(json) 
          ? json 
          : (json.data || json.products || []);
        
        if (alive) {
          setAllProducts(products);
        }
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Erreur chargement produits pour recherche:', error);
          if (alive) {
            setAllProducts([]);
          }
        }
      } finally {
        if (alive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      alive = false;
      controller.abort();
    };
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
