'use client';

import { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductGrid from './ProductGrid';
import FilterSidebar from './FilterSidebar';
import { FilterState, INITIAL_FILTERS } from '@/lib/types/filters';

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Filtrer les produits selon les filtres actifs
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filtre par catégorie
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }

    // Filtre par prix
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      result = result.filter(
        (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
      );
    }

    // Filtre par matériau
    if (filters.materials.length > 0) {
      result = result.filter(
        (p) => p.material && filters.materials.includes(p.material)
      );
    }

    // Filtre par pierre
    if (filters.stones.length > 0) {
      result = result.filter(
        (p) => p.stone && filters.stones.includes(p.stone)
      );
    }

    return result;
  }, [initialProducts, filters]);

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 flex-shrink-0">
            <FilterSidebar
              products={initialProducts}
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-8">
              <h1 className="font-serif text-4xl text-[#1a1a1a] mb-2">
                Notre Collection
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
              </p>
            </div>

            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </div>
    </div>
  );
}
