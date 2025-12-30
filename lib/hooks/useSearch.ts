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
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
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

  // Configurer Fuse.js avec les poids et includeMatches - Recherche fuzzy tolérante
  const fuse = useMemo(() => {
    if (allProducts.length === 0) return null;
    
    return new Fuse(allProducts, {
      keys: [
        { name: 'name', weight: 0.4 },           // Nom = priorité haute
        { name: 'category', weight: 0.2 },       // Catégorie
        { name: 'attributes.stone', weight: 0.2 }, // Pierre (via attributes)
        { name: 'stone', weight: 0.2 },          // Pierre (direct)
        { name: 'attributes.material', weight: 0.1 }, // Matériau (via attributes)
        { name: 'material', weight: 0.1 },       // Matériau (direct)
        { name: 'description', weight: 0.1 },    // Description
      ],
      threshold: 0.4,          // 0 = exact, 1 = tout accepter (0.4 = tolérant)
      distance: 100,           // Distance max entre caractères
      includeScore: true,      // Inclure le score de pertinence
      ignoreLocation: true,    // Chercher partout dans le texte
      minMatchCharLength: 2,   // Min 2 caractères pour matcher
      shouldSort: true,        // Trier par pertinence
      findAllMatches: true,    // Trouver toutes les correspondances
      useExtendedSearch: true, // Recherche étendue
      includeMatches: true,    // Pour le highlighting
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
