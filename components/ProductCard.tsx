'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { getValidImageUrl } from '@/lib/utils/images';
import { useWishlist } from '@/lib/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(() => {
    const rawUrl = product.image_url || product.images?.[0] || product.image;
    // getValidImageUrl now handles prod- pattern detection internally
    return getValidImageUrl(rawUrl);
  });
  // Track if we've already tried to load this image to prevent infinite loops
  const [hasErrored, setHasErrored] = useState(false);
  
  if (!product) return null;
  
  const isWishlisted = isInWishlist(product.id);
  
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const displayPrice = price > 0 ? `${price.toFixed(2)} €` : 'Prix sur demande';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Prevent infinite loops by checking if we've already errored
    if (hasErrored) return;
    
    const target = e.currentTarget;
    // Only handle error if not already placeholder
    if (target.src && !target.src.includes('placeholder-image.svg')) {
      setHasErrored(true);
      // Use requestAnimationFrame to prevent synchronous state updates during render
      // This prevents double free malloc errors
      requestAnimationFrame(() => {
        setImgSrc('/placeholder-image.svg');
        // Also set directly on the element to prevent browser retries
        if (target && target.src) {
          target.src = '/placeholder-image.svg';
        }
      });
      // Prevent default error handling
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-100 hover:border-[#D4AF37] hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)] transition-all duration-500 rounded-none overflow-hidden relative">
      {/* Zone Image - Full Bleed Carré */}
      <Link 
        href={`/product/${product.slug}`}
        className="relative w-full aspect-square bg-white overflow-hidden"
      >
        <img
          src={imgSrc}
          alt={product.name || 'Bijou Khashika'}
          className="w-full h-full object-cover object-center group-hover:scale-105 group-hover:brightness-105 transition-all duration-700 ease-out"
          onError={handleImageError}
        />
        
        {/* Bouton Cœur Wishlist */}
        <button
          onClick={handleWishlistClick}
          className={`absolute top-3 right-3 z-20 flex items-center justify-center transition-all duration-200 ${
            isAnimating ? 'active:scale-125' : 'scale-100'
          } hover:scale-110`}
          aria-label={isWishlisted ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <Heart
            size={20}
            strokeWidth={1.5}
            className={`transition-colors duration-200 ${
              isWishlisted
                ? 'fill-[#E0115F] text-[#E0115F] drop-shadow-sm'
                : 'text-white fill-none hover:text-[#E0115F] drop-shadow-md'
            }`}
          />
        </button>
      </Link>

      {/* Zone Infos - Compacte */}
      <div className="p-3 flex flex-col text-center bg-white">
        <h3 className="font-serif text-sm text-foreground line-clamp-2 capitalize tracking-wide mb-1">
          {product.name}
        </h3>
        <p className="text-[#D4AF37] font-bold text-sm tracking-wider">
          {displayPrice}
        </p>
      </div>
    </div>
  );
}
