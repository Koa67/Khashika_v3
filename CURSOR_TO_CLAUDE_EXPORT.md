# 📋 CONFIGURATION COLLABORATION - EXPORT CURSOR → CLAUDE

**Date**: 2025-01-27  
**Projet**: Khashika - E-commerce de Joaillerie Indienne  
**Version**: 0.1.0  
**Framework**: Next.js 16.0.3 (App Router)

---

## 1. ARCHITECTURE DU PROJET

### Structure des fichiers

```
/khashika
├── /app                          # Next.js App Router (Pages & Routes)
│   ├── (routes)/                 # Route groups
│   │   └── boutique/             # Page boutique
│   ├── /api                      # API Routes (Server Actions)
│   │   ├── /cart                 # Route API panier
│   │   ├── /chat                 # Route API chatbot IA
│   │   └── /products              # Route API produits
│   ├── /checkout                 # Page checkout
│   ├── /contact                  # Page contact
│   ├── /login                    # Page connexion
│   ├── /product/[slug]          # Page produit dynamique
│   ├── /shop                     # Page boutique principale
│   ├── /story                    # Page histoire
│   ├── globals.css               # Styles globaux + variables CSS
│   ├── layout.tsx                # Layout racine (providers, metadata)
│   └── page.tsx                  # Page d'accueil
│
├── /components                   # Composants React réutilisables
│   ├── /boutique                 # Composants spécifiques boutique
│   │   ├── ProductCard.tsx       # Carte produit (variante boutique)
│   │   ├── ProductFilter.tsx     # Filtres produits
│   │   └── ProductGrid.tsx       # Grille produits
│   ├── /ui                       # Composants UI primitifs
│   │   ├── Badge.tsx             # Badge (étiquettes)
│   │   ├── Button.tsx            # Bouton (vide actuellement)
│   │   ├── Container.tsx         # Container responsive
│   │   ├── Input.tsx             # Input text
│   │   ├── JewelrySearch.tsx     # Recherche bijoux
│   │   ├── SearchBar.tsx         # Barre de recherche
│   │   └── ThemeToggle.tsx       # Toggle dark/light mode
│   ├── AIChatbot.tsx             # Chatbot IA (ambassadeur culturel)
│   ├── CartDrawer.tsx            # Drawer panier (slide-in)
│   ├── CartSummary.tsx           # Résumé panier
│   ├── CheckoutForm.tsx          # Formulaire checkout
│   ├── Footer.tsx                # Footer site
│   ├── Hero.tsx                  # Hero section
│   ├── HeroSection.tsx           # Hero section alternative
│   ├── Navbar.tsx                # Navigation principale (mega menu)
│   ├── ProductCard.tsx           # Carte produit principale
│   ├── ProductConversionModule.tsx # Module conversion produit
│   ├── ProductGrid.tsx           # Grille produits
│   ├── ProductInfoTabs.tsx      # Onglets infos produit
│   ├── ProductMediaGallery.tsx   # Galerie média produit
│   ├── PromotionSection.tsx      # Section promotion
│   ├── SidebarFilters.tsx       # Filtres sidebar
│   ├── ThemeProvider.tsx        # Provider thème (next-themes)
│   ├── TrustBadges.tsx           # Badges de confiance
│   └── WishlistDrawer.tsx        # Drawer wishlist
│
├── /lib                          # Bibliothèques & utilitaires
│   ├── /ai                       # Intégration IA
│   │   └── ai.ts                 # Client IA (OpenAI/Claude)
│   ├── /context                  # Contextes React (state global)
│   │   ├── CartContext.tsx       # Context panier (localStorage)
│   │   └── WishlistContext.tsx   # Context wishlist (localStorage)
│   ├── /data                     # Données statiques & loaders
│   │   ├── products-loader.ts    # Loader produits (JSON)
│   │   ├── products-ultimate.json # Catalogue complet (source de vérité)
│   │   └── products-full.json    # Fallback catalogue
│   ├── /db                       # Base de données
│   │   └── supabase.ts           # Client Supabase (déprécié partiellement)
│   ├── /hooks                    # Hooks React personnalisés
│   │   └── useSearch.ts          # Hook recherche (Fuse.js)
│   ├── /utils                    # Utilitaires
│   │   ├── images.ts             # Helpers images (getValidImageUrl)
│   │   ├── products.ts           # Helpers produits
│   │   └── slugify.ts            # Slugification
│   ├── types.ts                  # Types TypeScript (Product, CartItem, etc.)
│   └── utils.ts                  # Utilitaires généraux (cn, etc.)
│
├── /public                       # Assets statiques
│   ├── /images
│   │   └── /products             # Images produits (43k+ fichiers)
│   ├── /patterns                 # Patterns SVG
│   │   └── indian-motif.svg      # Motif indien
│   ├── logo-khashika.png         # Logo principal
│   ├── placeholder-image.svg     # Placeholder images
│   └── placeholder.svg           # Placeholder alternatif
│
├── /scripts                      # Scripts Python (réconciliation images)
│   ├── parse_local_clone.py      # Parse HTML local clone
│   ├── find_and_copy_images.py   # Copie images depuis clone
│   ├── update_products_json.py   # Mise à jour JSON produits
│   ├── scrape_and_download_images.py # Scraping live site
│   ├── verify_images.py          # Vérification images
│   ├── final_cleanup.py          # Nettoyage final
│   ├── force_update_all.py       # Mise à jour forcée images
│   └── ... (30+ scripts Python)
│
├── /data                         # Données temporaires
│   ├── truth_map.json            # Mapping produits → images (source de vérité)
│   ├── missing_images_report.txt  # Rapport images manquantes
│   └── scraping_errors.json      # Erreurs scraping
│
├── /_LEGACY_CLONE                # Clone WordPress local (source images)
├── /_raw_assets                  # Assets bruts (images originales)
│
├── .cursorrules                  # Règles Cursor AI (modulaire)
├── .cursorignore                 # Fichiers ignorés par Cursor
├── .env.local                    # Variables d'environnement (non commité)
├── next.config.ts                # Configuration Next.js
├── tailwind.config.ts            # Configuration Tailwind CSS
├── tsconfig.json                 # Configuration TypeScript
├── package.json                  # Dépendances npm
├── requirements.txt              # Dépendances Python
└── README.md                     # Documentation projet
```

