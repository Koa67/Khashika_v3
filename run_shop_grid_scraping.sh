#!/bin/bash

# Script pour scraper la boutique depuis le grid et fusionner les données

set -e

echo "======================================================================"
echo "🛍️  SCRAPING CIBLÉ DEPUIS LA PAGE BOUTIQUE"
echo "======================================================================"
echo ""

# Étape 1: Scraper le shop grid
echo "📸 ÉTAPE 1: Scraping du shop grid..."
python3 scripts/scrape_shop_grid.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erreur lors du scraping"
    exit 1
fi

echo ""
echo "✅ Étape 1 terminée"
echo ""

# Étape 2: Fusionner avec products-ultimate.json
echo "🔄 ÉTAPE 2: Fusion avec products-ultimate.json..."
python3 scripts/merge_shop_grid_data.py

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Erreur lors de la fusion"
    exit 1
fi

echo ""
echo "✅ Étape 2 terminée"
echo ""

# Étape 2.5: Nettoyer les anciennes images parasites
echo "🧹 ÉTAPE 2.5: Nettoyage des anciennes images parasites..."
python3 scripts/clean_old_images.py

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Erreur lors du nettoyage (non bloquant)"
fi

echo ""
echo "✅ Étape 2.5 terminée"
echo ""

# Étape 3: Nettoyer le cache
echo "🧹 ÉTAPE 3: Nettoyage du cache Next.js..."
rm -rf .next
echo "   ✅ Cache supprimé"
echo ""

echo "======================================================================"
echo "✅ SCRAPING TERMINÉ"
echo "======================================================================"
echo ""
echo "📝 Prochaines étapes:"
echo "   npm run build"
echo "   npm run dev"
echo ""
echo "🔄 En cas de problème, restaurer le backup:"
echo "   cp lib/data/products-ultimate.json.backup_before_merge lib/data/products-ultimate.json"
echo ""
echo "======================================================================"

