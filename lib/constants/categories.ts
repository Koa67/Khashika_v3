// Mapping des slugs URL → filtres pour les bijoux (types)
export const BIJOUX_TYPE_MAP: Record<string, { filter: string; label: string; description: string }> = {
  'bagues': { 
    filter: 'bague', 
    label: 'Bagues', 
    description: 'Découvrez notre collection de bagues en argent ornées de pierres naturelles'
  },
  'boucles-oreilles': { 
    filter: "boucles d'oreilles", 
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
    filter: 'chaîne', 
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

// IDs des variantes d'onyx pour le filtrage spécial
const ONYX_VARIANT_IDS = ['onyx noir', 'onyx vert', 'onyx bleu', 'onyx rouge'];

// Mapping des slugs URL → filtres pour les pierres (40 pierres)
// IMPORTANT: Les "filter" doivent correspondre EXACTEMENT aux valeurs dans products-ultimate.json
export const PIERRES_STONE_MAP: Record<string, { filter: string | string[]; label: string; description: string }> = {
  // === TOP 8 par popularité ===
  'turquoise': { 
    filter: 'turquoise', 
    label: 'Bijoux en Turquoise', 
    description: 'Découvrez notre collection de bijoux en turquoise, pierre protectrice aux nuances bleu-vert'
  },
  'lapis-lazuli': { 
    filter: 'lapis-lazuli', 
    label: 'Bijoux en Lapis Lazuli', 
    description: 'Bijoux en lapis lazuli, pierre bleue royale aux reflets dorés'
  },
  'agate': { 
    filter: 'agate', 
    label: 'Bijoux en Agate', 
    description: 'Bijoux en agate, pierre aux bandes colorées symbole d\'équilibre et d\'harmonie'
  },
  'onyx': { 
    filter: ONYX_VARIANT_IDS, 
    label: 'Bijoux en Onyx', 
    description: 'Bijoux en onyx, pierre élégante et protectrice disponible en plusieurs couleurs'
  },
  'pierre-de-lune': { 
    filter: 'pierre de lune',
    label: 'Bijoux en Pierre de Lune', 
    description: 'Bijoux en pierre de lune, gemme aux reflets nacrés et mystérieux'
  },
  'corail': { 
    filter: 'corail', 
    label: 'Bijoux en Corail', 
    description: 'Bijoux en corail, matière naturelle aux teintes chaudes et vibrantes'
  },
  'amethyste': { 
    filter: 'améthyste',
    label: 'Bijoux en Améthyste', 
    description: 'Bijoux en améthyste, pierre violette symbole de sagesse et de sérénité'
  },
  'quartz-rose': { 
    filter: 'quartz', 
    label: 'Bijoux en Quartz', 
    description: 'Bijoux en quartz rose, pierre douce symbole d\'amour et de tendresse'
  },
  // === Pierres moyennes (10-19 produits) ===
  'oeil-de-tigre': { 
    filter: 'oeil de tigre', 
    label: 'Bijoux en Œil de Tigre', 
    description: 'Bijoux en œil de tigre, pierre dorée aux reflets chatoyants symbole de protection'
  },
  'cornaline': { 
    filter: 'cornaline', 
    label: 'Bijoux en Cornaline', 
    description: 'Bijoux en cornaline, pierre rouge-orangée symbole de vitalité et de courage'
  },
  'peridot': { 
    filter: 'péridot', 
    label: 'Bijoux en Péridot', 
    description: 'Bijoux en péridot, pierre verte lumineuse symbole de renouveau'
  },
  // === Pierres standard (5-9 produits) ===
  'grenat': { 
    filter: 'grenat', 
    label: 'Bijoux en Grenat', 
    description: 'Bijoux en grenat, pierre rouge profond symbole de passion et de force'
  },
  'jade': { 
    filter: 'jade', 
    label: 'Bijoux en Jade', 
    description: 'Bijoux en jade, pierre verte symbole de pureté et de sagesse orientale'
  },
  'calcedoine': { 
    filter: 'calcédoine', 
    label: 'Bijoux en Calcédoine', 
    description: 'Bijoux en calcédoine, pierre douce aux teintes bleutées apaisantes'
  },
  'perle': { 
    filter: 'perle', 
    label: 'Bijoux en Perle', 
    description: 'Bijoux en perle, gemme organique symbole d\'élégance intemporelle'
  },
  'jaspe': { 
    filter: 'jaspe', 
    label: 'Bijoux en Jaspe', 
    description: 'Bijoux en jaspe, pierre aux motifs naturels uniques'
  },
  'labradorite': { 
    filter: 'labradorite', 
    label: 'Bijoux en Labradorite', 
    description: 'Bijoux en labradorite, pierre aux reflets irisés magiques'
  },
  'topaze': { 
    filter: 'topaze', 
    label: 'Bijoux en Topaze', 
    description: 'Bijoux en topaze, pierre précieuse aux teintes dorées'
  },
  'obsidienne': { 
    filter: 'obsidienne', 
    label: 'Bijoux en Obsidienne', 
    description: 'Bijoux en obsidienne, verre volcanique noir et protecteur'
  },
  'rubis': { 
    filter: 'rubis', 
    label: 'Bijoux en Rubis', 
    description: 'Bijoux en rubis indien, pierre précieuse rouge symbole de passion'
  },
  'citrine': { 
    filter: 'citrine', 
    label: 'Bijoux en Citrine', 
    description: 'Bijoux en citrine, pierre solaire symbole de joie et d\'abondance'
  },
  'aigue-marine': { 
    filter: 'aigue-marine', 
    label: 'Bijoux en Aigue-Marine', 
    description: 'Bijoux en aigue-marine, pierre bleu clair symbole de sérénité'
  },
  'howlite': { 
    filter: 'howlite', 
    label: 'Bijoux en Howlite', 
    description: 'Bijoux en howlite, pierre blanche apaisante'
  },
  // === Pierres moins fréquentes (3-4 produits) ===
  'amazonite': { 
    filter: 'amazonite', 
    label: 'Bijoux en Amazonite', 
    description: 'Bijoux en amazonite, pierre turquoise symbole de courage'
  },
  'emeraude': { 
    filter: 'émeraude', 
    label: 'Bijoux en Émeraude', 
    description: 'Bijoux en émeraude, pierre précieuse verte symbole de renouveau'
  },
  'cristal': { 
    filter: 'cristal', 
    label: 'Bijoux en Cristal', 
    description: 'Bijoux en cristal de roche, pierre pure et clarifiante'
  },
  'aventurine': { 
    filter: 'aventurine', 
    label: 'Bijoux en Aventurine', 
    description: 'Bijoux en aventurine, pierre verte symbole de chance'
  },
  'saphir': { 
    filter: 'saphir', 
    label: 'Bijoux en Saphir', 
    description: 'Bijoux en saphir bleu, pierre précieuse symbole de sagesse'
  },
  'malachite': { 
    filter: 'malachite', 
    label: 'Bijoux en Malachite', 
    description: 'Bijoux en malachite, pierre verte aux bandes hypnotiques'
  },
  // === Pierres rares (1-2 produits) ===
  'dzi': { 
    filter: 'dzi', 
    label: 'Bijoux en Pierre Dzi', 
    description: 'Bijoux avec pierre Dzi tibétaine, perle sacrée aux motifs mystiques'
  },
  'larimar': { 
    filter: 'larimar', 
    label: 'Bijoux en Larimar', 
    description: 'Bijoux en larimar, pierre bleue rare des Caraïbes'
  },
  'jaspe-dalmatien': { 
    filter: 'jaspe dalmatien', 
    label: 'Bijoux en Jaspe Dalmatien', 
    description: 'Bijoux en jaspe dalmatien, pierre tachetée unique'
  },
  'tourmaline': { 
    filter: 'tourmaline', 
    label: 'Bijoux en Tourmaline', 
    description: 'Bijoux en tourmaline, pierre aux multiples couleurs'
  },
  'nacre': { 
    filter: 'nacre', 
    label: 'Bijoux en Nacre', 
    description: 'Bijoux en nacre, matière irisée aux reflets arc-en-ciel'
  },
  'zircon': { 
    filter: 'zircon', 
    label: 'Bijoux en Zircon', 
    description: 'Bijoux en zircon, pierre brillante aux éclats de diamant'
  },
  'rhodonite': { 
    filter: 'rhodonite', 
    label: 'Bijoux en Rhodonite', 
    description: 'Bijoux en rhodonite, pierre rose symbole d\'amour compassionnel'
  },
  // === Variantes d'onyx individuelles ===
  'onyx-noir': { 
    filter: 'onyx noir', 
    label: 'Bijoux en Onyx Noir', 
    description: 'Bijoux en onyx noir, pierre noire élégante et protectrice'
  },
  'onyx-vert': { 
    filter: 'onyx vert', 
    label: 'Bijoux en Onyx Vert', 
    description: 'Bijoux en onyx vert, pierre verte profonde et apaisante'
  },
  'onyx-bleu': { 
    filter: 'onyx bleu', 
    label: 'Bijoux en Onyx Bleu', 
    description: 'Bijoux en onyx bleu, pierre bleue rare et mystérieuse'
  },
  'onyx-rouge': { 
    filter: 'onyx rouge', 
    label: 'Bijoux en Onyx Rouge', 
    description: 'Bijoux en onyx rouge, pierre rouge profonde et énergisante'
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

// Helper pour obtenir le(s) filtre(s) d'une pierre
export function getStoneFilters(slug: string): string[] {
  const mapping = PIERRES_STONE_MAP[slug];
  if (!mapping) return [];
  
  if (Array.isArray(mapping.filter)) {
    return mapping.filter;
  }
  return [mapping.filter];
}
