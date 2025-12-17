import 'server-only';

import { Product } from '../types';
import { getAllProducts as getAllProductsFromLoader, getProductBySlugFromJSON } from '../data/products-loader';

/**
 * Récupère un produit par son slug
 * Utilise products-ultimate.json en priorité
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  return await getProductBySlugFromJSON(slug);
}

/**
 * Récupère tous les produits
 * Utilise products-ultimate.json en priorité
 */
export async function getAllProducts(): Promise<Product[]> {
  return await getAllProductsFromLoader();
}
