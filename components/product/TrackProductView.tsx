'use client';

import { useEffect } from 'react';
import { Product } from '@/lib/types';

const STORAGE_KEY = 'khashika_recently_viewed';
const PREFERENCES_KEY = 'khashika_user_preferences';
const MAX_ITEMS = 10;

interface StoredPreferences {
  categories: Record<string, number>;
  stones: Record<string, number>;
  materials: Record<string, number>;
  prices: number[];
  lastUpdated: string;
}

export default function TrackProductView({ product }: { product: Product }) {
  useEffect(() => {
    if (!product?.slug) return;

    try {
      // 1. Mettre à jour les produits récemment vus
      const stored = localStorage.getItem(STORAGE_KEY);
      const products: Product[] = stored ? JSON.parse(stored) : [];
      const filtered = products.filter(p => p.slug !== product.slug);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // 2. Mettre à jour les préférences utilisateur
      const prefStored = localStorage.getItem(PREFERENCES_KEY);
      const prefs: StoredPreferences = prefStored
        ? JSON.parse(prefStored)
        : { categories: {}, stones: {}, materials: {}, prices: [], lastUpdated: '' };

      // Incrémenter la catégorie
      if (product.category) {
        prefs.categories[product.category] = (prefs.categories[product.category] || 0) + 1;
      }

      // Incrémenter la pierre
      const stone = product.stone || product.attributes?.stone;
      if (stone) {
        prefs.stones[stone] = (prefs.stones[stone] || 0) + 1;
      }

      // Incrémenter le matériau
      const material = product.material || product.attributes?.material;
      if (material) {
        prefs.materials[material] = (prefs.materials[material] || 0) + 1;
      }

      // Ajouter le prix (garder les 50 derniers)
      const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
      if (price > 0) {
        prefs.prices.push(price);
        if (prefs.prices.length > 50) {
          prefs.prices = prefs.prices.slice(-50);
        }
      }

      prefs.lastUpdated = new Date().toISOString();
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch {
      // ignore storage errors
    }
  }, [product]);

  return null;
}
