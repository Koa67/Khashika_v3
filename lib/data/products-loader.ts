import 'server-only';

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';

import productsData from './products-full.json';
import { Product } from '@/lib/types';
import { slugify } from '@/lib/utils/slugify';
import { createClient } from '@supabase/supabase-js';

function extractProductsFromCatalog(input: unknown): Product[] | null {
  if (Array.isArray(input)) return input as Product[];

  if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    const maybeProducts = obj.products;
    if (Array.isArray(maybeProducts)) return maybeProducts as Product[];
  }

  return null;
}

/**
 * Tente de charger les produits depuis Supabase.
 * Retourne null si env manquantes OU si la requête échoue.
 *
 * NOTE: table par défaut = 'products'
 */
async function tryLoadProductsFromSupabase(): Promise<Product[] | null> {
  const url =
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    '';

  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    '';

  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    auth: { persistSession: false },
  });

  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data) return null;
    return data as unknown as Product[];
  } catch {
    return null;
  }
}

/**
 * Charge les produits depuis Supabase (priorité) puis JSON:
 * 1) env-selected catalog file (default: products-ultimate-MERGED.json)
 * 2) products-ultimate.json
 * 3) products-full.json (fallback)
 */
export async function getAllProducts(): Promise<Product[]> {
  let rawCatalog: unknown = null;

  // 0) Essayer Supabase en premier
  const supabaseProducts = await tryLoadProductsFromSupabase();
  if (supabaseProducts) {
    rawCatalog = supabaseProducts;
  }

  // 1) Fallback JSON (comme avant)
  if (!rawCatalog) {
    const preferred =
      process.env.KHASHIKA_CATALOG_FILE?.trim() ||
      'products-ultimate-MERGED.json';

    const candidates = [
      { file: preferred, label: `✅ Utilisation de ${preferred} (env/default)` },
      {
        file: 'products-ultimate.json',
        label: '✅ Utilisation de products-ultimate.json (catalogue migré)',
      },
      {
        file: 'products-full.json',
        label: '✅ Utilisation de products-full.json (fallback)',
      },
    ] as const;

    for (const c of candidates) {
      try {
        const p = path.join(process.cwd(), 'lib/data', c.file);
        if (fsSync.existsSync(p)) {
          const fileContent = await fs.readFile(p, 'utf-8');
          rawCatalog = JSON.parse(fileContent) as unknown;
          console.log(c.label);
          break;
        }
      } catch {
        // try next candidate
      }
    }
  }

  // 2) Dernier fallback vers l'import statique (products-full.json)
  if (!rawCatalog) {
    rawCatalog = productsData as unknown;
    console.log('📦 Utilisation de products-full.json (fallback import)');
  }

  const productsArray = extractProductsFromCatalog(rawCatalog);

  if (!productsArray || productsArray.length === 0) {
    console.error(
      '❌ Aucun catalogue produit trouvé (Supabase / MERGED / ultimate / full).'
    );
    return [];
  }

  return productsArray.map((p) => {
    // Helper pour obtenir une image valide ou placeholder
    const getValidImage = (img: string | undefined | null): string => {
      if (!img || typeof img !== 'string' || img.trim() === '') {
        return '/placeholder-image.svg';
      }
      // Si l'image est une URL externe, utiliser placeholder
      if (img.startsWith('http://') || img.startsWith('https://')) {
        return '/placeholder-image.svg';
      }
      // Si l'image référence product_*.jpg qui n'existe pas, utiliser placeholder
      if (
        img.includes('product_') &&
        img.match(/product_\d+\.(jpg|jpeg|png)/i)
      ) {
        return '/placeholder-image.svg';
      }
      // Si l'image référence prod-*.jpg/jpeg qui n'existe probablement pas, utiliser placeholder
      if (img.match(/\/prod-\d+\.(jpg|jpeg|png)/i)) {
        return '/placeholder-image.svg';
      }
      // Gérer les chemins _raw_assets
      if (img.includes('_raw_assets')) {
        const filename = img.split('/').pop()?.replace(/%20/g, '_');
        return filename
          ? `/images/products/${filename}`
          : '/placeholder-image.svg';
      }
      // Sinon, utiliser l'image telle quelle
      return img.startsWith('/') ? img : `/images/products/${img}`;
    };

    // Extraire les images valides
    const validImage = getValidImage(p.image || p.image_url);
    let validImages: string[] = [];

    if (p.images && Array.isArray(p.images) && p.images.length > 0) {
      // Filtrer et valider toutes les images du tableau
      validImages = p.images
        .map((img: string) => getValidImage(img))
        .filter((img: string) => img !== '/placeholder-image.svg');

      // Si aucune image valide trouvée, utiliser l'image principale ou placeholder
      if (validImages.length === 0) {
        validImages =
          validImage !== '/placeholder-image.svg'
            ? [validImage]
            : ['/placeholder-image.svg'];
      }
    } else {
      // Pas de tableau images, utiliser l'image principale
      validImages =
        validImage !== '/placeholder-image.svg'
          ? [validImage]
          : ['/placeholder-image.svg'];
    }

    const normalized = {
      ...p,
      id: p.id || slugify(p.name),
      slug: p.slug || slugify(p.name),
      image_url: validImage,
      image: validImage,
      images: validImages.length > 0 ? validImages : ['/placeholder-image.svg'],
      attributes:
        p.attributes ||
        (p.stone || p.material
          ? {
              stone: p.stone,
              material: p.material,
            }
          : undefined),

      material: p.material || p.attributes?.material,
      stone: p.stone || p.attributes?.stone,
      price:
        typeof p.price === 'number' ? p.price : parseFloat(String(p.price || 0)),
    } satisfies Product;

    return normalized;
  });
}

