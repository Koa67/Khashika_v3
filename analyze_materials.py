#!/usr/bin/env python3
import json
with open('lib/data/products-ultimate.json', 'r') as f:
    products = json.load(f)

bijoux_types = ['bracelet', 'collier', "boucles d'oreilles", 'bague', 'pendentif', 'chaîne', 'cheville']

categories = {
    'argent': [],
    'laiton': [],
    'plaque_or': [],
    'metal': [],
    'macrame_cordon': [],
    'fantaisie': [],
    'pierres_seules': [],
    'tibetain': [],
    'autre': []
}

for p in products:
    name = p.get('name', '').lower()
    ptype = p.get('type', '')
    
    if ptype not in bijoux_types:
        continue
    
    if 'argent' in name:
        categories['argent'].append(p)
    elif 'laiton' in name:
        categories['laiton'].append(p)
    elif 'plaqué' in name or 'doré' in name:
        categories['plaque_or'].append(p)
    elif 'métal' in name or 'metal' in name:
        categories['metal'].append(p)
    elif 'macramé' in name or 'cordon' in name or 'fil ' in name:
        categories['macrame_cordon'].append(p)
    elif 'fantaisie' in name:
        categories['fantaisie'].append(p)
    elif 'tibétain' in name:
        categories['tibetain'].append(p)
    elif 'pierres naturelles' in name:
        categories['pierres_seules'].append(p)
    else:
        categories['autre'].append(p)

print('REPARTITION BIJOUX PAR MATERIAU:')
print('=' * 50)
total = 0
for cat, items in categories.items():
    print(f'{len(items):4d} | {cat}')
    total += len(items)
print('=' * 50)
print(f'{total:4d} | TOTAL BIJOUX')
print()
print('EXEMPLES "autre" (non classifies):')
for p in categories['autre'][:15]:
    print(f'  - {p["name"][:55]}')
if len(categories['autre']) > 15:
    print(f'  ... et {len(categories["autre"]) - 15} autres')
