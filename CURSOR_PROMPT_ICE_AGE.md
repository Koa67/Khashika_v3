# 🧊 **CURSOR PRO PROMPT — Implémentation Script "Ice Age" (30-45 Minutes)**

---

## 🎯 **Contexte et Objectifs**

Tu travailles sur le projet Next.js **Khashika** (App Router, TypeScript, Tailwind CSS). Le front-end (PLP, PDP, Checkout) et les routes API mockées sont déjà implémentés et validés.

**Objectif de cette session :** Créer un **script d'automatisation "Ice Age"** qui fournira des utilitaires de développement pour rendre le projet plus robuste, propre et évolutif.

---

## 📌 **Tâches à Réaliser**

### **1. Créer le script principal `/scripts/ice_age.ts`**

Le script doit être exécutable via `ts-node` et fournir deux fonctionnalités principales :

#### **A) Scaffolding de Composants React**

**Commande :**
```bash
npm run scaffold MyNewComponent
```

**Comportement attendu :**
- Génère automatiquement `/components/MyNewComponent.tsx`
- Contenu minimal avec structure TypeScript + React
- Vérifie si le fichier existe déjà (empêche l'écrasement)
- Affiche des messages clairs dans le terminal

**Structure du composant généré :**
```tsx
"use client";

import React from "react";

interface MyNewComponentProps {
  // Props à définir
}

export default function MyNewComponent({}: MyNewComponentProps) {
  return (
    <div className="p-4">
      <h2 className="font-heading text-xl font-bold text-secondary">
        MyNewComponent
      </h2>
    </div>
  );
}
```

#### **B) Fallback Images & Placeholders**

**Fonction 1 : `ensurePlaceholderExists()`**
- Vérifie si `/public/placeholder.svg` existe
- Si non, génère un `placeholder.svg` minimal (carré gris clair avec bordure)
- SVG simple et léger

**Fonction 2 : `checkProductImages()`**
- Parcourt les produits dans `/lib/data/products.ts`
- Pour chaque produit, vérifie si l'image existe dans `/public`
- Log les images manquantes
- Optionnel : copie automatiquement `placeholder.svg` sous le nom manquant

**Commande :**
```bash
npm run ice-age -- images
```

---

## 🔧 **Contraintes Techniques Obligatoires**

1. **Fichier principal :** `/scripts/ice_age.ts`
2. **Exécution :** Via `ts-node` (pas de compilation préalable)
3. **Dépendances :** Utiliser uniquement Node.js natif (`fs`, `path`, `process`)
4. **TypeScript strict :** Tous les types doivent être explicites
5. **Gestion d'erreurs :** Try/catch avec messages clairs
6. **Modularité :** Fonctions séparées pour chaque fonctionnalité
7. **Commentaires :** Code bien documenté

---

## 📂 **Fichiers à Créer/Modifier**

| Fichier | Action | Description |
|---------|--------|-------------|
| `/scripts/ice_age.ts` | **Créer** | Script principal avec toutes les fonctionnalités |
| `/package.json` | **Modifier** | Ajouter les scripts npm |
| `/public/placeholder.svg` | **Générer** | Si n'existe pas (via script) |

---

## 📋 **Structure du Script**

Le script doit analyser `process.argv` pour déterminer l'action :

```typescript
// Exemples de commandes :
// npm run ice-age -- component MyButton
// npm run ice-age -- images
// npm run scaffold MyComponent (alias)

const command = process.argv[2]; // "component" ou "images"
const argument = process.argv[3]; // Nom du composant ou undefined
```

**Fonctions à implémenter :**

1. `handleComponentGeneration(componentName: string): void`
   - Valide le nom du composant
   - Vérifie l'existence du fichier
   - Génère le template
   - Affiche le résultat

2. `ensurePlaceholderExists(): void`
   - Vérifie `/public/placeholder.svg`
   - Génère le SVG si absent

3. `checkProductImages(): void`
   - Parse `/lib/data/products.ts`
   - Extrait les chemins d'images
   - Vérifie l'existence dans `/public`
   - Log les manquantes

4. `generateComponentTemplate(name: string): string`
   - Retourne le template TSX formaté

5. `generatePlaceholderSVG(): string`
   - Retourne le SVG minimal

---

## 🎨 **Template SVG Placeholder**

Le placeholder doit être simple et léger :

```svg
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#f3f4f6" stroke="#e5e7eb" stroke-width="2"/>
  <text x="50%" y="50%" font-family="Arial" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">Placeholder</text>
</svg>
```

---

## 📦 **Modifications package.json**

Ajouter dans la section `scripts` :

```json
{
  "scripts": {
    "ice-age": "ts-node ./scripts/ice_age.ts",
    "scaffold": "ts-node ./scripts/ice_age.ts component"
  }
}
```

**Note :** Vérifier que `ts-node` est installé en devDependency. Si non, l'ajouter.

---

## ✅ **Sortie Attendue**

1. **Fichier `/scripts/ice_age.ts` complet :**
   - Code TypeScript strict
   - Fonctions modulaires et commentées
   - Gestion d'erreurs robuste
   - Messages terminal clairs et colorés (optionnel)

2. **Modifications `/package.json` :**
   - Scripts npm ajoutés
   - Vérification de `ts-node` en devDependency

3. **Instructions de test :**
   - Exemple : `npm run scaffold TestComponent`
   - Vérifier que le fichier est créé
   - Exemple : `npm run ice-age -- images`
   - Vérifier les logs

---

## 🚀 **Instructions pour Cursor**

1. **Priorité 1 :** Créer `/scripts/ice_age.ts` avec la fonctionnalité de scaffolding
2. **Priorité 2 :** Ajouter la fonctionnalité images/placeholder
3. **Priorité 3 :** Mettre à jour `package.json`
4. **Validation :** Tester chaque commande et vérifier les résultats

---

## 🔍 **Exemples de Tests**

```bash
# Test 1 : Générer un composant
npm run scaffold BadgePromo
# → Doit créer /components/BadgePromo.tsx

# Test 2 : Tenter de créer un composant existant
npm run scaffold ProductCard
# → Doit afficher une erreur (fichier existe déjà)

# Test 3 : Vérifier les images
npm run ice-age -- images
# → Doit lister les images manquantes

# Test 4 : Générer placeholder si absent
npm run ice-age -- images
# → Doit créer /public/placeholder.svg si absent
```

---

## 📝 **Notes Importantes**

- Le script doit être **idempotent** (peut être exécuté plusieurs fois sans erreur)
- Les messages d'erreur doivent être **clairs et actionnables**
- Le code doit respecter les **conventions du projet** (TypeScript strict, commentaires)
- Ne pas modifier les fichiers existants sans confirmation explicite

---

## 🎯 **Résultat Final**

À la fin de cette session, le projet doit avoir :
- ✅ Script `ice_age.ts` fonctionnel et testé
- ✅ Commandes npm opérationnelles
- ✅ Placeholder SVG généré si nécessaire
- ✅ Documentation claire pour l'utilisation

---

**→ Prêt à implémenter ! Commence par créer le fichier `/scripts/ice_age.ts` avec la structure de base.**



