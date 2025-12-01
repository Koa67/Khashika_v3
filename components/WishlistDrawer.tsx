'use client';

import { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';
import { getValidImageUrl } from '@/lib/utils/images';
import { Product } from '@/lib/types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem, items: cartItems } = useCart();

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

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    
    items.forEach((product) => {
      // Vérifier si le produit est déjà dans le panier
      const isAlreadyInCart = cartItems.some((item) => item.product.id === product.id);
      
      if (!isAlreadyInCart) {
        addItem(product, 1);
        addedCount++;
      }
    });
    
    // Feedback utilisateur
    if (addedCount > 0) {
      console.log(`${addedCount} nouveau(x) produit(s) ajouté(s) au panier`);
      // Optionnel : Afficher un toast ici si vous avez un système de notifications
    } else {
      console.log('Tous les produits sont déjà dans le panier');
    }
  };

  return (
    <div className={`fixed inset-0 z-[1000] ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-xl bg-background shadow-xl flex flex-col zari-frame transform transition-transform duration-500`}
        style={{ 
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#D4AF37]/30">
          <h2 className="text-2xl font-serif text-card-foreground">Mes Favoris</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-card/50 rounded-full transition-colors"
            aria-label="Fermer les favoris"
          >
            <X size={24} className="text-card-foreground" />
          </button>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-sans text-card-foreground/70 mb-4">Votre liste de favoris est vide</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((product) => {
                const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
                const displayPrice = price > 0 ? `${price.toFixed(2)} €` : 'Prix sur demande';
                
                return (
                  <div key={product.id} className="flex gap-4 pb-4 border-b border-border/50">
                    {/* Image miniature */}
                    <Link 
                      href={`/product/${product.slug}`}
                      onClick={onClose}
                      className="relative w-20 h-20 flex-shrink-0 bg-card rounded overflow-hidden"
                    >
                      <img
                        src={getValidImageUrl(product.image_url || product.images?.[0])}
                        alt={product.name || 'Bijou Khashika'}
                        className="w-full h-full object-contain object-center"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.svg';
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </Link>

                    {/* Infos */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className="block"
                      >
                        <h3 className="font-serif text-card-foreground mb-1 line-clamp-2">{product.name}</h3>
                        <p className="font-sans text-sm font-bold text-[#D4AF37] mb-2">
                          {displayPrice}
                        </p>
                      </Link>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="text-sm underline text-[#D4AF37] hover:text-[#2596be] transition-colors"
                        >
                          Ajouter au panier
                        </button>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="p-1 hover:text-red-500 transition-colors flex-shrink-0"
                          aria-label="Supprimer des favoris"
                        >
                          <Trash2 size={24} className="text-foreground/50" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 bg-card/50">
            <button
              onClick={handleAddAllToCart}
              className="w-full bg-[#2596be] text-white py-3 px-6 rounded-lg font-serif text-lg hover:bg-[#1e7a9e] transition-colors"
            >
              TOUT AJOUTER AU PANIER
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

