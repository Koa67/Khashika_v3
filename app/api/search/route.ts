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

    // Si Supabase n'est pas configuré, retourner des résultats mock
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback : recherche simple dans les données mock
      const { getAllProducts } = await import('@/lib/data/products-loader');
      const products = await getAllProducts();

      const searchTerm = query.toLowerCase();
      const results = products
        .filter((product) => {
          const searchableText = [
            product.name,
            product.description,
            product.category,
            product.material,
            product.stone,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
          return searchableText.includes(searchTerm);
        })
        .slice(0, 10)
        .map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          image: product.image_url || product.image,
          category: product.category,
        }));

      return NextResponse.json({ count: results.length, results }, { status: 200 });
    }

    // Recherche Full Text Search avec Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Requête avec to_tsvector pour recherche full-text
    const { data, error } = await supabase.rpc('search_products', {
      search_query: query,
    });

    if (error) {
      console.error('Search error:', error);
      // Fallback sur recherche simple
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, name, slug, price, image_url, image, category')
        .or(
          `name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,material.ilike.%${query}%`
        )
        .limit(10);

      if (productsError) {
        // Fallback ultime: recherche locale (JSON via products-loader) au lieu de 500
        const { getAllProducts } = await import('@/lib/data/products-loader');
        const productsLocal = await getAllProducts();

        const searchTerm = query.toLowerCase();
        const results = productsLocal
          .filter((product) => {
            const searchableText = [
              product.name,
              product.description,
              product.category,
              product.material,
              product.stone,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return searchableText.includes(searchTerm);
          })
          .slice(0, 10)
          .map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            image: product.image_url || product.image,
            category: product.category,
          }));

        return NextResponse.json({ count: results.length, results }, { status: 200 });
      }

      const results = (products || []).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        image: p.image_url || p.image,
        category: p.category,
      }));

      return NextResponse.json({ count: results.length, results }, { status: 200 });
    }

    return NextResponse.json(
      { count: (data || []).length, results: data || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
