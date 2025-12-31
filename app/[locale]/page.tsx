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

const collections = [
  { name: 'Colliers', type: 'collier', image: '/images/products_reconciled/collier-tibetain-en-turquoise-et-corail.jpeg' },
  { name: 'Bracelets', type: 'bracelet', image: '/images/products_reconciled/bracelet-indien-pierre-labradorite.jpg' },
  { name: "Boucles d'oreilles", type: "boucles d'oreilles", image: '/images/products_reconciled/créole-spirale-en-laiton-et-pierre-turquoise.jpeg' },
  { name: 'Bagues', type: 'bague', image: '/images/products_reconciled/bague-argent-fine-réglable.jpeg' },
  { name: 'Pendentifs', type: 'pendentif', image: '/images/products_reconciled/pendentif-argent-aum-symbole-indien.jpeg' },
  { name: 'Chaînes', type: 'chaîne', image: '/images/products_reconciled/chaine-de-chevilles-argentée-coeur.jpeg' },
  { name: 'Chevilles', type: 'cheville', image: '/images/products_reconciled/chaine-de-chevilles-argentée-perles-de-turquoise.jpeg' },
  { name: 'Pashminas', type: 'pashmina', image: '/images/products_reconciled/pashmina-cachemire-et-soie-vert-motifs-éléphant.jpeg' },
  { name: 'Foulards', type: 'foulard', image: '/images/products_reconciled/étole-marron-100-coton-avec-nuance-de-couleur.jpeg' },
  { name: 'Sacs', type: 'sac', image: '/images/products_reconciled/sac-bohème-bleu-brodé-à-pompons.jpeg' },
  { name: 'Accessoires', type: 'accessoire', image: '/images/products_reconciled/porte-clé-lotus-argenté-rond.jpg' },
  { name: 'Cheveux', type: 'accessoire cheveux', image: '/images/products_reconciled/chouchou-cheveux-rose-avec-motifs-de-couleur.jpeg' },
];

export default async function Home() {
  const allProducts = await getAllProducts();
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Nos Collections */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-[#2D2926] text-center mb-8">
            Nos Collections
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {collections.map((col) => (
              <Link
                key={col.type}
                href={`/fr/shop?types=${encodeURIComponent(col.type)}`}
                className="relative aspect-[4/3] overflow-hidden group"
              >
                <Image
                  src={col.image}
                  fill
                  className="object-contain"
                  alt={col.name}
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-xl text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {col.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recommandé pour vous */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-[#2D2926]">
              Recommandé pour vous
            </h2>
            <Link href="/shop" className="text-[#8B4E4E] hover:underline text-sm">
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
    </div>
  );
}
