#!/bin/bash
# Script de nettoyage du dossier products_reconciled/
# À exécuter APRÈS avoir vérifié que tout fonctionne correctement

set -e

echo "🧹 Nettoyage du dossier products_reconciled/"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -d "public/images/products_reconciled" ]; then
  echo "❌ Erreur: Dossier products_reconciled/ introuvable"
  exit 1
fi

# Compter les fichiers
FILE_COUNT=$(find public/images/products_reconciled -type f | wc -l | tr -d ' ')
echo "📦 $FILE_COUNT fichiers trouvés dans products_reconciled/"
echo ""

# Demander confirmation
echo "⚠️  ATTENTION: Cette action va supprimer le dossier products_reconciled/"
echo "   Assurez-vous d'avoir vérifié que toutes les images fonctionnent!"
echo ""
read -p "Voulez-vous continuer? (oui/non): " CONFIRM

if [ "$CONFIRM" != "oui" ]; then
  echo "❌ Opération annulée"
  exit 0
fi

# Créer un backup final
BACKUP_DIR="public/images/products_reconciled_backup_$(date +%s)"
echo ""
echo "💾 Création d'un backup dans: $BACKUP_DIR"
cp -r public/images/products_reconciled "$BACKUP_DIR"
echo "✅ Backup créé"

# Supprimer le dossier
echo ""
echo "🗑️  Suppression de products_reconciled/..."
rm -rf public/images/products_reconciled

if [ ! -d "public/images/products_reconciled" ]; then
  echo "✅ Dossier supprimé avec succès"
else
  echo "❌ Erreur lors de la suppression"
  exit 1
fi

echo ""
echo "✨ Nettoyage terminé!"
echo ""
echo "📋 Prochaines étapes:"
echo "   1. Tester le site en local"
echo "   2. Si tout fonctionne, supprimer le backup: $BACKUP_DIR"
echo "   3. Committer les changements"
echo ""



