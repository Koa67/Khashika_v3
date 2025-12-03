# ✅ CHECKLIST - CORRECTION IMAGES KHASHIKA

## ⏱️ Temps Total: ~20 minutes

---

## 📦 ÉTAPE 1: Installation (5 min)

```bash
cd ton-projet-khashika-v2

# Copier tous les fichiers du dossier scripts/
# ├── check-images.ts
# ├── test-one.ts
# └── fix-images.ts

# Installer les dépendances
npm install cheerio @types/node tsx
```

**✅ Checkpoint:** Les 3 fichiers .ts sont dans ton projet

---

## 🔐 ÉTAPE 2: Configuration (2 min)

Créer/modifier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ Utilise bien la **SERVICE_ROLE_KEY** (pas la clé anon)
> Tu la trouves dans : Supabase Dashboard → Settings → API → service_role key

**✅ Checkpoint:** Variables d'environnement configurées

---

## 🔍 ÉTAPE 3: Diagnostic (2 min)

```bash
npx tsx check-images.ts
```

**Résultat attendu:**
```
📊 RÉSUMÉ
✅ Vraies images: 0
🖼️  Placeholder: 726
❌ Null/Vide: 0
```

**✅ Checkpoint:** Tu vois combien de produits ont besoin d'être corrigés

---

## 🧪 ÉTAPE 4: Test Unitaire (3 min)

Récupère un slug depuis ta base Supabase, puis :

```bash
npx tsx test-one.ts "ton-slug-ici"
```

**Résultat attendu:**
```
✅ 3 image(s) trouvée(s):
   1. https://www.khashika.com/wp-content/uploads/DSC05427-1.jpeg
   2. https://www.khashika.com/wp-content/uploads/DSC05427-2.jpeg
```

**Si aucune image n'est trouvée:**
1. Vérifie l'URL générée
2. Va sur la page manuellement
3. Inspecte le HTML (F12)
4. Ajuste les sélecteurs dans `fix-images.ts`

**✅ Checkpoint:** Le scraping fonctionne sur au moins 1 produit

---

## 🚀 ÉTAPE 5: Correction Massive (~12 min)

```bash
npx tsx fix-images.ts
```

**Progression:**
```
🚀 Démarrage du script de correction des images...

📦 726 produits à traiter

[1/726] Boucles d'oreille argent...
🔍 Scraping: https://www.khashika.com/produit/...
✅ Trouvé 3 image(s)
✅ Mis à jour 3 image(s)

[2/726] Collier pierre de lune...
...
```

> 💡 Le script prend ~1 seconde par produit
> Tu peux l'interrompre (Ctrl+C) et le relancer plus tard

**✅ Checkpoint:** Script terminé avec succès

---

## ✔️ ÉTAPE 6: Vérification (2 min)

```bash
# Relancer le diagnostic
npx tsx check-images.ts
```

**Résultat attendu:**
```
📊 RÉSUMÉ
✅ Vraies images: 720+
🖼️  Placeholder: 0
```

**Puis teste le site:**
```bash
npm run dev
```

Vérifie que les images s'affichent sur :
- `/boutique` (grid de produits)
- `/produit/[slug]` (galerie)
- `/panier` (miniatures)
- `/favoris` (miniatures)

**✅ Checkpoint:** Images visibles sur le site

---

## 🎯 ÉTAPE 7: Commit & Deploy (2 min)

```bash
# Commit les scripts pour usage futur
git add scripts/
git commit -m "feat: add image fixing scripts"

# Push
git push origin main

# Vercel déploiera automatiquement
```

**✅ Checkpoint:** Site en production avec vraies images

---

## 📊 Résumé Final

| Étape | Durée | Status |
|-------|-------|--------|
| Installation | 5 min | [ ] |
| Configuration | 2 min | [ ] |
| Diagnostic | 2 min | [ ] |
| Test | 3 min | [ ] |
| Correction | 12 min | [ ] |
| Vérification | 2 min | [ ] |
| Deploy | 2 min | [ ] |
| **TOTAL** | **~28 min** | [ ] |

---

## 🆘 En Cas de Problème

### Problème: Variables d'environnement manquantes
```bash
❌ Variables d'environnement manquantes:
   - NEXT_PUBLIC_SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY
```

**Solution:** Vérifie que `.env.local` existe et contient les bonnes clés

---

### Problème: Aucune image trouvée
```bash
❌ Aucune image trouvée!
```

**Solutions possibles:**
1. L'URL du produit est incorrecte
2. Les sélecteurs CSS ne matchent pas
3. Le site WordPress a changé sa structure

**Debug:**
```bash
# Test manuel
npx tsx test-one.ts "https://www.khashika.com/produit/ton-produit/"
```

---

### Problème: Rate Limited (429)
```bash
❌ Erreur scraping: HTTP 429
```

**Solution:** Augmente le délai dans `fix-images.ts`:
```typescript
const DELAY_MS = 2000 // Au lieu de 1000
```

---

## 🎉 SUCCESS!

Une fois terminé, tu auras:
- ✅ 720+ produits avec vraies images
- ✅ Site professionnel et fonctionnel
- ✅ Scripts réutilisables pour l'avenir
- ✅ Documentation complète

**Prochaine étape?** Passe aux 15% restants:
1. Filtres avancés
2. Zoom produit
3. Chatbot AI
4. Stripe integration

**Besoin d'aide?** Reviens me voir! 💪
