# 🚀 GUIDE RAPIDE - CORRECTION DES IMAGES KHASHIKA

## 📌 Le Problème
Tes 726 produits affichent `/placeholder-image.svg` au lieu des vraies images.

## ✅ La Solution (3 étapes)

### ÉTAPE 1: Installation (2 minutes)

```bash
# Dans ton projet Khashika v2
npm install cheerio @types/node tsx
```

### ÉTAPE 2: Configuration

Crée/modifie `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ Utilise bien la **SERVICE_ROLE_KEY** (pas la clé anon)

### ÉTAPE 3: Lancement

```bash
# 1️⃣ Diagnostic (voir l'état actuel)
npx tsx check-images.ts

# 2️⃣ Test sur 1 produit
npx tsx test-one.ts "ton-slug-produit"

# 3️⃣ Correction complète
npx tsx fix-images.ts
```

---

## 📁 Fichiers à copier dans ton projet

Je t'ai créé 4 fichiers :

1. **check-images.ts** → Diagnostic de l'état actuel
2. **test-one.ts** → Test sur un produit
3. **fix-images.ts** → Correction automatique de tous les produits
4. **FIX-IMAGES-README.md** → Documentation complète

---

## ⏱️ Temps estimé

- **726 produits** × **1 seconde** = **~12 minutes**
- Le script affiche sa progression en temps réel
- Tu peux l'interrompre (Ctrl+C) et le relancer plus tard

---

## 🎯 Ce que fait le script

### AVANT
```javascript
{
  images: ["/placeholder-image.svg"]
}
```

### APRÈS
```javascript
{
  images: [
    "https://www.khashika.com/wp-content/uploads/DSC05427-1.jpeg",
    "https://www.khashika.com/wp-content/uploads/DSC05427-2.jpeg"
  ]
}
```

---

## ❓ FAQ

### "Aucune image trouvée" ?
Les sélecteurs CSS ne matchent pas. Lance `test-one.ts` sur un produit et ajuste les sélecteurs.

### "Rate Limited (429)" ?
Augmente le délai dans `fix-images.ts` ligne 23 :
```typescript
const DELAY_MS = 2000 // 2 secondes au lieu de 1
```

### Je veux héberger les images localement ?
Voir `FIX-IMAGES-README.md` section "Alternatives"

---

## 🆘 Besoin d'aide ?

Si ça ne marche pas, envoie-moi :
1. Le résultat de `npx tsx check-images.ts`
2. Le résultat de `npx tsx test-one.ts "un-slug"`
3. L'URL d'un produit qui ne marche pas

Et je débugge ça tout de suite ! 💪
