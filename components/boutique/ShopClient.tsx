'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter } from 'lucide-react';
import { Product } from '@/lib/types';
import { SortOption } from '@/lib/types/filters';

// Components
import ProductGrid from './ProductGrid';
import ShopHero from './ShopHero';
import ShopSidebar from './ShopSidebar';
import ActiveFilters from './ActiveFilters';
import EmptyState from './EmptyState';
import MobileFilterModal from './MobileFilterModal';
import ShopPagination from './ShopPagination';

// Hooks
import { useShopFilters } from './hooks/useShopFilters';

interface ShopClientProps {
  initialProducts: Product[];
}

const SORT_OPTIONS = [
  { value: 'relevance' as SortOption, label: 'Pertinence' },
  { value: 'newest' as SortOption, label: 'Nouveautés' },
  { value: 'price_asc' as SortOption, label: 'Prix croissant' },
  { value: 'price_desc' as SortOption, label: 'Prix décroissant' },
];

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const {
    filters,
    filteredProducts,
    allFilteredCount,
    filterCounts,
    priceRange,
    activeFilterCount,
    currentPage,
    totalPages,
    handleToggleFilter,
    handleUpdateFilter,
    handleClearAll,
    handleSort,
    handlePageChange,
  } = useShopFilters(initialProducts);

  return (
    <div className="min-h-screen bg-background">
      <ShopHero productCount={allFilteredCount} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile Bar */}
        <div className="lg:hidden sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-b border-foreground/10 -mx-4 px-4 py-3 mb-6">
          <div className="flex items-center justify-between gap-3">
            <motion.button
              onClick={() => setIsFilterModalOpen(true)}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 bg-card rounded-xl text-sm font-medium relative"
            >
              <Filter className="w-5 h-5" />
              <span>Filtrer</span>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </motion.button>

            <span className="text-sm text-foreground/60">
              <span className="font-semibold text-primary">{allFilteredCount}</span> trésors
            </span>

            <select
              value={filters.sort}
              onChange={(e) => handleSort(e.target.value as SortOption)}
              className="px-3 py-2 bg-card rounded-xl text-sm border-0 focus:ring-2 focus:ring-primary/20"
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
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-foreground/60">
                <span className="font-semibold text-primary">{allFilteredCount}</span>
                {' '}trésors trouvés
                {activeFilterCount > 0 && <span className="text-foreground/40"> (filtrés)</span>}
                {totalPages > 1 && <span className="text-foreground/40"> — Page {currentPage}/{totalPages}</span>}
              </p>

              <select
                value={filters.sort}
                onChange={(e) => handleSort(e.target.value as SortOption)}
                className="px-4 py-2 bg-card rounded-xl border border-foreground/10 text-sm focus:ring-2 focus:ring-primary/20"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Active Filter Chips */}
            <ActiveFilters
              filters={filters}
              activeCount={activeFilterCount}
              onToggle={handleToggleFilter}
              onClearAll={handleClearAll}
            />

            {/* Product Grid or Empty State */}
            {filteredProducts.length > 0 ? (
              <>
                <ProductGrid products={filteredProducts} />
                <ShopPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <EmptyState onClearFilters={handleClearAll} />
            )}
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
