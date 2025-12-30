'use client';

import { useRef, useEffect } from 'react';
import { Link } from '@/navigation';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useSearch } from '@/lib/hooks/useSearch';

// Helper image (même que ProductCard)
const getValidImageUrl = (path: string | undefined | null) => {
  if (!path || path.includes('Manquante') || path === 'undefined') return '/placeholder-image.svg';
  if (path.startsWith('http')) return path;
  
  // Si c'est un chemin brut _raw_assets, on garde juste le nom du fichier
  if (path.includes('_raw_assets')) {
    const filename = path.split('/').pop();
    return `/images/products/${filename}`;
  }
  
  // Si c'est déjà un chemin propre
  return path.startsWith('/') ? path : `/images/products/${path}`;
};

export default function SearchBar() {
  const { query, setQuery, results } = useSearch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // Ne pas fermer si on a des résultats, juste laisser l'utilisateur cliquer
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = () => {
    setQuery(''); // Fermer le dropdown après clic
  };

  return (
    <div className="relative z-50">
      {/* Input minimaliste invisible */}
      <div className="flex items-center border-b-2 border-transparent hover:border-[#2D2420] transition-colors duration-300">
        <Search size={18} strokeWidth={1.5} className="text-foreground/60 mr-2" />
        <input 
          ref={inputRef}
          type="text"
          placeholder=""
          className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 text-foreground placeholder-transparent font-sans transition-all rounded-none pb-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="ml-2 text-foreground/60 hover:text-foreground transition-colors"
            aria-label="Effacer"
            type="button"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Dropdown Résultats - Ne s'affiche QUE si results.length > 0 */}
      {results.length > 0 && query.length >= 2 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-[#121A21] rounded-lg shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden z-[9999]"
        >
          <ul>
            {results.map((product) => (
              <li key={product.id} className="border-b border-gray-50 last:border-0">
                <Link 
                  href={`/product/${product.slug || product.id}`}
                  className="flex items-center gap-4 py-4 px-3 hover:bg-gray-100 transition-colors duration-200"
                  onClick={handleResultClick}
                >
                  {/* Image */}
                  <div className="relative w-12 h-12 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                    <Image 
                      src={getValidImageUrl(product.image_url || product.image)} 
                      alt={product.name || 'Bijou'} 
                      fill 
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  
                  {/* Nom et Prix */}
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg text-[#2D2420] line-clamp-1 mb-1">
                      {product.name}
                    </p>
                    <p className="text-base font-bold text-[#F0C11D]">
                      {typeof product.price === 'number' 
                        ? product.price.toFixed(2) 
                        : product.price} €
                    </p>
                  </div>
                </Link>
              </li>
            ))}
            
            {/* Lien "Voir tous les résultats" */}
            <li className="p-3 text-center bg-white border-t border-gray-100">
              <Link 
                href={`/shop?q=${encodeURIComponent(query)}`} 
                className="text-base font-bold text-[#8B4E4E] uppercase tracking-wider hover:underline"
                onClick={handleResultClick}
              >
                Voir tous les résultats
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}


