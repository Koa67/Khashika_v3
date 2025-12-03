import type { Metadata } from 'next';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';

export const metadata: Metadata = {
  title: 'Boutique - Bijoux Indiens Authentiques | Khashika',
  description: 'Découvrez notre collection de bijoux indiens faits main : bracelets, colliers, boucles d\'oreilles en argent. Artisanat authentique.',
};

export default async function ShopPage() {
  // Charger les produits côté serveur (peut utiliser fs)
  const allProducts = await getAllProducts();

  // Passer les produits au composant client pour le filtrage
  return <ShopClient initialProducts={allProducts} />;
}
