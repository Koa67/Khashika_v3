// ============================================================================
// KHASHIKA - PRICE RANGE SLIDER
// ============================================================================
// Double curseur interactif pour la plage de prix
// Avec saisie manuelle et affichage visuel luxueux
// ============================================================================

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  currency?: string;
  step?: number;
}

export default function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  currency = '€',
  step = 5,
}: PriceRangeSliderProps) {
  const [localMin, setLocalMin] = useState(value[0]);
  const [localMax, setLocalMax] = useState(value[1]);
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Synchroniser avec les props
  useEffect(() => {
    setLocalMin(value[0]);
    setLocalMax(value[1]);
  }, [value]);
  
  // Calculer la position en pourcentage
  const minPercent = ((localMin - min) / (max - min)) * 100;
  const maxPercent = ((localMax - min) / (max - min)) * 100;
  
  // Gérer le drag
  const handleMouseDown = useCallback((thumb: 'min' | 'max') => (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(thumb);
  }, []);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    
    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const rawValue = min + (percent / 100) * (max - min);
    const snappedValue = Math.round(rawValue / step) * step;
    
    if (isDragging === 'min') {
      const newMin = Math.min(snappedValue, localMax - step);
      setLocalMin(Math.max(min, newMin));
    } else {
      const newMax = Math.max(snappedValue, localMin + step);
      setLocalMax(Math.min(max, newMax));
    }
  }, [isDragging, localMin, localMax, min, max, step]);
  
  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      onChange([localMin, localMax]);
      setIsDragging(null);
    }
  }, [isDragging, localMin, localMax, onChange]);
  
  // Event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);
  
  // Saisie manuelle
  const handleInputChange = (type: 'min' | 'max', inputValue: string) => {
    const numValue = parseInt(inputValue) || 0;
    
    if (type === 'min') {
      const newMin = Math.max(min, Math.min(numValue, localMax - step));
      setLocalMin(newMin);
      onChange([newMin, localMax]);
    } else {
      const newMax = Math.min(max, Math.max(numValue, localMin + step));
      setLocalMax(newMax);
      onChange([localMin, newMax]);
    }
  };
  
  // Presets rapides
  const presets = [
    { label: 'Tous', value: [min, max] as [number, number] },
    { label: '< 50€', value: [min, 50] as [number, number] },
    { label: '50-100€', value: [50, 100] as [number, number] },
    { label: '100-200€', value: [100, 200] as [number, number] },
    { label: '> 200€', value: [200, max] as [number, number] },
  ];
  
  const isPresetActive = (preset: [number, number]) =>
    localMin === preset[0] && localMax === preset[1];

  return (
    <div className="space-y-4">
      
      {/* Presets rapides */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setLocalMin(preset.value[0]);
              setLocalMax(preset.value[1]);
              onChange(preset.value);
            }}
            className={`px-2.5 py-1 text-xs rounded-full transition-all duration-200 border
                       ${isPresetActive(preset.value)
                         ? 'bg-[#8B4E4E] text-white border-[#8B4E4E]'
                         : 'bg-[#F5EDE6] text-gray-600 border-gray-200 hover:border-[#8B4E4E]/50'
                       }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      {/* Slider track */}
      <div className="pt-2 pb-4">
        <div
          ref={trackRef}
          className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
          onClick={(e) => {
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const percent = ((e.clientX - rect.left) / rect.width) * 100;
            const clickValue = min + (percent / 100) * (max - min);
            
            // Déterminer quel thumb déplacer
            const distToMin = Math.abs(clickValue - localMin);
            const distToMax = Math.abs(clickValue - localMax);
            
            if (distToMin < distToMax) {
              const newMin = Math.round(clickValue / step) * step;
              setLocalMin(Math.max(min, Math.min(newMin, localMax - step)));
              onChange([Math.max(min, Math.min(newMin, localMax - step)), localMax]);
            } else {
              const newMax = Math.round(clickValue / step) * step;
              setLocalMax(Math.min(max, Math.max(newMax, localMin + step)));
              onChange([localMin, Math.min(max, Math.max(newMax, localMin + step))]);
            }
          }}
        >
          {/* Range actif */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-[#8B4E4E] to-[#40c4ff] rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
            layoutId="price-range"
          />
          
          {/* Thumb Min */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 
                       bg-[#F5EDE6] rounded-full shadow-lg border-2 cursor-grab
                       transition-shadow duration-200
                       ${isDragging === 'min' 
                         ? 'border-[#8B4E4E] shadow-[#8B4E4E]/30 shadow-lg scale-110 cursor-grabbing' 
                         : 'border-gray-300 hover:border-[#8B4E4E]'}`}
            style={{ left: `${minPercent}%` }}
            onMouseDown={handleMouseDown('min')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.15 }}
          >
            {/* Tooltip au survol */}
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isDragging === 'min' ? 1 : 0, y: isDragging === 'min' ? -8 : 5 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 
                         bg-gray-900 text-white text-xs rounded whitespace-nowrap"
            >
              {localMin}{currency}
            </motion.div>
          </motion.div>
          
          {/* Thumb Max */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 
                       bg-[#F5EDE6] rounded-full shadow-lg border-2 cursor-grab
                       transition-shadow duration-200
                       ${isDragging === 'max' 
                         ? 'border-[#8B4E4E] shadow-[#8B4E4E]/30 shadow-lg scale-110 cursor-grabbing' 
                         : 'border-gray-300 hover:border-[#8B4E4E]'}`}
            style={{ left: `${maxPercent}%` }}
            onMouseDown={handleMouseDown('max')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.15 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: isDragging === 'max' ? 1 : 0, y: isDragging === 'max' ? -8 : 5 }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 
                         bg-gray-900 text-white text-xs rounded whitespace-nowrap"
            >
              {localMax}{currency}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Inputs manuels */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Min</label>
          <div className="relative">
            <input
              type="number"
              value={localMin}
              onChange={(e) => handleInputChange('min', e.target.value)}
              min={min}
              max={localMax - step}
              step={step}
              className="w-full px-3 py-2 pr-7 text-sm border border-gray-200 rounded-lg
                        focus:outline-none focus:border-[#8B4E4E] focus:ring-1 focus:ring-[#8B4E4E]/20
                        transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {currency}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-center w-6 pt-5">
          <div className="w-4 h-px bg-gray-300" />
        </div>
        
        <div className="flex-1">
          <label className="text-xs text-gray-500 mb-1 block">Max</label>
          <div className="relative">
            <input
              type="number"
              value={localMax}
              onChange={(e) => handleInputChange('max', e.target.value)}
              min={localMin + step}
              max={max}
              step={step}
              className="w-full px-3 py-2 pr-7 text-sm border border-gray-200 rounded-lg
                        focus:outline-none focus:border-[#8B4E4E] focus:ring-1 focus:ring-[#8B4E4E]/20
                        transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              {currency}
            </span>
          </div>
        </div>
      </div>
      
      {/* Indicateur visuel de la plage */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{min}{currency}</span>
        <span className="text-[#8B4E4E] font-medium">
          {localMin}{currency} – {localMax}{currency}
        </span>
        <span>{max}{currency}+</span>
      </div>
      
    </div>
  );
}
