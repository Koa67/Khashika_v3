'use client';

import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { FilterState, FILTER_CONFIG } from '@/lib/types/filters';
import PriceRangeSlider from '@/components/filters/PriceRangeSlider';

interface MobileFilterModalProps {
  isOpen: boolean;
  filters: FilterState;
  priceRange: { min: number; max: number };
  activeFilterCount: number;
  filteredCount: number;
  onClose: () => void;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
}

export default function MobileFilterModal({
  isOpen,
  filters,
  priceRange,
  activeFilterCount,
  filteredCount,
  onClose,
  onToggleFilter,
  onUpdateFilter,
}: MobileFilterModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 lg:hidden"
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
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
            onClick={onClose}
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
              onChange={(value) => onUpdateFilter('priceRange', value)}
            />
          </div>

          {/* Matériaux */}
          <div className="mb-6 pb-6 border-b border-foreground/10">
            <h3 className="font-medium mb-4">Matière</h3>
            <div className="grid grid-cols-2 gap-2">
              {FILTER_CONFIG.materials.map(mat => (
                <button
                  key={mat.id}
                  onClick={() => onToggleFilter('materials', mat.id)}
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
                  onClick={() => onToggleFilter('stones', stone.id)}
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
                  onClick={() => onToggleFilter('occasions', occ.id)}
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
            onClick={onClose}
            className="w-full py-4 bg-primary text-white rounded-2xl font-medium text-lg"
          >
            Voir {filteredCount} trésors
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

