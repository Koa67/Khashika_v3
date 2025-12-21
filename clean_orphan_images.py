#!/usr/bin/env python3
"""
Script pour nettoyer les images orphelines (non référencées)
"""
import json
import os
import shutil

def clean_orphan_images():
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"
    backup_dir = os.path.join(images_dir, 'backups')
    
    # Charger les données
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Lister toutes les images référencées
    referenced_images = set()
    
    for product in data['products']:
        # Image principale
        if product.get('image'):
            img = product['image']
            if img.startswith('/images/products/'):
                ref_path = img.replace('/images/products/', '')
                referenced_images.add(ref_path)
        
        # Images dans l'array
        if 'images' in product and isinstance(product['images'], list):
            for img in product['images']:
                if img.startswith('/images/products/'):
                    ref_path = img.replace('/images/products/', '')
                    referenced_images.add(ref_path)
    
    print(f"📸 Images référencées: {len(referenced_images)}")
    
    # Trouver toutes les images dans le filesystem
    all_images = set()
    for root, dirs, files in os.walk(images_dir):
        # Ignorer le dossier backups
        if 'backups' in root:
            continue
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                rel_path = os.path.join(root, file).replace(images_dir, '').lstrip('/')
                all_images.add(rel_path)
    
    print(f"📁 Images totales dans filesystem: {len(all_images)}")
    
    # Identifier les images orphelines
    orphan_images = all_images - referenced_images
    print(f"🗑️  Images orphelines: {len(orphan_images)}")
    
    if not orphan_images:
        print("✅ Aucune image orpheline à nettoyer!")
        return 0
    
    # Déplacer vers backup
    os.makedirs(backup_dir, exist_ok=True)
    moved = 0
    errors = 0
    
    for img in orphan_images:
        src = os.path.join(images_dir, img)
        dst = os.path.join(backup_dir, img)
        
        try:
            # Créer le dossier de destination si nécessaire
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.move(src, dst)
            moved += 1
        except Exception as e:
            print(f"⚠️  Erreur avec {img}: {e}")
            errors += 1
    
    print(f"\n📊 RÉSULTATS:")
    print(f"   Images déplacées: {moved}")
    if errors > 0:
        print(f"   Erreurs: {errors}")
    
    return moved

if __name__ == "__main__":
    print("=" * 70)
    print("🧹 NETTOYAGE DES IMAGES ORPHELINES")
    print("=" * 70)
    moved = clean_orphan_images()
    print("=" * 70)
    if moved > 0:
        print(f"✅ {moved} images orphelines déplacées vers {backup_dir}")
    else:
        print("✅ Aucune image orpheline trouvée!")




















