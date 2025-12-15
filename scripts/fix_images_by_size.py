#!/usr/bin/env python3
"""
Script de correction des images basé sur la taille.
Les vraies photos de bijoux font > 10KB.
Les icônes/logos font < 5KB.
"""

import json
from pathlib import Path

JSON_PATH = Path('lib/data/products-ultimate.json')
IMAGES_DIR = Path('public/images/products')
MIN_VALID_SIZE = 5000  # 5KB minimum pour une vraie image

def get_image_size(image_path: str) -> int:
    """Retourne la taille de l'image en bytes."""
    if not image_path:
        return 0
    
    # Construire le chemin complet
    if image_path.startswith('/'):
        full_path = Path('public') / image_path.lstrip('/')
    else:
        full_path = Path('public') / image_path
    
    if full_path.exists():
        return full_path.stat().st_size
    return 0

def find_best_images(product_dir: Path) -> list:
    """Trouve les meilleures images dans un dossier produit (triées par taille)."""
    images = []
    
    for ext in ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.webp']:
        for img in product_dir.glob(ext):
            size = img.stat().st_size
            if size >= MIN_VALID_SIZE:
                images.append((img, size))
    
    # Trier par taille décroissante (les plus grandes images sont probablement les meilleures)
    images.sort(key=lambda x: x[1], reverse=True)
    
    return images

def fix_product_images():
    """Corrige les images des produits en utilisant la taille comme critère."""
    print("=" * 70)
    print("🔧 CORRECTION DES IMAGES BASÉE SUR LA TAILLE")
    print("=" * 70)
    print(f"   Taille minimum pour une vraie image: {MIN_VALID_SIZE} bytes (5KB)")
    print("")
    
    # Charger le JSON
    print("📂 Chargement du JSON...")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', data) if isinstance(data, dict) else data
    print(f"   ✅ {len(products)} produits chargés")
    
    # Statistiques
    products_fixed = 0
    products_no_valid_image = 0
    small_images_removed = 0
    
    print("\n🔍 Analyse et correction des images...")
    
    for product in products:
        if not isinstance(product, dict):
            continue
        
        # Obtenir le chemin de l'image actuelle
        current_image = product.get('image', '') or product.get('image_url', '')
        
        if not current_image or '/images/products/' not in current_image:
            continue
        
        # Extraire le nom du dossier produit
        # Format: /images/products/nom-du-produit/image-1.jpg
        path_parts = current_image.replace('/images/products/', '').split('/')
        
        if len(path_parts) < 2:
            continue
        
        product_slug = path_parts[0]
        product_dir = IMAGES_DIR / product_slug
        
        if not product_dir.exists():
            continue
        
        # Trouver les meilleures images dans le dossier
        best_images = find_best_images(product_dir)
        
        if not best_images:
            # Aucune image valide trouvée
            product['image'] = '/placeholder-image.svg'
            product['image_url'] = '/placeholder-image.svg'
            product['images'] = ['/placeholder-image.svg']
            products_no_valid_image += 1
            print(f"   ⚠️  Pas d'image valide: {product.get('name', 'N/A')[:40]}")
            continue
        
        # Construire les nouveaux chemins d'images
        new_images = []
        for img, size in best_images:
            relative_path = f"/images/products/{product_slug}/{img.name}"
            new_images.append(relative_path)
        
        # Vérifier si l'image actuelle est trop petite
        current_size = get_image_size(current_image)
        
        if current_size < MIN_VALID_SIZE:
            # L'image principale est trop petite, la remplacer
            new_main_image = new_images[0]
            print(f"   ✅ Corrigé: {product.get('name', 'N/A')[:40]}")
            print(f"      Ancienne: {current_image.split('/')[-1]} ({current_size} bytes)")
            print(f"      Nouvelle: {new_main_image.split('/')[-1]} ({best_images[0][1]} bytes)")
            
            product['image'] = new_main_image
            product['image_url'] = new_main_image
            products_fixed += 1
        
        # Mettre à jour le tableau d'images avec uniquement les images valides
        old_images_count = len(product.get('images', []))
        product['images'] = new_images
        small_images_removed += old_images_count - len(new_images)
    
    # Sauvegarder
    print("\n💾 Sauvegarde...")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("   ✅ JSON sauvegardé")
    
    # Rapport
    print("\n" + "=" * 70)
    print("✅ CORRECTION TERMINÉE")
    print("=" * 70)
    print(f"   📊 Produits traités: {len(products)}")
    print(f"   ✅ Produits corrigés: {products_fixed}")
    print(f"   ⚠️  Produits sans image valide: {products_no_valid_image}")
    print(f"   🗑️  Petites images supprimées des arrays: {small_images_removed}")
    print("=" * 70)

if __name__ == '__main__':
    fix_product_images()



















