# 🛍️ KHASHIKA - Système de Filtres Avancé

## 📋 Vue d'ensemble

Système de filtrage complet et luxueux pour la boutique Khashika, conçu pour réduire la "paralysie du choix" et augmenter l'engagement de 15-20%.

### ✨ Fonctionnalités

- **Navigation à facettes** multi-critères
- **Filtres visuels** (swatches couleurs, pierres, styles)
- **Slider de prix** double curseur avec presets
- **Design responsive** (sidebar desktop, modale mobile)
- **Animations fluides** avec Framer Motion
- **Persistance des filtres** (localStorage + URL)
- **URLs SEO-friendly** (`/boutique?materiau=argent&pierre=turquoise`)
- **Compteurs dynamiques** par option
- **Gestion des états vides** élégante

---

## 📁 Structure des fichiers

```
components/filters/
├── index.ts                 # Export centralisé
├── useFilters.ts            # Hook de gestion des filtres
├── FilterSidebar.tsx        # Sidebar desktop (280px, sticky)
├── FilterModal.tsx          # Modale mobile (plein écran)
├── PriceRangeSlider.tsx     # Double slider interactif
├── StoneFilter.tsx          # Filtre pierres avec swatches
├── ColorSwatches.tsx        # Nuancier de couleurs
├── StyleGrid.tsx            # Grille visuelle des styles
├── FilterUI.tsx             # Chips, Sort, MobileBar
└── FilterStates.tsx         # Skeleton, Empty state

app/boutique/
└── page.tsx                 # Page boutique complète

styles/
└── filters.css              # Styles additionnels
```

---

## 🚀 Installation

### 1. Copier les fichiers

```bash
# Depuis le dossier téléchargé
cp -r components/filters /Users/koa/khashika/components/
cp app/boutique/page.tsx /Users/koa/khashika/app/boutique/page.tsx
cp styles/filters.css /Users/koa/khashika/styles/
```

### 2. Installer les dépendances

```bash
cd /Users/koa/khashika
npm install framer-motion lucide-react
```

### 3. Importer les styles

Dans `app/globals.css` :

```css
@import '../styles/filters.css';
```

### 4. Vérifier les imports

Le système utilise ces alias (vérifier `tsconfig.json`) :

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"]
    }
  }
}
```

---

## 🔧 Configuration

### Personnaliser les filtres disponibles

Dans `components/filters/useFilters.ts`, modifiez `FILTER_CONFIG` :

```typescript
export const FILTER_CONFIG = {
  materials: [
    { id: 'argent-925', label: 'Argent 925', icon: '🥈' },
    // Ajouter/modifier les matériaux
  ],
  
  stones: [
    { id: 'turquoise', label: 'Turquoise', color: '#40E0D0' },
    // Ajouter/modifier les pierres
  ],
  
  // etc.
};
```

### Personnaliser les plages de prix

```typescript
// Dans PriceRangeSlider.tsx ou lors de l'utilisation
<PriceRangeSlider
  min={0}
  max={1000}  // Modifier selon votre catalogue
  step={10}   // Pas du slider
  currency="€"
/>
```

### Personnaliser les couleurs

Couleur principale : `#2596be` (Turquoise Khashika)

Pour changer, rechercher/remplacer dans tous les fichiers :
- `#2596be` → Votre couleur principale
- `#1a7a9e` → Version plus foncée (hover)
- `#40c4ff` → Version plus claire (accents)

---

## 📱 Responsive Breakpoints

| Appareil | Comportement |
|----------|-------------|
| Desktop (≥1024px) | Sidebar gauche sticky 280px |
| Tablet (768-1023px) | Modale + barre horizontale |
| Mobile (<768px) | Modale plein écran, targets 44px |

---

## 🎨 Personnalisation du design

### Changer le style des cards

Dans `app/boutique/page.tsx`, modifiez le composant `ProductCard` :

```tsx
// Exemple : cards plus arrondies
className="rounded-3xl" // au lieu de rounded-2xl

// Exemple : ombre plus prononcée
className="shadow-xl" // au lieu de shadow-sm
```

### Ajouter de nouvelles facettes

1. Ajouter dans `FILTER_CONFIG` de `useFilters.ts`
2. Ajouter le state dans `FilterState` interface
3. Ajouter la logique de filtrage dans `useMemo`
4. Ajouter l'UI dans `FilterSidebar.tsx` et `FilterModal.tsx`

---

## 🔍 SEO

Les filtres génèrent des URLs propres :

```
/boutique                           → Tous les produits
/boutique?materiau=argent-925       → Filtre matériau
/boutique?pierre=turquoise,lapis    → Multi-pierres
/boutique?prix=50-200&tri=price-asc → Prix + tri
```

Pour améliorer le SEO, ajoutez dans `app/boutique/page.tsx` :

```tsx
export const metadata = {
  title: 'Boutique Bijoux Indiens | Khashika',
  description: 'Découvrez notre collection de bijoux indiens artisanaux...',
  alternates: {
    canonical: 'https://khashika.com/boutique',
  },
};
```

---

## ⚡ Performance

### Optimisations incluses

- **Lazy loading** des images
- **Skeleton loading** pendant le chargement
- **Debounce** sur les filtres rapides
- **Memoization** avec `useMemo` et `useCallback`
- **AnimatePresence** pour animations optimisées

### Recommandations additionnelles

Pour un catalogue de 700+ produits :

1. **Pagination** ou **Infinite scroll** (limiter à 24-48 produits visibles)
2. **API Route** pour le filtrage côté serveur (si lent)
3. **Algolia/MeiliSearch** pour la recherche à facettes avancée

---

## 🐛 Dépannage

### Les images ne s'affichent pas

Vérifier les chemins dans `products-ultimate.json` :

```json
{
  "image": "/images/products/produit-1.jpg"  // Chemin relatif depuis public/
}
```

### Les filtres ne persistent pas

Vérifier que localStorage est accessible :

```typescript
// Dans useFilters.ts
if (typeof window !== 'undefined') {
  localStorage.setItem('khashika-filters', JSON.stringify(filters));
}
```

### Erreur "Module not found"

Vérifier les alias dans `tsconfig.json` et redémarrer le serveur :

```bash
npm run dev
```

---

## 📞 Support

- **Documentation Khashika** : Google Drive > _KHASHIKA_MASTER_BRIEF.md
- **Issues** : GitHub repo ou Claude Code
- **Design System** : Figma (si disponible)

---

## 🎯 Prochaines étapes

1. [ ] Intégrer avec le vrai `products-ultimate.json`
2. [ ] Ajouter les images de pierres dans `/public/images/stones/`
3. [ ] Ajouter les images de styles dans `/public/images/styles/`
4. [ ] Tester sur mobile (iOS Safari, Android Chrome)
5. [ ] Optimiser les performances si nécessaire
6. [ ] Connecter au système de panier existant

---

**Créé pour Khashika v2.0** | Décembre 2025
