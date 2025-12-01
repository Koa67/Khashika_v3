C'est exactement le problème que nous avions identifié : le CSS de la grille "Luxe" n'est pas appliqué, donc les images prennent toute la place disponible (100% de la largeur).

Pour régler ça **immédiatement**, il faut forcer deux choses :

1.  **La Grille (Le contenant) :** Dire à la page "Mets-moi 4 produits par ligne, pas 1 seul".
2.  **La Carte (Le contenu) :** Dire à l'image "Tu ne dépasses pas ce rectangle vertical".

Voici le **Prompt Chirurgical** à donner à Cursor maintenant pour régler la taille des images.

-----

**CONTEXTE :**
Le site est inutilisable car les images produits sur `/shop` sont géantes (prennent tout l'écran).
**CAUSE :** Manque de contrainte CSS sur le composant `ProductCard` (parent de l'image `fill`) et absence de grille responsive sur la page `Shop`.

**TA MISSION (CURSOR) :**
Réparer le layout CSS pour obtenir une grille de produits élégante et contenue.

**ACTIONS À CODER :**

**1. Modifier `app/shop/page.tsx` (La Grille) :**

  * Trouve la `div` qui entoure la méthode `.map()` des produits.
  * Remplace ses classes par une grille Tailwind stricte :
    ```tsx
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 w-full">
      {/* ... mapping des produits ... */}
    </div>
    ```

**2. Modifier `components/ProductCard.tsx` (La Carte) :**

  * L'image utilise `layout="fill"` (ou `fill`). Elle a besoin d'un parent avec une taille relative et un ratio forcé.
  * Remplace le conteneur de l'image par ceci :
    ```tsx
    <div className="group relative flex flex-col gap-3">
      {/* Conteneur Image : Ratio Portrait 3:4 Strict */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-sm bg-[#f4f1eb]">
         <Image
           src={getValidImageUrl(product.image_url || product.image)}
           alt={product.name}
           fill
           className="object-cover object-center w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
           sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
         />
      </div>
      
      {/* Infos Produit Minimalistes */}
      <div className="flex flex-col items-start">
         <h3 className="font-serif text-lg text-emerald-900">{product.name}</h3>
         <p className="text-sm font-medium text-emerald-700/80">{product.price} €</p>
      </div>
    </div>
    ```

**RÉSULTAT ATTENDU :**

  * Les images doivent être alignées sur 3 ou 4 colonnes.
  * Aucune image ne doit dépasser \~300px de large.
  * Format vertical (Portrait) respecté.

-----

**Copie-colle ce prompt dans Cursor (Composer `Cmd+I`).**
Une fois exécuté, rafraîchis la page : tes images seront enfin rangées proprement.
