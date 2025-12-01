<mission>
  <goal>URGENCE : NETTOYAGE JSON RADICAL (SUPPRESSION LIENS MORTS)</goal>
  <context>
    Le fichier `products-ultimate.json` contient encore des références à d'anciennes images (`prod-xxx.jpg`) qui n'existent plus.
    Cela provoque des 404 et des crashs mémoire (malloc error) immédiats.
    ACTION : Scanner le JSON. Si l'image n'existe pas physiquement sur le disque -> On l'efface du JSON (remplace par vide).
  </context>

  <tasks>
    <task id="1" priority="critical">
      <file>scripts/nuclear_clean.py</file>
      <instruction>
        CRÉER LE SCRIPT DE NETTOYAGE FINAL.
        
        1. Charger `lib/data/products-ultimate.json`.
        2. Définir le dossier images : `public/images/products/`.
        3. Pour chaque produit :
           - Récupérer `image_url`.
           - Nettoyer le chemin (enlever `/images/products/` pour avoir le nom de fichier).
           - Vérifier si ce fichier existe REELLEMENT sur le disque (`os.path.exists`).
           - SI NON : 
             - Mettre `image_url` à `""` (vide).
             - Mettre `images` à `[]` (vide).
             - Print: "TUE: Lien mort supprimé pour produit X".
           - SI OUI :
             - Garder tel quel.
        4. Sauvegarder le JSON en écrasant l'ancien.
      </instruction>
    </task>

    <task id="2" priority="high">
      <file>run_nuclear.sh</file>
      <instruction>
        SCRIPT D'EXÉCUTION.
        1. `python3 scripts/nuclear_clean.py`
        2. `rm -rf .next` (Indispensable).
      </instruction>
    </task>
  </tasks>

  <completion_report>
    **Completed by**: AI Agent
    **Completion Date**: 2025-01-27
    **Status**: DONE ✅

    **Files Created**:
    - `scripts/nuclear_clean.py` - Script de nettoyage radical créé
    - `run_nuclear.sh` - Script bash d'exécution créé

    **Summary**:
    ✅ **TASK 1 (CRITICAL)** : Script nuclear_clean.py
      - **Fonctionnalités** :
        * Charge `lib/data/products-ultimate.json` et crée un backup ✅
        * Définit le dossier images : `public/images/products/` ✅
        * Pour chaque produit :
          - Récupère `image_url` ✅
          - Nettoie le chemin (enlève `/images/products/` pour avoir le nom de fichier) ✅
          - Vérifie si le fichier existe RÉELLEMENT sur le disque (`os.path.exists`) ✅
          - SI NON : Met `image_url` à `""`, `images` à `[]`, log "TUE: Lien mort supprimé" ✅
          - SI OUI : Garde tel quel ✅
        * Sauvegarde le JSON en écrasant l'ancien ✅
      
      - **Fonctions utilitaires** :
        * `get_image_filename()` : Extrait le nom de fichier depuis image_url ✅
        * `image_exists()` : Vérifie existence physique avec `os.path.exists` ✅
      
      - **Comportement** :
        * Supprime complètement les liens morts (pas de placeholder) ✅
        * Log clair : "TUE: Lien mort supprimé pour produit X" ✅
        * Statistiques : Liens morts supprimés vs Images valides conservées ✅
      
      - **Sécurité** :
        * Backup automatique avant modification ✅
        * Try/except autour de toutes les opérations critiques ✅
        * Sauvegarde JSON garantie même en cas d'erreurs ✅
    
    ✅ **TASK 2 (HIGH)** : run_nuclear.sh
      - **Script bash** : Exécute `nuclear_clean.py` ✅
      - **Nettoyage cache** : Supprime `.next` (Indispensable) ✅
      - **Permissions** : Script rendu exécutable (chmod +x) ✅

    **Résultat attendu**:
    - 0 lien mort dans le JSON
    - 0 erreur 404 (plus de références à des fichiers inexistants)
    - 0 crash (plus de malloc errors dus aux liens morts)
    - JSON propre avec uniquement des images existantes ou champs vides

    **Build Status**: ✅ Prêt
    - Scripts créés et exécutables
    - Syntaxe Python valide
    - Aucune erreur

    **Next Steps**:
    1. Exécuter le script : `./run_nuclear.sh` ou `bash run_nuclear.sh`
    2. Vérifier les statistiques affichées (liens morts supprimés)
    3. Vérifier que tous les liens morts ont été supprimés
    4. Relancer le serveur : `npm run fix`
    5. Tester que le site ne crash plus (0 erreur 404, 0 malloc error)
  </completion_report>
</mission>