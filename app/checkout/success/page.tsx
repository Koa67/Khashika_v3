'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useCart } from '@/lib/context/CartContext';
import { CheckCircle, Package, Home } from 'lucide-react';

export default function CheckoutSuccessPage() {
  const { items, clearCart } = useCart();

  useEffect(() => {
    // Lancer les confettis
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Vider le panier uniquement après succès confirmé
    clearCart();

    return () => clearInterval(interval);
  }, [clearCart]);

  // Si pas d'items, rediriger vers la boutique
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-foreground mb-4">
            Aucune commande en cours
          </p>
          <Link
            href="/shop"
            className="text-[#2596be] hover:underline"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  // Calculer le total (récapitulatif)
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 200 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header avec icône de succès */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl text-[#1a1a1a] mb-4">
            Commande Confirmée !
          </h1>
          <p className="text-gray-600 text-lg">
            Merci pour votre achat. Votre commande a été enregistrée avec succès.
          </p>
        </div>

        {/* Récapitulatif de la commande */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="font-serif text-2xl text-[#1a1a1a] mb-6 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Récapitulatif de la commande
          </h2>

          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-[#1a1a1a]">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                </div>
                <p className="text-[#D4AF37] font-semibold">
                  {(item.product.price * item.quantity).toFixed(2)} €
                </p>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{subtotal.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Livraison</span>
              <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
            </div>
            <div className="flex justify-between text-[#1a1a1a] font-bold text-xl pt-2">
              <span>Total</span>
              <span className="text-[#D4AF37]">{total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#2596be] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1e7a9a] transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à la boutique
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white border-2 border-[#2596be] text-[#2596be] px-8 py-3 rounded-lg font-medium hover:bg-[#f0f9fb] transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

