# Bibliothèques et Utilitaires

## supabase.ts

- Client Supabase configuré
- Méthodes mockées pour le développement
- Gestion des erreurs intégrée

## db/

- Utilitaires de base de données
- Types de données partagés

### Fonctions exportées

#### `getProducts()`
Récupère tous les produits depuis Supabase.
- **Retour** : `Promise<Product[]>`
- **Fallback** : Retourne `products` depuis `@/lib/data/products`

#### `getProductBySlug(slug: string)`
Récupère un produit spécifique par son slug.
- **Paramètres** : `slug` (string)
- **Retour** : `Promise<Product | null>`
- **Fallback** : Recherche dans les données mock

#### `getCart(userId?: string)`
Récupère le panier d'un utilisateur.
- **Paramètres** : `userId` (optionnel)
- **Retour** : `Promise<Cart>`
- **Fallback** : Retourne un panier vide

### Configuration

#### Variables d'environnement
Créer un fichier `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL='https://your-project.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-anon-key'
```

#### Mode Mock
Si les variables ne sont pas définies ou si Supabase est indisponible, le système utilise automatiquement les données mock.

### Structure de la base de données (Supabase)

#### Table `products`
```sql
- id: uuid (primary key)
- title: text
- price: decimal
- image: text (URL)
- images: text[] (array d'URLs)
- description: text
- slug: text (unique)
- is_new: boolean
- is_on_sale: boolean
- material: text
- stone: text
- style: text
- characteristics: jsonb
- reviews: jsonb
- created_at: timestamp
```

#### Table `cart_items`
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key)
- product_id: uuid (foreign key)
- quantity: integer
- created_at: timestamp
```

### Migration vers Supabase

1. Créer un projet Supabase
2. Créer les tables selon le schéma ci-dessus
3. Ajouter les variables d'environnement
4. Le système basculera automatiquement vers Supabase

### Logs et Debugging
Les erreurs sont loggées dans la console avec `console.warn` et `console.error`. Le système continue de fonctionner même en cas d'erreur grâce au fallback.


