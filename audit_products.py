#!/usr/bin/env python3
"""
AUDIT COMPLET PRODUITS KHASHIKA
- Filtres manquants
- Orthographe
- Red Team
"""
import json
import re
from collections import Counter

# Charger les produits
with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"{'='*70}")
print(f"AUDIT COMPLET KHASHIKA - {len(products)} PRODUITS")
print(f"{'='*70}")

# ============================================================
# 1. AUDIT FILTRES
# ============================================================
print(f"\n{'='*70}")
print("1. PRODUITS SANS FILTRES (non trouvables)")
print(f"{'='*70}")

no_type = []
no_stones = []
no_material = []
no_category = []
empty_name = []

for p in products:
    pid = p.get('id', 'NO_ID')
    name = p.get('name', '')
    
    if not name or name.strip() == '':
        empty_name.append(pid)
        continue
    
    name_short = name[:50]
    
    if not p.get('type'):
        no_type.append((pid, name_short))
    
    stones = p.get('stones', [])
    if not stones or len(stones) == 0:
        no_stones.append((pid, name_short))
    
    if not p.get('material'):
        no_material.append((pid, name_short))
    
    cat = p.get('category', '')
    if not cat or cat == '‹retour page précédente' or cat.strip() == '':
        no_category.append((pid, name_short))

print(f"\n❌ SANS TYPE ({len(no_type)}):")
for pid, n in no_type[:15]:
    print(f"   {n}")
if len(no_type) > 15:
    print(f"   ... et {len(no_type) - 15} autres")

print(f"\n⚠️  SANS PIERRES ({len(no_stones)}):")
print(f"   (Normal pour textiles, accessoires)")

print(f"\n⚠️  SANS MATERIAU ({len(no_material)}):")
print(f"   {len(no_material)} produits")

print(f"\n❌ SANS CATEGORIE VALIDE ({len(no_category)}):")
for pid, n in no_category[:10]:
    print(f"   {n}")

if empty_name:
    print(f"\n🚨 SANS NOM ({len(empty_name)}):")
    for pid in empty_name[:5]:
        print(f"   ID: {pid}")

# ============================================================
# 2. DISTRIBUTION DES TYPES
# ============================================================
print(f"\n{'='*70}")
print("2. DISTRIBUTION PAR TYPE")
print(f"{'='*70}")

types = Counter(p.get('type', 'AUCUN') for p in products)
for t, c in types.most_common():
    status = "❌" if t == 'AUCUN' or not t else "✅"
    print(f"   {status} {c:4d} | {t or 'AUCUN'}")

# ============================================================
# 3. DISTRIBUTION DES PIERRES
# ============================================================
print(f"\n{'='*70}")
print("3. DISTRIBUTION PAR PIERRE")
print(f"{'='*70}")

stones_counter = Counter()
for p in products:
    for s in p.get('stones', []):
        stones_counter[s.lower()] += 1

for s, c in stones_counter.most_common(20):
    print(f"   {c:4d} | {s}")
print(f"   ... {len(stones_counter)} pierres uniques au total")

# ============================================================
# 4. AUDIT ORTHOGRAPHE
# ============================================================
print(f"\n{'='*70}")
print("4. PROBLEMES ORTHOGRAPHE")
print(f"{'='*70}")

issues = []

# Patterns à vérifier
accent_fixes = {
    'amethyste': 'améthyste',
    'emeraude': 'émeraude',
    'peridot': 'péridot',
    'metal': 'métal',
    'chaine': 'chaîne',
    'boucle d oreille': "boucle d'oreille",
    'creole': 'créole',
    'reglable': 'réglable',
    'argente': 'argenté',
    'dore': 'doré',
    'tibetain': 'tibétain',
    'tete': 'tête',
}

for p in products:
    name = p.get('name', '')
    desc = p.get('description', '') or ''
    pid = p.get('id', '')
    
    # Double espaces
    if '  ' in name:
        issues.append(('DOUBLE_ESPACE', name[:50], 'Nom'))
    if '  ' in desc:
        issues.append(('DOUBLE_ESPACE', name[:50], 'Description'))
    
    # Majuscules en début (OK) mais tout en majuscules (pas OK pour description)
    if name.isupper() and len(name) > 20:
        issues.append(('TOUT_MAJUSCULE', name[:50], 'Nom'))
    
    # Accents manquants
    name_lower = name.lower()
    for wrong, correct in accent_fixes.items():
        if wrong in name_lower and correct.lower() not in name_lower:
            issues.append(('ACCENT_MANQUANT', f"{name[:40]} ({wrong} → {correct})", 'Nom'))
    
    # Espaces avant ponctuation
    if re.search(r'\s[,;:!?]', name):
        issues.append(('ESPACE_PONCTUATION', name[:50], 'Nom'))
    
    # Tirets multiples
    if '--' in name or '---' in name:
        issues.append(('TIRETS_MULTIPLES', name[:50], 'Nom'))

# Grouper par type
issue_types = Counter(i[0] for i in issues)
print(f"\nRésumé par type:")
for itype, count in issue_types.most_common():
    print(f"   {count:4d} | {itype}")

print(f"\nDétail (20 premiers):")
for itype, text, field in issues[:20]:
    print(f"   [{itype}] {text}")

if len(issues) > 20:
    print(f"   ... et {len(issues) - 20} autres")

print(f"\nTOTAL ISSUES ORTHOGRAPHE: {len(issues)}")

# ============================================================
# 5. RED TEAM - RECHERCHES QUI DEVRAIENT MARCHER
# ============================================================
print(f"\n{'='*70}")
print("5. RED TEAM - TESTS DE RECHERCHE")
print(f"{'='*70}")

test_searches = [
    'bague',
    'bracelet',
    'collier',
    'boucles',
    'turquoise',
    'argent',
    'or',
    'lapis',
    'améthyste',
    'pashmina',
    'foulard',
    'pendentif',
]

print("\nRecherche exacte (includes):")
for term in test_searches:
    count = sum(1 for p in products if term.lower() in (p.get('name', '') + ' ' + p.get('type', '')).lower())
    status = "✅" if count > 0 else "❌"
    print(f"   {status} '{term}' → {count} produits")

# ============================================================
# 6. PRODUITS ORPHELINS (aucun filtre ne les trouve)
# ============================================================
print(f"\n{'='*70}")
print("6. PRODUITS ORPHELINS (difficiles à trouver)")
print(f"{'='*70}")

orphans = []
for p in products:
    name = p.get('name', '')
    ptype = p.get('type', '')
    stones = p.get('stones', [])
    material = p.get('material', '')
    
    # Un produit est orphelin s'il n'a ni type, ni pierres, ni matériau identifiable
    if not ptype and not stones and not material:
        orphans.append(name[:60])

print(f"\n{len(orphans)} produits orphelins:")
for o in orphans[:20]:
    print(f"   - {o}")
if len(orphans) > 20:
    print(f"   ... et {len(orphans) - 20} autres")

# ============================================================
# RESUME
# ============================================================
print(f"\n{'='*70}")
print("RESUME AUDIT")
print(f"{'='*70}")
print(f"""
Total produits:        {len(products)}
Sans type:             {len(no_type)} ❌
Sans pierres:          {len(no_stones)} (normal pour textiles)
Sans matériau:         {len(no_material)}
Sans catégorie:        {len(no_category)} ❌
Orphelins:             {len(orphans)} ❌
Issues orthographe:    {len(issues)}

ACTIONS REQUISES:
1. Ajouter 'type' aux {len(no_type)} produits sans type
2. Corriger {len(issues)} problèmes d'orthographe
3. Vérifier les {len(orphans)} produits orphelins
""")
