#!/usr/bin/env python3
"""
Script pour fusionner les données scrapées depuis le shop grid
avec le fichier products-ultimate.json existant.
"""

import json
from pathlib import Path

SHOP_GRID_JSON = Path("lib/data/products-from-shop-grid.json")
ULTIMATE_JSON = Path("lib/data/products-ultimate.json")
BACKUP_JSON = Path("lib/data/products-ultimate.json.backup_before_merge")

def merge_data():
    """Fusionne les données du shop grid avec products-ultimate.json."""
    print("=" * 70)
    print("🔄 FUSION DES DONNÉES SHOP GRID")
    print("=" * 70)
    
    # Charger les données du shop grid
    print("\n📂 Chargement des données shop grid...")
    if not SHOP_GRID_JSON.exists():
        print(f"   ❌ Fichier introuvable: {SHOP_GRID_JSON}")
        return False
    
    with open(SHOP_GRID_JSON, 'r', encoding='utf-8') as f:
        shop_data = json.load(f)
    
    shop_products = shop_data.get('products', [])
    print(f"   ✅ {len(shop_products)} produits du shop grid")
    
    # Créer un index par slug pour recherche rapide
    shop_index = {}
    for p in shop_products:
        slug = p.get('slug', '')
        if slug:
            shop_index[slug] = p
    
    # Charger products-ultimate.json
    print("\n📂 Chargement de products-ultimate.json...")
    with open(ULTIMATE_JSON, 'r', encoding='utf-8') as f:
        ultimate_data = json.load(f)
    
    ultimate_products = ultimate_data.get('products', ultimate_data) if isinstance(ultimate_data, dict) else ultimate_data
    print(f"   ✅ {len(ultimate_products)} produits existants")
    
    # Créer un backup
    print("\n📦 Création du backup...")
    import shutil
    shutil.copy(ULTIMATE_JSON, BACKUP_JSON)
    print(f"   ✅ Backup: {BACKUP_JSON}")
    
    # Fusionner : remplacer les images des produits existants par celles du shop grid
    print("\n🔄 Fusion des données...")
    updated_count = 0
    new_count = 0
    
    for product in ultimate_products:
        if not isinstance(product, dict):
            continue
        
        slug = product.get('slug', '') or slugify(product.get('name', ''))
        
        # Chercher dans le shop grid
        if slug in shop_index:
            shop_product = shop_index[slug]
            
            # Mettre à jour les images
            if shop_product.get('image'):
                product['image'] = shop_product['image']
                product['image_url'] = shop_product['image_url']
                product['images'] = shop_product.get('images', [shop_product['image']])
                updated_count += 1
                print(f"   ✅ Mis à jour: {product.get('name', 'N/A')[:50]}")
    
    # Ajouter les nouveaux produits du shop grid qui n'existent pas
    existing_slugs = {p.get('slug', '') for p in ultimate_products if isinstance(p, dict)}
    
    for shop_product in shop_products:
        slug = shop_product.get('slug', '')
        if slug and slug not in existing_slugs:
            ultimate_products.append(shop_product)
            new_count += 1
            print(f"   ➕ Nouveau: {shop_product.get('name', 'N/A')[:50]}")
    
    # Sauvegarder
    print("\n💾 Sauvegarde...")
    if isinstance(ultimate_data, dict):
        ultimate_data['products'] = ultimate_products
        output_data = ultimate_data
    else:
        output_data = ultimate_products
    
    with open(ULTIMATE_JSON, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, indent=2, ensure_ascii=False)
    
    print("   ✅ JSON sauvegardé")
    
    # Nettoyer les anciennes images parasites
    print("\n🧹 Nettoyage des anciennes images parasites...")
    try:
        import subprocess
        import sys
        result = subprocess.run(
            [sys.executable, str(Path(__file__).parent / "clean_old_images.py")],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            print(result.stdout)
        else:
            print(f"   ⚠️  Erreur lors du nettoyage: {result.stderr}")
    except Exception as e:
        print(f"   ⚠️  Erreur lors du nettoyage: {e}")
        print("   ℹ️  Vous pouvez lancer manuellement: python3 scripts/clean_old_images.py")
    
    # Rapport
    print("\n" + "=" * 70)
    print("✅ FUSION TERMINÉE")
    print("=" * 70)
    print(f"   📦 Produits existants: {len(ultimate_products)}")
    print(f"   ✅ Produits mis à jour: {updated_count}")
    print(f"   ➕ Nouveaux produits: {new_count}")
    print(f"   💾 Backup: {BACKUP_JSON}")
    print("=" * 70)
    
    return True

def slugify(text: str) -> str:
    """Convertit un texte en slug."""
    import re
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

if __name__ == '__main__':
    merge_data()

