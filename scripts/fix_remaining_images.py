#!/usr/bin/env python3
"""Corriger les dernières images mal nommées."""

import json
import os
import re
import unicodedata
from urllib.parse import unquote

def normalize_slug(text):
    """Normaliser un slug."""
    text = unquote(text)  # Décoder %C3%A9 -> é
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    text = re.sub(r'-+', '-', text)
    return text

print("🔧 Correction des dernières images mal nommées")
print()

# Charger le JSON
with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

fixed_count = 0

for product in products:
    image_url = product.get('image_url', '')
    
    # Problème 1 : Images avec encodage URL (%C3%A9)
    if '%' in image_url:
        clean_slug = normalize_slug(product['name'])
        
        # Trouver l'extension
        for ext in ['.jpg', '.jpeg', '.png', '.webp']:
            if ext in image_url:
                new_filename = f"{clean_slug}{ext}"
                new_path = f"/images/products/{new_filename}"
                
                # Vérifier si la nouvelle image existe
                if os.path.exists(f"public{new_path}"):
                    print(f"✓ {product['name'][:50]}")
                    print(f"  {image_url} → {new_path}")
                    product['image_url'] = new_path
                    fixed_count += 1
                    break
    
    # Problème 2 : Images prod-X
    elif '/prod-' in image_url:
        clean_slug = normalize_slug(product['name'])
        
        # Chercher si une image avec le slug propre existe
        for ext in ['.jpg', '.jpeg', '.png', '.webp']:
            test_path = f"public/images/products/{clean_slug}{ext}"
            if os.path.exists(test_path):
                new_path = f"/images/products/{clean_slug}{ext}"
                print(f"✓ {product['name'][:50]}")
                print(f"  {image_url} → {new_path}")
                product['image_url'] = new_path
                fixed_count += 1
                break

print()
print(f"✓ {fixed_count} produits corrigés")

# Sauvegarder
with open('lib/data/products-ultimate.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("💾 JSON sauvegardé")
