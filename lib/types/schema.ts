import { z } from 'zod';

/**
 * Schéma Zod pour ProductReview
 */
export const ProductReviewSchema = z.object({
  author: z.string().min(1, 'Le nom de l\'auteur est requis'),
  rating: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  comment: z.string().min(1, 'Le commentaire est requis'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
});

/**
 * Schéma Zod pour ProductCharacteristics
 */
export const ProductCharacteristicsSchema = z.record(z.string(), z.string().optional()).optional();

/**
 * Schéma Zod pour Product
 * Validation stricte des URLs d'images et montants positifs
 */
export const ProductSchema = z.object({
  id: z.string().min(1, 'L\'ID du produit est requis'),
  name: z.string().min(1, 'Le nom du produit est requis'),
  slug: z.string().min(1, 'Le slug est requis'),
  title: z.string().optional(),
  price: z.number().positive('Le prix doit être positif'),
  image_url: z.string().url('URL d\'image invalide').optional().or(z.literal('')),
  image: z.string().url('URL d\'image invalide').optional().or(z.literal('')),
  images: z.array(z.string().url('URL d\'image invalide').or(z.literal(''))).optional(),
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  isNew: z.boolean().optional(),
  isOnSale: z.boolean().optional(),
  characteristics: ProductCharacteristicsSchema,
  attributes: z.object({
    stone: z.string().optional(),
    material: z.string().optional(),
    dimensions: z.string().optional(),
    origin: z.string().optional(),
  }).optional(),
  reviews: z.array(ProductReviewSchema).optional(),
  material: z.string().optional(),
  stone: z.string().optional(),
  style: z.string().optional(),
});

/**
 * Schéma Zod pour CartItem
 */
export const CartItemSchema = z.object({
  id: z.string().min(1, 'L\'ID de l\'article est requis'),
  productId: z.string().min(1, 'L\'ID du produit est requis'),
  quantity: z.number().int().positive('La quantité doit être positive'),
  product: ProductSchema,
});

/**
 * Schéma Zod pour Cart
 */
export const CartSchema = z.object({
  items: z.array(CartItemSchema),
  total: z.number().nonnegative('Le total ne peut pas être négatif').optional(),
});

/**
 * Schéma Zod pour User (basique)
 */
export const UserSchema = z.object({
  id: z.string().min(1, 'L\'ID utilisateur est requis'),
  email: z.string().email('Email invalide'),
  firstName: z.string().min(1, 'Le prénom est requis').optional(),
  lastName: z.string().min(1, 'Le nom est requis').optional(),
  createdAt: z.string().datetime().optional(),
});

/**
 * Types TypeScript inférés depuis les schémas Zod
 */
export type ProductReview = z.infer<typeof ProductReviewSchema>;
export type ProductCharacteristics = z.infer<typeof ProductCharacteristicsSchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type User = z.infer<typeof UserSchema>;

