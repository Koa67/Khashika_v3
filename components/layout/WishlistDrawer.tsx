'use client';

import { Fragment, useState } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { X, Trash2, Heart, ShoppingBag, Check } from 'lucide-react';
import { Link } from '@/navigation';
import { useWishlist } from '@/lib/context/WishlistContext';
import { useCart } from '@/lib/context/CartContext';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';
import { Product } from '@/lib/types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCart?: () => void;
}

// Separate component for wishlist item to use hook properly
function WishlistItemRow({ product, onAddToCart, onRemove, cartItems }: {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onRemove?: (productId: string) => void;
  cartItems?: Array<{ product: { id: string } }>;
}) {
  const isInCart = cartItems?.some(item => item.product.id === product.id) || false;
  const allProductImages = [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];
  
  const { mainImage } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });

  return (
    <div className="flex gap-4 border-b border-[#E8B71B]/20 pb-6 last:border-0">
      {/* Image */}
      {mainImage && (
        <div className="flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={mainImage} 
            alt={product.name || 'Produit'} 
            className="w-24 h-24 object-cover rounded-none bg-gray-100"
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
        
        <p className="text-[#8B4E4E] font-semibold text-sm">
          {(product.price || 0).toFixed(2)}€
        </p>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {isInCart ? (
            <button
              disabled
              className="flex-1 bg-[#E8B71B]/20 text-[#E8B71B] text-xs py-2 rounded-none font-medium flex items-center justify-center gap-1 cursor-default"
            >
              <Check className="w-3 h-3" />
              Déjà dans le panier
            </button>
          ) : (
            <button
              onClick={() => onAddToCart?.(product)}
              className="flex-1 bg-[#8B4E4E] text-white text-xs py-2 rounded-none hover:opacity-90 transition font-medium flex items-center justify-center gap-1"
            >
              <ShoppingBag className="w-3 h-3" />
              Ajouter au panier
            </button>
          )}
          <button
            onClick={() => onRemove?.(product.id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-none hover:bg-red-50"
            aria-label="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function WishlistDrawer({ isOpen, onClose, onOpenCart }: WishlistDrawerProps) {
  const wishlistContext = useWishlist();
  const cartContext = useCart();
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!wishlistContext) {
    return null;
  }

  const { items = [], removeFromWishlist, clearWishlist } = wishlistContext;

  const handleAddToCart = (product: Product) => {
    if (cartContext?.addItem) {
      cartContext.addItem(product);
      // Ne pas retirer de la wishlist, juste ajouter au panier
    }
  };

  const handleClearWishlist = () => {
    clearWishlist();
    setShowConfirmClear(false);
  };

  return (
    <>
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
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md relative bg-[#FAF9F7] border-l border-[#E8B71B]/40 shadow-[0_4px_12px_rgba(240,193,29,0.15)]">
                  {/* Jali Pattern Border - Vertical */}
                  <div className="jali-border-vertical" aria-hidden="true" />
                  <div className="flex h-full flex-col overflow-y-auto pl-6">
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-6 py-6 border-b border-[#E8B71B]/20">
                      <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-[#E8B71B] fill-current" />
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
                              cartItems={cartContext?.items}
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
                            className="mt-4 text-[#8B4E4E] hover:underline font-medium text-sm"
                          >
                            Découvrir nos créations
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    {items && items.length > 0 && (
                      <div className="px-6 py-6 border-t border-[#E8D4B8] space-y-3 bg-[#FAF9F7]">
                        <button 
                          onClick={() => { items.forEach(product => handleAddToCart(product)); }}
                          className="w-full bg-[#8B4E4E] text-white py-3 rounded-none hover:opacity-90 transition font-medium"
                        >
                          Ajouter tout au panier
                        </button>
                        {onOpenCart && (
                          <button 
                            onClick={() => { onClose(); onOpenCart(); }}
                            className="w-full border-2 border-[#8B4E4E] text-[#8B4E4E] py-2 rounded-none hover:bg-[#8B4E4E]/10 transition font-medium"
                          >
                            Voir le panier
                          </button>
                        )}
                        <button
                          onClick={onClose}
                          className="w-full border-2 border-[#E8B71B] text-gray-900 py-2 rounded-none hover:bg-[#E8B71B]/10 transition font-medium"
                        >
                          Continuer le shopping
                        </button>
                        <button
                          onClick={() => setShowConfirmClear(true)}
                          className="w-full text-red-600 py-2 text-sm hover:bg-red-50 transition rounded-none font-medium"
                        >
                          Vider la wishlist
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

    {/* Confirmation Dialog */}
    <Transition show={showConfirmClear} as={Fragment}>
      <Dialog as="div" className="relative z-[300]" onClose={() => setShowConfirmClear(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-none bg-[#FAF9F7] p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  ⚠️ Vider la wishlist
                </Dialog.Title>
                <p className="text-sm text-gray-500 mb-6">
                  Êtes-vous sûr de vouloir vider votre wishlist ? Cette action est irréversible.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowConfirmClear(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-none hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleClearWishlist}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-none hover:bg-red-700 transition-colors"
                  >
                    Vider la wishlist
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
    </>
  );
}