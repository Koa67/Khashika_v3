'use client';

/* eslint-disable @next/next/no-img-element */

import { useState, useRef } from 'react';
import { Product } from '@/lib/types';
import { getValidImageUrl } from '@/lib/utils/images';

interface ProductImageGalleryProps {
  product: Product;
  priority?: boolean;
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const images = product.images && product.images.length > 0 
    ? product.images 
    : product.image_url 
    ? [product.image_url] 
    : product.image 
    ? [product.image] 
    : ['/placeholder-image.svg'];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails Desktop (Vertical à gauche) */}
      <div className="hidden lg:flex flex-col gap-2 order-2 lg:order-1">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImageIndex === index
                ? 'border-[#D4AF37] scale-105'
                : 'border-transparent hover:border-foreground/20'
            }`}
            aria-label={`Voir l'image ${index + 1}`}
          >
            <img
              src={getValidImageUrl(img)}
              alt={`${product.name} - Vue ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.svg';
              }}
            />
          </button>
        ))}
      </div>

      {/* Image principale avec zoom */}
      <div
        ref={containerRef}
        className="relative flex-1 order-1 lg:order-2 overflow-hidden rounded-lg bg-background cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={getValidImageUrl(images[selectedImageIndex])}
          alt={product.name}
          className={`w-full h-auto transition-transform duration-300 ${
            isHovering ? 'scale-[2]' : 'scale-100'
          }`}
          style={{
            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          }}
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.svg';
          }}
        />
      </div>

      {/* Thumbnails Mobile (Horizontal en bas) */}
      <div className="flex lg:hidden gap-2 overflow-x-auto pb-2 order-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImageIndex === index
                ? 'border-[#D4AF37] scale-105'
                : 'border-transparent'
            }`}
            aria-label={`Voir l'image ${index + 1}`}
          >
            <img
              src={getValidImageUrl(img)}
              alt={`${product.name} - Vue ${index + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder-image.svg';
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

