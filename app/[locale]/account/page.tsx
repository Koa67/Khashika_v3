'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Package, Heart, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/boutique/ProductCard';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const { items: wishlistItems } = useWishlist();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('profile');

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

  if (loading) return (
    <div className="min-h-screen bg-white mt-16 pt-8 pb-12 flex items-center justify-center">
      <div className="text-[#2D2420]">Chargement...</div>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-white mt-16 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold text-[#2D2420] mb-8">Mon compte</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar navigation */}
          <nav className="bg-[#FAF9F7] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)] p-4 space-y-1">
            <button 
              onClick={() => setActiveSection('profile')} 
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[#2D2420] hover:bg-white rounded-none transition-colors ${
                activeSection === 'profile' 
                  ? 'bg-white border-l-4 border-[#F0C11D]' 
                  : ''
              }`}
            >
              <User className="w-5 h-5" />
              <span>Informations personnelles</span>
            </button>
            <button 
              onClick={() => setActiveSection('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[#2D2420] hover:bg-white rounded-none transition-colors ${
                activeSection === 'orders' 
                  ? 'bg-white border-l-4 border-[#F0C11D]' 
                  : ''
              }`}
            >
              <Package className="w-5 h-5" />
              <span>Mes commandes</span>
            </button>
            <button 
              onClick={() => setActiveSection('wishlist')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[#2D2420] hover:bg-white rounded-none transition-colors ${
                activeSection === 'wishlist' 
                  ? 'bg-white border-l-4 border-[#F0C11D]' 
                  : ''
              }`}
            >
              <Heart className="w-5 h-5" />
              <span>Mes favoris</span>
              {wishlistItems.length > 0 && (
                <span className="ml-auto bg-[#F0C11D] text-white text-xs px-2 py-0.5 rounded-full">
                  {wishlistItems.length}
                </span>
              )}
            </button>
            <button 
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-[#8B4E4E] hover:bg-[#8B4E4E] hover:text-white rounded-none transition-colors mt-4 border-t border-[#F0C11D]/20 pt-4"
            >
              <LogOut className="w-5 h-5" />
              <span>Déconnexion</span>
            </button>
          </nav>

          {/* Contenu principal */}
          <div className="bg-[#FAF9F7] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)] p-6">
            {activeSection === 'profile' && (
              <div>
                <h2 className="font-serif text-xl font-bold mb-6">Informations personnelles</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-[#2D2420]/60 mb-1">Email</label>
                    <p className="text-[#2D2420]">{user.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-[#2D2420]/60 mb-1">Membre depuis</label>
                    <p className="text-[#2D2420]">
                      {new Date(user.created_at || Date.now()).toLocaleDateString('fr-FR', { 
                        year: 'numeric', month: 'long', day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'orders' && (
              <div>
                <h2 className="font-serif text-xl font-bold mb-6">Mes commandes</h2>
                <p className="text-[#2D2420]/60">Aucune commande pour le moment.</p>
                <Link href="/fr/shop" className="inline-block mt-4 text-[#8B4E4E] hover:underline">
                  Découvrir nos collections →
                </Link>
              </div>
            )}

            {activeSection === 'wishlist' && (
              <div>
                <h2 className="font-serif text-xl font-bold mb-6">Mes favoris ({wishlistItems.length})</h2>
                {wishlistItems.length === 0 ? (
                  <div>
                    <p className="text-[#2D2420]/60">Aucun favori pour le moment.</p>
                    <Link href="/fr/shop" className="inline-block mt-4 text-[#8B4E4E] hover:underline">
                      Découvrir nos collections →
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {wishlistItems.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
