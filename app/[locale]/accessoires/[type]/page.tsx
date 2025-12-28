import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';
import { ACCESSOIRES_TYPE_MAP, getAllAccessoiresTypeSlugs } from '@/lib/constants/categories';

type PageParams = { type: string; locale: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { type } = await params;
  const typeInfo = ACCESSOIRES_TYPE_MAP[type];
  
  if (!typeInfo) {
    return { title: 'Accessoires | Khashika' };
  }
  
  return {
    title: `${typeInfo.label} | Accessoires Indiens`,
    description: typeInfo.description,
    openGraph: {
      title: `${typeInfo.label} - Accessoires Indiens Artisanaux`,
      description: typeInfo.description,
    }
  };
}

export async function generateStaticParams() {
  const locales = ['fr', 'en'];
  const types = getAllAccessoiresTypeSlugs();
  return locales.flatMap((locale) => types.map((type) => ({ locale, type })));
}

export default async function AccessoiresTypePage({ params }: { params: Promise<PageParams> }) {
  const { type } = await params;
  const typeInfo = ACCESSOIRES_TYPE_MAP[type];
  
  if (!typeInfo) {
    notFound();
  }
  
  const allProducts = await getAllProducts();
  
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="bg-[#FDFBF7] border-b border-[#D4AF37]/20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl text-center">{typeInfo.label}</h1>
          <p className="text-center text-foreground/60 mt-2 max-w-2xl mx-auto">{typeInfo.description}</p>
        </div>
      </div>
      
      <ShopClient 
        initialProducts={allProducts}
        initialFilters={{ accessories: [typeInfo.filter] }}
        hideAccessoryFilter={true}
      />
    </div>
  );
}
