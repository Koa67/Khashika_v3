import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/lib/data/products-loader';
import ProductCard from '@/components/boutique/ProductCard';
import Hero from '@/components/Hero';

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
  const allProducts = await getAllProducts();
  
  // Produits phares (premiers 4 produits)
  const featuredProducts = allProducts.slice(0, 4);
  
  // Nouveautés (produits avec isNew ou derniers 4)
  const newProducts = allProducts
    .filter(p => p.isNew)
    .slice(0, 4);
  const latestProducts = newProducts.length >= 4 
    ? newProducts 
    : allProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Section 1 - Hero */}
      <Hero />

      {/* Section 2 - Catégories visuelles */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-[#2D2420] text-center mb-8">
            Nos Collections
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/fr/shop?category=colliers" 
              className="relative aspect-square overflow-hidden group"
            >
              <Image 
                src="/images/products_reconciled/collier-tibetain-en-pierres-de-corail-turquoise-verte-et-lapis-lazuli.jpeg" 
                fill 
                className="object-cover" 
                alt="Colliers"
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-xl text-white font-bold">Colliers</span>
              </div>
            </Link>
            <Link 
              href="/fr/shop?category=bracelets" 
              className="relative aspect-square overflow-hidden group"
            >
              <Image 
                src="/images/products_reconciled/bracelet-pierres-naturelles-en-lapis-lazuli-avec-un-ange.jpeg" 
                fill 
                className="object-cover" 
                alt="Bracelets"
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-xl text-white font-bold">Bracelets</span>
              </div>
            </Link>
            <Link 
              href="/fr/shop?category=boucles" 
              className="relative aspect-square overflow-hidden group"
            >
              <Image 
                src="/images/products_reconciled/boucles-doreilles-argent-arbre-de-vie-onyx-noir.jpeg" 
                fill 
                className="object-cover" 
                alt="Boucles d'oreilles"
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-xl text-white font-bold">Boucles d&apos;oreilles</span>
              </div>
            </Link>
            <Link 
              href="/fr/shop?category=bagues" 
              className="relative aspect-square overflow-hidden group"
            >
              <Image 
                src="/images/products_reconciled/bague-argent-amethyste.jpg" 
                fill 
                className="object-cover" 
                alt="Bagues"
                loading="lazy"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-serif text-xl text-white font-bold">Bagues</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 3 - Produits Phares */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#2D2420]">
              Produits Phares
            </h2>
            <Link href="/fr/shop" className="text-[#8B4E4E] hover:underline text-sm">
              Voir tout →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard 
                key={product.id} 
                product={product}
                priority={index < 2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 - Nouveautés */}
      {latestProducts.length > 0 && (
        <section className="bg-white py-12">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold text-[#2D2420]">
                Nouveautés
              </h2>
              <Link href="/fr/shop" className="text-[#8B4E4E] hover:underline text-sm">
                Voir tout →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {latestProducts.map((product, index) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  priority={false}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
