// ============================================================================
// KHASHIKA - BOUTIQUE PAGE
// ============================================================================
// Page de la boutique avec système de filtrage complet
// Design luxueux et responsive
// ============================================================================

'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

// Import des composants de filtrage
import {
  useFilters,
  FilterSidebar,
  FilterModal,
  ActiveFilterChips,
  SortDropdown,
  MobileFilterBar,
  ProductGridSkeleton,
  EmptyState,
} from '@/components/filters';

// Import des données produits
import { products } from '@/lib/data/products-ultimate.json';

// ============================================================================
// TYPES
// ============================================================================

interface Product {
  id: string;
  name: string;
  slug: string;
  price: string;
  image: string;
  images?: string[];
  category?: string;
  material?: string;
  stone?: string;
  description?: string;
  inStock?: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

// ============================================================================
// PRODUCT CARD COMPONENT
// ============================================================================

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const hasMultipleImages = product.images && product.images.length > 1;
  const displayImage = isHovered && hasMultipleImages 
    ? product.images![1] 
    : product.image;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-[#F5EDE6] rounded-2xl overflow-hidden 
                border border-gray-100 hover:border-[#8B4E4E]/30
                shadow-sm hover:shadow-xl hover:shadow-[#8B4E4E]/5
                transition-all duration-500"
    >
      <Link href={`/produit/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#F5EDE6]">
          {/* Skeleton pendant le chargement */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          
          {/* Image principale */}
          <Image
            src={displayImage || '/images/placeholder.jpg'}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-out
                       ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                       ${isHovered ? 'scale-105' : 'scale-100'}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay au hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-[#8B4E4E] text-white text-xs 
                             font-semibold rounded-full shadow-lg">
                Nouveau
              </span>
            )}
            {product.isSale && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs 
                             font-semibold rounded-full shadow-lg">
                -20%
              </span>
            )}
          </div>
          
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
            className="absolute bottom-3 right-3 flex gap-2"
          >
            <button
              className="p-2.5 bg-[#F5EDE6]/90 backdrop-blur-sm rounded-full shadow-lg
                        hover:bg-[#F5EDE6] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to wishlist
              }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button
              className="p-2.5 bg-[#F5EDE6]/90 backdrop-blur-sm rounded-full shadow-lg
                        hover:bg-[#F5EDE6] transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Quick view
              }}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </motion.div>
        </div>
        
        {/* Content */}
        <div className="p-4">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-[#8B4E4E] font-medium uppercase tracking-wider mb-1">
              {product.category}
            </p>
          )}
          
          {/* Name */}
          <h3 className="font-medium text-gray-900 line-clamp-2 mb-2 
                        group-hover:text-[#8B4E4E] transition-colors">
            {product.name}
          </h3>
          
          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-900">
              {parseFloat(product.price) > 0 
                ? `${parseFloat(product.price).toFixed(2)}€`
                : 'Prix sur demande'
              }
            </p>
            
            {/* Add to cart mini button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-[#8B4E4E]/10 rounded-full text-[#8B4E4E]
                        hover:bg-[#8B4E4E] hover:text-white transition-all"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Add to cart
              }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

// ============================================================================
// PRODUCT GRID
// ============================================================================

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

function ProductGrid({ products, isLoading }: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton count={12} columns={4} />;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// MAIN SHOP PAGE
// ============================================================================

export default function ShopPage() {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Hook de gestion des filtres
  const {
    filters,
    filteredProducts,
    filterCounts,
    activeFilterCount,
    activeFilters,
    updateFilter,
    toggleArrayFilter,
    clearAllFilters,
    clearFilter,
    isFiltered,
  } = useFilters(products as Product[]);
  
  // Simuler un loading lors du changement de filtres
  const handleToggleFilter = (key: keyof typeof filters, value: string) => {
    setIsLoading(true);
    toggleArrayFilter(key, value);
    setTimeout(() => setIsLoading(false), 300);
  };
  
  const handleUpdateFilter = <K extends keyof typeof filters>(
    key: K,
    value: (typeof filters)[K]
  ) => {
    setIsLoading(true);
    updateFilter(key, value);
    setTimeout(() => setIsLoading(false), 300);
  };
  
  const handleRemoveFilter = (key: keyof typeof filters, value: string) => {
    if (key === 'priceRange') {
      clearFilter('priceRange');
    } else {
      toggleArrayFilter(key, value);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5EDE6]/50">
      {/* Hero Banner */}
      <section className="relative h-48 md:h-64 bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4e] 
                         overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-3xl md:text-4xl lg:text-5xl text-white mb-2"
            >
              Notre Collection
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-white/70 text-lg"
            >
              Découvrez nos {filteredProducts.length} trésors uniques
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#8B4E4E]/20 rounded-full 
                       blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-1/2 bottom-0 w-96 h-32 bg-[#E8B71B]/10 rounded-full 
                       blur-3xl translate-y-1/2" />
      </section>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Mobile Filter Bar */}
        <MobileFilterBar
          activeFilterCount={activeFilterCount}
          totalResults={filteredProducts.length}
          sortBy={filters.sortBy}
          onOpenFilters={() => setIsFilterModalOpen(true)}
          onSortChange={(value) => handleUpdateFilter('sortBy', value)}
        />
        
        <div className="flex gap-8 mt-6 lg:mt-0">
          
          {/* Desktop Sidebar */}
          <FilterSidebar
            filters={filters}
            filterCounts={filterCounts}
            onToggleFilter={handleToggleFilter}
            onUpdateFilter={handleUpdateFilter}
            onClearAll={clearAllFilters}
            activeFilterCount={activeFilterCount}
            totalResults={filteredProducts.length}
          />
          
          {/* Product Area */}
          <div className="flex-1 min-w-0">
            
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <div>
                <h2 className="sr-only">Produits</h2>
                <motion.p
                  key={filteredProducts.length}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-gray-600"
                >
                  <span className="font-semibold text-[#8B4E4E]">{filteredProducts.length}</span>
                  {' '}trésors trouvés
                  {isFiltered && <span className="text-gray-400"> (filtrés)</span>}
                </motion.p>
              </div>
              
              <SortDropdown
                value={filters.sortBy}
                onChange={(value) => handleUpdateFilter('sortBy', value)}
              />
            </div>
            
            {/* Active Filter Chips */}
            <ActiveFilterChips
              activeFilters={activeFilters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={clearAllFilters}
            />
            
            {/* Product Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} isLoading={isLoading} />
            ) : (
              <EmptyState onClearFilters={clearAllFilters} />
            )}
            
            {/* Load More */}
            {filteredProducts.length > 24 && (
              <div className="flex justify-center mt-12">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-3 border-2 border-[#8B4E4E] text-[#8B4E4E] 
                            rounded-xl font-medium hover:bg-[#8B4E4E] hover:text-white
                            transition-all duration-300"
                >
                  Charger plus de trésors
                </motion.button>
              </div>
            )}
            
          </div>
        </div>
      </main>
      
      {/* Mobile Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        filterCounts={filterCounts}
        onToggleFilter={handleToggleFilter}
        onUpdateFilter={handleUpdateFilter}
        onClearAll={clearAllFilters}
        activeFilterCount={activeFilterCount}
        totalResults={filteredProducts.length}
      />
    </div>
  );
}
