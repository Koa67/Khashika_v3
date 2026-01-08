import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from '@/navigation';
import Image from 'next/image';
import { ChevronRight, Heart, ShoppingBag, Truck, RotateCcw, Shield, ZoomIn, Sparkles } from 'lucide-react';
import { getProductBySlug } from '@/lib/utils/products';
import { getAllProducts } from '@/lib/data/products-loader';
import ProductCard from '@/components/ProductCard';
import ProductPageClient from '@/components/product/ProductPageClient';
import TrackProductView from '@/components/product/TrackProductView';
import RecentlyViewed from '@/components/boutique/RecentlyViewed';
import PersonalizedRecommendations from '@/components/product/PersonalizedRecommendations';
import { getValidImageUrl } from '@/lib/utils/images';
import ImageMagnifier from '@/components/ImageMagnifier';
import { inferCategory } from '@/lib/utils/inferCategory';
import { findStoneByName } from '@/lib/data/stones';

function safeDecodeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

function normalizeSlug(slug: string): string {
  return safeDecodeSlug(slug).normalize('NFC').toLowerCase();
}

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const wanted = normalizeSlug(slug);

  const product = await getProductBySlug(wanted);

  if (!product) {
    return {
      title: 'Produit introuvable | Khashika',
    };
  }

  const title = product.title || product.name || 'Produit';
  const description =
    typeof product.description === 'string'
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160)
      : 'Bijou artisanal indien';

  const imageUrl =
    product.images && product.images.length > 0 && product.images[0]
      ? product.images[0]
      : product.image || '/placeholder-image.svg';

  return {
    title: `${title} | Khashika – Bijoux de Luxe`,
    description,
    openGraph: {
      title: `${title} | Khashika`,
      description,
      images: [imageUrl],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Khashika`,
      description,
    },
    alternates: {
      canonical: `/product/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const locale = 'fr';
  const wanted = normalizeSlug(slug);

  const product = await getProductBySlug(wanted);

  if (!product) {
    notFound();
  }

  // Get similar products
  const allProducts = await getAllProducts();
  const currentPrice = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const priceRange = { min: currentPrice * 0.8, max: currentPrice * 1.2 };
  
  const similarProducts = allProducts
    .filter(p => {
      if (p.id === product.id) return false;
      
      const sameCategory = p.category === product.category;
      const sameStone = (product.attributes?.stone && p.attributes?.stone === product.attributes.stone) ||
                        (product.stone && p.stone === product.stone);
      const pPrice = typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0));
      const samePriceRange = pPrice >= priceRange.min && pPrice <= priceRange.max;
      
      return sameCategory || sameStone || samePriceRange;
    })
    .slice(0, 4);

  // Get breadcrumb info (category, label, and URL)
  const getBreadcrumbInfo = (cat: string, productName: string) => {
    const nameLower = (productName || '').toLowerCase();
    
    // First, check for accessories
    const accToBreadcrumb: Record<string, { parentCategory: string; typeSlug: string; label: string }> = {
      'pashmina': { parentCategory: 'accessoires', typeSlug: 'pashminas', label: 'Pashminas' },
      'étole': { parentCategory: 'accessoires', typeSlug: 'pashminas', label: 'Pashminas' },
      'châle': { parentCategory: 'accessoires', typeSlug: 'pashminas', label: 'Pashminas' },
      'foulard': { parentCategory: 'accessoires', typeSlug: 'foulards', label: 'Foulards' },
      'écharpe': { parentCategory: 'accessoires', typeSlug: 'foulards', label: 'Foulards' },
      'pochette': { parentCategory: 'accessoires', typeSlug: 'pochettes', label: 'Pochettes' },
      'sac': { parentCategory: 'accessoires', typeSlug: 'sacs', label: 'Sacs' },
      'soie': { parentCategory: 'accessoires', typeSlug: 'soie', label: 'Soie' },
      'porte-clé': { parentCategory: 'accessoires', typeSlug: 'porte-cles', label: 'Porte-clés' },
      'porte-cles': { parentCategory: 'accessoires', typeSlug: 'porte-cles', label: 'Porte-clés' },
      'chouchou': { parentCategory: 'accessoires', typeSlug: 'chouchous', label: 'Chouchous' },
      'bandana': { parentCategory: 'accessoires', typeSlug: 'bandanas', label: 'Bandanas' },
      'marque-page': { parentCategory: 'accessoires', typeSlug: 'marque-pages', label: 'Marque-pages' },
      'carnet': { parentCategory: 'accessoires', typeSlug: 'carnets', label: 'Carnets' },
      'figurine': { parentCategory: 'accessoires', typeSlug: 'decoration', label: 'Décoration' },
    };
    
    for (const [key, info] of Object.entries(accToBreadcrumb)) {
      if (nameLower.includes(key)) {
        return info;
      }
    }
    
    // Then infer type for bijoux
    const inferredType = inferCategory(productName || '');
    
    const typeToBreadcrumb: Record<string, { parentCategory: string; typeSlug: string; label: string }> = {
      'bague': { parentCategory: 'bijoux', typeSlug: 'bagues', label: 'Bagues' },
      'bracelet': { parentCategory: 'bijoux', typeSlug: 'bracelets', label: 'Bracelets' },
      'collier': { parentCategory: 'bijoux', typeSlug: 'colliers', label: 'Colliers' },
      'boucle': { parentCategory: 'bijoux', typeSlug: 'boucles-oreilles', label: "Boucles d'oreilles" },
      'pendentif': { parentCategory: 'bijoux', typeSlug: 'pendentifs', label: 'Pendentifs' },
      'chaine': { parentCategory: 'bijoux', typeSlug: 'chaines', label: 'Chaînes' },
      'cheville': { parentCategory: 'bijoux', typeSlug: 'chevilles', label: 'Chevilles' },
      'parure': { parentCategory: 'bijoux', typeSlug: 'parures', label: 'Parures' },
    };
    
    if (inferredType && typeToBreadcrumb[inferredType]) {
      return typeToBreadcrumb[inferredType];
    }
    
    // Final fallback based on category
    const catLower = cat.toLowerCase();
    if (catLower.includes('bijou')) {
      return { parentCategory: 'bijoux', typeSlug: '', label: 'Bijoux' };
    }
    if (catLower.includes('accessoire')) {
      return { parentCategory: 'accessoires', typeSlug: '', label: 'Accessoires' };
    }
    if (catLower.includes('pierre')) {
      return { parentCategory: 'pierres', typeSlug: '', label: 'Pierres' };
    }
    
    // Return null to avoid duplicate "Boutique"
    return null;
  };

  const breadcrumbInfo = getBreadcrumbInfo(product.type || '', product.title || product.name || '');
  const categoryUrl = breadcrumbInfo?.typeSlug 
    ? `/${breadcrumbInfo.parentCategory}/${breadcrumbInfo.typeSlug}`
    : breadcrumbInfo ? `/${breadcrumbInfo.parentCategory}` : '/shop';
  const stone = product.attributes?.stone || product.stone || (product.stones && product.stones.length > 0 ? product.stones[0] : undefined);
  const material = product.attributes?.material || product.material;
  const dimensions = product.attributes?.dimensions;
  const origin = product.attributes?.origin;
  const price = typeof product.price === 'number' ? product.price : parseFloat(String(product.price || 0));
  const displayPrice = price > 0 ? `${price.toFixed(2)}` : '0';

  const mainImage = getValidImageUrl(
    product.images && product.images.length > 0 
      ? product.images[0] 
      : product.image
  );
  const gallery = product.images && product.images.length > 1 
    ? product.images.slice(1, 5).map(img => getValidImageUrl(img))
    : [];

  return (
    <div className="min-h-screen bg-white">
      <TrackProductView product={product} />
      {/* BREADCRUMB */}
      <div className="bg-[#FAF9F7] border-b border-[#EAB615]/20">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-[#2D2926]/60">
            <Link href="/" className="hover:text-gold-fusion transition-colors">Accueil</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-gold-fusion transition-colors">Boutique</Link>
            {breadcrumbInfo && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={categoryUrl} className="hover:text-gold-fusion transition-colors">{breadcrumbInfo.label}</Link>
              </>
            )}
            {stone && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href="/pierres" className="hover:text-gold-fusion transition-colors">{stone}</Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#2D2926] font-medium truncate max-w-[200px]">{product.title || product.name}</span>
          </nav>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* COLONNE GAUCHE - Images */}
          <div className="space-y-3">
            <div className="relative">
              <ImageMagnifier
                src={mainImage}
                alt={product.title || product.name}
                magnifierSize={180}
                zoomLevel={2.5}
              />
            </div>
            
            {gallery.length > 0 && (
              <div className="flex gap-2">
                {gallery.map((img, i) => (
                  <button key={i} className="group relative w-20 h-20 border border-[#EAB615]/20 hover:border-[#EAB615] transition-colors overflow-hidden">
                    <Image src={img} alt="" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-200">
                      <ZoomIn className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* COLONNE DROITE - Infos */}
          <div className="space-y-4">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl text-[#2D2926] leading-tight">
                {product.title || product.name}
              </h1>
              <p className="text-3xl font-bold text-gold-fusion mt-2">
                {displayPrice} €
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {stone && (
                <span className="px-3 py-1 text-xs bg-[#FAF9F7] border border-[#EAB615]/30 text-[#2D2926]">
                  Pierre : {stone}
                </span>
              )}
              {material && (
                <span className="px-3 py-1 text-xs bg-[#FAF9F7] border border-[#EAB615]/30 text-[#2D2926]">
                  {material}
                </span>
              )}
              {product.inStock && (
                <span className="px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700">
                  En stock
                </span>
              )}
            </div>

            <ProductPageClient product={product} type="cta-buttons" />

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#EAB615]/20">
              <div className="flex flex-col items-center text-center gap-1">
                <Truck className="w-5 h-5 text-gold-fusion" />
                <span className="text-[10px] text-[#2D2926]/60">Livraison offerte dès 50 €</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <RotateCcw className="w-5 h-5 text-gold-fusion" />
                <span className="text-[10px] text-[#2D2926]/60">Retours gratuits 30j</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Shield className="w-5 h-5 text-gold-fusion" />
                <span className="text-[10px] text-[#2D2926]/60">Paiement sécurisé</span>
              </div>
            </div>

            {product.description && (
              <div className="pt-4 border-t border-[#EAB615]/20">
                <h2 className="font-serif text-lg text-[#2D2926] mb-2">Description</h2>
                <div className="text-sm text-[#2D2926]/70 leading-relaxed space-y-2">
                  {typeof product.description === 'string' && product.description.includes('<') ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                  ) : (
                    <p className="whitespace-pre-line">{product.description}</p>
                  )}
                </div>
              </div>
            )}

            {(stone || material || dimensions || origin) && (
              <div className="pt-4 border-t border-[#EAB615]/20">
                <h2 className="font-serif text-lg text-[#2D2926] mb-2">Caractéristiques</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {stone && (
                    <>
                      <dt className="text-[#2D2926]/60">Pierre</dt>
                      <dd className="text-[#2D2926]">{stone}</dd>
                    </>
                  )}
                  {material && (
                    <>
                      <dt className="text-[#2D2926]/60">Matériau</dt>
                      <dd className="text-[#2D2926]">{material}</dd>
                    </>
                  )}
                  {dimensions && (
                    <>
                      <dt className="text-[#2D2926]/60">Dimensions</dt>
                      <dd className="text-[#2D2926]">{dimensions}</dd>
                    </>
                  )}
                  {origin && (
                    <>
                      <dt className="text-[#2D2926]/60">Origine</dt>
                      <dd className="text-[#2D2926]">{origin}</dd>
                    </>
                  )}
                </dl>
              </div>
            )}

            {/* SECTION INFO PIERRE */}
            {stone && (() => {
              const stoneInfo = findStoneByName(stone);
              if (!stoneInfo) return null;
              return (
                <div className="pt-4 border-t border-[#EAB615]/20">
                  <div className="bg-gradient-to-br from-[#FAF9F7] to-[#F5F0E8] rounded-xl p-4 border border-[#EAB615]/20">
                    <div className="flex items-start gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-[#EAB615]/30">
                        <Image
                          src={stoneInfo.image}
                          alt={stoneInfo.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-[#EAB615]" />
                          <h3 className="font-serif text-base font-semibold text-[#2D2926]">
                            {stoneInfo.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#8B4E4E] font-medium mb-2">
                          {stoneInfo.short}
                        </p>
                        <p className="text-xs text-[#2D2926]/70 leading-relaxed">
                          {stoneInfo.full}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#EAB615]/20">
                      <p className="text-[10px] font-semibold text-[#2D2926]/50 uppercase mb-1.5">
                        Signes astrologiques associés
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {stoneInfo.signs.map((sign) => (
                          <span
                            key={sign}
                            className="text-[10px] px-2 py-0.5 bg-white border border-[#EAB615]/30 text-[#2D2926]/70 rounded-full"
                          >
                            {sign}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href="/guide-pierres"
                      className="mt-3 inline-flex items-center gap-1 text-xs text-[#8B4E4E] hover:text-[#6B3D3D] transition-colors"
                    >
                      Voir le guide des pierres
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <RecentlyViewed />
        </div>

        {/* Recommandations personnalisées */}
        <PersonalizedRecommendations
          allProducts={allProducts}
          currentProductId={product.id}
          fallbackProducts={similarProducts}
          title="Sélectionné pour vous"
          limit={4}
        />
      </div>
    </div>
  );
}