# TASK: Fix dropdowns - ligne unique + hover visible

## Fichier
`components/Navigation/NavigationMenu.tsx`

## Problème 1: Nos Pierres pas sur une ligne

Les items de "Nos Pierres" passent à la ligne. Il faut :
- Réduire le padding horizontal : `px-4` au lieu de `px-5`
- Ou réduire la taille du texte pour les pierres : `text-xs` au lieu de `text-sm`
- S'assurer que `flex-wrap: nowrap` ou que tous les items tiennent

**Solution suggérée :** Réduire padding pour Pierres uniquement :
```tsx
className={`
  ${menu.label === 'Nos Pierres' ? 'px-3' : 'px-5'} 
  py-2 text-sm text-[#2D2926] hover:text-gold-fusion transition-colors whitespace-nowrap
  ${index > 0 ? 'border-l border-[#EAB615]/30' : ''}
`}
```

## Problème 2: Hover "Tout voir" trop discret

Le lien gold (#EAB615) vers gold-dark est invisible.

**Solution :** Hover vers blanc sur fond gold, ou soulignement :
```tsx
{/* Lien "Tout voir" avec hover visible */}
<Link
  href={menu.href}
  className="px-5 py-2 tont-semibold text-[#EAB615] hover:text-white hover:bg-[#EAB615] transition-all duration-200 rounded-sm"
>
  {menu.label === 'Bijoux' && 'Tous les bijoux'}
  {menu.label === 'Nos Pierres' && 'Toutes les pierres'}
  {menu.label === 'Accessoires' && 'Tous les accessoires'}
</Link>
```

**Alternative avec soulignement :**
```tsx
className="px-5 py-2 text-sm font-semibold text-[#EAB615] hover:underline hover:underline-offset-4 transition-all"
```

## Résumé des changements

1. **Pierres** : padding réduit `px-3` pour tenir sur une ligne
2. **Liens "Tout voir"** : hover = fond gold + texte blanc (ou underline)

## Test
1. Pierres : 10 items + "Toutes les pierres" sur UNE ligne
2. Hover sur "Tous les bijoux" → effet visible (fond gold ou underline)
