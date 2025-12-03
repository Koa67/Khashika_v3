#!/bin/bash

echo "🚀 ASSAINISSEMENT TOTAL DES NOMS DE FICHIERS"
echo ""

# Exécuter le script Python
python3 scripts/sanitize_data_final.py

# Nettoyer le cache
echo ""
echo "🧹 Nettoyage du cache..."
rm -rf .next

echo ""
echo "✅ ASSAINISSEMENT TERMINÉ"
echo ""
echo "💡 Prochaine étape : npm run fix"




