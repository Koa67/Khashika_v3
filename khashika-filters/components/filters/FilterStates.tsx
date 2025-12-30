// ============================================================================
// KHASHIKA - PRODUCT GRID SKELETON
// ============================================================================
// Skeleton loading élégant pour la grille de produits
// Maintient l'esthétique luxe pendant le chargement
// ============================================================================

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProductGridSkeletonProps {
  count?: number;
  columns?: number;
}

export function ProductGridSkeleton({ 
  count = 12, 
  columns = 4 
}: ProductGridSkeletonProps) {
  return (
    <div 
      className="grid gap-6"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} delay={index * 0.05} />
      ))}
    </div>
  );
}

function ProductCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="bg-[#F5EDE6] rounded-2xl overflow-hidden border border-gray-100"
    >
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay,
          }}
        />
      </div>
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded-full w-3/4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          </div>
          <div className="h-4 bg-gray-100 rounded-full w-1/2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 bg-gray-100 rounded-full w-20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          </div>
          <div className="h-8 w-8 bg-gray-100 rounded-full relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// KHASHIKA - EMPTY STATE
// ============================================================================
// État vide élégant quand aucun produit ne correspond aux filtres
// ============================================================================

interface EmptyStateProps {
  onClearFilters: () => void;
}

export function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      {/* Illustration */}
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-32 h-32 mb-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#8B4E4E]/20 to-[#40c4ff]/20 
                       rounded-full animate-pulse" />
        <div className="absolute inset-4 bg-gradient-to-br from-[#8B4E4E]/30 to-[#40c4ff]/30 
                       rounded-full" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">💎</span>
        </div>
      </motion.div>
      
      {/* Message */}
      <h3 className="font-serif text-xl text-gray-900 mb-2">
        Aucun trésor trouvé
      </h3>
      <p className="text-gray-500 mb-6 max-w-md">
        Nous n'avons pas de bijoux correspondant à ces critères pour le moment. 
        Essayez d'élargir votre recherche ou de modifier vos filtres.
      </p>
      
      {/* CTA */}
      <motion.button
        onClick={onClearFilters}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="px-6 py-3 bg-[#8B4E4E] text-white rounded-xl font-medium
                  hover:bg-[#1a7a9e] transition-colors shadow-lg shadow-[#8B4E4E]/20"
      >
        Effacer tous les filtres
      </motion.button>
      
      {/* Suggestions */}
      <div className="mt-8 pt-8 border-t border-gray-100 w-full max-w-md">
        <p className="text-sm text-gray-400 mb-3">Suggestions populaires :</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Bagues', 'Colliers', 'Turquoise', 'Argent 925'].map((suggestion) => (
            <button
              key={suggestion}
              className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm
                        hover:bg-gray-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// KHASHIKA - FILTER BADGE
// ============================================================================
// Badge pour indiquer le nombre de filtres actifs
// ============================================================================

export function FilterBadge({ count }: { count: number }) {
  if (count === 0) return null;
  
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      className="absolute -top-1 -right-1 w-5 h-5 bg-[#8B4E4E] text-white text-xs 
                font-bold rounded-full flex items-center justify-center
                shadow-lg shadow-[#8B4E4E]/30"
    >
      {count > 9 ? '9+' : count}
    </motion.span>
  );
}
