'use client';

import { useMemo } from 'react';
import { useCart } from '@/lib/context/CartContext';

/**
 * Cerveau financier (Hook)
 * Gère : Sous-total, Shipping (Gratuit > 200€), Total
 * 
 * SÉCURITÉ : Recalcule toujours les totaux côté hook,
 * ne jamais faire confiance au client
 */
export function useCheckout() {
  const { items } = useCart();

  const calculations = useMemo(() => {
    // Recalculer le sous-total depuis les items (sécurité)
    const subtotal = items.reduce((sum, item) => {
      const itemPrice = typeof item.product.price === 'number' 
        ? item.product.price 
        : parseFloat(String(item.product.price || 0));
      return sum + itemPrice * item.quantity;
    }, 0);

    // Shipping : Gratuit si sous-total > 200€, sinon 10€
    const shippingThreshold = 200;
    const shippingCost = subtotal >= shippingThreshold ? 0 : 10;

    // Total final
    const total = subtotal + shippingCost;

    return {
      subtotal: Math.round(subtotal * 100) / 100, // Arrondir à 2 décimales
      shipping: shippingCost,
      total: Math.round(total * 100) / 100,
      isShippingFree: subtotal >= shippingThreshold,
    };
  }, [items]);

  return calculations;
}

