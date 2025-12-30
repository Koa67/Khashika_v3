'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';
import { useWishlist } from '@/lib/context/WishlistContext';
import ProductZoom from '@/components/product/ProductZoom';

interface ProductMediaGalleryProps {
  product: Product;
}

const getValidImageUrl = (path: string | null | undefined): string => {
  if (!path || path === 'Image Manquante' || path.trim() === '') {
    return '/placeholder-image.svg';
  }
  if (path.includes('_raw_assets')) {
    const filename = path.split('/').pop()?.replace(/%20/g, '_');
    return filename ? `/images/products/${filename}` : '/placeholder-image.svg';
  }
  if (path.startsWith('http')) return path;
  return path.startsWith('/') ? path : `/images/products/${path}`;
};

export default function ProductMediaGallery({ product }: ProductMediaGalleryProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Collect all possible image sources and deduplicate
  const allProductImages = [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];
  
  // Deduplicate by normalized URL
  const uniqueImages = [...new Set(allProductImages.map(img => getValidImageUrl(img)))];
  
  // Use validated images hook to filter out blacklisted images
  const { validImages: validatedImages } = useValidatedImages(uniqueImages, {
    fallbackImage: '/placeholder-image.svg',
  });
  
  // Fallback to placeholder if no valid images
  const images = validatedImages.length > 0 
    ? validatedImages 
    : ['/placeholder-image.svg'];
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  // Images already normalized, no need to re-process
  const validImages = images;
  
  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
  };

  const handleLightboxNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleLightboxClose();
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : validImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < validImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, validImages.length]);

  return (
    <div>
      {/* Desktop: Stack vertical d'images avec zoom lens */}
      <div className="hidden lg:block space-y-6">
        {validImages.map((imageUrl, index) => (
          <div key={index} className="relative">
            <ProductZoom
              imageUrl={imageUrl}
              alt={`${product.title || product.name} - Image ${index + 1}`}
              priority={index === 0}
              allImages={validImages}
              currentIndex={index}
            />
            {/* Bouton Wishlist - uniquement sur la première image */}
            {index === 0 && (
              <button
                onClick={handleWishlistClick}
                className={`absolute top-3 right-3 z-20 flex items-center justify-center transition-all duration-200 ${
                  isAnimating ? 'active:scale-125' : 'scale-100'
                } hover:scale-110`}
                aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              >
                <Heart
                  size={24}
                  strokeWidth={1.5}
                  className={`transition-colors duration-200 ${
                    isWishlisted
                      ? 'fill-[#E0115F] text-[#E0115F] drop-shadow-sm'
                      : 'text-white fill-none hover:text-[#E0115F] drop-shadow-md'
                  }`}
                />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Slider horizontal avec snap */}
      <div className="lg:hidden">
        <div className="flex snap-x snap-mandatory overflow-x-auto gap-4 -mx-4 px-4 pb-4">
          {validImages.map((imageUrl, index) => (
            <div
              key={index}
              className="relative w-full flex-shrink-0 snap-center aspect-square overflow-hidden rounded-none bg-cream-light cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <Image
                src={imageUrl}
                alt={`${product.title || product.name} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
              {/* Bouton Wishlist - uniquement sur la première image */}
              {index === 0 && (
                <button
                  onClick={handleWishlistClick}
                  className={`absolute top-3 right-3 z-20 flex items-center justify-center transition-all duration-200 ${
                    isAnimating ? 'active:scale-125' : 'scale-100'
                  } hover:scale-110`}
                  aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <Heart
                    size={24}
                    strokeWidth={1.5}
                    className={`transition-colors duration-200 ${
                      isWishlisted
                        ? 'fill-[#E0115F] text-[#E0115F] drop-shadow-sm'
                        : 'text-white fill-none hover:text-[#E0115F] drop-shadow-md'
                    }`}
                  />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Dots indicateurs */}
        {validImages.length > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === selectedIndex ? 'bg-emerald w-6' : 'bg-emerald/30'
                }`}
                aria-label={`Aller à l'image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox for mobile */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center lg:hidden"
          onClick={handleLightboxClose}
        >
          {/* Close button */}
          <button
            onClick={handleLightboxClose}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            aria-label="Fermer"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous button */}
          {validImages.length > 1 && (
            <button
              onClick={handleLightboxPrev}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Image précédente"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Next button */}
          {validImages.length > 1 && (
            <button
              onClick={handleLightboxNext}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
              aria-label="Image suivante"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <Image
              src={validImages[lightboxIndex]}
              alt={`${product.title || product.name} - Image ${lightboxIndex + 1}`}
              width={1200}
              height={1200}
              className="max-w-full max-h-[90vh] object-contain"
              priority
            />
          </div>

          {/* Image counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {lightboxIndex + 1} / {validImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