### Rôles des dossiers principaux

#### `/app`
- **Rôle**: Pages Next.js App Router (Server Components par défaut)
- **Conventions**: 
  - Fichiers `page.tsx` = routes
  - Fichiers `layout.tsx` = layouts
  - Fichiers `route.ts` = API routes
- **Quand créer**: Nouvelle page ou route API

#### `/components`
- **Rôle**: Composants React réutilisables (Client Components)
- **Conventions**: 
  - `'use client'` en haut pour Client Components
  - PascalCase pour les noms de fichiers
  - Un composant = un fichier
- **Quand créer**: Nouveau composant réutilisable

#### `/lib`
- **Rôle**: Code partagé (utilitaires, types, contextes, hooks)
- **Conventions**:
  - `/utils` = fonctions pures
  - `/context` = Contextes React
  - `/hooks` = Hooks personnalisés
  - `/data` = Loaders de données
- **Quand créer**: Nouvelle fonctionnalité partagée

#### `/public`
- **Rôle**: Assets statiques servis directement
- **Conventions**: 
  - Images produits: `/images/products/{slug}.{ext}`
  - Pas de traitement, servies telles quelles
- **Quand créer**: Nouveau fichier statique

#### `/scripts`
- **Rôle**: Scripts Python pour maintenance (réconciliation images, scraping)
- **Conventions**: 
  - `.py` pour scripts Python
  - `.sh` pour scripts bash d'orchestration
- **Quand créer**: Nouvelle tâche de maintenance/automation

---

## 2. STACK TECHNIQUE DÉTAILLÉE

```yaml
framework: Next.js 16.0.3
  router: App Router (pas Pages Router)
  rendering: Server Components par défaut, Client Components avec 'use client'
  features:
    - Server Actions
    - Metadata API
    - Image Optimization (next/image)
    - Font Optimization (next/font)

language: TypeScript 5.x
  strict: true
  module: esnext
  target: ES2017
  jsx: react-jsx

styling: Tailwind CSS 3.4.1
  why: Utility-first, cohérence design, performance
  config: tailwind.config.ts (couleurs custom, fonts)
  dark_mode: class-based (next-themes)
  custom_classes: .zari-frame, .border-luxe-solid, .bg-pattern-braid-gold

state_management: 
  global: React Context (CartContext, WishlistContext)
  local: useState, useReducer
  persistence: localStorage (panier, wishlist)
  server: Server Components (pas de state client)

routing: Next.js App Router
  file_based: app/[route]/page.tsx
  dynamic: app/product/[slug]/page.tsx
  groups: app/(routes)/boutique/

build_tool: Next.js (Turbopack en dev, Webpack en prod)
  output: Standalone (optionnel)
  optimization: Automatic (images, fonts, code splitting)

package_manager: npm
  lock_file: package-lock.json
  install: npm install
  scripts: package.json
```

---

## 3. PATTERNS & CONVENTIONS DE CODE

### Composants React

#### Composant fonctionnel standard

```typescript
'use client'; // Si besoin d'interactivité

import { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  // Pas de props.children si pas nécessaire
  // Props optionnelles avec valeurs par défaut
  
  if (!product) return null; // Early return
  
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

#### Composant avec hooks

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/context/CartContext';

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, getTotal } = useCart(); // Context hook
  const [isAnimating, setIsAnimating] = useState(false); // Local state
  
  useEffect(() => {
    // Side effects
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  return (/* JSX */);
}
```

