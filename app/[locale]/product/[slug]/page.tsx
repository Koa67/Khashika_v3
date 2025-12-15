import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/utils/products';
import ProductMediaGallery from '@/components/ProductMediaGallery';
import ProductConversionModule from '@/components/ProductConversionModule';
import ProductInfoTabs from '@/components/ProductInfoTabs';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Produit introuvable | Khashika',
    };
  }

  const imageUrl = (product.images && product.images.length > 0 && product.images[0])
    ? product.images[0]
    : (product.image || '/placeholder-image.svg');

  return {
    title: `${product.title || product.name} | Khashika – Bijoux de Luxe`,
    description: typeof product.description === 'string' 
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : 'Bijou artisanal indien',
    openGraph: {
      title: `${product.title || product.name} | Khashika`,
      description: typeof product.description === 'string' 
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
        : 'Bijou artisanal indien',
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title || product.name} | Khashika`,
      description: typeof product.description === 'string' 
        ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
        : 'Bijou artisanal indien',
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f4f1eb] min-h-screen mt-24">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        {/* Layout Split Screen: 60% Images / 40% Info (Desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-24 mb-12">
          {/* Colonne gauche - Galerie (60%) */}
          <div className="w-full">
            <ProductMediaGallery product={product} />
          </div>

          {/* Colonne droite - Module de conversion (40% - Sticky) */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductConversionModule product={product} />
          </div>
        </div>

        {/* Section Informations (pleine largeur) */}
        <div className="mt-12">
          <ProductInfoTabs product={product} />
        </div>
      </div>
    </div>
  );
}
