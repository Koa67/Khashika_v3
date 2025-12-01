'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { X, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getTotal, removeItem } = useCart();
  const total = getTotal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className={`fixed inset-0 z-[1000] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-background shadow-xl flex flex-col border-l-4 border-[#D4AF37] transform transition-transform duration-500`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/30">
          <h2 className="text-2xl font-serif text-foreground">Panier</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-background/50 rounded-full transition-colors"
            aria-label="Fermer le panier"
          >
            <X size={24} className="text-foreground" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-foreground/70 mb-4">Votre panier est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border/50">
                  <div className="flex-1">
                    <h3 className="font-serif text-foreground mb-1">{item.product.name}</h3>
                    <p className="font-sans text-sm text-foreground/70">
                      {item.product.price.toFixed(2)} € × {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Supprimer du panier"
                  >
                    <Trash2 size={18} className="text-foreground/50" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-background/50">
            <div className="flex justify-between items-center mb-4">
              <span className="font-serif text-lg text-foreground">Total</span>
              <span className="font-sans text-xl font-medium text-[#D4AF37]">
                {total.toFixed(2)} €
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={onClose}
              className="block w-full bg-[#2596be] text-white py-3 px-6 rounded-lg font-bold hover:bg-[#1a1a1a] transition-colors uppercase tracking-widest text-center"
            >
              COMMANDER
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
