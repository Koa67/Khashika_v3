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
  
  // Filtrer les produits avec pierres
  const pierres = allProducts.filter(p => {
    const stone = (p.stone || p.attributes?.stone || '').toLowerCase();
    const name = (p.name || p.title || '').toLowerCase();
    return stone.length > 0 || 
           name.includes('turquoise') ||
           name.includes('améthyste') ||
           name.includes('amethyste') ||
           name.includes('lapis') ||
           name.includes('corail') ||
           name.includes('grenat') ||
           name.includes('pierre') ||
           name.includes('onyx') ||
           name.includes('jade') ||
           name.includes('perle') ||
           name.includes('moonstone') ||
           name.includes('labradorite');
  });

  return (
    <ShopClient 
      initialProducts={pierres}
      pageTitle="Bijoux par Pierre"
      pageSubtitle="Explorez notre collection de bijoux organisée par pierre naturelle"
    />
  );
}

