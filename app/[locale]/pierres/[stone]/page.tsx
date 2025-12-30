import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';
import { PIERRES_STONE_MAP, getAllPierresStoneSlugs } from '@/lib/constants/categories';

type PageParams = { stone: string; locale: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { stone } = await params;
  const stoneInfo = PIERRES_STONE_MAP[stone];
  
  if (!stoneInfo) {
    return { title: 'Pierres | Khashika' };
  }
  
  return {
    title: `${stoneInfo.label} | Pierres Précieuses`,
    description: stoneInfo.description,
    openGraph: {
      title: `${stoneInfo.label} - Bijoux en Pierre Naturelle`,
      description: stoneInfo.description,
    }
  };
}

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const stones = getAllPierresStoneSlugs();
  return locales.flatMap((locale) => stones.map((stone) => ({ locale, stone })));
}

export default async function PierresTypePage({ params }: { params: Promise<PageParams> }) {
  const { stone } = await params;
  const stoneInfo = PIERRES_STONE_MAP[stone];
  
  if (!stoneInfo) {
    notFound();
  }
  
  const allProducts = await getAllProducts();
  
  return (
    <ShopClient 
      initialProducts={allProducts}
      initialFilters={{ stones: [stoneInfo.filter] }}
      pageTitle={stoneInfo.label}
      pageSubtitle={stoneInfo.description}
    />
  );
}
