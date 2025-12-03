# 🖼️ Script de Correction des Images Khashika

## Problème
Les images des produits pointent vers `/placeholder-image.svg` au lieu des vraies URLs du site WordPress.

## Solution
Ce script va automatiquement :
1. ✅ Récupérer tous les produits avec des images manquantes
2. 🔍 Scraper les vraies URLs depuis khashika.com
3. 💾 Mettre à jour ta base Supabase avec les bonnes URLs

---

## 📦 Installation

### 1. Installer les dépendances

```bash
npm install cheerio @types/node tsx
# ou
yarn add cheerio @types/node tsx
```

### 2. Configurer les variables d'environnement

Crée ou modifie ton fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **ATTENTION** : Utilise bien la `SERVICE_ROLE_KEY` (pas la clé anon) car elle permet les mises à jour.

---

## 🚀 Utilisation

### Mode Test (5 produits)
```bash
npx tsx fix-images.ts --test
```

### Mode Complet (tous les produits)
```bash
npx tsx fix-images.ts
```

Le script va :
- Afficher sa progression en temps réel
- Attendre 1 seconde entre chaque requête (pour ne pas surcharger le serveur)
- Afficher un résumé à la fin

---

## 📊 Que va faire le script ?

### Avant
```typescript
{
  id: "123",
  name: "Boucles d'oreille argent...",
  images: ["/placeholder-image.svg"]
}
```

### Après
```typescript
{
  id: "123",
  name: "Boucles d'oreille argent...",
  images: [
    "https://www.khashika.com/wp-content/uploads/DSC05427-1.jpeg",
    "https://www.khashika.com/wp-content/uploads/DSC05427-2.jpeg"
  ]
}
```

---

## 🔧 Personnalisation

### Changer le délai entre requêtes
Dans `fix-images.ts`, ligne 23 :
```typescript
const DELAY_MS = 1000 // 1 seconde (augmente si tu as des erreurs 429)
```

### Changer les sélecteurs CSS
Si les images ne sont pas détectées, modifie les sélecteurs ligne 51-75 :
```typescript
$('.ton-selecteur-custom img').each((_, el) => {
  // ...
})
```

---

## ⚠️ Problèmes Courants

### "Variables d'environnement manquantes"
➡️ Vérifie que ton `.env.local` contient bien les deux clés.

### "HTTP 404 Not Found"
➡️ Le slug du produit ne correspond pas à l'URL WordPress. Vérifie que tu stockes bien le `slug` ou `original_url` dans ta table `products`.

### "Aucune image trouvée"
➡️ Les sélecteurs CSS ne matchent pas. Inspecte une page produit sur khashika.com pour voir les vrais sélecteurs.

### "Rate Limited (429)"
➡️ Augmente le `DELAY_MS` à 2000 ou 3000.

---

## 🎯 Alternatives

### Option 1 : Télécharger toutes les images localement
Si tu veux héberger les images sur ton propre serveur Next.js :

```typescript
// Ajouter cette fonction au script
async function downloadImage(url: string, productId: string) {
  const response = await fetch(url)
  const buffer = await response.arrayBuffer()
  const filename = `${productId}-${Date.now()}.jpg`
  await fs.writeFile(`./public/products/${filename}`, Buffer.from(buffer))
  return `/products/${filename}`
}
```

### Option 2 : Utiliser l'API Supabase Storage
Upload les images dans un bucket Supabase :

```typescript
const { data, error } = await supabase.storage
  .from('products')
  .upload(`${productId}/${filename}`, buffer)
```

---

## 📝 Structure de la table `products`

Le script s'attend à cette structure :

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY,
  name TEXT,
  slug TEXT,
  original_url TEXT, -- Optionnel mais recommandé
  images TEXT[], -- Array d'URLs
  -- ... autres colonnes
);
```

Si ta structure est différente, adapte les requêtes dans le script (lignes 117 et 146).

---

## ✅ Checklist

- [ ] J'ai installé `cheerio` et `tsx`
- [ ] J'ai configuré `.env.local` avec les clés Supabase
- [ ] J'ai testé sur 5 produits d'abord (`--test`)
- [ ] Le test a fonctionné, je lance sur tous les produits
- [ ] J'ai vérifié que les images s'affichent sur le site
- [ ] J'ai commit le script dans le repo (pour usage futur)

---

## 🆘 Besoin d'aide ?

Si le script ne fonctionne pas, donne-moi :
1. Le message d'erreur complet
2. Un exemple d'URL de produit qui ne marche pas
3. La structure exacte de ta table `products`

Et je t'aide à le débugger ! 💪
