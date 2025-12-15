'use client';

import Image from 'next/image';
import { Cart, CartItem } from '@/lib/types';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';

interface CartSummaryProps {
  cart: Cart;
}

// Component pour un item (évite hook dans callback)
function CartItemDisplay({ item }: { item: CartItem }) {
  const allProductImages = [
    item.product.image_url,
    item.product.image,
    ...(item.product.images || []),
  ].filter(Boolean) as string[];
  
  const { mainImage } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });

  return (
    <div className="flex gap-4">
      <div className="relative w-20 h-20 flex-shrink-0 rounded overflow-hidden bg-cream-light">
        <Image
          src={mainImage || '/placeholder-image.svg'}
          alt={item.product.title || item.product.name || 'Product'}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-sm font-semibold text-emerald mb-1 truncate">
          {item.product.title || item.product.name}
        </h3>
        <p className="font-body text-xs text-anthracite/60 mb-1">
          Quantité: {item.quantity}
        </p>
        <p className="font-body text-sm font-medium text-emerald">
          {(item.product.price * item.quantity).toFixed(2)} €
        </p>
      </div>
    </div>
  );
}

export default function CartSummary({ cart }: CartSummaryProps) {
  // Calcul des totaux
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shippingFee = 8;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-[#F0EBE5] rounded-lg border border-emerald/10 p-6 lg:sticky lg:top-4">
      <h2 className="font-display text-2xl font-medium text-emerald mb-6">
        Récapitulatif
      </h2>

      {/* Liste des articles */}
      <div className="space-y-4 mb-6">
        {cart.items.map((item) => (
          <CartItemDisplay key={item.id} item={item} />
        ))}
      </div>

      {/* Séparateur */}
      <div className="border-t border-emerald/10 my-6"></div>

      {/* Totaux */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between font-body text-sm text-anthracite/70">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-body text-sm text-anthracite/70">
          <span>Frais de livraison</span>
          <span>{shippingFee.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between font-display text-lg font-medium text-emerald pt-3 border-t border-emerald/10">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>

      {/* CTA Final */}
      <button className="w-full bg-gold text-emerald font-body font-semibold py-4 px-6 rounded transition-all hover:bg-gold-mat hover:scale-[1.02] focus:ring-2 focus:ring-gold focus:outline-none">
        Confirmer la commande
      </button>

      {/* Mention de confiance */}
      <div className="mt-4 pt-4 border-t border-emerald/10">
        <p className="font-body text-xs text-anthracite/60 text-center italic">
          Expédié depuis la France
        </p>
      </div>
    </div>
  );
}



