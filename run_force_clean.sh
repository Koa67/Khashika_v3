#!/bin/bash

echo "🚀 STABILISATION CRITIQUE : REMPLACEMENT DES IMAGES MANQUANTES"
echo ""

# Exécuter le script Python
python3 scripts/force_placeholder.py

# Nettoyer le cache
echo ""
echo "🧹 Nettoyage du cache..."
rm -rf .next

echo ""
echo "✅ NETTOYAGE TERMINÉ"
echo ""
echo "💡 Prochaine étape : npm run fix"

