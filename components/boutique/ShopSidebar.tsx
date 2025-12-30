'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [maxHeight, setMaxHeight] = useState('calc(100vh - 166px - 16px)');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [stoneView, setStoneView] = useState<'top' | 'couleurs'>('top');
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
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const footer = document.querySelector('footer');
        if (!footer || !sidebarRef.current) {
          ticking = false;
          return;
        }
        const footerRect = footer.getBoundingClientRect();
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        const sidebarHeight = sidebarRect.height;
        const originalTop = 166;
        const margin = 20;
        
        if (footerRect.top < window.innerHeight) {
          const maxAllowedTop = footerRect.top - sidebarHeight - margin;
          setSidebarTop(Math.max(originalTop, maxAllowedTop));
          const currentSidebarTop = sidebarRef.current.getBoundingClientRect().top;
          const availableHeight = footerRect.top - currentSidebarTop - margin;
          setMaxHeight(`${Math.max(200, availableHeight)}px`);
        } else {
          setSidebarTop(originalTop);
          setMaxHeight('calc(100vh - 166px - 16px)');
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <aside className="hidden lg:block w-72 flex-shrink-0">
      <div 
        ref={sidebarRef}
        className="fixed left-[max(16px,calc((100vw-1280px)/2))] w-72 z-40 transition-[top] duration-100 ease-out overscroll-none will-change-[top]"
        style={{ top: `${sidebarTop}px` }}
      >
        <div 
          style={{ maxHeight }}
          className="bg-[#FDF9F7] rounded-none border border-[#E8B71B]/40 p-6 overflow-y-auto overscroll-contain shadow-[0_4px_12px_rgba(240,193,29,0.25)]"
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

        <p className="text-sm text-[#2D2420]/60 mb-6">
          <span className="font-semibold text-gold-fusion">{filterCounts.total}</span> trésors trouvés
        </p>

        {/* Section Prix - Compacte */}
        <div className="mb-0 pb-0 border-b border-[#E8B71B]/20">
          <button 
            onClick={() => toggleSection('prix')}
            className="flex items-center justify-between w-full py-3"
          >
            <h3 className="font-serif text-lg">Prix</h3>
            <ChevronDown className={`w-4 h-4 text-gold-fusion transition-transform ${openSections.prix ? 'rotate-180' : ''}`} />
          </button>
          
          {openSections.prix && (
            <div className="space-y-4">
              {/* Boutons rapides */}
              <div className="flex flex-nowrap gap-1 w-full">
                {(() => {
                  const currentPriceRange = filters.priceRange;
                  const isAll = currentPriceRange[0] === priceRange.min && currentPriceRange[1] === priceRange.max;
                  const isUnder10 = currentPriceRange[0] === priceRange.min && currentPriceRange[1] === 10;
                  const is10to25 = currentPriceRange[0] === 10 && currentPriceRange[1] === 25;
                  const isOver25 = currentPriceRange[0] === 25 && currentPriceRange[1] === priceRange.max;
                  
                  return (
                    <>
                      <button 
                        onClick={() => onUpdateFilter('priceRange', [priceRange.min, priceRange.max])}
                        className={`flex-1 px-2 py-0.5 text-xs rounded-none transition-colors whitespace-nowrap ${
                          isAll
                            ? 'bg-[#E8B71B] text-white border border-[#E8B71B]'
                            : 'bg-[#FDF9F7] text-[#2D2420] border border-[#E8B71B]/30 hover:border-[#E8B71B]'
                        }`}
                      >
                        Tous
                      </button>
                      <button 
                        onClick={() => onUpdateFilter('priceRange', [priceRange.min, 10])}
                        className={`flex-1 px-2 py-0.5 text-xs rounded-none transition-colors whitespace-nowrap ${
                          isUnder10
                            ? 'bg-[#E8B71B] text-white border border-[#E8B71B]'
                            : 'bg-[#FDF9F7] text-[#2D2420] border border-[#E8B71B]/30 hover:border-[#E8B71B]'
                        }`}
                      >
                        &lt; 10 €
                      </button>
                      <button 
                        onClick={() => onUpdateFilter('priceRange', [10, 25])}
                        className={`flex-1 px-2 py-0.5 text-xs rounded-none transition-colors whitespace-nowrap ${
                          is10to25
                            ? 'bg-[#E8B71B] text-white border border-[#E8B71B]'
                            : 'bg-[#FDF9F7] text-[#2D2420] border border-[#E8B71B]/30 hover:border-[#E8B71B]'
                        }`}
                      >
                        10-25 €
                      </button>
                      <button 
                        onClick={() => onUpdateFilter('priceRange', [25, priceRange.max])}
                        className={`flex-1 px-2 py-0.5 text-xs rounded-none transition-colors whitespace-nowrap ${
                          isOver25
                            ? 'bg-[#E8B71B] text-white border border-[#E8B71B]'
                            : 'bg-[#FDF9F7] text-[#2D2420] border border-[#E8B71B]/30 hover:border-[#E8B71B]'
                        }`}
                      >
                        &gt; 25 €
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>

        {/* Section Bijoux - TOUJOURS VISIBLE */}
        <div className="mb-0 pb-0 border-b border-[#E8B71B]/20">
          <button 
            onClick={() => toggleSection('bijoux')}
            className="flex items-center justify-between w-full font-serif text-lg py-3"
          >
            <span>Bijoux</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.bijoux ? 'rotate-180' : ''}`} />
          </button>
          {openSections.bijoux && (
            <div className="space-y-1 pb-4">
              {FILTER_CONFIG.types.map((type) => (
                <label key={type.id} className="flex items-center gap-3 cursor-pointer group py-1.5 hover:translate-x-1 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={filters.types.includes(type.id)}
                    onChange={() => onToggleFilter('types', type.id)}
                    className="w-4 h-4 accent-[#E8B71B] cursor-pointer"
                  />
                  <span className="text-sm text-[#2D2420] group-hover:text-gold-fusion transition-colors">
                    {type.label}
                  </span>
                  <span className="ml-auto text-xs text-[#2D2420]/40">
                    ({filterCounts.types?.[type.id] || 0})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section Accessoires - TOUJOURS VISIBLE */}
        <div className="mb-0 pb-0 border-b border-[#E8B71B]/20">
          <button 
            onClick={() => toggleSection('accessoires')}
            className="flex items-center justify-between w-full font-serif text-lg py-3"
          >
            <span>Accessoires</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${openSections.accessoires ? 'rotate-180' : ''}`} />
          </button>
          {openSections.accessoires && (
            <div className="space-y-1 pb-4">
              {FILTER_CONFIG.accessories.map((acc) => (
                <label key={acc.id} className="flex items-center gap-3 cursor-pointer group py-1.5 hover:translate-x-1 transition-all duration-200">
                  <input
                    type="checkbox"
                    checked={filters.accessories.includes(acc.id)}
                    onChange={() => onToggleFilter('accessories', acc.id)}
                    className="w-4 h-4 accent-[#E8B71B] cursor-pointer"
                  />
                  <span className="text-sm text-[#2D2420] group-hover:text-gold-fusion transition-colors">
                    {acc.label}
                  </span>
                  <span className="ml-auto text-xs text-[#2D2420]/40">
                    ({filterCounts.accessories?.[acc.id] || 0})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Section Pierres - TOUJOURS VISIBLE */}
        <div className="mb-0 pb-0 border-b border-[#E8B71B]/20">
          <button 
            onClick={() => toggleSection('pierres')}
            className="flex items-center justify-between w-full py-3"
          >
            <h3 className="font-serif text-lg">Pierres</h3>
            <ChevronDown className={`w-4 h-4 text-gold-fusion transition-transform ${openSections.pierres ? 'rotate-180' : ''}`} />
          </button>
          
          {openSections.pierres && (
            <div className="space-y-4">
              {/* Onglets */}
              <div className="flex gap-1 p-1 bg-[#E8B71B]/10 rounded-none">
                {['top', 'couleurs'].map((view) => (
                  <button
                    key={view}
                    onClick={() => setStoneView(view as 'top' | 'couleurs')}
                    className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors rounded-none ${
                      stoneView === view 
                        ? 'bg-[#FDF9F7] text-gold-fusion shadow-sm' 
                        : 'text-[#2D2420]/60 hover:text-gold-fusion'
                    }`}
                  >
                    {view === 'top' ? 'Populaires' : 'Par couleurs'}
                  </button>
                ))}
              </div>
              
              {/* Vue: Top 8 pierres */}
              {stoneView === 'top' && (
                <div className="space-y-1 pb-4">
                  {FILTER_CONFIG.stones.slice(0, showAllStones ? undefined : 8).map((stone) => (
                    <label key={stone.id} className="flex items-center gap-3 cursor-pointer group py-1.5 hover:translate-x-1 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={filters.stones.includes(stone.id)}
                        onChange={() => onToggleFilter('stones', stone.id)}
                        className="w-4 h-4 accent-[#E8B71B] cursor-pointer"
                      />
                      <span 
                        className="w-4 h-4 border border-[#E8B71B]/30 rounded-none" 
                        style={{ backgroundColor: stone.color }} 
                      />
                      <span className="text-sm text-[#2D2420] group-hover:text-gold-fusion transition-colors">
                        {stone.label}
                      </span>
                      <span className="ml-auto text-xs text-[#2D2420]/40">
                        ({filterCounts.stones?.[stone.id] || 0})
                      </span>
                    </label>
                  ))}
                  {!showAllStones && FILTER_CONFIG.stones.length > 8 && (
                    <button 
                      onClick={() => setShowAllStones(true)}
                      className="text-sm text-gold-fusion hover:underline mt-2"
                    >
                      + {FILTER_CONFIG.stones.length - 8} autres pierres
                    </button>
                  )}
                </div>
              )}
              
              {/* Vue: Par couleurs */}
              {stoneView === 'couleurs' && (
                <div className="space-y-4">
                  {/* Bleus */}
                  <div>
                    <p className="text-xs text-[#2D2420]/50 mb-2 uppercase tracking-wide">Bleus</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['turquoise', 'lapis-lazuli', 'labradorite'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#E8B71B] bg-[#E8B71B]/10'
                                : 'border-[#E8B71B]/30 hover:border-[#E8B71B]'
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
                    <p className="text-xs text-[#2D2420]/50 mb-2 uppercase tracking-wide">Rouges & Roses</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['corail', 'grenat'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#E8B71B] bg-[#E8B71B]/10'
                                : 'border-[#E8B71B]/30 hover:border-[#E8B71B]'
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
                    <p className="text-xs text-[#2D2420]/50 mb-2 uppercase tracking-wide">Verts</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['jade'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#E8B71B] bg-[#E8B71B]/10'
                                : 'border-[#E8B71B]/30 hover:border-[#E8B71B]'
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
                    <p className="text-xs text-[#2D2420]/50 mb-2 uppercase tracking-wide">Violets</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['amethyste'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#E8B71B] bg-[#E8B71B]/10'
                                : 'border-[#E8B71B]/30 hover:border-[#E8B71B]'
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
                    <p className="text-xs text-[#2D2420]/50 mb-2 uppercase tracking-wide">Neutres</p>
                    <div className="flex flex-wrap gap-2">
                      {FILTER_CONFIG.stones
                        .filter(s => ['onyx', 'perle', 'moonstone'].includes(s.id))
                        .map(stone => (
                          <button
                            key={stone.id}
                            onClick={() => onToggleFilter('stones', stone.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border transition-all rounded-none ${
                              filters.stones.includes(stone.id)
                                ? 'border-[#E8B71B] bg-[#E8B71B]/10'
                                : 'border-[#E8B71B]/30 hover:border-[#E8B71B]'
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

