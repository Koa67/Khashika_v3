# PROMPT CURSOR - 5 Corrections Navbar Search Bar

## 🎯 CONTEXTE
Applique ces 5 corrections dans l'ordre sur le fichier `components/Navbar.tsx`.

---

## 🔧 FIX #1: Dropdown Position (Sous l'Icône au lieu du Centre)

### Étape 1.1: Ajouter les Refs et States

**CHERCHER** (début du composant, après les imports):
```tsx
export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
```

**AJOUTER** juste après:
```tsx
const router = useRouter();  // Ajouter l'import: import { useRouter } from 'next/navigation';
const searchContainerRef = useRef<HTMLDivElement>(null);
const [dropdownLeft, setDropdownLeft] = useState(0);

useEffect(() => {
  if (searchContainerRef.current && isSearchOpen) {
    const rect = searchContainerRef.current.getBoundingClientRect();
    setDropdownLeft(rect.left);
  }
}, [isSearchOpen]);
```

### Étape 1.2: Ajouter la Ref au Conteneur

**CHERCHER** (ligne ~75):
```tsx
<div 
  className="relative group flex items-center gap-2 px-4 min-w-[220px]"
  onMouseEnter={...}
```

**MODIFIER** pour ajouter la ref:
```tsx
<div 
  ref={searchContainerRef}
  className="relative group flex items-center gap-2 px-4 min-w-[220px]"
  onMouseEnter={...}
```

### Étape 1.3: Changer Position du Dropdown

**CHERCHER** (ligne ~135):
```tsx
<div className="fixed top-[72px] left-1/2 -translate-x-1/2 w-96 bg-white ...">
```

**REMPLACER** par:
```tsx
<div 
  className="fixed top-[72px] w-96 bg-white ... z-[9999]"
  style={{ left: `${dropdownLeft}px` }}
>
```

**FAIRE LA MÊME CHOSE** pour le dropdown "no results" (ligne ~192).

---

## 🔧 FIX #2: Border Animée - Réduire de 25%

### Étape 2.1: Restructurer le Conteneur

**CHERCHER** (ligne ~75):
```tsx
<div 
  ref={searchContainerRef}
  className="relative group flex items-center gap-2 px-4 min-w-[220px] border-b border-transparent transition-colors duration-300 hover:border-black"
  onMouseEnter={...}
  onMouseLeave={...}
>
  <button>
    <FaSearch />
  </button>
  <input ... />
</div>
```

**REMPLACER** par cette structure à double wrapper:
```tsx
<div 
  ref={searchContainerRef}
  className="relative group min-w-[220px] px-4"
  onMouseEnter={...}
  onMouseLeave={...}
>
  <div 
    className="flex items-center gap-2 w-[165px] border-b border-transparent transition-colors duration-300"
    style={{
      borderBottomColor: isSearchOpen ? '#000' : 'transparent'
    }}
  >
    <button>
      <FaSearch />
    </button>
    <input ... />
  </div>
</div>
```

**EXPLICATION:**
- Conteneur extérieur: `min-w-[220px]` (zone hover) + pas de border
- Wrapper intérieur: `w-[165px]` (75% de 220px) + border animée

---

## 🔧 FIX #3: Text Highlighting en Turquoise

### Étape 3.1: Ajouter la Fonction Utilitaire

**AJOUTER** au début du fichier, après les imports et avant le composant:
```tsx
const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.toLowerCase() === query.toLowerCase()) {
      return (
        <span 
          key={index} 
          className="text-[#2596be] font-semibold"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};
```

### Étape 3.2: Utiliser dans le Dropdown

**CHERCHER** (dans le dropdown results, ligne ~140):
```tsx
<p className="text-sm font-medium text-gray-900">
  {result.name}
</p>
```

**REMPLACER** par:
```tsx
<p className="text-sm font-medium text-gray-900">
  {highlightMatch(result.name, query)}
</p>
```

**OPTIONNEL:** Si vous avez d'autres champs texte (description, tags), appliquez aussi:
```tsx
{result.description && (
  <p className="text-xs text-gray-500 mt-1">
    {highlightMatch(result.description, query)}
  </p>
)}
```

---

## 🔧 FIX #4: Enter Key → Navigation

### Étape 4.1: Ajouter le Handler

**AJOUTER** dans le composant (après les autres fonctions):
```tsx
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' && query.trim()) {
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  } else if (e.key === 'Escape') {
    setIsSearchOpen(false);
    setQuery('');
  }
};
```

### Étape 4.2: Ajouter au Input

**CHERCHER** (ligne ~110):
```tsx
<input
  type="text"
  ...
  onChange={handleSearchChange}
  onFocus={() => setIsSearchOpen(true)}
  onBlur={() => ...}
  className="..."
/>
```

**AJOUTER** `onKeyDown={handleKeyDown}`:
```tsx
<input
  type="text"
  ...
  onChange={handleSearchChange}
  onKeyDown={handleKeyDown}  ← AJOUTER
  onFocus={() => setIsSearchOpen(true)}
  onBlur={() => ...}
  className="..."
/>
```

