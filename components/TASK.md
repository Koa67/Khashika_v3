<mission>
  <goal>FIX URGENT : RESTRUCTURATION DES DOSSIERS I18N & NAVBAR</goal>
  <context>
    Le serveur tourne, mais les pages (Shop, Admin) sont en 404 car elles ne sont pas dans le dossier [locale].
    La Navbar a perdu son design Luxe.
    
    ACTION : Déplacer physiquement les fichiers et restaurer le composant Navbar.
  </context>

  <tasks>
    <task id="1" priority="critical">
      <file>terminal</file>
      <instruction>
        RANGER LES PAGES DANS LA STRUCTURE LOCALISÉE.
        Exécuter ces commandes (Adapter si les dossiers existent déjà) :
        
        # 1. Créer le dossier locale
        mkdir -p app/[locale]

        # 2. Déplacer les pages principales (Si elles sont à la racine app/)
        # Le '|| true' évite que le script plante si le fichier est déjà déplacé
        mv app/page.tsx app/[locale]/page.tsx || true
        mv app/shop app/[locale]/shop || true
        mv app/product app/[locale]/product || true
        mv app/checkout app/[locale]/checkout || true
        mv app/account app/[locale]/account || true
        mv app/story app/[locale]/story || true
        
        # 3. Admin (Vérifier emplacement)
        mv app/admin app/[locale]/admin || true
      </instruction>
    </task>

    <task id="2" priority="high">
      <file>components/Navbar.tsx</file>
      <instruction>
        RESTAURER LE DESIGN NAVBAR.
        - Revenir au layout : Logo Centré, Menu Centré dessous.
        - Remettre la classe `pattern-mughal-bottom`.
        - S'assurer que les liens utilisent le `Link` de `navigation.ts` (ou next-intl) pour gérer la langue.
      </instruction>
    </task>

    <task id="3" priority="medium">
      <file>components/product/ProductCard.tsx</file>
      <instruction>
        NETTOYER LE CSS DES IMAGES.
        - Supprimer tout `overlay` ou `opacity` blanc qui traîne sur l'image.
        - Vérifier que l'image est bien visible (z-index correct).
      </instruction>
    </task>

    <task id="4" priority="critical">
      <file>terminal</file>
      <instruction>
        REDÉMARRAGE.
        1. `npm run fix`
      </instruction>
    </task>
  </tasks>
</mission>