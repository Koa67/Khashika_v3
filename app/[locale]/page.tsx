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
      'Découvrez notre collection 2025 dee artisanaux.',
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
  { name: 'Pashminas', type: 'pashmina', image: '/iproducts_reconciled/pashmina-cachemire-et-soie-vert-motifs-éléphant.jpeg' },
  { name: 'Foulards', type: 'foulard', image: '/images/products_reconciled/étole-marron-100-coton-avec-nuance-de-couleur.jpeg' },
  { name: 'Sacs', type: 'sac', image: '/images/products_reconciled/sac-bohème-bleu-brodé-à-pompons.jpeg' },
  { name: 'Accessoires', type: 'accessoire', image: '/images/products_reconciled/porte-clé-lotus-argenté-rond.jpg' },
  { name: 'Cheveux', type: 'accessoire cheveux', image: '/images/products_reconciled/chouchou-cheveux-rose-avec-motifs-de-couleur.jpeg' },
];

const stones = [
  { name: 'Turquoise', slug: 'turquoise', image: '/images/pierres/turquoise.jpg' },
  { name: 'Lapis Lazuli', slug: 'lapis-lazuli', image: '/images/pierres/lapis-lazuli.jpg' },
  { name: 'Améthyste', slug: 'améthyste', image: '/images/pierres/amethyste.jpg' },
  { name: 'Pierre de Lune', slug: 'pierre-de-lune', image: '/images/pierres/pierre-de-lune.jpg' },
  { name: 'Grenat', slug: 'grenat', image: '/images/pierres/grenat.jpg' },
  { name: 'Onyx', slug: 'onyx', image: '/images/pierres/onyx.jpg' },
  { name: 'Corail', slug: 'corail', image: '/images/pierres/corail.jpg' },
  { name: 'Labradorite', slug: 'labradorite', image: '/images/pierres/labradorite.jpg' },
  { name: 'Quartz Rose', slug: 'quartz-rose', image: '/images/pierres/quartz-rose.jpg' },
  { name: 'Œil du Tigre', slug: 'oeil-du-tigre', image: '/images/pierres/oeil-du-tigre.jpg' },
  { name: 'Jade', slug: 'jade', image: '/images/pierres/jade.jpg' },
  { name: 'Cornaline', slug: 'cornaline', image: '/images/pierres/cornaline.jpg' },
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-xl text-white font-bold" style={{ textShadow: "0 0 10px black, 0 0 20px black, 0 0 40px black, 0 4px 8px black" }}>
                    {col.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/fr/shop"
              className="inline-block px-6 py-3 bg-[#2596be] text-white font-medium hover:bg-[#1e7a9a] transition-colors"
            >
              Voir toute la boutique →
            </Link>
          </div>
        </div>
      </section>

      {/* Nos Pierres */}
      <section className="bg-[#F4EAD8] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-3xl font-bold text-[#2D2926] text-center mb-8">
            Nos Pierres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stones.map((stone) => (
              <Link
                key={stone.slug}
                href={`/fr/shop?stones=${encodeURIComponent(stone.slug)}`}
                className="relative aspect-[4/3] overflow-hidden group"
              >
                <Image
                src={stone.image}
                  fill
                  className="object-cover"
                  alt={stone.name}
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-xl text-white font-bold" style={{ textShadow: "0 0 10px black, 0 0 20px black, 0 0 40px black, 0 4px 8px black" }}>
                    {stone.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/fr/pierres"
              className="inline-block px-6 py-3 border-2 border-[#2596be] text-[#2596be] font-medium hover:bg-[#2596be] hover:text-white transition-colors"
            >
              Découvrir toutes les pierres →
         </Link>
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
    </div>
  );
}
