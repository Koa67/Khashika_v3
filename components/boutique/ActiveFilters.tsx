'use client';

import { X, RotateCcw } from 'lucide-react';
import { FilterState, FILTER_CONFIG } from '@/lib/types/filters';

interface ActiveFiltersProps {
  filters: FilterState;
  activeCount: number;
  onToggle: (key: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ 
  filters, 
  activeCount, 
  onToggle, 
  onClearAll 
}: ActiveFiltersProps) {
  if (activeCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6">
      <span className="text-sm text-foreground/60">Filtres :</span>
      
      {filters.materials.map(m => {
        const mat = FILTER_CONFIG.materials.find(x => x.id === m);
        return (
          <button
            key={m}
            onClick={() => onToggle('materials', m)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-full text-sm group"
          >
            <span>{mat?.icon}</span>
            <span>{mat?.label}</span>
            <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {filters.stones.map(s => {
        const stone = FILTER_CONFIG.stones.find(x => x.id === s);
        return (
          <button
            key={s}
            onClick={() => onToggle('stones', s)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-full text-sm group"
          >
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stone?.color }} />
            <span>{stone?.label}</span>
            <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {filters.occasions.map(o => {
        const occ = FILTER_CONFIG.occasions.find(x => x.id === o);
        return (
          <button
            key={o}
            onClick={() => onToggle('occasions', o)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-card rounded-full text-sm group"
          >
            <span>{occ?.emoji}</span>
            <span>{occ?.label}</span>
            <X className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {activeCount > 1 && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 px-2.5 py-1 text-sm text-primary hover:underline"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Tout effacer
        </button>
      )}
    </div>
  );
}

