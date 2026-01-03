#!/usr/bin/env python3
"""
TAG AUTOMATIQUE DES MATERIAUX
Ajoute le champ 'material' basé sur le nom du produit
"""
import json

with open('lib/data/products-ultimate.json', 'r') as f:
    products = json.load(f)

print(f"Chargé {len(products)} produits")

bijoux_types = ['bracelet', 'collier', "boucles d'oreilles", 'bague', 'pendentif', 'chaîne', 'cheville']

updated = 0
details = []

for p in products:
    # Skip si déjà un material
    if p.get('material'):
        continue
    
    name = p.get('name', '').lower()
    ptype = p.get('type', '')
    
    # Seulement les bijoux
    if ptype not in bijoux_types:
        continue
    
    material = None
    
    # Ordre de priorité pour la détection
    if 'argent' in name:
        material = 'argent'
    elif 'laiton' in name:
        material = 'laiton'
    elif 'plaqué or' in name or 'plaqué argent' in name:
        material = 'plaqué'
    elif 'doré' in name and 'argent' not in name:
        material = 'plaqué or'
    elif 'métal' in name:
        material = 'métal'
    elif 'cuir' in name or 'cuire' in name:  # typo "cuire" existe
        material = 'cuir'
    elif 'bois' in name:
        material = 'bois'
    elif 'résine' in name:
        material = 'résine'
    elif 'macramé' in name or 'cordon' in name or 'fil ' in name or 'fil noir' in name:
        material = 'cordon'
    elif 'tibétain' in name:
        material = 'métal tibétain'
    elif 'fantaisie' in name:
        material = 'fantaisie'
    elif 'pierre' in name or 'perle' in name or 'cristal' in name:
        material = 'pierres'
    elif 'élastique' in name:
        material = 'pierres'  # bracelet élastique = pierres sur élastique
    elif 'indien' in name:
        material = 'pierres'  # bijoux indiens en pierres
    elif 'naturel' in name:
        material = 'pierres'
    
    if material:
        p['material'] = material
        updated += 1
        details.append(f"{material:15} | {p['name'][:45]}")

# Sauvegarder
with open('lib/data/products-ultimate.json', 'w') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n{'='*60}")
print(f"MATERIAUX AJOUTES: {updated} produits")
print(f"{'='*60}")

# Résumé par material
from collections import Counter
materials = Counter(d.split('|')[0].strip() for d in details)
print("\nPar matériau:")
for m, c in materials.most_common():
    print(f"  {c:4d} | {m}")

print(f"\nDétail (30 premiers):")
for d in details[:30]:
    print(f"  {d}")
if len(details) > 30:
    print(f"  ... et {len(details) - 30} autres")

print(f"\n✅ Fichier sauvegardé!")

# Vérifier ce qui reste sans material
remaining = [p for p in products if not p.get('material') and p.get('type') in bijoux_types]
print(f"\n⚠️  Reste {len(remaining)} bijoux sans matériau")
if remaining:
    print("Exemples:")
    for p in remaining[:5]:
        print(f"  - {p['name'][:55]}")
