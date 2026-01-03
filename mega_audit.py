#!/usr/bin/env python3
"""
MEGA-AUDIT KHASHIKA - VERIFICATION COMPLETE
1. Chaque produit a au moins un filtre
2. Chaque filtre affiche le bon count
3. Aucun produit orphelin
4. Red team verification
"""
import json
import re
from collections import Counter

print("=" * 70)
print("MEGA-AUDIT KHASHIKA")
print("=" * 70)

# Charger les produits
with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"\nTotal produits: {len(products)}")

# ============================================================
# 1. VERIFICATION DES TYPES (champ "type" du JSON)
# ============================================================
print("\n" + "=" * 70)
print("1. AUDIT DES TYPES")
print("=" * 70)

# Types attendus dans FILTER_CONFIG
EXPECTED_TYPES = [
    "bague", "boucles d'oreilles", "collier", "pendentif", 
    "bracelet", "chaîne", "cheville"
]
EXPECTED_ACCESSORIES = [
    "pashmina", "foulard", "sac", "accessoire", "accessoire cheveux"
]
ALL_EXPECTED = EXPECTED_TYPES + EXPECTED_ACCESSORIES

# Compter les types réels dans le JSON
type_counts = Counter(p.get('type', 'AUCUN') for p in products)

print("\nTypes dans le JSON vs attendus:")
print("-" * 50)

missing_in_config = []
for t, c in type_counts.most_common():
    status = "✅" if t in ALL_EXPECTED else "❌ NON DANS CONFIG"
    print(f"  {c:4d} | {t:25} {status}")
    if t not in ALL_EXPECTED and t != 'AUCUN':
        missing_in_config.append((t, c))

# Produits sans type
no_type = [p for p in products if not p.get('type')]
print(f"\n❌ Produits SANS type: {len(no_type)}")
for p in no_type[:5]:
    print(f"   - {p.get('name', 'SANS NOM')[:50]}")

# ============================================================
# 2. VERIFICATION DES MATERIAUX
# ============================================================
print("\n" + "=" * 70)
print("2. AUDIT DES MATERIAUX")
print("=" * 70)

# Matériaux attendus
EXPECTED_MATERIALS = ['argent', 'métal', 'laiton', 'cordon', 'bois', 'cuir']

# Fonction pour simuler le count du hook (cherche dans name+desc+material)
def count_material_like_hook(mat_id):
    count = 0
    for p in products:
        search_text = f"{p.get('name', '')} {p.get('description', '')} {p.get('material', '')}".lower()
        # Word boundary match
        regex = re.compile(r'\b' + re.escape(mat_id) + r'\b', re.IGNORECASE)
        if regex.search(search_text):
            count += 1
    return count

print("\nMatériaux (comme le hook les compte):")
print("-" * 50)
for m in EXPECTED_MATERIALS:
    c = count_material_like_hook(m)
    status = "✅" if c > 0 else "❌ ZERO"
    print(f"  {c:4d} | {m:25} {status}")

# Matériaux dans le champ material du JSON
material_field_counts = Counter(p.get('material') for p in products if p.get('material'))
print("\nMatériaux dans le champ 'material' du JSON:")
for m, c in material_field_counts.most_common():
    in_filter = "✅" if m in EXPECTED_MATERIALS else "⚠️ pas dans filtre"
    print(f"  {c:4d} | {m:25} {in_filter}")

# ============================================================
# 3. VERIFICATION DES PIERRES
# ============================================================
print("\n" + "=" * 70)
print("3. AUDIT DES PIERRES")
print("=" * 70)

# Pierres dans le JSON (champ stones)
stones_counter = Counter()
products_with_stones = 0
for p in products:
    stones = p.get('stones', [])
    if stones:
        products_with_stones += 1
        for s in stones:
            stones_counter[s.lower()] += 1

print(f"\nProduits avec pierres: {products_with_stones}/{len(products)}")
print(f"Pierres uniques: {len(stones_counter)}")
print("\nTop 15 pierres:")
for s, c in stones_counter.most_common(15):
    print(f"  {c:4d} | {s}")

# ============================================================
# 4. PRODUITS ORPHELINS (aucun filtre ne les trouve)
# ============================================================
print("\n" + "=" * 70)
print("4. PRODUITS ORPHELINS")
print("=" * 70)

orphans = []
for p in products:
    ptype = p.get('type', '')
    material = p.get('material', '')
    stones = p.get('stones', [])
    name = p.get('name', '')
    
    # Un produit n'est PAS orphelin s'il a:
    # - un type valide OU
    # - un material qui match un filtre OU
    # - des pierres
    
    has_valid_type = ptype in ALL_EXPECTED
    has_material = bool(material)
    has_stones = len(stones) > 0
    
    if not has_valid_type:
        orphans.append({
            'name': name,
            'type': ptype,
            'material': material,
            'stones': stones
        })

print(f"\nProduits avec type NON reconnu: {len(orphans)}")
for o in orphans[:10]:
    print(f"  - [{o['type']}] {o['name'][:45]}")
