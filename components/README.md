# KHASHIKA - Luxury Jewelry E-commerce 💎

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/License-MIT-green)

Une plateforme e-commerce haut de gamme spécialisée dans la bijouterie indienne, alliant **design "Luxe Organique"** et **performance technique moderne**. Interface intuitive, composants réutilisables et architecture scalable.

---

## 📑 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Tech Stack](#-tech-stack)
- [Installation & Démarrage](#-installation--démarrage)
- [Composants Clés](#-composants-clés--features)
- [Architecture du Projet](#-architecture-du-projet)
- [Scripts Utiles](#-scripts-utiles)
- [Guide Développeur](#-guide-développeur)
- [Roadmap](#-roadmap--améliorations-futures)
- [License](#license)

---

## Vue d'ensemble

**KHASHIKA** est une plateforme e-commerce moderne conçue pour showcaser les bijoux indiens de luxe avec une expérience utilisateur haut de gamme.

### Caractéristiques principales

- 🎨 **Design System Cohérent** : Palette luxe (Turquoise #2596be, Or #D4AF37, Crème #F4EAD8)
- 🤖 **Chatbot IA** : Assistant virtuel flottant avec FAQ intelligente
- 📦 **Catalogue Dynamique** : ProductCard avec animations micro-interactions
- 🔍 **Recherche Optimisée** : Support pour filtrage et tri produits
- 📱 **Full Responsive** : Mobile-first, adapté tous les écrans
- ⚡ **Performance** : `next/image` optimisé, lazy loading intelligent
- 🔐 **TypeScript Strict** : Typage complet pour la maintenabilité

---

## 🛠️ Tech Stack

| Technologie | Version | Usage |
| --- | --- | --- |
| **Next.js** | 16 | Framework React avec App Router |
| **TypeScript** | Latest | Typage strict du code |
| **Tailwind CSS** | v4 | Styling utilitaire |
| **Framer Motion** | Latest | Animations fluides |
| **Supabase** | Latest | Base de données PostgreSQL |
| **Lucide React** | Latest | Icônes SVG |
| **Zod** | Latest | Validation de schémas |
| **React Hook Form** | Latest | Gestion formulaires |

---

## 🚀 Installation & Démarrage

### Prérequis

- **Node.js** : v18+ (obligatoire)
- **npm** : v9+ (package manager)
- **Compte Supabase** : Pour la base de données (optionnel en dev local)

### Étapes d'installation

#### 1️⃣ Cloner le repository
```bash
git clone https://github.com/ton-username/khashika.git
cd khashika
```

#### 2️⃣ Installer les dépendances
```bash
npm install
```

> **Note** : npm est obligatoire pour ce projet. Yarn/pnpm ne sont pas testés.

#### 3️⃣ Configurer les variables d'environnement

Renommer `.env.example` en `.env.local` et ajouter tes clés :
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> Les clés Supabase se trouvent dans ton dashboard Supabase → Settings → API

#### 4️⃣ Lancer le serveur de développement
```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000) 🎉

---

## 🧩 Composants Clés & Features

### 1. AIChatbot 🤖

**Assistant virtuel flottant optimisé pour le support client**

**Position & Intégration:**
- Position fixe bas-droite (z-index: 40)
- Intégré globalement via `app/layout.tsx`
- Visible sur toutes les pages

**Fonctionnalités:**
- ✅ Indicateur de frappe animé
- ✅ Scroll auto du historique
- ✅ Support clavier (Entrée = envoi)
- ✅ Détection mots-clés (Regex) → réponses instantanées
- ✅ Historique de conversation sauvegardé

**Sujets supportés (FAQ):**

| Catégorie | Exemples |
| --- | --- |
| 📦 **Logistique** | Livraison, Retours, Suivi de commande |
| 💳 **Transaction** | Paiement, Codes promo, Factures |
| 📞 **Support** | Contact, Garantie, SAV |
| 💍 **Catalogue** | Infos produits, Matériaux, Styles |

**Code d'intégration:**
```tsx
// app/layout.tsx
import AIChatbot from '@/components/AIChatbot'

export default function RootLayout() {
  return (
    <>
      {/* Contenu */}
      <AIChatbot />
    </>
  )
}
```

---

### 2. ProductCard 🛍️

**Composant de showcase produit avec micro-animations**

**Caractéristiques:**
- **Design** : Aspect ratio 3/4, typographie Karma
- **Interactions** : Scale + Fade au hover (Framer Motion)
- **Images** : `next/image` avec `sizes` optimisés (responsive)
- **Data** : Props fortement typées (TypeScript)
- **Performance** : Lazy loading activé

**Props TypeScript:**
```tsx
interface ProductCardProps {
  id: string
  title: string
  price: number
  originalPrice?: number
  image: string
  category: 'necklaces' | 'bracelets' | 'rings' | 'earrings'
  isNew?: boolean
  onClick?: () => void
}
```

**Exemple d'utilisation:**
```tsx
<ProductCard
  id="p-001"
  title="Collier Maharaja"
  price={299}
  originalPrice={399}
  image="/images/necklace-01.jpg"
  category="necklaces"
  isNew={true}
  onClick={() => router.push('/boutique/p-001')}
/>
```

---

## 📂 Architecture du Projet
```
khashika/
├── app/
│   ├── boutique/              # Pages catalogue (Server Components)
│   │   ├── page.tsx           # Page listing produits
│   │   ├── [slug]/page.tsx    # Page détail produit
│   │   └── layout.tsx         # Layout boutique
│   ├── api/                   # Routes API Next.js
│   │   ├── products/route.ts  # GET /api/products
│   │   └── search/route.ts    # GET /api/search
│   ├── layout.tsx             # Layout global (Navbar + Chatbot)
│   ├── page.tsx               # Home page
│   └── globals.css            # Styles globaux
│
├── components/
│   ├── ui/                    # Composants atomiques réutilisables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Badge.tsx
│   ├── boutique/              # Composants métier
│   │   ├── ProductCard.tsx    # Showcase produit
│   │   ├── ProductGrid.tsx    # Grille produits
│   │   ├── Filters.tsx        # Filtres/tri
│   │   └── SearchBar.tsx
│   ├── layout/                # Composants layout
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── AIChatbot.tsx          # Assistant virtuel
│
├── lib/
│   ├── data/                  # Données statiques
│   │   └── products-ultimate.json
│   ├── db/                    # Client Supabase singleton
│   │   └── supabase.ts
│   ├── utils/                 # Utilitaires
│   │   ├── images.ts          # Helper images
│   │   ├── formatters.ts      # Format prix, dates
│   │   └── validators.ts      # Zod schemas
│   └── constants/             # Constantes
│       └── colors.ts          # Design system
│
├── public/
│   └── images/                # Assets statiques
│       ├── products/
│       ├── icons/
│       └── bg/
│
├── .env.example               # Variables d'env template
├── .cursorrules              # Règles Cursor AI
├── tailwind.config.ts        # Config Tailwind
├── tsconfig.json             # Config TypeScript
└── package.json
```

---

## ⚡ Scripts Utiles
```bash
# Development
npm run dev          # Lance le serveur de dev (Port 3000)

# Production
npm run build        # Build optimisé pour production
npm run start        # Lance le serveur production

# Code Quality
npm run lint         # Vérification ESLint
npm run lint:fix    # Auto-fix ESLint

# Maintenance
npm run fix          # Clean & Reboot (Kill node, clear cache, restart)
npm run clean        # Nettoie .next, node_modules
```

**Table des scripts:**

| Script | Description | Usage |
| --- | --- | --- |
| `npm run dev` | Serveur dev avec hot reload | Développement |
| `npm run build` | Build production | Avant deploy |
| `npm run start` | Lance la build production | Production server |
| `npm run lint` | ESLint check | CI/CD |
| `npm run fix` | Hard reset + restart | Débug |

---

## 🛠️ Guide Développeur

### Ajouter un nouveau composant

1. **Créer le fichier** dans `/components` avec le bon suffix
```tsx
// components/boutique/NewComponent.tsx
'use client'

import { FC } from 'react'

interface NewComponentProps {
  title: string
}

const NewComponent: FC<NewComponentProps> = ({ title }) => {
  return <div>{title}</div>
}

export default NewComponent
```

2. **Exporter** depuis l'index si nécessaire
```tsx
// components/index.ts
export { default as NewComponent } from './boutique/NewComponent'
```

### Importer des assets images
```tsx
import Image from 'next/image'

<Image
  src="/images/products/necklace.jpg"
  alt="Collier de luxe"
  width={300}
  height={400}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority={false}
/>
```

### Utiliser Zod pour validation
```tsx
import { z } from 'zod'

const ProductSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  price: z.number().positive(),
})

type Product = z.infer<typeof ProductSchema>
```

### Ajouter une nouvelle route API
```tsx
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Logique
    return NextResponse.json({ data: [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
```

---

## 🎨 Design System

### Palette Couleurs
```css
/* Primaire */
--color-turquoise: #2596be;
--color-gold: #D4AF37;
--color-cream: #F4EAD8;

/* Secondaire */
--color-dark: #1a1a1a;
--color-light: #f9f9f9;
```

### Utilisation Tailwind
```tsx
<div className="bg-turquoise-600 text-gold-500 border-cream">
  Texte luxe
</div>
```

---

## 📋 Variables d'environnement

| Variable | Requis | Exemple |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | `https://xyzabc.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | `eyJhbGc...` |
| `NEXT_PUBLIC_API_URL` | ❌ | `http://localhost:3000` |

---

## 🔮 Roadmap & Améliorations Futures

- [ ] **Chatbot IA Générative** : Connecter à OpenAI API pour réponses dynamiques
- [ ] **Recherche Full-Text** : Implémenter Algolia ou Supabase Full-Text Search
- [ ] **Authentification** : Finaliser login/register avec Supabase Auth
- [ ] **i18n** : Support multi-langue (FR/EN)
- [ ] **Analytics** : Intégrer Google Analytics + Mixpanel
- [ ] **Paiement** : Stripe/Razorpay intégration
- [ ] **Admin Dashboard** : Gestion inventaire + commandes
- [ ] **Wishlist** : Sauvegarde favoris utilisateur
- [ ] **Reviews** : Système notation produits

---

## 📚 Ressources Utiles

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Supabase Guide](https://supabase.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contributing

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit tes changes (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Code Standards

- **ESLint** : `npm run lint:fix` avant de commiter
- **TypeScript** : Pas de `any` types sans justification
- **Composants** : Typed props avec interfaces
- **Nommage** : camelCase pour functions, PascalCase pour composants

---

## 📄 License

Ce projet est sous license **MIT**. Voir le fichier [LICENSE](./LICENSE) pour les détails.

---

## 👨‍💻 Auteur

**KHASHIKA Dev Team**  
📧 contact@khashika.com  
🌐 [khashika.com](https://khashika.com)

---

## ✨ Merci

Merci à tous les contributeurs et utilisateurs qui rendent ce projet possible ! 💚

---

**Version** : 1.0.0  
**Dernière mise à jour** : Novembre 2025  
**Statut** : 🟢 Active Development