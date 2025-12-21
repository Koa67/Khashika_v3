/**
 * KHASHIKA v2.0 - Module de correction d'association Produit ↔ Photo
 * 
 * PROBLÈME RÉSOLU:
 * L'ancien algorithme associait les produits contenant des noms de pierres
 * aux images génériques de la page "Autour du bijou indien".
 * 
 * SOLUTION:
 * 1. Blacklist stricte des URLs/chemins de la page informative
 * 2. Validation que l'image provient d'une VRAIE fiche produit
 * 3. Association basée sur l'ID produit WordPress, pas sur les mots-clés
 */

// ============================================================================
// CONFIGURATION - BLACKLIST STRICTE
// ============================================================================

export const BLACKLISTED_IMAGE_SOURCES = {
  // Page principale à exclure
  pages: [
    'https://www.khashika.com/autour-du-bijou-indien/',
    '/autour-du-bijou-indien/',
    'autour-du-bijou-indien',
  ],
  
  // Patterns de noms de fichiers génériques de pierres à exclure
  genericStonePatterns: [
    /^grenat\.(jpg|jpeg|png|webp)$/i,
    /^amethyste\.(jpg|jpeg|png|webp)$/i,
    /^onyx\.(jpg|jpeg|png|webp)$/i,
    /^aventurine\.(jpg|jpeg|png|webp)$/i,
    /^turquoise\.(jpg|jpeg|png|webp)$/i,
    /^lapis[_-]?lazuli\.(jpg|jpeg|png|webp)$/i,
    /^citrine\.(jpg|jpeg|png|webp)$/i,
    /^quartz[_-]?rose\.(jpg|jpeg|png|webp)$/i,
    /^jade\.(jpg|jpeg|png|webp)$/i,
    /^perle\.(jpg|jpeg|png|webp)$/i,
    /^corail\.(jpg|jpeg|png|webp)$/i,
    /^topaze\.(jpg|jpeg|png|webp)$/i,
    /^peridot\.(jpg|jpeg|png|webp)$/i,
    /^moonstone\.(jpg|jpeg|png|webp)$/i,
    /^labradorite\.(jpg|jpeg|png|webp)$/i,
    /^agate\.(jpg|jpeg|png|webp)$/i,
    /^jaspe\.(jpg|jpeg|png|webp)$/i,
    /^oeil[_-]?de[_-]?tigre\.(jpg|jpeg|png|webp)$/i,
    /^malachite\.(jpg|jpeg|png|webp)$/i,
    /^rubis\.(jpg|jpeg|png|webp)$/i,
    /^saphir\.(jpg|jpeg|png|webp)$/i,
    /^emeraude\.(jpg|jpeg|png|webp)$/i,
  ],
  
  // Chemins de dossiers à exclure
  excludedPaths: [
    '/images/stones/',
    '/images/pierres/',
    '/images/gems/',
    '/images/informative/',
    '/assets/stones/',
  ],
};

export const VALID_PRODUCT_IMAGE_SOURCES = [
  '/wp-content/uploads/',
  '/images/products/',
  '/public/images/products/',
  'cdn.khashika.com/products/',
];

// Valeurs invalides explicites
const INVALID_IMAGE_VALUES = [
  'image manquante',
  'placeholder',
  'null',
  'undefined',
];

// ============================================================================
// TYPES
// ============================================================================

export interface ProductImage {
  url: string;
  filename: string;
  source: 'wordpress' | 'local' | 'cdn' | 'unknown';
  isValid: boolean;
  rejectionReason?: string;
}

export interface Product {
  id: number | string;
  slug: string;
  name: string;
  wpProductId?: number;
  images: ProductImage[];
}

export interface ImageAssociationResult {
  productId: number | string;
  productName: string;
  associatedImages: ProductImage[];
  rejectedImages: ProductImage[];
  status: 'success' | 'partial' | 'no_images';
}

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

function extractFilename(url: string): string {
  try {
    const urlObj = new URL(url, 'https://www.khashika.com');
    return urlObj.pathname.split('/').pop() || url;
  } catch {
    return url.split('/').pop() || url;
  }
}

function determineImageSource(url: string): 'wordpress' | 'local' | 'cdn' | 'unknown' {
  const normalizedUrl = url.toLowerCase();
  
  if (normalizedUrl.includes('/wp-content/uploads/')) return 'wordpress';
  if (normalizedUrl.includes('cdn.')) return 'cdn';
  if (normalizedUrl.startsWith('/') || normalizedUrl.includes('/public/') || !normalizedUrl.includes('/')) return 'local';
  
  return 'unknown';
}

