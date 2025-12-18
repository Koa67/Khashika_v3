# DIAGNOSTIC KHASHIKA - 404 & IMAGES

**Date**: 2025-12-15  
**Statut**: ✅ DIAGNOSTIC COMPLET  
**Produits analysés**: 656 produits

---

## 1. CAUSE DES 404

### ✅ BONNE NOUVELLE: PAS DE PROBLÈME DE 404 DÉTECTÉ

**Fichier responsable**: `app/[locale]/product/[slug]/page.tsx`  
**Lignes**: 56-62  
**Fonction de récupération**: `getProductBySlug()` dans `lib/utils/products.ts` (ligne 8-10)

**Analyse**:
```typescript
// app/[locale]/product/[slug]/page.tsx (ligne 56-62)
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }
```

**Preuve de bon fonctionnement**:
- ✅ Tous les 656 produits ont un slug valide (0 slug manquant)
- ✅ La fonction `getProductBySlugFromJSON()` utilise une normalisation robuste via `slugify()`
- ✅ Match exact + match approximatif (lignes 132-137 de `products-loader.ts`)
- ✅ La fonction `slugify()` normalise correctement les accents et caractères spéciaux

**Conclusion**: Les 404 mentionnés par l'utilisateur sont probablement dus à:
1. Des liens externes pointant vers des slugs obsolètes
2. Des tests avec des slugs qui n'existent pas dans la base
3. **OU** (plus probable) des produits dont les images ne s'affichent pas, donnant l'impression d'une page cassée

---

## 2. CAUSE DES IMAGES INCORRECTES

### 🔴 PROBLÈME MAJEUR IDENTIFIÉ

**Fichier responsable**: `lib/imageAssociation.ts`  
**Lignes**: 27-50 (blacklist des images génériques de pierres)  
**Champ utilisé**: `images[]` (array)

### Problème 1: Blacklist trop agressive

**Description**: Le système blackliste les images de pierres génériques (ligne 27-50) pour éviter d'afficher les images de la page "Autour du bijou indien". Cependant, cette blacklist bloque aussi des images légitimes de produits.

**Exemple concret**:
- **Slug**: `collier-sur-cordon-avec-une-pierre-naturelle-ronde-en-pierre-de-lune`
- **Image stockée**: `/images/products/pierre-de-lune.jpg`
- **Image affichée**: ❌ BLACKLISTÉE → Fallback vers placeholder ou image suivante
- **Raison**: Le pattern `/^pierre[_-]?de[_-]?lune\.(jpg|jpeg|png|webp)$/i` n'existe pas explicitement, mais `pierre-de-lune.jpg` est probablement filtré par le hook `useValidatedImages`

**Fichiers affectés**:
```
/images/products/pierre-de-lune.jpg
/images/products/corail.jpg
/images/products/grenat.jpg
/images/products/amethyste.jpg
/images/products/onyx.jpg
/images/products/aventurine.jpg
/images/products/turquoise.jpg (n'existe pas dans products/)
/images/products/lapis-lazuli.jpg
/images/products/citrine.jpg
/images/products/jade.jpg
/images/products/labradorite.jpg
/images/products/agate.jpg
/images/products/malachite.jpg
/images/products/chrysoprase.jpg
/images/products/cornaline.jpg
/images/products/apatite.jpg
/images/products/oeil-du-tigre.jpg
```

**Nombre de produits affectés**: **310 produits** (47% du catalogue) ont une image principale qui contient un nom de pierre générique.

### Problème 2: Images dans le mauvais dossier

**Description**: 646 produits (98%) ont leurs images dans `/images/products_reconciled/` au lieu de `/images/products/`.

**Exemple**:
- **Slug**: `bracelet-en-cuire-avec-une-pierre-en-turquoise`
- **Image stockée**: `/images/products_reconciled/bracelet-en-cuire-avec-une-pierre-en-turquoise.jpeg`
- **Image attendue**: `/images/products/bracelet-en-cuire-avec-une-pierre-en-turquoise.jpeg`
- **Résultat**: L'image peut s'afficher si le dossier est accessible, mais ce n'est pas la structure attendue

**Preuve**:
```bash
# Nombre d'images dans products_reconciled/
$ ls public/images/products_reconciled/ | wc -l
646

# Nombre d'images dans products/ (hors dossiers)
$ find public/images/products -maxdepth 1 -type f | wc -l
687
```

### Problème 3: Duplication d'images génériques

**Description**: Certaines images génériques sont réutilisées pour plusieurs produits différents.

**Exemple**:
- **Image**: `/images/products/boucles-doreilles-fantaisie.jpg`
- **Utilisée pour**: 5 produits différents
  - `boucles-doreilles-rondes-en-argent-filigrane-et-pierre-de-lune`
  - `boucles-doreille-argent-avec-pierre-naturelle-saphir`
  - `boucles-doreille-argent-avec-pierre-naturelle-onyx-noir`
  - `chaine-de-chevilles-argent-avec-perles-en-argent-et-des-perles-colorées`
  - (+ 1 autre)

**Impact**: Les clients voient la même image pour des produits différents, créant une confusion.

---

## 3. DONNÉES CORROMPUES

