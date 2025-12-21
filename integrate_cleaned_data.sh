#!/bin/bash

# Script d'intégration des données nettoyées dans products-ultimate.json
# Ce script :
# 1. Crée un backup de products-ultimate.json
# 2. Copie products-scraped.json vers products-ultimate.json
# 3. Purge le cache Next.js (.next/)
# 4. Affiche les instructions pour relancer le site

set -e  # Arrêter en cas d'erreur

echo "======================================================================"
echo "🔄 INTÉGRATION DES DONNÉES NETTOYÉES"
echo "======================================================================"
echo ""

# Chemins des fichiers
SCRAPED_PATH="lib/data/products-scraped.json"
ULTIMATE_PATH="lib/data/products-ultimate.json"
BACKUP_PATH="lib/data/products-ultimate.json.backup"

# 1. Vérifier que products-scraped.json existe
if [ ! -f "$SCRAPED_PATH" ]; then
    echo "❌ Erreur: $SCRAPED_PATH introuvable"
    echo "   Exécutez d'abord les scripts de nettoyage et re-scraping:"
    echo "   1. python3 scripts/clean_scraped_data.py"
    echo "   2. python3 scripts/rescrape_problematic.py"
    exit 1
fi

echo "✅ Fichier source trouvé: $SCRAPED_PATH"

# 2. Créer un backup de products-ultimate.json s'il existe
if [ -f "$ULTIMATE_PATH" ]; then
    echo ""
    echo "📦 Création du backup de products-ultimate.json..."
    cp "$ULTIMATE_PATH" "$BACKUP_PATH"
    echo "   ✅ Backup créé: $BACKUP_PATH"
else
    echo ""
    echo "⚠️  products-ultimate.json n'existe pas encore (première intégration)"
fi

# 3. Copier products-scraped.json vers products-ultimate.json
echo ""
echo "📋 Copie de products-scraped.json vers products-ultimate.json..."
cp "$SCRAPED_PATH" "$ULTIMATE_PATH"
echo "   ✅ Données intégrées: $ULTIMATE_PATH"

# 4. Purger le cache Next.js
echo ""
echo "🧹 Purge du cache Next.js..."
if [ -d ".next" ]; then
    rm -rf .next
    echo "   ✅ Cache supprimé (.next/)"
else
    echo "   ℹ️  Pas de cache à supprimer (.next/ n'existe pas)"
fi

# 5. Statistiques
echo ""
echo "📊 Statistiques:"
PRODUCT_COUNT=$(python3 -c "import json; data = json.load(open('$ULTIMATE_PATH', 'r', encoding='utf-8')); products = data.get('products', data) if isinstance(data, dict) else data; print(len(products))" 2>/dev/null || echo "N/A")
echo "   📦 Produits dans products-ultimate.json: $PRODUCT_COUNT"

# 6. Instructions finales
echo ""
echo "======================================================================"
echo "✅ INTÉGRATION TERMINÉE"
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
echo "   3. Vérifier visuellement:"
echo "      - Visitez http://localhost:3000/shop"
echo "      - Vérifiez quelques pages produit"
echo "      - Assurez-vous qu'aucune image parasite n'est affichée"
echo ""
echo "   4. Vérifier le rapport de qualité:"
echo "      - Ouvrez reports/products_image_report.html dans votre navigateur"
echo ""
echo "🔄 En cas de problème, restaurer le backup:"
echo "   cp $BACKUP_PATH $ULTIMATE_PATH"
echo ""
echo "======================================================================"