/**
 * Recherche de produits par requête textuelle
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const allProducts = await getAllProducts();
  if (!query) return allProducts;

  const lowerQuery = query.toLowerCase().trim();

  // Filtrage strict mais intelligent
  return allProducts.filter((p) => {
    const nameMatch = p.name?.toLowerCase().includes(lowerQuery) || false;
    const categoryMatch =
      p.category?.toLowerCase().includes(lowerQuery) || false;
    const descMatch =
      p.description &&
      typeof p.description === 'string' &&
      p.description.toLowerCase().includes(lowerQuery);

    return nameMatch || categoryMatch || descMatch;
  });
}

/**
 * Récupère un produit par son slug depuis products-ultimate.json (ou fallback)
 */
export async function getProductBySlugFromJSON(
  slug: string
): Promise<Product | null> {
  const products = await getAllProducts();
  const normalizedSlug = slugify(slug);

  // 1. Match exact
  let product = products.find((p) => p.slug === normalizedSlug);
  if (product) return product;

  // 2. Match approximatif
  product = products.find((p) => slugify(p.name).includes(normalizedSlug));
  return product || null;
}

/**
 * Pagination helper - Retourne une page de produits avec métadonnées
 */
export interface PaginatedProducts {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  productsPerPage: number;
}

export async function getPaginatedProducts(
  page: number = 1,
  productsPerPage: number = 24,
  filters?: {
    query?: string;
    category?: string;
  }
): Promise<PaginatedProducts> {
  let allProducts: Product[];

  // Appliquer les filtres
  if (filters?.query) {
    allProducts = await searchProducts(filters.query);
  } else if (filters?.category) {
    const all = await getAllProducts();
    const categoryLower = filters.category.toLowerCase().trim();
    allProducts = all.filter((product) => {
      const productCategory = (product.category || '').toLowerCase();
      const productName = (product.name || '').toLowerCase();
      return (
        productCategory.includes(categoryLower) ||
        productName.includes(categoryLower)
      );
    });
  } else {
    allProducts = await getAllProducts();
  }

  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    currentPage,
    totalPages,
    totalProducts,
    productsPerPage,
  };
}
