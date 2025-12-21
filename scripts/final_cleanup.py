#!/usr/bin/env python3
"""Nettoyage final des images et correction du dernier produit manquant."""

import os
import json
import glob
import shutil
from pathlib import Path

print("=" * 60)
print("🧹 NETTOYAGE FINAL")
print("=" * 60)
print()

# 1. Charger le JSON
with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"📂 {len(products)} produits chargés")
print()

# 2. Identifier les images utilisées
used_images = set()
for product in products:
    if product.get('image_url'):
        # Extraire le nom de fichier
        filename = product['image_url'].split('/')[-1]
        used_images.add(filename)

print(f"✓ {len(used_images)} images utilisées dans le JSON")
print()

# 3. Lister toutes les images
images_dir = Path('public/images/products')
if not images_dir.exists():
    print("❌ Dossier public/images/products/ introuvable")
    exit(1)

all_images = set()
for item in images_dir.iterdir():
    if item.is_file():
        all_images.add(item.name)

print(f"📁 {len(all_images)} fichiers dans public/images/products/")
print()

# 4. Trouver les images inutilisées
unused_images = all_images - used_images

# Filtrer les dossiers de backup
unused_to_delete = [
    img for img in unused_images 
    if (images_dir / img).is_file()
]

print(f"🗑 {len(unused_to_delete)} fichiers inutilisés à supprimer")
print()

# 5. Supprimer les anciennes images p-*.jpg et autres inutilisées
deleted_count = 0
for img in unused_to_delete:
    img_path = images_dir / img
    try:
        if img.startswith('p-') or img.startswith('backup'):
            img_path.unlink()
            deleted_count += 1
            if deleted_count <= 10:  # Afficher les 10 premiers
                print(f"  🗑 Supprimé : {img}")
    except Exception as e:
        print(f"  ⚠ Erreur sur {img}: {e}")

if deleted_count > 10:
    print(f"  ... et {deleted_count - 10} autres")

print()
print(f"✓ {deleted_count} fichiers supprimés")
print()

# 6. Traiter le produit manquant
print("🔍 Recherche du produit manquant...")
missing_product = None
for product in products:
    if 'système solaire' in product.get('name', '').lower():
        missing_product = product
        break

if missing_product:
    print(f"✓ Trouvé : {missing_product['name']}")
    print(f"  Image actuelle : {missing_product.get('image_url', 'N/A')}")
    
    # Essayer de trouver une image similaire
    possible_images = [
        'bracelet-systeme-solaire-11-planetes.jpg',
        'bracelet-systeme-solaire.jpg',
        'bracelet-planetes.jpg'
    ]
    
    for img in possible_images:
        if (images_dir / img).exists():
            print(f"  ✓ Image trouvée : {img}")
            missing_product['image_url'] = f'/images/products/{img}'
            missing_product['image'] = f'/images/products/{img}'
            if 'images' in missing_product and len(missing_product['images']) > 0:
                missing_product['images'][0] = f'/images/products/{img}'
            break
    else:
        # Si aucune image trouvée, utiliser une image placeholder ou la première image de bracelet
        placeholder = next((img.name for img in images_dir.iterdir() 
                          if img.is_file() and img.name.startswith('bracelet-') and not img.name.startswith('p-')), None)
        if placeholder:
            print(f"  ⚠ Utilisation d'une image placeholder : {placeholder}")
            missing_product['image_url'] = f'/images/products/{placeholder}'
            missing_product['image'] = f'/images/products/{placeholder}'
            if 'images' in missing_product and len(missing_product['images']) > 0:
                missing_product['images'][0] = f'/images/products/{placeholder}'

# 7. Sauvegarder le JSON mis à jour
print()
print("💾 Sauvegarde du JSON mis à jour...")
with open('lib/data/products-ultimate.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("✓ JSON sauvegardé")
print()

# 8. Statistiques finales
remaining_images = len([f for f in images_dir.iterdir() 
                       if f.is_file() 
                       and not f.name.startswith('.')
                       and not f.name.startswith('backup')])

print("=" * 60)
print("📊 STATISTIQUES FINALES")
print("=" * 60)
print(f"✓ {len(products)} produits dans le catalogue")
print(f"✓ {remaining_images} images dans public/images/products/")
print(f"✓ {deleted_count} anciennes images supprimées")
if len(products) > 0:
    print(f"✓ Taux de couverture : {(remaining_images/len(products)*100):.1f}%")
print()
print("=" * 60)
print("✅ NETTOYAGE TERMINÉ !")
print("=" * 60)


