#### Composant avec props TypeScript

```typescript
interface ProductCardProps {
  product: Product;              // Requis
  priority?: boolean;             // Optionnel avec défaut
  className?: string;             // Optionnel
  onAction?: (id: string) => void; // Callback optionnel
}

export default function ProductCard({ 
  product, 
  priority = false,
  className,
  onAction 
}: ProductCardProps) {
  // ...
}
```

#### Pattern de composition

```typescript
// Container + Presentation
export default function ProductGrid({ products }: Props) {
  return (
    <Container>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
```

### Styling

#### Structure des styles

- **Tailwind uniquement**: Pas d'inline styles (`style={{}}`)
- **Classes utilitaires**: `flex`, `grid`, `gap-4`, etc.
- **Couleurs custom**: `text-primary`, `bg-accent`, `border-[#D4AF37]`
- **Responsive**: `md:`, `lg:` prefixes
- **Dark mode**: `dark:` prefix

#### Classes CSS les plus utilisées

```typescript
// Layout
"flex items-center justify-between"
"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
"container mx-auto px-4"

// Typography
"font-serif text-4xl text-foreground"
"font-sans text-sm text-foreground/70"

// Colors
"text-primary"      // #2596be
"text-accent"        // #D4AF37
"bg-background"      // #F4EAD8 (light) / #121A21 (dark)
"border-[#D4AF37]"   // Or

// Effects
"hover:scale-105 transition-all duration-500"
"shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)]"
```

#### Naming convention

- **Composants**: PascalCase (`ProductCard.tsx`)
- **Fichiers utilitaires**: camelCase (`images.ts`, `products.ts`)
- **Classes CSS**: kebab-case dans globals.css (`.zari-frame`)

### State Management

#### State local

```typescript
const [isOpen, setIsOpen] = useState(false);
const [imgSrc, setImgSrc] = useState<string>(() => {
  // Initialisation avec fonction
  return getValidImageUrl(product.image_url);
});
```

#### State global (Context)

```typescript
// Provider dans layout.tsx
<CartProvider>
  <WishlistProvider>
    {children}
  </WishlistProvider>
</CartProvider>

// Usage dans composant
const { items, addItem, removeItem, getTotal } = useCart();
```

#### Data fetching

```typescript
// Server Component (async)
export default async function ShopPage() {
  const products = await getAllProducts(); // Server-side
  return (/* JSX */);
}

// Client Component (useEffect + useState)
const [products, setProducts] = useState<Product[]>([]);
useEffect(() => {
  fetch('/api/products').then(res => res.json()).then(setProducts);
}, []);
```

### Types TypeScript

#### Interfaces standards

```typescript
// lib/types.ts

export interface Product {
  id: string;
  name: string;
  slug: string;
  title?: string;
  price: number;
  image_url?: string;
  image?: string;
  images?: string[];
  description: string;
  category: string;
  isNew?: boolean;
  isOnSale?: boolean;
  attributes?: {
    stone?: string;
    material?: string;
    dimensions?: string;
    origin?: string;
  };
  material?: string; // Pour filtrage
  stone?: string;     // Pour filtrage
  style?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total?: number;
}
```

#### Pattern de types

```typescript
// Props avec génériques
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

// Union types
type Theme = 'light' | 'dark' | 'system';
type ButtonVariant = 'primary' | 'secondary' | 'ghost';

// Utility types
type ProductPreview = Pick<Product, 'id' | 'name' | 'price' | 'image_url'>;
type PartialProduct = Partial<Product>;
```

---

## 4. COMPOSANTS RÉUTILISABLES EXISTANTS

### ProductCard

- **Fichier**: `/components/ProductCard.tsx`
- **Props**: 
  - `product: Product` (requis)
  - `priority?: boolean` (optionnel, pour next/image)
- **Usage**: 
  ```tsx
  <ProductCard product={product} priority={index < 4} />
  ```
- **Variants**: Aucun (un seul style)
- **Features**:
  - Gestion d'erreur image avec fallback placeholder
  - Wishlist intégrée (bouton cœur)
  - Hover effects (scale, shadow)
  - Responsive (aspect-square)

### Navbar

- **Fichier**: `/components/Navbar.tsx`
- **Props**: Aucune (utilise Context)
- **Usage**: `<Navbar />` (dans layout.tsx)
- **Variants**: Desktop mega menu + Mobile drawer
- **Features**:
  - Mega menu avec sections
  - SearchBar intégrée
  - Cart/Wishlist badges
  - Theme-aware (dark mode)

### SearchBar

