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
}

// Menu Data - Proposition A "Type-First"
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
          { label: 'Parures', href: '/bijoux/parures' },
        ],
      },
      {
        title: 'Sélections',
        items: [
          { label: 'Nouveautés', href: '/bijoux/nouveautes' },
          { label: 'Meilleures ventes', href: '/bijoux/best-sellers' },
          { label: 'Tout voir', href: '/bijoux' },
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
          { label: 'Améthyste', href: '/pierres/amethyste' },
          { label: 'Turquoise', href: '/pierres/turquoise' },
          { label: 'Lapis-lazuli', href: '/pierres/lapis-lazuli' },
          { label: 'Pierre de lune', href: '/pierres/pierre-de-lune' },
          { label: 'Grenat', href: '/pierres/grenat' },
          { label: 'Corail', href: '/pierres/corail' },
          { label: 'Onyx', href: '/pierres/onyx' },
          { label: 'Quartz rose', href: '/pierres/quartz-rose' },
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
          { label: 'Pashminas', href: '/accessoires/pashminas' },
          { label: 'Foulards', href: '/accessoires/foulards' },
          { label: 'Pochettes', href: '/accessoires/pochettes' },
          { label: 'Sacs', href: '/accessoires/sacs' },
          { label: 'Soie', href: '/accessoires/soie' },
        ],
      },
      {
        title: 'Petits articles',
        items: [
          { label: 'Porte-clés', href: '/accessoires/porte-cles' },
          { label: 'Chouchous', href: '/accessoires/chouchous' },
          { label: 'Bandanas', href: '/accessoires/bandanas' },
          { label: 'Marque-pages', href: '/accessoires/marque-pages' },
          { label: 'Carnets', href: '/accessoires/carnets' },
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
          absolute top-full left-0 mt-0 pt-2
          transition-all duration-300 ease-out
          ${isOpen 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
          }
        `}
      >
        <div 
          className="
            bg-[#FDFCFB] rounded-none shadow-[0_8px_30px_rgba(240,193,29,0.3)]
            border border-[#E8B71B]/20
            min-w-[280px] p-4
          "
        >
          <div className="flex gap-4">
            {menu.sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="min-w-[120px]">
                {section.title && (
                  <h3 className="
                    text-xs font-semibold uppercase tracking-wider
                    text-[#2D2420]/60 mb-1.5 pb-1
                    border-b border-[#E8B71B]/20
                  ">
                    {section.title}
                  </h3>
                )}
                <ul className="space-y-0.5">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className="
                          block px-2 py-1 text-sm text-[#2D2420]
                          hover:text-gold-fusion hover:translate-x-1
                          transition-all duration-200
                        "
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {menu.featured && menu.featured.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#E8B71B]/20">
              {menu.featured.map((feat, index) => (
                <Link
                  key={index}
                  href={feat.href}
                  className={`
                    inline-flex items-center gap-1.5 text-sm font-medium
                    ${feat.highlight 
                      ? 'text-gold-fusion hover:text-[#A8871F]' 
                      : 'text-[#2D2420]/60 hover:text-gold-fusion'
                    }
                    transition-colors duration-200
                  `}
                >
                  <span>→</span>
                  {feat.label}
                </Link>
              ))}
            </div>
          )}
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
        <div className="flex items-center justify-between p-4 border-b border-[#E8B71B]/20">
          <span className="text-lg font-serif text-[#2D2420]">Menu</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#FDF9F7] rounded-full transition-colors"
            aria-label="Fermer le menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="overflow-y-auto h-[calc(100%-64px)] py-4">
          {menuData.map((menu) => (
            <div key={menu.label} className="border-b border-[#E8B71B]/20">
              <button
                onClick={() => toggleExpand(menu.label)}
                className="
                  w-full flex items-center justify-between
                  px-6 py-4 text-left
                  text-[#2D2420] font-medium
                  hover:text-gold-fusion transition-all duration-200
                "
              >
                <span>{menu.label}</span>
              </button>

              <div
                className={`
                  overflow-hidden transition-all duration-300
                  ${expandedMenu === menu.label ? 'max-h-[500px]' : 'max-h-0'}
                `}
              >
                <div className="px-6 pb-4 bg-[#FDFCFB]/50">
                  {menu.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-4">
                      {section.title && (
                        <h4 className="text-xs uppercase tracking-wider text-[#2D2420]/60 mb-2 mt-3">
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
                                block px-3 py-2 text-sm text-[#2D2420]
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
                    <div className="pt-2 border-t border-[#E8B71B]/20">
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






