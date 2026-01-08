import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialiser Stripe avec la clé secrète
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-12-15.clover',
});

export async function POST(request: NextRequest) {
  try {
    // Vérifier que la clé Stripe est configurée
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe n\'est pas configuré. Ajoutez STRIPE_SECRET_KEY dans .env.local' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount } = body;

    // Valider le montant
    if (!amount || typeof amount !== 'number' || amount < 50) {
      return NextResponse.json(
        { error: 'Montant invalide. Minimum 50 centimes (0.50€)' },
        { status: 400 }
      );
    }

    // Créer le PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Montant en centimes
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        integration: 'khashika-checkout',
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('[CREATE_PAYMENT_INTENT]:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}
