# 🖼️ Khashika v2.0 - Solution Images

**Problème:** Les 726 produits affichent `/placeholder-image.svg`  
**Solution:** Scripts automatiques pour récupérer les vraies URLs depuis khashika.com  
**Temps:** ~20 minutes  
**Résultat:** 720+ produits avec images réelles

---

## 📁 Contenu du Dossier

```
khashika-images-fix/
├── README.md                   ← Tu es ici
├── QUICK-START.md             ← Démarrage rapide (COMMENCE ICI)
├── CHECKLIST.md               ← Checklist étape par étape
├── SOLUTION-COMPLETE.md       ← Documentation technique complète
├── FIX-IMAGES-README.md       ← Guide détaillé du script principal
├── package-scripts.json       ← Scripts npm à ajouter
├── check-images.ts            ← Script 1: Diagnostic
├── test-one.ts                ← Script 2: Test unitaire
└── fix-images.ts              ← Script 3: Correction massive
```

---

## 🚀 Démarrage Rapide

### 1. Copie les fichiers dans ton projet

```bash
# Dans ton projet Khashika v2
mkdir -p scripts
cp *.ts scripts/
```

### 2. Installe les dépendances

```bash
npm install cheerio @types/node tsx
```

### 3. Configure Supabase

Crée/modifie `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Lance le diagnostic

```bash
npx tsx scripts/check-images.ts
```

### 5. Teste sur 1 produit

```bash
npx tsx scripts/test-one.ts "ton-slug-produit"
```

### 6. Corrige tout (~12 min)

```bash
npx tsx scripts/fix-images.ts
```

---

## 📖 Documentation

### Quel fichier lire en premier ?

| Profil | Fichier Recommandé |
|--------|-------------------|
| Je veux juste que ça marche | **QUICK-START.md** |
| Je veux suivre étape par étape | **CHECKLIST.md** |
| Je veux comprendre l'architecture | **SOLUTION-COMPLETE.md** |
| Je veux les détails techniques | **FIX-IMAGES-README.md** |

---

## 🎯 Ce que font les scripts

### check-images.ts
- 🔍 Analyse l'état actuel de la base
- 📊 Compte les produits avec/sans images
- 📋 Montre des exemples
- ⏱️ Durée: ~30 secondes

### test-one.ts
- 🧪 Test sur un seul produit
- 🔍 Affiche le HTML scrapé
- ✅ Vérifie que le scraping fonctionne
- ⏱️ Durée: ~5 secondes

### fix-images.ts
- 🚀 Correction automatique de tous les produits
- 🔄 Boucle sur les 726 produits
- 📈 Affiche progression temps réel
- ⏱️ Durée: ~12 minutes (1 sec/produit)

---

## 🎨 Avant / Après

### AVANT
```typescript
{
  name: "Boucles d'oreille argent...",
  images: ["/placeholder-image.svg"]
}
```

### APRÈS
```typescript
{
  name: "Boucles d'oreille argent...",
  images: [
    "https://www.khashika.com/wp-content/uploads/DSC05427-1.jpeg",
    "https://www.khashika.com/wp-content/uploads/DSC05427-2.jpeg",
    "https://www.khashika.com/wp-content/uploads/DSC05427-3.jpeg"
  ]
}
```

---

## ⚙️ Configuration

### Variables d'environnement requises

```env
# URL de ton projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co

# Clé SERVICE (pas la clé anon!)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Dépendances NPM

```json
{
  "devDependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@types/node": "^20.10.0",
    "cheerio": "^1.0.0-rc.12",
    "tsx": "^4.7.0"
  }
}
```

---

## 🆘 Problèmes Courants

### "Variables d'environnement manquantes"
➡️ Vérifie que `.env.local` existe avec les 2 clés

### "Aucune image trouvée"
➡️ Les sélecteurs CSS ne matchent pas. Utilise `test-one.ts` pour débugger

### "Rate Limited (429)"
➡️ Augmente `DELAY_MS` à 2000 dans `fix-images.ts`

### "HTTP 404"
➡️ Le slug ne correspond pas à l'URL WordPress. Vérifie ta base

---

## 📊 Statistiques

- **Produits total:** 726
- **Temps par produit:** ~1 seconde
- **Temps total:** ~12 minutes
- **Taux de succès attendu:** 95-99%
- **Images par produit:** 2-4 en moyenne

---

## 🔗 Liens Utiles

- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Cheerio Docs](https://cheerio.js.org/)

---

## ✅ Checklist Rapide

- [ ] Fichiers copiés dans `scripts/`
- [ ] Dépendances installées
- [ ] `.env.local` configuré
- [ ] Diagnostic lancé
- [ ] Test unitaire OK
- [ ] Correction lancée
- [ ] Images visibles sur le site
- [ ] Scripts committés
- [ ] Déployé sur Vercel

---

## 🎉 Résultat Final

Une fois terminé:
- ✅ 720+ produits avec vraies images
- ✅ Site professionnel et fonctionnel
- ✅ Scripts réutilisables
- ✅ Documentation complète

**Prêt à passer aux 15% restants ?**
1. Filtres avancés
2. Zoom produit  
3. Chatbot AI
4. Stripe

---

## 💬 Support

Si tu as des problèmes:
1. Lis `QUICK-START.md`
2. Vérifie `CHECKLIST.md`
3. Consulte `SOLUTION-COMPLETE.md`
4. Reviens me voir avec les logs d'erreur

**Je suis là pour t'aider !** 💪
