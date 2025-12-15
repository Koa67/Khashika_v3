'use client';

import { usePathname, useRouter } from '@/navigation';
import { Globe } from 'lucide-react';
import { useState } from 'react';
import { routing } from '@/navigation';

/**
 * SÉLECTEUR DE LANGUE
 * Composant discret dans la Navbar et le Footer
 * Change l'URL sans perdre la page actuelle
 */
export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Détecter la locale actuelle depuis le pathname
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'fr';

  // Construire le nouveau pathname avec la nouvelle locale
  const switchLocale = (newLocale: 'fr' | 'en') => {
    const segments = pathname.split('/').filter(Boolean);
    
    // Si on est déjà sur une route localisée, remplacer la locale
    if (segments[0] === 'fr' || segments[0] === 'en') {
      segments[0] = newLocale;
    } else {
      // Sinon, ajouter la locale au début
      segments.unshift(newLocale);
    }

    const newPath = '/' + segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-gray-600 hover:text-[#2596be] transition-colors"
        aria-label="Changer de langue"
      >
        <Globe className="w-5 h-5" />
        <span className="text-sm font-medium uppercase">{currentLocale}</span>
      </button>

      {isOpen && (
        <>
          {/* Overlay pour fermer */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <button
              onClick={() => switchLocale('fr')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                currentLocale === 'fr' ? 'bg-[#f4f1eb] font-semibold' : ''
              }`}
            >
              🇫🇷 Français
            </button>
            <button
              onClick={() => switchLocale('en')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                currentLocale === 'en' ? 'bg-[#f4f1eb] font-semibold' : ''
              }`}
            >
              🇬🇧 English
            </button>
          </div>
        </>
      )}
    </div>
  );
}




