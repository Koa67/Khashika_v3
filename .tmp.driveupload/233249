'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCart } from '@/lib/context/CartContext';
import { checkoutSchema, CheckoutFormData } from '@/lib/validators/checkout';
import { getValidImageUrl } from '@/lib/utils/images';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'France',
      cardNumber: '',
    },
  });

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 100 ? 0 : 5.9;
  const finalTotal = subtotal + shipping;

  const onSubmit = async () => {
    setIsSubmitting(true);
    // Simulation API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    router.push('/checkout/success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-foreground mb-4">
            Votre panier est vide
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-12 text-center">
          Paiement
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8">
          {/* Formulaire */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-card p-6 rounded-lg border border-foreground/10">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                Informations de livraison
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    {...register('firstName')}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                      errors.firstName
                        ? 'border-red-500'
                        : 'border-foreground/20 focus:border-primary'
                    } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    {...register('lastName')}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                      errors.lastName
                        ? 'border-red-500'
                        : 'border-foreground/20 focus:border-primary'
                    } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                    errors.email
                      ? 'border-red-500'
                      : 'border-foreground/20 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  {...register('address')}
                  className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                    errors.address
                      ? 'border-red-500'
                      : 'border-foreground/20 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    {...register('city')}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                      errors.city
                        ? 'border-red-500'
                        : 'border-foreground/20 focus:border-primary'
                    } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    {...register('zipCode')}
                    className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                      errors.zipCode
                        ? 'border-red-500'
                        : 'border-foreground/20 focus:border-primary'
                    } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                  />
                  {errors.zipCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">
                    Pays
                  </label>
                  <input
                    type="text"
                    {...register('country')}
                    className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-foreground/10">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                Informations de paiement
              </h2>

              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">
                  Numéro de carte *
                </label>
                <input
                  type="text"
                  {...register('cardNumber', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '');
                    },
                  })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={16}
                  className={`w-full px-4 py-3 border rounded-lg bg-background text-foreground ${
                    errors.cardNumber
                      ? 'border-red-500'
                      : 'border-foreground/20 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary/20`}
                />
                {errors.cardNumber && (
                  <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 bg-primary text-white rounded-lg font-serif text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Traitement en cours...' : 'Valider le paiement'}
            </button>
          </form>

          {/* Récapitulatif */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card p-6 rounded-lg border border-foreground/10">
              <h2 className="font-serif text-2xl text-foreground mb-6">
                Récapitulatif
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <img
                      src={getValidImageUrl(item.product.image_url || item.product.image)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.svg';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.product.name}</p>
                      <p className="text-sm text-foreground/70">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-foreground/80">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-foreground/10 pt-4 space-y-2">
                <div className="flex justify-between text-foreground/70">
                  <span>Sous-total</span>
                  <span>{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>Livraison</span>
                  <span>{shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} €`}</span>
                </div>
                <div className="flex justify-between font-serif text-xl text-foreground pt-2 border-t border-foreground/10">
                  <span>Total</span>
                  <span>{finalTotal.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
