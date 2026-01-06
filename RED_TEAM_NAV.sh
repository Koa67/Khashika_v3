#!/bin/bash
# RED TEAM BULLETPROOF - Navigation Menu
# Exécuter après les modifs Cursor

echo "🔴 RED TEAM - NavigationMenu.tsx"
echo "================================"

FILE="components/Navigation/NavigationMenu.tsx"
PASS=0
FAIL=0

# Test 1: Fichier existe
if [ -f "$FILE" ]; then
  echo "✅ Fichier existe"
  ((PASS++))
else
  echo "❌ Fichier manquant!"
  exit 1
fi

# Test 2: Section Sélections supprimée
if grep -q "Sélections" "$FILE"; then
  echo "❌ Section 'Sélections' encore présente"
  ((FAIL++))
else
  echo "✅ Section 'Sélections' supprimée"
  ((PASS++))
fi

# Test 3: Nouveautés supprimé
if grep -q "nouveautes\|Nouveautés" "$FILE"; then
  echo "❌ 'Nouveautés' encore présent"
  ((FAIL++))
else
  echo "✅ 'Nouveautés' supprimé"
  ((PASS++))
fi

# Test 4: Best-sellers supprimé
if grep -q "best-sellers\|Meilleures ventes" "$FILE"; then
  echo "❌ 'Meilleures ventes' encore présent"
  ((FAIL++))
else
  echo "✅ 'Meilleures ventes' supprimé"
  ((PASS++))
fi

# Test 5: Dropdown Bijoux pleine largeur (fixed left-0 right-0 ou w-screen)
if grep -q "fixed.*left-0.*right-0\|w-screen\|w-full.*left-0" "$FILE"; then
  echo "✅ Dropdown Bijoux pleine largeur détecté"
  ((PASS++))
else
  echo "⚠️  Pas de pleine largeur détectée (vérifier manuellement)"
  ((FAIL++))
fi

# Test 6: Séparateurs verticaux (border-l)
if grep -q "border-l" "$FILE"; then
  echo "✅ Séparateurs verticaux présents"
  ((PASS++))
else
  echo "❌ Pas de séparateurs verticaux (border-l)"
  ((FAIL++))
fi

# Test 7: Condition spéciale pour Bijoux
if grep -q "menu.label.*Bijoux\|label === 'Bijoux'" "$FILE"; then
  echo "✅ Condition spéciale Bijoux détectée"
  ((PASS++))
else
  echo "⚠️  Pas de condition Bijoux (peut être inline)"
fi

# Test 8: Pierres - compter les items
STONES_COUNT=$(grep -c "href: '/pierres/" "$FILE")
if [ "$STONES_COUNT" -le 12 ]; then
  echo "✅ Pierres: $STONES_COUNT liens (≤12 OK)"
  ((PASS++))
else
  echo "❌ Pierres: $STONES_COUNT liens (trop, max 10-12)"
  ((FAIL++))
fi

# Test 9: Liens Bijoux présents
BIJOUX_LINKS=("bagues" "boucles-oreilles" "colliers" "pendentifs" "bracelets" "chaines" "chevilles")
for link in "${BIJOUX_LINKS[@]}"; do
  if grep -q "/bijoux/$link" "$FILE"; then
    echo "  ✓ /bijoux/$link"
  else
    echo "  ✗ /bijoux/$link MANQUANT"
    ((FAIL++))
  fi
done

# Test 10: Accessoires inchangés
if grep -q "Pashminas.*Foulards\|/accessoires/pashmina" "$FILE"; then
  echo "✅ Section Accessoires intacte"
  ((PASS++))
else
  echo "❌ Section Accessoires cassée"
  ((FAIL++))
fi

# Test 11: Build test
echo ""
echo "🔨 Test build..."
if pnpm build > /tmp/build.log 2>&1; then
  echo "✅ Build réussi"
  ((PASS++))
else
  echo "❌ Build échoué - voir /tmp/build.log"
  tail -20 /tmp/build.log
  ((FAIL++))
fi

echo ""
echo "================================"
echo "RÉSULTATS: $PASS ✅ | $FAIL ❌"
if [ $FAIL -eq 0 ]; then
  echo "🎉 TOUS LES TESTS PASSENT"
else
  echo "🚨 $FAIL PROBLÈMES À CORRIGER"
fi



