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
  const [isAdded, setIsAdded] = useState(false);

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
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
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
        <h1 className="font-serif text-3xl font-bold text-[#2D2926]">
          {product.title || product.name}
        </h1>

        {/* Prix */}
        <div className="flex items-center gap-4">
          <span className="font-serif text-4xl font-bold text-gold-fusion">
            {displayPrice}
          </span>
          {product.isOnSale && (
            <span className="font-sans text-lg text-gray-500 line-through">
              {(price * 1.3).toFixed(2)} €
            </span>
          )}
          {product.isNew && (
            <span className="bg-[#8B4E4E] text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide font-sans">
              Nouveau
            </span>
          )}
        </div>

        {/* Sélecteur de quantité */}
        <div className="flex items-center gap-4">
          <label
            htmlFor="quantity"
            className="font-sans text-sm font-medium text-[#2D2926]"
          >
            Quantité :
          </label>
          <div className="flex items-center border border-[#8B4E4E]/30 rounded-none">
            <button
              type="button"
              onClick={handleDecrease}
              className="px-3 py-2 font-sans text-[#2D2926] hover:bg-[#8B4E4E]/10 transition-colors"
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
              className="w-16 px-2 py-2 text-center font-sans text-[#2D2926] border-x border-[#8B4E4E]/30 focus:outline-none focus:ring-2 focus:ring-[#8B4E4E]"
            />
            <button
              type="button"
              onClick={handleIncrease}
              className="px-3 py-2 font-sans text-[#2D2926] hover:bg-[#8B4E4E]/10 transition-colors"
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
                <label className="block font-sans text-sm font-medium text-[#2D2926] mb-2">
                  Taille :
                </label>
                <select className="w-full px-4 py-2 border border-[#8B4E4E]/30 rounded-none focus:outline-none focus:ring-2 focus:ring-[#8B4E4E] font-sans">
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
          disabled={isAdded}
          className={`w-full py-4 px-6 rounded-none font-sans font-semibold transition-all ${
            isAdded 
              ? 'bg-green-600 text-white' 
              : 'bg-[#EAB615] text-white hover:bg-[#EAB615]/90'
          }`}
        >
          {isAdded ? '✓ Ajouté au panier' : 'Ajouter au panier'}
        </button>

        {/* Trust Badges */}
        <TrustBadges />
      </div>

      {/* BARRE FIXE MOBILE - Thumb Zone */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-[#EAB615]/30 shadow-lg block md:hidden">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Prix à gauche */}
          <div className="flex-1">
            <p className="font-serif text-lg font-semibold text-[#2D2926]">
              {displayPrice}
            </p>
            <p className="font-sans text-xs text-[#2D2926]/60 line-clamp-1">
              {product.name}
            </p>
          </div>
          {/* Bouton Ajouter à droite */}
          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex-shrink-0 text-white font-sans font-semibold py-3 px-6 rounded-none transition-all active:scale-95 ${
              isAdded 
                ? 'bg-green-600' 
                : 'bg-[#EAB615] hover:bg-[#EAB615]/90'
            }`}
          >
            {isAdded ? '✓ Ajouté' : 'Ajouter'}
          </button>
        </div>
      </div>
    </>
  );
}

