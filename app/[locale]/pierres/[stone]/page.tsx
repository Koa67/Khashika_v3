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
    title: `${stoneInfo.label}`,
    description: stoneInfo.description,
    openGraph: {
      title: `${stoneInfo.label} - Bijoux Indiens`,
      description: stoneInfo.description,
    }
  };
}

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const stones = getAllPierresStoneSlugs();
  return locales.flatMap((locale) => stones.map((stone) => ({ locale, stone })));
}

export default async function PierresStonePage({ params }: { params: Promise<PageParams> }) {
  const { stone } = await params;
  const stoneInfo = PIERRES_STONE_MAP[stone];
  
  if (!stoneInfo) {
    notFound();
  }
  
  const allProducts = await getAllProducts();
  
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="bg-[#FDFBF7] border-b border-[#D4AF37]/20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl text-center">{stoneInfo.label}</h1>
          <p className="text-center text-foreground/60 mt-2 max-w-2xl mx-auto">{stoneInfo.description}</p>
        </div>
      </div>
      
      <ShopClient 
        initialProducts={allProducts}
        initialFilters={{ stones: [stoneInfo.filter] }}
        hideStoneFilter={true}
      />
    </div>
  );
}
