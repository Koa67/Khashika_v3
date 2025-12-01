#!/bin/bash

# Script de correction "Golden Source" - Utilise le site live comme référence
# 1. Installe les dépendances Python
# 2. Lance le scraping live
# 3. Lance l'application du mapping
# 4. Nettoie le cache Next.js

set -e

echo "🌟 Démarrage de la correction Golden Source..."

# 0. Installation des dépendances Python
echo "📦 Installation des dépendances Python..."
pip install requests urllib3 beautifulsoup4 --quiet || python3 -m pip install requests urllib3 beautifulsoup4 --quiet
echo "✅ Dépendances installées"

# 1. Scraping depuis le site live
echo "📡 Étape 1 : Scraping depuis www.khashika.com..."
python3 scripts/live_site_mapper.py

# 2. Application du mapping
echo ""
echo "🔗 Étape 2 : Application du mapping..."
python3 scripts/apply_live_mapping.py

# 3. Nettoyer le cache Next.js
echo ""
echo "🗑️  Étape 3 : Suppression du cache Next.js..."
rm -rf .next

echo ""
echo "✅ Correction Golden Source terminée!"
echo "   - Référence live créée: lib/data/live_reference.json"
echo "   - Produits mis à jour: lib/data/products-ultimate.json"
echo "   - Cache Next.js supprimé"
echo ""
echo "💡 Prochaine étape: Exécutez 'npm run dev' pour voir les changements"

