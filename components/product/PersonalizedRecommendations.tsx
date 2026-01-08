'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { useUserPreferences } from '@/lib/hooks/useUserPreferences';
import { Sparkles } from 'lucide-react';

interface PersonalizedRecommendationsProps {
  allProducts: Product[];
  currentProductId?: string;
  fallbackProducts?: Product[];
  title?: string;
  limit?: number;
}

export default function PersonalizedRecommendations({
  allProducts,
  currentProductId,
  fallbackProducts = [],
  title = 'Sélectionné pour vous',
  limit = 4,
}: PersonalizedRecommendationsProps) {
  const { getPersonalizedRecommendations, hasEnoughData, preferences } = useUserPreferences();

  const { recommendations, isPersonalized } = useMemo(() => {
    const excludeIds = currentProductId ? [currentProductId] : [];

    if (hasEnoughData) {
      // Recommandations personnalisées
      const personalized = getPersonalizedRecommendations(allProducts, excludeIds, limit);
      return { recommendations: personalized, isPersonalized: true };
    } else if (fallbackProducts.length > 0) {
      // Fallback sur les produits similaires fournis
      return { recommendations: fallbackProducts.slice(0, limit), isPersonalized: false };
    } else {
      // Fallback sur des produits variés (tri déterministe par hash du slug)
      const varied = allProducts
        .filter(p => !excludeIds.includes(p.id))
        .sort((a, b) => (a.slug || '').localeCompare(b.slug || ''))
        .slice(0, limit);
      return { recommendations: varied, isPersonalized: false };
    }
  }, [allProducts, currentProductId, fallbackProducts, limit, hasEnoughData, getPersonalizedRecommendations]);

  if (recommendations.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-[#EAB615]/20">
      <div className="flex items-center gap-2 mb-6">
        {isPersonalized && (
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
        )}
        <h2 className="font-serif text-xl text-[#2D2926]">
          {isPersonalized ? title : 'Vous aimerez aussi'}
        </h2>
        {isPersonalized && preferences && (
          <span className="text-xs text-[#2D2926]/40 ml-2">
            Basé sur vos {preferences.totalViewed} dernières visites
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recommendations.map((product) => (
          <ProductCard
            key={product.id || product.slug}
            product={product}
            priority={false}
          />
        ))}
      </div>

      {/* Debug info en dev */}
      {process.env.NODE_ENV === 'development' && isPersonalized && preferences && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs text-gray-600">
          <p><strong>Debug Préférences:</strong></p>
          <p>Top catégories: {preferences.topCategories.map(c => `${c.category}(${c.count})`).join(', ') || 'aucune'}</p>
          <p>Top pierres: {preferences.topStones.map(s => `${s.stone}(${s.count})`).join(', ') || 'aucune'}</p>
          <p>Prix moyen: {preferences.priceRange.avg.toFixed(0)}€</p>
        </div>
      )}
    </section>
  );
}
