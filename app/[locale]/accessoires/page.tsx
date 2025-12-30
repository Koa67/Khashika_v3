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
  
  // Filtrer les accessoires (pas les bijoux)
  const accessoires = allProducts.filter(p => {
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || p.title || '').toLowerCase();
    return cat.includes('accessoire') || 
           cat.includes('textile') ||
           name.includes('étole') ||
           name.includes('etole') ||
           name.includes('foulard') ||
           name.includes('écharpe') ||
           name.includes('echarpe') ||
           name.includes('pashmina') ||
           name.includes('sac') ||
           name.includes('pochette') ||
           name.includes('trousse');
  });

  return (
    <ShopClient 
      initialProducts={accessoires}
      pageTitle="Accessoires"
      pageSubtitle="Étoles, foulards et accessoires de mode"
    />
  );
}

