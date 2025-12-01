'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X, User, Heart } from 'lucide-react';
import CartDrawer from './CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import SearchBar from './ui/SearchBar';

// Structure complète du menu - Modèle "Minimaliste Luxe" (Option 3)
const MENU_STRUCTURE = [
  {
    label: 'CRÉATIONS',
    href: '/shop',
    // Mega Menu divisé en sections visuelles
    sections: [
      {
        title: 'CATÉGORIES',
        links: [
          { label: 'Bagues', href: '/shop?category=Bagues' },
          { label: 'Boucles d\'oreilles', href: '/shop?category=Boucles' },
          { label: 'Colliers & Pendentifs', href: '/shop?category=Colliers' },
          { label: 'Bracelets', href: '/shop?category=Bracelets' },
          { label: 'Chaînes de cheville', href: '/shop?category=Chaines' }
        ]
      },
      {
        title: 'MATÉRIAUX',
        links: [
          { label: 'Argent Massif', href: '/shop?category=Argent' },
          { label: 'Pierres Naturelles', href: '/shop?category=Pierre' },
          { label: 'Collection Ethnique', href: '/shop?category=Fantaisie' }
        ]
      }
    ]
  },
  {
    label: 'UNIVERS DES PIERRES',
    href: '/shop?category=Pierre',
    // Mega Menu Liste A-Z (sélection des plus populaires)
    sections: [
      {
        title: 'LES INCONTOURNABLES',
        links: [
          { label: 'Turquoise', href: '/shop?q=Turquoise' },
          { label: 'Labradorite', href: '/shop?q=Labradorite' },
          { label: 'Pierre de Lune', href: '/shop?q=Pierre de lune' },
          { label: 'Améthyste', href: '/shop?q=Améthyste' },
          { label: 'Onyx', href: '/shop?q=Onyx' },
          { label: 'Lapis Lazuli', href: '/shop?q=Lapis' }
        ]
      },
      {
        title: 'DÉCOUVERTE',
        links: [
          { label: 'Toutes les pierres', href: '/shop?category=Pierre' },
          { label: 'Guide des vertus', href: '/story' } // Lien temporaire vers story
        ]
      }
    ]
  },
  {
    label: 'ACCESSOIRES',
    href: '/shop?category=Accessoires',
    sections: [
      {
        title: 'TEXTILE',
        links: [
          { label: 'Pashminas Cachemire', href: '/shop?q=Pashmina' },
          { label: 'Foulards Soie', href: '/shop?q=Soie' },
          { label: 'Étoles', href: '/shop?q=Etole' }
        ]
      },
      {
        title: 'MAROQUINERIE',
        links: [
          { label: 'Sacs Brodés', href: '/shop?q=Sac' },
          { label: 'Pochettes', href: '/shop?q=Pochette' }
        ]
      }
    ]
  },
  {
    label: 'CADEAUX', // Nouvelle section stratégique
    href: '/shop',
    sections: [
      {
        title: 'PAR BUDGET',
        links: [
          { label: 'Petits Plaisirs', href: '/shop?sort=price_asc' }, // Tri par prix bas
          { label: 'Pièces d\'Exception', href: '/shop?sort=price_desc' }
        ]
      }
    ]
  },
  {
    label: 'L\'ESPRIT KHASHIKA',
    href: '/story',
    sections: [
      {
        title: 'LA MAISON',
        links: [
          { label: 'Notre Histoire', href: '/story' },
          { label: 'L\'Inde & la Culture', href: '/story#culture' },
          { label: 'Contact', href: '/contact' }
        ]
      }
    ]
  }
];

