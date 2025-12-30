'use client';

import { useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

/**
 * Composant interne pour la page de succès
 */
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const { items, clearCart } = useCart();
  const hasClearedCartRef = useRef(false);

  // Lancer les confettis au chargement
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() < end) {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#8B4E4E', '#E8B71B', '#FF6B6B'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#8B4E4E', '#E8B71B', '#FF6B6B'],
        });
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Get order number from URL
  const orderNumber = searchParams.get('order');

  // Vider le panier une seule fois après confirmation
  useEffect(() => {
    if (hasClearedCartRef.current) return;

    const paymentIntentId = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');

    // Si on a une confirmation de paiement Stripe ou un numéro de commande
    if (paymentIntentId || paymentIntentClientSecret || orderNumber) {
      clearCart();
      hasClearedCartRef.current = true;
    } else if (items.length > 0) {
      // Mode simulation : vider après un délai
      const timer = setTimeout(() => {
        clearCart();
        hasClearedCartRef.current = true;
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, clearCart, items.length, orderNumber]);

  // Calculer le total de la commande (avant vidage)
  const orderTotal = items.reduce((sum, item) => {
    const price = typeof item.product.price === 'number' 
      ? item.product.price 
      : parseFloat(String(item.product.price || 0));
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Succès Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-none mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="font-serif text-4xl text-[#2D2420] mb-4">
            Commande confirmée !
          </h1>
          {orderNumber && (
            <p className="text-lg text-[#8B4E4E] font-semibold mb-2">
              Numéro de commande: {orderNumber}
            </p>
          )}
          <p className="text-lg text-[#2D2420]/70">
            Merci pour votre achat. Votre commande a été traitée avec succès.
          </p>
        </div>

        {/* Récapitulatif */}
          <div className="bg-[#FAF9F7] border border-[#E8B71B]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.25)] p-8 mb-8">
          <h2 className="font-serif text-2xl text-[#2D2420] mb-6 flex items-center gap-2">
            <Package className="w-6 h-6 text-[#8B4E4E]" />
            Récapitulatif de votre commande
          </h2>

          {items.length > 0 ? (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const price = typeof item.product.price === 'number' 
                    ? item.product.price 
                    : parseFloat(String(item.product.price || 0));
                  return (
                    <div key={item.id} className="flex justify-between items-center py-3 border-b border-[#E8B71B]/40">
                      <div className="flex-1">
                        <p className="font-medium text-[#2D2420]">{item.product.name}</p>
                        <p className="text-sm text-[#2D2420]/60">Quantité : {item.quantity}</p>
                      </div>
                      <p className="text-gold-fusion font-semibold">
                        {(price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#E8B71B]/40 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span className="text-[#2D2420]">Total</span>
                  <span className="text-gold-fusion">{orderTotal.toFixed(2)} €</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-[#2D2420]/70">
              Votre commande a été enregistrée. Vous recevrez un email de confirmation sous peu.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#8B4E4E] text-white px-6 py-3 rounded-none font-medium hover:bg-[#6B3D3D] transition-colors font-serif"
          >
            <ShoppingBag className="w-5 h-5" />
            Continuer mes achats
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#2D2420] px-6 py-3 rounded-none font-medium border-2 border-[#E8B71B]/30 hover:border-[#E8B71B] transition-colors"
          >
            <Home className="w-5 h-5" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Page de succès après paiement
 * - Confettis
 * - Récapitulatif commande
 * - Vider le panier uniquement après succès confirmé
 */
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-xl text-[#2D2420]">Chargement...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