---

## 🔧 FIX #5: Header Sticky

**CHERCHER** (ligne ~64):
```tsx
<header className="... bg-[#FDFBF7] ... overflow-visible">
```

**VÉRIFIER** que ces classes sont présentes:
- `sticky`
- `top-0`
- `z-50` (ou z-[100])

**SI MANQUANTES**, ajouter:
```tsx
<header className="sticky top-0 z-50 bg-[#FDFBF7] ... overflow-visible">
```

---

## ✅ CHECKLIST DE VALIDATION

Après toutes les modifications:

### Code:
- [ ] `searchContainerRef` ref ajoutée
- [ ] `dropdownLeft` state ajouté
- [ ] `useEffect` pour calculer position ajouté
- [ ] Dropdown a `style={{ left: '${dropdownLeft}px' }}`
- [ ] Structure double wrapper pour border (extérieur 220px, intérieur 165px)
- [ ] Fonction `highlightMatch()` créée
- [ ] `highlightMatch()` utilisée dans les résultats
- [ ] `handleKeyDown` handler créé
- [ ] Input a `onKeyDown={handleKeyDown}`
- [ ] Header a `sticky top-0 z-50`

### Imports nécessaires:
```tsx
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
```

---

## 📊 RÉSUMÉ DES MODIFICATIONS PAR LIGNE

| Fix | Ligne | Élément | Action |
|-----|-------|---------|--------|
| #1 | ~10 | Début composant | Ajouter refs + states + useEffect |
| #1 | ~75 | Search container | Ajouter `ref={searchContainerRef}` |
| #1 | ~135, ~192 | Dropdowns | Ajouter `style={{ left: '${dropdownLeft}px' }}` |
| #2 | ~75 | Search container | Double wrapper (extérieur + intérieur) |
| #3 | ~5 | Avant composant | Ajouter fonction `highlightMatch()` |
| #3 | ~140 | Result item | Utiliser `highlightMatch(result.name, query)` |
| #4 | ~30 | Dans composant | Ajouter fonction `handleKeyDown` |
| #4 | ~110 | Input | Ajouter `onKeyDown={handleKeyDown}` |
| #5 | ~64 | Header | Vérifier/ajouter `sticky top-0 z-50` |

---

## 🎬 COMMANDES FINALES

```bash
# 1. Vérifier que toutes les modifications sont appliquées
git diff components/Navbar.tsx

# 2. Le serveur dev rebuild automatiquement
# Attendre "✓ Compiled"

# 3. Dans le navigateur
Ctrl+Shift+R (ou Cmd+Shift+R sur Mac)

# 4. Tester les 5 fixes:
# - Dropdown apparaît sous l'icône (pas au centre)
# - Border animée fait 165px (pas 220px)
# - Lettres matchantes surlignées en turquoise
# - Enter → Navigation vers /search?q=...
# - Header reste visible en scrollant
```

---

## 💡 NOTES IMPORTANTES

### Fix #1 (Position Dropdown)
Si `top-[72px]` n'est pas la bonne hauteur, ajustez selon votre header.

### Fix #2 (Border Width)
Si 165px ne vous plaît pas:
- 50% de 220px = 110px → `w-[110px]`
- 80% de 220px = 176px → `w-[176px]`

### Fix #4 (Navigation)
Adaptez l'URL selon votre structure:
- `/search?q=...` pour page search dédiée
- `/products?search=...` pour filtrer products

### Fix #5 (Sticky)
Si le sticky ne fonctionne pas, vérifiez qu'aucun parent n'a `overflow-hidden`.

---

## 🚨 SI PROBLÈME

**Dropdown pas aligné:**
```tsx
// Debug: afficher la valeur calculée
console.log('Dropdown left:', dropdownLeft);

// Ou utiliser absolute si fixed pose problème:
className="absolute top-full left-0 mt-2 w-96 ..."
```

**Highlighting ne fonctionne pas:**
```tsx
// Vérifier que query est bien passé
console.log('Query:', query);
console.log('Result name:', result.name);
```

**Enter key ne déclenche pas:**
```tsx
// Ajouter un log pour debug
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  console.log('Key pressed:', e.key);
  // ...
};
```

---

## 📤 FORMAT DE RÉPONSE ATTENDU

```
✅ TOUTES LES MODIFICATIONS APPLIQUÉES

Fichier: components/Navbar.tsx

Fixes appliqués:
1. Dropdown position dynamique ✓ (refs + useEffect ajoutés)
2. Border width réduite à 165px ✓ (double wrapper)
3. Text highlighting en turquoise ✓ (fonction + utilisation)
4. Enter key navigation ✓ (handler ajouté)
5. Header sticky ✓ (classes vérifiées)

Imports ajoutés:
- useRouter from 'next/navigation'
- useRef, useEffect from 'react'

DIFF PRINCIPAL:
[Montrer les changements clés]
```