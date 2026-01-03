'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getValidImageUrl } from '@/lib/utils/images';

const STORAGE_KEY = 'khashika_recently_viewed';

export default function RecentlyViewed() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="mt-16 pt-8 border-t border-[#EAB615]/20">
      <h3 className="font-serif text-xl text-[#2D2926] mb-6">Récemment consultés</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/fr/product/${product.slug}`}
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden bg-[#FAF9F7] border border-[#EAB615]/20 group-hover:border-[#EAB615] transition-colors">
              <Image
                src={getValidImageUrl(product.image)}
                alt={product.name || product.title || ''}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              />
            </div>
            <h4 className="mt-2 text-xs text-[#2D2926] line-clamp-2 group-hover:text-[#EAB615] transition-colors">
              {product.name || product.title}
            </h4>
            <p className="text-sm font-bold text-gold-fusion mt-1">
              {typeof product.price === 'number' ? `${product.price} €` : product.price}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
