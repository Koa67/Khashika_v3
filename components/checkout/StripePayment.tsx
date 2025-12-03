'use client';

import { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCheckout } from '@/lib/hooks/useCheckout';

// Clé publique Stripe (peut être undefined en dev)
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  : null;

interface StripePaymentProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

/**
 * Formulaire de paiement Stripe
 * Mode hybride : Si la clé API est manquante, affiche un mode "Simulation"
 */
function CheckoutForm({ onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { total } = useCheckout();
  const isSimulationMode = !process.env.NEXT_PUBLIC_STRIPE_KEY;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSimulationMode) {
      // Mode simulation : simuler un paiement réussi
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsProcessing(false);
      onSuccess();
      return;
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Élément de carte introuvable');
      }

      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        onError(error.message || 'Erreur de paiement');
        setIsProcessing(false);
        return;
      }

      // Ici, vous enverriez le paymentMethod.id à votre backend
      // Pour l'instant, on simule le succès
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#1a1a1a',
        fontFamily: 'Montserrat, sans-serif',
        '::placeholder': {
          color: '#a0a0a0',
        },
      },
      invalid: {
        color: '#ef4444',
      },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isSimulationMode && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Mode Simulation :</strong> La clé API Stripe n&apos;est pas configurée.
            Le bouton ci-dessous simule un paiement réussi.
          </p>
        </div>
      )}

      {!isSimulationMode && (
        <div className="border border-gray-300 rounded-lg p-4 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      )}

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-[#2596be] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#1e7a9a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing
          ? 'Traitement...'
          : isSimulationMode
          ? 'Simuler Paiement Réussi'
          : `Payer ${total.toFixed(2)} €`}
      </button>
    </form>
  );
}

export default function StripePayment({ onSuccess, onError }: StripePaymentProps) {
  const { total } = useCheckout();
  const isSimulationMode = !process.env.NEXT_PUBLIC_STRIPE_KEY;

  // Options Stripe Elements
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.round(total * 100), // Convertir en centimes
    currency: 'eur',
  };

  // Si pas de clé Stripe, afficher directement le formulaire de simulation
  if (isSimulationMode) {
    return (
      <div className="w-full">
        <CheckoutForm onSuccess={onSuccess} onError={onError} />
      </div>
    );
  }

  // Si Stripe est configuré, utiliser Elements
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}

