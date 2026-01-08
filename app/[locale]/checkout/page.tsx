'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/context/CartContext';
import { useAuth } from '@/lib/context/AuthContext';
import { supabase } from '@/lib/db/supabase';
import { getValidImageUrl } from '@/lib/utils/images';
import StripePayment from '@/components/checkout/StripePayment';
import {
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Check,
  Truck,
  Package,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  ChevronRight,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { z } from 'zod';

// Validation téléphone français formaté
const frenchPhoneRegex = /^\+33\s\d\s\d{2}\s\d{2}\s\d{2}\s\d{2}$/;

const checkoutSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  phone: z.string()
    .min(1, 'Téléphone requis')
    .refine((val) => frenchPhoneRegex.test(val), 'Numéro de téléphone invalide'),
  firstName: z.string().min(1, 'Prénom requis'),
  lastName: z.string().min(1, 'Nom requis'),
  address: z.string().min(1, 'Adresse requise'),
  city: z.string().min(1, 'Ville requise'),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)').min(1, 'Code postal requis'),
  country: z.string().default('France').optional(),
  createAccount: z.boolean().optional(),
  password: z.string().optional(),
});

// Formater le téléphone français : +33 6 12 34 56 78
const formatFrenchPhone = (value: string): string => {
  // Supprimer tout sauf les chiffres
  let digits = value.replace(/\D/g, '');

  // Si commence par 33, on le garde, sinon on l'ajoute
  if (digits.startsWith('33')) {
    digits = digits.substring(2);
  }
  // Si commence par 0, on le retire
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Limiter à 9 chiffres (sans le 0 initial)
  digits = digits.substring(0, 9);

  // Formater : +33 X XX XX XX XX
  let formatted = '+33';
  if (digits.length > 0) {
    formatted += ' ' + digits.charAt(0);
  }
  if (digits.length > 1) {
    formatted += ' ' + digits.substring(1, 3);
  }
  if (digits.length > 3) {
    formatted += ' ' + digits.substring(3, 5);
  }
  if (digits.length > 5) {
    formatted += ' ' + digits.substring(5, 7);
  }
  if (digits.length > 7) {
    formatted += ' ' + digits.substring(7, 9);
  }

  return formatted;
};

// Vérifier si le téléphone est complet
const isPhoneComplete = (value: string): boolean => {
  return frenchPhoneRegex.test(value);
};

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface Commune {
  nom: string;
  code: string;
  codesPostaux: string[];
}

// Interface pour l'API adresse.data.gouv.fr
interface AddressSuggestion {
  label: string;
  name: string;
  postcode: string;
  city: string;
  context: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [addressValid, setAddressValid] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // City autocomplete states
  const [cityOptions, setCityOptions] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState<boolean | null>(null);
  const [zipCodeLoading, setZipCodeLoading] = useState(false);

  // Reverse lookup: city → zip codes
  const [zipCodeOptions, setZipCodeOptions] = useState<{ code: string; city: string }[]>([]);
  const [showZipDropdown, setShowZipDropdown] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  // Phone state
  const [phoneValid, setPhoneValid] = useState(false);