- **Fichier**: `/components/ui/SearchBar.tsx`
- **Props**: Aucune (utilise `useSearch` hook)
- **Usage**: `<SearchBar />`
- **Variants**: Minimaliste (pas de variants)
- **Features**:
  - Recherche en temps réel (Fuse.js)
  - Dropdown résultats (max 5)
  - Lien "Voir tous les résultats"
  - Gestion clic extérieur

### CartDrawer

- **Fichier**: `/components/CartDrawer.tsx`
- **Props**: 
  - `isOpen: boolean`
  - `onClose: () => void`
- **Usage**: 
  ```tsx
  <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
  ```
- **Variants**: Slide-in depuis droite
- **Features**:
  - Overlay backdrop
  - Liste items avec quantité
  - Total calculé
  - Bouton checkout

### AIChatbot

- **Fichier**: `/components/AIChatbot.tsx`
- **Props**: Aucune
- **Usage**: `<AIChatbot />` (dans layout.tsx)
- **Variants**: Float bottom-right
- **Features**:
  - Chat avec API `/api/chat`
  - Réponses culturelles (Inde, bijoux)
  - Historique messages
  - Indicateur frappe

### ThemeToggle

- **Fichier**: `/components/ui/ThemeToggle.tsx`
- **Props**: Aucune (utilise ThemeProvider)
- **Usage**: `<ThemeToggle />`
- **Variants**: Toggle switch
- **Features**:
  - Light / Dark / System
  - Persistence localStorage
  - Animation transition

---

## 5. UTILITIES & HELPERS

### `getValidImageUrl` (lib/utils/images.ts)

```typescript
export function getValidImageUrl(url: string | undefined | null): string
```

**Description**: Valide et sanitise les URLs d'images. Retourne un placeholder si l'URL est invalide, externe, ou contient des patterns d'images manquantes (`prod-`, `product_`).

**Exemple**:
```typescript
const imgSrc = getValidImageUrl(product.image_url);
// Retourne: '/images/products/bracelet-argent.jpg' ou '/placeholder-image.svg'
```

**Logique**:
- URLs externes (`http://`) → placeholder
- URLs avec `prod-` → placeholder
- URLs avec `product_` → placeholder
- Chemins `_raw_assets` → convertis en `/images/products/{filename}`
- URLs encodées → décodées avec `decodeURIComponent`

### `slugify` (lib/utils/slugify.ts)

```typescript
export function slugify(text: string): string
```

**Description**: Convertit un texte en slug URL-friendly (minuscules, tirets, suppression accents).

**Exemple**:
```typescript
const slug = slugify("Bracelet en Argent Massif");
// Retourne: "bracelet-en-argent-massif"
```

### `getAllProducts` (lib/data/products-loader.ts)

```typescript
export async function getAllProducts(): Promise<Product[]>
```

**Description**: Charge tous les produits depuis `products-ultimate.json` (priorité) ou `products-full.json` (fallback). Normalise les images et les attributs.

**Exemple**:
```typescript
const products = await getAllProducts();
```

### `searchProducts` (lib/data/products-loader.ts)

```typescript
export async function searchProducts(query: string): Promise<Product[]>
```

**Description**: Recherche de produits par requête textuelle (nom, catégorie, description).

**Exemple**:
```typescript
const results = await searchProducts("bracelet");
```

### `useSearch` (lib/hooks/useSearch.ts)

```typescript
export function useSearch(): {
  query: string;
  setQuery: (q: string) => void;
  results: Product[];
  suggestions: string[];
  isLoading: boolean;
  fuseInstance: Fuse<Product> | null;
}
```

**Description**: Hook de recherche avec Fuse.js (fuzzy search). Retourne les produits correspondants et suggestions de catégories.

**Exemple**:
```typescript
const { query, setQuery, results } = useSearch();
```

### `useCart` (lib/context/CartContext.tsx)

```typescript
export function useCart(): CartContextType
```

**Description**: Hook pour accéder au contexte panier (items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount).

**Exemple**:
```typescript
const { items, addItem, getTotal } = useCart();
```

### `useWishlist` (lib/context/WishlistContext.tsx)

```typescript
export function useWishlist(): WishlistContextType
```

**Description**: Hook pour accéder au contexte wishlist (similaire à CartContext).

---

## 6. CONFIGURATIONS

### tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2596be",      // Bleu turquoise
        secondary: "#1a1a1a",    // Noir
        accent: "#D4AF37",        // Or
        cream: "#F4EAD8",         // Beige
        night: "#121A21",          // Bleu nuit
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-karma)", "serif"],
        serif: ["var(--font-karma)", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.khashika.com',
      },
      {
        protocol: 'https',
        hostname: 'khashika.com',
      },
    ],
  },
};

