'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { RotateCcw, ChevronDown } from 'lucide-react';
import { FilterState, FILTER_CONFIG } from '@/lib/types/filters';

interface ShopSidebarProps {
  filters: FilterState;
  filterCounts: {
    materials: Record<string, number>;
    stones: Record<string, number>;
    types?: Record<string, number>;
    accessories?: Record<string, number>;
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
  const [sidebarTop, setSidebarTop] = useState(166);
  const [maxHeight, setMaxHeight] = useState('calc(100vh - 320px)');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const priceSliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [stoneView, setStoneView] = useState<'top' | 'populaires' | 'couleurs'>('top');
  const [showAllStones, setShowAllStones] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    prix: true,
    bijoux: true,
    accessoires: false,
    pierres: true,
    matiere: false,
    occasion: false,
    disponibilite: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Price slider handlers
  const getPercentFromValue = useCallback((value: number) => {
    return ((value - priceRange.min) / (priceRange.max - priceRange.min)) * 100;
  }, [priceRange]);

  const handleSliderMouseDown = useCallback((thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  }, []);

  const handleSliderMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !priceSliderRef.current) return;
    
    const rect = priceSliderRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newValue = Math.round(priceRange.min + (percent / 100) * (priceRange.max - priceRange.min));
    
    if (isDragging === 'min') {
      const newMin = Math.max(priceRange.min, Math.min(newValue, filters.priceRange[1] - 1));
      onUpdateFilter('priceRange', [newMin, filters.priceRange[1]]);
    } else {
      const newMax = Math.min(priceRange.max, Math.max(newValue, filters.priceRange[0] + 1));
      onUpdateFilter('priceRange', [filters.priceRange[0], newMax]);
    }
  }, [isDragging, filters.priceRange, priceRange, onUpdateFilter]);

  const handleSliderMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleSliderMouseMove);
      window.addEventListener('mouseup', handleSliderMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleSliderMouseMove);
        window.removeEventListener('mouseup', handleSliderMouseUp);
      };
    }
  }, [isDragging, handleSliderMouseMove, handleSliderMouseUp]);

  useEffect(() => {
    const handleScroll = () => {
      const footer = document.querySelector('footer');
      if (!footer || !sidebarRef.current) return;

      const footerRect = footer.getBoundingClientRect();
      const sidebarRect = sidebarRef.current.getBoundingClientRect();
      const sidebarHeight = sidebarRect.height;
      const originalTop = 166;
      const margin = 20;
      
      // Only adjust if footer is visible in viewport
      if (footerRect.top < window.innerHeight) {
        // Calculate maximum allowed top position to avoid overlap
        const maxAllowedTop = footerRect.top - sidebarHeight - margin;
        
        // Don't go above the original position
        setSidebarTop(Math.max(originalTop, maxAllowedTop));
        
        // Calculate available height for the sidebar content
        const sidebarTop = sidebarRef.current.getBoundingClientRect().top;
        const availableHeight = footerRect.top - sidebarTop - margin;
        setMaxHeight(`${Math.max(200, availableHeight)}px`);
      } else {
        // Footer is below viewport, reset to original position
        setSidebarTop(originalTop);
        setMaxHeight('calc(100vh - 320px)');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div 
        ref={sidebarRef}
        className="fixed left-[max(20px,calc((100vw-1280px)/2+16px))] w-72 z-40 transition-top duration-200"
        style={{ top: `${sidebarTop}px` }}
      >
        <div 
          style={{ maxHeight }}
          className="bg-[#FDFBF7] rounded-none border border-[#D4AF37]/20 p-6 overflow-y-auto shadow-[0_4px_12px_rgba(212,175,55,0.12)]"
        >
          <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl">Filtres</h2>
          {activeFilterCount > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-sm text-[#E07A5F] hover:text-[#C44536] transition font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Réinitialiser
            </button>
          )}
        </div>

        <p className="text-sm text-foreground/60 mb-6">
          <span className="font-semibold text-[#D4AF37]">{filterCounts.total}</span> trésors trouvés
        </p>

        {/* Section Prix - Compacte */}
        <div className="mb-6 pb-6 border-b border-[#D4AF37]/20">
          <button 
            onClick={() => toggleSection('prix')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-serif text-lg">Prix</h3>
            <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform ${openSections.prix ? 'rotate-180' : ''}`} />
          </button>
          
          {openSections.prix && (
            <div className="space-y-4">
              {/* Slider */}
              <div className="pt-2 pb-4">
                <div 
                  ref={priceSliderRef}
                  className="relative h-1 bg-[#D4AF37]/20 cursor-pointer"
                >
                  {/* Track rempli */}
                  <div 
                    className="absolute h-full bg-gradient-to-r from-[#D4AF37] to-[#E8C547] rounded-none"
                    style={{ 
                      left: `${getPercentFromValue(filters.priceRange[0])}%`, 
                      width: `${getPercentFromValue(filters.priceRange[1]) - getPercentFromValue(filters.priceRange[0])}%` 
                    }}
                  />
                  {/* Handle gauche */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-none cursor-grab hover:shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-shadow active:cursor-grabbing"
                    style={{ left: `${getPercentFromValue(filters.priceRange[0])}%` }}
                    onMouseDown={handleSliderMouseDown('min')}
                    tabIndex={0}
                  />
                  {/* Handle droite */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-[#FDFBF7] border-2 border-[#D4AF37] rounded-none cursor-grab hover:shadow-[0_0_8px_rgba(212,175,55,0.4)] transition-shadow active:cursor-grabbing"
                    style={{ left: `${getPercentFromValue(filters.priceRange[1])}%` }}
                    onMouseDown={handleSliderMouseDown('max')}
                    tabIndex={0}
                  />
                </div>
              </div>
              
              {/* Affichage prix sélectionné */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground/50">{priceRange.min}€</span>
                <span className="text-[#D4AF37] font-medium">
                  {filters.priceRange[0]}€ – {filters.priceRange[1]}€
                </span>
                <span className="text-foreground/50">{priceRange.max}€</span>
              </div>
              
              {/* Boutons rapides */}
              <div className="flex flex-nowrap gap-1 w-full">
                <button 
                  onClick={() => onUpdateFilter('priceRange', [priceRange.min, priceRange.max])}
                  className="flex-1 px-2 py-0.5 text-xs border border-[#D4AF37]/30 bg-[#FDFBF7] rounded-none hover:border-[#D4AF37] transition-colors whitespace-nowrap"
                >
                  Tous
                </button>
                <button 
                  onClick={() => onUpdateFilter('priceRange', [priceRange.min, 10])}
                  className="flex-1 px-2 py-0.5 text-xs border border-[#D4AF37]/30 bg-[#FDFBF7] rounded-none hover:border-[#D4AF37] transition-colors whitespace-nowrap"
                >
                  &lt; 10€
                </button>
                <button 
                  onClick={() => onUpdateFilter('priceRange', [10, 25])}
                  className="flex-1 px-2 py-0.5 text-xs border border-[#D4AF37]/30 bg-[#FDFBF7] rounded-none hover:border-[#D4AF37] transition-colors whitespace-nowrap"
                >
                  10-25€
                </button>
                <button 
                  onClick={() => onUpdateFilter('priceRange', [25, priceRange.max])}
                  className="flex-1 px-2 py-0.5 text-xs border border-[#D4AF37]/30 bg-[#FDFBF7] rounded-none hover:border-[#D4AF37] transition-colors whitespace-nowrap"
                >
                  &gt; 25€
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section Bijoux */}
        <div className="mb-6 pb-6 border-b border-[#D4AF37]/20">
          <button 
            onClick={() => toggleSection('bijoux')}
            className="flex items-center justify-between w-full font-serif text-lg mb-4"
          >
            <span>Bijoux</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.bijoux ? 'rotate-180' : ''}`} />
          </button>
          {openSections.bijoux && (
            <div className="space-y-2">
              {FILTER_CONFIG.types.map((type) => (
                <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.id)}
                    onChange={() => onToggleFilter('types', type.id)}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-foreground/80 group-hover:text-[#D4AF37] transition-colors">
                    {type.label}
                  </span>
                  <span className="ml-auto text-xs text-foreground/40">
                    ({filterCounts.types?.[type.id] || 0})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section Accessoires */}
        <div className="mb-6 pb-6 border-b border-[#D4AF37]/20">
          <button 
            onClick={() => toggleSection('accessoires')}
            className="flex items-center justify-between w-full font-serif text-lg mb-4"
          >
            <span>Accessoires</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.accessoires ? 'rotate-180' : ''}`} />
          </button>
          {openSections.accessoires && (
            <div className="space-y-2">
              {FILTER_CONFIG.accessories.map((acc) => (
                <label key={acc.id} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.accessories.includes(acc.id)}
                    onChange={() => onToggleFilter('accessories', acc.id)}
                    className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                  />
                  <span className="text-foreground/80 group-hover:text-[#D4AF37] transition-colors">
                    {acc.label}
                  </span>
                  <span className="ml-auto text-xs text-foreground/40">
                    ({filterCounts.accessories?.[acc.id] || 0})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section Pierres */}
        <div className="mb-6 pb-6 border-b border-[#D4AF37]/20">
          <button 
            onClick={() => toggleSection('pierres')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-serif text-lg">Pierres</h3>
            <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform ${openSections.pierres ? 'rotate-180' : ''}`} />
          </button>
          
          {openSections.pierres && (
            <div className="space-y-4">
              {/* Onglets */}
              <div className="flex gap-1 p-1 bg-[#D4AF37]/10 rounded-none">
                {['top', 'populaires', 'couleurs'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setStoneView(view as 'top' | 'populaires' | 'couleurs')}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors rounded-none ${
                      stoneView === view 
                        ? 'bg-[#FDFBF7] text-[#D4AF37] shadow-sm' 
                        : 'text-foreground/60 hover:text-foreground'
                    }`}
                  >
                    {view === 'top' ? 'Top 8' : view === 'populaires' ? 'Populaires' : 'Couleurs'}
                  </button>
                ))}
              </div>
              
              {/* Vue: Top 8 pierres */}
              {stoneView === 'top' && (
                <div className="space-y-2">
                  {FILTER_CONFIG.stones.slice(0, showAllStones ? undefined : 8).map((stone) => (
                    <label key={stone.id} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={filters.stones.includes(stone.id)}
                        onChange={() => onToggleFilter('stones', stone.id)}
                        className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                      />
                      <span 
                        className="w-4 h-4 border border-[#D4AF37]/30 rounded-none" 
                        style={{ backgroundColor: stone.color }} 
                      />
                      <span className="text-foreground/80 group-hover:text-[#D4AF37] transition-colors">
                        {stone.label}
                      </span>
                      <span className="ml-auto text-xs text-foreground/40">
                        ({filterCounts.stones?.[stone.id] || 0})
                      </span>
                    </label>
                  ))}
                  {!showAllStones && FILTER_CONFIG.stones.length > 8 && (
                    <button 
                      onClick={() => setShowAllStones(true)}
                      className="text-sm text-[#D4AF37] hover:underline mt-2"
                    >
                      + {FILTER_CONFIG.stones.length - 8} autres pierres
                    </button>
                  )}
                </div>
              )}
              
              {/* Vue: Populaires (triées par count) */}
              {stoneView === 'populaires' && (
                <div className="space-y-2">
                  {[...FILTER_CONFIG.stones]
                    .sort((a, b) => (filterCounts.stones?.[b.id] || 0) - (filterCounts.stones?.[a.id] || 0))
                    .map((stone) => (
                      <label key={stone.id} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filters.stones.includes(stone.id)}
                          onChange={() => onToggleFilter('stones', stone.id)}
                          className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                        />
                        <span 
                          className="w-4 h-4 border border-[#D4AF37]/30 rounded-none" 
                          style={{ backgroundColor: stone.color }} 
                        />
                        <span className="text-foreground/80 group-hover:text-[#D4AF37] transition-colors">
                          {stone.label}
                        </span>
                        <span className="ml-auto text-xs text-foreground/40">
                          ({filterCounts.stones?.[stone.id] || 0})
                        </span>
                      </label>
                    ))}
                </div>
              )}
              
              {/* Vue: Par couleurs */}
              {stoneView === 'couleurs' && (
                <div className="space-y-4">
                  {/* Bleus */}
                  <div>
                    <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Bleus</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['turquoise', 'lapis-lazuli', 'labradorite'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-none" style={{ backgroundColor: stone.color }} />
                            <span className="text-xs">{stone.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                  
                  {/* Rouges/Roses */}
                  <div>
                    <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Rouges & Roses</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['corail', 'grenat'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-none" style={{ backgroundColor: stone.color }} />
                            <span className="text-xs">{stone.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                  
                  {/* Verts */}
                  <div>
                    <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Verts</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['jade'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-none" style={{ backgroundColor: stone.color }} />
                            <span className="text-xs">{stone.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                  
                  {/* Violets */}
                  <div>
                    <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Violets</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['amethyste'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-none" style={{ backgroundColor: stone.color }} />
                            <span className="text-xs">{stone.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                  
                  {/* Neutres */}
                  <div>
                    <p className="text-xs text-foreground/50 mb-2 uppercase tracking-wide">Neutres</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['onyx', 'perle', 'moonstone'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-none" style={{ backgroundColor: stone.color }} />
                            <span className="text-xs">{stone.label}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </aside>
  );
}

