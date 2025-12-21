#!/usr/bin/env python3
"""
Script de vérification ultime : Remplace toutes les images manquantes par placeholder.
Vérifie que chaque image_url dans le JSON pointe vers un fichier existant.
"""

import json
import os
import shutil
from pathlib import Path
import re

def is_valid_image_path(image_url):
    """Vérifier si un chemin d'image est valide et pointe vers un fichier existant."""
    if not image_url or image_url == '' or image_url == '/placeholder-image.svg':
        return False
    
    # Extraire le chemin relatif depuis l'URL
    if image_url.startswith('/'):
        # Chemin absolu depuis la racine public
        file_path = Path('public') / image_url.lstrip('/')
    else:
        # Chemin relatif, supposer dans images/products
        file_path = Path('public/images/products') / image_url
    
    # Vérifier si le fichier existe
    return file_path.exists() and file_path.is_file()

def is_valid_format(image_url):
    """Vérifier si le nom de fichier est au format p-{i}.jpg."""
    if not image_url:
        return False
    
    filename = os.path.basename(image_url)
    # Format attendu : p-{nombre}.jpg ou p-{nombre}.jpeg
    pattern = r'^p-\d+\.(jpg|jpeg|png|webp)$'
    return bool(re.match(pattern, filename, re.IGNORECASE))

def main():
    print("🔍 VÉRIFICATION ULTIME : REMPLACEMENT DES IMAGES MANQUANTES")
    print("=" * 70)
    print()
    
    # Chemins
    json_path = Path('lib/data/products-ultimate.json')
    products_dir = Path('public/images/products')
    
    # Backup du JSON
    backup_path = json_path.with_suffix('.json.backup-force-placeholder')
    print(f"📦 Création backup: {backup_path}")
    try:
        shutil.copy2(json_path, backup_path)
    except Exception as e:
        print(f"⚠️ Erreur création backup: {e}")
        print("   → Continuation sans backup (risqué)")
    
    # Charger le JSON
    print(f"📖 Chargement de {json_path}")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except Exception as e:
        print(f"❌ ERREUR CRITIQUE: Impossible de charger le JSON: {e}")
        return
    
    print(f"   → {len(products)} produits trouvés")
    print()
    
    # Statistiques
    fixed_count = 0
    already_valid_count = 0
    invalid_format_count = 0
    missing_file_count = 0
    
    # Traiter chaque produit
    print("🔄 Vérification des images...")
    print()
    
    for i, product in enumerate(products):
        image_url = product.get('image_url') or product.get('image') or (product.get('images') and product.get('images')[0])
        
        # Si pas d'image_url, utiliser placeholder
        if not image_url or image_url == '':
            product['image_url'] = '/placeholder-image.svg'
            product['image'] = '/placeholder-image.svg'
            if 'images' in product:
                product['images'] = ['/placeholder-image.svg']
            fixed_count += 1
            print(f"✓ [{i}] {product.get('name', '')[:50]}")
            print(f"  → Image vide, placeholder appliqué")
            continue
        
        # Vérifier le format
        is_format_valid = is_valid_format(image_url)
        
        # Vérifier l'existence du fichier
        is_file_exists = is_valid_image_path(image_url)
        
        # Décision : remplacer si format invalide OU fichier inexistant
        if not is_format_valid or not is_file_exists:
            # Remplacer par placeholder
            product['image_url'] = '/placeholder-image.svg'
            product['image'] = '/placeholder-image.svg'
            if 'images' in product:
                product['images'] = ['/placeholder-image.svg']
            
            fixed_count += 1
            
            # Logger la raison
            reason = []
            if not is_format_valid:
                reason.append("format invalide")
                invalid_format_count += 1
            if not is_file_exists:
                reason.append("fichier inexistant")
                missing_file_count += 1
            
            print(f"✓ [{i}] {product.get('name', '')[:50]}")
            print(f"  {os.path.basename(image_url)} → placeholder ({', '.join(reason)})")
        else:
            # Image valide, ne rien changer
            already_valid_count += 1
    
    print()
    print("=" * 70)
    print("💾 Sauvegarde du JSON...")
    
    # Sauvegarder le JSON (TOUJOURS, même s'il y a eu des erreurs)
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print("   → JSON sauvegardé avec succès")
    except Exception as e:
        print(f"❌ ERREUR CRITIQUE: Impossible de sauvegarder le JSON: {e}")
        print("   → Les modifications sont perdues !")
        return
    
    print()
    print("=" * 70)
    print("✅ VÉRIFICATION TERMINÉE")
    print()
    print(f"📊 Statistiques:")
    print(f"   • Images corrigées: {fixed_count}")
    print(f"   • Images déjà valides: {already_valid_count}")
    print(f"   • Format invalide: {invalid_format_count}")
    print(f"   • Fichiers inexistants: {missing_file_count}")
    print(f"   • Backup créé: {backup_path}")
    print()
    print("🎯 Résultat attendu : 0 erreur 404, 0 crash")
    print()

if __name__ == '__main__':
    main()



















