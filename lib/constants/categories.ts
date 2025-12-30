import { FILTER_CONFIG } from '@/lib/types/filters';

// Mapping des slugs URL → filtres pour les bijoux (types)
export const BIJOUX_TYPE_MAP: Record<string, { filter: string; label: string; description: string }> = {
  'bagues': { 
    filter: 'bague', 
    label: 'Bagues', 
    description: 'Découvrez notre collection de bagues en argent ornées de pierres naturelles'
  },
  'boucles-oreilles': { 
    filter: 'boucles-oreilles', 
    label: "Boucles d'oreilles", 
    description: 'Boucles d\'oreilles artisanales indiennes en argent et pierres précieuses'
  },
  'colliers': { 
    filter: 'collier', 
    label: 'Colliers', 
    description: 'Colliers indiens authentiques en argent avec pierres naturelles'
  },
  'pendentifs': { 
    filter: 'pendentif', 
    label: 'Pendentifs', 
    description: 'Pendentifs artisanaux indiens en argent et pierres précieuses'
  },
  'bracelets': { 
    filter: 'bracelet', 
    label: 'Bracelets', 
    description: 'Bracelets indiens faits main en argent et pierres naturelles'
  },
  'chaines': { 
    filter: 'chaine', 
    label: 'Chaînes', 
    description: 'Chaînes indiennes en argent pour pendentifs et colliers'
  },
  'chevilles': { 
    filter: 'cheville', 
    label: 'Chevilles', 
    description: 'Chevilles indiennes en argent avec pierres naturelles'
  },
  'nouveautes': { 
    filter: 'nouveaute', 
    label: 'Nouveautés', 
    description: 'Découvrez nos dernières créations de bijoux indiens'
  },
  'best-sellers': { 
    filter: 'best-seller', 
    label: 'Meilleures ventes', 
    description: 'Nos bijoux indiens les plus appréciés par nos clients'
  },
  'parures': { 
    filter: 'parure', 
    label: 'Parures', 
    description: 'Parures complètes indiennes en argent et pierres précieuses'
  },
};

// Mapping des slugs URL → filtres pour les pierres
export const PIERRES_STONE_MAP: Record<string, { filter: string; label: string; description: string }> = {
  'turquoise': { 
    filter: 'turquoise', 
    label: 'Bijoux en Turquoise', 
    description: 'Découvrez notre collection de bijoux en turquoise, pierre protectrice aux nuances bleu-vert'
  },
  'amethyste': { 
    filter: 'amethyste', 
    label: 'Bijoux en Améthyste', 
    description: 'Bijoux en améthyste, pierre violette symbole de sagesse et de sérénité'
  },
  'lapis-lazuli': { 
    filter: 'lapis-lazuli', 
    label: 'Bijoux en Lapis Lazuli', 
    description: 'Bijoux en lapis lazuli, pierre bleue royale aux reflets dorés'
  },
  'pierre-de-lune': { 
    filter: 'moonstone', 
    label: 'Bijoux en Pierre de Lune', 
    description: 'Bijoux en pierre de lune, gemme aux reflets nacrés et mystérieux'
  },
  'grenat': { 
    filter: 'grenat', 
    label: 'Bijoux en Grenat', 
    description: 'Bijoux en grenat, pierre rouge profond symbole de passion et de force'
  },
  'corail': { 
    filter: 'corail', 
    label: 'Bijoux en Corail', 
    description: 'Bijoux en corail, matière naturelle aux teintes chaudes et vibrantes'
  },
  'onyx': { 
    filter: 'onyx', 
    label: 'Bijoux en Onyx', 
    description: 'Bijoux en onyx, pierre noire élégante et protectrice'
  },
  'quartz-rose': { 
    filter: 'quartz', 
    label: 'Bijoux en Quartz Rose', 
    description: 'Bijoux en quartz rose, pierre douce symbole d\'amour et de tendresse'
  },
};

// Mapping des slugs URL → filtres pour les accessoires (types)
export const ACCESSOIRES_TYPE_MAP: Record<string, { filter: string; label: string; description: string }> = {
  'pashminas': { 
    filter: 'pashmina', 
    label: 'Pashminas', 
    description: 'Pashminas indiens en cachemire et soie, écharpes de luxe artisanales'
  },
  'foulards': { 
    filter: 'foulard', 
    label: 'Foulards', 
    description: 'Foulards indiens en soie et coton, accessoires élégants et colorés'
  },
  'etoles': { 
    filter: 'soie', 
    label: 'Étoles', 
    description: 'Étoles indiennes en soie, accessoires de mode raffinés'
  },
  'pochettes': { 
    filter: 'pochette', 
    label: 'Pochettes', 
    description: 'Pochettes indiennes artisanales, sacs à main élégants et pratiques'
  },
  'soie': { 
    filter: 'soie', 
    label: 'Soie', 
    description: 'Articles en soie indienne, tissus précieux et raffinés'
  },
  'porte-cles': { 
    filter: 'porte-cles', 
    label: 'Porte-clés', 
    description: 'Porte-clés artisanaux indiens, petits accessoires uniques'
  },
  'chouchous': { 
    filter: 'chouchou', 
    label: 'Chouchous', 
    description: 'Chouchous en tissu indien, accessoires cheveux colorés'
  },
  'bandanas': { 
    filter: 'bandana', 
    label: 'Bandanas', 
    description: 'Bandanas indiens en coton, accessoires de mode polyvalents'
  },
  'marque-pages': { 
    filter: 'marque-page', 
    label: 'Marque-pages', 
    description: 'Marque-pages artisanaux indiens, accessoires pour lecteurs'
  },
  'carnets': { 
    filter: 'carnet', 
    label: 'Carnets', 
    description: 'Carnets artisanaux indiens, papeterie traditionnelle'
  },
  'sacs': { 
    filter: 'sac', 
    label: 'Sacs', 
    description: 'Sacs indiens faits main, accessoires de mode authentiques et colorés'
  },
};

// Helper pour obtenir tous les slugs valides
export function getAllBijouxTypeSlugs(): string[] {
  return Object.keys(BIJOUX_TYPE_MAP);
}

export function getAllPierresStoneSlugs(): string[] {
  return Object.keys(PIERRES_STONE_MAP);
}

export function getAllAccessoiresTypeSlugs(): string[] {
  return Object.keys(ACCESSOIRES_TYPE_MAP);
}





