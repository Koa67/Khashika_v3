'use client';

import { Link } from '@/navigation';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Footer() {
  return (
    <footer className="bg-[#121A21] text-white relative">
      {/* Frise décorative inversée en haut */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 4 colonnes responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Colonne 1 : À propos */}
          <div>
            <h3 className="font-serif text-xl text-[#D4AF37] mb-4">Khashika</h3>
            <p className="text-gray-400 text-sm mb-4">
              Joaillerie Indienne d&apos;Exception depuis 1924. Créations artisanales en argent massif, 
              inspirées de la tradition indienne.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/khashika"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#2596be] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/khashika"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-[#2596be] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Colonne 2 : Navigation */}
          <div>
            <h3 className="font-serif text-lg text-white mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Créations
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=pierres" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Univers des Pierres
                </Link>
              </li>
              <li>
                <Link href="/shop?cat=accessoires" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Accessoires
                </Link>
              </li>
              <li>
                <Link href="/story" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  L&apos;Esprit Khashika
                </Link>
              </li>
              <li>
                <Link href="/cadeaux" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Cadeaux
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Service Client */}
          <div>
            <h3 className="font-serif text-lg text-white mb-4">Service Client</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/livraison" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Livraison & Retours
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link href="/confidentialite" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="font-serif text-lg text-white mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="mailto:contact@khashika.com" className="hover:text-[#D4AF37] transition-colors">
                  contact@khashika.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                <a href="tel:+33123456789" className="hover:text-[#D4AF37] transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span>Paris, France</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bas du footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Khashika. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
