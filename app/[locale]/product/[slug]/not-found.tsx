import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="font-heading text-4xl font-bold text-secondary mb-4">
        Produit introuvable
      </h1>
      <p className="font-body text-gray-600 mb-8">
        Le produit que vous recherchez n&apos;existe pas ou a été supprimé.
      </p>
      <Link
        href="/shop"
        className="inline-block bg-primary text-white font-body font-semibold py-3 px-6 rounded transition-colors hover:bg-primary/80"
      >
        Retour à la boutique
      </Link>
    </div>
  );
}



