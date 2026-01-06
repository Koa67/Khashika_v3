'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@/navigation';
import { usePathname } from 'next/navigation';

// Types
interface MenuItem {
  label: string;
  href: string;
}

interface MenuSection {
  title?: string;
  items: MenuItem[];
}

interface DropdownMenu {
  label: string;
  href?: string;
  sections: MenuSection[];
  featured?: {
    label: string;
    href: string;
    highlight?: boolean;
  }[];
  searchable?: boolean;
}

// Menu Data - Aligné avec FILTER_CONFIG
const menuData: DropdownMenu[] = [
  {
    label: 'Bijoux',
    href: '/bijoux',
    sections: [
      {
        title: 'Par type',
        items: [
          { label: 'Bagues', href: '/bijoux/bagues' },
          { label: "Boucles d'oreilles", href: '/bijoux/boucles-oreilles' },
          { label: 'Colliers', href: '/bijoux/colliers' },
          { label: 'Pendentifs', href: '/bijoux/pendentifs' },
          { label: 'Bracelets', href: '/bijoux/bracelets' },
          { label: 'Chaînes', href: '/bijoux/chaines' },
          { label: 'Chevilles', href: '/bijoux/chevilles' },
        ],
      },
    ],
  },
  {
    label: 'Nos Pierres',
    href: '/pierres',
    sections: [
      {
        title: 'Pierres vedettes',
        items: [
          { label: 'Turquoise', href: '/pierres/turquoise' },
          { label: 'Lapis Lazuli', href: '/pierres/lapis-lazuli' },
          { label: 'Agate', href: '/pierres/agate' },
          { label: 'Onyx (toutes couleurs)', href: '/pierres/onyx' },
          { label: 'Pierre de Lune', href: '/pierres/pierre-de-lune' },
          { label: 'Corail', href: '/pierres/corail' },
          { label: 'Améthyste', href: '/pierres/amethyste' },
          { label: 'Quartz', href: '/pierres/quartz-rose' },
          { label: 'Œil de Tigre', href: '/pierres/oeil-de-tigre' },
          { label: 'Cornaline', href: '/pierres/cornaline' },
        ],
      },
    ],
    featured: [
      { label: 'Toutes les pierres', href: '/pierres', highlight: true },
    ],
  },
  {
    label: 'Accessoires',
    href: '/accessoires',
    sections: [
      {
        title: 'Textile',
        items: [
          { label: 'Pashminas', href: '/accessoires/pashmina' },
          { label: 'Foulards', href: '/accessoires/foulard' },
          { label: 'Sacs', href: '/accessoires/sac' },
        ],
      },
      {
        title: 'Cheveux',
        items: [
          { label: 'Accessoires cheveux', href: '/accessoires/accessoires-cheveux' },
        ],
      },
      {
        title: 'Petits articles',
        items: [
          { label: 'Porte-clés', href: '/accessoires/porte-cle' },
          { label: 'Papeterie & Déco', href: '/accessoires/papeterie' },
        ],
      },
    ],
  },
  {
    label: 'Khashika',
    href: '/univers',
    sections: [
      {
        items: [
          { label: 'Notre univers', href: '/univers' },
          { label: 'Guide des pierres', href: '/guide-pierres' },
          { label: 'Notre histoire', href: '/notre-histoire' },
          { label: 'Entretien bijoux', href: '/entretien' },
        ],
      },
    ],
  },
];

// Dropdown Component
interface DropdownProps {
  menu: DropdownMenu;
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  menu,
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(menu.href || '');

