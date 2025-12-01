#!/bin/bash

# Script d'exécution pour le téléchargement direct depuis khashika.com

set -e  # Arrêter en cas d'erreur

echo "════════════════════════════════════════════════════════════"
echo "🌐 TÉLÉCHARGEMENT DIRECT DEPUIS KHASHIKA.COM"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "⚠️  Ce processus prendra environ 5-10 minutes"
echo "⚠️  656 produits × 0.5s délai = ~6 minutes"
echo ""

# Vérifier que Python 3 est disponible
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier les dépendances Python
echo "📦 Vérification des dépendances Python..."
python3 -c "import requests" 2>/dev/null || {
    echo "⚠ requests non installé. Installation..."
    pip3 install requests
}

python3 -c "import bs4" 2>/dev/null || {
    echo "⚠ beautifulsoup4 non installé. Installation..."
    pip3 install beautifulsoup4
}

echo "✓ Dépendances OK"
echo ""

# Backup
echo "💾 Création d'une sauvegarde..."
cp lib/data/products-ultimate.json lib/data/products-ultimate.json.backup
echo "✓ Backup créé"
echo ""

# Création du dossier images
mkdir -p public/images/products
mkdir -p data

# Lancement du script
echo "🚀 Démarrage du téléchargement..."
echo ""
python3 scripts/scrape_and_download_images.py

# Nettoyage
echo ""
echo "🧹 Nettoyage du cache..."
rm -rf .next
echo "✓ Cache nettoyé"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ TERMINÉ !"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Lancez : npm run dev"
echo ""

