import { createClient } from '@supabase/supabase-js';
import { Product } from '@/lib/types';

// Configuration Supabase - Les variables d'environnement sont requises
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Validation des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.warn(
    '⚠️ Variables d\'environnement Supabase manquantes. Vérifiez votre fichier .env.local\n' +
    '   NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont requis.'
  );
}

// Initialisation du client Supabase
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key'
);

/**
 * Récupère tous les produits depuis Supabase avec fallback vers mock data
 * @returns Promise<Product[]> Liste des produits
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    // Tentative de récupération depuis Supabase
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    // Si erreur, logger et retourner un tableau vide
    if (error) {
      console.error('Supabase Error (getProducts):', error);
      throw error;
    }

    // Si aucune donnée, retourner un tableau vide
    if (!data || data.length === 0) {
      console.warn('No products found in Supabase');
      return [];
    }

    // Convertir les données Supabase en format Product
    return data.map((item: Record<string, unknown>) => {
      const priceValue = typeof item.price === 'string' ? item.price : String(item.price ?? 0);
      const idValue = String(item.id ?? '');
      
      return {
        id: idValue,
        title: String(item.title || item.name || ''),
        price: parseFloat(priceValue) || 0,
        image: String(item.image || '/placeholder-image.svg'),
        images: Array.isArray(item.images) 
          ? (item.images as string[]) 
          : [String(item.image || '/placeholder-image.svg')],
        description: String(item.description || ''),
        slug: String(item.slug || idValue),
        isNew: Boolean(item.is_new),
        isOnSale: Boolean(item.is_on_sale),
        material: String(item.material || ''),
        stone: String(item.stone || ''),
        style: String(item.style || ''),
        characteristics: (item.characteristics as Record<string, string>) || {},
        reviews: Array.isArray(item.reviews) ? (item.reviews as Product['reviews']) : [],
        category: String(item.category || 'bijoux'),
      } as Product;
      });
  } catch (e) {
    console.error('Database error (getProducts):', e);
    // Re-throw pour que l'API puisse gérer l'erreur
    throw e;
  }
};

/**
 * Récupère un produit par son slug depuis Supabase avec fallback
 * @param slug - Slug du produit
 * @returns Promise<Product | null> Produit trouvé ou null
 */
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error('Supabase Error (getProductBySlug):', error);
      throw error;
    }

    if (!data) {
      console.warn(`Product with slug "${slug}" not found in Supabase`);
      return null;
    }

    // Convertir en format Product
    const priceValue = typeof data.price === 'string' ? data.price : String(data.price ?? 0);
    const idValue = String(data.id ?? '');
    
    return {
      id: idValue,
      title: String(data.title || data.name || ''),
      price: parseFloat(priceValue) || 0,
      image: String(data.image || '/placeholder-image.svg'),
      images: Array.isArray(data.images) 
        ? (data.images as string[]) 
        : [String(data.image || '/placeholder-image.svg')],
      description: String(data.description || ''),
      slug: String(data.slug || idValue),
      isNew: Boolean(data.is_new),
      isOnSale: Boolean(data.is_on_sale),
      material: String(data.material || ''),
      stone: String(data.stone || ''),
      style: String(data.style || ''),
      characteristics: (data.characteristics as Record<string, string>) || {},
      reviews: Array.isArray(data.reviews) ? (data.reviews as Product['reviews']) : [],
      category: String(data.category || 'bijoux'),
    } as Product;
  } catch (e) {
    console.error('Database error (getProductBySlug):', e);
    // Re-throw pour que l'API puisse gérer l'erreur
    throw e;
  }
};

/**
 * Interface pour le panier d'un utilisateur
 */
interface Cart {
  items: unknown[];
  subtotal: number;
  shipping: number;
  total: number;
}

/**
 * Récupère le panier d'un utilisateur depuis Supabase
 * @param userId - ID de l'utilisateur (optionnel pour mock)
 * @returns Promise<Cart> Panier de l'utilisateur
 */
export const getCart = async (userId?: string): Promise<Cart> => {
  try {
    if (!userId) {
      // Retourner un panier vide pour les utilisateurs non authentifiés
      return { items: [], subtotal: 0, shipping: 0, total: 0 };
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', userId);

    if (error || !data) {
      return { items: [], subtotal: 0, shipping: 0, total: 0 };
    }

    // Calculer les totaux
    const subtotal = data.reduce((sum: number, item: Record<string, unknown>) => {
      const products = item.products as { price?: number } | undefined;
      const quantity = (item.quantity as number) || 0;
      return sum + (products?.price || 0) * quantity;
    }, 0);

    return {
      items: data as unknown[],
      subtotal,
      shipping: subtotal > 100 ? 0 : 10,
      total: subtotal + (subtotal > 100 ? 0 : 10),
    };
  } catch (e) {
    console.error('Cart error:', e);
    return { items: [], subtotal: 0, shipping: 0, total: 0 };
  }
};


