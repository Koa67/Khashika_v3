#!/bin/bash

# Script d'exécution pour l'aplatissement des images
# Usage: bash run_flatten.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 DÉMARRAGE DE L'APLATISSEMENT DES IMAGES"
echo "=========================================="
echo ""

# Étape 1 : Exécuter le script Python
echo "📋 Étape 1 : Exécution du script flatten_final.py..."
python3 scripts/flatten_final.py

if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'exécution du script Python"
    exit 1
fi

echo ""
echo "📋 Étape 2 : Suppression du cache Next.js..."
# Étape 2 : Supprimer le cache .next (OBLIGATOIRE)
if [ -d ".next" ]; then
    rm -rf .next
    echo "   ✅ Cache .next supprimé"
else
    echo "   ℹ️  Dossier .next introuvable (déjà supprimé ou n'existe pas)"
fi

echo ""
echo "✅ APLATISSEMENT TERMINÉ"
echo "=========================================="
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Relancer le serveur : npm run dev"
echo "   2. Vérifier que les images s'affichent correctement"
echo ""



















