// ============================================================================
// KHASHIKA - ACTIVE FILTER CHIPS
// ============================================================================
// Affiche les filtres actifs sous forme de chips cliquables
// ============================================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { FilterState, FILTER_CONFIG } from './useFilters';

interface ActiveFilterChipsProps {
  activeFilters: { key: keyof FilterState; value: string; label: string }[];
  onRemoveFilter: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export function ActiveFilterChips({
  activeFilters,
  onRemoveFilter,
  onClearAll,
}: ActiveFilterChipsProps) {
  if (activeFilters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="flex flex-wrap items-center gap-2 py-3"
    >
      <span className="text-sm text-gray-500 mr-1">Filtres actifs :</span>
      
      <AnimatePresence mode="popLayout">
        {activeFilters.map((filter, index) => {
          // Trouver la couleur/icône associée
          let chipColor = 'bg-gray-100';
          let chipTextColor = 'text-gray-700';
          let icon: React.ReactNode = null;
          
          if (filter.key === 'stones') {
            const stone = FILTER_CONFIG.stones.find(s => s.id === filter.value);
            if (stone) {
              icon = (
                <span
                  className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: stone.color }}
                />
              );
            }
          } else if (filter.key === 'colors') {
            const color = FILTER_CONFIG.colors.find(c => c.id === filter.value);
            if (color) {
              icon = (
                <span
                  className="w-3.5 h-3.5 rounded-full ring-1 ring-black/10"
                  style={{ background: color.hex }}
                />
              );
            }
          } else if (filter.key === 'materials') {
            const material = FILTER_CONFIG.materials.find(m => m.id === filter.value);
            if (material) {
              icon = <span className="text-sm">{material.icon}</span>;
            }
          } else if (filter.key === 'occasions') {
            const occasion = FILTER_CONFIG.occasions.find(o => o.id === filter.value);
            if (occasion) {
              icon = <span className="text-sm">{occasion.emoji}</span>;
            }
          } else if (filter.key === 'origins') {
            const origin = FILTER_CONFIG.origins.find(o => o.id === filter.value);
            if (origin) {
              icon = <span className="text-sm">{origin.flag}</span>;
            }
          }
          
          return (
            <motion.button
              key={`${filter.key}-${filter.value}`}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onRemoveFilter(filter.key, filter.value)}
              className={`inline-flex items-center gap-1.5 pl-2.5 pr-2 py-1.5
                         ${chipColor} ${chipTextColor} rounded-full text-sm
                         hover:bg-gray-200 transition-colors group`}
            >
              {icon}
              <span>{filter.label}</span>
              <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          );
        })}
      </AnimatePresence>
      
      {activeFilters.length > 1 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClearAll}
          className="flex items-center gap-1 px-2.5 py-1.5 text-sm text-[#2596be]
                    hover:bg-[#2596be]/5 rounded-full transition-colors ml-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Tout effacer</span>
        </motion.button>
      )}
    </motion.div>
  );
}

// ============================================================================
// KHASHIKA - SORT DROPDOWN
// ============================================================================
// Menu déroulant pour trier les résultats
// ============================================================================

import { ChevronDown, ArrowUpDown } from 'lucide-react';
import { SortOption } from './useFilters';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string; icon?: string }[] = [
  { value: 'relevance', label: 'Pertinence' },
  { value: 'newest', label: 'Nouveautés', icon: '🆕' },
  { value: 'price-asc', label: 'Prix croissant', icon: '↑' },
  { value: 'price-desc', label: 'Prix décroissant', icon: '↓' },
  { value: 'popularity', label: 'Popularité', icon: '🔥' },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  // Fermer au clic extérieur
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const currentOption = SORT_OPTIONS.find(opt => opt.value === value) || SORT_OPTIONS[0];

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 
                  rounded-xl text-sm text-gray-700 hover:border-[#2596be]/50
                  transition-all duration-200 min-w-[180px] justify-between"
      >
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span>Trier par : <span className="font-medium">{currentOption.label}</span></span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-gray-200 
                      shadow-lg shadow-black/5 overflow-hidden z-20"
          >
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm text-left
                           transition-colors
                           ${option.value === value 
                             ? 'bg-[#2596be]/5 text-[#2596be]' 
                             : 'text-gray-700 hover:bg-gray-50'}`}
              >
                {option.icon && <span>{option.icon}</span>}
                <span className={option.value === value ? 'font-medium' : ''}>{option.label}</span>
                {option.value === value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto text-[#2596be]"
                  >
                    ✓
                  </motion.span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// KHASHIKA - MOBILE FILTER BAR
// ============================================================================
// Barre de filtres horizontale pour mobile
// ============================================================================

interface MobileFilterBarProps {
  activeFilterCount: number;
  totalResults: number;
  sortBy: SortOption;
  onOpenFilters: () => void;
  onSortChange: (value: SortOption) => void;
}

export function MobileFilterBar({
  activeFilterCount,
  totalResults,
  sortBy,
  onOpenFilters,
  onSortChange,
}: MobileFilterBarProps) {
  return (
    <div className="lg:hidden sticky top-16 z-30 bg-white border-b border-gray-100 
                   shadow-sm -mx-4 px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        {/* Bouton Filtrer */}
        <motion.button
          onClick={onOpenFilters}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-xl
                    text-sm font-medium text-gray-700 hover:bg-gray-200 
                    transition-colors relative"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filtrer</span>
          
          {activeFilterCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#2596be] text-white 
                        text-xs font-bold rounded-full flex items-center justify-center"
            >
              {activeFilterCount}
            </motion.span>
          )}
        </motion.button>
        
        {/* Compteur de résultats */}
        <motion.span
          key={totalResults}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500"
        >
          <span className="font-semibold text-[#2596be]">{totalResults}</span> trésors
        </motion.span>
        
        {/* Mini tri */}
        <SortDropdown value={sortBy} onChange={onSortChange} />
      </div>
    </div>
  );
}
