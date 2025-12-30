'use client';

import { Link, useRouter, usePathname } from '@/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart, User, X, Search, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useAuth } from '@/lib/context/AuthContext';
import CartDrawer from '@/components/layout/CartDrawer';
import WishlistDrawer from '@/components/layout/WishlistDrawer';
import { useSearch } from '@/lib/hooks/useSearch';
import { getValidImageUrl } from '@/lib/utils/images';
import { NavigationMenu } from '@/components/Navigation';
import { supabase } from '@/lib/db/supabase';

// Function to highlight matching text in turquoise
const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <span 
          key={index} 
          className="text-[#8B4E4E] font-semibold"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function Navbar() {
  const pathname = usePathname();
  const locale = pathname.startsWith('/en') ? 'en' : 'fr';
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, results } = useSearch();
  const [dropdownLeft, setDropdownLeft] = useState(0);
  
  const cart = useCart();
  const wishlist = useWishlist();
  const { user, loading: authLoading, signOut } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [quickEmail, setQuickEmail] = useState('');
  const [quickPassword, setQuickPassword] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => { setMounted(true); }, []);
  const cartCount = cart?.getItemCount?.() || 0;
  const wishlistCount = wishlist?.getItemCount?.() || 0;

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    router.push(`/${locale}`);
  };

  const handleQuickLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email: quickEmail,
      password: quickPassword,
    });
    if (!error) {
      setQuickEmail('');
      setQuickPassword('');
      setShowUserMenu(false);
    }
  };

  // Handle hover and click for user menu
  const handleUserMenuEnter = () => {
    if (userMenuTimeoutRef.current) {
      clearTimeout(userMenuTimeoutRef.current);
    }
    setShowUserMenu(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeoutRef.current = setTimeout(() => {
      setShowUserMenu(false);
    }, 150);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (userMenuTimeoutRef.current) {
        clearTimeout(userMenuTimeoutRef.current);
      }
    };
  }, [showUserMenu]);

  // Calculate dropdown position based on search container
  useEffect(() => {
    if (searchContainerRef.current && isSearchOpen) {
      const rect = searchContainerRef.current.getBoundingClientRect();
      setDropdownLeft(rect.left);
    }
  }, [isSearchOpen]);

  // Auto-focus input when search opens (no text selection)
  useEffect(() => {
    if (isSearchOpen) {
      // Check ref inside function body, not in dependency array
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, [isSearchOpen]);

  // Close search dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Fermer si le click est en dehors de la search bar ET du dropdown
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsSearchOpen(false);
        setQuery(''); // Reset la recherche
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
        setQuery(''); // Reset la recherche
      }
    };
    
    // Ajouter les listeners seulement si le dropdown est ouvert
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    
    // Cleanup: enlever les listeners
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isSearchOpen, setQuery]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsSearchOpen(false);
      router.push(`/shop?q=${encodeURIComponent(query)}`);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setQuery('');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-[#F0C11D]/40 transition-all overflow-visible w-full">
        {/* Jali Pattern Border - Horizontal */}
        <div className="jali-border-horizontal" aria-hidden="true" />
        
        {/* Header Container - Compact & Élégant */}
        <div className="max-w-7xl mx-auto px-4 py-4 relative">
          {/* Logo & Actions */}
          <div className="flex items-center justify-between mb-3">
          
            {/* GAUCHE : Search */}
          <div className="flex items-center gap-3 w-1/3 justify-start relative" ref={searchRef}>
            <div 
              ref={searchContainerRef}
              className="relative group min-w-[220px]"
              onMouseEnter={() => {
                setIsSearchOpen(true);
                // Focus the input on hover (cursor ready, no text selection)
                if (searchInputRef.current) {
                  searchInputRef.current.focus();
                }
              }}
              onMouseLeave={() => {
                // Délai court pour permettre de bouger vers le dropdown
                setTimeout(() => {
                  if (!dropdownRef.current?.matches(':hover')) {
                    setIsSearchOpen(false);
                  }
                }, 100);
              }}
            >
              <div className="flex items-center gap-2 relative">
                <button 
                  className="p-2 text-[#2D2420] hover:text-[#F0C11D] transition-colors duration-200" 
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>
                
                {/* Search Input - Minimaliste */}
                <div className="flex items-center relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Rechercher..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      setIsSearchOpen(true);
                      // Just focus, no text selection
                    }}
                    className="bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0 text-sm text-[#2D2420] placeholder:text-[#2D2420]/50 w-32 transition-all duration-300"
                    style={{
                      paddingBottom: '2px',
                      paddingTop: '2px'
                    }}
                  />
                {query && isSearchOpen && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="ml-1 text-[#2D2420]/50 hover:text-[#2D2420] transition-colors"
                    aria-label="Effacer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                  {/* Underline dynamique en or */}
                  <span className="absolute -bottom-0.5 left-0 h-0.5 bg-[#F0C11D] transition-all duration-300 ease-out w-0 group-hover:w-full"></span>
                </div>
              </div>
              
              {/* Search Results Dropdown - Suggestions sans ascenseur */}
              {isSearchOpen && query.length >= 2 && (
                <div 
                  ref={dropdownRef}
                  className="fixed top-[72px] w-72 z-[9999] bg-[#FDFCFB] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)]"
                  style={{ left: `${dropdownLeft}px` }}
                >
                  {/* Suggestions produits - Max 5, pas d'ascenseur */}
                  {results.length > 0 ? (
                    <div className="p-2">
                      {results.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug || product.id}`}
                          className="flex items-center gap-3 p-2 hover:bg-[#FDF9F7] transition-colors"
                          onClick={() => {
                            setQuery('');
                            setIsSearchOpen(false);
                          }}
                        >
                          <div className="relative w-12 h-12 flex-shrink-0 bg-[#FDFCFB] overflow-hidden">
                            <Image
                              src={getValidImageUrl(product.image_url || product.image)}
                              alt={product.name || 'Bijou'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#2D2420] truncate">{product.name}</p>
                            <p className="text-sm font-bold text-[#F0C11D]">
                              {typeof product.price === 'number' 
                                ? product.price.toFixed(2) 
                                : product.price} €
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-[#2D2420]/60">
                      Aucun produit trouvé
                    </div>
                  )}
                  
                  {/* VOIR TOUS LES RÉSULTATS - Toujours visible */}
                  <div className="border-t border-[#F0C11D]/20 p-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
                        setQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-[#F0C11D] hover:text-[#8B4E4E] transition-colors"
                    >
                      Voir tous les résultats
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
              
              {/* No Results */}
              {isSearchOpen && query.length >= 2 && results.length === 0 && (
                <div 
                  ref={dropdownRef}
                  className="fixed top-[72px] w-96 z-[9999] p-8 text-center text-[#2D2420]/60 text-sm bg-[#FDFCFB] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)]"
                  style={{ left: `${dropdownLeft}px` }}
                >
                  Aucun résultat trouvé
                </div>
              )}
            </div>
          </div>

            {/* CENTRE : Logo Officiel - Positioned towards top */}
          <div className="w-1/3 flex justify-center flex-shrink-0">
            <Link href="/" className="flex-shrink-0 inline-block">
              <Image 
                src="/logo-khashika.png" 
                alt="Khashika - Luxury Indian Jewelry" 
                width={150}
                height={50}
                className="h-[50px] w-auto object-contain"
                priority
                quality={100}
                unoptimized
              />
            </Link>
          </div>

            {/* DROITE : User + Wishlist + Cart + Menu Mobile */}
          <div className="flex items-center gap-3 w-1/3 justify-end">
            {/* User Button / Login */}
            {!authLoading && (
              <div 
                className="relative" 
                ref={userMenuRef}
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="p-2 hover:text-[#F0C11D] transition-colors duration-200 flex items-center gap-2"
                      aria-label="Mon compte"
                    >
                      <User className="w-5 h-5" strokeWidth={1.5} />
                      <span className="hidden sm:inline text-sm font-serif">
                        {user.email?.split('@')[0] || 'Mon compte'}
                      </span>
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-[#FDFCFB] border border-[#F0C11D]/40 rounded-none shadow-[0_4px_12px_rgba(240,193,29,0.15)] z-50 overflow-hidden">
                        <div className="p-2">
                          <Link
                            href={`/${locale}/account`}
                            className="block px-3 py-2 text-sm text-[#2D2420] hover:text-[#F0C11D] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Mon compte
                          </Link>
                          <Link
                            href={`/${locale}/account?section=orders`}
                            className="block px-3 py-2 text-sm text-[#2D2420] hover:text-[#F0C11D] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Mes commandes
                          </Link>
                          <Link
                            href={`/${locale}/account?section=wishlist`}
                            className="block px-3 py-2 text-sm text-[#2D2420] hover:text-[#F0C11D] transition-colors"
                            onClick={() => setShowUserMenu(false)}
                          >
                            Mes favoris
                          </Link>
                          <div className="p-2 border-t border-[#F0C11D]/20 mt-2">
                            <button
                              onClick={handleSignOut}
                              className="w-full px-3 py-2 text-sm text-[#8B4E4E] hover:bg-[#8B4E4E] hover:text-white transition-colors rounded-none"
                            >
                              Déconnexion
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={`/${locale}/login`}
                    className="p-2 hover:text-[#F0C11D] transition-colors duration-200"
                    aria-label="Connexion"
                  >
                    <User className="w-5 h-5" strokeWidth={1.5} />
                  </Link>
                )}
              </div>
            )}

            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#2D2420] hover:text-[#F0C11D] transition-colors duration-200"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6" strokeWidth={1.5} />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] flex items-center justify-center bg-[#F0C11D] text-white text-[13px] font-bold rounded-full leading-none shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#2D2420] hover:text-[#F0C11D] transition-colors duration-200"
              aria-label="Panier"
            >
              <ShoppingBag className="w-6 h-6" strokeWidth={1.5} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] flex items-center justify-center bg-[#F0C11D] text-white text-[13px] font-bold rounded-full leading-none shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button - NavigationMenu handles the mobile drawer */}
            <div className="lg:hidden">
              <NavigationMenu />
            </div>
          </div>
          </div>
          
          {/* Navigation - Type-First Menu (Desktop) */}
          <div className="hidden lg:block pb-1">
            <NavigationMenu />
          </div>
        </div>
      </header>

      {/* Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer 
        isOpen={isWishlistOpen} 
        onClose={() => setIsWishlistOpen(false)} 
        onOpenCart={() => setIsCartOpen(true)}
      />
    </>
  );
}