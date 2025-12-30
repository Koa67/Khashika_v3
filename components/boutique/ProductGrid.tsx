import { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <p className="text-center text-[#2D2420]/60 font-serif text-lg">
        Aucun produit disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard 
          key={`${product.id}-${product.slug}-${index}`} 
          product={product} 
          priority={index < 4}
        />
      ))}
    </div>
  );
}