  return (
    <div
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Link
        href={menu.href || '#'}
        className={`
          group flex items-center gap-1.5 px-4 py-2
          text-sm font-medium tracking-wide uppercase
          transition-all duration-300 ease-out
          ${isActive ? 'text-gold-fusion' : 'text-gray-800 hover:text-gold-fusion'}
        `}
      >
        <span className="relative">
          {menu.label}
          <span 
            className={`
              absolute -bottom-1 left-0 h-0.5 bg-gold
              transition-all duration-300 ease-out
              ${isOpen || isActive ? 'w-full' : 'w-0 group-hover:w-full'}
            `}
          />
        </span>
      </Link>

      <div
        className={`
          fixed left-0 right-0 top-[134px] pt-0
          bg-[#FDFCFB] border-b border-[#EAB615]/20 shadow-[0_8px_30px_rgba(240,193,29,0.15)]
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className={`flex items-center justify-center ${menu.label === 'Nos Pierres' ? 'flex-nowrap' : 'flex-wrap gap-y-2'}`}>
            {/* Lien "Tout voir" à gauche - SAUF pour Khashika */}
            {menu.label !== 'Khashika' && (
              <Link
                href={menu.href || '#'}
                className="px-5 py-2 text-sm font-semibold text-[#EAB615] hover:text-white hover:bg-[#EAB615] transition-all duration-200 rounded-sm whitespace-nowrap"
              >
                {menu.label === 'Bijoux' && 'Tous les bijoux'}
                {menu.label === 'Nos Pierres' && 'Toutes les pierres'}
                {menu.label === 'Accessoires' && 'Tous les accessoires'}
              </Link>
            )}
            {/* Séparateur après "Tout voir" */}
            {menu.label !== 'Khashika' && (
              <span className="border-l border-[#EAB615]/30 h-4 mx-1"></span>
            )}
            {/* Items normaux */}
            {(() => {
              const allItems = menu.sections.flatMap(section => section.items);
              return allItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`
                    ${menu.label === 'Nos Pierres' ? 'px-3' : 'px-5'} 
                    py-2 text-sm text-[#2D2926] hover:text-gold-fusion transition-colors whitespace-nowrap
                    ${index > 0 || (menu.label !== 'Khashika' && index === 0) ? 'border-l border-[#EAB615]/30' : ''}
                  `}
                >
                  {item.label}
                </Link>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Mobile Menu Component
interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleExpand = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  return (
    <>
      <div
        className={`
          fixed inset-0 bg-black/50 z-40
          transition-opacity duration-300
          ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}
        `}
        onClick={onClose}
      />

      <div
        className={`
          fixed top-0 right-0 h-full w-80 max-w-[85vw]
          bg-[#FDFCFB] z-50 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#EAB615]/20">
          <span className="text-lg font-serif text-[#2D2926]">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FAF9F7] rounded-full transition-colors"
            aria-label="Fermer le menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100%-64px)] py-4">
          {menuData.map((menu) => (
            <div key={menu.label} className="border-b border-[#EAB615]/20">
              <button
                onClick={() => toggleExpand(menu.label)}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4 text-left
                  text-[#2D2926] font-medium
                  hover:text-gold-fusion transition-all duration-200
                "
              >
                <span>{menu.label}</span>
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-300
                  ${expandedMenu === menu.label ? 'max-h-[600px]' : 'max-h-0'}
                `}
              >
                <div className="px-6 pb-4 bg-[#FDFCFB]/50">
                  {menu.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-4">
                          {section.title && (
                            <h4 className="text-xs uppercase tracking-wider text-[#2D2926]/60 mb-2 mt-3">
                              {section.title}
                            </h4>
                          )}
                          <ul className="space-y-1">
                            {section.items.map((item, itemIndex) => (
                              <li key={itemIndex}>
                                <Link
                                  href={item.href}
                                  onClick={onClose}
                                  className="
                                    block px-3 py-2 text-sm text-[#2D2926]
                                    hover:text-gold-fusion transition-all duration-200
                                  "
                                >
                                  {item.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {menu.featured && (
                        <div className="pt-2 border-t border-[#EAB615]/20">
                          {menu.featured.map((feat, index) => (
                            <Link
                              key={index}
                              href={feat.href}
                              onClick={onClose}
                              className="
                                block py-2 text-sm font-medium text-gold-fusion
                                hover:text-[#A8871F] transition-colors
                              "
                            >
                              → {feat.label}
                            </Link>
                          ))}
                        </div>
                      )}
                </div>
              </div>
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

// Main Navigation Component
export const NavigationMenu: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav className="hidden lg:flex items-center justify-center">
        <ul className="flex items-center gap-1">
          {menuData.map((menu) => (
            <li key={menu.label}>
              <Dropdown
                menu={menu}
                isOpen={openDropdown === menu.label}
                onMouseEnter={() => handleMouseEnter(menu.label)}
                onMouseLeave={handleMouseLeave}
              />
            </li>
          ))}
        </ul>
      </nav>

      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Ouvrir le menu"
      >
        <svg className="w-6 h-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
};

export default NavigationMenu;