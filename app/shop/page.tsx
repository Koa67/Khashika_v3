import type { Metadata } from 'next';
import { getPaginatedProducts } from '@/lib/data/products-loader';
import ProductCard from '@/components/ProductCard';
import Pagination from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Boutique - Bijoux Indiens Authentiques | Khashika',
  description: 'Découvrez notre collection de bijoux indiens faits main : bracelets, colliers, boucles d\'oreilles en argent. Artisanat authentique.',
};

interface ShopPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const PRODUCTS_PER_PAGE = 24;

export default async function ShopPage(props: ShopPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q?.toString() || '';
  const category = searchParams.category?.toString() || '';
  const page = parseInt(searchParams.page?.toString() || '1', 10);

  // Utiliser la pagination avec filtres
  const { products, currentPage, totalPages, totalProducts } = await getPaginatedProducts(
    page,
    PRODUCTS_PER_PAGE,
    { query, category }
  );

  let searchMessage = '';
  if (query) {
    searchMessage = `${totalProducts} résultat${totalProducts > 1 ? 's' : ''} pour "${query}"`;
  } else if (category) {
    searchMessage = `${totalProducts} produit${totalProducts > 1 ? 's' : ''} dans la catégorie "${category}"`;
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-[1600px] mx-auto px-4">
        {/* Header Titre */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">
            {query || category ? 'Résultats de recherche' : 'Nos Collections'}
          </h1>
          {searchMessage && (
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg mb-4">
              {searchMessage}
            </p>
          )}
          {!query && !category && (
            <p className="text-foreground/70 max-w-2xl mx-auto text-lg">
              Découvrez nos bijoux indiens authentiques, faits main avec passion
            </p>
          )}
        </div>
        
        {/* Message si aucun résultat */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-serif text-xl text-foreground mb-4">
              Aucun produit trouvé
            </p>
            <p className="text-foreground/70">
              {query ? `Aucun résultat pour "${query}"` : `Aucun produit dans la catégorie "${category}"`}
            </p>
          </div>
        ) : (
          <>
            {/* LA GRILLE TAILWIND */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {products.map((product, index) => (
                <ProductCard 
                  key={`${product.slug}-${index}`} 
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  baseUrl="/shop"
                  queryParams={{ q: query || undefined, category: category || undefined }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
