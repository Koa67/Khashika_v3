'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { getValidImageUrl } from '@/lib/utils/images';
import { Product } from '@/lib/types';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';
import { useWishlist } from '@/lib/context/WishlistContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  // Use validated images hook to filter out blacklisted images (must be before early return)
  const allProductImages = product ? [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[] : [];
  
  const { mainImage } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });

  // Get valid image URL
  const imageUrl = getValidImageUrl(mainImage || '/placeholder-image.svg');

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  // Format price
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const displayPrice = price > 0 ? `${price.toFixed(2)} €` : 'Prix sur demande';

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setIsAnimating(false), 200);
  };

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group block w-full h-full"
    >
      {/* Card container */}
      <div className="golden-glow-card h-full flex flex-col bg-white overflow-hidden relative">
        {/* Image zone with hover effect */}
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          {/* Skeleton Loader pendant le chargement */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          {/* Image with Framer Motion hover zoom */}
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image
              src={imageUrl}
              alt={product.name || 'Bijou Khashika'}
              fill
              className="object-cover w-full h-full transition-opacity duration-300"
              style={{ opacity: isImageLoading ? 0 : 1 }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              onLoad={() => setIsImageLoading(false)}
            />
          </motion.div>
          
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
        </div>
        
        {/* Info section */}
        <div className="p-3 bg-white flex-1 flex flex-col">
          {/* Category */}
          {product.category && (
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {product.category}
            </p>
          )}
          
          {/* Product name */}
          <h3 className="font-serif text-base text-[#1a1a1a] line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          
          {/* Price in gold */}
          <p className="text-[#D4AF37] text-xl font-semibold mt-auto">
            {displayPrice}
          </p>
        </div>
      </div>
    </Link>
  );
}

