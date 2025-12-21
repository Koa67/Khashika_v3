'use client';

import { Link } from '@/navigation';

interface MegaMenuProps {
  title: string;
  items: {
    title: string;
    href: string;
    description?: string;
  }[];
  isOpen: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

export default function MegaMenu({ items, isOpen, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className="golden-glow-dropdown absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-screen max-w-5xl backdrop-blur-sm z-[200] animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-12 py-10">
        <div className="grid grid-cols-4 gap-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="golden-glow-dropdown-item group block hover:text-[#D4AF37]"
            >
              <h3 className="font-serif text-base font-semibold text-[#1a1a1a] mb-1 group-hover:text-[#2596be] transition-colors">
                {item.title}
              </h3>
              {item.description && (
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{item.description}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}












