// ============================================================================
// KHASHIKA - COLOR SWATCHES
// ============================================================================
// Nuancier visuel pour filtrer par couleur dominante
// Design luxueux avec pastilles interactives
// ============================================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

interface Color {
  id: string;
  label: string;
  hex: string;
}

interface ColorSwatchesProps {
  colors: Color[];
  selected: string[];
  onToggle: (id: string) => void;
}

export default function ColorSwatches({
  colors,
  selected,
  onToggle,
}: ColorSwatchesProps) {
  // Déterminer si une couleur est claire pour ajuster le check
  const isLightColor = (hex: string) => {
    // Pour les gradients, considérer comme clair
    if (hex.includes('gradient')) return true;
    
    // Convertir hex en RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    
    // Calculer la luminosité
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6;
  };

  return (
    <div className="space-y-3">
      {/* Grille de swatches */}
      <div className="flex flex-wrap gap-2">
        {colors.map((color, index) => {
          const isSelected = selected.includes(color.id);
          const isLight = isLightColor(color.hex);
          const isGradient = color.hex.includes('gradient');
          
          return (
            <motion.button
              key={color.id}
              onClick={() => onToggle(color.id)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.03, type: 'spring', stiffness: 400, damping: 20 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
              title={color.label}
            >
              {/* Anneau de sélection */}
              <motion.div
                className="absolute -inset-1 rounded-full"
                animate={{
                  boxShadow: isSelected 
                    ? `0 0 0 2px #2596be, 0 0 12px rgba(37, 150, 190, 0.3)`
                    : '0 0 0 0px transparent',
                }}
                transition={{ duration: 0.2 }}
              />
              
              {/* Swatch */}
              <div
                className={`relative w-9 h-9 rounded-full overflow-hidden 
                           shadow-md ring-1 ring-black/10
                           transition-transform duration-200
                           ${isSelected ? 'ring-2 ring-[#2596be]' : 'group-hover:ring-[#2596be]/50'}`}
                style={{
                  background: color.hex,
                }}
              >
                {/* Effet de brillance */}
                <div 
                  className="absolute inset-0 opacity-40"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                  }}
                />
                
                {/* Indicateur de sélection */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center
                                      ${isLight && !isGradient ? 'bg-gray-800' : 'bg-white'}`}>
                        <Check 
                          className={`w-3 h-3 ${isLight && !isGradient ? 'text-white' : 'text-gray-800'}`}
                          strokeWidth={3} 
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Pattern pour multicolore */}
                {color.id === 'multicolore' && (
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'conic-gradient(from 0deg, #FF6B6B, #FFE66D, #4ECDC4, #45B7D1, #96C93D, #FF6B6B)',
                    }}
                  />
                )}
              </div>
              
              {/* Tooltip au survol */}
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                whileHover={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5
                          bg-gray-900 text-white text-xs rounded whitespace-nowrap
                          pointer-events-none z-10"
              >
                {color.label}
              </motion.div>
            </motion.button>
          );
        })}
      </div>
      
      {/* Labels des couleurs sélectionnées */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100"
        >
          {selected.map((id) => {
            const color = colors.find(c => c.id === id);
            if (!color) return null;
            
            return (
              <motion.span
                key={id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 
                          bg-gray-100 text-gray-600 rounded-full text-xs"
              >
                <span
                  className="w-3 h-3 rounded-full ring-1 ring-black/10"
                  style={{ background: color.hex }}
                />
                {color.label}
              </motion.span>
            );
          })}
        </motion.div>
      )}
      
      {/* Aide */}
      <p className="text-xs text-gray-400 mt-2">
        Cliquez pour sélectionner une ou plusieurs couleurs
      </p>
    </div>
  );
}
