'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
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
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);

  // Fix hydration error: wait for client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

  // Return loading state until mounted (fixes hydration mismatch)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">Chargement...</div>
        </div>
      </div>
    );
  }

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
      <div className="min-h-screen bg-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <p className="font-serif text-2xl text-[#2D2420] mb-4">
            Votre panier est vide
          </p>
          <button
            onClick={() => router.push('/shop')}
            className="px-6 py-3 bg-[#8B4E4E] text-white rounded-none hover:bg-[#6B3D3D] transition-colors font-serif"
          >
            Continuer vos achats
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-serif text-3xl font-bold text-[#2D2420] mb-6">Paiement</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-6">
          {/* Formulaire (gauche) */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-[#2D2420] mb-1">Email *</label>
              <input
                type="email"
                {...register('email')}
                className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                  errors.email ? 'border-red-500' : 'focus:border-[#F0C11D]'
                } focus:outline-none`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2420] mb-1">Téléphone *</label>
              <input
                type="tel"
                {...register('phone')}
                className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                  errors.phone ? 'border-red-500' : 'focus:border-[#F0C11D]'
                } focus:outline-none`}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            
            {/* Adresse - 2 colonnes */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#2D2420] mb-1">Prénom *</label>
                <input
                  type="text"
                  {...register('firstName')}
                  className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                    errors.firstName ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                  } focus:outline-none`}
                />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2420] mb-1">Nom *</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                    errors.lastName ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                  } focus:outline-none`}
                />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2420] mb-1">Adresse *</label>
              <input
                type="text"
                {...register('address')}
                className={`w-full px-3 py-2 border rounded-none text-sm ${
                  errors.address ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                } focus:outline-none`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#2D2420] mb-1">Code postal *</label>
                <input
                  type="text"
                  {...register('zipCode')}
                  maxLength={5}
                  className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                    errors.zipCode ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                  } focus:outline-none`}
                />
                {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#2D2420] mb-1">Ville *</label>
                <input
                  type="text"
                  {...register('city')}
                  className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                    errors.city ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                  } focus:outline-none`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
              </div>
            </div>
            
            {/* Paiement */}
            <div className="border-t border-[#F0C11D]/40 pt-4 mt-4">
              <label className="block text-sm font-medium text-[#2D2420] mb-1">Carte bancaire</label>
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
                className={`w-full px-3 py-2 border rounded-none text-sm mb-2 ${
                  errors.cardNumber ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                } focus:outline-none`}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mb-2">{errors.cardNumber.message}</p>}
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="MM/AA"
                  maxLength={5}
                  {...register('cardExpiry', {
                    onChange: (e) => {
                      const formatted = formatExpiry(e.target.value);
                      setValue('cardExpiry', formatted);
                    },
                  })}
                  className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                    errors.cardExpiry ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                  } focus:outline-none`}
                />
                <input
                  type="text"
                  placeholder="CVC"
                  maxLength={4}
                  {...register('cardCVC', {
                    onChange: (e) => {
                      const v = e.target.value.replace(/\D/g, '');
                      setValue('cardCVC', v);
                    },
                  })}
                  className={`w-full px-4 py-3 bg-white border border-[#F0C11D]/40 rounded-none text-[#2D2420] ${
                    errors.cardCVC ? 'border-red-500' : 'border-[#F0C11D]/40 focus:border-[#F0C11D]'
                  } focus:outline-none`}
                />
              </div>
              {errors.cardExpiry && <p className="text-red-500 text-xs mt-1">{errors.cardExpiry.message}</p>}
              {errors.cardCVC && <p className="text-red-500 text-xs mt-1">{errors.cardCVC.message}</p>}
            </div>

            {/* Option créer un compte */}
            {!user && (
              <div className="border-t border-[#F0C11D]/40 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => {
                      setCreateAccount(e.target.checked);
                      setValue('createAccount', e.target.checked);
                    }}
                    className="w-4 h-4 accent-[#8B4E4E] cursor-pointer"
                  />
                  <span className="text-sm text-[#2D2420]">Créer un compte</span>
                </label>
                {createAccount && (
                  <div className="mt-2">
                    <input
                      type="password"
                      placeholder="Mot de passe *"
                      {...register('password')}
                      className="w-full px-3 py-2 bg-white border border-[#F0C11D]/40 rounded-none text-sm text-[#2D2420] focus:outline-none focus:border-[#F0C11D]"
                    />
                  </div>
                )}
              </div>
            )}
          </form>

          {/* Récapitulatif (droite) */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[#FAF9F7] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)] p-6 sticky top-24">
              <h2 className="font-serif text-xl text-[#2D2420] mb-4 pb-2 border-b border-[#F0C11D]/20">Récapitulatif</h2>
              
              {/* Liste produits */}
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 bg-white flex-shrink-0 relative">
                      <Image
                        src={getValidImageUrl(item.product.image_url || item.product.image)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{item.product.name}</p>
                      <p className="text-[#2D2420]/60">x{item.quantity}</p>
                    </div>
                    <p className="font-medium">{(item.product.price * item.quantity).toFixed(2)}€</p>
                  </div>
                ))}
              </div>
              
              {/* Totaux */}
              <div className="border-t border-[#F0C11D]/20 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2420]/60">Sous-total</span>
                  <span className="text-[#2D2420]">{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2420]/60">Livraison</span>
                  <span className="text-[#2D2420]">{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#F0C11D]/20">
                  <span className="text-[#2D2420]">Total</span>
                  <span className="text-[#F0C11D]">{finalTotal.toFixed(2)}€</span>
                </div>
              </div>
              
              {/* Bouton payer */}
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full mt-6 py-3 bg-[#8B4E4E] text-white font-medium rounded-none hover:bg-[#6B3D3D] transition-colors"
              >
                {isSubmitting ? 'Traitement...' : `Payer ${finalTotal.toFixed(2)}€`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
