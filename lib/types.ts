/**
 * Interface représentant un avis client sur un produit.
 * @interface ProductReview
 */
export interface ProductReview {
  /** Nom de l'auteur de l'avis */
  author: string;
  /** Note sur 5 étoiles */
  rating: number;
  /** Commentaire de l'avis */
  comment: string;
  /** Date de l'avis au format YYYY-MM-DD */
  date: string;
}

/**
 * Interface représentant les caractéristiques d'un produit.
 * @interface ProductCharacteristics
 */
export interface ProductCharacteristics {
  /** Matériau du produit */
  material?: string;
  /** Taille disponible */
  size?: string;
  /** Couleur du produit */
  color?: string;
  /** Autres caractéristiques personnalisées */
  [key: string]: string | undefined;
}

/**
 * Interface principale représentant un produit dans le catalogue.
 * @interface Product
 */
export interface Product {
  /** Identifiant unique du produit */
  id: string;
  /** Nom du produit */
  name: string;
  /** Slug URL-friendly du produit */
  slug: string;
  /** Titre du produit (pour compatibilité) */
  title?: string;
  /** Prix en euros */
  price: number;
  /** URL de l'image principale du produit */
  image_url?: string;
  /** Image principale du produit (pour compatibilité) */
  image?: string;
  /** Galerie d'images du produit (toutes les images) */
  images?: string[];
  /** Description détaillée du produit */
  description: string;
  /** Catégorie du produit */
  category: string;
  /** Indique si le produit est nouveau */
  isNew?: boolean;
  /** Indique si le produit est en promotion */
  isOnSale?: boolean;
  /** Indique si le produit est en stock */
  inStock?: boolean;
  /** Quantité en stock */
  stock?: number;
  /** Date de création du produit */
  createdAt?: string;
  /** Prix soldé */
  salePrice?: number;
  /** Pourcentage de réduction */
  discount?: number;
  /** Caractéristiques détaillées du produit */
  characteristics?: ProductCharacteristics;
  /** Attributs spécifiques du produit (Pierre, Matière, Dimensions, Origine) */
  attributes?: {
    stone?: string; // Pierre
    material?: string; // Matière
    dimensions?: string; // Dimensions
    origin?: string; // Origine
  };
  /** Avis clients sur le produit */
  reviews?: ProductReview[];
  /** Matière du produit (pour filtrage - compatibilité) */
  material?: string;
  /** Pierre précieuse (pour filtrage - compatibilité) */
  stone?: string;
  /** Liste des pierres (enrichie par script) */
  stones?: string[];
  /** Type de produit (pour filtrage - enrichi par script) */
  type?: string;
  /** Style du produit (pour filtrage) */
  style?: string;
}

/**
 * Interface représentant un article dans le panier.
 * @interface CartItem
 */
export interface CartItem {
  /** Identifiant unique de l'article dans le panier */
  id: string;
  /** Identifiant du produit associé */
  productId: string;
  /** Quantité de l'article */
  quantity: number;
  /** Données complètes du produit */
  product: Product;
}

/**
 * Interface représentant le panier d'achat.
 * @interface Cart
 */
export interface Cart {
  /** Liste des articles dans le panier */
  items: CartItem[];
  /** Total du panier en euros (optionnel, peut être calculé dynamiquement) */
  total?: number;
}
