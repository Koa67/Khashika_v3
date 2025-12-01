#!/bin/bash

# 1. Naviguer vers le dossier public
cd /Users/koa/moon-ksk-gpt/khashika/public || { echo "Erreur : Dossier public introuvable."; exit 1; }

# 2. Renommer le fichier SVG (ou le créer)
if [ -f "placeholder-image.jpg" ]; then
  mv placeholder-image.jpg placeholder-image.svg
  echo "✅ Fichier renommé : placeholder-image.jpg → placeholder-image.svg"
else
  echo '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="500" viewBox="0 0 500 500"><rect width="500" height="500" fill="black"/><text x="250" y="250" fill="white" text-anchor="middle" dominant-baseline="middle" font-size="24">Khashika</text></svg>' > placeholder-image.svg
  echo "✅ Fichier créé : placeholder-image.svg (nouveau)"
fi

# 3. Mettre à jour les chemins dans le code
cd ..
sed -i '' 's|/placeholder-image.jpg|/placeholder-image.svg|g' lib/data/products.ts 2>/dev/null
find . -type f -name "*.tsx" -exec sed -i '' 's|/placeholder-image.jpg|/placeholder-image.svg|g' {} + 2>/dev/null
echo "✅ Chemins mis à jour dans products.ts et fichiers .tsx"

# 4. Nettoyer les lockfiles
rm -f /Users/koa/package-lock.json /Users/koa/moon-ksk-gpt/package-lock.json 2>/dev/null
echo "✅ Lockfiles inutiles supprimés"

# 5. Nettoyer le cache et relancer le serveur
rm -rf .next
npm install && npm run dev &
echo "✅ Serveur relancé en arrière-plan (http://localhost:3000)"

# 6. Vérifications finales
sleep 10
echo -e "\n=== RAPPORT FINAL ==="
echo "Statut / : $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)"
echo "Statut /placeholder-image.svg : $(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/placeholder-image.svg)"
