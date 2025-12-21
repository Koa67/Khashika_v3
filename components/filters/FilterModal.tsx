// ============================================================================
// KHASHIKA - FILTER MODAL (MOBILE)
// ============================================================================
// Modale plein écran pour les filtres sur mobile
// UX optimisée pour les écrans tactiles (targets 44px+)
// ============================================================================

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, RotateCcw, Filter, Check } from 'lucide-react';
import { FILTER_CONFIG, FilterState, FilterCounts } from './useFilters';
import PriceRangeSlider from './PriceRangeSlider';
import StoneFilter from './StoneFilter';
import ColorSwatches from './ColorSwatches';
import StyleGrid from './StyleGrid';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  filterCounts: FilterCounts;
  onToggleFilter: (key: keyof FilterState, value: string) => void;
  onUpdateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  totalResults: number;
}

type FilterSection = 
  | 'main' 
  | 'price' 
  | 'materials' 
  | 'stones' 
  | 'colors' 
  | 'styles' 
  | 'occasions' 
  | 'origins' 
  | 'availability';

// Configuration des sections
const SECTIONS = [
  { id: 'price' as const, label: 'Prix', icon: '💰' },
  { id: 'materials' as const, label: 'Matière', icon: '✨' },
  { id: 'stones' as const, label: 'Pierre', icon: '💎' },
  { id: 'colors' as const, label: 'Couleur', icon: '🎨' },
  { id: 'styles' as const, label: 'Style', icon: '👗' },
  { id: 'occasions' as const, label: 'Occasion', icon: '📅' },
  { id: 'origins' as const, label: 'Origine', icon: '🌍' },
  { id: 'availability' as const, label: 'Disponibilité', icon: '📦' },
];

