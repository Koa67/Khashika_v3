#!/usr/bin/env python3
"""Corrige les problèmes d'encodage dans les URLs d'images et trouve les fichiers correspondants."""

import json
import os
import re
from pathlib import Path
from urllib.parse import unquote

PRODUCTS_JSON = Path("lib/data/products-ultimate.json")
IMAGES_DIR = Path("public/images/products")

def normalize_for_matching(text: str) -> str:
    """Normalise un texte pour la comparaison (supprime accents, espaces, etc.)."""
    # Décoder URL encoding
    try:
        text = unquote(text)
    except:
        pass
    
    # Minuscules
    text = text.lower()
    # Supprimer accents (approximation)
    text = text.replace('é', 'e').replace('è', 'e').replace('ê', 'e')
    text = text.replace('à', 'a').replace('â', 'a')
    text = text.replace('ù', 'u').replace('û', 'u')
    text = text.replace('ô', 'o')
    # Supprimer espaces et tirets
    text = re.sub(r'[\s\-_]+', '', text)
    return text

def find_matching_image(product_name: str, slug: str) -> str | None:
    """Trouve une image correspondant au produit."""
    if not IMAGES_DIR.exists():
        return None
    
    # Normaliser le nom du produit pour la recherche
    normalized_name = normalize_for_matching(product_name)
    normalized_slug = normalize_for_matching(slug)
    
    # Chercher dans les fichiers
    for file in IMAGES_DIR.iterdir():
        if not file.is_file():
            continue
        
        filename = file.stem  # Sans extension
        normalized_file = normalize_for_matching(filename)
        
        # Vérifier si le fichier correspond
        if normalized_slug in normalized_file or normalized_file in normalized_slug:
            return file.name
        
        # Vérifier par mots-clés communs
        name_words = set(normalized_name.split())
        file_words = set(normalized_file.split())
        if len(name_words & file_words) >= 2:  # Au moins 2 mots en commun
            return file.name
    
    return None

def main():
    """Fonction principale."""
    print("=" * 60)
    print("🔧 CORRECTION DES PROBLÈMES D'ENCODAGE")
    print("=" * 60)
    print()
    
    if not PRODUCTS_JSON.exists():
        print(f"❌ Fichier {PRODUCTS_JSON} introuvable.")
        return
    
    # Charger le JSON
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📂 {len(products)} produits chargés")
    print()
    
    # Créer backup
    backup_path = PRODUCTS_JSON.with_suffix(PRODUCTS_JSON.suffix + ".backup-encoding")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print(f"💾 Backup créé: {backup_path}")
    print()
    
    fixed_count = 0
    missing_count = 0
    
    print("🔍 Recherche des problèmes...")
    print()
    
    for i, product in enumerate(products, 1):
        image_url = product.get('image_url', '')
        name = product.get('name', '')
        slug = product.get('slug', '')
        
        # Vérifier si l'image existe
        if image_url and image_url.startswith('/images/products/'):
            file_path = Path(f"public{image_url}")
            
            if not file_path.exists():
                # Chercher une image correspondante
                matching = find_matching_image(name, slug)
                
                if matching:
                    new_url = f"/images/products/{matching}"
                    product['image_url'] = new_url
                    product['image'] = new_url
                    if 'images' in product and len(product['images']) > 0:
                        product['images'][0] = new_url
                    
                    fixed_count += 1
                    if fixed_count <= 10:
                        print(f"  [{i}] ✓ {name[:40]}... → {matching}")
                else:
                    # Utiliser placeholder
                    product['image_url'] = '/placeholder-image.svg'
                    product['image'] = '/placeholder-image.svg'
                    if 'images' in product and len(product['images']) > 0:
                        product['images'][0] = '/placeholder-image.svg'
                    
                    missing_count += 1
                    if missing_count <= 10:
                        print(f"  [{i}] ⚠ {name[:40]}... → placeholder (image non trouvée)")
    
    # Sauvegarder
    print()
    print("💾 Sauvegarde...")
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Rapport
    print()
    print("=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    print(f"✓ {fixed_count} images corrigées")
    print(f"⚠ {missing_count} images remplacées par placeholder")
    print(f"💾 Backup: {backup_path}")

if __name__ == "__main__":
    main()

