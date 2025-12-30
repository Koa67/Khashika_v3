'use client';

import { useMemo } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProductGrid({ products, searchParams }: ProductGridProps) {
  // Filtrer les produits côté client pour éviter les erreurs d'hydratation
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    const category = searchParams.category?.toString();
    const query = searchParams.q?.toString() || searchParams.search?.toString();
    
    if (category) {
      const categoryLower = category.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const productCategory = (product.category || '').toLowerCase();
        const productName = (product.name || product.title || '').toLowerCase();
        return (
          productCategory.includes(categoryLower) ||
          productName.includes(categoryLower)
        );
      });
    }
    
    if (query) {
      const queryLower = query.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const productName = (product.name || product.title || '').toLowerCase();
        const productDescription = (product.description || '').toLowerCase();
        const productCategory = (product.category || '').toLowerCase();
        const productMaterial = (product.material || '').toLowerCase();
        const productStone = (product.stone || '').toLowerCase();
        
        return (
          productName.includes(queryLower) ||
          productDescription.includes(queryLower) ||
          productCategory.includes(queryLower) ||
          productMaterial.includes(queryLower) ||
          productStone.includes(queryLower)
        );
      });
    }
    
    return filtered;
  }, [products, searchParams]);

  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="font-serif text-xl text-[#2D2420]">
          Aucun produit ne correspond à vos critères.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((product, index) => (
        <ProductCard 
          key={product.id || product.slug || `product-${index}`} 
          product={product} 
          priority={index < 4}
        />
      ))}
    </div>
  );
}