export default function FilterModal({
  isOpen,
  onClose,
  filters,
  filterCounts,
  onToggleFilter,
  onUpdateFilter,
  onClearAll,
  activeFilterCount,
  totalResults,
}: FilterModalProps) {
  const [currentSection, setCurrentSection] = React.useState<FilterSection>('main');
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Manage body scroll when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Compter les filtres actifs par section
  const getSectionCount = (sectionId: FilterSection): number => {
    switch (sectionId) {
      case 'price':
        return (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) ? 1 : 0;
      case 'materials':
        return filters.materials.length;
      case 'stones':
        return filters.stones.length;
      case 'colors':
        return filters.colors.length;
      case 'styles':
        return filters.styles.length;
      case 'occasions':
        return filters.occasions.length;
      case 'origins':
        return filters.origins.length;
      case 'availability':
        return (filters.availability.inStock ? 1 : 0) +
               (filters.availability.newArrivals ? 1 : 0) +
               (filters.availability.onSale ? 1 : 0);
      default:
        return 0;
    }
  };
  
  // Render le contenu d'une section
  const renderSectionContent = () => {
    switch (currentSection) {
      case 'price':
        return (
          <div className="p-4">
            <PriceRangeSlider
              min={0}
              max={500}
              value={filters.priceRange}
              onChange={(value) => onUpdateFilter('priceRange', value)}
            />
          </div>
        );
        
      case 'materials':
        return (
          <div className="p-4 space-y-2">
            {FILTER_CONFIG.materials.map((material) => (
              <MobileFilterItem
                key={material.id}
                label={material.label}
                icon={material.icon}
                selected={filters.materials.includes(material.id)}
                count={filterCounts.materials[material.id]}
                onToggle={() => onToggleFilter('materials', material.id)}
              />
            ))}
          </div>
        );
        
      case 'stones':
        return (
          <div className="p-4">
            <StoneFilter
              stones={FILTER_CONFIG.stones}
              selected={filters.stones}
              counts={filterCounts.stones}
              onToggle={(id) => onToggleFilter('stones', id)}
            />
          </div>
        );
        
      case 'colors':
        return (
          <div className="p-4">
            <ColorSwatches
              colors={FILTER_CONFIG.colors}
              selected={filters.colors}
              onToggle={(id) => onToggleFilter('colors', id)}
            />
          </div>
        );
        
      case 'styles':
        return (
          <div className="p-4">
            <StyleGrid
              styles={FILTER_CONFIG.styles}
              selected={filters.styles}
              onToggle={(id) => onToggleFilter('styles', id)}
            />
          </div>
        );
        
      case 'occasions':
        return (
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2">
              {FILTER_CONFIG.occasions.map((occasion) => (
                <MobileOccasionButton
                  key={occasion.id}
                  label={occasion.label}
                  emoji={occasion.emoji}
                  selected={filters.occasions.includes(occasion.id)}
                  onToggle={() => onToggleFilter('occasions', occasion.id)}
                />
              ))}
            </div>
          </div>
        );
        
      case 'origins':
        return (
          <div className="p-4 space-y-2">
            {FILTER_CONFIG.origins.map((origin) => (
              <MobileFilterItem
                key={origin.id}
                label={origin.label}
                icon={origin.flag}
                selected={filters.origins.includes(origin.id)}
                onToggle={() => onToggleFilter('origins', origin.id)}
              />
            ))}
          </div>
        );
        
      case 'availability':
        return (
          <div className="p-4 space-y-3">
            <MobileToggleItem
              label="En stock uniquement"
              emoji="✅"
              checked={filters.availability.inStock}
              onChange={() => onUpdateFilter('availability', {
                ...filters.availability,
                inStock: !filters.availability.inStock,
              })}
            />
            <MobileToggleItem
              label="Nouveautés"
              emoji="🆕"
              checked={filters.availability.newArrivals}
              onChange={() => onUpdateFilter('availability', {
                ...filters.availability,
                newArrivals: !filters.availability.newArrivals,
              })}
            />
            <MobileToggleItem
              label="Promotions"
              emoji="🏷️"
              checked={filters.availability.onSale}
              onChange={() => onUpdateFilter('availability', {
                ...filters.availability,
                onSale: !filters.availability.onSale,
              })}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute inset-x-0 bottom-0 top-12 bg-white rounded-t-3xl 
                       overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 py-4 border-b border-gray-100 
                           flex items-center justify-between safe-area-inset-top">
              {currentSection !== 'main' ? (
                <button
                  onClick={() => {
                    setCurrentSection('main');
                    if (contentRef.current) {
                      contentRef.current.scrollTop = 0;
                    }
                  }}
                  className="flex items-center gap-2 text-[#2596be] font-medium
                            min-h-[44px] min-w-[44px] -ml-2 pl-2"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                  <span>Retour</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-serif text-gray-900">Filtres</h2>
                  {activeFilterCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#2596be] text-white text-xs 
                                    font-medium rounded-full">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && currentSection === 'main' && (
                  <button
                    onClick={onClearAll}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#2596be]
                              hover:bg-[#2596be]/5 rounded-lg transition-colors min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Effacer</span>
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px]
                            flex items-center justify-center"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto overscroll-contain">
              <AnimatePresence mode="wait">
                {currentSection === 'main' ? (
                  <motion.div
                    key="main"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="py-2"
                  >
                    {SECTIONS.map((section, index) => {
                      const count = getSectionCount(section.id);
                      
                      return (
                        <motion.button
                          key={section.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => {
                            setCurrentSection(section.id);
                            if (contentRef.current) {
                              contentRef.current.scrollTop = 0;
                            }
                          }}
                          className="w-full flex items-center justify-between px-4 py-4
                                    hover:bg-gray-50 active:bg-gray-100 transition-colors
                                    min-h-[56px]"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{section.icon}</span>
                            <span className="font-medium text-gray-900">{section.label}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <span className="px-2 py-0.5 bg-[#2596be]/10 text-[#2596be] 
                                             text-sm font-medium rounded-full">
                                {count}
                              </span>
                            )}
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentSection}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    {/* Titre de la section */}
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <h3 className="font-medium text-gray-700">
                        {SECTIONS.find(s => s.id === currentSection)?.label}
                      </h3>
                    </div>
                    
                    {renderSectionContent()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer avec bouton CTA */}
            <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-white safe-area-inset-bottom">
              <motion.button
                onClick={onClose}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#2596be] text-white rounded-2xl font-medium
                          text-lg shadow-lg shadow-[#2596be]/20 
                          active:bg-[#1a7a9e] transition-colors"
              >
                Voir {totalResults} trésors
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Composant pour un item de filtre mobile
function MobileFilterItem({
  label,
  icon,
  selected,
  count,
  onToggle,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  count?: number;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                 transition-all duration-200 min-h-[52px]
                 ${selected 
                   ? 'bg-[#2596be]/10 border-2 border-[#2596be]' 
                   : 'bg-gray-50 border-2 border-transparent'}`}
    >
      {icon && <span className="text-xl">{icon}</span>}
      
      <span className={`flex-1 text-left font-medium
                       ${selected ? 'text-[#2596be]' : 'text-gray-700'}`}>
        {label}
      </span>
      
      {count !== undefined && count > 0 && (
        <span className="text-sm text-gray-400">({count})</span>
      )}
      
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-6 h-6 bg-[#2596be] rounded-full flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </motion.div>
      )}
    </button>
  );
}

// Composant pour un bouton occasion mobile
function MobileOccasionButton({
  label,
  emoji,
  selected,
  onToggle,
}: {
  label: string;
  emoji: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      onClick={onToggle}
      whileTap={{ scale: 0.95 }}
      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl
                 transition-all duration-200 min-h-[88px]
                 ${selected 
                   ? 'bg-[#2596be] text-white shadow-lg shadow-[#2596be]/30' 
                   : 'bg-gray-50 text-gray-700'}`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className="font-medium text-sm">{label}</span>
    </motion.button>
  );
}

// Composant toggle mobile
function MobileToggleItem({
  label,
  emoji,
  checked,
  onChange,
}: {
  label: string;
  emoji: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center justify-between px-4 py-4 
                bg-gray-50 rounded-xl min-h-[56px]"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{emoji}</span>
        <span className="font-medium text-gray-700">{label}</span>
      </div>
      
      <div
        className={`w-14 h-8 rounded-full transition-colors duration-200 relative
                   ${checked ? 'bg-[#2596be]' : 'bg-gray-300'}`}
      >
        <motion.div
          className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md"
          animate={{ x: checked ? 24 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}
