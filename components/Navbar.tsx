'use client';

import { Link, useRouter } from '@/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart, User, X, Search } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { useWishlist } from '@/lib/context/WishlistContext';
import CartDrawer from '@/components/layout/CartDrawer';
import WishlistDrawer from '@/components/layout/WishlistDrawer';
import { useSearch } from '@/lib/hooks/useSearch';
import { getValidImageUrl } from '@/lib/utils/images';
import { NavigationMenu } from '@/components/Navigation';

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
          className="text-[#2596be] font-semibold"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function Navbar() {
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
  
  const cartCount = cart?.getItemCount?.() || 0;
  const wishlistCount = wishlist?.getItemCount?.() || 0;

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
      <header className="sticky top-0 z-50 bg-[#FDFBF7] transition-all shadow-sm overflow-visible w-full">
        {/* Jali Pattern Border - Horizontal */}
        <div className="jali-border-horizontal" aria-hidden="true" />
        
        {/* Header Container - Compact & Élégant */}
        <div className="container mx-auto px-4 py-4 relative">
          {/* Logo & Actions */}
          <div className="flex items-center justify-between mb-3">
          
          {/* GAUCHE : User + Search */}
          <div className="flex items-center gap-3 w-1/3 justify-start relative" ref={searchRef}>
            <Link href="/account" className="p-2 hover:text-[#2596be] transition-colors" aria-label="Account">
              <User className="w-5 h-5" strokeWidth={1.5} />
            </Link>
            <div 
              ref={searchContainerRef}
              className="relative group min-w-[220px] px-4"
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
              <div 
                className="flex items-center gap-2 w-[165px] border-b border-transparent transition-colors duration-300"
                style={{
                  borderBottomColor: isSearchOpen ? '#000' : 'transparent'
                }}
              >
                <button 
                  className="p-2 hover:text-[#2596be] transition-colors" 
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" strokeWidth={1.5} />
                </button>
                
                {/* Search Input - Minimaliste */}
                <div className="flex items-center relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder=""
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => {
                      setIsSearchOpen(true);
                      // Just focus, no text selection
                    }}
                    className={`bg-transparent border-none outline-none focus:outline-none ring-0 focus:ring-0 text-sm text-[#1a1a1a] transition-all duration-300 ${
                      isSearchOpen ? 'w-48 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                    }`}
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
                    className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Effacer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                </div>
              </div>
              
              {/* Search Results Dropdown */}
              {isSearchOpen && query.length >= 2 && results.length > 0 && (
                <div 
                  ref={dropdownRef}
                  className="golden-glow-dropdown fixed top-[72px] w-96 z-[9999]"
                  style={{ left: `${dropdownLeft}px` }}
                >
                  <div className="max-h-96 overflow-y-auto">
                    <ul>
                      {results.map((product) => (
                        <li key={product.id} className="border-b border-gray-50 last:border-0">
                          <Link
                            href={`/product/${product.slug || product.id}`}
                            className="golden-glow-dropdown-item flex items-center gap-4"
                            onClick={() => {
                              setQuery('');
                              setIsSearchOpen(false);
                            }}
                          >
                            {/* Image */}
                            <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={getValidImageUrl(product.image_url || product.image)}
                                alt={product.name || 'Bijou'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            {/* Name and Price */}
                            <div className="flex-1 min-w-0">
                              <p className="font-serif text-sm text-[#1a1a1a] line-clamp-1 mb-1">
                                {highlightMatch(product.name, query)}
                              </p>
                              <p className="text-xs font-bold text-[#D4AF37]">
                                {typeof product.price === 'number' 
                                  ? product.price.toFixed(2) 
                                  : product.price} €
                              </p>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    
                    {/* View All Results Link */}
                    <div className="p-3 text-center bg-gray-50 border-t border-gray-100">
                      <Link
                        href={`/shop?q=${encodeURIComponent(query)}`}
                        className="text-sm font-bold text-[#2596be] uppercase tracking-wider hover:underline"
                        onClick={() => {
                          setQuery('');
                          setIsSearchOpen(false);
                        }}
                      >
                        Voir tous les résultats
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* No Results */}
              {isSearchOpen && query.length >= 2 && results.length === 0 && (
                <div 
                  ref={dropdownRef}
                  className="golden-glow-dropdown fixed top-[72px] w-96 z-[9999] p-8 text-center text-gray-500 text-sm"
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
              />
            </Link>
          </div>

          {/* DROITE : Wishlist + Cart + Menu Mobile */}
          <div className="flex items-center gap-3 w-1/3 justify-end">
            {/* Wishlist Button */}
            <button 
              onClick={() => setIsWishlistOpen(true)}
              className="p-2 hover:text-[#2596be] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" strokeWidth={1.5} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2596be] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:text-[#2596be] transition-colors relative"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#2596be] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold text-[10px]">
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
      <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
    </>
  );
}