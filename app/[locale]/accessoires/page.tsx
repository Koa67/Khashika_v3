import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';
import { FILTER_CONFIG } from '@/lib/types/filters';

export const metadata: Metadata = {
  title: 'Accessoires Indiens | Khashika',
  description: 'Découvrez notre collection d\'accessoires indiens : pashminas, foulards, pochettes, sacs et bien d\'autres accessoires artisanaux.',
  openGraph: {
    title: 'Accessoires Indiens - Khashika',
    description: 'Collection d\'accessoires indiens artisanaux en soie, cachemire et coton',
  }
};

export default async function AccessoiresPage() {
  const allProducts = await getAllProducts();
  
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero section */}
      <div className="bg-[#FDFBF7] border-b border-[#D4AF37]/20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl text-center">Accessoires Indiens</h1>
          <p className="text-center text-foreground/60 mt-2 max-w-2xl mx-auto">
            Découvrez notre collection d'accessoires indiens faits main : pashminas, foulards, pochettes et sacs
          </p>
        </div>
      </div>
      
      <ShopClient 
        initialProducts={allProducts}
      />
    </div>
  );
}

