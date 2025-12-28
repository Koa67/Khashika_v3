'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/db/supabase';
import { getValidImageUrl } from '@/lib/utils/images';
import { z } from 'zod';

const checkoutSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phone: z.string().min(1, 'Téléphone requis'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  address: z.string().min(1, 'Adresse requise'),
  city: z.string().min(1, 'Ville requise'),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)').min(1, 'Code postal requis'),
  country: z.string().default('France').optional(),
  cardNumber: z.string().refine((val) => val.replace(/\s/g, '').length >= 16, {
    message: 'Numéro de carte invalide (minimum 16 chiffres)',
  }),
  cardExpiry: z.string().regex(/^\d{2}\/\d{2}$/, 'Format invalide (MM/YY)'),
  cardCVC: z.string().min(3, 'CVC invalide').max(4),
  saveCard: z.boolean().optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openSections, setOpenSections] = useState({
    information: true,
    delivery: false,
    summary: false,
    payment: false,
  });
  const [createAccount, setCreateAccount] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'France',
      cardNumber: '',
      cardExpiry: '',
      cardCVC: '',
      saveCard: false,
      createAccount: false,
      password: '',
    },
  });

  // Pre-fill email when user logs in
  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const subtotal = getTotal();
  const shipping = subtotal >= 100 ? 0 : 5.9;
  const finalTotal = subtotal + shipping;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Format expiry date
  const formatExpiry = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    
    try {
      // If create account is checked and password provided, create account after payment
      if (data.createAccount && data.password && !user) {
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Generate order number
      const orderNumber = `KH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      
      // Clear cart
      clearCart();
      
      // Redirect to success page with order number
      router.push(`/checkout/success?order=${orderNumber}`);
    } catch (error) {
      console.error('Checkout error:', error);
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#1a1a1a] mb-4">
            Votre panier est vide
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-[#2596be] text-white rounded-none hover:bg-[#1e7a9a] transition-colors font-serif"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-serif text-4xl md:text-5xl text-[#1a1a1a] mb-8 text-center">
          Paiement
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Coordonnées */}
          <div className={`border-l-4 ${openSections.information ? 'border-[#2596be]' : 'border-transparent'} border-b border-gray-200 pb-6 bg-white rounded-none`}>
            <button
              type="button"
              onClick={() => toggleSection('information')}
              className={`w-full flex items-center justify-between py-4 px-4 text-left ${
                openSections.information ? 'text-[#2596be]' : 'text-[#1a1a1a]'
              }`}
            >
              <h2 className="font-serif text-2xl">1. Coordonnées</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.information ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.information && (
              <div className="mt-4 px-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                      errors.email
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                      errors.phone
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Livraison */}
          <div className={`border-l-4 ${openSections.delivery ? 'border-[#2596be]' : 'border-transparent'} border-b border-gray-200 pb-6 bg-white rounded-none`}>
            <button
              type="button"
              onClick={() => toggleSection('delivery')}
              className={`w-full flex items-center justify-between py-4 px-4 text-left ${
                openSections.delivery ? 'text-[#2596be]' : 'text-[#1a1a1a]'
              }`}
            >
              <h2 className="font-serif text-2xl">2. Livraison</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.delivery ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.delivery && (
              <div className="mt-4 px-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      {...register('firstName')}
                      className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                        errors.firstName
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      {...register('lastName')}
                      className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                        errors.lastName
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse *
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                      errors.address
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ville *
                    </label>
                    <input
                      type="text"
                      {...register('city')}
                      className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                        errors.city
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Code postal *
                    </label>
                    <input
                      type="text"
                      {...register('zipCode')}
                      maxLength={5}
                      className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                        errors.zipCode
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <input
                      type="text"
                      {...register('country')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:border-[#2596be] focus:ring-[#2596be]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Récapitulatif */}
          <div className={`border-l-4 ${openSections.summary ? 'border-[#2596be]' : 'border-transparent'} border-b border-gray-200 pb-6 bg-white rounded-none`}>
            <button
              type="button"
              onClick={() => toggleSection('summary')}
              className={`w-full flex items-center justify-between py-4 px-4 text-left ${
                openSections.summary ? 'text-[#2596be]' : 'text-[#1a1a1a]'
              }`}
            >
              <h2 className="font-serif text-2xl">3. Récapitulatif</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.summary ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.summary && (
              <div className="mt-4 px-4 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getValidImageUrl(item.product.image_url || item.product.image)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-none"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.svg';
                      }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-[#1a1a1a]">{item.product.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantité: {item.quantity}
                      </p>
                      <p className="text-[#1a1a1a] mt-1">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-4 space-y-2 border-t border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? 'Offerte' : `${shipping.toFixed(2)} €`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-xl text-[#1a1a1a] pt-2 border-t border-gray-200">
                    <span>Total</span>
                    <span className="text-[#D4AF37] font-bold">{finalTotal.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Paiement */}
          <div className={`border-l-4 ${openSections.payment ? 'border-[#2596be]' : 'border-transparent'} border-b border-gray-200 pb-6 bg-white rounded-none`}>
            <button
              type="button"
              onClick={() => toggleSection('payment')}
              className={`w-full flex items-center justify-between py-4 px-4 text-left ${
                openSections.payment ? 'text-[#2596be]' : 'text-[#1a1a1a]'
              }`}
            >
              <h2 className="font-serif text-2xl">4. Paiement</h2>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  openSections.payment ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openSections.payment && (
              <div className="mt-4 px-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de carte *
                  </label>
                  <input
                    type="text"
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    {...register('cardNumber', {
                      onChange: (e) => {
                        const formatted = formatCardNumber(e.target.value);
                        setValue('cardNumber', formatted);
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                      errors.cardNumber
                        ? 'border-red-500'
                        : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                    } focus:outline-none focus:ring-2`}
                  />
                  {errors.cardNumber && (
                    <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiration (MM/YY) *
                    </label>
                    <input
                      type="text"
                      placeholder="12/25"
                      maxLength={5}
                      {...register('cardExpiry', {
                        onChange: (e) => {
                          const formatted = formatExpiry(e.target.value);
                          setValue('cardExpiry', formatted);
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                        errors.cardExpiry
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.cardExpiry && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardExpiry.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVC *
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      {...register('cardCVC', {
                        onChange: (e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          setValue('cardCVC', v);
                        },
                      })}
                      className={`w-full px-4 py-3 border rounded-none bg-white text-[#1a1a1a] ${
                        errors.cardCVC
                          ? 'border-red-500'
                          : 'border-gray-300 focus:border-[#2596be] focus:ring-[#2596be]'
                      } focus:outline-none focus:ring-2`}
                    />
                    {errors.cardCVC && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardCVC.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('saveCard')}
                      className="w-4 h-4 accent-[#2596be] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">Sauvegarder pour prochaine fois</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Option créer un compte */}
          {!user && (
            <div className="border-b border-gray-200 pb-6 bg-white rounded-none">
              <div className="px-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => {
                      setCreateAccount(e.target.checked);
                      setValue('createAccount', e.target.checked);
                    }}
                    className="w-4 h-4 accent-[#2596be] cursor-pointer"
                  />
                  <span className="text-sm text-gray-700">Créer un compte</span>
                </label>

                {createAccount && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe *
                    </label>
                    <input
                      type="password"
                      {...register('password')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-none bg-white text-[#1a1a1a] focus:outline-none focus:ring-2 focus:border-[#2596be] focus:ring-[#2596be]"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bouton Payer */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#2596be] hover:bg-[#1e7a9a] text-white py-4 text-lg font-bold rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-serif"
          >
            {isSubmitting ? 'Traitement en cours...' : `Payer ${finalTotal.toFixed(2)} €`}
          </button>
        </form>
      </div>
    </div>
  );
}
