'use client';

import { useState, useCallback } from 'react';
import { Product } from '@/lib/types';

const STORAGE_KEY = 'khashika_recently_viewed';
const PREFERENCES_KEY = 'khashika_user_preferences';

export interface UserPreferences {
  // Catégories les plus consultées (ex: "bagues", "colliers")
  topCategories: { category: string; count: number }[];
  // Pierres les plus consultées (ex: "turquoise", "améthyste")
  topStones: { stone: string; count: number }[];
  // Matériaux préférés
  topMaterials: { material: string; count: number }[];
  // Gamme de prix moyenne
  priceRange: { min: number; max: number; avg: number };
  // Nombre total de produits consultés
  totalViewed: number;
}

interface StoredPreferences {
  categories: Record<string, number>;
  stones: Record<string, number>;
  materials: Record<string, number>;
  prices: number[];
  lastUpdated: string;
}

// Fonction statique pour calculer les préférences (utilisée dans l'initialisation)
function computePreferencesStatic(data: StoredPreferences): UserPreferences {
  const topCategories = Object.entries(data.categories)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topStones = Object.entries(data.stones)
    .map(([stone, count]) => ({ stone, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topMaterials = Object.entries(data.materials)
    .map(([material, count]) => ({ material, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const prices = data.prices.filter(p => p > 0);
  const avgPrice = prices.length > 0
    ? prices.reduce((a, b) => a + b, 0) / prices.length
    : 50;
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 200;

  return {
    topCategories,
    topStones,
    topMaterials,
    priceRange: { min: minPrice, max: maxPrice, avg: avgPrice },
    totalViewed: prices.length,
  };
}

/**
 * Hook pour analyser les préférences utilisateur basées sur l'historique de navigation
 */
export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(() => {
    // Initialisation côté client uniquement
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (stored) {
        const data: StoredPreferences = JSON.parse(stored);
        return computePreferencesStatic(data);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [recentlyViewed] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [];
  });

  // Enregistrer un produit consulté
  const trackProduct = useCallback((product: Product) => {
    try {
      // Charger les préférences existantes
      const stored = localStorage.getItem(PREFERENCES_KEY);
      const data: StoredPreferences = stored
        ? JSON.parse(stored)
        : { categories: {}, stones: {}, materials: {}, prices: [], lastUpdated: '' };

      // Incrémenter la catégorie
      if (product.category) {
        data.categories[product.category] = (data.categories[product.category] || 0) + 1;
      }

      // Incrémenter la pierre
      const stone = product.stone || product.attributes?.stone;
      if (stone) {
        data.stones[stone] = (data.stones[stone] || 0) + 1;
      }

      // Incrémenter le matériau
      const material = product.material || product.attributes?.material;
      if (material) {
        data.materials[material] = (data.materials[material] || 0) + 1;
      }

      // Ajouter le prix (garder les 50 derniers)
      const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
      if (price > 0) {
        data.prices.push(price);
        if (data.prices.length > 50) {
          data.prices = data.prices.slice(-50);
        }
      }

      data.lastUpdated = new Date().toISOString();

      // Sauvegarder
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(data));
      setPreferences(computePreferencesStatic(data));
    } catch {
      // ignore storage errors
    }
  }, []);

  // Calculer un score de pertinence pour un produit
  const getRelevanceScore = useCallback((product: Product): number => {
    if (!preferences) return 0;

    let score = 0;

    // Bonus pour catégorie préférée (max 40 points)
    const categoryMatch = preferences.topCategories.find(c => c.category === product.category);
    if (categoryMatch) {
      const categoryRank = preferences.topCategories.indexOf(categoryMatch);
      score += (5 - categoryRank) * 8; // 40, 32, 24, 16, 8
    }

    // Bonus pour pierre préférée (max 30 points)
    const stone = product.stone || product.attributes?.stone;
    if (stone) {
      const stoneMatch = preferences.topStones.find(s => s.stone === stone);
      if (stoneMatch) {
        const stoneRank = preferences.topStones.indexOf(stoneMatch);
        score += (5 - stoneRank) * 6; // 30, 24, 18, 12, 6
      }
    }

    // Bonus pour matériau préféré (max 20 points)
    const material = product.material || product.attributes?.material;
    if (material) {
      const materialMatch = preferences.topMaterials.find(m => m.material === material);
      if (materialMatch) {
        const materialRank = preferences.topMaterials.indexOf(materialMatch);
        score += (5 - materialRank) * 4; // 20, 16, 12, 8, 4
      }
    }

    // Bonus pour prix dans la gamme habituelle (max 10 points)
    const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
    if (price > 0) {
      const avgPrice = preferences.priceRange.avg;
      const priceDeviation = Math.abs(price - avgPrice) / avgPrice;
      if (priceDeviation < 0.2) score += 10;
      else if (priceDeviation < 0.5) score += 5;
    }

    return score;
  }, [preferences]);

  // Obtenir des recommandations personnalisées
  const getPersonalizedRecommendations = useCallback((
    allProducts: Product[],
    excludeIds: string[] = [],
    limit: number = 4
  ): Product[] => {
    if (!preferences || preferences.totalViewed < 3) {
      // Pas assez de données, retourner des produits aléatoires
      return allProducts
        .filter(p => !excludeIds.includes(p.id))
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
    }

    // Exclure les produits déjà vus récemment
    const recentIds = recentlyViewed.map(p => p.id || p.slug);

    return allProducts
      .filter(p => !excludeIds.includes(p.id) && !recentIds.includes(p.id))
      .map(product => ({
        product,
        score: getRelevanceScore(product) + Math.random() * 5, // Petit facteur aléatoire
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.product);
  }, [preferences, recentlyViewed, getRelevanceScore]);

  return {
    preferences,
    recentlyViewed,
    trackProduct,
    getRelevanceScore,
    getPersonalizedRecommendations,
    hasEnoughData: preferences && preferences.totalViewed >= 3,
  };
}

export default useUserPreferences;
