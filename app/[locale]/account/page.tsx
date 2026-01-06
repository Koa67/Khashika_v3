'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  User,
  Package,
  Heart,
  LogOut,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Mail,
  Calendar,
  CheckCircle2,
  Clock,
  Gift,
  CreditCard,
  MapPin,
  Bell,
  ShoppingBag,
  Trash2,
  X,
  AlertTriangle,
  Minus,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Composant Modal de confirmation
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'danger'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            variant === 'danger' ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              variant === 'danger' ? 'text-red-600' : 'text-amber-600'
            }`} />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#2D2926]">{title}</h3>
          </div>
        </div>

        <p className="text-sm text-[#2D2926]/70 mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-[#EAB615]/30 text-[#2D2926] rounded-lg hover:bg-[#FAF9F7] transition-colors font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { items: wishlistItems, clearWishlist } = useWishlist();
  const { items: cartItems, clearCart, removeItem, updateQuantity, getTotal, addItem } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('profile');

  // États pour les modals de confirmation
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearWishlistConfirm, setShowClearWishlistConfirm] = useState(false);
  const [showClearCartConfirm, setShowClearCartConfirm] = useState(false);

  // Redirect si non connecté
  useEffect(() => {
    if (!loading && !user) {
      router.push('/fr/login?redirect=account');
    }
  }, [user, loading, router]);

  // Section depuis URL
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) setActiveSection(section);
  }, [searchParams]);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    signOut();
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F7] to-white pt-8 pb-12 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-[#EAB615] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#2D2926]/60">Chargement de votre espace...</p>
      </div>
    </div>
  );

  if (!user) return null;

  const memberSince = new Date(user.created_at || Date.now());
  const daysSinceMember = Math.floor((Date.now() - memberSince.getTime()) / (1000 * 60 * 60 * 24));
  const cartTotal = getTotal();
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF9F7] to-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Modals de confirmation */}
        <ConfirmModal
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={confirmLogout}
          title="Déconnexion"
          message="Êtes-vous sûr de vouloir vous déconnecter de votre compte Khashika ?"
          confirmText="Se déconnecter"
          cancelText="Annuler"
          variant="warning"
        />

        <ConfirmModal
          isOpen={showClearWishlistConfirm}
          onClose={() => setShowClearWishlistConfirm(false)}
          onConfirm={clearWishlist}
          title="Vider les favoris"
          message={`Êtes-vous sûr de vouloir supprimer tous vos favoris (${wishlistItems.length} article${wishlistItems.length > 1 ? 's' : ''}) ? Cette action est irréversible.`}
          confirmText="Tout supprimer"
          cancelText="Annuler"
          variant="danger"
        />

        <ConfirmModal
          isOpen={showClearCartConfirm}
          onClose={() => setShowClearCartConfirm(false)}
          onConfirm={clearCart}
          title="Vider le panier"
          message={`Êtes-vous sûr de vouloir vider votre panier (${cartItemCount} article${cartItemCount > 1 ? 's' : ''}) ? Cette action est irréversible.`}
          confirmText="Vider le panier"
          cancelText="Annuler"
          variant="danger"
        />

        {/* En-tête avec message de bienvenue */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EAB615] to-[#8B4E4E] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2D2926]">
                Bonjour{user.email ? `, ${user.email.split('@')[0]}` : ''} !
              </h1>
              <p className="text-sm text-[#2D2926]/60">
                Bienvenue dans votre espace personnel Khashika
              </p>
            </div>
          </div>
        </div>

        {/* Bandeau avantages membre */}
        <div className="bg-gradient-to-r from-[#2D2926] to-[#4A3F3A] rounded-xl p-4 md:p-6 mb-8 text-white">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#EAB615]" />
            <span className="font-semibold">Vos avantages membre</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-5 h-5 text-[#EAB615]" />
              </div>
              <div>
                <p className="text-sm font-medium">Livraison offerte</p>
                <p className="text-xs text-white/60">Dès 50 € d&apos;achat</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5 text-[#EAB615]" />
              </div>
              <div>
                <p className="text-sm font-medium">Retours gratuits</p>
                <p className="text-xs text-white/60">30 jours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-[#EAB615]" />
              </div>
              <div>
                <p className="text-sm font-medium">Offres exclusives</p>
                <p className="text-xs text-white/60">Réservées aux membres</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-[#EAB615]" />
              </div>
              <div>
                <p className="text-sm font-medium">Paiement sécurisé</p>
                <p className="text-xs text-white/60">100% protégé</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar navigation */}
          <div className="space-y-4">
            <nav className="bg-white border border-[#EAB615]/20 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-[#FAF9F7] to-white border-b border-[#EAB615]/20">
                <p className="text-xs font-semibold text-[#2D2926]/50 uppercase tracking-wider">Navigation</p>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeSection === 'profile'
                      ? 'bg-[#EAB615]/10 text-[#2D2926] border-l-4 border-[#EAB615] -ml-0.5'
                      : 'text-[#2D2926]/70 hover:bg-[#FAF9F7]'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Mon profil</span>
                </button>
                <button
                  onClick={() => setActiveSection('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeSection === 'orders'
                      ? 'bg-[#EAB615]/10 text-[#2D2926] border-l-4 border-[#EAB615] -ml-0.5'
                      : 'text-[#2D2926]/70 hover:bg-[#FAF9F7]'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Mes commandes</span>
                </button>
                <button
                  onClick={() => setActiveSection('cart')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeSection === 'cart'
                      ? 'bg-[#EAB615]/10 text-[#2D2926] border-l-4 border-[#EAB615] -ml-0.5'
                      : 'text-[#2D2926]/70 hover:bg-[#FAF9F7]'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">Mon panier</span>
                  {cartItemCount > 0 && (
                    <span className="ml-auto bg-[#EAB615] text-white text-xs px-2 py-0.5 rounded-full">
                      {cartItemCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveSection('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all ${
                    activeSection === 'wishlist'
                      ? 'bg-[#EAB615]/10 text-[#2D2926] border-l-4 border-[#EAB615] -ml-0.5'
                      : 'text-[#2D2926]/70 hover:bg-[#FAF9F7]'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Mes favoris</span>
                  {wishlistItems.length > 0 && (
                    <span className="ml-auto bg-[#8B4E4E] text-white text-xs px-2 py-0.5 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
              </div>
              <div className="p-2 border-t border-[#EAB615]/20">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#8B4E4E] hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Déconnexion</span>
                </button>
              </div>
            </nav>

            {/* Carte fidélité / statut */}
            <div className="bg-gradient-to-br from-[#8B4E4E] to-[#6B3D3D] rounded-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-5 h-5 text-[#EAB615]" />
                <span className="font-semibold text-sm">Statut membre</span>
              </div>
              <div className="bg-white/10 rounded-lg p-3 mb-3">
                <p className="text-xs text-white/60 mb-1">Membre depuis</p>
                <p className="font-semibold">
                  {memberSince.toLocaleDateString('fr-FR', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-[#EAB615] mt-1">
                  {daysSinceMember} jours de fidélité
                </p>
              </div>
              <p className="text-xs text-white/70">
                Merci de faire partie de la famille Khashika !
              </p>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="bg-white border border-[#EAB615]/20 rounded-xl shadow-sm overflow-hidden">
            {activeSection === 'profile' && (
              <div>
                <div className="p-6 bg-gradient-to-r from-[#FAF9F7] to-white border-b border-[#EAB615]/20">
                  <h2 className="font-serif text-xl font-bold text-[#2D2926]">Mon profil</h2>
                  <p className="text-sm text-[#2D2926]/60 mt-1">Gérez vos informations personnelles</p>
                </div>
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Informations du compte */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#2D2926] flex items-center gap-2">
                        <User className="w-4 h-4 text-[#EAB615]" />
                        Informations du compte
                      </h3>
                      <div className="bg-[#FAF9F7] rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-[#2D2926]/40" />
                          <div>
                            <p className="text-xs text-[#2D2926]/50">Adresse email</p>
                            <p className="text-sm font-medium text-[#2D2926]">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 text-[#2D2926]/40" />
                          <div>
                            <p className="text-xs text-[#2D2926]/50">Membre depuis</p>
                            <p className="text-sm font-medium text-[#2D2926]">
                              {memberSince.toLocaleDateString('fr-FR', {
                                year: 'numeric', month: 'long', day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-xs text-[#2D2926]/50">Statut du compte</p>
                            <p className="text-sm font-medium text-green-600">Vérifié</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Préférences */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-[#2D2926] flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#EAB615]" />
                        Préférences
                      </h3>
                      <div className="bg-[#FAF9F7] rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-[#2D2926]/40" />
                            <span className="text-sm text-[#2D2926]">Newsletter</span>
                          </div>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Activée</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Gift className="w-4 h-4 text-[#2D2926]/40" />
                            <span className="text-sm text-[#2D2926]">Offres personnalisées</span>
                          </div>
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Activées</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section sécurité */}
                  <div className="mt-8 pt-6 border-t border-[#EAB615]/20">
                    <h3 className="font-semibold text-[#2D2926] flex items-center gap-2 mb-4">
                      <Shield className="w-4 h-4 text-[#EAB615]" />
                      Sécurité du compte
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Votre compte est sécurisé</p>
                        <p className="text-xs text-green-600 mt-1">
                          Vos données personnelles sont protégées et chiffrées. Nous ne partageons jamais vos informations avec des tiers.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div>
                <div className="p-6 bg-gradient-to-r from-[#FAF9F7] to-white border-b border-[#EAB615]/20">
                  <h2 className="font-serif text-xl font-bold text-[#2D2926]">Mes commandes</h2>
                  <p className="text-sm text-[#2D2926]/60 mt-1">Suivez vos commandes et consultez votre historique</p>
                </div>
                <div className="p-6">
                  {/* État vide amélioré */}
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                      <Package className="w-10 h-10 text-[#EAB615]" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-[#2D2926] mb-2">
                      Aucune commande pour le moment
                    </h3>
                    <p className="text-sm text-[#2D2926]/60 mb-6 max-w-md mx-auto">
                      Découvrez notre collection de bijoux artisanaux indiens et trouvez la pièce parfaite pour vous.
                    </p>
                    <Link
                      href="/fr/shop"
                      className="inline-flex items-center gap-2 bg-[#8B4E4E] text-white px-6 py-3 rounded-lg hover:bg-[#6B3D3D] transition-colors font-medium"
                    >
                      Découvrir la boutique
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Informations livraison */}
                  <div className="mt-8 pt-6 border-t border-[#EAB615]/20">
                    <h3 className="font-semibold text-[#2D2926] mb-4">Informations utiles</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-[#FAF9F7] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Truck className="w-4 h-4 text-[#EAB615]" />
                          <span className="text-sm font-medium text-[#2D2926]">Livraison</span>
                        </div>
                        <p className="text-xs text-[#2D2926]/60">
                          Gratuite dès 50 € d&apos;achat. Expédition sous 24-48h.
                        </p>
                      </div>
                      <div className="bg-[#FAF9F7] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-[#EAB615]" />
                          <span className="text-sm font-medium text-[#2D2926]">Suivi</span>
                        </div>
                        <p className="text-xs text-[#2D2926]/60">
                          Numéro de suivi envoyé par email dès l&apos;expédition.
                        </p>
                      </div>
                      <div className="bg-[#FAF9F7] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <RotateCcw className="w-4 h-4 text-[#EAB615]" />
                          <span className="text-sm font-medium text-[#2D2926]">Retours</span>
                        </div>
                        <p className="text-xs text-[#2D2926]/60">
                          Retours gratuits sous 30 jours. Remboursement rapide.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'cart' && (
              <div>
                <div className="p-6 bg-gradient-to-r from-[#FAF9F7] to-white border-b border-[#EAB615]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#2D2926]">
                        Mon panier
                        {cartItemCount > 0 && (
                          <span className="ml-2 text-base font-normal text-[#2D2926]/60">
                            ({cartItemCount} article{cartItemCount > 1 ? 's' : ''})
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-[#2D2926]/60 mt-1">Vos articles en attente de commande</p>
                    </div>
                    {cartItems.length > 0 && (
                      <button
                        onClick={() => setShowClearCartConfirm(true)}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Vider le panier
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-[#EAB615]" />
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#2D2926] mb-2">
                        Votre panier est vide
                      </h3>
                      <p className="text-sm text-[#2D2926]/60 mb-6 max-w-md mx-auto">
                        Ajoutez des bijoux à votre panier pour passer commande.
                      </p>
                      <Link
                        href="/fr/shop"
                        className="inline-flex items-center gap-2 bg-[#8B4E4E] text-white px-6 py-3 rounded-lg hover:bg-[#6B3D3D] transition-colors font-medium"
                      >
                        Découvrir la boutique
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      {/* Liste des articles */}
                      <div className="space-y-4 mb-6">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex gap-4 p-4 bg-[#FAF9F7] rounded-lg">
                            <Link href={`/fr/product/${item.product.slug}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={item.product.image || item.product.images?.[0] || '/placeholder.jpg'}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link href={`/fr/product/${item.product.slug}`} className="font-medium text-[#2D2926] hover:text-[#8B4E4E] transition-colors line-clamp-2">
                                {item.product.title || item.product.name}
                              </Link>
                              <p className="text-sm text-[#EAB615] font-semibold mt-1">
                                {item.product.price.toFixed(2)} €
                              </p>
                              <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center border border-[#EAB615]/30 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="p-1.5 hover:bg-[#EAB615]/10 transition-colors rounded-l-lg"
                                  >
                                    <Minus className="w-3 h-3 text-[#2D2926]" />
                                  </button>
                                  <span className="px-3 text-sm font-medium text-[#2D2926]">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="p-1.5 hover:bg-[#EAB615]/10 transition-colors rounded-r-lg"
                                  >
                                    <Plus className="w-3 h-3 text-[#2D2926]" />
                                  </button>
                                </div>
                                <button
                                  onClick={() => removeItem(item.product.id)}
                                  className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-[#2D2926]">
                                {(item.product.price * item.quantity).toFixed(2)} €
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Récapitulatif */}
                      <div className="border-t border-[#EAB615]/20 pt-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#2D2926]/70">Sous-total</span>
                          <span className="font-medium text-[#2D2926]">{cartTotal.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#2D2926]/70">Livraison</span>
                          <span className="font-medium text-[#2D2926]">
                            {cartTotal >= 50 ? (
                              <span className="text-green-600">Gratuite</span>
                            ) : (
                              'Calculée à la prochaine étape'
                            )}
                          </span>
                        </div>
                        {cartTotal < 50 && (
                          <p className="text-xs text-[#EAB615] mb-4">
                            Plus que {(50 - cartTotal).toFixed(2)} € pour la livraison gratuite !
                          </p>
                        )}
                        <div className="flex justify-between items-center pt-4 border-t border-[#EAB615]/20">
                          <span className="font-semibold text-[#2D2926]">Total</span>
                          <span className="text-xl font-bold text-[#EAB615]">{cartTotal.toFixed(2)} €</span>
                        </div>
                        <Link
                          href="/fr/checkout"
                          className="w-full mt-6 inline-flex items-center justify-center gap-2 bg-[#8B4E4E] text-white px-6 py-3 rounded-lg hover:bg-[#6B3D3D] transition-colors font-medium"
                        >
                          Passer commande
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div>
                <div className="p-6 bg-gradient-to-r from-[#FAF9F7] to-white border-b border-[#EAB615]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-serif text-xl font-bold text-[#2D2926]">
                        Mes favoris
                        {wishlistItems.length > 0 && (
                          <span className="ml-2 text-base font-normal text-[#2D2926]/60">
                            ({wishlistItems.length} article{wishlistItems.length > 1 ? 's' : ''})
                          </span>
                        )}
                      </h2>
                      <p className="text-sm text-[#2D2926]/60 mt-1">Les pièces que vous avez gardées pour plus tard</p>
                    </div>
                    {wishlistItems.length > 0 && (
                      <button
                        onClick={() => setShowClearWishlistConfirm(true)}
                        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Tout supprimer
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                        <Heart className="w-10 h-10 text-[#EAB615]" />
                      </div>
                      <h3 className="font-serif text-lg font-semibold text-[#2D2926] mb-2">
                        Votre liste de favoris est vide
                      </h3>
                      <p className="text-sm text-[#2D2926]/60 mb-6 max-w-md mx-auto">
                        Cliquez sur le coeur sur les produits que vous aimez pour les retrouver facilement ici.
                      </p>
                      <Link
                        href="/fr/shop"
                        className="inline-flex items-center gap-2 bg-[#8B4E4E] text-white px-6 py-3 rounded-lg hover:bg-[#6B3D3D] transition-colors font-medium"
                      >
                        Explorer la collection
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {wishlistItems.map((product) => {
                        const isInCart = cartItems.some(item => item.product.id === product.id);
                        return (
                          <div key={product.id} className="flex gap-4 p-4 bg-[#FAF9F7] rounded-lg">
                            <Link href={`/fr/product/${product.slug}`} className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                              <Image
                                src={product.image || product.images?.[0] || '/placeholder.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link href={`/fr/product/${product.slug}`} className="font-medium text-[#2D2926] hover:text-[#8B4E4E] transition-colors line-clamp-2">
                                {product.title || product.name}
                              </Link>
                              <p className="text-sm text-[#EAB615] font-semibold mt-1">
                                {product.price.toFixed(2)} €
                              </p>
                              <div className="flex items-center gap-2 mt-3">
                                <button
                                  onClick={() => addItem(product)}
                                  disabled={isInCart}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    isInCart
                                      ? 'bg-green-100 text-green-700 cursor-default'
                                      : 'bg-[#8B4E4E] text-white hover:bg-[#6B3D3D]'
                                  }`}
                                >
                                  {isInCart ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4" />
                                      Dans le panier
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-4 h-4" />
                                      Ajouter au panier
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer de confiance */}
        <div className="mt-12 pt-8 border-t border-[#EAB615]/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#8B4E4E]" />
              </div>
              <p className="text-sm font-medium text-[#2D2926]">Paiement sécurisé</p>
              <p className="text-xs text-[#2D2926]/60 mt-1">SSL 256 bits</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#8B4E4E]" />
              </div>
              <p className="text-sm font-medium text-[#2D2926]">CB, PayPal, Apple Pay</p>
              <p className="text-xs text-[#2D2926]/60 mt-1">Paiement flexible</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#8B4E4E]" />
              </div>
              <p className="text-sm font-medium text-[#2D2926]">Basé en France</p>
              <p className="text-xs text-[#2D2926]/60 mt-1">Service client français</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#FAF9F7] flex items-center justify-center">
                <Award className="w-6 h-6 text-[#8B4E4E]" />
              </div>
              <p className="text-sm font-medium text-[#2D2926]">Artisanat authentique</p>
              <p className="text-xs text-[#2D2926]/60 mt-1">Fait main en Inde</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
