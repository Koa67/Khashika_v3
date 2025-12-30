'use client';

import { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';

// Clé publique Stripe (doit être dans .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

/**
 * Composant de paiement Stripe interne
 */
function CheckoutForm({ amount, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(new Error(error.message || 'Erreur de paiement'));
        toast.error('Erreur de paiement', {
          description: error.message,
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess();
        toast.success('Paiement réussi !');
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      onError(error);
      toast.error('Une erreur est survenue');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#8B4E4E] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#6B3D3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Traitement...' : `Payer ${amount.toFixed(2)} €`}
      </button>
    </form>
  );
}

/**
 * Composant principal StripePayment
 * Mode hybride : Si la clé API est manquante, affiche un mode "Simulation"
 */
export default function StripePayment({ amount, onSuccess, onError }: StripePaymentProps) {
  // Vérifier si la clé Stripe est disponible (une seule fois au montage)
  const hasStripeKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const isSimulationMode = !hasStripeKey;

  // Mode Simulation (si clé API manquante)
  if (isSimulationMode) {
    return (
      <div className="border-2 border-dashed border-[#E8B71B] rounded-lg p-6 bg-[#f4f1eb]">
        <div className="text-center mb-4">
          <h3 className="font-serif text-xl text-[#2D2420] mb-2">
            Mode Simulation
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            La clé API Stripe n&apos;est pas configurée. Mode simulation activé pour le développement.
          </p>
        </div>
        <button
          onClick={() => {
            toast.success('Paiement simulé avec succès !');
            onSuccess();
          }}
          className="w-full bg-[#8B4E4E] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#6B3D3D] transition-colors"
        >
          Simuler Paiement Réussi
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          En production, configurez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans .env.local
        </p>
      </div>
    );
  }

  // Mode Production (Stripe réel)
  const options: StripeElementsOptions = {
    mode: 'payment',
    amount: Math.round(amount * 100), // Convertir en centimes
    currency: 'eur',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#8B4E4E',
        colorBackground: '#FFFFFF',
        colorText: '#2D2420',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