function hasValidImageExtension(url: string): boolean {
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
  return validExtensions.some(ext => url.toLowerCase().endsWith(ext));
}

// ============================================================================
// FONCTIONS DE VALIDATION
// ============================================================================

export function isImageBlacklisted(imageUrl: string): boolean {
  const normalizedUrl = imageUrl.toLowerCase().trim();
  
  // 0. Vérifier les valeurs invalides explicites
  for (const invalid of INVALID_IMAGE_VALUES) {
    if (normalizedUrl === invalid || normalizedUrl.includes(invalid)) {
      return true;
    }
  }
  
  // 1. Vérifier si l'URL provient d'une page blacklistée
  for (const page of BLACKLISTED_IMAGE_SOURCES.pages) {
    if (normalizedUrl.includes(page.toLowerCase())) {
      return true;
    }
  }
  
  // 2. Vérifier si le nom de fichier correspond à un pattern générique de pierre
  const filename = extractFilename(imageUrl);
  for (const pattern of BLACKLISTED_IMAGE_SOURCES.genericStonePatterns) {
    if (pattern.test(filename)) {
      return true;
    }
  }
  
  // 3. Vérifier si le chemin est dans un dossier exclu
  for (const excludedPath of BLACKLISTED_IMAGE_SOURCES.excludedPaths) {
    if (normalizedUrl.includes(excludedPath.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

export function isFromValidProductSource(imageUrl: string): boolean {
  const normalizedUrl = imageUrl.toLowerCase();
  
  // Si c'est une URL complète ou un chemin avec répertoire valide
  for (const validSource of VALID_PRODUCT_IMAGE_SOURCES) {
    if (normalizedUrl.includes(validSource.toLowerCase())) {
      return true;
    }
  }
  
  // Si c'est un nom de fichier simple (sans chemin ou chemin /images/)
  // et qu'il a une extension d'image valide, on l'accepte
  const filename = extractFilename(imageUrl);
  const isSimpleFilename = !normalizedUrl.includes('/') || normalizedUrl.startsWith('/images/');
  const hasValidExt = hasValidImageExtension(filename);
  
  if (isSimpleFilename && hasValidExt) {
    return true;
  }
  
  return false;
}

export function validateProductImage(imageUrl: string): ProductImage {
  const filename = extractFilename(imageUrl);
  const source = determineImageSource(imageUrl);
  
  // Vérifier d'abord les valeurs vides/invalides
  if (!imageUrl || imageUrl.trim() === '') {
    return {
      url: imageUrl,
      filename,
      source,
      isValid: false,
      rejectionReason: 'URL d\'image vide ou invalide',
    };
  }
  
  if (isImageBlacklisted(imageUrl)) {
    return {
      url: imageUrl,
      filename,
      source,
      isValid: false,
      rejectionReason: 'Image provenant d\'une source blacklistée (page informative ou nom générique de pierre)',
    };
  }
  
  if (!hasValidImageExtension(imageUrl)) {
    return {
      url: imageUrl,
      filename,
      source,
      isValid: false,
      rejectionReason: 'Extension de fichier non valide',
    };
  }
  
  if (!isFromValidProductSource(imageUrl)) {
    return {
      url: imageUrl,
      filename,
      source,
      isValid: false,
      rejectionReason: 'Image ne provenant pas d\'une source de produit valide',
    };
  }
  
  return {
    url: imageUrl,
    filename,
    source,
    isValid: true,
  };
}

export function associateProductImages(
  product: Product,
  candidateImages: string[]
): ImageAssociationResult {
  const associatedImages: ProductImage[] = [];
  const rejectedImages: ProductImage[] = [];
  
  for (const imageUrl of candidateImages) {
    const validatedImage = validateProductImage(imageUrl);
    
    if (validatedImage.isValid) {
      associatedImages.push(validatedImage);
    } else {
      rejectedImages.push(validatedImage);
    }
  }
  
  let status: 'success' | 'partial' | 'no_images';
  if (associatedImages.length === candidateImages.length && associatedImages.length > 0) {
    status = 'success';
  } else if (associatedImages.length > 0) {
    status = 'partial';
  } else {
    status = 'no_images';
  }
  
  return {
    productId: product.id,
    productName: product.name,
    associatedImages,
    rejectedImages,
    status,
  };
}

const imageAssociation = {
  isImageBlacklisted,
  isFromValidProductSource,
  validateProductImage,
  associateProductImages,
  BLACKLISTED_IMAGE_SOURCES,
  VALID_PRODUCT_IMAGE_SOURCES,
};

export default imageAssociation;





