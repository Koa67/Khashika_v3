#!/usr/bin/env python3
import json
import os
import re
import unicodedata
from urllib.parse import unquote

def normalize_slug(text):
    text = unquote(text)
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    text = re.sub(r'-+', '-', text)
    return text

print("🔧 Correction des dernières images")
print()

with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Backup
with open('lib/data/products-ultimate.json.backup-final', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

fixed = 0

for product in products:
    image_url = product.get('image_url', '')
    
    # Problème 1 : Encodage URL
    if '%' in image_url:
        clean_slug = normalize_slug(product['name'])
        for ext in ['.jpg', '.jpeg', '.png', '.webp']:
            new_path = f"/images/products/{clean_slug}{ext}"
            if os.path.exists(f"public{new_path}"):
                print(f"✓ {product['name'][:50]}")
                print(f"  {os.path.basename(image_url)} → {os.path.basename(new_path)}")
                product['image_url'] = new_path
                fixed += 1
                break
    
    # Problème 2 : prod-X
    elif '/prod-' in image_url:
        clean_slug = normalize_slug(product['name'])
        for ext in ['.jpg', '.jpeg', '.png', '.webp']:
            new_path = f"/images/products/{clean_slug}{ext}"
            if os.path.exists(f"public{new_path}"):
                print(f"✓ {product['name'][:50]}")
                print(f"  {os.path.basename(image_url)} → {os.path.basename(new_path)}")
                product['image_url'] = new_path
                fixed += 1
                break
        else:
            # L'image n'existe pas, utiliser placeholder
            product['image_url'] = '/placeholder-image.svg'
            print(f"⚠ {product['name'][:50]} → placeholder (image manquante)")
            fixed += 1

print()
print(f"✓ {fixed} produits corrigés")

with open('lib/data/products-ultimate.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("💾 JSON sauvegardé")