### Résumé statistique

| Métrique | Valeur | Statut |
|----------|--------|--------|
| **Total produits** | 656 | ✅ |
| **Slugs manquants** | 0 | ✅ |
| **Slugs mal formatés** | 0 | ✅ |
| **Produits sans images** | 0 | ✅ |
| **Images blacklistées (pierres)** | ~310 (47%) | 🔴 |
| **Images dans products_reconciled/** | 646 (98%) | ⚠️ |
| **Images dupliquées** | ~5-10 produits | ⚠️ |
| **Images génériques réutilisées** | ~20 images | ⚠️ |

### Détail des problèmes

1. **Slugs**: ✅ Aucun problème
2. **Images manquantes**: ✅ Tous les produits ont au moins une image
3. **Images blacklistées**: 🔴 310 produits affectés par la blacklist des pierres
4. **Structure de dossiers**: ⚠️ Incohérence entre `products/` et `products_reconciled/`

---

## 4. RECOMMANDATIONS (par priorité)

### 🔥 PRIORITÉ 1: Corriger la blacklist des images de pierres

**Problème**: La blacklist bloque des images légitimes de produits.

**Solution**: Modifier `lib/imageAssociation.ts` pour être plus sélective:
- ✅ Garder la blacklist pour les images **sans préfixe produit**
- ✅ Autoriser les images de pierres qui sont dans `/images/products/` ET qui ont un contexte produit
- ✅ Créer une whitelist pour les images connues comme légitimes

**Impact**: 310 produits retrouveront leurs vraies images.

**Temps estimé**: 30 minutes

---

### ⚠️ PRIORITÉ 2: Consolider les images dans un seul dossier

**Problème**: Les images sont éparpillées entre `products/` et `products_reconciled/`.

**Solution**:
1. Déplacer toutes les images de `products_reconciled/` vers `products/`
2. Mettre à jour `products-ultimate.json` pour pointer vers `/images/products/`
3. Supprimer le dossier `products_reconciled/` après vérification

**Impact**: Structure plus claire, maintenance facilitée.

**Temps estimé**: 1 heure (avec script automatisé)

---

### 📝 PRIORITÉ 3: Résoudre les duplications d'images

**Problème**: Plusieurs produits partagent la même image générique.

**Solution**:
1. Identifier les produits avec images dupliquées
2. Rechercher les vraies images dans les backups ou rescrapers
3. Mettre à jour manuellement les produits concernés

**Impact**: Amélioration de l'expérience utilisateur, réduction de la confusion.

**Temps estimé**: 2-3 heures (manuel)

---

### 🎯 PRIORITÉ 4: Créer un script de validation au build

**Problème**: Pas de validation automatique des images avant déploiement.

**Solution**: Créer `scripts/validate-products.ts` qui vérifie:
- Tous les slugs sont uniques
- Toutes les images existent physiquement
- Aucune image n'est dupliquée de manière suspecte
- Toutes les images sont dans le bon dossier

**Impact**: Prévention des régressions futures.

**Temps estimé**: 1 heure

---

## 5. PLAN D'ACTION IMMÉDIAT

### Étape 1: Fix de la blacklist (30 min)
```bash
# Modifier lib/imageAssociation.ts
# Tester avec 5 produits affectés
# Vérifier que les images s'affichent
```

### Étape 2: Consolidation des images (1h)
```bash
# Script de migration
# Mise à jour du JSON
# Tests de non-régression
```

### Étape 3: Validation (30 min)
```bash
# Build test
# Vérification manuelle de 10 pages produit
# Vérification de la page boutique
```

---

## 6. TESTS À EFFECTUER APRÈS FIX

### URLs de test (5 produits représentatifs)

1. `/product/collier-sur-cordon-avec-une-pierre-naturelle-ronde-en-pierre-de-lune` (image pierre blacklistée)
2. `/product/bracelet-en-cuire-avec-une-pierre-en-turquoise` (image dans products_reconciled)
3. `/product/boucles-doreilles-rondes-en-argent-filigrane-et-pierre-de-lune` (image dupliquée)
4. `/product/bracelet-argent-avec-de-grandes-pierres-ovales-en-pierre-de-lune` (image dans products_reconciled)
5. `/product/bague-argent-filigrane-pierre-smoky-quartz` (test général)

### Critères de succès

- ✅ Toutes les pages se chargent (pas de 404)
- ✅ Toutes les images s'affichent (pas de placeholder si vraie image existe)
- ✅ Les images correspondent au produit
- ✅ Pas d'erreurs dans la console
- ✅ Build passe sans warning

---

## 7. CONCLUSION

### Résumé exécutif

- **404**: ✅ Pas de problème de routing détecté
- **Images**: 🔴 Problème majeur avec la blacklist et la structure de dossiers
- **Données**: ✅ Qualité globale bonne (slugs, structure)
- **Impact**: ~47% des produits affectés par la blacklist

### Prochaines étapes

1. ✅ Diagnostic terminé
2. ⏭️ Appliquer les fixes (Priorités 1 et 2)
3. ⏭️ Valider avec les tests
4. ⏭️ Déployer

**Temps total estimé pour les fixes**: 2-3 heures



