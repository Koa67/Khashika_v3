import { z } from 'zod';

/**
 * Schémas Zod stricts pour validation runtime
 * Types TypeScript inférés automatiquement
 */

// Validation URL stricte
const urlSchema = z.string().url().or(z.string().startsWith('/'));

// Validation montant positif
const positiveAmountSchema = z.number().positive().finite();

/**
 * Schéma pour ProductReview
 */
export const productReviewSchema = z.object({
  author: z.string().min(1, 'Le nom de l\'auteur est requis'),
  rating: z.number().int().min(1).max(5, 'La note doit être entre 1 et 5'),
  comment: z.string().min(1, 'Le commentaire est requis'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
});

export type ProductReview = z.infer<typeof productReviewSchema>;

/**
 * Schéma pour ProductCharacteristics
 */
export const productCharacteristicsSchema = z.object({
  material: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
}).catchall(z.string().optional());

export type ProductCharacteristics = z.infer<typeof productCharacteristicsSchema>;

/**
 * Schéma pour Product Attributes
 */
export const productAttributesSchema = z.object({
  stone: z.string().optional(),
  material: z.string().optional(),
  dimensions: z.string().optional(),
  origin: z.string().optional(),
}).optional();

export type ProductAttributes = z.infer<typeof productAttributesSchema>;

/**
 * Schéma principal pour Product
 */
export const productSchema = z.object({
  id: z.string().min(1, 'L\'ID du produit est requis'),
  name: z.string().min(1, 'Le nom du produit est requis'),
  slug: z.string().min(1, 'Le slug est requis').regex(/^[a-z0-9-]+$/, 'Le slug doit être en minuscules avec des tirets'),
  title: z.string().optional(),
  price: positiveAmountSchema,
  image_url: urlSchema.optional(),
  image: urlSchema.optional(),
  images: z.array(urlSchema).optional(),
  description: z.string().min(1, 'La description est requise'),
  category: z.string().min(1, 'La catégorie est requise'),
  isNew: z.boolean().optional().default(false),
  isOnSale: z.boolean().optional().default(false),
  inStock: z.boolean().optional().default(true),
  stock: z.number().optional(),
  createdAt: z.string().optional(),
  salePrice: z.number().optional(),
  discount: z.number().optional(),
  characteristics: productCharacteristicsSchema.optional(),
  attributes: productAttributesSchema,
  reviews: z.array(productReviewSchema).optional(),
  material: z.string().optional(),
  stone: z.string().optional(),
  style: z.string().optional(),
});

export type Product = z.infer<typeof productSchema>;

/**
 * Schéma pour CartItem
 */
export const cartItemSchema = z.object({
  id: z.string().min(1, 'L\'ID de l\'article est requis'),
  productId: z.string().min(1, 'L\'ID du produit est requis'),
  quantity: z.number().int().positive('La quantité doit être positive'),
  product: productSchema,
});

export type CartItem = z.infer<typeof cartItemSchema>;

/**
 * Schéma pour Cart
 */
export const cartSchema = z.object({
  items: z.array(cartItemSchema),
  total: z.number().nonnegative().optional(),
});

export type Cart = z.infer<typeof cartSchema>;

/**
 * Schéma pour Checkout Form
 */
export const checkoutFormSchema = z.object({
  email: z.string().email('Email invalide'),
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  address: z.string().min(1, 'L\'adresse est requise'),
  city: z.string().min(1, 'La ville est requise'),
  zipCode: z.string().regex(/^\d{5}$/, 'Code postal invalide (5 chiffres)'),
  country: z.string().min(1, 'Le pays est requis'),
  phone: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

/**
 * Fonction helper pour valider un produit
 */
export function validateProduct(data: unknown): Product {
  return productSchema.parse(data);
}

/**
 * Fonction helper pour valider un panier
 */
export function validateCart(data: unknown): Cart {
  return cartSchema.parse(data);
}

/**
 * Fonction helper pour valider un formulaire de checkout
 */
export function validateCheckoutForm(data: unknown): CheckoutFormData {
  return checkoutFormSchema.parse(data);
}
