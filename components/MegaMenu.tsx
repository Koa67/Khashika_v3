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
      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 w-screen max-w-5xl backdrop-blur-sm z-[200] animate-in fade-in slide-in-from-top-2 duration-200 bg-[#FDFCFB] border-t-2 border-t-[#E8B71B]/40 rounded-none shadow-[0_10px_40px_rgba(240,193,29,0.25)]"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="container mx-auto px-12 py-10">
        <div className="grid grid-cols-4 gap-8">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="group block hover:text-[#E8B71B] px-4 py-3 transition-all duration-200 cursor-pointer hover:bg-[#FDF9F7]/80"
            >
              <h3 className="font-serif text-base font-semibold text-[#2D2420] mb-1 group-hover:text-[#E8B71B] transition-colors">
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











