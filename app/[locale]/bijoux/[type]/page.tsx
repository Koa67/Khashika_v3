import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';
import { BIJOUX_TYPE_MAP, getAllBijouxTypeSlugs } from '@/lib/constants/categories';

type PageParams = { type: string; locale: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { type } = await params;
  const typeInfo = BIJOUX_TYPE_MAP[type];
  
  if (!typeInfo) {
    return { title: 'Bijoux | Khashika' };
  }
  
  return {
    title: `${typeInfo.label} | Bijoux Indiens`,
    description: typeInfo.description,
    openGraph: {
      title: `${typeInfo.label} - Bijoux Indiens Artisanaux`,
      description: typeInfo.description,
    }
  };
}

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const types = getAllBijouxTypeSlugs();
  return locales.flatMap((locale) => types.map((type) => ({ locale, type })));
}

export default async function BijouxTypePage({ params }: { params: Promise<PageParams> }) {
  const { type } = await params;
  const typeInfo = BIJOUX_TYPE_MAP[type];
  
  if (!typeInfo) {
    notFound();
  }
  
  const allProducts = await getAllProducts();
  
  return (
    <ShopClient 
      initialProducts={allProducts}
      initialFilters={{ types: [typeInfo.filter] }}
      pageTitle={typeInfo.label}
      pageSubtitle={typeInfo.description}
    />
  );
}
