#!/bin/bash

echo "🔍 RÉCUPÉRATION IMAGES VIA ATTRIBUT ALT"
echo ""

# Vérifier les dépendances Python
echo "📦 Vérification des dépendances..."
if ! python3 -c "import beautifulsoup4" 2>/dev/null; then
    echo "   → Installation de beautifulsoup4..."
    pip3 install beautifulsoup4 requests fuzzywuzzy python-Levenshtein --quiet
fi

# Exécuter le script Python
python3 scripts/recover_by_alt.py

# Nettoyer le cache
echo ""
echo "🧹 Nettoyage du cache..."
rm -rf .next

echo ""
echo "✅ RÉCUPÉRATION TERMINÉE"
echo ""
echo "💡 Prochaine étape : npm run fix"




