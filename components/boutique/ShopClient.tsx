'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Link } from '@/navigation';
import { Product } from '@/lib/types';
import { SortOption } from '@/lib/types/filters';

// Components
import ProductGrid from './ProductGrid';
import ShopSidebar from './ShopSidebar';
import ActiveFilters from './ActiveFilters';
import EmptyState from './EmptyState';
import MobileFilterModal from './MobileFilterModal';
import ShopPagination from './ShopPagination';

// Hooks
import { useShopFilters } from './hooks/useShopFilters';

interface ShopClientProps {
  initialProducts: Product[];
  initialFilters?: Partial<import('@/lib/types/filters').FilterState>;
  pageTitle?: string;
  pageSubtitle?: string;
  searchQuery?: string;
}

const SORT_OPTIONS = [
  { value: 'relevance' as SortOption, label: 'Pertinence' },
  { value: 'newest' as SortOption, label: 'Nouveautés' },
  { value: 'price_asc' as SortOption, label: 'Prix croissant' },
  { value: 'price_desc' as SortOption, label: 'Prix décroissant' },
];

export default function ShopClient({ initialProducts, initialFilters, pageTitle, pageSubtitle, searchQuery }: ShopClientProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const productGridRef = useRef<HTMLDivElement>(null);
  
  const {
    filters,
    filteredProducts,
    allFilteredCount,
    filterCounts,
    priceRange,
    activeFilterCount,
    currentPage,
    totalPages,
    itemsPerPage,
    handleToggleFilter,
    handleUpdateFilter,
    handleClearAll,
    handleSort,
    handlePageChange: originalHandlePageChange,
    handleItemsPerPageChange,
  } = useShopFilters(initialProducts, { initialFilters });

  // Wrapper pour handlePageChange avec scroll vers la grille
  const handlePageChange = (page: number) => {
    originalHandlePageChange(page);
    // Scroll vers la grille produits après un court délai pour laisser le DOM se mettre à jour
    setTimeout(() => {
      if (productGridRef.current) {
        productGridRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback: scroll vers le haut de la page
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-white -mt-[134px] pt-[134px]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Bar */}
        <div className="lg:hidden sticky top-20 z-30 bg-white/95 backdrop-blur-sm border-b border-[#EAB615]/40 -mx-4 px-4 py-3 mb-6">
          <div className="flex items-center justify-between gap-3">
            <motion.button
              onClick={() => setIsFilterModalOpen(true)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EAB615]/30 rounded-none text-sm font-medium relative hover:border-[#EAB615] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]"
            >
              <Filter className="w-5 h-5" />
              <span>Filtrer</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#EAB615] text-white text-xs font-bold rounded-none flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            <span className="text-sm text-foreground/60">
              <span className="font-semibold text-gold-fusion">{allFilteredCount}</span> trésors
            </span>

            <select
              value={filters.sort}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className="px-4 py-2 bg-white border border-[#EAB615]/40 rounded-none text-sm text-[#2D2926] focus:outline-none focus:border-[#EAB615] focus:ring-2 focus:ring-[#EAB615]/20 cursor-pointer"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <ShopSidebar
            filters={filters}
            filterCounts={filterCounts}
            priceRange={priceRange}
            activeFilterCount={activeFilterCount}
            onToggleFilter={handleToggleFilter}
            onUpdateFilter={handleUpdateFilter}
            onClearAll={handleClearAll}
          />

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Container unique pour tout le contenu */}
            <div className="max-w-7xl mx-auto px-4 py-8">
              
              {/* 1. TITRE - En premier */}
              {pageTitle && (
                <div className="mb-6 text-center">
                  <h1 className="font-serif text-3xl md:text-4xl text-[#2D2926]">
                    {pageTitle}
                  </h1>
                  {pageSubtitle && (
                    <p className="text-[#2D2926]/60 mt-2 max-w-2xl mx-auto">
                      {pageSubtitle}
                    </p>
                  )}
                  
                  {/* Bouton pour effacer la recherche */}
                  {searchQuery && (
                    <Link 
                      href="/shop" 
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 text-sm text-[#8B4E4E] border border-[#8B4E4E]/30 hover:bg-[#8B4E4E] hover:text-white transition-colors rounded-none"
                    >
                      <X className="w-4 h-4" />
                      Effacer la recherche
                    </Link>
                  )}
                </div>
              )}

              {/* 2. BARRE DE TRI - Après le titre */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#EAB615]/20">
                {/* Filtres actifs (desktop) */}
                <div className="hidden lg:flex flex-wrap items-center gap-2">
                  <ActiveFilters
                    filters={filters}
                    activeCount={activeFilterCount}
                    onToggle={handleToggleFilter}
                    onClearAll={handleClearAll}
                  />
                </div>
                
                {/* Select tri */}
                <select 
                  value={filters.sort}
                  onChange={(e) => handleSort(e.target.value as SortOption)}
                  className="px-4 py-2 bg-white border border-[#EAB615]/40 rounded-none text-sm text-[#2D2926] focus:outline-none focus:border-[#EAB615] focus:ring-2 focus:ring-[#EAB615]/20 cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* 3. GRILLE PRODUITS - Après le select */}
              {filteredProducts.length > 0 ? (
                <>
                  <div ref={productGridRef}>
                    <ProductGrid products={filteredProducts} />
                  </div>
                  {/* 4. PAGINATION - En bas */}
                  <ShopPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                    totalItems={allFilteredCount}
                  />
                </>
              ) : (
                <>
                  {/* Message si aucun résultat de recherche */}
                  {searchQuery ? (
                    <div className="text-center py-12">
                      <p className="text-[#2D2926]/60 mb-4">
                        Aucun produit ne correspond à votre recherche &quot;{searchQuery}&quot;
                      </p>
                      <Link 
                        href="/shop" 
                        className="inline-block px-6 py-3 bg-[#8B4E4E] text-white hover:bg-[#6B3D3D] transition-colors rounded-none"
                      >
                        Voir tous les produits
                      </Link>
                    </div>
                  ) : (
                    <EmptyState onClearFilters={handleClearAll} />
                  )}
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <MobileFilterModal
            isOpen={isFilterModalOpen}
            filters={filters}
            priceRange={priceRange}
            activeFilterCount={activeFilterCount}
            filteredCount={allFilteredCount}
            onClose={() => setIsFilterModalOpen(false)}
            onToggleFilter={handleToggleFilter}
            onUpdateFilter={handleUpdateFilter}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
