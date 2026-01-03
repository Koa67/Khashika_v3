'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types';

const STORAGE_KEY = 'khashika_recently_viewed';
const MAX_ITEMS = 5;

export function useRecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setRecentProducts(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addProduct = useCallback((product: Product) => {
    setRecentProducts(prev => {
      const filtered = prev.filter(p => p.slug !== product.slug);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setRecentProducts([]);
  }, []);

  return { recentProducts, addProduct, clearRecent };
}
