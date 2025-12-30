'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { FilterState, INITIAL_FILTERS } from '@/lib/types/filters';
import { Product } from '@/lib/types';

interface FilterSidebarProps {
  products: Product[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose?: () => void;
}

interface AccordionSection {
  id: string;
  title: string;
  isOpen: boolean;
}

const STONE_COLORS: Record<string, string> = {
  'Diamant': '#E5E5E5',
  'Rubis': '#DC143C',
  'Émeraude': '#50C878',
  'Saphir': '#0F52BA',
  'Améthyste': '#9966CC',
  'Topaze': '#FFC87C',
  'Perle': '#F5F5DC',
  'Opale': '#E6E6FA',
  'Grenat': '#800020',
  'Citrine': '#E4D00A',
  'Quartz': '#F0E68C',
  'Turquoise': '#40E0D0',
  'Corail': '#FF7F50',
  'Ambre': '#FFBF00',
};

export default function FilterSidebar({
  products,
  filters,
  onFiltersChange,
  onClose,
}: FilterSidebarProps) {
  const [accordions, setAccordions] = useState<AccordionSection[]>([
    { id: 'price', title: 'Prix', isOpen: true },
    { id: 'category', title: 'Catégorie', isOpen: true },
    { id: 'material', title: 'Matériau', isOpen: true },
    { id: 'stone', title: 'Pierre', isOpen: true },
  ]);

  // Extraire les valeurs uniques
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats).sort();
  }, [products]);

  const uniqueMaterials = useMemo(() => {
    const mats = new Set<string>();
    products.forEach((p) => {
      const mat = p.material || p.attributes?.material;
      if (mat) mats.add(mat);
    });
    return Array.from(mats).sort();
  }, [products]);

  const uniqueStones = useMemo(() => {
    const stones = new Set<string>();
    products.forEach((p) => {
      const stone = p.stone || p.attributes?.stone;
      if (stone) stones.add(stone);
    });
    return Array.from(stones).sort();
  }, [products]);

  // Compter les produits par catégorie/matériau/pierre
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueCategories.forEach((cat) => {
      counts[cat] = products.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [products, uniqueCategories]);

  const materialCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueMaterials.forEach((mat) => {
      counts[mat] = products.filter(
        (p) => (p.material || p.attributes?.material) === mat
      ).length;
    });
    return counts;
  }, [products, uniqueMaterials]);

  const stoneCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    uniqueStones.forEach((stone) => {
      counts[stone] = products.filter(
        (p) => (p.stone || p.attributes?.stone) === stone
      ).length;
    });
    return counts;
  }, [products, uniqueStones]);

  // Calculer min/max prix
  const priceRange = useMemo(() => {
    if (products.length === 0) return [0, 2000];
    const prices = products.map((p) => p.price).filter((p) => p > 0);
    if (prices.length === 0) return [0, 2000];
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  const toggleAccordion = (id: string) => {
    setAccordions((prev) =>
      prev.map((acc) => (acc.id === id ? { ...acc, isOpen: !acc.isOpen } : acc))
    );
  };

  const updatePriceRange = (index: 0 | 1, value: number) => {
    const newRange: [number, number] = [...filters.priceRange];
    newRange[index] = value;
    if (newRange[0] > newRange[1]) {
      newRange[0] = newRange[1];
    }
    onFiltersChange({ ...filters, priceRange: newRange });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  const toggleMaterial = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFiltersChange({ ...filters, materials: newMaterials });
  };

  const toggleStone = (stone: string) => {
    const newStones = filters.stones.includes(stone)
      ? filters.stones.filter((s) => s !== stone)
      : [...filters.stones, stone];
    onFiltersChange({ ...filters, stones: newStones });
  };

  const resetFilters = () => {
    onFiltersChange(INITIAL_FILTERS);
  };

  const AccordionItem = ({ section }: { section: AccordionSection }) => {
    const isOpen = section.isOpen;
    return (
      <div className="border-b border-foreground/10 pb-4 mb-4">
        <button
          onClick={() => toggleAccordion(section.id)}
          className="w-full flex items-center justify-between text-left font-serif text-lg text-foreground hover:text-primary transition-colors"
        >
          <span>{section.title}</span>
          {isOpen ? (
            <ChevronUp size={20} className="text-foreground/60" />
          ) : (
            <ChevronDown size={20} className="text-foreground/60" />
          )}
        </button>
        {isOpen && (
          <div className="mt-4">
            {section.id === 'price' && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="text-sm text-foreground/70 mb-2 block">
                      Min: {filters.priceRange[0]}€
                    </label>
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={filters.priceRange[0]}
                      onChange={(e) =>
                        updatePriceRange(0, parseInt(e.target.value, 10))
                      }
                      className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-foreground/70 mb-2 block">
                      Max: {filters.priceRange[1]}€
                    </label>
                    <input
                      type="range"
                      min={priceRange[0]}
                      max={priceRange[1]}
                      value={filters.priceRange[1]}
                      onChange={(e) =>
                        updatePriceRange(1, parseInt(e.target.value, 10))
                      }
                      className="w-full h-2 bg-foreground/20 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                  </div>
                </div>
                <div className="flex gap-2 text-sm">
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      updatePriceRange(0, parseInt(e.target.value, 10) || 0)
                    }
                    className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg bg-background text-foreground"
                  />
                  <span className="self-center text-foreground/60">-</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      updatePriceRange(1, parseInt(e.target.value, 10) || 0)
                    }
                    className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg bg-background text-foreground"
                  />
                </div>
              </div>
            )}
            {section.id === 'category' && (
              <div className="space-y-2">
                {uniqueCategories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="text-foreground/80">
                      {cat} ({categoryCounts[cat] || 0})
                    </span>
                  </label>
                ))}
              </div>
            )}
            {section.id === 'material' && (
              <div className="space-y-2">
                {uniqueMaterials.map((mat) => (
                  <label
                    key={mat}
                    className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(mat)}
                      onChange={() => toggleMaterial(mat)}
                      className="w-4 h-4 accent-primary cursor-pointer"
                    />
                    <span className="text-foreground/80">
                      {mat} ({materialCounts[mat] || 0})
                    </span>
                  </label>
                ))}
              </div>
            )}
            {section.id === 'stone' && (
              <div className="space-y-2">
                {uniqueStones.map((stone) => {
                  const color = STONE_COLORS[stone] || '#EAB615';
                  return (
                    <label
                      key={stone}
                      className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.stones.includes(stone)}
                        onChange={() => toggleStone(stone)}
                        className="w-4 h-4 accent-primary cursor-pointer"
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-foreground/20"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-foreground/80">
                        {stone} ({stoneCounts[stone] || 0})
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-24 h-fit bg-card border-r border-foreground/10 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl text-foreground">Filtres</h2>
          <button
            onClick={resetFilters}
            className="text-sm text-primary hover:underline"
          >
            Réinitialiser
          </button>
        </div>
        {accordions.map((section) => (
          <AccordionItem key={section.id} section={section} />
        ))}
      </aside>

      {/* Mobile Drawer */}
      <div className="lg:hidden">
        {onClose && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        )}
        <aside className="fixed left-0 top-0 h-full w-80 bg-card border-r border-foreground/10 z-50 overflow-y-auto">
          <div className="sticky top-0 bg-card border-b border-foreground/10 p-4 flex items-center justify-between">
            <h2 className="font-serif text-xl text-foreground">Filtres</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X size={20} className="text-foreground" />
            </button>
          </div>
          <div className="p-6">
            <button
              onClick={resetFilters}
              className="w-full mb-6 text-sm text-primary hover:underline text-center"
            >
              Réinitialiser les filtres
            </button>
            {accordions.map((section) => (
              <AccordionItem key={section.id} section={section} />
            ))}
          </div>
        </aside>
      </div>
    </>
  );
}


















