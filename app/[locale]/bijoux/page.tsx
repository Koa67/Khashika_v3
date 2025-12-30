import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';

export const metadata: Metadata = {
  title: 'Bijoux Indiens Authentiques | Khashika',
  description: 'Découvrez notre collection complète de bijoux indiens faits main : bagues, colliers, bracelets, boucles d\'oreilles en argent et pierres naturelles.',
  openGraph: {
    title: 'Bijoux Indiens Authentiques - Khashika',
    description: 'Collection de bijoux indiens artisanaux en argent et pierres précieuses',
  }
};

export default async function BijouxPage() {
  const allProducts = await getAllProducts();
  
  // Filtrer les bijoux (pas les accessoires)
  const bijoux = allProducts.filter(p => {
    const cat = (p.category || '').toLowerCase();
    const name = (p.name || p.title || '').toLowerCase();
    return cat.includes('bijoux') || 
           cat.includes('collier') || 
           cat.includes('bracelet') || 
           cat.includes('bague') || 
           cat.includes('boucle') ||
           cat.includes('pendentif') ||
           name.includes('collier') ||
           name.includes('bracelet') ||
           name.includes('bague') ||
           name.includes('boucle') ||
           name.includes('pendentif');
  });

  return (
    <ShopClient 
      initialProducts={bijoux}
      pageTitle="Bijoux"
      pageSubtitle="Découvrez notre collection de bijoux artisanaux"
    />
  );
}

