import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';

export const metadata: Metadata = {
  title: 'Bijoux par Pierre | Khashika',
  description: 'Découvrez nos bijoux classés par pierre : turquoise, améthyste, lapis lazuli, corail et bien d\'autres pierres naturelles.',
  openGraph: {
    title: 'Bijoux par Pierre - Khashika',
    description: 'Collection de bijoux indiens organisée par pierre naturelle',
  }
};

export default async function PierresPage() {
  const allProducts = await getAllProducts();
  
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero section */}
      <div className="bg-[#FDFBF7] border-b border-[#D4AF37]/20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl text-center">Bijoux par Pierre</h1>
          <p className="text-center text-foreground/60 mt-2 max-w-2xl mx-auto">
            Explorez notre collection de bijoux organisée par pierre naturelle
          </p>
        </div>
      </div>
      
      <ShopClient 
        initialProducts={allProducts}
      />
    </div>
  );
}

