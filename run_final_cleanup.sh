#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "🧹 NETTOYAGE FINAL DU PROJET"
echo "════════════════════════════════════════════════════════════"
echo ""

# Backup de sécurité
echo "💾 Backup de sécurité final..."
cp lib/data/products-ultimate.json lib/data/products-ultimate.json.backup-final
echo "✓ Backup créé"
echo ""

# Nettoyage
python3 scripts/final_cleanup.py

# Nettoyage du cache Next.js
echo ""
echo "🧹 Nettoyage du cache Next.js..."
rm -rf .next
echo "✓ Cache supprimé"

echo ""
echo "════════════════════════════════════════════════════════════"
echo "✅ PROJET PRÊT !"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "🚀 Commandes disponibles :"
echo "  npm run dev     → Lancer le serveur de développement"
echo "  npm run build   → Créer le build de production"
echo "  npm run start   → Lancer le serveur de production"
echo ""
