'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';

export interface ProductFilterState {
  categories: string[];
  priceRange: [number, number];
  materials: string[];
}

interface ProductFilterProps {
  onFilterChange?: (filters: ProductFilterState) => void;
  initialFilters?: Partial<ProductFilterState>;
}

const CATEGORIES = ['Necklaces', 'Rings', 'Earrings', 'Bracelets'];
const MATERIALS = ['Gold', 'Silver', 'Platinum', 'Mixed'];
const MAX_PRICE = 1000;
const MIN_PRICE = 0;

export default function ProductFilter({ 
  onFilterChange, 
  initialFilters 
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState<string[]>(
    initialFilters?.categories || []
  );
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [MIN_PRICE, MAX_PRICE]
  );
  const [materials, setMaterials] = useState<string[]>(
    initialFilters?.materials || []
  );

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true); // Auto-open on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCategoryToggle = (category: string) => {
    const newCategories = categories.includes(category)
      ? categories.filter((c) => c !== category)
      : [...categories, category];
    setCategories(newCategories);
    notifyFilterChange({ categories: newCategories, priceRange, materials });
  };

  const handleMaterialToggle = (material: string) => {
    const newMaterials = materials.includes(material)
      ? materials.filter((m) => m !== material)
      : [...materials, material];
    setMaterials(newMaterials);
    notifyFilterChange({ categories, priceRange, materials: newMaterials });
  };

  const handlePriceChange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...priceRange];
    newRange[index] = value;
    
    // Ensure min <= max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    setPriceRange(newRange);
    notifyFilterChange({ categories, priceRange: newRange, materials });
  };

  const handleReset = () => {
    const resetCategories: string[] = [];
    const resetPriceRange: [number, number] = [MIN_PRICE, MAX_PRICE];
    const resetMaterials: string[] = [];
    
    setCategories(resetCategories);
    setPriceRange(resetPriceRange);
    setMaterials(resetMaterials);
    notifyFilterChange({ 
      categories: resetCategories, 
      priceRange: resetPriceRange, 
      materials: resetMaterials 
    });
  };

  const notifyFilterChange = (filters: ProductFilterState) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const hasActiveFilters = 
    categories.length > 0 || 
    priceRange[0] > MIN_PRICE || 
    priceRange[1] < MAX_PRICE || 
    materials.length > 0;

  return (
    <div className="w-full">
      {/* Mobile Header - Collapsible */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-white border border-[#D4AF37]/20 rounded-lg hover:border-[#2596be] transition-colors"
          aria-label={isOpen ? 'Fermer les filtres' : 'Ouvrir les filtres'}
          aria-expanded={isOpen}
        >
          <span className="font-serif text-lg text-foreground">Filtres</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={20} className="text-[#2596be]" />
          </motion.div>
        </button>
      </div>

      {/* Filter Content */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-[#D4AF37]/20 rounded-lg p-6 space-y-8 md:sticky md:top-24"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl text-[#2596be]">Filtres</h2>
              {hasActiveFilters && (
                <button
                  onClick={handleReset}
                  className="text-sm text-foreground/60 hover:text-[#2596be] transition-colors flex items-center gap-1"
                  aria-label="Réinitialiser les filtres"
                >
                  <X size={16} />
                  Réinitialiser
                </button>
              )}
            </div>

            {/* Categories Filter */}
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
                Catégories
              </h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => {
                  const isSelected = categories.includes(category);
                  return (
                    <motion.button
                      key={category}
                      onClick={() => handleCategoryToggle(category)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#2596be] text-white border-[#2596be]'
                          : 'bg-white text-foreground border-gray-200 hover:border-[#2596be] hover:text-[#2596be]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {category}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
                Prix
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-foreground/70 mb-2">
                    {priceRange[0]}€ - {priceRange[1]}€
                  </label>
                  <div className="relative">
                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={10}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(0, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2596be]"
                      aria-label="Prix minimum"
                    />
                    <input
                      type="range"
                      min={MIN_PRICE}
                      max={MAX_PRICE}
                      step={10}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(1, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2596be] mt-2"
                      aria-label="Prix maximum"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-foreground/50 mt-2">
                    <span>{MIN_PRICE}€</span>
                    <span>{MAX_PRICE}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Materials Filter */}
            <div>
              <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
                Matériaux
              </h3>
              <div className="space-y-2">
                {MATERIALS.map((material) => {
                  const isSelected = materials.includes(material);
                  return (
                    <motion.button
                      key={material}
                      onClick={() => handleMaterialToggle(material)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left px-4 py-2 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-[#2596be] text-white border-[#2596be]'
                          : 'bg-white text-foreground border-gray-200 hover:border-[#2596be] hover:text-[#2596be]'
                      }`}
                      aria-pressed={isSelected}
                    >
                      {material}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Active Filters Count */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-4 border-t border-gray-200"
              >
                <p className="text-sm text-foreground/60">
                  {categories.length + materials.length + 
                   (priceRange[0] > MIN_PRICE ? 1 : 0) + 
                   (priceRange[1] < MAX_PRICE ? 1 : 0)} filtre(s) actif(s)
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

