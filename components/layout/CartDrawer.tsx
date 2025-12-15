'use client';

import { Fragment } from 'react';
import { Transition, Dialog } from '@headlessui/react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from '@/navigation';
import { useCart } from '@/lib/context/CartContext';
import { useValidatedImages } from '@/lib/hooks/useValidatedImages';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Separate component for cart item to use hook properly
function CartItemRow({ item, onUpdateQuantity, onRemove }: {
  item: { id: string; product: { id: string; name: string; price: number; image_url?: string; image?: string; images?: string[] }; quantity: number };
  onUpdateQuantity?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
}) {
  const product = item.product;
  const allProductImages = [
    product.image_url,
    product.image,
    ...(product.images || []),
  ].filter(Boolean) as string[];
  
  const { mainImage } = useValidatedImages(allProductImages, {
    fallbackImage: '/placeholder-image.svg',
  });

  const price = product.price || 0;
  const quantity = item.quantity || 1;

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
          <p className="text-xs text-gray-600 mt-1">
            Réf: {product.id}
          </p>
        </div>
        
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-[#2596be] font-semibold">
              {(price * quantity).toFixed(2)}€
            </p>
            <p className="text-xs text-gray-600">
              {price.toFixed(2)}€ x {quantity}
            </p>
          </div>
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => {
                if (quantity > 1) {
                  onUpdateQuantity?.(product.id, quantity - 1);
                }
              }}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded text-sm"
              aria-label="Diminuer"
            >
              −
            </button>
            <span className="w-6 text-center text-sm font-medium">
              {quantity}
            </span>
            <button 
              onClick={() => onUpdateQuantity?.(product.id, quantity + 1)}
              className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 rounded text-sm"
              aria-label="Augmenter"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove?.(product.id)}
        className="text-gray-400 hover:text-red-500 transition-colors p-1 self-start"
        aria-label="Supprimer"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const context = useCart();
  
  if (!context) {
    return null;
  }

  const { items = [], removeItem, updateQuantity, clearCart, getTotal } = context;
  const total = getTotal();

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
                        <ShoppingBag className="w-6 h-6 text-[#2596be]" />
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          Panier
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
                          {items.map((item) => (
                            <CartItemRow
                              key={item.id}
                              item={item}
                              onUpdateQuantity={updateQuantity}
                              onRemove={removeItem}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <ShoppingBag className="w-12 h-12 text-gray-300 mb-4" />
                          <p className="text-gray-600 font-medium">Panier vide</p>
                          <p className="text-gray-500 text-sm mt-2">Découvrez nos créations</p>
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    {items && items.length > 0 && (
                      <div className="px-6 py-6 border-t border-[#E8D4B8] space-y-4 bg-white">
                        {/* Summary */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Sous-total</span>
                            <span>{total.toFixed(2)}€</span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Livraison</span>
                            <span>À calculer</span>
                          </div>
                          <div className="border-t border-[#E8D4B8] pt-2 flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span className="text-[#2596be]">{total.toFixed(2)}€</span>
                          </div>
                        </div>

                        {/* Buttons */}
                        <Link 
                          href="/checkout"
                          onClick={onClose}
                          className="block w-full bg-[#2596be] text-white py-3 rounded-lg hover:opacity-90 transition font-medium text-center"
                        >
                          Procéder au paiement
                        </Link>
                        <button
                          onClick={onClose}
                          className="w-full border-2 border-[#D4AF37] text-gray-900 py-2 rounded-lg hover:bg-[#F5F5F5] transition font-medium"
                        >
                          Continuer le shopping
                        </button>
                        <button
                          onClick={() => {
                            clearCart?.();
                            onClose();
                          }}
                          className="w-full text-red-600 py-2 text-sm hover:bg-red-50 transition rounded-lg font-medium"
                        >
                          Vider le panier
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