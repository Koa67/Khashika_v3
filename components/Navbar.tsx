'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, User, Menu, X } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import SearchBar from '@/components/ui/SearchBar';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getItemCount: getCartCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FDFBF7] transition-all duration-300 pattern-mughal-bottom pb-4">
      
      {/* ÉTAGE 1 : HEADER PRINCIPAL (LOGO + ICONES) */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between relative">
        
        {/* GAUCHE : RECHERCHE (Desktop) */}
        <div className="hidden lg:flex items-center gap-4 w-1/3">
          <SearchBar />
        </div>

        {/* CENTRE : LOGO (ABSOLUMENT CENTRÉ) */}
        <div className="flex-1 flex justify-center w-1/3">
          <Link href="/" className="flex flex-col items-center">
            <h1 className="font-serif text-4xl text-[#2596be] tracking-wider">Khashika</h1>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mt-1">Bijoux de Luxe Artisanaux</span>
          </Link>
        </div>

        {/* DROITE : ACTIONS (Panier/User) */}
        <div className="flex items-center justify-end gap-6 w-1/3">
          <Link href="/account" className="hidden lg:block hover:text-[#2596be] transition-colors">
            <User className="w-6 h-6" strokeWidth={1.5} />
          </Link>
          <button className="hover:text-[#2596be] transition-colors relative">
            <Heart className="w-6 h-6" strokeWidth={1.5} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2596be] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>
          <Link href="/checkout" className="hover:text-[#2596be] transition-colors relative">
            <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#2596be] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          {/* MOBILE MENU TOGGLE */}
          <button className="lg:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ÉTAGE 2 : NAVIGATION (LINKS CENTRÉS) - DESKTOP ONLY */}
      <div className="hidden lg:flex justify-center items-center py-2 gap-8 text-sm font-medium tracking-widest text-[#1a1a1a]">
        <Link href="/shop" className="hover:text-[#D4AF37] transition-colors">CRÉATIONS</Link>
        <Link href="/shop?cat=pierres" className="hover:text-[#D4AF37] transition-colors">UNIVERS DES PIERRES</Link>
        <Link href="/shop?cat=accessoires" className="hover:text-[#D4AF37] transition-colors">ACCESSOIRES</Link>
        <Link href="/cadeaux" className="hover:text-[#D4AF37] transition-colors">CADEAUX</Link>
        <Link href="/story" className="hover:text-[#D4AF37] transition-colors">L&apos;ESPRIT KHASHIKA</Link>
      </div>

      {/* MENU MOBILE (DRAWER) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-[#FDFBF7] border-t border-[#D4AF37] p-4 flex flex-col gap-4 shadow-lg">
          <Link href="/shop" className="text-lg" onClick={() => setIsMobileMenuOpen(false)}>Créations</Link>
          <Link href="/shop?cat=pierres" className="text-lg" onClick={() => setIsMobileMenuOpen(false)}>Pierres</Link>
          <Link href="/shop?cat=accessoires" className="text-lg" onClick={() => setIsMobileMenuOpen(false)}>Accessoires</Link>
          <Link href="/cadeaux" className="text-lg" onClick={() => setIsMobileMenuOpen(false)}>Cadeaux</Link>
          <Link href="/story" className="text-lg" onClick={() => setIsMobileMenuOpen(false)}>L&apos;Esprit Khashika</Link>
        </div>
      )}
    </header>
  );
}
