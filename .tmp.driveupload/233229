import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products-loader';
import ProductCard from '@/components/ProductCard';
import Hero from '@/components/Hero';
import PromotionSection from '@/components/PromotionSection';

export const metadata: Metadata = {
  title: 'Khashika – Bijoux de Luxe Artisanaux | Collection 2025',
  description:
    'Découvrez notre collection 2025 de bijoux de luxe artisanaux. Des créations uniques et raffinées, alliant tradition et modernité.',
  openGraph: {
    title: 'Khashika – Bijoux de Luxe Artisanaux | Collection 2025',
    description:
      'Découvrez notre collection 2025 de bijoux de luxe artisanaux. Des créations uniques et raffinées.',
    images: ['/images/og-homepage.jpg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khashika – Bijoux de Luxe Artisanaux | Collection 2025',
    description:
      'Découvrez notre collection 2025 de bijoux de luxe artisanaux.',
  },
  alternates: {
    canonical: '/',
  },
};

export default async function Home() {
  // Charger les produits depuis products-loader (qui utilise products-ultimate.json)
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Section Promotion */}
      <PromotionSection />

      {/* Section Produits */}
      <section className="container mx-auto px-4 py-12 bg-pattern">
        <h2 className="font-heading text-4xl font-bold text-secondary mb-8 text-center">
          Nos Collections
        </h2>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* GRILLE RESPONSIVE STRICTE : 2 Mobile / 3 Tablette / 4 Desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id || `product-${index}`} 
                product={product}
                priority={index < 4}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
