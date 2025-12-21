// ============================================================================
// KHASHIKA - STONE FILTER
// ============================================================================
// Filtre visuel pour les pierres précieuses
// Avec aperçus de couleur/texture et recherche
// ============================================================================

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Check, X } from 'lucide-react';
import Image from 'next/image';

interface Stone {
  id: string;
  label: string;
  color: string;
  texture?: string;
}

interface StoneFilterProps {
  stones: Stone[];
  selected: string[];
  counts?: Record<string, number>;
  onToggle: (id: string) => void;
}

export default function StoneFilter({
  stones,
  selected,
  counts = {},
  onToggle,
}: StoneFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  
  // Filtrer les pierres par recherche
  const filteredStones = useMemo(() => {
    if (!searchQuery.trim()) return stones;
    const query = searchQuery.toLowerCase();
    return stones.filter(stone => 
      stone.label.toLowerCase().includes(query)
    );
  }, [stones, searchQuery]);
  
  // Pierres à afficher (limite initiale)
  const displayedStones = showAll ? filteredStones : filteredStones.slice(0, 8);
  const hasMore = filteredStones.length > 8 && !showAll;
  
  // Pierres sélectionnées en premier
  const sortedStones = useMemo(() => {
    return [...displayedStones].sort((a, b) => {
      const aSelected = selected.includes(a.id) ? 0 : 1;
      const bSelected = selected.includes(b.id) ? 0 : 1;
      return aSelected - bSelected;
    });
  }, [displayedStones, selected]);

  return (
    <div className="space-y-3">
      
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher une pierre..."
          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-lg
                    focus:outline-none focus:border-[#2596be] focus:ring-1 focus:ring-[#2596be]/20
                    transition-all duration-200 placeholder:text-gray-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {/* Chips des sélectionnées */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-2 border-b border-gray-100">
          {selected.map((id) => {
            const stone = stones.find(s => s.id === id);
            if (!stone) return null;
            return (
              <motion.button
                key={id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                onClick={() => onToggle(id)}
                className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-[#2596be]/10 
                          text-[#2596be] rounded-full text-xs font-medium 
                          hover:bg-[#2596be]/20 transition-colors group"
              >
                <span
                  className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                  style={{ backgroundColor: stone.color }}
                />
                <span>{stone.label}</span>
                <X className="w-3 h-3 opacity-60 group-hover:opacity-100" />
              </motion.button>
            );
          })}
        </div>
      )}
      
      {/* Grille des pierres */}
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence mode="popLayout">
          {sortedStones.map((stone, index) => {
            const isSelected = selected.includes(stone.id);
            const count = counts[stone.id] ?? 0;
            const isDisabled = count === 0 && !isSelected;
            
            return (
              <motion.button
                key={stone.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => !isDisabled && onToggle(stone.id)}
                disabled={isDisabled}
                className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border 
                           transition-all duration-200 text-left group
                           ${isSelected 
                             ? 'border-[#2596be] bg-[#2596be]/5 ring-1 ring-[#2596be]/20' 
                             : 'border-gray-200 hover:border-[#2596be]/50 hover:bg-gray-50'}
                           ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {/* Swatch de couleur/texture */}
                <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 
                               shadow-sm ring-1 ring-black/5">
                  {stone.texture ? (
                    <Image
                      src={stone.texture}
                      alt={stone.label}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{ 
                        background: stone.color,
                        boxShadow: `inset 0 1px 2px rgba(255,255,255,0.3), 
                                    inset 0 -1px 2px rgba(0,0,0,0.1)` 
                      }}
                    />
                  )}
                  
                  {/* Indicateur de sélection */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute inset-0 bg-[#2596be]/80 flex items-center justify-center"
                      >
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Label et compteur */}
                <div className="flex-1 min-w-0">
                  <span className={`text-sm block truncate transition-colors
                                   ${isSelected ? 'text-[#2596be] font-medium' : 'text-gray-700'}`}>
                    {stone.label}
                  </span>
                  {count > 0 && (
                    <span className="text-xs text-gray-400">
                      {count} produit{count > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {/* Effet de survol */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#2596be]/0 
                               to-[#2596be]/5 opacity-0 group-hover:opacity-100 transition-opacity 
                               pointer-events-none" />
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Bouton "Voir plus" */}
      {hasMore && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-2 text-sm text-[#2596be] hover:text-[#1a7a9e] 
                    font-medium transition-colors flex items-center justify-center gap-1"
        >
          <span>Voir {filteredStones.length - 8} autres pierres</span>
          <span className="text-lg">↓</span>
        </button>
      )}
      
      {/* État vide */}
      {filteredStones.length === 0 && (
        <div className="text-center py-4 text-gray-500 text-sm">
          Aucune pierre ne correspond à &quot;{searchQuery}&quot;
        </div>
      )}
      
    </div>
  );
}
