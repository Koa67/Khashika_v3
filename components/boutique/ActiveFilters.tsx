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
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-[#2D2420]/60">Filtres :</span>
      
      {filters.materials.map(m => {
        const mat = FILTER_CONFIG.materials.find(x => x.id === m);
        return (
          <button
            key={m}
            onClick={() => onToggle('materials', m)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8B71B]/30 rounded-none text-sm group hover:border-[#E8B71B] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]"
          >
            <span>{mat?.icon}</span>
            <span>{mat?.label}</span>
            <X className="w-3.5 h-3.5 text-[#E8B71B] opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {/* Types (Bijoux) */}
      {filters.types.map(t => {
        const type = FILTER_CONFIG.types.find(x => x.id === t);
        return (
          <button
            key={t}
            onClick={() => onToggle('types', t)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8B71B]/30 rounded-none text-sm group hover:border-[#E8B71B] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]"
          >
            <span>{type?.label}</span>
            <X className="w-3.5 h-3.5 text-[#E8B71B] opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {/* Accessories */}
      {filters.accessories.map(a => {
        const acc = FILTER_CONFIG.accessories.find(x => x.id === a);
        return (
          <button
            key={a}
            onClick={() => onToggle('accessories', a)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8B71B]/30 rounded-none text-sm group hover:border-[#E8B71B] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]"
          >
            <span>{acc?.label}</span>
            <X className="w-3.5 h-3.5 text-[#E8B71B] opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {filters.stones.map(s => {
        const stone = FILTER_CONFIG.stones.find(x => x.id === s);
        return (
          <button
            key={s}
            onClick={() => onToggle('stones', s)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8B71B]/30 rounded-none text-sm group hover:border-[#E8B71B] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]"
          >
            <span className="w-3 h-3 rounded-none" style={{ backgroundColor: stone?.color }} />
            <span>{stone?.label}</span>
            <X className="w-3.5 h-3.5 text-[#E8B71B] opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {filters.occasions.map(o => {
        const occ = FILTER_CONFIG.occasions.find(x => x.id === o);
        return (
          <button
            key={o}
            onClick={() => onToggle('occasions', o)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8B71B]/30 rounded-none text-sm group hover:border-[#E8B71B] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]"
          >
            <span>{occ?.emoji}</span>
            <span>{occ?.label}</span>
            <X className="w-3.5 h-3.5 text-[#E8B71B] opacity-50 group-hover:opacity-100" />
          </button>
        );
      })}
      
      {activeCount > 1 && (
        <button
          onClick={onClearAll}
          className="flex items-center gap-1 text-sm text-[#E07A5F] hover:text-[#C44536] transition font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Tout effacer
        </button>
      )}
    </div>
  );
}

