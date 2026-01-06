'use client';
import { useMemo, useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { Product } from '@/lib/types';

interface SearchResult {
  products: Product[];
  suggestions: string[];
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const searchResults: SearchResult = useMemo(() => {
    if (!query.trim() || allProducts.length === 0) {
      return { products: [], suggestions: [] };
    }

    // Ajoute des champs normalisés aux produits
    const productsWithNormalized = allProducts.map(p => ({
      ...p,
      _searchTitle: normalizeText(p.title || p.name || ''),
      _searchDesc: normalizeText(p.description || ''),
      _searchMat: normalizeText(p.material || ''),
      _searchCat: normalizeText(p.category || ''),
    }));

    const fuse = new Fuse(productsWithNormalized, {
      keys: [
        { name: '_searchTitle', weight: 2 },
        { name: '_searchDesc', weight: 1 },
        { name: '_searchMat', weight: 1.5 },
        { name: '_searchCat', weight: 1.5 },
      ],
      threshold: 0.3,
      distance: 100,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });

    const normalizedQuery = normalizeText(query);
    const results = fuse.search(normalizedQuery);

    const products = results.map(result => result.item).slice(0, 20);

    const suggestions: string[] = [];
    if (products.length > 0) {
      const materials = new Set(products.map(p => p.material).filter((m): m is string => Boolean(m)));
      const categories = new Set(products.map(p => p.category).filter((c): c is string => Boolean(c)));
      
      suggestions.push(
        ...Array.from(materials).slice(0, 3),
        ...Array.from(categories).slice(0, 2)
      );
    }

    return {
      products,
      suggestions: suggestions.slice(0, 5),
    };
  }, [query, allProducts]);

  return {
    query,
    setQuery,
    results: searchResults.products,
    suggestions: searchResults.suggestions,
    isLoading,
  };
}