export default nextConfig;
```

### eslint.config.mjs

```javascript
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
```

### app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* MODE CLAIR */
    --background: 244 234 216; /* #F4EAD8 */
    --foreground: 26 26 26;    /* #1a1a1a */
    --card: 255 255 255;
    --card-foreground: 26 26 26;
    --border: 212 175 55;      /* #D4AF37 */
  }
  
  .dark {
    /* MODE SOMBRE */
    --background: 18 26 33;    /* #121A21 */
    --foreground: 244 234 216; /* #F4EAD8 */
    --card: 26 35 45;
    --card-foreground: 244 234 216;
    --border: 212 175 55;
  }
}

/* Classes custom */
.zari-frame {
  border-width: 4px !important;
  border-image-source: url("data:image/svg+xml,...") !important;
  border-image-slice: 30 !important;
}

.bg-pattern-braid-gold {
  background-image: url("data:image/svg+xml,...");
  background-position: bottom center;
  background-repeat: repeat-x;
}
```

---

## 7. PROBLÈMES RÉCURRENTS & BUGS

### Bugs connus

#### 1. Images 404 (`p-X.jpg` patterns)

- **Description**: Certains produits ont encore des images avec le pattern `p-X.jpg` qui n'existent pas.
- **Reproduction**: 
  1. Ouvrir `/shop`
  2. Observer les logs console: `GET /images/products/p-123.jpg 404`
- **Comportement attendu**: Placeholder affiché immédiatement
- **Comportement actuel**: Tentative de chargement → 404 → fallback placeholder
- **Fichiers concernés**: 
  - `lib/utils/images.ts` (détection `p-X` partielle)
  - `components/ProductCard.tsx` (gestion `onError`)
- **Tentatives de fix**:
  - Scripts Python de réconciliation (`force_update_all.py`)
  - Amélioration `getValidImageUrl` (détection `prod-`, `p-X`)
  - `handleImageError` avec `requestAnimationFrame` pour éviter loops
- **Stack trace**: Aucune (404 silencieux dans console)

#### 2. Double free malloc (Node.js)

- **Description**: Erreur `double free malloc` lors du redémarrage du serveur.
- **Reproduction**: 
  1. Arrêter le serveur (Ctrl+C)
  2. Relancer `npm run dev`
  3. Erreur parfois visible dans terminal
- **Comportement attendu**: Redémarrage propre
- **Comportement actuel**: Erreur mémoire (non bloquante généralement)
- **Fichiers concernés**: 
  - `components/ProductCard.tsx` (state updates synchrones)
  - Processus Node.js (port 3000)
- **Tentatives de fix**:
  - `requestAnimationFrame` dans `handleImageError`
  - Script `fix` dans `package.json` pour tuer processus port 3000
- **Stack trace**: 
  ```
  node(XXXXX,0xYYYYY) malloc: Double free of object 0xZZZZZ
  ```

#### 3. Port 3000 bloqué

- **Description**: Port 3000 reste occupé après arrêt du serveur.
- **Reproduction**: 
  1. Arrêter serveur
  2. Relancer `npm run dev`
  3. Next.js utilise port 3001 au lieu de 3000
- **Comportement attendu**: Port 3000 libéré automatiquement
- **Comportement actuel**: Port reste occupé
- **Fichiers concernés**: `package.json` (script `fix`)
- **Tentatives de fix**:
  - Script `fix`: `lsof -ti:3000 | xargs kill -9 || true; rm -rf .next; npm run dev`
- **Solution actuelle**: Script `npm run fix` manuel

#### 4. URL encoding issues (caractères spéciaux)

- **Description**: URLs d'images avec caractères encodés (`é` → `%C3%A9`) causent des 404.
- **Reproduction**: 
  1. Produit avec nom contenant `é`
  2. Image URL: `/images/products/bracelet%20%C3%A9l%C3%A9gant.jpg`
  3. 404 car fichier réel: `bracelet élégant.jpg`
- **Comportement attendu**: Décodage correct de l'URL
- **Comportement actuel**: 404 si encodage incorrect
- **Fichiers concernés**: 
  - `lib/utils/images.ts` (décodage partiel)
  - `lib/data/products-loader.ts` (normalisation)
- **Tentatives de fix**:
  - `decodeURIComponent` dans `getValidImageUrl`
  - Script `fix_encoding_issues.py`
- **Solution actuelle**: Décodage partiel, fallback placeholder

### Anti-patterns détectés

#### 1. Images dans `products-ultimate.json`

- **Problème**: Images stockées avec chemins `_raw_assets` ou URLs externes
- **Refactoring nécessaire**: Normaliser tous les chemins vers `/images/products/{slug}.{ext}`
- **Raison**: Cohérence, performance, maintenance

#### 2. Duplication ProductCard

- **Problème**: `ProductCard.tsx` et `components/boutique/ProductCard.tsx` (doublons)
- **Refactoring nécessaire**: Unifier en un seul composant avec props optionnelles
- **Raison**: DRY, maintenance

#### 3. State management localStorage

