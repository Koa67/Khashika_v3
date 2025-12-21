#!/bin/bash

# Script de sauvetage total : Rétablir CSS et corriger noms d'images
# Usage: ./run_rescue.sh

set -e  # Arrêter en cas d'erreur

echo "=========================================="
echo "🚨 SAUVETAGE TOTAL - KHASHIKA"
echo "=========================================="
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Installer dépendances CSS (Tailwind v3)
echo -e "${YELLOW}📦 Étape 1/4: Installation des dépendances CSS...${NC}"
npm install -D tailwindcss@3.4.1 postcss@8 autoprefixer@10
echo -e "${GREEN}✅ Dépendances installées${NC}"
echo ""

# 2. Lancer le script Python de renommage
echo -e "${YELLOW}🔄 Étape 2/4: Renommage des images...${NC}"
if [ ! -f "scripts/flatten_final.py" ]; then
    echo -e "${RED}❌ Erreur: scripts/flatten_final.py introuvable${NC}"
    exit 1
fi

# Rendre le script exécutable
chmod +x scripts/flatten_final.py

# Exécuter le script Python
python3 scripts/flatten_final.py
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erreur lors du renommage des images${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Images renommées${NC}"
echo ""

# 3. Nettoyer le cache Next.js
echo -e "${YELLOW}🧹 Étape 3/4: Nettoyage du cache...${NC}"
rm -rf .next
echo -e "${GREEN}✅ Cache nettoyé${NC}"
echo ""

# 4. Vérification finale
echo -e "${YELLOW}✅ Étape 4/4: Vérification...${NC}"

# Vérifier que tailwind.config.ts existe
if [ ! -f "tailwind.config.ts" ]; then
    echo -e "${RED}❌ Erreur: tailwind.config.ts introuvable${NC}"
    exit 1
fi

# Vérifier que postcss.config.mjs existe
if [ ! -f "postcss.config.mjs" ]; then
    echo -e "${RED}❌ Erreur: postcss.config.mjs introuvable${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Configuration vérifiée${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}✅ SAUVETAGE TERMINÉ AVEC SUCCÈS${NC}"
echo "=========================================="
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Vérifier que les fichiers de config sont corrects"
echo "   2. Lancer: npm run dev"
echo "   3. Vérifier que le CSS s'affiche correctement"
echo "   4. Vérifier que les images se chargent (plus d'erreurs 400)"
echo ""



















