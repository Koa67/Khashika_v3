#!/usr/bin/env python3
"""
Script pour nettoyer les anciennes images parasites après le scraping du shop grid.
Supprime les images qui ne sont plus référencées dans le JSON.
"""

import json
from pathlib import Path

ULTIMATE_JSON = Path("lib/data/products-ultimate.json")
IMAGES_DIR = Path("public/images/products")
MIN_VALID_SIZE = 5000  # 5KB minimum

def clean_old_images():
    """Nettoie les anciennes images parasites."""
    print("=" * 70)
    print("🧹 NETTOYAGE DES ANCIENNES IMAGES PARASITES")
    print("=" * 70)
    
    # Charger le JSON pour connaître les images valides
    print("\n📂 Chargement du JSON...")
    with open(ULTIMATE_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', data) if isinstance(data, dict) else data
    print(f"   ✅ {len(products)} produits chargés")
    
    # Collecter toutes les images valides référencées
    valid_images = set()
    for product in products:
        if not isinstance(product, dict):
            continue
        
        # Image principale
        img = product.get('image') or product.get('image_url')
        if img and img.startswith('/images/products/'):
            valid_images.add(img.replace('/images/products/', ''))
        
        # Images de la galerie
        for img in product.get('images', []):
            if img and img.startswith('/images/products/'):
                valid_images.add(img.replace('/images/products/', ''))
    
    print(f"   ✅ {len(valid_images)} images valides référencées")
    
    # Parcourir tous les dossiers produits
    print("\n🔍 Scan des dossiers produits...")
    deleted_count = 0
    kept_count = 0
    total_size_freed = 0
    
    if not IMAGES_DIR.exists():
        print(f"   ⚠️  Dossier introuvable: {IMAGES_DIR}")
        return
    
    for product_dir in IMAGES_DIR.iterdir():
        if not product_dir.is_dir():
            continue
        
        product_slug = product_dir.name
        
        # Parcourir toutes les images du dossier
        for img_file in product_dir.glob('*.jpg'):
            img_path = f"{product_slug}/{img_file.name}"
            
            # Vérifier si l'image est référencée
            if img_path in valid_images:
                # Vérifier aussi la taille (garder seulement les vraies images)
                size = img_file.stat().st_size
                if size >= MIN_VALID_SIZE:
                    kept_count += 1
                    continue
            
            # Supprimer l'image (non référencée ou trop petite)
            size = img_file.stat().st_size
            total_size_freed += size
            img_file.unlink()
            deleted_count += 1
            print(f"   🗑️  Supprimé: {img_path} ({size} bytes)")
        
        # Supprimer aussi les autres formats
        for ext in ['*.jpeg', '*.png', '*.gif', '*.webp']:
            for img_file in product_dir.glob(ext):
                img_path = f"{product_slug}/{img_file.name}"
                if img_path not in valid_images:
                    size = img_file.stat().st_size
                    total_size_freed += size
                    img_file.unlink()
                    deleted_count += 1
        
        # Supprimer le dossier s'il est vide
        try:
            if not any(product_dir.iterdir()):
                product_dir.rmdir()
                print(f"   🗑️  Dossier vide supprimé: {product_slug}/")
        except:
            pass
    
    # Rapport
    print("\n" + "=" * 70)
    print("✅ NETTOYAGE TERMINÉ")
    print("=" * 70)
    print(f"   🗑️  Images supprimées: {deleted_count}")
    print(f"   ✅ Images conservées: {kept_count}")
    print(f"   💾 Espace libéré: {total_size_freed / 1024 / 1024:.2f} MB")
    print("=" * 70)

if __name__ == '__main__':
    clean_old_images()



















