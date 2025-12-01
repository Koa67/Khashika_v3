'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import TrustBadges from './TrustBadges';
import { useCart } from '@/lib/context/CartContext';

interface ProductConversionModuleProps {
  product: Product;
}

export default function ProductConversionModule({
  product,
}: ProductConversionModuleProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    if (process.env.NODE_ENV === 'development') {
      console.log('Ajouter au panier:', { productId: product.id, quantity });
    }
  };

  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const displayPrice = price > 0 ? `${price.toFixed(2)} €` : 'Prix sur demande';

  return (
    <>
      <div className="space-y-6 hidden md:block">
        {/* Titre du produit */}
        <h1 className="font-serif text-3xl font-bold text-[#1a1a1a]">
          {product.title || product.name}
        </h1>

        {/* Prix */}
        <div className="flex items-center gap-4">
          <span className="font-serif text-4xl font-bold text-[#D4AF37]">
            {displayPrice}
          </span>
          {product.isOnSale && (
            <span className="font-sans text-lg text-gray-500 line-through">
              {(price * 1.3).toFixed(2)} €
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#2596be] text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide font-sans">
              Nouveau
            </span>
          )}
        </div>

        {/* Sélecteur de quantité */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="quantity"
            className="font-sans text-sm font-medium text-[#1a1a1a]"
          >
            Quantité :
          </label>
          <div className="flex items-center border border-[#2596be]/30 rounded">
            <button
              type="button"
              onClick={handleDecrease}
              className="px-3 py-2 font-sans text-[#1a1a1a] hover:bg-[#2596be]/10 transition-colors"
              aria-label="Diminuer la quantité"
            >
              −
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, value));
              }}
              className="w-16 px-2 py-2 text-center font-sans text-[#1a1a1a] border-x border-[#2596be]/30 focus:outline-none focus:ring-2 focus:ring-[#2596be]"
            />
            <button
              type="button"
              onClick={handleIncrease}
              className="px-3 py-2 font-sans text-[#1a1a1a] hover:bg-[#2596be]/10 transition-colors"
              aria-label="Augmenter la quantité"
            >
              +
            </button>
          </div>
        </div>

        {/* Options de personnalisation (placeholder) */}
        {product.characteristics && (
          <div className="space-y-4">
            {product.characteristics.size && (
              <div>
                <label className="block font-sans text-sm font-medium text-[#1a1a1a] mb-2">
                  Taille :
                </label>
                <select className="w-full px-4 py-2 border border-[#2596be]/30 rounded focus:outline-none focus:ring-2 focus:ring-[#2596be] font-sans">
                  {product.characteristics.size.split('/').map((size) => (
                    <option key={size} value={size.trim()}>
                      {size.trim()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* CTA Principal - Desktop */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-[#D4AF37] text-white font-sans font-semibold py-4 px-6 rounded transition-colors hover:bg-[#D4AF37]/90"
        >
          Ajouter au panier
        </button>

        {/* Trust Badges */}
        <TrustBadges />
      </div>

      {/* BARRE FIXE MOBILE - Thumb Zone */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-[#D4AF37]/30 shadow-lg block md:hidden">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Prix à gauche */}
          <div className="flex-1">
            <p className="font-serif text-lg font-semibold text-[#1a1a1a]">
              {displayPrice}
            </p>
            <p className="font-sans text-xs text-[#1a1a1a]/60 line-clamp-1">
              {product.name}
            </p>
          </div>
          {/* Bouton Ajouter à droite */}
          <button
            onClick={handleAddToCart}
            className="flex-shrink-0 bg-[#D4AF37] text-white font-sans font-semibold py-3 px-6 rounded transition-all hover:bg-[#D4AF37]/90 active:scale-95"
          >
            Ajouter
          </button>
        </div>
      </div>
    </>
  );
}

