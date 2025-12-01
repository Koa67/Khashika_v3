#!/usr/bin/env python3
"""
Script d'analyse des correspondances produits-images.

Ce script :
1. Charge products-ultimate.json
2. Liste toutes les images disponibles dans public/images/products/
3. Analyse les correspondances entre produits et images
4. Identifie les incohérences (images manquantes, dupliquées, orphelines)
5. Génère un rapport JSON structuré
"""

import json
import os
from pathlib import Path
from collections import Counter, defaultdict
from typing import Dict, List, Optional

# Chemins
DATA_PATH = Path('lib/data/products-ultimate.json')
IMAGES_DIR = Path('public/images/products')
OUTPUT_PATH = Path('reports/product_image_analysis.json')

def load_products():
    """Charge les produits depuis products-ultimate.json."""
    print("📂 Chargement des produits...")
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    products = data.get('products', data) if isinstance(data, dict) else data
    print(f"   ✅ {len(products)} produits chargés")
    return products

def scan_images_directory():
    """Scanne le répertoire des images et retourne un mapping slug -> fichiers."""
    print("\n📂 Scan du répertoire des images...")
    
    image_map = defaultdict(list)
    all_images = []
    
    if not IMAGES_DIR.exists():
        print(f"   ⚠️  Répertoire {IMAGES_DIR} introuvable")
        return image_map, all_images
    
    # Parcourir tous les sous-dossiers (un par slug de produit)
    for product_dir in IMAGES_DIR.iterdir():
        if not product_dir.is_dir():
            continue
        
        slug = product_dir.name
        images_in_dir = []
        
        # Lister tous les fichiers image dans ce dossier
        for img_file in product_dir.iterdir():
            if img_file.is_file() and img_file.suffix.lower() in ['.jpg', '.jpeg', '.png']:
                # Chemin relatif depuis public/
                rel_path = f"/images/products/{slug}/{img_file.name}"
                images_in_dir.append({
                    "filename": img_file.name,
                    "path": str(rel_path),
                    "size": img_file.stat().st_size,
                    "exists": True
                })
                all_images.append(rel_path)
        
        if images_in_dir:
            image_map[slug] = sorted(images_in_dir, key=lambda x: x['filename'])
    
    print(f"   ✅ {len(image_map)} dossiers produits trouvés")
    print(f"   ✅ {len(all_images)} images totales")
    return image_map, all_images

