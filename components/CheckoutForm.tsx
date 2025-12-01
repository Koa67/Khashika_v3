'use client';

import { useState } from 'react';

export default function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState('card');

  return (
    <div className="space-y-10">
      {/* Bloc 1 - Informations de Contact */}
      <section className="border-b border-emerald/10 pb-8">
        <h2 className="font-display text-2xl font-medium text-emerald mb-6">
          Informations de Contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="email"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="phone"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Téléphone *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
        </div>
      </section>

      {/* Bloc 2 - Adresse de Livraison */}
      <section className="border-b border-emerald/10 pb-8">
        <h2 className="font-display text-2xl font-medium text-emerald mb-6">
          Adresse de Livraison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Adresse *
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
          <div>
            <label
              htmlFor="city"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Ville *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
          <div>
            <label
              htmlFor="postalCode"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Code Postal *
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="country"
              className="block font-body text-sm font-medium text-emerald mb-2"
            >
              Pays *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              required
              className="w-full px-4 py-3 border border-emerald/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald focus:border-emerald transition-colors bg-cream-light font-body"
            />
          </div>
        </div>
      </section>

      {/* Bloc 3 - Paiement */}
      <section>
        <h2 className="font-display text-2xl font-medium text-emerald mb-6">
          Paiement
        </h2>
        <div className="space-y-4">
          {/* Option Carte Bancaire */}
          <label className="flex items-center p-4 border border-emerald/20 rounded-lg cursor-pointer hover:border-emerald transition-colors bg-cream-light">
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === 'card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3 w-4 h-4 text-emerald focus:ring-emerald accent-emerald"
            />
            <span className="font-body text-emerald">Carte bancaire</span>
          </label>

          {/* Option PayPal */}
          <label className="flex items-center p-4 border border-emerald/20 rounded-lg cursor-pointer hover:border-emerald transition-colors bg-cream-light">
            <input
              type="radio"
              name="paymentMethod"
              value="paypal"
              checked={paymentMethod === 'paypal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3 w-4 h-4 text-emerald focus:ring-emerald accent-emerald"
            />
            <span className="font-body text-emerald">PayPal</span>
          </label>

          {/* Option Paiement à la livraison */}
          <label className="flex items-center p-4 border border-emerald/20 rounded-lg cursor-pointer hover:border-emerald transition-colors bg-cream-light">
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === 'cash'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-3 w-4 h-4 text-emerald focus:ring-emerald accent-emerald"
            />
            <span className="font-body text-emerald">Paiement à la livraison</span>
          </label>
        </div>

        {/* Icônes de paiement et mention de confiance */}
        <div className="mt-6 pt-6 border-t border-emerald/10">
          <div className="flex items-center gap-4 mb-3">
            <span className="font-body text-xs text-anthracite/60">Modes de paiement acceptés :</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <span className="text-2xl">🔒</span>
              <span className="text-2xl">📱</span>
            </div>
          </div>
          <p className="font-body text-xs text-anthracite/60 italic">
            Expédié depuis la France
          </p>
        </div>
      </section>
    </div>
  );
}



