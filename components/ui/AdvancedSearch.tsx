'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getValidImageUrl } from '@/lib/utils/images';

/**
 * UI RECHERCHE AVANCÉE
 * - Input avec Debounce (attendre 300ms avant de chercher)
 * - Dropdown de résultats instantanés avec image + prix
 * - "Voir tous les résultats" redirige vers `/shop?q=...`
 */

const DEBOUNCE_DELAY = 300;

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  category?: string;
}

export default function AdvancedSearch() {
  const t = useTranslations('search');
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce de la recherche
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.results || []);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (slug: string) => {
    router.push(`/product/${slug}`);
    setQuery('');
    setIsOpen(false);
  };

  const handleViewAll = () => {
    router.push(`/shop?q=${encodeURIComponent(query)}`);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          placeholder={t('placeholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B4E4E] focus:border-transparent"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          </div>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto z-50"
        >
          {results.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-100">
                {results.map((result) => (
                  <li key={result.id}>
                    <button
                      onClick={() => handleResultClick(result.slug)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-white transition-colors text-left"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        <Image
                          src={getValidImageUrl(result.image)}
                          alt={result.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-serif text-base text-[#2D2420] line-clamp-1 mb-1">
                          {result.name}
                        </p>
                        {result.category && (
                          <p className="text-xs text-gray-500 uppercase">{result.category}</p>
                        )}
                        <p className="text-sm font-semibold text-[#F0C11D] mt-1">
                          {typeof result.price === 'number'
                            ? result.price.toFixed(2)
                            : result.price}{' '}
                          €
                        </p>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              {/* View All Link */}
              <div className="border-t border-gray-200 p-3">
                <button
                  onClick={handleViewAll}
                  className="w-full text-center text-sm font-semibold text-[#8B4E4E] hover:text-[#6B3D3D] transition-colors"
                >
                  {t('viewAllResults')} ({results.length})
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <p>{t('noResults')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}















