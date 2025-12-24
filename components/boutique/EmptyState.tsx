'use client';

interface EmptyStateProps {
  onClearFilters: () => void;
}

export default function EmptyState({ onClearFilters }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-24 h-24 mb-6 bg-primary/10 rounded-full flex items-center justify-center">
        <span className="text-4xl">💎</span>
      </div>
      <h3 className="font-serif text-xl mb-2">Aucun trésor trouvé</h3>
      <p className="text-foreground/60 mb-6">
        Essayez d&apos;élargir votre recherche ou de modifier vos filtres.
      </p>
      <button
        onClick={onClearFilters}
        className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors"
      >
        Effacer tous les filtres
      </button>
    </div>
  );
}

