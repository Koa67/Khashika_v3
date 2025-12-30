// ============================================================================
// KHASHIKA - FILTER SIDEBAR (DESKTOP)
// ============================================================================
// Barre latérale gauche sticky avec tous les filtres
// Design luxueux avec animations fluides
// ============================================================================

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { FILTER_CONFIG, FilterState, FilterCounts } from './useFilters';
import PriceRangeSlider from './PriceRangeSlider';
import StoneFilter from './StoneFilter';
import ColorSwatches from './ColorSwatches';
import StyleGrid from './StyleGrid';

interface FilterSidebarProps {
  filters: FilterState;
  filterCounts: FilterCounts;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalResults: number;
}

// Composant accordéon réutilisable
function FilterAccordion({
  title,
  count,
  defaultOpen = false,
  children,
}: {
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 px-1 text-left 
                   hover:bg-white/50 transition-colors duration-200 group"
      >
        <span className="font-medium text-gray-900 group-hover:text-gold-fusion transition-colors">
          {title}
          {count !== undefined && count > 0 && (
            <span className="ml-2 text-xs bg-[#8B4E4E] text-white px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.span>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-4 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Checkbox stylisée
function FilterCheckbox({
  label,
  checked,
  onChange,
  count,
  disabled = false,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
  disabled?: boolean;
  icon?: string;
}) {
  return (
    <label
      className={`flex items-center gap-3 py-2 px-2 rounded-lg cursor-pointer 
                  transition-all duration-200 group
                  ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white'}
                  ${checked ? 'bg-[#8B4E4E]/5' : ''}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div
          className={`w-5 h-5 rounded border-2 transition-all duration-200
                      ${checked 
                        ? 'bg-[#8B4E4E] border-[#8B4E4E]' 
                        : 'border-gray-300 group-hover:border-[#8B4E4E]/50'}
                      peer-focus:ring-2 peer-focus:ring-[#8B4E4E]/20`}
        >
          {checked && (
            <motion.svg
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-full h-full text-white p-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
      </div>
      
      {icon && <span className="text-lg">{icon}</span>}
      
      <span className={`flex-1 text-sm transition-colors
                        ${checked ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
        {label}
      </span>
      
      {count !== undefined && (
        <span className={`text-xs px-2 py-0.5 rounded-full transition-colors
                         ${count === 0 
                           ? 'bg-gray-100 text-gray-400' 
                           : 'bg-gray-100 text-gray-500'}`}>
          {count}
        </span>
      )}
    </label>
  );
}

// Toggle switch stylisé
function FilterToggle({
  label,
  checked,
  onChange,
  emoji,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  emoji?: string;
}) {
  return (
    <label className="flex items-center justify-between py-2 px-2 rounded-lg 
                      cursor-pointer hover:bg-white transition-colors group">
      <span className="flex items-center gap-2 text-sm text-gray-700">
        {emoji && <span>{emoji}</span>}
        {label}
      </span>
      
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors duration-200
                      ${checked ? 'bg-[#8B4E4E]' : 'bg-gray-200'}`}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
            animate={{ x: checked ? 20 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </label>
  );
}

export default function FilterSidebar({
  filters,
  filterCounts,
  onToggleFilter,
  onUpdateFilter,
  onClearAll,
  activeFilterCount,
  totalResults,
}: FilterSidebarProps) {
  return (
    <aside className="w-[280px] flex-shrink-0 hidden lg:block">
      <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto 
                      scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent
                      bg-white rounded-2xl border border-gray-100 shadow-sm">
        
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg text-gray-900">Affiner</h2>
            {activeFilterCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onClearAll}
                className="flex items-center gap-1.5 text-sm text-[#8B4E4E] 
                           hover:text-gold-fusion transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Réinitialiser</span>
              </motion.button>
            )}
          </div>
          
          {/* Compteur de résultats */}
          <motion.p
            key={totalResults}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-gray-500 mt-1"
          >
            <span className="font-semibold text-[#8B4E4E]">{totalResults}</span> trésors trouvés
          </motion.p>
        </div>
        
        {/* Contenu des filtres */}
        <div className="px-4">
          
          {/* Prix */}
          <FilterAccordion title="Prix" defaultOpen={true}>
            <PriceRangeSlider
              min={0}
              max={500}
              value={filters.priceRange}
              onChange={(value) => onUpdateFilter('priceRange', value)}
            />
          </FilterAccordion>
          
          {/* Matériaux */}
          <FilterAccordion 
            title="Matière" 
            count={filters.materials.length}
            defaultOpen={true}
          >
            <div className="space-y-1">
              {FILTER_CONFIG.materials.map((material) => (
                <FilterCheckbox
                  key={material.id}
                  label={material.label}
                  icon={material.icon}
                  checked={filters.materials.includes(material.id)}
                  onChange={() => onToggleFilter('materials', material.id)}
                  count={filterCounts.materials[material.id]}
                  disabled={filterCounts.materials[material.id] === 0}
                />
              ))}
            </div>
          </FilterAccordion>
          
          {/* Pierres - Visuel */}
          <FilterAccordion 
            title="Pierre" 
            count={filters.stones.length}
            defaultOpen={false}
          >
            <StoneFilter
              stones={FILTER_CONFIG.stones}
              selected={filters.stones}
              counts={filterCounts.stones}
              onToggle={(id) => onToggleFilter('stones', id)}
            />
          </FilterAccordion>
          
          {/* Couleur - Nuancier */}
          <FilterAccordion 
            title="Couleur" 
            count={filters.colors.length}
            defaultOpen={false}
          >
            <ColorSwatches
              colors={FILTER_CONFIG.colors}
              selected={filters.colors}
              onToggle={(id) => onToggleFilter('colors', id)}
            />
          </FilterAccordion>
          
          {/* Style - Grille visuelle */}
          <FilterAccordion 
            title="Style" 
            count={filters.styles.length}
            defaultOpen={false}
          >
            <StyleGrid
              styles={FILTER_CONFIG.styles}
              selected={filters.styles}
              onToggle={(id) => onToggleFilter('styles', id)}
            />
          </FilterAccordion>
          
          {/* Occasion - Tags */}
          <FilterAccordion 
            title="Occasion" 
            count={filters.occasions.length}
            defaultOpen={false}
          >
            <div className="flex flex-wrap gap-2">
              {FILTER_CONFIG.occasions.map((occasion) => (
                <motion.button
                  key={occasion.id}
                  onClick={() => onToggleFilter('occasions', occasion.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
                              text-sm transition-all duration-200 border
                              ${filters.occasions.includes(occasion.id)
                                ? 'bg-[#8B4E4E] text-white border-[#8B4E4E]'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#8B4E4E]/50'
                              }`}
                >
                  <span>{occasion.emoji}</span>
                  <span>{occasion.label}</span>
                </motion.button>
              ))}
            </div>
          </FilterAccordion>
          
          {/* Origine */}
          <FilterAccordion 
            title="Origine" 
            count={filters.origins.length}
            defaultOpen={false}
          >
            <div className="space-y-1">
              {FILTER_CONFIG.origins.map((origin) => (
                <FilterCheckbox
                  key={origin.id}
                  label={origin.label}
                  icon={origin.flag}
                  checked={filters.origins.includes(origin.id)}
                  onChange={() => onToggleFilter('origins', origin.id)}
                />
              ))}
            </div>
          </FilterAccordion>
          
          {/* Disponibilité */}
          <FilterAccordion title="Disponibilité" defaultOpen={false}>
            <div className="space-y-1">
              <FilterToggle
                label="En stock uniquement"
                emoji="✅"
                checked={filters.availability.inStock}
                onChange={() => onUpdateFilter('availability', {
                  ...filters.availability,
                  inStock: !filters.availability.inStock,
                })}
              />
              <FilterToggle
                label="Nouveautés"
                emoji="🆕"
                checked={filters.availability.newArrivals}
                onChange={() => onUpdateFilter('availability', {
                  ...filters.availability,
                  newArrivals: !filters.availability.newArrivals,
                })}
              />
              <FilterToggle
                label="Promotions"
                emoji="🏷️"
                checked={filters.availability.onSale}
                onChange={() => onUpdateFilter('availability', {
                  ...filters.availability,
                  onSale: !filters.availability.onSale,
                })}
              />
            </div>
          </FilterAccordion>
          
        </div>
        
        {/* Footer avec bouton appliquer (mobile only) */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 lg:hidden">
          <button className="w-full py-3 bg-[#8B4E4E] text-white rounded-xl font-medium
                           hover:bg-[#1a7a9e] transition-colors">
            Voir {totalResults} résultats
          </button>
        </div>
        
      </div>
    </aside>
  );
}
