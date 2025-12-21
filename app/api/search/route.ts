import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * API RECHERCHE INTELLIGENTE
 * Utilise Postgres Full Text Search (to_tsvector)
 * - Recherche sur : Titre, Description, Catégorie, Matériaux
 * - Gérer les fautes de frappe simples (Fuzzy match)
 * - Retourner les résultats classés par pertinence
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = (searchParams.get('query') ?? searchParams.get('q') ?? '').trim();

    if (!query || query.length < 2) {
      return NextResponse.json({ count: 0, results: [] }, { status: 200 });
    }

    const norm = (s: string) =>
      s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

    const searchTerm = norm(query);

    const searchLocal = async () => {
      const { getAllProducts } = await import('@/lib/data/products-loader');
      const products = await getAllProducts();

      const results = products
        .filter((product) => {
          const p = product as unknown as { title?: string };
          const searchableText = norm(
            [
              product.name,
              p.title,
              product.description,
              product.category,
              product.material,
              product.stone,
            ]
              .filter(Boolean)
              .join(' ')
          );
          return searchableText.includes(searchTerm);
        })
        .slice(0, 10)
        .map((product) => {
          const p = product as unknown as { title?: string };
          const img = product.image_url || product.image;
          return {
            id: product.id,
            name: product.name || p.title,
            slug: product.slug,
            price: product.price,
            image_url: img,
            image: img,
            category: product.category,
          };
        });

      return NextResponse.json({ count: results.length, results }, { status: 200 });
    };

    // Si Supabase n'est pas configuré, fallback local (JSON via products-loader)
    if (!supabaseUrl || !supabaseAnonKey) {
      return await searchLocal();
    }

    // Recherche Full Text Search avec Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Requête avec to_tsvector pour recherche full-text
    const { data, error } = await supabase.rpc('search_products', {
      search_query: query,
    });

    // Si la RPC a échoué → fallback Supabase select → fallback local
    if (error) {
      console.error('Search error:', error);

      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, slug, price, image_url, image, category')
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,material.ilike.%${query}%`
        )
        .limit(10);

      if (productsError) {
        return await searchLocal();
      }

      const results = (products || []).map((p) => {
        // keep image fallback consistent with local search
        // (some rows may have image but not image_url)
        const product = p as { id: string; name: string; slug: string; price: number; image_url?: string | null; image?: string | null; category: string };
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image_url: product.image_url ?? product.image ?? null,
          image: product.image_url ?? product.image ?? null,
          category: product.category,
        };
      });

      if (results.length === 0) {
        return await searchLocal();
      }

      return NextResponse.json({ count: results.length, results }, { status: 200 });
    }

    // RPC OK mais dataset vide → fallback local (évite "0 results" dû aux prix Supabase à 0)
    const supaResults = Array.isArray(data) ? data : [];
    if (supaResults.length === 0) {
      return await searchLocal();
    }

    return NextResponse.json(
      { count: supaResults.length, results: supaResults },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

