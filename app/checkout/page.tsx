'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/context/CartContext';
import { useRouter } from 'next/navigation';
import { Lock, CreditCard, Shield } from 'lucide-react';

// Helper pour nettoyer l'URL d'image
const getValidImageUrl = (path?: string | null) => {
  if (!path || path === 'Image Manquante') return '/placeholder-image.svg';
  if (path.startsWith('http')) return path;
  if (path.includes('_raw_assets')) {
    const filename = path.split('/').pop();
    return `/images/products/${filename}`;
  }
  return path.startsWith('/') ? path : `/images/products/${path}`;
};

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    phone: '',
  });

  const subtotal = getTotal();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implémenter l'intégration réelle avec Supabase pour les commandes
    console.log('Commande soumise:', { formData, items, total });

    // Simuler une commande réussie
    await new Promise((resolve) => setTimeout(resolve, 1500));
    clearCart();
    router.push('/checkout/success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f1eb] py-10 px-4 flex items-center justify-center">
        <div className="text-center bg-white shadow-2xl rounded-sm p-8 md:p-12 max-w-md">
          <h1 className="text-3xl font-serif text-[#1a1a1a] mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8 font-sans">
            Ajoutez des articles pour finaliser votre commande.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#2596be] text-white font-sans font-medium py-3 px-6 rounded transition-all hover:bg-[#2596be]/90"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1eb]">
      {/* Header Minimaliste - Logo Centré */}
      <header className="bg-white border-b border-[#D4AF37]/20 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="flex justify-center">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2596be] tracking-widest uppercase">
              KHASHIKA
            </h1>
          </Link>
        </div>
      </header>

      {/* Conteneur Principal - Feuille de Papier */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-white shadow-xl rounded-sm p-8 md:p-12">
          {/* Header Minimal */}
          <div className="text-center mb-12 pb-8 border-b border-[#D4AF37]/20">
            <h2 className="text-4xl md:text-5xl font-serif text-[#1a1a1a] mb-2">
              Finaliser votre commande
            </h2>
            <p className="text-[#1a1a1a]/70 font-sans text-sm">
              Vos bijoux vous attendent
            </p>
          </div>

          {/* Grille 2 Colonnes */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12">
            {/* Colonne Gauche - Formulaire */}
            <div className="space-y-8">
              {/* Email */}
              <div>
                <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                  placeholder="votre@email.com"
                  required
                />
              </div>

              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                  Adresse *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                  placeholder="123 Rue de la Joaillerie"
                  required
                />
              </div>

              {/* Ville et Code Postal */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                    Code postal *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                    placeholder="75001"
                    required
                  />
                </div>
                <div>
                  <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                    Ville *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                    placeholder="Paris"
                    required
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block font-sans text-sm font-semibold text-[#1a1a1a] mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-transparent border-0 border-b-2 border-[#1a1a1a]/20 focus:border-[#D4AF37] focus:outline-none py-2 font-sans text-[#1a1a1a] transition-colors duration-300"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>

              {/* Section Paiement */}
              <div className="pt-8 border-t border-[#1a1a1a]/10">
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-6">
                  Paiement
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 border border-[#1a1a1a]/10 rounded-sm hover:border-[#D4AF37] transition-colors duration-300 cursor-pointer">
                    <input type="radio" name="payment" id="card" defaultChecked className="accent-[#D4AF37]" />
                    <label htmlFor="card" className="font-sans text-sm text-[#1a1a1a] cursor-pointer">
                      Carte bancaire (Visa, Mastercard)
                    </label>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-[#1a1a1a]/10 rounded-sm hover:border-[#D4AF37] transition-colors duration-300 cursor-pointer">
                    <input type="radio" name="payment" id="paypal" className="accent-[#D4AF37]" />
                    <label htmlFor="paypal" className="font-sans text-sm text-[#1a1a1a] cursor-pointer">
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite - Récapitulatif */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-[#f9f9f9] rounded-sm p-6 space-y-6">
                <h3 className="font-serif text-2xl text-[#1a1a1a] mb-4">
                  Récapitulatif
                </h3>

                {/* Liste des produits */}
                <div className="space-y-4 pb-6 border-b border-[#1a1a1a]/10">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 bg-white rounded-sm overflow-hidden flex-shrink-0">
                        <Image
                          src={getValidImageUrl(item.product.image_url || item.product.image)}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                          sizes="64px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-[#1a1a1a] line-clamp-2 mb-1">
                          {item.product.name}
                        </p>
                        <p className="font-sans text-xs text-[#1a1a1a]/60">
                          Qté: {item.quantity}
                        </p>
                        <p className="font-sans text-sm font-semibold text-[#D4AF37] mt-1">
                          {item.product.price.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totaux */}
                <div className="space-y-3 pt-4">
                  <div className="flex justify-between font-sans text-sm text-[#1a1a1a]">
                    <span>Sous-total</span>
                    <span>{subtotal.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm text-[#1a1a1a]">
                    <span>Livraison</span>
                    <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg font-semibold text-[#1a1a1a] pt-4 border-t border-[#1a1a1a]/10">
                    <span>Total</span>
                    <span className="text-[#D4AF37]">{total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Bouton Payer */}
                <button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-white font-sans font-semibold py-4 px-6 rounded-sm hover:bg-[#D4AF37]/90 transition-all duration-300 hover:scale-[1.02] mt-6"
                >
                  Payer maintenant
                </button>

                {/* Réassurance avec Logos */}
                <div className="pt-6 border-t border-[#1a1a1a]/10 space-y-4">
                  <div className="flex items-center justify-center gap-2 text-[#1a1a1a]/70">
                    <Lock size={16} />
                    <p className="text-center font-sans text-xs">
                      Paiement sécurisé SSL
                    </p>
                  </div>
                  
                  {/* Logos CB/Visa */}
                  <div className="flex justify-center gap-3 opacity-70">
                    <div className="w-12 h-8 bg-white border border-[#1a1a1a]/10 rounded flex items-center justify-center">
                      <span className="font-sans text-[10px] font-bold text-[#1a1a1a]">VISA</span>
                    </div>
                    <div className="w-12 h-8 bg-white border border-[#1a1a1a]/10 rounded flex items-center justify-center">
                      <span className="font-sans text-[10px] font-bold text-[#1a1a1a]">MC</span>
                    </div>
                  </div>
                  
                  <p className="text-center font-sans text-xs text-[#1a1a1a]/60">
                    Expédition depuis la France 🇫🇷
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