- **Problème**: Panier et wishlist dans localStorage (pas de sync serveur)
- **Refactoring nécessaire**: Intégrer Supabase pour persistence serveur
- **Raison**: Multi-device, backup, analytics

#### 4. Data fetching mixte

- **Problème**: Mélange Server Components (`getAllProducts`) et Client Components (Fuse.js dans `useSearch`)
- **Refactoring nécessaire**: Unifier vers Server Components + streaming
- **Raison**: Performance, SEO, cohérence

---

## 8. DÉPENDANCES & PACKAGES

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.84.0",  // Client Supabase (déprécié partiellement)
    "clsx": "^2.1.1",                     // Utility pour classes conditionnelles
    "framer-motion": "^12.23.24",         // Animations (peu utilisé actuellement)
    "fuse.js": "^7.1.0",                 // Fuzzy search (useSearch hook)
    "lucide-react": "^0.555.0",          // Icônes SVG
    "next": "16.0.3",                    // Framework principal
    "next-themes": "^0.4.6",             // Gestion thème dark/light
    "react": "19.2.0",                   // Bibliothèque UI
    "react-dom": "19.2.0",               // React DOM renderer
    "tailwind-merge": "^3.4.0"           // Merge classes Tailwind
  },
  "devDependencies": {
    "@types/node": "^20",                // Types Node.js
    "@types/react": "^19",               // Types React
    "@types/react-dom": "^19",           // Types React DOM
    "autoprefixer": "^10.4.22",          // PostCSS autoprefixer
    "baseline-browser-mapping": "latest", // Mapping navigateurs (Next.js)
    "dotenv": "^17.2.3",                 // Variables d'environnement
    "eslint": "^9",                      // Linter
    "eslint-config-next": "16.0.3",      // Config ESLint Next.js
    "postcss": "^8.5.6",                 // PostCSS processor
    "tailwindcss": "^3.4.1",             // Framework CSS
    "tsx": "^4.20.6",                    // TypeScript executor (scripts)
    "typescript": "^5"                   // Compilateur TypeScript
  }
}
```

### Dépendances Python (requirements.txt)

```
beautifulsoup4==4.14.3    # Parsing HTML (scraping)
requests==2.32.5          # HTTP requests (scraping, download)
fuzzywuzzy==0.18.0        # Fuzzy string matching
python-Levenshtein==0.25.0 # Optimisation fuzzywuzzy
unidecode==1.3.8          # Normalisation caractères (accents)
```

---

## 9. SCRIPTS NPM IMPORTANTS

```json
{
  "scripts": {
    "dev": "next dev",                    // Serveur développement (port 3000)
    "build": "next build",                // Build production
    "start": "next start",                // Serveur production
    "lint": "eslint",                     // Linter ESLint
    "ice-age": "tsx ./scripts/ice_age.ts", // Script de scaffolding
    "scaffold": "tsx ./scripts/ice_age.ts component", // Alias scaffolding
    "fix": "lsof -ti:3000 | xargs kill -9 || true; rm -rf .next; npm run dev" // Fix port + cache + restart
  }
}
```

### Scripts Bash (orchestration Python)

- `run_reconcile_full.sh`: Réconciliation images depuis clone local
- `run_direct_download.sh`: Téléchargement direct depuis site live
- `run_force_update.sh`: Mise à jour forcée images `p-X`
- `run_final_cleanup.sh`: Nettoyage final (images orphelines)

---

## 10. ENVIRONNEMENT & VARIABLES

### Variables d'environnement (`.env.local`)

```bash
# Supabase (optionnel, déprécié partiellement)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# API Keys (si intégration IA externe)
OPENAI_API_KEY=xxx  # Pour AIChatbot (optionnel)

