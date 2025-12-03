# 🎯 SOLUTION COMPLÈTE - IMAGES KHASHIKA V2.0

## 📊 État Actuel
- **726 produits** scrapés depuis khashika.com
- **100% des images** pointent vers `/placeholder-image.svg`
- **Données produits OK** (noms, prix, descriptions)
- **URLs sources disponibles** sur khashika.com

---

## 🔧 Architecture de la Solution

```
┌─────────────────────────────────────────────────────┐
│  1. DIAGNOSTIC (check-images.ts)                    │
│     └─> Analyse l'état actuel de la base           │
│         ├─ Combien de produits sans images ?       │
│         ├─ Quels sont les exemples ?               │
│         └─ Structure de la table                   │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  2. TEST UNITAIRE (test-one.ts)                     │
│     └─> Test sur 1 produit                         │
│         ├─ Scrape les images                       │
│         ├─ Affiche le HTML trouvé                  │
│         └─ Vérifie les sélecteurs CSS              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  3. CORRECTION MASSIVE (fix-images.ts)              │
│     └─> Boucle sur tous les produits               │
│         ├─ Scrape khashika.com/produit/{slug}      │
│         ├─ Extrait les URLs d'images               │
│         ├─ Met à jour Supabase                     │
│         └─ Affiche progression temps réel          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│  4. RÉSULTAT                                        │
│     └─> Images réelles affichées sur le site       │
│         ├─ /boutique → Grid de produits            │
│         ├─ /produit/{slug} → Galerie d'images      │
│         └─ Cart/Wishlist → Miniatures              │
└─────────────────────────────────────────────────────┘
```

---

## 💡 Workflow Recommandé

### Phase 1: Préparation (5 min)
```bash
# 1. Installer les dépendances
npm install cheerio @types/node tsx

# 2. Configurer .env.local
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# 3. Copier les 3 scripts TypeScript dans le projet
```

### Phase 2: Diagnostic (2 min)
```bash
npm run images:check

# OU
npx tsx check-images.ts
```

**Résultat attendu:**
```
📊 RÉSUMÉ
✅ Vraies images (khashika.com): 0
🖼️  Placeholder: 726
❌ Null/Vide: 0
```

### Phase 3: Test (3 min)
```bash
# Prendre un slug au hasard depuis la base
npm run images:test "boucles-doreille-argent-saphir"

# OU
npx tsx test-one.ts "boucles-doreille-argent-saphir"
```

**Résultat attendu:**
```
✅ 3 image(s) trouvée(s):
   1. https://www.khashika.com/wp-content/uploads/DSC05427-1.jpeg
   2. https://www.khashika.com/wp-content/uploads/DSC05427-2.jpeg
   3. https://www.khashika.com/wp-content/uploads/DSC05427-3.jpeg
```

### Phase 4: Correction (~12 min)
```bash
npm run images:fix

# OU
npx tsx fix-images.ts
```

**Progression affichée:**
```
[1/726] Boucles d'oreille argent...
✅ Mis à jour 3 image(s)

[2/726] Collier pierre de lune...
✅ Mis à jour 2 image(s)

...

📊 RÉSUMÉ
✅ Succès: 720
❌ Erreurs: 6
```

### Phase 5: Vérification (1 min)
```bash
# Relancer le diagnostic
npm run images:check
```

**Résultat attendu:**
```
📊 RÉSUMÉ
✅ Vraies images: 720
🖼️  Placeholder: 0
❌ Erreurs à corriger manuellement: 6
```

---

## 🗂️ Structure des Fichiers

```
khashika-v2/
├── scripts/                    # ← Créer ce dossier
│   ├── check-images.ts        # Diagnostic
│   ├── test-one.ts            # Test unitaire
│   ├── fix-images.ts          # Correction massive
│   └── README.md              # Documentation
├── .env.local                 # Config Supabase
├── package.json               # + scripts npm
└── ...
```

---

## ⚙️ Configuration Supabase

### Structure de la Table `products`

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  images TEXT[],              -- Array d'URLs
  original_url TEXT,          -- URL WordPress source
  category TEXT,
  material TEXT,
  stone TEXT,
  style TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
```

### Permissions RLS (Row Level Security)

```sql
-- Lecture publique (pour le site)
CREATE POLICY "Public read access"
ON products FOR SELECT
TO public
USING (true);

-- Écriture avec SERVICE_ROLE_KEY uniquement
-- (le script utilise cette clé)
```

---

## 🎨 Impact sur le Frontend

### Avant
```tsx
// Dans ProductCard.tsx
<Image
  src="/placeholder-image.svg"  // ❌ Image générique
  alt={product.name}
/>
```

### Après
```tsx
// Dans ProductCard.tsx
<Image
  src={product.images[0]}  // ✅ Vraie image
  alt={product.name}
  // Exemple: https://www.khashika.com/wp-content/uploads/DSC05427-1.jpeg
