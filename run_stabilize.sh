#!/bin/bash

echo "🚀 STABILISATION D'URGENCE : STOPPER LE CRASH 'DOUBLE FREE'"
echo ""

# Exécuter le script Python
python3 scripts/purge_missing_images.py

# Nettoyer le cache
echo ""
echo "🧹 Nettoyage du cache..."
rm -rf .next

echo ""
echo "✅ STABILISATION TERMINÉE"
echo ""
echo "💡 Prochaine étape : npm run fix"


















