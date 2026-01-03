'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/types';

const STORAGE_KEY = 'khashika_recently_viewed';
const MAX_ITEMS = 5;

export default function TrackProductView({ product }: { product: Product }) {
  useEffect(() => {
    if (!product?.slug) return;
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const products: Product[] = stored ? JSON.parse(stored) : [];
      const filtered = products.filter(p => p.slug !== product.slug);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [product]);

  return null;
}
