'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';

interface ProductInfoTabsProps {
  product: Product;
}

export default function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState<'description' | 'characteristics' | 'reviews'>(
    'description'
  );

  const tabs = [
    { id: 'description' as const, label: 'Description' },
    { id: 'characteristics' as const, label: 'Caractéristiques' },
    { id: 'reviews' as const, label: 'Avis Clients' },
  ];

  return (
    <div className="mt-8">
      {/* Onglets Desktop */}
      <div className="hidden md:block border-b border-emerald/10">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-display font-semibold text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald text-emerald'
                  : 'border-transparent text-anthracite/60 hover:text-emerald'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu Desktop */}
      <div className="hidden md:block mt-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            {product.description && product.description.includes('<') ? (
              <div 
                className="font-body text-anthracite/70 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
            <p className="font-body text-anthracite/70 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
            )}
          </div>
        )}

        {activeTab === 'characteristics' && (
          <div className="space-y-3">
            {/* Afficher d'abord les attributs (nouveaux) depuis product.attributes */}
            {product.attributes && Object.keys(product.attributes).length > 0 ? (
              <>
                {product.attributes.stone && (
                  <div className="flex gap-4 py-2 border-b border-[#2596be]/10">
                    <span className="font-serif font-semibold text-[#2596be] min-w-[120px]">
                      Pierre :
                    </span>
                    <span className="font-sans text-[#1a1a1a]/70">{product.attributes.stone}</span>
                  </div>
                )}
                {product.attributes.material && (
                  <div className="flex gap-4 py-2 border-b border-[#2596be]/10">
                    <span className="font-serif font-semibold text-[#2596be] min-w-[120px]">
                      Matière :
                    </span>
                    <span className="font-sans text-[#1a1a1a]/70">{product.attributes.material}</span>
                  </div>
                )}
                {product.attributes.dimensions && (
                  <div className="flex gap-4 py-2 border-b border-[#2596be]/10">
                    <span className="font-serif font-semibold text-[#2596be] min-w-[120px]">
                      Dimensions :
                    </span>
                    <span className="font-sans text-[#1a1a1a]/70">{product.attributes.dimensions}</span>
                  </div>
                )}
                {product.attributes.origin && (
                  <div className="flex gap-4 py-2 border-b border-[#2596be]/10">
                    <span className="font-serif font-semibold text-[#2596be] min-w-[120px]">
                      Origine :
                    </span>
                    <span className="font-sans text-[#1a1a1a]/70">{product.attributes.origin}</span>
                  </div>
                )}
              </>
            ) : null}
            
            {/* Fallback: Afficher aussi les champs directs (product.stone, product.material) */}
            {(!product.attributes || Object.keys(product.attributes).length === 0) && (
              <>
                {product.stone && (
                  <div className="flex gap-4 py-2 border-b border-[#2596be]/10">
                    <span className="font-serif font-semibold text-[#2596be] min-w-[120px]">
                      Pierre :
                    </span>
                    <span className="font-sans text-[#1a1a1a]/70">{product.stone}</span>
                  </div>
                )}
                {product.material && (
                  <div className="flex gap-4 py-2 border-b border-[#2596be]/10">
                    <span className="font-serif font-semibold text-[#2596be] min-w-[120px]">
                      Matière :
                    </span>
                    <span className="font-sans text-[#1a1a1a]/70">{product.material}</span>
                  </div>
                )}
              </>
            )}
            
            {/* Fallback vers characteristics (ancien format) */}
            {product.characteristics && Object.keys(product.characteristics).length > 0 ? (
              Object.entries(product.characteristics).map(([key, value]) => (
                <div key={key} className="flex gap-4 py-2 border-b border-[#2596be]/10">
                  <span className="font-serif font-semibold text-[#2596be] min-w-[120px] capitalize">
                    {key} :
                  </span>
                  <span className="font-sans text-[#1a1a1a]/70">{String(value)}</span>
                </div>
              ))
            ) : (
              (!product.attributes || Object.keys(product.attributes).length === 0) && 
              !product.stone && 
              !product.material && (
                <p className="font-sans text-[#1a1a1a]/60">Aucune caractéristique disponible.</p>
              )
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
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
                          className={i < review.rating ? 'text-gold' : 'text-anthracite/20'}
                        >
                          ⭐
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
        )}
      </div>

      {/* Accordéon Mobile */}
      <div className="md:hidden space-y-4">
        {tabs.map((tab) => (
          <div key={tab.id} className="border border-emerald/10 rounded">
            <button
              onClick={() =>
                setActiveTab(activeTab === tab.id ? 'description' : tab.id)
              }
              className="w-full px-4 py-3 flex items-center justify-between font-display font-semibold text-sm text-emerald"
            >
              <span>{tab.label}</span>
              <span>{activeTab === tab.id ? '−' : '+'}</span>
            </button>
            {activeTab === tab.id && (
              <div className="px-4 pb-4 border-t border-emerald/10">
                {tab.id === 'description' && (
                  <div className="mt-4">
                    {product.description && product.description.includes('<') ? (
                      <div 
                        className="font-body text-anthracite/70 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: product.description }}
                      />
                    ) : (
                      <p className="font-body text-anthracite/70 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                    )}
                  </div>
                )}
                {tab.id === 'characteristics' && (
                  <div className="space-y-3 mt-4">
                    {/* Afficher d'abord les attributs (nouveaux) depuis product.attributes */}
                    {product.attributes && Object.keys(product.attributes).length > 0 ? (
                      <>
                        {product.attributes.stone && (
                          <div className="flex gap-4 py-2">
                            <span className="font-serif font-semibold text-[#2596be] min-w-[100px]">
                              Pierre :
                            </span>
                            <span className="font-sans text-[#1a1a1a]/70">{product.attributes.stone}</span>
                          </div>
                        )}
                        {product.attributes.material && (
                          <div className="flex gap-4 py-2">
                            <span className="font-serif font-semibold text-[#2596be] min-w-[100px]">
                              Matière :
                            </span>
                            <span className="font-sans text-[#1a1a1a]/70">{product.attributes.material}</span>
                          </div>
                        )}
                        {product.attributes.dimensions && (
                          <div className="flex gap-4 py-2">
                            <span className="font-serif font-semibold text-[#2596be] min-w-[100px]">
                              Dimensions :
                            </span>
                            <span className="font-sans text-[#1a1a1a]/70">{product.attributes.dimensions}</span>
                          </div>
                        )}
                        {product.attributes.origin && (
                          <div className="flex gap-4 py-2">
                            <span className="font-serif font-semibold text-[#2596be] min-w-[100px]">
                              Origine :
                            </span>
                            <span className="font-sans text-[#1a1a1a]/70">{product.attributes.origin}</span>
                          </div>
                        )}
                      </>
                    ) : null}
                    
                    {/* Fallback: Afficher aussi les champs directs (product.stone, product.material) */}
                    {(!product.attributes || Object.keys(product.attributes).length === 0) && (
                      <>
                        {product.stone && (
                          <div className="flex gap-4 py-2">
                            <span className="font-serif font-semibold text-[#2596be] min-w-[100px]">
                              Pierre :
                            </span>
                            <span className="font-sans text-[#1a1a1a]/70">{product.stone}</span>
                          </div>
                        )}
                        {product.material && (
                          <div className="flex gap-4 py-2">
                            <span className="font-serif font-semibold text-[#2596be] min-w-[100px]">
                              Matière :
                            </span>
                            <span className="font-sans text-[#1a1a1a]/70">{product.material}</span>
                          </div>
                        )}
                      </>
                    )}
                    
                    {/* Fallback vers characteristics (ancien format) */}
                    {product.characteristics && Object.keys(product.characteristics).length > 0 ? (
                      Object.entries(product.characteristics).map(([key, value]) => (
                        <div key={key} className="flex gap-4 py-2">
                          <span className="font-serif font-semibold text-[#2596be] min-w-[100px] capitalize">
                            {key} :
                          </span>
                          <span className="font-sans text-[#1a1a1a]/70">{String(value)}</span>
                        </div>
                      ))
                    ) : (
                      (!product.attributes || Object.keys(product.attributes).length === 0) && 
                      !product.stone && 
                      !product.material && (
                        <p className="font-sans text-[#1a1a1a]/60">
                        Aucune caractéristique disponible.
                      </p>
                      )
                    )}
                  </div>
                )}
                {tab.id === 'reviews' && (
                  <div className="space-y-6 mt-4">
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
                                  className={
                                    i < review.rating ? 'text-gold' : 'text-anthracite/20'
                                  }
                                >
                                  ⭐
                                </span>
                              ))}
                            </div>
                            <span className="font-body text-xs text-anthracite/50">
                              {review.date}
                            </span>
                          </div>
                          <p className="font-body text-anthracite/70">{review.comment}</p>
                        </div>
                      ))
                    ) : (
                      <p className="font-body text-anthracite/60">
                        Aucun avis pour le moment.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}



