#!/usr/bin/env python3
"""
Script de nettoyage d'images ciblé pour products-ultimate.json
Vérifie l'existence des fichiers images et remplace les manquants par placeholder.
"""

import json
import os
from pathlib import Path
from typing import Dict, List, Any

# Chemins
ROOT_DIR = Path(__file__).parent.parent
JSON_FILE = ROOT_DIR / "lib" / "data" / "products-ultimate.json"
IMAGES_DIR = ROOT_DIR / "public" / "images" / "products"
PLACEHOLDER = "/placeholder-image.svg"

def get_image_extensions() -> List[str]:
    """Retourne les extensions d'images supportées."""
    return ['.jpg', '.jpeg', '.png', '.webp', '.svg']

def find_image_file(base_name: str) -> str | None:
    """
    Cherche un fichier image avec le nom de base donné.
    Essaie différentes extensions.
    """
    for ext in get_image_extensions():
        # Essayer avec l'extension originale
        file_path = IMAGES_DIR / f"{base_name}{ext}"
        if file_path.exists():
            return f"/images/products/{base_name}{ext}"
        
        # Essayer sans extension si base_name en a déjà une
        if '.' in base_name:
            name_without_ext = base_name.rsplit('.', 1)[0]
            file_path = IMAGES_DIR / f"{name_without_ext}{ext}"
            if file_path.exists():
                return f"/images/products/{name_without_ext}{ext}"
    
    return None

def extract_base_name(image_path: str) -> str:
    """Extrait le nom de base du fichier depuis un chemin."""
    # Nettoyer le chemin
    path = image_path.strip()
    
    # Enlever le préfixe /images/products/ si présent
    if path.startswith("/images/products/"):
        path = path.replace("/images/products/", "")
    elif path.startswith("images/products/"):
        path = path.replace("images/products/", "")
    
    # Extraire le nom de fichier
    filename = os.path.basename(path)
    
    # Enlever l'extension pour avoir le nom de base
    base_name = os.path.splitext(filename)[0]
    
    return base_name

def check_and_fix_image(image_path: str) -> str:
    """
    Vérifie si l'image existe, sinon essaie de trouver une alternative.
    Retourne le chemin corrigé ou le placeholder.
    """
    if not image_path or image_path == PLACEHOLDER:
        return PLACEHOLDER
    
    # Nettoyer le chemin
    clean_path = image_path.strip()
    
    # Si c'est déjà le placeholder, retourner tel quel
    if clean_path == PLACEHOLDER or "placeholder" in clean_path.lower():
        return PLACEHOLDER
    
    # Extraire le nom de base
    base_name = extract_base_name(clean_path)
    
    # Vérifier si le fichier existe tel quel
    full_path = IMAGES_DIR / base_name
    if full_path.exists():
        return clean_path
    
    # Chercher avec différentes extensions
    found_path = find_image_file(base_name)
    if found_path:
        return found_path
    
    # Si rien n'est trouvé, retourner le placeholder
    return PLACEHOLDER

def process_product(product: Dict[str, Any]) -> tuple[Dict[str, Any], bool]:
    """
    Traite un produit et corrige ses images.
    Retourne (produit modifié, a_été_modifié).
    """
    modified = False
    original_product = json.dumps(product, sort_keys=True)
    
    # Traiter image principale
    if "image" in product and product["image"]:
        new_image = check_and_fix_image(product["image"])
        if new_image != product["image"]:
            product["image"] = new_image
            modified = True
    
    # Traiter image_url
    if "image_url" in product and product["image_url"]:
        new_image_url = check_and_fix_image(product["image_url"])
        if new_image_url != product["image_url"]:
            product["image_url"] = new_image_url
            modified = True
    
    # Traiter images (tableau)
    if "images" in product and isinstance(product["images"], list):
        new_images = []
        for img in product["images"]:
            new_img = check_and_fix_image(img)
            new_images.append(new_img)
            if new_img != img:
                modified = True
        
        product["images"] = new_images
    
    # Vérifier si le produit a été modifié
    new_product_json = json.dumps(product, sort_keys=True)
    if original_product != new_product_json:
        modified = True
    
    return product, modified

def main():
    """Fonction principale."""
    print("🔍 Vérification et nettoyage des images...")
    print(f"📁 JSON: {JSON_FILE}")
    print(f"🖼️  Images: {IMAGES_DIR}")
    print()
    
    # Vérifier que les chemins existent
    if not JSON_FILE.exists():
        print(f"❌ Erreur: {JSON_FILE} n'existe pas!")
        return 1
    
    if not IMAGES_DIR.exists():
        print(f"❌ Erreur: {IMAGES_DIR} n'existe pas!")
        return 1
    
    # Charger le JSON
    print("📖 Chargement du JSON...")
    with open(JSON_FILE, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"✅ {len(products)} produits chargés")
    print()
    
    # Traiter chaque produit
    modified_count = 0
    placeholder_count = 0
    
    print("🔧 Traitement des produits...")
    for i, product in enumerate(products):
        product, was_modified = process_product(product)
        products[i] = product
        
        if was_modified:
            modified_count += 1
            # Compter les placeholders
            if product.get("image") == PLACEHOLDER or PLACEHOLDER in product.get("images", []):
                placeholder_count += 1
        
        if (i + 1) % 1000 == 0:
            print(f"  Traité {i + 1}/{len(products)} produits...")
    
    print()
    print(f"✅ Traitement terminé:")
    print(f"   - Produits modifiés: {modified_count}")
    print(f"   - Placeholders ajoutés: {placeholder_count}")
    print()
    
    # Sauvegarder le JSON nettoyé
    if modified_count > 0:
        backup_file = JSON_FILE.with_suffix('.json.backup')
        print(f"💾 Création d'un backup: {backup_file}")
        with open(backup_file, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print(f"💾 Sauvegarde du JSON nettoyé: {JSON_FILE}")
        with open(JSON_FILE, 'w', encoding='utf-8') as f:
            json.dump(products, f, ensure_ascii=False, indent=2)
        
        print("✅ JSON nettoyé sauvegardé!")
    else:
        print("ℹ️  Aucune modification nécessaire.")
    
    return 0

if __name__ == "__main__":
    exit(main())



















