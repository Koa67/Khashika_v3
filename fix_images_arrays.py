#!/usr/bin/env python3
"""
Script pour corriger les arrays 'images' en supprimant les références invalides
"""
import json
import os
import shutil

def fix_images_arrays():
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"
    backup_dir = os.path.join(images_dir, 'backups')
    
    # Créer un backup du JSON avant modification
    backup_json = json_path.replace('.json', '_before_array_fix.json')
    shutil.copy(json_path, backup_json)
    print(f"✅ Backup JSON créé: {backup_json}")
    
    # Charger les données
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Lister toutes les images existantes dans le filesystem
    existing_images = set()
    for root, dirs, files in os.walk(images_dir):
        # Ignorer le dossier backups
        if 'backups' in root:
            continue
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                full_path = os.path.join(root, file)
                rel_path = full_path.replace(images_dir, '').lstrip('/')
                # Normaliser le chemin
                normalized_path = f"/images/products/{rel_path}"
                existing_images.add(normalized_path)
    
    print(f"📸 Images existantes dans filesystem: {len(existing_images)}")
    
    # Statistiques avant correction
    total_images_before = 0
    valid_images_before = 0
    
    # Corriger les arrays
    fixed_products = 0
    removed_images = 0
    kept_images = 0
    
    for product in data['products']:
        if 'images' in product and isinstance(product['images'], list):
            original_images = product['images']
            total_images_before += len(original_images)
            
            new_images = []
            
            for img in original_images:
                # Garder les images externes (http/https)
                if img.startswith(('http://', 'https://')):
                    new_images.append(img)
                    kept_images += 1
                # Garder les images qui existent
                elif img in existing_images:
                    new_images.append(img)
                    valid_images_before += 1
                    kept_images += 1
                # Supprimer les références invalides
                else:
                    removed_images += 1
            
            # Si le produit a une image principale, l'ajouter en premier si elle n'est pas déjà dans l'array
            if product.get('image') and product['image'].startswith('/images/products/'):
                main_image = product['image']
                if main_image not in new_images:
                    new_images.insert(0, main_image)
                    kept_images += 1
            
            # Si l'array est vide après nettoyage, utiliser l'image principale ou un placeholder
            if not new_images:
                if product.get('image'):
                    new_images = [product['image']]
                else:
                    new_images = ["/placeholder-image.svg"]
            
            # Mettre à jour l'array
            product['images'] = new_images
            
            if len(original_images) != len(new_images):
                fixed_products += 1
    
    # Sauvegarder les modifications
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print(f"\n📊 RÉSULTATS:")
    print(f"   Produits corrigés: {fixed_products}/{len(data['products'])}")
    print(f"   Images dans arrays avant: {total_images_before}")
    print(f"   Images valides avant: {valid_images_before}")
    print(f"   Images supprimées: {removed_images}")
    print(f"   Images conservées: {kept_images}")
    
    return {
        'fixed_products': fixed_products,
        'removed_images': removed_images,
        'kept_images': kept_images,
        'total_before': total_images_before
    }

if __name__ == "__main__":
    print("=" * 70)
    print("🔧 CORRECTION DES ARRAYS D'IMAGES")
    print("=" * 70)
    result = fix_images_arrays()
    print("=" * 70)
    print("✅ Correction terminée!")


