#!/usr/bin/env python3
"""Corrige les URLs d'images mal encodées et les références prod-*.jpg."""

import json
import os
import re
from urllib.parse import unquote, quote
from pathlib import Path

PRODUCTS_JSON = Path("lib/data/products-ultimate.json")
BACKUP_SUFFIX = ".backup-url-fix"

def fix_url_encoding(url: str) -> str:
    """Corrige le double encodage URL (é devient %C3%83%C2%A9 au lieu de %C3%A9)."""
    if not url:
        return url
    
    # Décoder complètement
    try:
        decoded = unquote(unquote(url))  # Double décodage pour corriger
        # Réencoder proprement
        # Séparer le chemin du nom de fichier
        if '/' in decoded:
            parts = decoded.rsplit('/', 1)
            if len(parts) == 2:
                dir_part = parts[0]
                filename = parts[1]
                # Encoder seulement le nom de fichier
                encoded_filename = quote(filename, safe='')
                return f"{dir_part}/{encoded_filename}"
        return quote(decoded, safe='/')
    except Exception:
        return url

def normalize_filename(filename: str) -> str:
    """Normalise un nom de fichier (supprime les caractères spéciaux)."""
    # Décoder d'abord
    try:
        decoded = unquote(filename)
    except:
        decoded = filename
    
    # Remplacer les caractères spéciaux par des tirets
    normalized = re.sub(r'[^a-z0-9\-_\.]', '-', decoded.lower())
    normalized = re.sub(r'-+', '-', normalized)
    normalized = normalized.strip('-')
    
    return normalized

def main():
    """Fonction principale."""
    print("=" * 60)
    print("🔧 CORRECTION DES URLs D'IMAGES")
    print("=" * 60)
    print()
    
    if not PRODUCTS_JSON.exists():
        print(f"❌ Fichier {PRODUCTS_JSON} introuvable.")
        return
    
    # Charger le JSON
    print(f"📂 Chargement de {PRODUCTS_JSON}...")
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"✓ {len(products)} produits chargés")
    print()
    
    # Créer une sauvegarde
    backup_path = PRODUCTS_JSON.with_suffix(PRODUCTS_JSON.suffix + BACKUP_SUFFIX)
    print(f"💾 Création de la sauvegarde: {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print()
    
    # Statistiques
    fixed_encoding = 0
    fixed_prod = 0
    fixed_missing = 0
    
    print("🔧 Correction des URLs...")
    print()
    
    for i, product in enumerate(products, 1):
        image_url = product.get('image_url', '')
        image = product.get('image', '')
        images = product.get('images', [])
        
        # Corriger image_url
        if image_url:
            original_url = image_url
            
            # Corriger le double encodage
            if '%C3%83%C2%A9' in image_url or '%C3%83%C2%A0' in image_url:
                image_url = fix_url_encoding(image_url)
                fixed_encoding += 1
                if fixed_encoding <= 5:
                    print(f"  [{i}] Encodage corrigé: {original_url[:60]}...")
            
            # Corriger les prod-*.jpg
            if '/prod-' in image_url or image_url.endswith('prod-'):
                # Utiliser le slug du produit pour créer un nom de fichier propre
                slug = product.get('slug', '')
                if slug:
                    # Chercher si l'image existe déjà avec un nom basé sur le slug
                    images_dir = Path('public/images/products')
                    if images_dir.exists():
                        # Chercher une image avec un nom similaire
                        possible_names = [
                            f"{slug}.jpg",
                            f"{slug}.jpeg",
                            f"{slug}.png"
                        ]
                        found = False
                        for name in possible_names:
                            if (images_dir / name).exists():
                                image_url = f"/images/products/{name}"
                                fixed_prod += 1
                                found = True
                                if fixed_prod <= 5:
                                    print(f"  [{i}] prod-* remplacé: {name}")
                                break
                        
                        if not found:
                            # Utiliser placeholder
                            image_url = '/placeholder-image.svg'
                            fixed_prod += 1
                            if fixed_prod <= 5:
                                print(f"  [{i}] prod-* → placeholder")
            
            # Vérifier si le fichier existe
            if image_url.startswith('/images/products/'):
                file_path = Path(f"public{image_url}")
                if not file_path.exists():
                    # Essayer de trouver une variante
                    filename = image_url.split('/')[-1]
                    images_dir = Path('public/images/products')
                    if images_dir.exists():
                        # Chercher des variantes (avec/sans encodage)
                        found_variant = None
                        for file in images_dir.iterdir():
                            if file.is_file():
                                # Comparer les noms normalisés
                                if normalize_filename(file.name) == normalize_filename(filename):
                                    found_variant = file.name
                                    break
                        
                        if found_variant:
                            image_url = f"/images/products/{found_variant}"
                            fixed_missing += 1
                            if fixed_missing <= 5:
                                print(f"  [{i}] Variante trouvée: {found_variant}")
                        else:
                            # Utiliser placeholder
                            image_url = '/placeholder-image.svg'
                            fixed_missing += 1
            
            product['image_url'] = image_url
        
        # Corriger image
        if image and image != image_url:
            product['image'] = image_url
        
        # Corriger images array
        if images and len(images) > 0:
            if images[0] != image_url:
                images[0] = image_url
                product['images'] = images
    
    # Sauvegarder
    print()
    print("💾 Sauvegarde du JSON corrigé...")
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Rapport final
    print()
    print("=" * 60)
    print("📊 RÉSUMÉ")
    print("=" * 60)
    print(f"✓ {fixed_encoding} URLs avec encodage corrigé")
    print(f"✓ {fixed_prod} références prod-* corrigées")
    print(f"✓ {fixed_missing} images manquantes corrigées")
    print(f"💾 Backup: {backup_path}")
    print(f"💾 JSON mis à jour: {PRODUCTS_JSON}")

if __name__ == "__main__":
    main()


















