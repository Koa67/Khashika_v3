'use client';

import { useMemo } from 'react';
import { useCart } from '@/lib/context/CartContext';

/**
 * Cerveau financier (Hook)
 * Gère : Sous-total, Shipping (Gratuit > 200€), Total
 * 
 * SÉCURITÉ : Recalculer toujours les totaux côté client/hook,
 * ne jamais faire confiance aux données stockées
 */
export function useCheckout() {
  const { items } = useCart();

  const calculations = useMemo(() => {
    // Calcul du sous-total (toujours recalculer)
    const subtotal = items.reduce((sum, item) => {
      const price = typeof item.product.price === 'number' 
        ? item.product.price 
        : parseFloat(String(item.product.price || 0));
      return sum + price * item.quantity;
    }, 0);

    // Seuil pour livraison gratuite : 200€
    const FREE_SHIPPING_THRESHOLD = 200;
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 10;

    // Total final
    const total = subtotal + shippingCost;

    return {
      subtotal: Math.round(subtotal * 100) / 100, // Arrondir à 2 décimales
      shipping: shippingCost,
      total: Math.round(total * 100) / 100,
      isFreeShipping: subtotal >= FREE_SHIPPING_THRESHOLD,
      freeShippingRemaining: subtotal < FREE_SHIPPING_THRESHOLD 
        ? Math.round((FREE_SHIPPING_THRESHOLD - subtotal) * 100) / 100 
        : 0,
    };
  }, [items]);

  return calculations;
}
