#!/usr/bin/env python3
"""
Script de diagnostic rapide pour vérifier les images des produits.
Compare les chemins dans products-ultimate.json avec les fichiers réels.
"""

import json
import os
from pathlib import Path

# Chemins
PROJECT_ROOT = Path(__file__).parent.parent
PRODUCTS_JSON = PROJECT_ROOT / 'lib' / 'data' / 'products-ultimate.json'
IMAGES_DIR = PROJECT_ROOT / 'public' / 'images' / 'products'

def main():
    print("=" * 60)
    print("🔍 DIAGNOSTIC DES IMAGES - KHASHIKA")
    print("=" * 60)
    print()
    
    # 1. Lister les 10 premiers fichiers dans public/images/products/
    print("📁 FICHIERS PRÉSENTS DANS public/images/products/ (10 premiers) :")
    print("-" * 60)
    if IMAGES_DIR.exists():
        image_files = sorted([f.name for f in IMAGES_DIR.iterdir() if f.is_file()])[:10]
        for i, filename in enumerate(image_files, 1):
            print(f"  {i}. {filename}")
        print(f"\n  Total de fichiers dans le dossier : {len(list(IMAGES_DIR.iterdir()))}")
    else:
        print("  ❌ Le dossier n'existe pas !")
    print()
    
    # 2. Lire products-ultimate.json et extraire les 10 premières images
    print("📦 IMAGES RÉFÉRENCÉES DANS products-ultimate.json (10 premiers produits) :")
    print("-" * 60)
    if PRODUCTS_JSON.exists():
        with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        products = data if isinstance(data, list) else data.get('products', [])
        
        for i, product in enumerate(products[:10], 1):
            product_id = product.get('id', 'N/A')
            product_name = product.get('name', 'N/A')[:50]  # Limiter à 50 caractères
            
            # Extraire les chemins d'images
            image_paths = []
            if product.get('image'):
                image_paths.append(product['image'])
            if product.get('image_url'):
                image_paths.append(product['image_url'])
            if product.get('images') and isinstance(product['images'], list):
                image_paths.extend(product['images'][:2])  # Max 2 images du tableau
            
            # Nettoyer et afficher
            main_image = image_paths[0] if image_paths else 'AUCUNE IMAGE'
            
            # Extraire le nom de fichier
            if main_image:
                if '/' in main_image:
                    filename = main_image.split('/')[-1]
                else:
                    filename = main_image
            else:
                filename = 'AUCUNE IMAGE'
            
            print(f"  {i}. Produit: {product_name}")
            print(f"     ID: {product_id}")
            print(f"     Chemin brut: {main_image}")
            print(f"     Nom fichier extrait: {filename}")
            
            # Vérifier si le fichier existe
            if filename and filename != 'AUCUNE IMAGE':
                file_exists = (IMAGES_DIR / filename).exists()
                status = "✅ EXISTE" if file_exists else "❌ MANQUANT"
                print(f"     Statut: {status}")
            print()
    else:
        print("  ❌ Le fichier products-ultimate.json n'existe pas !")
    print()
    
    # 3. Comparaison
    print("=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    print("Vérifiez ci-dessus si les noms de fichiers correspondent.")
    print("Si les chemins dans le JSON ne correspondent pas aux fichiers,")
    print("il faudra corriger les chemins dans products-ultimate.json.")
    print()

if __name__ == '__main__':
    main()





