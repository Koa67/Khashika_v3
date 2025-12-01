#!/usr/bin/env python3
"""
Script de renommage massif : Scanner tous les fichiers images et les attribuer aux produits.
Renomme toutes les images en p-{index}.jpg et les met à la racine du dossier products.
"""

import os
import shutil
import json
from pathlib import Path
from typing import List

# Chemins
PROJECT_ROOT = Path(__file__).parent.parent
PRODUCTS_JSON = PROJECT_ROOT / 'lib' / 'data' / 'products-ultimate.json'
IMAGES_DIR = PROJECT_ROOT / 'public' / 'images' / 'products'
BACKUP_JSON = PROJECT_ROOT / 'lib' / 'data' / 'products-ultimate.json.backup_before_flatten'

def scan_all_images() -> List[Path]:
    """
    Scanner le dossier public/images/products/ (y compris sous-dossiers).
    Récupérer TOUS les fichiers images trouvés (.jpg, .jpeg, .png).
    """
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    all_images = []
    
    if not IMAGES_DIR.exists():
        return all_images
    
    # Scanner récursivement
    for root, dirs, files in os.walk(IMAGES_DIR):
        # Ignorer les dossiers de backup
        if 'backup' in root.lower():
            continue
        
        for file in files:
            file_path = Path(root) / file
            if file_path.suffix.lower() in image_extensions:
                all_images.append(file_path)
    
    # Trier par nom pour avoir un ordre cohérent
    all_images.sort(key=lambda p: str(p))
    
    return all_images

def get_image_extension(file_path: Path) -> str:
    """Retourne l'extension du fichier ou .jpg par défaut."""
    ext = file_path.suffix.lower()
    if ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        return ext
    return '.jpg'

def flatten_images():
    """Aplatit toutes les images en p-{index}.jpg et met à jour le JSON."""
    print("=" * 70)
    print("📁 RENOMMAGE MASSIF DES IMAGES (MODE FLAT)")
    print("=" * 70)
    print()
    
    # Vérifier que le JSON existe
    if not PRODUCTS_JSON.exists():
        print(f"❌ Fichier introuvable: {PRODUCTS_JSON}")
        return False
    
    # Créer un backup du JSON
    print("📦 Création du backup du JSON...")
    if BACKUP_JSON.exists():
        print(f"   ⚠️  Backup existant trouvé: {BACKUP_JSON}")
    else:
        shutil.copy2(PRODUCTS_JSON, BACKUP_JSON)
        print(f"   ✅ Backup créé: {BACKUP_JSON}")
    print()
    
    # Charger le JSON
    print("📂 Chargement de products-ultimate.json...")
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data if isinstance(data, list) else data.get('products', [])
    print(f"   ✅ {len(products)} produits chargés")
    print()
    
    # Scanner TOUS les fichiers images
    print("🔍 Scan de tous les fichiers images...")
    all_images = scan_all_images()
    print(f"   ✅ {len(all_images)} images trouvées dans {IMAGES_DIR}")
    print()
    
    if len(all_images) == 0:
        print("   ⚠️  Aucune image trouvée ! Vérifiez le dossier public/images/products/")
        return False
    
    # Créer le dossier images s'il n'existe pas
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Traiter chaque produit
    print("🔄 Attribution et renommage des images...")
    print("-" * 70)
    
    updated_count = 0
    not_found_count = 0
    moved_count = 0
    
    for i, product in enumerate(products):
        product_id = product.get('id', f'prod-{i}')
        product_name = product.get('name', 'Sans nom')[:50]
        
        # Attribuer l'image trouvée n° i
        if i < len(all_images):
            source_file = all_images[i]
            
            # Nouveau chemin : p-{i}.jpg (ou extension originale)
            ext = get_image_extension(source_file)
            new_filename = f"p-{i}{ext}"
            new_path = IMAGES_DIR / new_filename
            new_json_path = f"/images/products/{new_filename}"
            
            # Déplacer et Renommer le fichier
            if source_file != new_path:
                try:
                    # Si le fichier de destination existe déjà, le supprimer
                    if new_path.exists():
                        new_path.unlink()
                    
                    # Déplacer le fichier
                    shutil.move(str(source_file), str(new_path))
                    moved_count += 1
                    print(f"   ✅ [{i}] {product_name}")
                    print(f"      {source_file.name} → {new_filename}")
                except Exception as e:
                    print(f"   ❌ [{i}] Erreur déplacement: {e}")
                    new_json_path = '/placeholder-image.svg'
            else:
                # Le fichier est déjà au bon endroit avec le bon nom
                print(f"   ✅ [{i}] {product_name} (déjà à la racine)")
                print(f"      {new_filename}")
            
            # Mettre à jour le JSON
            product['image'] = new_json_path
            product['image_url'] = new_json_path
            if 'images' in product and isinstance(product['images'], list) and len(product['images']) > 0:
                product['images'][0] = new_json_path
            updated_count += 1
        else:
            # Pas assez d'images, mettre le placeholder
            print(f"   ⚠️  [{i}] {product_name} - Pas d'image disponible")
            print(f"      → Placeholder utilisé")
            
            product['image'] = '/placeholder-image.svg'
            product['image_url'] = '/placeholder-image.svg'
            if 'images' in product and isinstance(product['images'], list):
                product['images'] = ['/placeholder-image.svg']
            not_found_count += 1
    
    print()
    print("-" * 70)
    
    # Sauvegarder le JSON mis à jour
    print("💾 Sauvegarde du JSON mis à jour...")
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    print(f"   ✅ JSON sauvegardé: {PRODUCTS_JSON}")
    print()
    
    # Nettoyage : Supprimer les anciens sous-dossiers vides
    print("🧹 Suppression des sous-dossiers vides...")
    removed_dirs = 0
    if IMAGES_DIR.exists():
        # Parcourir de bas en haut pour supprimer les dossiers vides
        for root, dirs, files in os.walk(IMAGES_DIR, topdown=False):
            # Ignorer les dossiers de backup
            if 'backup' in root.lower():
                continue
            
            dir_path = Path(root)
            if dir_path != IMAGES_DIR:
                try:
                    # Vérifier si le dossier est vide
                    if not any(dir_path.iterdir()):
                        dir_path.rmdir()
                        removed_dirs += 1
                        print(f"   ✅ Dossier vide supprimé: {dir_path.relative_to(IMAGES_DIR)}")
                except Exception as e:
                    print(f"   ⚠️  Impossible de supprimer {dir_path.name}: {e}")
    print()
    
    # Résumé
    print("=" * 70)
    print("✅ RENOMMAGE MASSIF TERMINÉ")
    print("=" * 70)
    print(f"   📦 Produits traités: {len(products)}")
    print(f"   📸 Images trouvées: {len(all_images)}")
    print(f"   ✅ Images déplacées/renommées: {moved_count}")
    print(f"   ✅ Produits mis à jour: {updated_count}")
    print(f"   ⚠️  Produits sans image (placeholder): {not_found_count}")
    print(f"   🗑️  Dossiers supprimés: {removed_dirs}")
    print(f"   💾 Backup JSON: {BACKUP_JSON}")
    print("=" * 70)
    print()
    print("📝 PROCHAINES ÉTAPES:")
    print("   1. Exécuter: rm -rf .next")
    print("   2. Relancer: npm run dev")
    print()
    
    return True

if __name__ == '__main__':
    try:
        flatten_images()
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)
