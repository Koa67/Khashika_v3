#!/bin/bash

# =============================================
# PROTOCOLE DE DÉPLOIEMENT SUPABASE (AUTONOME)
# =============================================
# Objectif : Base initiale + Produits réels
# =============================================

set -e  # Arrêter en cas d'erreur

echo ""
echo "🚀 Démarrage du protocole de déploiement Supabase"
echo "============================================================"
echo ""

# Couleurs pour les messages
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. VÉRIFICATION DES MIGRATIONS
echo -e "${GREEN}📦 ÉTAPE 1: Vérification des migrations${NC}"
echo "------------------------------------------------------------"

MIGRATIONS_DIR="supabase/migrations"
MIGRATION_FILES=(
    "01_create_products_table.sql"
    "02_create_cart_items_table.sql"
)

for file in "${MIGRATION_FILES[@]}"; do
    if [ -f "$MIGRATIONS_DIR/$file" ]; then
        echo "✅ $file trouvé"
    else
        echo -e "${RED}❌ $file introuvable${NC}"
        exit 1
    fi
done

echo ""
echo -e "${YELLOW}📝 Note: Pour appliquer les migrations, utilisez:${NC}"
echo "   npx supabase db push"
echo "   Ou exécutez-les manuellement dans le dashboard Supabase"
echo ""

# 2. VÉRIFICATION DU CSV
echo -e "${GREEN}📦 ÉTAPE 2: Vérification du CSV de produits${NC}"
echo "------------------------------------------------------------"

if [ -f "products_to_import.csv" ]; then
    PRODUCT_COUNT=$(tail -n +2 products_to_import.csv | grep -c . || echo "0")
    echo "✅ CSV trouvé: $PRODUCT_COUNT produits à importer"
else
    echo -e "${YELLOW}⚠️  CSV introuvable${NC}"
    echo "   Exécutez d'abord: python3 scripts/scrape_products.py"
    exit 1
fi

echo ""

# 3. EXÉCUTION DU SEEDING
echo -e "${GREEN}📦 ÉTAPE 3: Seeding des produits${NC}"
echo "------------------------------------------------------------"

if [ ! -f "scripts/seed_supabase.py" ]; then
    echo -e "${RED}❌ Script de seeding introuvable${NC}"
    exit 1
fi

# Vérifier si Python est disponible
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python3 n'est pas installé${NC}"
    exit 1
fi

echo "🔄 Exécution de scripts/seed_supabase.py..."
python3 scripts/seed_supabase.py

SEED_EXIT_CODE=$?
if [ $SEED_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Seeding terminé${NC}"
else
    echo -e "${YELLOW}⚠️  Le seeding a rencontré des erreurs (code: $SEED_EXIT_CODE)${NC}"
    echo "   Vérifiez les logs ci-dessus"
fi

echo ""

# 4. VÉRIFICATION DES IMAGES
echo -e "${GREEN}📦 ÉTAPE 4: Vérification des images copiées${NC}"
echo "------------------------------------------------------------"

if [ -d "public/images/products" ]; then
    IMAGE_COUNT=$(ls -1 public/images/products 2>/dev/null | wc -l | xargs)
    echo "✅ $IMAGE_COUNT images dans public/images/products/"
else
    echo -e "${YELLOW}⚠️  Dossier public/images/products/ introuvable${NC}"
fi

echo ""

# 5. RÉSUMÉ FINAL
echo "============================================================"
echo -e "${GREEN}✅ Protocole de déploiement terminé${NC}"
echo "============================================================"
echo ""
echo -e "${YELLOW}📋 Prochaines étapes:${NC}"
echo "   1. Vérifiez que les migrations sont appliquées dans Supabase"
echo "      → npx supabase db push"
echo "      → Ou exécutez-les dans le dashboard Supabase"
echo ""
echo "   2. Vérifiez que les produits sont importés dans Supabase"
echo "      → Dashboard Supabase → Table Editor → products"
echo ""
echo "   3. Testez l'API"
echo "      → npm run dev"
echo "      → curl http://localhost:3000/api/products"
echo ""
echo ""










