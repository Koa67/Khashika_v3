#!/usr/bin/env python3
"""
FIX ORTHOGRAPHE PRODUITS KHASHIKA
Corrige les accents manquants dans les noms de produits
"""
import json
import re

# Charger les produits
with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"Chargé {len(products)} produits")

# Corrections à appliquer (insensible à la casse)
CORRECTIONS = {
    # Accents manquants
    'tibetain': 'tibétain',
    'tibetaine': 'tibétaine',
    'tibetains': 'tibétains',
    'tibetaines': 'tibétaines',
    'metal': 'métal',
    'argente': 'argenté',
    'argentee': 'argentée',
    'argentes': 'argentés',
    'argentees': 'argentées',
    'chaine': 'chaîne',
    'chaines': 'chaînes',
    'chainette': 'chaînette',
    'amethyste': 'améthyste',
    'amethystes': 'améthystes',
    'emeraude': 'émeraude',
    'emeraudes': 'émeraudes',
    'peridot': 'péridot',
    'peridots': 'péridots',
    'reglable': 'réglable',
    'reglables': 'réglables',
    'creole': 'créole',
    'creoles': 'créoles',
    'dore': 'doré',
    'doree': 'dorée',
    'dores': 'dorés',
    'dorees': 'dorées',
    'tete': 'tête',
    'tetes': 'têtes',
    'ciselee': 'ciselée',
    'ciselees': 'ciselées',
    'cisele': 'ciselé',
    'martele': 'martelé',
    'martelee': 'martelée',
    'facette': 'facetté',
    'facettee': 'facettée',
    'incruste': 'incrusté',
    'incrustee': 'incrustée',
    'tresse': 'tressé',
    'tressee': 'tressée',
    'ovale': 'ovale',  # OK
    'ethnique': 'ethnique',  # OK
}

def fix_accents(text):
    """Corrige les accents manquants dans un texte"""
    if not text:
        return text
    
    original = text
    
    for wrong, correct in CORRECTIONS.items():
        # Pattern pour matcher le mot entier (avec limites de mot)
        # Insensible à la casse mais préserve la casse originale
        pattern = r'\b' + wrong + r'\b'
        
        def replace_preserve_case(match):
            matched = match.group(0)
            if matched.isupper():
                return correct.upper()
            elif matched[0].isupper():
                return correct.capitalize()
            else:
                return correct
        
        text = re.sub(pattern, replace_preserve_case, text, flags=re.IGNORECASE)
    
    # Fix espaces avant ponctuation
    text = re.sub(r'\s+([,;:!?])', r'\1', text)
    
    # Fix doubles espaces
    text = re.sub(r'\s{2,}', ' ', text)
    
    return text

# Appliquer les corrections
fixed_count = 0
changes = []

for p in products:
    name = p.get('name', '')
    desc = p.get('description', '') or ''
    
    new_name = fix_accents(name)
    new_desc = fix_accents(desc)
    
    if new_name != name:
        changes.append(f"NOM: {name[:40]} → {new_name[:40]}")
        p['name'] = new_name
        fixed_count += 1
    
    if new_desc != desc:
        p['description'] = new_desc

# Sauvegarder
with open('lib/data/products-ultimate.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, ensure_ascii=False, indent=2)

print(f"\n{'='*60}")
print(f"CORRECTIONS APPLIQUÉES: {fixed_count} produits modifiés")
print(f"{'='*60}")

for c in changes[:30]:
    print(f"  {c}")

if len(changes) > 30:
    print(f"  ... et {len(changes) - 30} autres")

print(f"\n✅ Fichier sauvegardé!")