def analyze_product_images(products, image_map):
    """Analyse les correspondances entre produits et images."""
    print("\n🔍 Analyse des correspondances produits-images...")
    
    analysis = {
        "products": [],
        "images": [],
        "statistics": {
            "total_products": len(products),
            "products_with_images": 0,
            "products_without_images": 0,
            "images_referenced": 0,
            "images_missing": 0,
            "images_orphaned": 0,
            "duplicate_images": []
        }
    }
    
    # Compteur d'utilisation des images
    image_usage = Counter()
    
    # Analyser chaque produit
    for product in products:
        if not isinstance(product, dict):
            continue
        
        product_id = product.get('id', '')
        slug = product.get('slug', '')
        name = product.get('name') or product.get('title', 'N/A')
        current_image = product.get('image', '') or product.get('image_url', '')
        source_url = product.get('source_url', '')
        
        # Images référencées dans le JSON
        referenced_images = []
        if 'images' in product and isinstance(product['images'], list):
            referenced_images = [img for img in product['images'] if isinstance(img, str) and img.strip()]
        if current_image and current_image not in referenced_images:
            referenced_images.insert(0, current_image)
        
        # Images disponibles dans le dossier
        available_images = image_map.get(slug, [])
        available_paths = [img['path'] for img in available_images]
        
        # Vérifier quelles images référencées existent réellement
        existing_images = []
        missing_images = []
        
        for ref_img in referenced_images:
            # Normaliser le chemin (enlever le préfixe /images/products/ si présent)
            if ref_img.startswith('/images/products/'):
                ref_img_clean = ref_img
            elif ref_img.startswith('images/products/'):
                ref_img_clean = '/' + ref_img
            else:
                ref_img_clean = f"/images/products/{slug}/{Path(ref_img).name}"
            
            # Vérifier si l'image existe
            if ref_img_clean in available_paths:
                existing_images.append(ref_img_clean)
                image_usage[ref_img_clean] += 1
            else:
                missing_images.append(ref_img_clean)
        
        # Images orphelines (dans le dossier mais non référencées)
        orphaned_images = [img['path'] for img in available_images if img['path'] not in referenced_images]
        
        # Déterminer l'image correcte (première image disponible ou placeholder)
        correct_image = existing_images[0] if existing_images else (available_paths[0] if available_paths else '/placeholder-image.svg')
        
        product_analysis = {
            "id": product_id,
            "name": name,
            "slug": slug,
            "current_image": current_image,
            "correct_image": correct_image,
            "image_url": source_url,
            "referenced_images_count": len(referenced_images),
            "existing_images_count": len(existing_images),
            "missing_images_count": len(missing_images),
            "orphaned_images_count": len(orphaned_images),
            "needs_fix": len(missing_images) > 0 or (len(existing_images) == 0 and len(available_images) > 0)
        }
        
        analysis["products"].append(product_analysis)
        
        # Statistiques
        if existing_images:
            analysis["statistics"]["products_with_images"] += 1
        else:
            analysis["statistics"]["products_without_images"] += 1
        
        analysis["statistics"]["images_referenced"] += len(referenced_images)
        analysis["statistics"]["images_missing"] += len(missing_images)
        analysis["statistics"]["images_orphaned"] += len(orphaned_images)
    
    # Identifier les images dupliquées (utilisées par plusieurs produits)
    duplicate_threshold = 3
    for img_path, count in image_usage.items():
        if count >= duplicate_threshold:
            analysis["statistics"]["duplicate_images"].append({
                "image": img_path,
                "usage_count": count
            })
    
    # Analyser les images orphelines (dans les dossiers mais non référencées)
    all_referenced = set()
    for product in analysis["products"]:
        # Collecter toutes les images référencées
        for p in products:
            if p.get('slug') == product['slug']:
                if 'images' in p:
                    all_referenced.update(p.get('images', []))
                if p.get('image'):
                    all_referenced.add(p.get('image'))
                if p.get('image_url'):
                    all_referenced.add(p.get('image_url'))
                break
    
    # Lister toutes les images avec leurs métadonnées
    for slug, images in image_map.items():
        for img in images:
            is_orphaned = img['path'] not in all_referenced
            analysis["images"].append({
                "filename": img['filename'],
                "path": img['path'],
                "size": img['size'],
                "product_slug": slug,
                "is_orphaned": is_orphaned,
                "usage_count": image_usage.get(img['path'], 0)
            })
    
    return analysis

def main():
    """Fonction principale."""
    print("=" * 70)
    print("📊 ANALYSE DES CORRESPONDANCES PRODUITS-IMAGES")
    print("=" * 70)
    
    # 1. Charger les produits
    products = load_products()
    
    # 2. Scanner le répertoire des images
    image_map, all_images = scan_images_directory()
    
    # 3. Analyser les correspondances
    analysis = analyze_product_images(products, image_map)
    
    # 4. Afficher les statistiques
    print("\n" + "=" * 70)
    print("📊 STATISTIQUES")
    print("=" * 70)
    stats = analysis["statistics"]
    print(f"   Total produits: {stats['total_products']}")
    print(f"   Produits avec images: {stats['products_with_images']} ({stats['products_with_images']/stats['total_products']*100:.1f}%)")
    print(f"   Produits sans images: {stats['products_without_images']} ({stats['products_without_images']/stats['total_products']*100:.1f}%)")
    print(f"   Images référencées: {stats['images_referenced']}")
    print(f"   Images manquantes: {stats['images_missing']}")
    print(f"   Images orphelines: {stats['images_orphaned']}")
    print(f"   Images dupliquées (>3 produits): {len(stats['duplicate_images'])}")
    
    if stats['duplicate_images']:
        print("\n   Top 10 images les plus dupliquées:")
        for dup in sorted(stats['duplicate_images'], key=lambda x: x['usage_count'], reverse=True)[:10]:
            print(f"      - {dup['image']}: utilisée par {dup['usage_count']} produits")
    
    # 5. Identifier les produits nécessitant une correction
    products_needing_fix = [p for p in analysis["products"] if p["needs_fix"]]
    print(f"\n   Produits nécessitant une correction: {len(products_needing_fix)}")
    
    # 6. Sauvegarder le rapport
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(analysis, f, ensure_ascii=False, indent=2)
    
    print(f"\n✅ Rapport sauvegardé: {OUTPUT_PATH}")
    print(f"   📝 {len(analysis['products'])} produits analysés")
    print(f"   📸 {len(analysis['images'])} images listées")
    
    print("\n" + "=" * 70)
    print("✅ ANALYSE TERMINÉE")
    print("=" * 70)

if __name__ == '__main__':
    main()





