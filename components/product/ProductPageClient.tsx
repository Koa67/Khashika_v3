'use client';

import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';

interface ProductPageClientProps {
  product: Product;
  type: 'wishlist-button' | 'cta-buttons';
}

export default function ProductPageClient({ product, type }: ProductPageClientProps) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdded, setIsAdded] = useState(false);
  const [quantity] = useState(1);

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  if (type === 'wishlist-button') {
    return (
      <button
        onClick={handleToggleWishlist}
        className="absolute top-3 right-3 z-20 flex items-center justify-center transition-all duration-200 scale-100 hover:scale-125"
        aria-label={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Heart className={`w-6 h-6 transition-all duration-200 ${
          isInWishlist(product.id)
            ? 'fill-[#E8B71B] text-gold-fusion'
            : 'text-[#2D2420] hover:text-gold-fusion'
        }`} />
      </button>
    );
  }

  if (type === 'cta-buttons') {
    return (
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#8B4E4E] text-white font-medium hover:bg-[#6B3D3D] transition-colors rounded-none"
        >
          <ShoppingBag className="w-5 h-5" />
          {isAdded ? '✓ Ajouté!' : 'Ajouter au panier'}
        </button>
        <button
          onClick={handleToggleWishlist}
          className={`px-4 py-3 border transition-colors rounded-none ${
            isInWishlist(product.id)
              ? 'border-[#E8B71B] text-gold-fusion bg-[#E8B71B]/10'
              : 'border-[#E8B71B]/40 text-[#2D2420] hover:border-[#E8B71B] hover:text-gold-fusion'
          }`}
          aria-label="Ajouter à la wishlist"
        >
          <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
        </button>
      </div>
    );
  }

  return null;
}

