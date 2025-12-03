<mission>
  <goal>FIX VISUEL : UNIFORMISATION DES IMAGES & CORRECTION CADRAGE</goal>
  <context>
    Les images récupérées sont de tailles et ratios variés, ce qui casse la grille.
    Certaines sont des zooms trop gros.
    ACTION : Forcer un rendu propre via CSS (Object-contain vs Cover) et ajouter un fond neutre.
  </context>

  <tasks>
    <task id="1" priority="critical">
      <file>components/ProductCard.tsx</file>
      <instruction>
        AMÉLIORER LE RENDU DES IMAGES.
        
        Modifier la balise `<img>` :
        1. Remplacer `object-cover` par `object-contain` (pour voir le bijou entier) OU garder `object-cover` mais ajouter un padding.
        -> **CHOIX :** Utiliser `object-cover` mais avec `object-center` strict.
        
        2. Ajouter un fond de secours élégant derrière l'image (si elle est transparente ou ne remplit pas tout).
        -> Classe : `bg-gray-50` ou `bg-[#FDFBF7]`.
        
        3. Ajouter une classe de "Fallback" : Si l'image est trop petite, l'afficher en centré sans l'étirer.
      </instruction>
    </task>

    <task id="2" priority="high">
      <file>components/boutique/FilterSidebar.tsx</file>
      <instruction>
        FIXER LE DESIGN DE LA SIDEBAR.
        Sur la capture, la sidebar est "brute".
        1. Ajouter du padding interne (`p-6`).
        2. Styliser les titres (Catégorie, Matériau) avec la police Serif et couleur Or.
        3. Styliser les checkboxes (Turquoise au lieu de bleu par défaut).
        4. Ajouter une ombre portée légère à la colonne pour la détacher.
      </instruction>
    </task>
  </tasks>
</mission>