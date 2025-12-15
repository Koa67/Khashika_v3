'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';

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
  // Collect all possible image sources
  const allProductImages = [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];
  
  // Use validated images hook to filter out blacklisted images
  const { validImages: validatedImages } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });
  
  // Fallback to placeholder if no valid images
  const images = validatedImages.length > 0 
    ? validatedImages 
    : ['/placeholder-image.svg'];
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const validImages = images.map(getValidImageUrl);

  return (
    <div>
      {/* Desktop: Stack vertical d'images grandes */}
      <div className="hidden lg:block space-y-6">
        {validImages.map((imageUrl, index) => (
          <div key={index} className="relative w-full aspect-[4/5] overflow-hidden rounded-sm bg-[#f4f1eb]">
            <Image
              src={imageUrl}
              alt={`${product.title || product.name} - Image ${index + 1}`}
              fill
              className="object-cover w-full h-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Mobile: Slider horizontal avec snap */}
      <div className="lg:hidden">
        <div className="flex snap-x snap-mandatory overflow-x-auto gap-4 -mx-4 px-4 pb-4">
          {validImages.map((imageUrl, index) => (
            <div
              key={index}
              className="relative w-full flex-shrink-0 snap-center aspect-square overflow-hidden rounded-lg bg-cream-light"
            >
              <Image
                src={imageUrl}
                alt={`${product.title || product.name} - Image ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={index === 0}
              />
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
    </div>
  );
}
