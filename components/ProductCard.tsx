'use client';

import { Link } from '@/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { Product } from '@/lib/types';
import { getValidImageUrl } from '@/lib/utils/images';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { isInWishlist: checkWishlist, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);
  // État local initialisé à false (même valeur que serveur)
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Use validated images hook to filter out blacklisted images (must be before early return)
  const allProductImages = product ? [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[] : [];
  
  const { mainImage } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });
  
  const imageUrl = getValidImageUrl(mainImage || '/placeholder-image.svg');
  
  // Synchroniser après montage (client-only)
  useEffect(() => {
    setMounted(true);
    setIsWishlisted(checkWishlist(product.id));
  }, [checkWishlist, product.id]);
  
  if (!product) return null;
  
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const displayPrice = price > 0 ? `${price.toFixed(2)} €` : 'Prix sur demande';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleWishlist(product);
    // Mettre à jour l'état local immédiatement
    setIsWishlisted(!isWishlisted);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <div className="golden-glow-card h-full flex flex-col bg-[#FAF9F7] overflow-hidden relative">
      {/* Zone Image - Full Bleed */}
      <Link 
        href={`/product/${product.slug}`}
        className="relative w-full aspect-[3/2] overflow-hidden bg-[#FAF9F7]"
      >
        <Image
          src={imageUrl}
          alt={product.name || 'Bijou Khashika'}
          fill
          className="object-cover w-full h-full transition-transform duration-700 hover:scale-105 hover:brightness-105"
          sizes="(max-width: 768px) 50vw, 33vw"
          priority={priority}
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
      <div className="p-3 flex flex-col text-center bg-[#FAF9F7]">
        <h3 className="font-serif text-sm text-foreground line-clamp-2 capitalize tracking-wide mb-1">
          {product.name}
        </h3>
        <p className="text-[#E8B71B] font-bold text-sm tracking-wider">
          {displayPrice}
        </p>
      </div>
    </div>
  );
}
