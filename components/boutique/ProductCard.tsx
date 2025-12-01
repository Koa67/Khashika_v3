'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getValidImageUrl } from '@/lib/utils/images';
import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  if (!product) return null;

  // Get valid image URL
  const imageUrl = getValidImageUrl(product.image_url || product.image);
  
  // Calculate sale percentage if on sale
  const salePercentage = product.isOnSale && product.price 
    ? Math.round((1 - (product.price / (product.price * 1.2))) * 100) // Assuming 20% base markup
    : null;

  // Format price
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const displayPrice = price > 0 ? `${price.toFixed(2)} €` : 'Prix sur demande';

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group block w-full h-full"
    >
      {/* Card container */}
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        {/* Image zone with hover effect */}
        <div className="relative aspect-[3/4] w-full bg-[#f4f1eb] overflow-hidden">
          {/* Badges */}
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-[#2596be] text-white px-3 py-1 rounded-full text-xs font-medium z-10">
              NOUVEAU
            </div>
          )}
          {product.isOnSale && salePercentage && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
              -{salePercentage}%
            </div>
          )}
          
          {/* Image with Framer Motion hover zoom */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full p-4"
          >
            <Image
              src={imageUrl}
              alt={product.name || 'Bijou Khashika'}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
          </motion.div>
        </div>
        
        {/* Info section */}
        <div className="p-4 bg-white flex-1 flex flex-col">
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

