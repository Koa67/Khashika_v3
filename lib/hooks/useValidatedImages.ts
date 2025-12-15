'use client';

import { useMemo } from 'react';
import {
  validateProductImage,
  isImageBlacklisted,
  type ProductImage,
} from '@/lib/imageAssociation';

interface UseValidatedImagesOptions {
  fallbackImage?: string;
  maxImages?: number;
  debug?: boolean;
}

interface UseValidatedImagesResult {
  validImages: string[];
  validations: ProductImage[];
  rejectedCount: number;
  mainImage: string | null;
  galleryImages: string[];
  hasValidImages: boolean;
}

const DEFAULT_FALLBACK = '/images/placeholder-product.jpg';

export function useValidatedImages(
  images: string[] | null | undefined,
  options: UseValidatedImagesOptions = {}
): UseValidatedImagesResult {
  const {
    fallbackImage = DEFAULT_FALLBACK,
    maxImages,
    debug = process.env.NODE_ENV === 'development',
  } = options;

  const result = useMemo(() => {
    const inputImages = images || [];
    const validations: ProductImage[] = [];
    const validImages: string[] = [];
    let rejectedCount = 0;

    for (const imageUrl of inputImages) {
      const validation = validateProductImage(imageUrl);
      validations.push(validation);

      if (validation.isValid) {
        validImages.push(imageUrl);
      } else {
        rejectedCount++;
        if (debug) {
          console.warn(`[useValidatedImages] Image rejetée: ${imageUrl}`, validation.rejectionReason);
        }
      }
    }

    const limitedImages = maxImages ? validImages.slice(0, maxImages) : validImages;
    const mainImage = limitedImages[0] || fallbackImage || null;
    const galleryImages = limitedImages.slice(1);

    return {
      validImages: limitedImages,
      validations,
      rejectedCount,
      mainImage,
      galleryImages,
      hasValidImages: validImages.length > 0,
    };
  }, [images, fallbackImage, maxImages, debug]);

  return result;
}

export function filterValidProductImages(
  images: string[] | null | undefined,
  options: { maxImages?: number; debug?: boolean } = {}
): string[] {
  if (!images || images.length === 0) return [];

  const { maxImages, debug } = options;
  const validImages: string[] = [];

  for (const imageUrl of images) {
    if (!isImageBlacklisted(imageUrl)) {
      validImages.push(imageUrl);
    } else if (debug) {
      console.warn(`[filterValidProductImages] Rejetée: ${imageUrl}`);
    }
  }

  return maxImages ? validImages.slice(0, maxImages) : validImages;
}

export default useValidatedImages;





