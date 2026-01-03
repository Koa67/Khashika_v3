'use client';

import { Link } from '@/navigation';
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { ThemeToggle } from './ui/ThemeToggle';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { CONTACT } from '@/lib/constants/contact';

export default function Footer() {
  return (
    <footer className="bg-[#2D2926] text-[#FFFFFF] relative">
      {/* Frise décorative inversée en haut */}
      <div className="h-1 bg-gradient-to-r from-transparent via-[#EAB615] to-transparent opacity-60"></div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* 4 colonnes responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Colonne 1 : Marque */}
          <div>
            <h3 className="text-xl text-gold-fusion mb-3">Khashika</h3>
            <p className="text-[#FFFFFF]/70 text-sm leading-relaxed">
              Bijoux artisanaux d&apos;Inde et du Tibet. Argent, pierres semi-précieuses et accessoires sélectionnés avec soin.
            </p>
          </div>

          {/* Colonne 2 : Boutique */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] mb-3">Boutique</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/shop" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  Tous les produits
                </Link>
              </li>
              <li>
                <Link href="/bijoux/bracelets" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  Bracelets
                </Link>
              </li>
              <li>
                <Link href="/bijoux/colliers" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  Colliers
                </Link>
              </li>
              <li>
                <Link href="/bijoux/bagues" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  Bagues
                </Link>
              </li>
              <li>
                <Link href="/accessoires/pashminas" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  Pashminas
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Informations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] mb-3">Informations</h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <Link href="/legal/cgv" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  CGV
                </Link>
              </li>
              <li>
                <Link href="/plan-du-site" className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors">
                  Plan du site
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#FFFFFF] mb-3">Contact</h3>
            <ul className="space-y-2 text-sm text-[#FFFFFF]/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-fusion transition-colors">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${CONTACT.phoneHref}`} className="hover:text-gold-fusion transition-colors">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{CONTACT.address.street} - {CONTACT.address.postalCode} {CONTACT.address.city}, France</span>
              </li>
            </ul>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              <a
                href="https://instagram.com/khashika"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/khashika"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFFFFF]/70 hover:text-gold-fusion transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar - copyright */}
      <div className="border-t border-[#FFFFFF]/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-xs text-[#FFFFFF]/50">
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
