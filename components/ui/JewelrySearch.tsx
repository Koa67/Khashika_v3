'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useSearch';
import { Product } from '@/lib/types';
import Fuse from 'fuse.js';

// Fonction pour valider et nettoyer les URLs d'images
const getValidImageUrl = (url: string | undefined | null): string => {
  if (!url || url === '' || url === 'Image Manquante' || url.trim() === '') {
    return '/placeholder-image.svg';
  }
  
  // Gérer les chemins _raw_assets
  if (url.includes('_raw_assets')) {
    const filename = url.split('/').pop()?.replace(/%20/g, '_');
    return filename ? `/images/products/${filename}` : '/placeholder-image.svg';
  }
  
  // Gérer les URLs externes (http/https)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return '/placeholder-image.svg';
  }
  
  // Gérer les chemins relatifs
  return url.startsWith('/') ? url : `/images/products/${url}`;
};

export default function JewelrySearch() {
  const router = useRouter();
  const { query, setQuery, results, suggestions, isLoading, fuseInstance } = useSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Navigation clavier avec FIX CRASH "ENTRÉE"
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const maxIndex = results.length - 1;
      setSelectedIndex((prev) => (prev < maxIndex ? prev + 1 : prev));
      setIsOpen(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleProductClick(results[selectedIndex]);
        } else if (query.trim()) {
          // Utiliser window.location pour éviter les problèmes de navigation Next.js
          setIsOpen(false);
          window.location.href = `/shop?q=${encodeURIComponent(query)}`;
        }
      } catch (error) {
        console.error('Error handling Enter key:', error);
        // Fallback: rediriger vers la page de recherche avec window.location
        if (query.trim()) {
          try {
            setIsOpen(false);
            window.location.href = `/shop?q=${encodeURIComponent(query)}`;
          } catch (e) {
            console.error('Window location also failed:', e);
            // Dernier recours: router.push
            try {
              router.push(`/shop?q=${encodeURIComponent(query)}`);
            } catch (routerError) {
              console.error('All navigation methods failed:', routerError);
            }
          }
        }
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  };

  const handleProductClick = (product: Product) => {
    try {
      setIsOpen(false);
      setQuery('');
      // Utiliser window.location pour éviter les problèmes de navigation Next.js
      // CORRECTION : /product/ au singulier (pas /products/)
      window.location.href = `/product/${product.slug}`;
    } catch (error) {
      console.error('Error navigating to product:', error);
      // Fallback: utiliser router si window.location échoue
      try {
        router.push(`/product/${product.slug}`);
      } catch (e) {
        console.error('Router push also failed:', e);
      }
    }
  };

  const handleSuggestionClick = (category: string) => {
    try {
      setIsOpen(false);
      setQuery('');
      // Utiliser window.location pour éviter les problèmes de navigation Next.js
      window.location.href = `/shop?category=${encodeURIComponent(category)}`;
    } catch (error) {
      console.error('Error navigating to category:', error);
      // Fallback: utiliser router si window.location échoue
      try {
        router.push(`/shop?category=${encodeURIComponent(category)}`);
      } catch (e) {
        console.error('Router push also failed:', e);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(value.length >= 2);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };


  // Fonction pour highlight le texte qui matche
  const highlightMatch = (text: string, query: string, product: Product): React.ReactNode => {
    if (!query || !fuseInstance) {
      // Fallback simple : mettre en gras les mots qui matchent
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      if (lowerText.includes(lowerQuery)) {
        const index = lowerText.indexOf(lowerQuery);
        return (
          <>
            {text.substring(0, index)}
            <strong className="font-bold text-[#2596be]">
              {text.substring(index, index + query.length)}
            </strong>
            {text.substring(index + query.length)}
          </>
        );
      }
      return text;
    }
    
    // Utiliser Fuse pour obtenir les matches pour ce produit spécifique
    const searchResult = fuseInstance.search(query, { limit: 10 });
    const productMatch = searchResult.find((r) => r.item.id === product.id);
    
    if (!productMatch || !productMatch.matches || productMatch.matches.length === 0) {
      // Fallback simple
      const lowerText = text.toLowerCase();
      const lowerQuery = query.toLowerCase();
      if (lowerText.includes(lowerQuery)) {
        const index = lowerText.indexOf(lowerQuery);
        return (
          <>
            {text.substring(0, index)}
            <strong className="font-bold text-[#2596be]">
              {text.substring(index, index + query.length)}
            </strong>
            {text.substring(index + query.length)}
          </>
        );
      }
      return text;
    }

    // Trouver le match pour le nom ou la catégorie
    const textMatch = productMatch.matches.find((m) => 
      (m.key === 'name' || m.key === 'category') && m.value === text
    );
    
    if (!textMatch || !textMatch.indices || textMatch.indices.length === 0) {
      return text;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    textMatch.indices.forEach(([start, end], idx) => {
      // Ajouter le texte avant le match
      if (start > lastIndex) {
        parts.push(text.substring(lastIndex, start));
      }
      // Ajouter le texte matché en gras
      parts.push(
        <strong key={`${start}-${idx}`} className="font-bold text-[#2596be]">
          {text.substring(start, end + 1)}
        </strong>
      );
      lastIndex = end + 1;
    });

    // Ajouter le reste du texte
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? <>{parts}</> : text;
  };

  const hasResults = results.length > 0;
  const showDropdown = isOpen && (hasResults || isLoading);

  return (
    <>
      {/* Backdrop sombre quand la recherche est active */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Container de recherche - Largeur agrandie pour afficher le placeholder complet */}
      <div ref={containerRef} className="relative w-full min-w-[350px] lg:w-96 lg:min-w-[384px] z-50">
        {/* Input (L'Écrin) - UPGRADE UI */}
        <div className="relative">
          <Search 
            size={20}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" 
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Je cherche une bague, un collier..."
            className="w-full pl-12 pr-10 py-2 bg-white/50 dark:bg-white/10 border border-gray-200 dark:border-gray-700 rounded-full focus:ring-2 focus:ring-[#2596be] dark:focus:ring-[#2596be] focus:border-[#2596be] transition-all shadow-inner outline-none text-sm font-medium text-foreground placeholder:text-sm placeholder:font-normal placeholder:text-gray-500 dark:placeholder:text-gray-400 leading-[21px]"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Effacer la recherche"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Dropdown (Le Trésor) */}
        {showDropdown && (
          <div className="absolute top-full left-0 w-full mt-2 bg-card dark:bg-card rounded-xl shadow-2xl border border-border overflow-hidden z-50">
            {isLoading ? (
              <div className="p-4 text-center text-foreground/70 text-base">
                Chargement...
              </div>
            ) : hasResults ? (
              <>
                {/* Section Produits - UPGRADE UI */}
                {results.length > 0 && (
                  <div className="max-h-96 overflow-y-auto">
                    {results.map((product, index) => {
                      const rawImagePath = product.image || product.image_url || product.images?.[0];
                      const imageUrl = getValidImageUrl(rawImagePath);
                      
                      // DEBUGGING DES CHEMINS
                      if (process.env.NODE_ENV === 'development') {
                        console.log('Search Image Path:', {
                          productId: product.id,
                          productName: product.name,
                          rawPath: rawImagePath,
                          validUrl: imageUrl
                        });
                      }
                      
                      return (
                        <button
                          key={product.id}
                          onClick={() => handleProductClick(product)}
                          className={`w-full flex items-center gap-4 p-4 hover:bg-background/50 dark:hover:bg-background/30 cursor-pointer transition-colors text-left ${
                            selectedIndex === index ? 'bg-background/50 dark:bg-background/30' : ''
                          }`}
                        >
                          {/* Image - MODE SAFE : <img> standard au lieu de <Image /> Next.js */}
                          <div className="relative w-16 h-16 rounded-md border border-border overflow-hidden flex-shrink-0 bg-card">
                            <img
                              src={imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-image.svg';
                              }}
                            />
                          </div>

                          {/* Infos - TYPOGRAPHIE AUGMENTÉE */}
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-base text-foreground truncate">
                              {highlightMatch(product.name, query, product)}
                            </p>
                            <p className="text-sm font-bold text-[#D4AF37] mt-1">
                              {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}€
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Message si aucun résultat */}
                {results.length === 0 && (
                  <div className="p-4 text-center text-foreground/70 text-base">
                    Aucun résultat pour &quot;{query}&quot;
                  </div>
                )}
              </>
            ) : (
              <div className="p-4 text-center text-foreground/70 text-base">
                Tapez au moins 2 caractères pour rechercher
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
