#!/usr/bin/env python3
"""
Script pour mettre à jour les chemins d'images dans products-ultimate.json
en utilisant la map générée par flatten_images.py.
"""

import json
from pathlib import Path

# Chemins
JSON_PATH = Path('lib/data/products-ultimate.json')
MAPPING_FILE = Path('lib/data/image_path_mapping.json')
BACKUP_JSON = Path('lib/data/products-ultimate.json.backup_before_flatten')

def update_json_paths():
    """Met à jour les chemins d'images dans le JSON."""
    print("=" * 70)
    print("📝 MISE À JOUR DES CHEMINS D'IMAGES DANS LE JSON")
    print("=" * 70)
    
    # Vérifier que le fichier JSON existe
    if not JSON_PATH.exists():
        print(f"❌ Fichier introuvable: {JSON_PATH}")
        return False
    
    # Vérifier que la map existe
    if not MAPPING_FILE.exists():
        print(f"❌ Fichier de mapping introuvable: {MAPPING_FILE}")
        print("   Exécutez d'abord: python3 scripts/flatten_images.py")
        return False
    
    # Charger la map
    print("\n📂 Chargement de la map des chemins...")
    with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
        path_mapping = json.load(f)
    print(f"   ✅ {len(path_mapping)} mappings chargés")
    
    # Créer un backup du JSON
    print("\n📦 Création du backup...")
    import shutil
    shutil.copy(JSON_PATH, BACKUP_JSON)
    print(f"   ✅ Backup créé: {BACKUP_JSON}")
    
    # Charger le JSON
    print("\n📂 Chargement de products-ultimate.json...")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', data) if isinstance(data, dict) else data
    print(f"   ✅ {len(products)} produits chargés")
    
    # Fonction pour mettre à jour un chemin
    def update_path(old_path: str, product_slug: str = '') -> str:
        """Met à jour un chemin d'image en utilisant la map."""
        if not old_path or not isinstance(old_path, str):
            return '/placeholder-image.svg'
        
        # Normaliser le chemin
        normalized = old_path.strip()
        if not normalized:
            return '/placeholder-image.svg'
        
        # Vérifier si le chemin est dans la map
        if normalized in path_mapping:
            return path_mapping[normalized]
        
        # Si le chemin contient un sous-dossier mais n'est pas dans la map,
        # chercher une image alternative du même produit
        if normalized.startswith('/images/products/') and '/' in normalized.replace('/images/products/', ''):
            # Extraire le nom du sous-dossier (slug du produit)
            parts = normalized.replace('/images/products/', '').split('/')
            if len(parts) >= 2:
                # Chercher une image du même produit dans la map
                slug_part = parts[0]
                for old_key, new_value in path_mapping.items():
                    if slug_part in old_key:
                        # Utiliser cette image à la place
                        return new_value
        
        # Si le chemin est déjà plat (pas de sous-dossier), le garder
        if normalized.startswith('/images/products/') and '/' not in normalized.replace('/images/products/', ''):
            # Vérifier si le fichier existe
            from pathlib import Path
            file_path = Path('public') / normalized.lstrip('/')
            if file_path.exists():
                return normalized
        
        # Si aucune correspondance, utiliser placeholder
        return '/placeholder-image.svg'
    
    # Mettre à jour tous les produits
    print("\n🔄 Mise à jour des chemins d'images...")
    updated_count = 0
    total_updates = 0
    
    for product in products:
        if not isinstance(product, dict):
            continue
        
        product_updated = False
        
        # Obtenir le slug du produit pour chercher des images alternatives
        product_slug = product.get('slug', '') or product.get('id', '')
        
        # Mettre à jour image_url
        if 'image_url' in product:
            old_url = product.get('image_url', '')
            new_url = update_path(old_url, product_slug)
            if old_url != new_url:
                product['image_url'] = new_url
                product_updated = True
                total_updates += 1
        
        # Mettre à jour image
        if 'image' in product:
            old_img = product.get('image', '')
            new_img = update_path(old_img, product_slug)
            if old_img != new_img:
                product['image'] = new_img
                product_updated = True
                total_updates += 1
        
        # Mettre à jour images (tableau)
        if 'images' in product and isinstance(product['images'], list):
            new_images = []
            for img in product['images']:
                new_img = update_path(img, product_slug)
                new_images.append(new_img)
                if img != new_img:
                    product_updated = True
                    total_updates += 1
            
            # Filtrer les placeholders en double et garder au moins une image valide
            valid_images = [img for img in new_images if img != '/placeholder-image.svg']
            if valid_images:
                product['images'] = valid_images
            else:
                # Si toutes les images sont des placeholders, garder juste un
                product['images'] = ['/placeholder-image.svg']
        
        if product_updated:
            updated_count += 1
    
    # Sauvegarder le JSON mis à jour
    print("\n💾 Sauvegarde du JSON mis à jour...")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"   ✅ JSON sauvegardé: {JSON_PATH}")
    
    # Résumé
    print("\n" + "=" * 70)
    print("✅ MISE À JOUR TERMINÉE")
    print("=" * 70)
    print(f"   📦 Produits traités: {len(products)}")
    print(f"   ✅ Produits mis à jour: {updated_count}")
    print(f"   🔄 Chemins modifiés: {total_updates}")
    print(f"   💾 Backup: {BACKUP_JSON}")
    print("=" * 70)
    
    return True

if __name__ == '__main__':
    try:
        update_json_paths()
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

