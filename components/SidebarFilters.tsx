'use client';

import { useState } from 'react';

interface SidebarFiltersProps {
  onApplyFilters?: (filters: FilterState) => void;
}

export interface FilterState {
  priceRange: [number, number];
  materials: string[];
  stones: string[];
  styles: string[];
  tags: string[];
}

const MATERIALS = ['Or', 'Argent', 'Platine', 'Acier'];
const STONES = ['Diamant', 'Saphir', 'Émeraude', 'Rubis'];
const STYLES = ['Classique', 'Moderne', 'Vintage'];
const TAGS = ['Promo', 'Nouveauté'];

export default function SidebarFilters({ onApplyFilters }: SidebarFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleMaterialToggle = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  const handleStoneToggle = (stone: string) => {
    setSelectedStones((prev) =>
      prev.includes(stone)
        ? prev.filter((s) => s !== stone)
        : [...prev, stone]
    );
  };

  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style)
        ? prev.filter((s) => s !== style)
        : [...prev, style]
    );
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const handleApply = () => {
    const filters: FilterState = {
      priceRange,
      materials: selectedMaterials,
      stones: selectedStones,
      styles: selectedStyles,
      tags: selectedTags,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('Filtres appliqués:', filters);
    }

    if (onApplyFilters) {
      onApplyFilters(filters);
    }
  };

  const handleReset = () => {
    setPriceRange([0, 500]);
    setSelectedMaterials([]);
    setSelectedStones([]);
    setSelectedStyles([]);
    setSelectedTags([]);
  };

  return (
    <div className="bg-[#f4f1eb] rounded-lg border border-[#D4AF37]/20 p-6 space-y-8 sticky top-24">
      <h2 className="font-serif text-2xl text-[#2596be] mb-6">
        Filtres
      </h2>

      {/* Slider de Prix */}
      <div>
        <label className="block font-serif text-base font-medium text-[#2596be] mb-4">
          Prix : {priceRange[0]}€ - {priceRange[1]}€
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([parseInt(e.target.value), priceRange[1]])
            }
            className="w-full accent-[#2596be]"
          />
          <input
            type="range"
            min="0"
            max="500"
            step="50"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full accent-[#2596be]"
          />
        </div>
        <div className="flex justify-between text-xs text-anthracite/50 mt-1 font-body">
          <span>0€</span>
          <span>500€</span>
        </div>
      </div>

      {/* Catégorie */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
          Catégorie
        </h3>
        <div className="space-y-3">
          {['Bagues', 'Colliers', 'Bracelets', 'Boucles d\'oreilles'].map((category) => (
            <label
              key={category}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                />
                <div className="w-5 h-5 border-2 border-[#D4AF37] rounded-sm flex items-center justify-center transition-all group-hover:border-[#2596be]">
                  <svg
                    className="w-3 h-3 text-[#2596be] opacity-0 group-hover:opacity-30 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <span className="font-body text-sm text-anthracite/80">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Matière */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
          Matière
        </h3>
        <div className="space-y-3">
          {MATERIALS.map((material) => (
            <label
              key={material}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material)}
                  onChange={() => handleMaterialToggle(material)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all ${
                  selectedMaterials.includes(material)
                    ? 'border-[#D4AF37] bg-[#2596be]/10'
                    : 'border-[#D4AF37] group-hover:border-[#2596be]'
                }`}>
                  {selectedMaterials.includes(material) && (
                    <svg
                      className="w-3 h-3 text-[#2596be]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-body text-sm text-anthracite/80">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Pierre */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
          Pierre
        </h3>
        <div className="space-y-3">
          {STONES.map((stone) => (
            <label
              key={stone}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedStones.includes(stone)}
                  onChange={() => handleStoneToggle(stone)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all ${
                  selectedStones.includes(stone)
                    ? 'border-[#D4AF37] bg-[#2596be]/10'
                    : 'border-[#D4AF37] group-hover:border-[#2596be]'
                }`}>
                  {selectedStones.includes(stone) && (
                    <svg
                      className="w-3 h-3 text-[#2596be]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-body text-sm text-anthracite/80">{stone}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
          Style
        </h3>
        <div className="space-y-3">
          {STYLES.map((style) => (
            <label
              key={style}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedStyles.includes(style)}
                  onChange={() => handleStyleToggle(style)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center transition-all ${
                  selectedStyles.includes(style)
                    ? 'border-[#D4AF37] bg-[#2596be]/10'
                    : 'border-[#D4AF37] group-hover:border-[#2596be]'
                }`}>
                  {selectedStyles.includes(style) && (
                    <svg
                      className="w-3 h-3 text-[#2596be]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="font-body text-sm text-anthracite/80">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-serif text-lg font-medium text-[#2596be] mb-4">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1.5 rounded text-xs font-sans transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-[#2596be] text-white'
                  : 'bg-[#f4f1eb] text-[#1a1a1a]/70 hover:bg-[#D4AF37]/20 border border-[#2596be]/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Boutons Actions */}
      <div className="flex flex-col gap-2 pt-4 border-t border-[#2596be]/10">
        <button
          onClick={handleApply}
          className="w-full bg-[#2596be] text-white font-sans font-medium py-3 px-4 rounded transition-colors hover:bg-[#2596be]/90"
        >
          Appliquer
        </button>
        <button
          onClick={handleReset}
          className="w-full bg-[#f4f1eb] text-[#2596be] font-sans font-medium py-2 px-4 rounded transition-colors hover:bg-[#D4AF37]/20 border border-[#2596be]/10"
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}