  // Address autocomplete states
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    setValue,
    watch,
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      email: user?.email || '',
      phone: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      zipCode: '',
      country: 'France',
      createAccount: false,
      password: '',
    },
  });

  const watchedFields = watch(['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'zipCode']);
  const watchedZipCode = watch('zipCode');
  const watchedCity = watch('city');

  useEffect(() => {
    const allFilled = watchedFields.every(field => field && field.length > 0);
    const formValid = allFilled && isValid;
    setAddressValid(formValid);
    if (formValid && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [watchedFields, isValid, currentStep]);

  useEffect(() => {
    if (user?.email) {
      setValue('email', user.email);
    }
  }, [user, setValue]);

  const fetchCities = useCallback(async (zipCode: string) => {
    if (!/^\d{5}$/.test(zipCode)) {
      setZipCodeValid(false);
      setCityOptions([]);
      return;
    }

    setZipCodeLoading(true);
    try {
      const response = await fetch(`https://geo.api.gouv.fr/communes?codePostal=${zipCode}&fields=nom`);
      const data: Commune[] = await response.json();

      if (data && data.length > 0) {
        const cities = data.map(commune => commune.nom);
        setCityOptions(cities);
        setZipCodeValid(true);

        if (cities.length === 1) {
          setValue('city', cities[0]);
          trigger('city');
          setShowCityDropdown(false);
        } else {
          setShowCityDropdown(true);
        }
      } else {
        setCityOptions([]);
        setZipCodeValid(false);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setZipCodeValid(false);
      setCityOptions([]);
    } finally {
      setZipCodeLoading(false);
    }
  }, [setValue, trigger]);

  const handleZipCodeBlur = () => {
    if (watchedZipCode && watchedZipCode.length === 5) {
      fetchCities(watchedZipCode);
    }
  };

  const selectCity = (city: string) => {
    setValue('city', city);
    trigger('city');
    setShowCityDropdown(false);
  };

  // Recherche inverse : ville → codes postaux
  const fetchZipCodes = useCallback(async (cityName: string) => {
    if (cityName.length < 2) {
      setZipCodeOptions([]);
      return;
    }

    setCityLoading(true);
    try {
      const response = await fetch(
        `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(cityName)}&fields=nom,codesPostaux&limit=10`
      );
      const data: Commune[] = await response.json();

      if (data && data.length > 0) {
        // Créer une liste de tous les codes postaux avec leur ville
        const options: { code: string; city: string }[] = [];
        data.forEach((commune) => {
          commune.codesPostaux?.forEach((cp) => {
            options.push({ code: cp, city: commune.nom });
          });
        });
        setZipCodeOptions(options);
        if (options.length > 0) {
          setShowZipDropdown(true);
        }
      } else {
        setZipCodeOptions([]);
      }
    } catch (error) {
      console.error('Error fetching zip codes:', error);
      setZipCodeOptions([]);
    } finally {
      setCityLoading(false);
    }
  }, []);

  // Sélectionner un code postal depuis la recherche inverse
  const selectZipCode = (option: { code: string; city: string }) => {
    setValue('zipCode', option.code);
    setValue('city', option.city);
    trigger('zipCode');
    trigger('city');
    setShowZipDropdown(false);
    setZipCodeValid(true);
  };

  // Handler pour le champ ville avec debounce
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('city', value);

    // Rechercher les codes postaux après 2 caractères
    if (value.length >= 2 && !watchedZipCode) {
      fetchZipCodes(value);
    } else {
      setShowZipDropdown(false);
    }
  };

  // Handler pour le téléphone avec formatage automatique
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatFrenchPhone(e.target.value);
    setValue('phone', formatted);
    setPhoneValid(isPhoneComplete(formatted));
    trigger('phone');
  };

  // Recherche d'adresses via api-adresse.data.gouv.fr
  const fetchAddresses = useCallback(async (query: string) => {
    if (query.length < 5) {
      setAddressSuggestions([]);
      setShowAddressDropdown(false);
      return;
    }

    setAddressLoading(true);
    try {
      const response = await fetch(
        `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5&type=housenumber`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const suggestions: AddressSuggestion[] = data.features.map((feature: { properties: { label: string; name: string; postcode: string; city: string; context: string } }) => ({
          label: feature.properties.label,
          name: feature.properties.name,
          postcode: feature.properties.postcode,
          city: feature.properties.city,
          context: feature.properties.context,
        }));
        setAddressSuggestions(suggestions);
        setShowAddressDropdown(true);
      } else {
        setAddressSuggestions([]);
        setShowAddressDropdown(false);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setAddressSuggestions([]);
    } finally {
      setAddressLoading(false);
    }
  }, []);

  // Sélectionner une adresse
  const selectAddress = (suggestion: AddressSuggestion) => {
    setValue('address', suggestion.name);
    setValue('zipCode', suggestion.postcode);
    setValue('city', suggestion.city);
    trigger('address');
    trigger('zipCode');
    trigger('city');
    setShowAddressDropdown(false);
    setZipCodeValid(true);
  };

  // Handler pour le champ adresse
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('address', value);
    trigger('address');

    // Rechercher les adresses après 5 caractères (optionnel, aide à la saisie)
    if (value.length >= 5) {
      fetchAddresses(value);
    } else {
      setShowAddressDropdown(false);
    }
  };

  // Fermer le dropdown d'adresse quand on clique ailleurs
  const handleAddressBlur = () => {
    // Petit délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowAddressDropdown(false), 200);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="animate-pulse flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const shipping = subtotal >= 50 ? 0 : 5.9;
  const finalTotal = subtotal + shipping;
  const freeShippingRemaining = Math.max(0, 50 - subtotal);

  const handlePaymentSuccess = async () => {
    const formData = watch();

    if (formData.createAccount && formData.password && !user) {
      try {
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });
      } catch (error) {
        console.error('Account creation error:', error);
      }
    }

    const orderNumber = `KH-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    clearCart();
    router.push(`/fr/checkout/success?order=${orderNumber}`);
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
  };

  const onAddressSubmit = (data: CheckoutFormData) => {
    console.log('Address validated:', data);
    setAddressValid(true);
    setCurrentStep(2);
  };

  const getFieldState = (fieldName: keyof CheckoutFormData) => {
    const hasError = errors[fieldName];
    const isDirty = dirtyFields[fieldName];
    const value = watch(fieldName);

    if (hasError) return 'error';
    if (isDirty && value && typeof value === 'string' && value.length > 0) return 'valid';
    return 'default';
  };

  const getFieldBorderClass = (fieldName: keyof CheckoutFormData) => {
    const state = getFieldState(fieldName);
    switch (state) {
      case 'error':
        return 'border-red-400 focus:border-red-500 focus:ring-red-200';
      case 'valid':
        return 'border-green-400 focus:border-green-500 focus:ring-green-200';
      default:
        return 'border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20';
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F7] pt-24 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#F4EAD8] rounded-full flex items-center justify-center">
            <Package className="w-10 h-10 text-[#D4AF37]" />
          </div>
          <h1 className="font-serif text-2xl text-[#2D2926] mb-3">Votre panier est vide</h1>
          <p className="text-[#2D2926]/60 mb-6">Découvrez nos bijoux indiens artisanaux et trouvez la pièce parfaite.</p>
          <Link
            href="/fr/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2D2926] text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F7] pt-20 pb-12">
      {/* Header avec progression */}
      <div className="bg-white border-b border-gray-100 py-4 mb-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <Link href="/fr/cart" className="text-[#2596be] hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Retour au panier
            </Link>
          </div>

          {/* Étapes */}
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-[#2D2926]' : 'text-gray-400'}`}>
                Livraison
              </span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-[#D4AF37] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-[#2D2926]' : 'text-gray-400'}`}>
                Paiement
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Bandeau livraison gratuite */}
        {freeShippingRemaining > 0 && (
          <div className="bg-[#F4EAD8] border border-[#D4AF37]/30 p-4 mb-6 flex items-center justify-center gap-3">
            <Gift className="w-5 h-5 text-[#D4AF37]" />
            <p className="text-sm text-[#2D2926]">
              Plus que <strong>{freeShippingRemaining.toFixed(2)}€</strong> pour bénéficier de la livraison gratuite !
            </p>
          </div>
        )}

        {shipping === 0 && (
          <div className="bg-green-50 border border-green-200 p-4 mb-6 flex items-center justify-center gap-3">
            <Truck className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700 font-medium">
              Livraison offerte sur votre commande !
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Formulaire (gauche) */}
          <div className="space-y-6">
            {/* Section Contact */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4EAD8] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#2D2926]">Informations de contact</h2>
                  <p className="text-xs text-[#2D2926]/50">Pour vous tenir informé de votre commande</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2D2926] mb-2">
                    <Mail className="w-4 h-4 text-[#2D2926]/40" />
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="votre@email.com"
                      className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${getFieldBorderClass('email')}`}
                    />
                    {getFieldState('email') === 'valid' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[#2D2926] mb-2">
                    <Phone className="w-4 h-4 text-[#2D2926]/40" />
                    Téléphone
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={watch('phone') || '+33'}
                      onChange={handlePhoneChange}
                      placeholder="+33 6 12 34 56 78"
                      className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${
                        phoneValid
                          ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
                          : errors.phone
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-200 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20'
                      }`}
                    />
                    {phoneValid && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  {errors.phone && !phoneValid && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  <p className="text-[10px] text-[#2D2926]/40 mt-1">Format : +33 6 12 34 56 78</p>
                </div>
              </div>
            </div>

            {/* Section Adresse */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4EAD8] rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg text-[#2D2926]">Adresse de livraison</h2>
                  <p className="text-xs text-[#2D2926]/50">Livraison en France métropolitaine</p>
                </div>
              </div>
              <form onSubmit={handleSubmit(onAddressSubmit)} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2926] mb-2">Prénom</label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register('firstName')}
                        placeholder="Jean"
                        className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${getFieldBorderClass('firstName')}`}
                      />
                      {getFieldState('firstName') === 'valid' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2D2926] mb-2">Nom</label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register('lastName')}
                        placeholder="Dupont"
                        className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${getFieldBorderClass('lastName')}`}
                      />
                      {getFieldState('lastName') === 'valid' && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-[#2D2926] mb-2">Adresse</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={watch('address') || ''}
                      onChange={handleAddressChange}
                      onBlur={handleAddressBlur}
                      placeholder="123 rue de la Paix"
                      className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${getFieldBorderClass('address')}`}
                    />
                    {addressLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                    )}
                    {!addressLoading && getFieldState('address') === 'valid' && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}

                  {/* Dropdown suggestions d'adresses */}
                  {showAddressDropdown && addressSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border border-[#D4AF37]/40 shadow-lg max-h-60 overflow-y-auto">
                      {addressSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectAddress(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-[#F4EAD8] transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-[#2D2926]">{suggestion.name}</p>
                          <p className="text-xs text-[#2D2926]/60">{suggestion.postcode} {suggestion.city}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2926] mb-2">Code postal</label>
                    <div className="relative">
                      <input
                        type="text"
                        {...register('zipCode')}
                        maxLength={5}
                        onBlur={handleZipCodeBlur}
                        placeholder="75001"
                        className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${
                          zipCodeValid === false
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                            : zipCodeValid === true
                              ? 'border-green-400 focus:border-green-500 focus:ring-green-200'
                              : getFieldBorderClass('zipCode')
                        }`}
                      />
                      {zipCodeLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      )}
                      {!zipCodeLoading && zipCodeValid === true && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>}
                    {zipCodeValid === false && !errors.zipCode && watchedZipCode?.length === 5 && (
                      <p className="text-red-500 text-xs mt-1">Code postal non trouvé</p>
                    )}
                  </div>
                  <div className="col-span-2 relative">
                    <label className="block text-sm font-medium text-[#2D2926] mb-2">Ville</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={watchedCity || ''}
                        onChange={handleCityChange}
                        placeholder="Paris"
                        className={`w-full px-4 py-3 bg-white border text-[#2D2926] transition-all focus:outline-none focus:ring-2 ${getFieldBorderClass('city')}`}
                        onFocus={() => {
                          if (cityOptions.length > 1) setShowCityDropdown(true);
                          if (zipCodeOptions.length > 0 && !watchedZipCode) setShowZipDropdown(true);
                        }}
                      />
                      {cityLoading && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                      )}
                      {!cityLoading && getFieldState('city') === 'valid' && watchedZipCode && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}

                    {/* Dropdown villes (depuis code postal) */}
                    {showCityDropdown && cityOptions.length > 1 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#D4AF37]/40 shadow-lg max-h-48 overflow-y-auto">
                        {cityOptions.map((city, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectCity(city)}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-[#F4EAD8] transition-colors ${
                              watchedCity === city ? 'bg-[#F4EAD8] font-medium' : ''
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Dropdown codes postaux (depuis ville) */}
                    {showZipDropdown && zipCodeOptions.length > 0 && !watchedZipCode && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-[#D4AF37]/40 shadow-lg max-h-48 overflow-y-auto">
                        {zipCodeOptions.map((option, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => selectZipCode(option)}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-[#F4EAD8] transition-colors flex justify-between items-center"
                          >
                            <span>{option.city}</span>
                            <span className="text-[#2D2926]/50 text-xs">{option.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-2 text-sm text-[#2D2926]/60">
                    <div className="w-8 h-5 bg-blue-900 rounded flex items-center justify-center text-white text-[10px] font-bold">FR</div>
                    <span>France</span>
                  </div>
                </div>
              </form>

              {/* Option créer un compte */}
              {!user && (
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-gray-100 pt-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => {
                          setCreateAccount(e.target.checked);
                          setValue('createAccount', e.target.checked);
                        }}
                        className="w-5 h-5 mt-0.5 accent-[#D4AF37] cursor-pointer"
                      />
                      <div>
                        <span className="text-sm font-medium text-[#2D2926] group-hover:text-[#D4AF37] transition-colors">
                          Créer un compte
                        </span>
                        <p className="text-xs text-[#2D2926]/50 mt-0.5">
                          Suivez vos commandes et accédez à votre wishlist
                        </p>
                      </div>
                    </label>
                    {createAccount && (
                      <div className="mt-3 ml-8">
                        <input
                          type="password"
                          placeholder="Choisissez un mot de passe"
                          {...register('password')}
                          className="w-full px-4 py-3 bg-white border border-gray-200 text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Section Paiement */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4EAD8] rounded-full flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-lg text-[#2D2926]">Paiement sécurisé</h2>
                  <p className="text-xs text-[#2D2926]/50">Cryptage SSL 256 bits</p>
                </div>
                <Lock className="w-5 h-5 text-green-500" />
              </div>

              <div className="p-6">
                {/* Badges de confiance */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-6 pb-6 border-b border-gray-100">
                  <div className="px-3 py-1.5 bg-[#1A1F71] text-white text-xs font-bold rounded">VISA</div>
                  <div className="px-3 py-1.5 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] text-white text-xs font-bold rounded">MC</div>
                  <div className="px-3 py-1.5 bg-[#006FCF] text-white text-xs font-bold rounded">AMEX</div>
                  <div className="px-3 py-1.5 bg-[#1F4E79] text-white text-xs font-bold rounded">CB</div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-[#635BFF] text-white text-xs font-bold rounded">
                    <span>stripe</span>
                  </div>
                </div>

                {addressValid ? (
                  <>
                    <StripePayment
                      amount={finalTotal}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />

                    {/* Garanties */}
                    <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#2D2926]">Paiement sécurisé</p>
                          <p className="text-[10px] text-[#2D2926]/50">Données cryptées</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                          <RotateCcw className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#2D2926]">Satisfait ou remboursé</p>
                          <p className="text-[10px] text-[#2D2926]/50">14 jours pour changer d&apos;avis</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm text-[#2D2926]/60 max-w-xs mx-auto">
                      Complétez vos informations de livraison pour accéder au paiement sécurisé
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Récapitulatif (droite) */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            {/* Résumé commande */}
            <div className="bg-white border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-serif text-lg text-[#2D2926]">Votre commande</h2>
                <span className="text-sm text-[#2D2926]/50">{items.length} article{items.length > 1 ? 's' : ''}</span>
              </div>

              {/* Liste produits */}
              <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-[#FAF9F7] flex-shrink-0 relative border border-gray-100">
                      <Image
                        src={getValidImageUrl(item.product.image_url || item.product.image)}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#2D2926] rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-medium">{item.quantity}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#2D2926] line-clamp-2">{item.product.name}</p>
                      <p className="text-xs text-[#2D2926]/50 mt-1">
                        {item.product.type && <span className="capitalize">{item.product.type}</span>}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-[#2D2926] whitespace-nowrap">
                      {(item.product.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="px-6 py-4 border-t border-gray-100 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2926]/60">Sous-total</span>
                  <span className="text-[#2D2926]">{subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2D2926]/60">Livraison</span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Offerte</span>
                  ) : (
                    <span className="text-[#2D2926]">{shipping.toFixed(2)} €</span>
                  )}
                </div>
              </div>

              {/* Total final */}
              <div className="px-6 py-4 bg-[#FAF9F7] border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg text-[#2D2926]">Total</span>
                  <span className="font-serif text-2xl text-[#D4AF37] font-bold">{finalTotal.toFixed(2)} €</span>
                </div>
                <p className="text-[10px] text-[#2D2926]/40 mt-1">TVA incluse</p>
              </div>
            </div>

            {/* Garanties */}
            <div className="bg-white border border-gray-200 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-[#2D2926]">Livraison soignée</p>
                  <p className="text-xs text-[#2D2926]/50">Écrin offert avec chaque bijou</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-[#2D2926]">Paiement 100% sécurisé</p>
                  <p className="text-xs text-[#2D2926]/50">Vos données sont protégées</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <p className="text-sm font-medium text-[#2D2926]">Retours gratuits</p>
                  <p className="text-xs text-[#2D2926]/50">14 jours pour changer d&apos;avis</p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="text-center py-3">
              <p className="text-xs text-[#2D2926]/40">Une question ?</p>
              <Link href="/fr/contact" className="text-xs text-[#2596be] hover:underline">
                Contactez-nous
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
