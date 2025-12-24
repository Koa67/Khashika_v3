'use client';

import { RotateCcw } from 'lucide-react';
import { FilterState, FILTER_CONFIG } from '@/lib/types/filters';
import PriceRangeSlider from '@/components/filters/PriceRangeSlider';

interface ShopSidebarProps {
  filters: FilterState;
  filterCounts: {
    materials: Record<string, number>;
    stones: Record<string, number>;
    total: number;
  };
  priceRange: { min: number; max: number };
  activeFilterCount: number;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearAll: () => void;
}

export default function ShopSidebar({
  filters,
  filterCounts,
  priceRange,
  activeFilterCount,
  onToggleFilter,
  onUpdateFilter,
  onClearAll,
}: ShopSidebarProps) {
  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div className="sticky top-24 bg-card rounded-2xl border border-foreground/10 p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl">Filtres</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
        </div>

        <p className="text-sm text-foreground/60 mb-6">
          <span className="font-semibold text-primary">{filterCounts.total}</span> trésors trouvés
        </p>

        {/* Prix */}
        <div className="mb-6 pb-6 border-b border-foreground/10">
          <h3 className="font-medium mb-4">Prix</h3>
          <PriceRangeSlider
            min={priceRange.min}
            max={priceRange.max}
            value={filters.priceRange}
            onChange={(value) => onUpdateFilter('priceRange', value)}
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
                  onChange={() => onToggleFilter('materials', mat.id)}
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
                  onChange={() => onToggleFilter('stones', stone.id)}
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
                onClick={() => onToggleFilter('occasions', occ.id)}
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
                onChange={() => onUpdateFilter('availability', {
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
                onChange={() => onUpdateFilter('availability', {
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
  );
}

