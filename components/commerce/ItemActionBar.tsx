'use client';

import { ReactNode } from 'react';
import { Trash2 } from 'lucide-react';

interface ItemActionBarProps {
  /** Primary action slot (e.g., "Ajouter au panier" button for wishlist) */
  primaryAction?: ReactNode;
  /** Right slot (e.g., quantity selector for cart) */
  rightSlot?: ReactNode;
  /** Status indicator (e.g., "Déjà au panier") */
  status?: ReactNode;
  /** Remove action handler */
  onRemove: () => void;
  /** Aria label for remove button */
  removeAriaLabel?: string;
}

/**
 * Shared action bar for wishlist/cart item rows.
 * Provides consistent trash icon size/style and layout.
 */
export function ItemActionBar({
  primaryAction,
  rightSlot,
  status,
  onRemove,
  removeAriaLabel = 'Supprimer',
}: ItemActionBarProps) {
  return (
    <div className="flex items-center gap-2 mt-auto">
      {/* Status indicator if present */}
      {status && <div className="flex-shrink-0">{status}</div>}
      
      {/* Primary action (grows to fill space) */}
      {primaryAction && <div className="flex-1">{primaryAction}</div>}
      
      {/* Right slot (e.g., quantity selector) */}
      {rightSlot && <div className="flex-shrink-0">{rightSlot}</div>}
      
      {/* Trash button - consistent styling across wishlist/cart */}
      <button
        onClick={onRemove}
        className="p-1.5 text-gray-500 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
        aria-label={removeAriaLabel}
        type="button"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export default ItemActionBar;
