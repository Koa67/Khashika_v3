'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

// Clé publique Stripe (doit être dans .env.local)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface StripePaymentProps {
  amount: number; // Montant en euros
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
          return_url: `${window.location.origin}/fr/checkout/success`,
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
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-[#8B4E4E] text-white py-3 px-6 rounded-none font-medium hover:bg-[#6B3D3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? 'Traitement...' : `Payer ${amount.toFixed(2)} €`}
      </button>
    </form>
  );
}

/**
 * Composant principal StripePayment
 * Fetch le clientSecret depuis l'API puis affiche PaymentElement
 */
export default function StripePayment({ amount, onSuccess, onError }: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier si la clé Stripe est disponible
  const hasStripeKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  useEffect(() => {
    // Si pas de clé Stripe, on est en mode simulation
    if (!hasStripeKey) {
      setLoading(false);
      return;
    }

    // Fetch le clientSecret depuis l'API
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(amount * 100), // Convertir en centimes
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Erreur lors de la création du paiement');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(errorMessage);
        console.error('[STRIPE_PAYMENT]:', err);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  }, [amount, hasStripeKey]);

  // Mode Simulation (si clé API manquante)
  if (!hasStripeKey) {
    return (
      <div className="border-2 border-dashed border-[#EAB615] rounded-none p-6 bg-[#f4f1eb]">
        <div className="text-center mb-4">
          <h3 className="font-serif text-xl text-[#2D2926] mb-2">
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
          className="w-full bg-[#8B4E4E] text-white py-3 px-6 rounded-none font-medium hover:bg-[#6B3D3D] transition-colors"
        >
          Simuler Paiement ({amount.toFixed(2)} €)
        </button>
        <p className="text-xs text-gray-500 mt-2 text-center">
          En production, configurez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans .env.local
        </p>
      </div>
    );
  }

  // État de chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-[#8B4E4E]" />
        <span className="ml-2 text-[#2D2926]">Chargement du paiement...</span>
      </div>
    );
  }

  // Erreur
  if (error) {
    return (
      <div className="border border-red-300 bg-red-50 rounded-none p-4">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-[#8B4E4E] underline hover:no-underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Pas de clientSecret (ne devrait pas arriver)
  if (!clientSecret) {
    return (
      <div className="border border-yellow-300 bg-yellow-50 rounded-none p-4">
        <p className="text-yellow-700 text-sm">Impossible d&apos;initialiser le paiement. Veuillez réessayer.</p>
      </div>
    );
  }

  // Mode Production (Stripe réel)
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#8B4E4E',
            colorBackground: '#FFFFFF',
            colorText: '#2D2926',
            fontFamily: 'system-ui, sans-serif',
            borderRadius: '0px',
          },
        },
      }}
    >
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  );
}