if len(orphans) > 10:
    print(f"  ... et {len(orphans) - 10} autres")

# ============================================================
# 5. SIMULATION DES COUNTS COMME LE HOOK
# ============================================================
print("\n" + "=" * 70)
print("5. SIMULATION COUNTS (comme useShopFilters)")
print("=" * 70)

# Types - count exact sur le champ type
print("\n--- TYPES (champ type) ---")
for t in EXPECTED_TYPES:
    count = sum(1 for p in products if p.get('type') == t)
    status = "✅" if count > 0 else "❌ ZERO!"
    print(f"  {count:4d} | {t:25} {status}")

# Accessoires
print("\n--- ACCESSOIRES (champ type) ---")
for a in EXPECTED_ACCESSORIES:
    count = sum(1 for p in products if p.get('type') == a)
    status = "✅" if count > 0 else "❌ ZERO!"
    print(f"  {count:4d} | {a:25} {status}")

# Matériaux - regex sur name+desc+material
print("\n--- MATERIAUX (regex name+desc+material) ---")
for m in EXPECTED_MATERIALS:
    count = count_material_like_hook(m)
    status = "✅" if count > 0 else "❌ ZERO!"
    print(f"  {count:4d} | {m:25} {status}")

# ============================================================
# 6. RED TEAM - RECHERCHE D'ANOMALIES
# ============================================================
print("\n" + "=" * 70)
print("6. RED TEAM - ANOMALIES")
print("=" * 70)

anomalies = []

# 6.1 Produits avec type vide ou bizarre
weird_types = [p for p in products if not p.get('type') or p.get('type') not in ALL_EXPECTED]
if weird_types:
    anomalies.append(f"❌ {len(weird_types)} produits avec type invalide/manquant")

# 6.2 Type "boucles d'oreilles" vs variations
boucles_variations = {}
for p in products:
    t = p.get('type', '')
    if 'boucle' in t.lower() or 'oreille' in t.lower():
        boucles_variations[t] = boucles_variations.get(t, 0) + 1

if len(boucles_variations) > 1:
    anomalies.append(f"⚠️ Variations de 'boucles': {boucles_variations}")

# 6.3 Vérifier si le type dans FILTER_CONFIG match exactement le JSON
print("\n--- Vérification match exact types ---")
for t in EXPECTED_TYPES:
    json_count = sum(1 for p in products if p.get('type') == t)
    if json_count == 0:
        anomalies.append(f"❌ Type '{t}' = 0 produits! Vérifier l'orthographe exacte")
        # Chercher des variantes
        for p in products:
            pt = p.get('type', '').lower()
            if t.lower() in pt or pt in t.lower():
                print(f"   Variante trouvée: '{p.get('type')}' pour '{t}'")
                break

# 6.4 Vérifier la casse
print("\n--- Vérification casse des types ---")
type_cases = {}
for p in products:
    t = p.get('type', '')
    if t:
        key = t.lower()
        if key not in type_cases:
            type_cases[key] = set()
        type_cases[key].add(t)

for key, variations in type_cases.items():
    if len(variations) > 1:
        anomalies.append(f"⚠️ Casse inconsistante pour '{key}': {variations}")

print("\n--- Anomalies détectées ---")
for a in anomalies:
    print(f"  {a}")

if not anomalies:
    print("  ✅ Aucune anomalie détectée!")

# ============================================================
# 7. RESUME FINAL
# ============================================================
print("\n" + "=" * 70)
print("7. RESUME FINAL")
print("=" * 70)

total_with_type = sum(1 for p in products if p.get('type') in ALL_EXPECTED)
total_with_material = sum(1 for p in products if p.get('material'))
total_with_stones = sum(1 for p in products if p.get('stones'))

print(f"""
Total produits:           {len(products)}
Avec type valide:         {total_with_type} ({100*total_with_type//len(products)}%)
Avec matériau:            {total_with_material} ({100*total_with_material//len(products)}%)
Avec pierres:             {total_with_stones} ({100*total_with_stones//len(products)}%)
Orphelins (type invalide): {len(orphans)}
Anomalies:                {len(anomalies)}
""")

# Types qui retournent 0
zero_types = [t for t in EXPECTED_TYPES if sum(1 for p in products if p.get('type') == t) == 0]
if zero_types:
    print(f"🚨 TYPES AVEC 0 PRODUITS: {zero_types}")
    print("   → Ces filtres afficheront (0) dans la sidebar!")

# ============================================================
# 8. ACTIONS RECOMMANDEES
# ============================================================
print("\n" + "=" * 70)
print("8. ACTIONS RECOMMANDEES")
print("=" * 70)

if zero_types:
    print(f"\n❌ CRITIQUE: Corriger les types: {zero_types}")
    print("   Le filtre dans FILTER_CONFIG doit matcher EXACTEMENT le champ 'type' du JSON")

if anomalies:
    print(f"\n⚠️ Corriger {len(anomalies)} anomalie(s)")

if len(orphans) > 0:
    print(f"\n⚠️ Vérifier {len(orphans)} produits avec type non reconnu")
