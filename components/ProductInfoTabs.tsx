'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface ProductInfoTabsProps {
  product: Product;
}

export default function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  return (
    <div className="mt-8 space-y-12">
      {/* Description - Toujours visible */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2D2420] mb-4">Description</h2>
        <div className="prose max-w-none">
          {product.description && product.description.includes('<') ? (
            <div 
              className="font-sans text-[#2D2420]/70 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : (
            <p className="font-sans text-[#2D2420]/70 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* Caractéristiques - Toujours visible */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2D2420] mb-4">Caractéristiques</h2>
        <div className="space-y-3">
            {/* Afficher d'abord les attributs (nouveaux) depuis product.attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 ? (
              <>
                {product.attributes.stone && (
                  <div className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                    <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px]">
                      Pierre :
                    </span>
                    <span className="font-sans text-[#2D2420]/70">{product.attributes.stone}</span>
                  </div>
                )}
                {product.attributes.material && (
                  <div className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                    <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px]">
                      Matière :
                    </span>
                    <span className="font-sans text-[#2D2420]/70">{product.attributes.material}</span>
                  </div>
                )}
                {product.attributes.dimensions && (
                  <div className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                    <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px]">
                      Dimensions :
                    </span>
                    <span className="font-sans text-[#2D2420]/70">{product.attributes.dimensions}</span>
                  </div>
                )}
                {product.attributes.origin && (
                  <div className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                    <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px]">
                      Origine :
                    </span>
                    <span className="font-sans text-[#2D2420]/70">{product.attributes.origin}</span>
                  </div>
                )}
              </>
            ) : null}
            
            {/* Fallback: Afficher aussi les champs directs (product.stone, product.material) */}
            {(!product.attributes || Object.keys(product.attributes).length === 0) && (
              <>
                {product.stone && (
                  <div className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                    <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px]">
                      Pierre :
                    </span>
                    <span className="font-sans text-[#2D2420]/70">{product.stone}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                    <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px]">
                      Matière :
                    </span>
                    <span className="font-sans text-[#2D2420]/70">{product.material}</span>
                  </div>
                )}
              </>
            )}
            
            {/* Fallback vers characteristics (ancien format) */}
            {product.characteristics && Object.keys(product.characteristics).length > 0 ? (
              Object.entries(product.characteristics).map(([key, value]) => (
                <div key={key} className="flex gap-4 py-2 border-b border-[#8B4E4E]/10">
                  <span className="font-serif font-semibold text-[#8B4E4E] min-w-[120px] capitalize">
                    {key} :
                  </span>
                  <span className="font-sans text-[#2D2420]/70">{String(value)}</span>
                </div>
              ))
            ) : (
              (!product.attributes || Object.keys(product.attributes).length === 0) && 
              !product.stone && 
              !product.material && (
                <p className="font-sans text-[#2D2420]/60">Aucune caractéristique disponible.</p>
              )
            )}
          </div>
      </div>

      {/* Avis Clients - Toujours visible */}
      <div>
        <h2 className="font-serif text-2xl font-bold text-[#2D2420] mb-4">Avis Clients</h2>
        <div className="space-y-6">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((review, index) => (
                <div key={index} className="border-b border-emerald/10 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-display font-semibold text-emerald">
                      {review.author}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-lg ${i < review.rating ? 'text-[#E8B71B]' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="font-body text-xs text-anthracite/50">{review.date}</span>
                  </div>
                  <p className="font-body text-anthracite/70">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="font-body text-anthracite/60">Aucun avis pour le moment.</p>
            )}
          </div>
      </div>
    </div>
  );
}



