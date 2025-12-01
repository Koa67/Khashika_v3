#!/bin/bash

# Script pour lancer la procédure complète d'aplatissement des images
# et de mise à jour des chemins dans le JSON

set -e  # Arrêter en cas d'erreur

echo "======================================================================"
echo "🔧 RÉPARATION CRITIQUE : APLATISSEMENT DES IMAGES"
echo "======================================================================"
echo ""

# Étape 1: Aplatir la structure d'images
echo "📁 ÉTAPE 1: Aplatissement de la structure d'images..."
echo ""
python3 scripts/flatten_images.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erreur lors de l'aplatissement des images"
    exit 1
fi

echo ""
echo "✅ Étape 1 terminée"
echo ""

# Étape 2: Mettre à jour les chemins dans le JSON
echo "📝 ÉTAPE 2: Mise à jour des chemins dans products-ultimate.json..."
echo ""
python3 scripts/update_json_paths.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erreur lors de la mise à jour du JSON"
    echo "🔄 Restauration du backup..."
    if [ -f "lib/data/products-ultimate.json.backup_before_flatten" ]; then
        cp lib/data/products-ultimate.json.backup_before_flatten lib/data/products-ultimate.json
        echo "   ✅ Backup restauré"
    fi
    exit 1
fi

echo ""
echo "✅ Étape 2 terminée"
echo ""

# Étape 3: Nettoyer le cache Next.js
echo "🧹 ÉTAPE 3: Nettoyage du cache Next.js..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "   ✅ Cache supprimé (.next/)"
else
    echo "   ℹ️  Pas de cache à supprimer"
fi

echo ""
echo "======================================================================"
echo "✅ RÉPARATION TERMINÉE"
echo "======================================================================"
echo ""
echo "📝 Prochaines étapes:"
echo ""
echo "   1. Vérifier le build Next.js:"
echo "      npm run build"
echo ""
echo "   2. Lancer le serveur de développement:"
echo "      npm run dev"
echo ""
echo "   3. Vérifier que les images s'affichent correctement:"
echo "      - Visitez http://localhost:3000/shop"
echo "      - Vérifiez quelques pages produit"
echo "      - Assurez-vous qu'aucune erreur 404 n'apparaît"
echo ""
echo "🔄 En cas de problème, restaurer les backups:"
echo "   cp lib/data/products-ultimate.json.backup_before_flatten lib/data/products-ultimate.json"
echo "   # Et restaurer les images depuis public/images/products_backup_flatten/"
echo ""
echo "======================================================================"