export default function Navbar() {
  const { getItemCount } = useCart();
  const { getItemCount: getWishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const totalItems = getItemCount();
  const wishlistCount = getWishlistCount();

  return (
    <>
     {/* NAV PRINCIPALE - FIXE ET PLEINE LARGEUR - REACTIVE AU THEME - LAYOUT SYMÉTRIQUE */}
<nav className="fixed top-0 left-0 w-full z-[999] bg-background shadow-sm bg-pattern-braid-gold">
  <div className="w-full px-8 pt-4 pb-2 flex flex-col gap-y-6">
    {/* ÉTAGE 1 (TOP) : Symétrie [Login + Search] | [Logo] | [Wishlist + Panier] */}
    <div className="relative w-full flex items-center justify-between">
      {/* GAUCHE : Burger Mobile */}
      <div className="flex items-center lg:hidden">
        <button 
          onClick={() => setIsMobileMenuOpen(true)} 
          className="text-foreground hover:text-primary transition-colors"
          aria-label="Menu mobile"
        >
          <Menu size={24} strokeWidth={1.5} className="w-6 h-6" />
        </button>
      </div>

      {/* GROUPE GAUCHE (Desktop) : User + SearchBar */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Icône User */}
        <Link
          href="/login"
          className="text-foreground hover:text-primary transition-colors p-1"
          aria-label="Connexion / Compte"
        >
          <User size={24} strokeWidth={1.5} className="w-6 h-6" />
        </Link>
        {/* Barre de Recherche Minimaliste */}
        <SearchBar />
      </div>

      {/* CENTRE : LOGO KHASHIKA */}
      <div className="absolute left-1/2 -translate-x-1/2 z-[1001]">
        <Link 
          href="/" 
          className="block relative z-[1001]"
        >
          <Image
            src="/logo-khashika.png"
            alt="Khashika - Joaillerie Indienne"
            width={200}
            height={80}
            className="h-20 w-auto object-contain relative z-[1001]"
            priority
          />
        </Link>
      </div>

      {/* GROUPE DROITE : Wishlist + Panier */}
      <div className="flex items-center gap-4">
        {/* Icône Wishlist */}
        <button
          onClick={() => setIsWishlistOpen(true)}
          className="text-foreground hover:text-primary transition-colors relative p-1"
          aria-label={`Favoris (${wishlistCount} articles)`}
        >
          <Heart size={24} strokeWidth={1.5} className="w-6 h-6" />
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Panier */}
        <button 
          onClick={() => setIsCartOpen(true)} 
          className="text-foreground hover:text-primary transition-colors relative p-1"
          aria-label={`Panier (${totalItems} articles)`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-6 h-6" 
            aria-hidden="true"
          >
            <path d="M16 10a4 4 0 0 1-8 0"></path>
            <path d="M3.103 6.034h17.794"></path>
            <path d="M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"></path>
          </svg>

          {/* Badge de quantité */}
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white text-xs font-bold h-5 w-5 flex items-center justify-center rounded-full">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </div>

    {/* ÉTAGE 2 (BOTTOM) : Mega Menu Centré */}
    <div className="w-full max-w-[1440px] mx-auto mt-6 h-12">
      {/* Mega Menu Desktop */}
      <nav className="hidden lg:flex justify-center items-end h-full pb-0">
        <ul className="flex items-end gap-8">
          {MENU_STRUCTURE.map((item) => (
            <li key={item.label} className="group relative">
              <Link 
                href={item.href} 
                className="text-xs font-bold tracking-[0.2em] text-foreground hover:text-primary transition-colors uppercase"
              >
                {item.label}
              </Link>
              {/* Mega Menu Dropdown - Colonnes avec sections */}
              {item.sections && item.sections.length > 0 && (
                <div 
                  className="absolute top-full left-1/2 -translate-x-1/2 bg-[#F4EAD8] dark:bg-[#121A21] shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 mt-[10px] border-2 border-[#D4AF37] rounded-xl overflow-hidden w-max min-w-[200px] max-w-[90vw]"
                >
                  <div className="flex gap-6 p-5 bg-[#F4EAD8] dark:bg-[#121A21] flex-wrap">
                    {item.sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="flex flex-col">
                        {/* Titre de colonne */}
                        <h3 className="font-serif text-sm font-bold text-[#2596be] border-b border-[#D4AF37]/50 pb-2 mb-4 uppercase tracking-widest whitespace-nowrap">
                          {section.title}
                        </h3>
                        {/* Liste des liens */}
                        <div className="flex flex-col gap-2">
                          {section.links.map((link) => (
                            <Link 
                              key={link.href} 
                              href={link.href} 
                              className="text-sm text-card-foreground hover:text-primary font-sans transition-colors"
                            >
                              {link.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: Barre de recherche pleine largeur */}
      <div className="lg:hidden flex-1 max-w-full mt-4">
        <SearchBar />
      </div>
    </div>
  </div>
</nav>

      {/* Spacer pour compenser la nav fixe - Hauteur ajustée pour nouveau layout */}
      <div className="h-[140px] lg:h-[120px] w-full" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-40 bg-card z-50 overflow-y-auto">
          <div className="px-6 py-8 flex flex-col gap-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-serif text-2xl text-card-foreground">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-card-foreground hover:text-primary transition-colors"
                aria-label="Fermer le menu"
              >
                <X size={24} strokeWidth={1.5} className="w-6 h-6" />
              </button>
            </div>
            {MENU_STRUCTURE.map((item) => (
              <div key={item.label}>
                <Link 
                  href={item.href}
                  className="block text-xs font-bold tracking-[0.2em] text-card-foreground mb-3 hover:text-primary transition-colors uppercase"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
                {item.sections && item.sections.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="pl-4 mb-4">
                    <h3 className="text-xs font-bold text-[#D4AF37] mb-2 uppercase tracking-widest">
                      {section.title}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {section.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block text-sm text-card-foreground/70 hover:text-primary py-1 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Composants Overlay */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}
