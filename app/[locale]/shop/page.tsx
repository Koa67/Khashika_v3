import type { Metadata } from 'next';
import { Suspense } from 'react';
import Fuse from 'fuse.js';
import { getAllProducts } from '@/lib/data/products-loader';
import ShopClient from '@/components/boutique/ShopClient';

export const metadata: Metadata = {
  title: 'Boutique - Bijoux Indiens Authentiques | Khashika',
  description: 'Découvrez notre collection de bijoux indiens faits main : bracelets, colliers, boucles d\'oreilles en argent. Artisanat authentique.',
};

interface ShopPageProps {
  searchParams: Promise<{ q?: string; type?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const allProducts = await getAllProducts();
  const params = await searchParams;
  const searchQuery = params.q || '';
  const typeFilter = params.type || '';

  // Filtrer les produits si une recherche est active - Recherche fuzzy avec Fuse.js
  let filteredProducts = allProducts;
  
  if (searchQuery) {
    // Recherche fuzzy avec Fuse.js - Tolérante aux fautes de frappe
    const fuse = new Fuse(allProducts, {
      keys: [
        { name: 'name', weight: 0.4 },           // Nom = priorité haute
        { name: 'title', weight: 0.4 },         // Titre (alias)
        { name: 'category', weight: 0.2 },       // Catégorie
        { name: 'attributes.stone', weight: 0.2 }, // Pierre (via attributes)
        { name: 'stone', weight: 0.2 },          // Pierre (direct)
        { name: 'attributes.material', weight: 0.1 }, // Matériau (via attributes)
        { name: 'material', weight: 0.1 },       // Matériau (direct)
        { name: 'description', weight: 0.1 },    // Description
      ],
      threshold: 0.4,          // Tolérant aux fautes (0-1, plus haut = plus tolérant)
      distance: 100,           // Distance max entre caractères matchés
      ignoreLocation: true,    // Cherche partout, pas juste au début
      minMatchCharLength: 2,   // Ignore les matchs de 1 caractère
      shouldSort: true,        // Trier par pertinence
      findAllMatches: true,    // Trouver toutes les correspondances
    });

    const results = fuse.search(searchQuery.trim());
    filteredProducts = results.map(r => r.item);
  }

  // Initialiser les filtres si un type est spécifié dans l'URL
  const initialFilters = typeFilter ? { types: [typeFilter] } : undefined;

  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Chargement...</div>}>
      <ShopClient 
        initialProducts={filteredProducts}
        initialFilters={initialFilters}
        pageTitle={searchQuery ? `Résultats pour "${searchQuery}"` : 'Boutique'}
        pageSubtitle={searchQuery 
          ? `${filteredProducts.length} produit${filteredProducts.length > 1 ? 's' : ''} trouvé${filteredProducts.length > 1 ? 's' : ''}`
          : 'Découvrez notre collection de bijoux artisanaux'
        }
        searchQuery={searchQuery}
      />
    </Suspense>
  );
}
