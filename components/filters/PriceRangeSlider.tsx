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
  step = 1,
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
  
  // Presets rapides - adaptés à la plage 1-50€
  const getPresets = () => {
    if (max <= 50) {
      // Plage petite (1-50€) - segments clairs
      return [
        { label: 'Tous', value: [min, max] as [number, number] },
        { label: '< 10 €', value: [min, Math.min(10, max)] as [number, number] },
        { label: '10-25 €', value: [Math.max(min, 10), Math.min(25, max)] as [number, number] },
        { label: '25-40 €', value: [Math.max(min, 25), Math.min(40, max)] as [number, number] },
        { label: '> 40 €', value: [Math.max(min, 40), max] as [number, number] },
      ];
    } else {
      // Plage plus large (fallback)
      const quarter = Math.round(max / 4);
      const half = Math.round(max / 2);
      return [
        { label: 'Tous', value: [min, max] as [number, number] },
        { label: `< ${quarter}€`, value: [min, quarter] as [number, number] },
        { label: `${quarter}-${half}€`, value: [quarter, half] as [number, number] },
        { label: `> ${half}€`, value: [half, max] as [number, number] },
      ];
    }
  };
  const presets = getPresets();
  
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
            className={`px-2.5 py-1 text-xs rounded-none transition-all duration-200 border
                       ${isPresetActive(preset.value)
                         ? 'bg-[#E8B71B] text-white border-[#E8B71B]'
                         : 'bg-white text-gray-600 border-[#E8B71B]/30 hover:border-[#E8B71B] hover:shadow-[0_0_8px_rgba(240,193,29,0.3)]'
                       }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
      
      {/* Slider track */}
      <div className="pt-4 pb-6 overflow-visible">
        <div
          ref={trackRef}
          className="relative h-2 bg-gray-200 rounded-none cursor-pointer overflow-visible"
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
            className="absolute h-full bg-gradient-to-r from-[#E8B71B] to-[#E8C547] rounded-none"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
            layoutId="price-range"
          />
          
          {/* Thumb Min */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 
                       bg-white rounded-none shadow-lg border-2 cursor-grab
                       transition-shadow duration-200
                       ${isDragging === 'min' 
                         ? 'border-[#E8B71B] shadow-[#E8B71B]/30 shadow-lg scale-110 cursor-grabbing' 
                         : 'border-[#E8B71B]/30 hover:border-[#E8B71B]'}`}
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
                         bg-gray-900 text-white text-xs rounded-none whitespace-nowrap"
            >
              {localMin}{currency}
            </motion.div>
          </motion.div>
          
          {/* Thumb Max */}
          <motion.div
            className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 
                       bg-white rounded-none shadow-lg border-2 cursor-grab
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
                         bg-gray-900 text-white text-xs rounded-none whitespace-nowrap"
            >
              {localMax}{currency}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Indicateur visuel de la plage */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{min}{currency}</span>
        <span className="text-[#E8B71B] font-medium">
          {localMin}{currency} – {localMax}{currency}
        </span>
        <span>{max}{currency}</span>
      </div>
      
    </div>
  );
}