# Environnement
NODE_ENV=development  # ou production
```

**Note**: `.env.local` n'est pas commité (dans `.gitignore`). Les variables `NEXT_PUBLIC_*` sont exposées au client.

---

## 11. AREAS FOR CLAUDE INTERVENTION

### Code complexe existant

#### 1. `lib/data/products-loader.ts`

- **Complexité**: Logique de fallback multiple (`products-ultimate.json` → `products-full.json`), normalisation images, mapping attributs
- **Pourquoi complexe**: Gestion de multiples formats de données, edge cases (images manquantes, attributs optionnels)
- **Optimisation possible**: 
  - Cache avec `unstable_cache` Next.js
  - Streaming avec Suspense
  - Validation avec Zod

#### 2. `components/ProductCard.tsx` (gestion images)

- **Complexité**: Gestion d'erreur image avec `requestAnimationFrame`, état `hasErrored`, fallback placeholder
- **Pourquoi complexe**: Éviter loops infinis, gestion mémoire, performance
- **Optimisation possible**:
  - Utiliser `next/image` avec `onError` (actuellement `img` pour flexibilité)
  - Preload images prioritaires
  - Lazy loading amélioré

#### 3. `lib/utils/images.ts` (`getValidImageUrl`)

- **Complexité**: Détection multiple patterns (`prod-`, `product_`, `_raw_assets`), décodage URL, fallback
- **Pourquoi complexe**: Edge cases nombreux, performance (appelé à chaque render)
- **Optimisation possible**:
  - Memoization avec `useMemo`
  - Cache des résultats
  - Validation côté serveur (pré-processing)

#### 4. Scripts Python (réconciliation images)

- **Complexité**: Parsing HTML, matching fuzzy, téléchargement batch, gestion erreurs
- **Pourquoi complexe**: Données legacy, formats multiples, robustesse
- **Optimisation possible**:
  - Async/await pour téléchargements parallèles
  - Retry logic avec exponential backoff
  - Validation images avec Pillow

### Features à venir (complexité haute)

#### 1. Authentification utilisateur

- **Fonctionnalité**: Login/Register avec Supabase Auth
- **Pourquoi compliqué**: 
  - Intégration Supabase Auth
  - Gestion sessions (Server/Client)
  - Protection routes
  - Middleware Next.js
- **Où Claude peut aider**: Architecture auth, sécurité, gestion tokens

#### 2. Checkout & Paiement

- **Fonctionnalité**: Intégration Stripe/PayPal, gestion commandes
- **Pourquoi compliqué**:
  - Webhooks sécurisés
  - Gestion stock
  - Emails transactionnels
  - Gestion erreurs paiement
- **Où Claude peut aider**: Architecture checkout, sécurité paiements, gestion erreurs

#### 3. Admin Dashboard

- **Fonctionnalité**: Interface admin pour gestion produits, commandes
- **Pourquoi compliqué**:
  - CRUD produits
  - Upload images
  - Gestion stock
  - Analytics
- **Où Claude peut aider**: Architecture admin, sécurité (RBAC), optimisations

#### 4. Recherche avancée

- **Fonctionnalité**: Filtres multiples (prix, matériau, pierre, style), tri, pagination
- **Pourquoi compliqué**:
  - URL state management (query params)
  - Performance (grand catalogue)
  - UX (filtres combinés)
- **Où Claude peut aider**: Optimisation requêtes, state management, UX

### Performance bottlenecks

#### 1. Chargement initial produits

- **Partie lente**: `getAllProducts()` charge tout le JSON (25k+ produits)
- **Métriques actuelles**: ~500ms-1s (dépend de la taille JSON)
- **Optimisations possibles**:
  - Pagination côté serveur
  - Streaming avec Suspense
  - Cache Redis
  - Indexation Supabase

#### 2. Images produits (43k+ fichiers)

- **Partie lente**: Chargement images non optimisées
- **Métriques actuelles**: Lazy loading partiel, pas d'optimisation automatique
- **Optimisations possibles**:
  - `next/image` partout (optimisation automatique)
  - CDN (Cloudinary, Imgix)
  - WebP/AVIF conversion
  - Preload images prioritaires

#### 3. Recherche Fuse.js (client-side)

- **Partie lente**: Indexation 25k+ produits côté client
- **Métriques actuelles**: ~100-200ms pour indexation initiale
- **Optimisations possibles**:
  - Recherche côté serveur (Algolia, Meilisearch)
  - Debounce amélioré
  - Indexation lazy

---

## 12. EXEMPLES DE CODE REPRÉSENTATIFS

### 1. Composant simple: `ProductCard.tsx`

**Pourquoi représentatif**: Composant le plus utilisé, gestion images, state local, hooks context.

**Patterns utilisés**:
- Client Component (`'use client'`)
- Hooks (`useState`, `useWishlist`)
- Gestion erreur image (`onError`)
- Tailwind classes
- Early return (`if (!product) return null`)

**Améliorations potentielles**:
- Utiliser `next/image` au lieu de `img`
- Memoization avec `React.memo`
- Preload images prioritaires

### 2. Composant complexe: `Navbar.tsx`

**Pourquoi représentatif**: Mega menu, state management, responsive, intégration multiple composants.

**Patterns utilisés**:
- Mega menu avec hover
- Mobile drawer
- Context hooks (`useCart`, `useWishlist`)
- Responsive (`lg:hidden`, `hidden lg:flex`)
- Structure de données (`MENU_STRUCTURE`)

**Améliorations potentielles**:
- Animation avec Framer Motion
- Keyboard navigation
- Focus management (accessibility)

### 3. Page complète: `app/shop/page.tsx`

**Pourquoi représentatif**: Server Component, data fetching, routing dynamique, filtrage.

**Patterns utilisés**:
- Server Component async
- `searchParams` pour query params
- Filtrage côté serveur
- Metadata API

**Améliorations potentielles**:
- Pagination
- Tri (sort)
- Filtres avancés (prix, matériau)
- Suspense boundaries

### 4. Utility file: `lib/utils/images.ts`

**Pourquoi représentatif**: Fonction pure, edge cases nombreux, performance critique.

**Patterns utilisés**:
- Early returns
- Pattern matching (strings)
- Try/catch pour décodage
- Fallback chain

**Améliorations potentielles**:
- Validation avec Zod
- Cache résultats
- Tests unitaires

### 5. Fichier de configuration: `tailwind.config.ts`

**Pourquoi représentatif**: Design system, variables CSS, dark mode.

**Patterns utilisés**:
- Custom colors
- CSS variables avec alpha
- Font configuration
- Dark mode class-based

**Améliorations potentielles**:
- Design tokens (tokens.json)
- Spacing scale cohérent
- Typography scale

---

## 13. WORKFLOW AVEC CLAUDE

### Cas où appeler Claude plutôt que Cursor

#### Types de bugs

1. **Bugs mémoire/performance**:
   - `double free malloc`
   - Memory leaks
   - Performance profiling
   - Optimisation algorithmes

2. **Bugs complexes de state**:
   - Race conditions
   - State synchronization
   - Context performance issues

3. **Bugs de sécurité**:
   - XSS, CSRF
   - Authentication/Authorization
   - Data validation

#### Types de refactoring

1. **Refactoring architecture**:
   - Migration vers nouvelle structure
   - Optimisation data fetching
   - State management migration

2. **Refactoring performance**:
   - Code splitting
   - Bundle optimization
   - Image optimization

3. **Refactoring complexe**:
   - Migration Supabase complète
   - Intégration paiement
   - Admin dashboard

#### Types d'optimisation

1. **Optimisation algorithmes**:
   - Recherche (Fuse.js → Algolia)
   - Filtrage produits
   - Tri et pagination

2. **Optimisation build**:
   - Bundle size
   - Code splitting
   - Tree shaking

3. **Optimisation runtime**:
   - React performance (memo, useMemo)
   - Image loading
   - Data fetching

#### Code reviews spécifiques

1. **Reviews sécurité**:
   - Validation inputs
   - Sanitization
   - Authentication flows

2. **Reviews performance**:
   - N+1 queries
   - Re-renders inutiles
   - Memory leaks

3. **Reviews architecture**:
   - Patterns design
   - Scalabilité
   - Maintenabilité

---

## 14. NOTES IMPORTANTES POUR CLAUDE

### Conventions strictes

1. **Pas d'inline styles**: Toujours Tailwind
2. **Pas de `any`**: TypeScript strict
3. **Server Components par défaut**: `'use client'` seulement si nécessaire
4. **Images**: Utiliser `getValidImageUrl` avant affichage
5. **State**: Context pour global, `useState` pour local

### Points d'attention

1. **Images**: 43k+ fichiers, gestion erreurs critique
2. **Performance**: Catalogue 25k+ produits, optimiser chargement
3. **Dark mode**: Tester en light ET dark
4. **Responsive**: Mobile-first, tester 320px+
5. **Accessibility**: ARIA labels, keyboard navigation

### Workflow de développement

1. **Avant modification**: Lire `.cursorrules` (modulaire)
2. **Pendant développement**: Tester en dev (`npm run dev`)
3. **Avant commit**: Build (`npm run build`), lint (`npm run lint`)
4. **Après modification structurelle**: Exécuter `npm run fix`

### Ressources externes

- **Documentation Next.js**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs
- **Supabase**: https://supabase.com/docs (partiellement utilisé)

---

## 15. RÉSUMÉ EXÉCUTIF

### Points clés pour Claude

1. **Architecture**: Next.js 16 App Router, Server Components par défaut
2. **Styling**: Tailwind CSS uniquement, pas d'inline styles
3. **State**: Context pour global (Cart, Wishlist), localStorage persistence
4. **Images**: 43k+ fichiers, gestion erreurs avec `getValidImageUrl`
5. **Data**: `products-ultimate.json` = source de vérité (25k+ produits)
6. **Bugs connus**: Images 404 (`p-X.jpg`), port 3000 bloqué, URL encoding
7. **Performance**: Chargement initial produits, images non optimisées, recherche client-side

### Zones d'intervention Claude

1. **Bugs complexes**: Mémoire, performance, state synchronization
2. **Refactoring**: Architecture, migration Supabase, optimisations
3. **Features complexes**: Auth, checkout, admin, recherche avancée
4. **Code reviews**: Sécurité, performance, architecture

### Workflow recommandé

1. **Cursor**: Développement features, UI/UX, styling
2. **Claude**: Debug complexe, refactoring, optimisations, code reviews
3. **Gemini**: Project management, planning, documentation

---

**Document généré le**: 2025-01-27  
**Dernière mise à jour**: 2025-01-27  
**Version projet**: 0.1.0



















