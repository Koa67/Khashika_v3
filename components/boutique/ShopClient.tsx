'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, RotateCcw, ChevronDown } from 'lucide-react';
import { Product } from '@/lib/types';
import ProductGrid from './ProductGrid';
import { FilterState, INITIAL_FILTERS, FILTER_CONFIG, SortOption } from '@/lib/types/filters';

// Import des nouveaux composants
import PriceRangeSlider from '@/components/filters/PriceRangeSlider';

interface ShopClientProps {
  initialProducts: Product[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Calculer la plage de prix des produits
  const priceRange = useMemo(() => {
    const prices = initialProducts.map(p => p.price).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 500 };
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    };
  }, [initialProducts]);

  // Filtrer les produits
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filtre par catégorie
    if (filters.categories.length > 0) {
      result = result.filter(p => filters.categories.includes(p.category));
    }

    // Filtre par prix
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filtre par matériau
    if (filters.materials.length > 0) {
      result = result.filter(p => {
        const mat = (p.material || p.attributes?.material || '').toLowerCase();
        return filters.materials.some(m => mat.includes(m.replace('-', ' ')));
      });
    }

    // Filtre par pierre
    if (filters.stones.length > 0) {
      result = result.filter(p => {
        const stone = (p.stone || p.attributes?.stone || p.name || '').toLowerCase();
        return filters.stones.some(s => stone.includes(s.replace('-', ' ')));
      });
    }

    // Filtre par style
    if (filters.styles.length > 0) {
      result = result.filter(p => {
        const style = (p.style || '').toLowerCase();
        return filters.styles.some(s => style.includes(s));
      });
    }

    // Filtre disponibilité
    if (filters.availability.newArrivals) {
      result = result.filter(p => p.isNew);
    }
    if (filters.availability.onSale) {
      result = result.filter(p => p.isOnSale);
    }

    // Tri
    switch (filters.sort) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
    }

    return result;
  }, [initialProducts, filters]);

  // Compteurs pour les filtres
  const filterCounts = useMemo(() => {
    const counts = {
      materials: {} as Record<string, number>,
      stones: {} as Record<string, number>,
      styles: {} as Record<string, number>,
    };

    FILTER_CONFIG.materials.forEach(m => {
      counts.materials[m.id] = initialProducts.filter(p => {
        const mat = (p.material || p.attributes?.material || '').toLowerCase();
        return mat.includes(m.id.replace('-', ' '));
      }).length;
    });

    FILTER_CONFIG.stones.forEach(s => {
      counts.stones[s.id] = initialProducts.filter(p => {
        const stone = (p.stone || p.attributes?.stone || p.name || '').toLowerCase();
        return stone.includes(s.id.replace('-', ' '));
      }).length;
    });

    return { ...counts, total: filteredProducts.length };
  }, [initialProducts, filteredProducts]);

  // Handlers
  const handleToggleFilter = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(v => v !== value)
        : [...currentArray, value];
      return { ...prev, [key]: newArray };
    });
  }, []);

  const handleUpdateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS, priceRange: [priceRange.min, priceRange.max] });
  }, [priceRange]);

  // Compter les filtres actifs
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.materials.length) count += filters.materials.length;
    if (filters.stones.length) count += filters.stones.length;
    if (filters.styles.length) count += filters.styles.length;
    if (filters.occasions.length) count += filters.occasions.length;
    if (filters.priceRange[0] > priceRange.min || filters.priceRange[1] < priceRange.max) count++;
    if (filters.availability.inStock) count++;
    if (filters.availability.newArrivals) count++;
    if (filters.availability.onSale) count++;
    return count;
  }, [filters, priceRange]);

  // Options de tri
  const sortOptions = [
    { value: 'relevance' as SortOption, label: 'Pertinence' },
    { value: 'newest' as SortOption, label: 'Nouveautés' },
    { value: 'price_asc' as SortOption, label: 'Prix croissant' },
    { value: 'price_desc' as SortOption, label: 'Prix décroissant' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner */}
      <section className="relative h-48 md:h-64 bg-gradient-to-r from-[#1a1a2e] to-[#2a2a4e] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,150,190,0.3),transparent_70%)]" />
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
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Barre mobile */}
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
              <span className="font-semibold text-primary">{filteredProducts.length}</span> trésors
            </span>

            <select
              value={filters.sort}
              onChange={(e) => handleUpdateFilter('sort', e.target.value as SortOption)}
              className="px-3 py-2 bg-card rounded-xl text-sm border-0 focus:ring-2 focus:ring-primary/20"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24 bg-card rounded-2xl border border-foreground/10 p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl">Filtres</h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Réinitialiser
                  </button>
                )}
              </div>

              <p className="text-sm text-foreground/60 mb-6">
                <span className="font-semibold text-primary">{filteredProducts.length}</span> trésors trouvés
              </p>

              {/* Prix */}
              <div className="mb-6 pb-6 border-b border-foreground/10">
                <h3 className="font-medium mb-4">Prix</h3>
                <PriceRangeSlider
                  min={priceRange.min}
                  max={priceRange.max}
                  value={filters.priceRange}
                  onChange={(value) => handleUpdateFilter('priceRange', value)}
                />
              </div>

              {/* Matériaux */}
              <div className="mb-6 pb-6 border-b border-foreground/10">
                <h3 className="font-medium mb-4">Matière</h3>
                <div className="space-y-2">
                  {FILTER_CONFIG.materials.map(mat => (
                    <label key={mat.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.materials.includes(mat.id)}
                        onChange={() => handleToggleFilter('materials', mat.id)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span className="text-lg">{mat.icon}</span>
                      <span className="text-foreground/80 group-hover:text-primary transition-colors">
                        {mat.label}
                      </span>
                      <span className="ml-auto text-xs text-foreground/40">
                        ({filterCounts.materials[mat.id] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Pierres */}
              <div className="mb-6 pb-6 border-b border-foreground/10">
                <h3 className="font-medium mb-4">Pierre</h3>
                <div className="space-y-2">
                  {FILTER_CONFIG.stones.map(stone => (
                    <label key={stone.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.stones.includes(stone.id)}
                        onChange={() => handleToggleFilter('stones', stone.id)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <span 
                        className="w-4 h-4 rounded-full border border-foreground/20"
                        style={{ backgroundColor: stone.color }}
                      />
                      <span className="text-foreground/80 group-hover:text-primary transition-colors">
                        {stone.label}
                      </span>
                      <span className="ml-auto text-xs text-foreground/40">
                        ({filterCounts.stones[stone.id] || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div className="mb-6">
                <h3 className="font-medium mb-4">Occasion</h3>
                <div className="flex flex-wrap gap-2">
                  {FILTER_CONFIG.occasions.map(occ => (
                    <button
                      key={occ.id}
                      onClick={() => handleToggleFilter('occasions', occ.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all border
                        ${filters.occasions.includes(occ.id)
                          ? 'bg-primary text-white border-primary'
                          : 'bg-card border-foreground/20 hover:border-primary/50'
                        }`}
                    >
                      <span>{occ.emoji}</span>
                      <span>{occ.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Disponibilité */}
              <div>
                <h3 className="font-medium mb-4">Disponibilité</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-foreground/80">
                      <span>🆕</span> Nouveautés
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.availability.newArrivals}
                      onChange={() => handleUpdateFilter('availability', {
                        ...filters.availability,
                        newArrivals: !filters.availability.newArrivals,
                      })}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-2 text-foreground/80">
                      <span>🏷️</span> Promotions
                    </span>
                    <input
                      type="checkbox"
                      checked={filters.availability.onSale}
                      onChange={() => handleUpdateFilter('availability', {
                        ...filters.availability,
                        onSale: !filters.availability.onSale,
                      })}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Grille produits */}
          <main className="flex-1 min-w-0">
            {/* Header desktop */}
            <div className="hidden lg:flex items-center justify-between mb-6">
              <p className="text-foreground/60">
                <span className="font-semibold text-primary">{filteredProducts.length}</span>
                {' '}trésors trouvés
                {activeFilterCount > 0 && <span className="text-foreground/40"> (filtrés)</span>}
              </p>

              <select
                value={filters.sort}
                onChange={(e) => handleUpdateFilter('sort', e.target.value as SortOption)}
                className="px-4 py-2 bg-card rounded-xl border border-foreground/10 text-sm focus:ring-2 focus:ring-primary/20"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Chips filtres actifs */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-foreground/60">Filtres :</span>
                {filters.materials.map(m => {
                  const mat = FILTER_CONFIG.materials.find(x => x.id === m);
                  return (
                    <button
                      key={m}
                      onClick={() => handleToggleFilter('materials', m)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-full text-sm group"
                    >
                      <span>{mat?.icon}</span>
                      <span>{mat?.label}</span>
                      <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                    </button>
                  );
                })}
                {filters.stones.map(s => {
                  const stone = FILTER_CONFIG.stones.find(x => x.id === s);
                  return (
                    <button
                      key={s}
                      onClick={() => handleToggleFilter('stones', s)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-full text-sm group"
                    >
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stone?.color }} />
                      <span>{stone?.label}</span>
                      <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                    </button>
                  );
                })}
                {filters.occasions.map(o => {
                  const occ = FILTER_CONFIG.occasions.find(x => x.id === o);
                  return (
                    <button
                      key={o}
                      onClick={() => handleToggleFilter('occasions', o)}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-full text-sm group"
                    >
                      <span>{occ?.emoji}</span>
                      <span>{occ?.label}</span>
                      <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
                    </button>
                  );
                })}
                {activeFilterCount > 1 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-1 px-2.5 py-1 text-sm text-primary hover:underline"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tout effacer
                  </button>
                )}
              </div>
            )}

            {/* Grille ou état vide */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                <div className="w-24 h-24 mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-4xl">💎</span>
                </div>
                <h3 className="font-serif text-xl mb-2">Aucun trésor trouvé</h3>
                <p className="text-foreground/60 mb-6">
                  Essayez d'élargir votre recherche ou de modifier vos filtres.
                </p>
                <button
                  onClick={handleClearAll}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  Effacer tous les filtres
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modal Mobile */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsFilterModalOpen(false)}
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute inset-x-0 bottom-0 top-12 bg-background rounded-t-3xl overflow-hidden flex flex-col"
            >
              {/* Header modal */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-foreground/10">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  <h2 className="text-lg font-serif">Filtres</h2>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-primary text-white text-xs font-medium rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-2 hover:bg-foreground/10 rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenu scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Prix */}
                <div className="mb-6 pb-6 border-b border-foreground/10">
                  <h3 className="font-medium mb-4">Prix</h3>
                  <PriceRangeSlider
                    min={priceRange.min}
                    max={priceRange.max}
                    value={filters.priceRange}
                    onChange={(value) => handleUpdateFilter('priceRange', value)}
                  />
                </div>

                {/* Matériaux */}
                <div className="mb-6 pb-6 border-b border-foreground/10">
                  <h3 className="font-medium mb-4">Matière</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {FILTER_CONFIG.materials.map(mat => (
                      <button
                        key={mat.id}
                        onClick={() => handleToggleFilter('materials', mat.id)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm transition-all border
                          ${filters.materials.includes(mat.id)
                            ? 'bg-primary/10 border-primary'
                            : 'bg-card border-foreground/10'
                          }`}
                      >
                        <span>{mat.icon}</span>
                        <span>{mat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pierres */}
                <div className="mb-6 pb-6 border-b border-foreground/10">
                  <h3 className="font-medium mb-4">Pierre</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {FILTER_CONFIG.stones.map(stone => (
                      <button
                        key={stone.id}
                        onClick={() => handleToggleFilter('stones', stone.id)}
                        className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm transition-all border
                          ${filters.stones.includes(stone.id)
                            ? 'bg-primary/10 border-primary'
                            : 'bg-card border-foreground/10'
                          }`}
                      >
                        <span 
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: stone.color }}
                        />
                        <span>{stone.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Occasions */}
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Occasion</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {FILTER_CONFIG.occasions.map(occ => (
                      <button
                        key={occ.id}
                        onClick={() => handleToggleFilter('occasions', occ.id)}
                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all
                          ${filters.occasions.includes(occ.id)
                            ? 'bg-primary text-white'
                            : 'bg-card'
                          }`}
                      >
                        <span className="text-2xl">{occ.emoji}</span>
                        <span className="text-sm font-medium">{occ.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-foreground/10 bg-background">
                <button
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-medium text-lg"
                >
                  Voir {filteredProducts.length} trésors
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
