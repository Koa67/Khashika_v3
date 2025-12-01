#!/bin/bash

# Script d'exécution complet pour la réconciliation des images - VERSION CLONE LOCAL
# Parse le clone local, copie les images et met à jour le JSON

set -e  # Arrêter en cas d'erreur

echo "════════════════════════════════════════════════════════════"
echo "🔍 RÉCONCILIATION COMPLÈTE - VERSION CLONE LOCAL"
echo "════════════════════════════════════════════════════════════"
echo ""

# Vérification du dossier clone
if [ ! -d "_LEGACY_CLONE" ]; then
  echo "❌ Erreur : Dossier _LEGACY_CLONE introuvable !"
  echo "   Veuillez placer le clone à la racine du projet."
  exit 1
fi

echo "✓ Dossier _LEGACY_CLONE trouvé"
echo ""

# Vérifier que Python 3 est disponible
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier les dépendances Python
echo "📦 Vérification des dépendances Python..."
python3 -c "import bs4" 2>/dev/null || {
    echo "⚠ beautifulsoup4 non installé. Installation..."
    pip3 install beautifulsoup4
}

python3 -c "from fuzzywuzzy import fuzz" 2>/dev/null || {
    echo "⚠ fuzzywuzzy non installé. Installation..."
    pip3 install fuzzywuzzy python-Levenshtein
}

echo "✓ Dépendances OK"
echo ""

# Étape 1 : Parsing
echo "════════════════════════════════════════════════════════════"
echo "📁 Étape 1/4 : Parsing du clone local..."
echo "════════════════════════════════════════════════════════════"
python3 scripts/parse_local_clone.py

if [ ! -f "data/truth_map.json" ]; then
  echo ""
  echo "❌ Échec de l'extraction. Vérifiez les erreurs ci-dessus."
  exit 1
fi

echo ""

# Étape 2 : Copie des images
echo "════════════════════════════════════════════════════════════"
echo "📥 Étape 2/4 : Copie des images..."
echo "════════════════════════════════════════════════════════════"
python3 scripts/find_and_copy_images.py

echo ""

# Étape 3 : Mise à jour du JSON
echo "════════════════════════════════════════════════════════════"
echo "🔄 Étape 3/4 : Mise à jour du JSON produits..."
echo "════════════════════════════════════════════════════════════"
python3 scripts/update_products_json.py

echo ""

# Étape 4 : Nettoyage
echo "════════════════════════════════════════════════════════════"
echo "🧹 Étape 4/4 : Nettoyage du cache..."
echo "════════════════════════════════════════════════════════════"
rm -rf .next
echo "✓ Cache .next supprimé"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ RÉCONCILIATION TERMINÉE !"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📊 Fichiers générés :"
echo "  - data/truth_map.json (correspondances extraites)"
echo "  - public/images/products/ (images copiées)"
echo "  - lib/data/products-ultimate.json (JSON mis à jour)"
echo "  - lib/data/products-ultimate.json.backup (sauvegarde)"
echo ""
echo "🚀 Prochaine étape : npm run dev"
echo ""
