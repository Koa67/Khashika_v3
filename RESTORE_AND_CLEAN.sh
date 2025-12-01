#!/bin/bash

# ===============================================================
# SCRIPT DE RESTAURATION ET NETTOYAGE COMPLET
# ===============================================================
# Ce script :
# 1. Restaure le backup du JSON (avant l'aplatissement)
# 2. Restaure les images depuis le backup
# 3. Applique un nettoyage des images parasites
# ===============================================================

set -e

echo "======================================================================"
echo "🔄 RESTAURATION COMPLÈTE DES DONNÉES"
echo "======================================================================"
echo ""

# Vérifier les backups
echo "📂 Vérification des backups..."

if [ ! -f "lib/data/products-ultimate.json.backup_before_flatten" ]; then
    echo "❌ Backup JSON introuvable"
    exit 1
fi

if [ ! -d "public/images/products_backup" ]; then
    echo "❌ Backup images introuvable"
    exit 1
fi

echo "   ✅ Backups trouvés"
echo ""

# Étape 1: Restaurer le JSON
echo "📝 ÉTAPE 1: Restauration du JSON..."
cp lib/data/products-ultimate.json.backup_before_flatten lib/data/products-ultimate.json
echo "   ✅ JSON restauré"
echo ""

# Étape 2: Restaurer les images
echo "📸 ÉTAPE 2: Restauration des images..."
# Supprimer les images aplaties
rm -rf public/images/products/*.jpg 2>/dev/null || true
# Copier les images du backup (structure avec sous-dossiers)
cp -r public/images/products_backup/* public/images/products/ 2>/dev/null || true
echo "   ✅ Images restaurées"
echo ""

# Étape 3: Lancer le nettoyage des parasites
echo "🧹 ÉTAPE 3: Nettoyage des images parasites..."
python3 scripts/clean_parasite_images.py
echo ""

# Étape 4: Nettoyer le cache
echo "🗑️  ÉTAPE 4: Nettoyage du cache Next.js..."
rm -rf .next
echo "   ✅ Cache supprimé"
echo ""

echo "======================================================================"
echo "✅ RESTAURATION TERMINÉE"
echo "======================================================================"
echo ""
echo "📝 Prochaines étapes:"
echo "   npm run build"
echo "   npm run dev"
echo ""


