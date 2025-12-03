#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🔄 MISE À JOUR FORCÉE - CORRECTION COMPLÈTE"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  Ce processus va :"
echo "  1. Identifier tous les produits avec images p-X"
echo "  2. Re-télécharger les bonnes images depuis le site"
echo "  3. Mettre à jour le JSON"
echo "  4. Supprimer les anciennes images"
echo ""
echo "⏱  Durée estimée : 3-5 minutes"
echo ""
read -p "Appuyez sur Entrée pour continuer..."
echo ""

python3 scripts/force_update_all.py

echo ""
echo "🧹 Nettoyage du cache..."
rm -rf .next

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ TERMINÉ !"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Lancez : npm run dev"
echo ""




