'use client';

import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { X, Trash2, Heart, ShoppingBag } from 'lucide-react';
import { Link } from '@/navigation';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';
import { Product } from '@/lib/types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Separate component for wishlist item to use hook properly
function WishlistItemRow({ product, onAddToCart, onRemove }: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onRemove?: (productId: string) => void;
}) {
  const allProductImages = [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];
  
  const { mainImage } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });

  return (
    <div className="flex gap-4 border-b border-[#E8D4B8] pb-6 last:border-0">
      {/* Image */}
      {mainImage && (
        <div className="flex-shrink-0">
          <img 
            src={mainImage} 
            alt={product.name || 'Produit'} 
            className="w-24 h-24 object-cover rounded-lg bg-gray-100"
          />
        </div>
      )}
      
      {/* Details */}
      <div className="flex-1 flex flex-col gap-2">
        <div>
          <p className="font-medium text-sm text-gray-900 line-clamp-2">
            {product.name || 'Produit'}
          </p>
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
            {product.description || 'Créations exclusives'}
          </p>
        </div>
        
        <p className="text-[#2596be] font-semibold text-sm">
          {(product.price || 0).toFixed(2)}€
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onAddToCart?.(product)}
            className="flex-1 bg-[#2596be] text-white text-xs py-2 rounded-lg hover:opacity-90 transition font-medium flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-3 h-3" />
            Ajouter
          </button>
          <button
            onClick={() => onRemove?.(product.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            aria-label="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistDrawer({ isOpen, onClose }: WishlistDrawerProps) {
  const wishlistContext = useWishlist();
  const cartContext = useCart();

  if (!wishlistContext) {
    return null;
  }

  const { items = [], removeFromWishlist } = wishlistContext;

  const handleAddToCart = (product: Product) => {
    if (cartContext?.addItem) {
      cartContext.addItem(product);
      removeFromWishlist(product.id);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={onClose}>
        {/* OVERLAY SOMBRE */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40" />
        </Transition.Child>

        {/* DRAWER */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="golden-glow-drawer pointer-events-auto w-screen max-w-md relative">
                  {/* Jali Pattern Border - Vertical */}
                  <div className="jali-border-vertical" aria-hidden="true" />
                  <div className="flex h-full flex-col overflow-y-auto pl-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-[#E8D4B8]">
                      <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-[#D4AF37] fill-current" />
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          Wishlist
                        </Dialog.Title>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        aria-label="Fermer"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>

                    {/* ITEMS */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                      {items && items.length > 0 ? (
                        <div className="space-y-6">
                          {items.map((product) => (
                            <WishlistItemRow
                              key={product.id}
                              product={product}
                              onAddToCart={handleAddToCart}
                              onRemove={removeFromWishlist}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <Heart className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-gray-600 font-medium">Wishlist vide</p>
                          <p className="text-gray-500 text-sm mt-2">Ajoutez vos créations préférées</p>
                          <Link 
                            href="/shop"
                            onClick={onClose}
                            className="mt-4 text-[#2596be] hover:underline font-medium text-sm"
                          >
                            Découvrir nos créations
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    {items && items.length > 0 && (
                      <div className="px-6 py-6 border-t border-[#E8D4B8] space-y-3 bg-white">
                        <button className="w-full bg-[#2596be] text-white py-3 rounded-lg hover:opacity-90 transition font-medium">
                          Ajouter tout au panier
                        </button>
                        <button
                          onClick={onClose}
                          className="w-full border-2 border-[#D4AF37] text-gray-900 py-2 rounded-lg hover:bg-[#F5F5F5] transition font-medium"
                        >
                          Continuer le shopping
                        </button>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}