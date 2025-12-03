'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { getValidImageUrl } from '@/lib/utils/images';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isQuickAddVisible, setIsQuickAddVisible] = useState(false);
  const { addItem } = useCart();

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

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group block w-full h-full"
      onMouseEnter={() => setIsQuickAddVisible(true)}
      onMouseLeave={() => setIsQuickAddVisible(false)}
    >
      {/* Card container */}
      <div className="h-full flex flex-col bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative">
        {/* Image zone with hover effect */}
        <div className="relative aspect-[3/4] w-full bg-[#f4f1eb] overflow-hidden">
          {/* Skeleton Loader pendant le chargement */}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

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
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative w-full h-full p-4"
          >
            <Image
              src={imageUrl}
              alt={product.name || 'Bijou Khashika'}
              fill
              className="object-contain transition-opacity duration-300"
              style={{ opacity: isImageLoading ? 0 : 1 }}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading={priority ? "eager" : "lazy"}
              priority={priority}
              onLoad={() => setIsImageLoading(false)}
            />
          </motion.div>

          {/* Quick Add Button (Slide Up) */}
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: isQuickAddVisible ? 0 : 100,
              opacity: isQuickAddVisible ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20"
            onClick={handleQuickAdd}
          >
            <button
              className="bg-[#2596be] text-white px-6 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg hover:bg-[#1e7a9a] transition-colors"
              aria-label="Ajouter au panier"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Ajouter</span>
            </button>
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