/>
```

Les composants suivants seront automatiquement corrigés :
- ✅ `/app/boutique/page.tsx` → Grid de produits
- ✅ `/app/produit/[slug]/page.tsx` → Galerie produit
- ✅ `CartContext` → Miniatures panier
- ✅ `WishlistContext` → Miniatures favoris
- ✅ `/app/panier/page.tsx` → Liste panier
- ✅ `/app/favoris/page.tsx` → Liste favoris

**Aucune modification de code frontend nécessaire !** 🎉

---

## 🚨 Gestion des Erreurs

### Cas 1: "Aucune image trouvée"
**Cause:** Sélecteurs CSS incorrects

**Solution:**
1. Ouvre manuellement une page produit sur khashika.com
2. Inspecte le HTML (F12)
3. Note les vrais sélecteurs CSS
4. Modifie `fix-images.ts` lignes 51-75

```typescript
// Exemple de sélecteur personnalisé
$('.ma-classe-custom img').each((_, el) => {
  const src = $(el).attr('src')
  if (src?.includes('khashika.com')) {
    images.push(src)
  }
})
```

### Cas 2: "Rate Limited (429)"
**Cause:** Trop de requêtes simultanées

**Solution:**
Augmente le délai dans `fix-images.ts`:
```typescript
const DELAY_MS = 2000 // Au lieu de 1000
```

### Cas 3: "Slug incorrect"
**Cause:** Le slug en base ne correspond pas à l'URL WordPress

**Solution:**
Ajoute le champ `original_url` lors du scraping:
```typescript
{
  slug: "boucles-oreille-argent",
  original_url: "https://www.khashika.com/produit/boucles-doreille-argent-925/"
}
```

---

## 📈 Optimisations Futures

### Option 1: Hébergement Local
Télécharge toutes les images dans `/public/products/`

**Avantages:**
- ✅ Contrôle total
- ✅ Optimisation Next.js Image
- ✅ Aucune dépendance externe

**Inconvénients:**
- ❌ ~500MB d'images à gérer
- ❌ Temps de déploiement allongé

### Option 2: Supabase Storage
Upload dans un bucket Supabase

**Avantages:**
- ✅ CDN intégré
- ✅ Transformations d'images
- ✅ Pas de quota Vercel

**Inconvénients:**
- ❌ Coût storage (minime)
- ❌ Migration à faire

### Option 3: Images WordPress (actuel)
Garder les URLs khashika.com

**Avantages:**
- ✅ Aucune migration
- ✅ Solution immédiate

**Inconvénients:**
- ❌ Dépendance à l'ancien site
- ❌ Pas d'optimisation Next.js

**Recommandation:** Commencer avec Option 3, migrer vers Option 2 plus tard.

---

## ✅ Checklist Finale

- [ ] Scripts copiés dans le projet
- [ ] Dépendances installées (`cheerio`, `tsx`)
- [ ] `.env.local` configuré avec SERVICE_ROLE_KEY
- [ ] Diagnostic lancé (`check-images.ts`)
- [ ] Test unitaire OK (`test-one.ts`)
- [ ] Correction massive lancée (`fix-images.ts`)
- [ ] Vérification finale (`check-images.ts`)
- [ ] Site testé en local (`npm run dev`)
- [ ] Images affichées correctement
- [ ] Commit des scripts (`git add scripts/`)
- [ ] Déploiement sur Vercel

---

## 🎯 Résultat Attendu

### Boutique (/boutique)
```
┌────────────────┬────────────────┬────────────────┐
│  [IMG RÉELLE]  │  [IMG RÉELLE]  │  [IMG RÉELLE]  │
│  Boucles 199€  │  Collier 349€  │  Bracelet 89€  │
└────────────────┴────────────────┴────────────────┘
```

### Produit (/produit/slug)
```
┌─────────────────────────┐  ┌──────────────────────┐
│   [GALERIE D'IMAGES]    │  │  Boucles d'Oreille   │
│  ┌─────┬─────┬─────┐    │  │  Argent 925 Saphir   │
│  │ IMG │ IMG │ IMG │    │  │                      │
│  └─────┴─────┴─────┘    │  │  199,00 €            │
│    [GRANDE IMAGE]       │  │  [AJOUTER AU PANIER] │
└─────────────────────────┘  └──────────────────────┘
```

---

## 💪 Prochaines Étapes

Une fois les images corrigées:

1. **Filtres Avancés** (15% restant)
   - Prix slider
   - Matériaux, Pierres, Styles
   
2. **Zoom Produit**
   - Lens effect sur hover
   - Fullscreen gallery
   
3. **Chatbot AI**
   - Recommandations conversationnelles
   
4. **Stripe**
   - Paiement réel
   - Webhooks

**Tu veux que je t'aide avec l'une de ces features après ?** 🚀
