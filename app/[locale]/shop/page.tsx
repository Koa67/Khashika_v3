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
  searchParams: Promise<{ q?: string; type?: string; types?: string; stones?: string; materials?: string; accessories?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const allProducts = await getAllProducts();
  const params = await searchParams;
  const searchQuery = params.q || '';
  console.log("🔍 SERVER params:", params);
  
  // Filtrer les produits si une recherche est active
  let filteredProducts = allProducts;
  
  if (searchQuery) {
    const query = searchQuery.trim().toLowerCase();
    
    // Recherche exacte/contient dans les champs principaux
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exactMatches = allProducts.filter((p: any) => {
      const name = String(p.name || '').toLowerCase();
      const productType = String(p.type || '').toLowerCase();
      const category = String(p.category || '').toLowerCase();
      const description = String(p.description || '').toLowerCase();
      const material = String(p.material || '').toLowerCase();
      
      // Gérer stones comme array
      const stonesArr = p.stones;
      const stones = Array.isArray(stonesArr) ? stonesArr.join(' ').toLowerCase() : '';
      
      // Match exact ou contient dans nom, type, catégorie, pierres, matériau
      return name.includes(query) || 
             productType.includes(query) || 
             category.includes(query) ||
             stones.includes(query) ||
             material.includes(query) ||
             description.includes(query);
    });
    
    // Si on a des résultats exacts, les utiliser
    if (exactMatches.length > 0) {
      filteredProducts = exactMatches;
    } else {
      // Sinon, fallback sur Fuse.js mais plus strict
      const fuse = new Fuse(allProducts, {
        keys: [
          { name: 'name', weight: 0.5 },
          { name: 'type', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'stones', weight: 0.2 },
          { name: 'material', weight: 0.1 },
        ],
        threshold: 0.2,
        distance: 50,
        ignoreLocation: true,
        minMatchCharLength: 3,
        shouldSort: true,
      });
      const results = fuse.search(query);
      filteredProducts = results.map(r => r.item);
    }
  }
  
  // IMPORTANT: Si une recherche est active (q), on n'applique PAS les autres filtres
  let initialFilters: Record<string, string[]> | undefined = undefined;
  
  if (!searchQuery) {
    // Seulement appliquer les filtres URL s'il n'y a PAS de recherche active
    const typeFilter = params.type || params.types || '';
    const stonesFilter = params.stones || '';
    const materialsFilter = params.materials || '';
    const accessoriesFilter = params.accessories || '';
    
    if (typeFilter || stonesFilter || materialsFilter || accessoriesFilter) {
      initialFilters = {};
      if (typeFilter) initialFilters.types = typeFilter.split(',');
      if (stonesFilter) initialFilters.stones = stonesFilter.split(',');
      if (materialsFilter) initialFilters.materials = materialsFilter.split(',');
  console.log("🔍 initialFilters final:", initialFilters);
      if (accessoriesFilter) initialFilters.accessories = accessoriesFilter.split(',');
    }
  }

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
