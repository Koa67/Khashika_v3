import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products-loader';
import ProductGrid from '@/components/boutique/ProductGrid';

export const metadata: Metadata = {
  title: 'Boutique | Khashika – Bijoux de Luxe Artisanaux',
  description:
    'Découvrez notre collection complète de bijoux indiens authentiques, faits main avec passion. Bagues, colliers, boucles d\'oreilles et plus encore.',
  openGraph: {
    title: 'Boutique | Khashika – Bijoux de Luxe Artisanaux',
    description:
      'Découvrez notre collection complète de bijoux indiens authentiques, faits main avec passion.',
    type: 'website',
  },
  alternates: {
    canonical: '/boutique',
  },
};

export default async function BoutiquePage() {
  // Charger tous les produits depuis products-ultimate.json
  const products = await getAllProducts();
  
  return (
    <main className="min-h-screen bg-[#f4f1eb]">
      {/* Hero section / Titre section */}
      <section className="max-w-7xl mx-auto px-4 pt-24 pb-8">
        <h1 className="font-serif text-4xl md:text-5xl text-center mb-4 text-[#2D2420]">
          Notre Collection
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto font-sans">
          Découvrez nos bijoux indiens authentiques, faits main avec passion
        </p>
      </section>
      
      {/* Grid de produits */}
      <ProductGrid products={products} />
    </main>
  );
}



















