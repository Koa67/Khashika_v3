// ============================================================================
// KHASHIKA - STYLE GRID
// ============================================================================
// Grille visuelle pour sélectionner le style de bijou
// Images inspirantes avec overlay élégant
// ============================================================================

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';

interface Style {
  id: string;
  label: string;
  image: string;
}

interface StyleGridProps {
  styles: Style[];
  selected: string[];
  onToggle: (id: string) => void;
}

// Fallback images si les images de style ne sont pas disponibles
const FALLBACK_GRADIENTS: Record<string, string> = {
  traditionnel: 'linear-gradient(135deg, #F0C11D 0%, #8B6914 100%)',
  moderne: 'linear-gradient(135deg, #C0C0C0 0%, #6B7280 100%)',
  boheme: 'linear-gradient(135deg, #F59E0B 0%, #92400E 100%)',
  tribal: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)',
  kundan: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
  temple: 'linear-gradient(135deg, #F0C11D 0%, #B45309 100%)',
};

export default function StyleGrid({
  styles,
  selected,
  onToggle,
}: StyleGridProps) {
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set());
  
  const handleImageError = (styleId: string) => {
    setImageErrors(prev => new Set(prev).add(styleId));
  };

  return (
    <div className="space-y-3">
      {/* Grille 2x3 */}
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style, index) => {
          const isSelected = selected.includes(style.id);
          const hasImageError = imageErrors.has(style.id);
          const fallbackGradient = FALLBACK_GRADIENTS[style.id] || 'linear-gradient(135deg, #6B7280, #374151)';
          
          return (
            <motion.button
              key={style.id}
              onClick={() => onToggle(style.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden group
                         transition-all duration-300
                         ${isSelected 
                           ? 'ring-2 ring-[#8B4E4E] ring-offset-2' 
                           : 'ring-1 ring-gray-200 hover:ring-[#8B4E4E]/50'}`}
            >
              {/* Image ou gradient fallback */}
              {!hasImageError ? (
                <Image
                  src={style.image}
                  alt={style.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={() => handleImageError(style.id)}
                />
              ) : (
                <div 
                  className="absolute inset-0"
                  style={{ background: fallbackGradient }}
                />
              )}
              
              {/* Overlay gradient */}
              <div 
                className={`absolute inset-0 transition-opacity duration-300
                           ${isSelected 
                             ? 'bg-[#8B4E4E]/40' 
                             : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70'}`}
              />
              
              {/* Label */}
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <motion.span
                  className={`text-sm font-medium drop-shadow-lg transition-colors
                             ${isSelected ? 'text-white' : 'text-white/90 group-hover:text-white'}`}
                >
                  {style.label}
                </motion.span>
              </div>
              
              {/* Indicateur de sélection */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-[#F5EDE6] rounded-full 
                              flex items-center justify-center shadow-lg"
                  >
                    <Check className="w-4 h-4 text-[#8B4E4E]" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Bordure de survol */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  boxShadow: 'inset 0 0 0 2px rgba(37, 150, 190, 0.5)',
                }}
              />
            </motion.button>
          );
        })}
      </div>
      
      {/* Description du style sélectionné */}
      <AnimatePresence mode="wait">
        {selected.length > 0 && (
          <motion.div
            key={selected.join(',')}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-2 border-t border-gray-100"
          >
            <div className="flex flex-wrap gap-1.5">
              {selected.map((id) => {
                const style = styles.find(s => s.id === id);
                if (!style) return null;
                
                return (
                  <span
                    key={id}
                    className="inline-flex items-center gap-1 px-2.5 py-1 
                              bg-[#8B4E4E]/10 text-[#8B4E4E] rounded-full text-xs font-medium"
                  >
                    {style.label}
                  </span>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Aide contextuelle */}
      <p className="text-xs text-gray-400">
        Sélectionnez un ou plusieurs styles pour affiner votre recherche
      </p>
    </div>
  );
}
