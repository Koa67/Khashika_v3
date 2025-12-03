#!/bin/bash

echo "🧹 NETTOYAGE RADICAL : SUPPRESSION DES LIENS MORTS"
echo ""

# Exécuter le script Python
python3 scripts/nuclear_clean.py

# Nettoyer le cache (Indispensable)
echo ""
echo "🧹 Nettoyage du cache (Indispensable)..."
rm -rf .next

echo ""
echo "✅ NETTOYAGE TERMINÉ"
echo ""
echo "💡 Prochaine étape : npm run fix"




