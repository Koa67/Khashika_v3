#!/usr/bin/env python3
"""
Script de nettoyage absolu des noms de fichiers images.
Renomme toutes les images en p-{index}.jpg et met à jour le JSON.
"""

import json
import os
import shutil
from pathlib import Path
from urllib.parse import unquote
import unicodedata
import re

def normalize_slug(text):
    """Normaliser un slug pour correspondance."""
    if not text:
        return ""
    text = unquote(text)
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    text = re.sub(r'-+', '-', text)
    return text

def find_image_file(image_url, products_dir):
    """Trouver le fichier image correspondant à une URL."""
    if not image_url or image_url == '/placeholder-image.svg':
        return None
    
    # Extraire le nom de fichier de l'URL
    filename = os.path.basename(image_url)
    
    # Essayer de décoder l'URL
    try:
        decoded = unquote(filename)
    except:
        decoded = filename
    
    # Chercher le fichier exact
    exact_path = products_dir / filename
    if exact_path.exists():
        return exact_path
    
    decoded_path = products_dir / decoded
    if decoded_path.exists():
        return decoded_path
    
    # Chercher avec différentes extensions
    base_name = os.path.splitext(filename)[0]
    decoded_base = os.path.splitext(decoded)[0]
    
    for ext in ['.jpg', '.jpeg', '.png', '.webp']:
        for base in [base_name, decoded_base]:
            test_path = products_dir / f"{base}{ext}"
            if test_path.exists():
                return test_path
    
    # Recherche floue par nom de produit (si on a le nom du produit)
    return None

def main():
    print("🔧 ASSAINISSEMENT TOTAL DES NOMS DE FICHIERS")
    print("=" * 60)
    print()
    
    # Chemins
    json_path = Path('lib/data/products-ultimate.json')
    products_dir = Path('public/images/products')
    
    # Backup du JSON
    backup_path = json_path.with_suffix('.json.backup-sanitize')
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
    
    # Lister tous les fichiers images existants
    print("🔍 Scan des fichiers images...")
    all_image_files = {}
    try:
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            try:
                for img_path in products_dir.rglob(ext):
                    # Ignorer les fichiers déjà renommés (p-*.jpg)
                    if not img_path.name.startswith('p-'):
                        all_image_files[img_path.name.lower()] = img_path
            except Exception as e:
                print(f"⚠️ Erreur scan extension {ext}: {e}")
                continue
    except Exception as e:
        print(f"⚠️ Erreur scan fichiers images: {e}")
        print("   → Continuation avec liste vide")
    
    print(f"   → {len(all_image_files)} fichiers images trouvés (hors p-*)")
    print()
    
    # Statistiques
    renamed_count = 0
    placeholder_count = 0
    not_found_count = 0
    
    # Traiter chaque produit
    print("🔄 Traitement des produits...")
    print()
    
    for i, product in enumerate(products):
        image_url = product.get('image_url') or product.get('image') or (product.get('images') and product.get('images')[0])
        
        if not image_url or image_url == '/placeholder-image.svg':
            # Pas d'image, utiliser placeholder
            product['image_url'] = '/placeholder-image.svg'
            product['image'] = '/placeholder-image.svg'
            if 'images' in product:
                product['images'] = ['/placeholder-image.svg']
            placeholder_count += 1
            continue
        
        # Extraire le nom de fichier
        filename = os.path.basename(image_url)
        
        # Chercher le fichier
        found_file = None
        
        # 1. Essayer le chemin exact
        if filename:
            for img_name, img_path in all_image_files.items():
                if img_name == filename.lower() or img_name == unquote(filename).lower():
                    found_file = img_path
                    break
        
        # 2. Si pas trouvé, essayer avec le nom du produit
        if not found_file:
            product_name = product.get('name', '')
            normalized_name = normalize_slug(product_name)
            if normalized_name:
                for img_name, img_path in all_image_files.items():
                    img_base = os.path.splitext(img_name)[0]
                    if normalized_name in img_base or img_base in normalized_name:
                        found_file = img_path
                        break
        
        # 3. Si trouvé, renommer
        if found_file:
            new_name = f"p-{i}.jpg"
            new_path = products_dir / new_name
            
            try:
                # Si le fichier de destination existe déjà et c'est un autre fichier, le supprimer
                if new_path.exists() and new_path != found_file:
                    try:
                        new_path.unlink()
                    except Exception as e:
                        print(f"⚠️ [{i}] Erreur suppression {new_name}: {e}")
                
                # Renommer
                if found_file != new_path:
                    try:
                        # Vérifier que le fichier source existe toujours
                        if not found_file.exists():
                            raise FileNotFoundError(f"Fichier source introuvable: {found_file}")
                        
                        shutil.move(str(found_file), str(new_path))
                        renamed_count += 1
                        print(f"✓ [{i}] {product.get('name', '')[:50]}")
                        print(f"  {found_file.name} → {new_name}")
                        
                        # Mettre à jour le JSON seulement si le déplacement a réussi
                        product['image_url'] = f"/images/products/{new_name}"
                        product['image'] = f"/images/products/{new_name}"
                        if 'images' in product:
                            product['images'] = [f"/images/products/{new_name}"]
                    except Exception as e:
                        print(f"⚠️ [{i}] Erreur déplacement {found_file.name}: {e}")
                        # IMPORTANT : Basculer sur placeholder en cas d'erreur
                        product['image_url'] = ''
                        product['image'] = ''
                        if 'images' in product:
                            product['images'] = ['']
                        not_found_count += 1
                else:
                    # Fichier déjà au bon nom, juste mettre à jour le JSON
                    product['image_url'] = f"/images/products/{new_name}"
                    product['image'] = f"/images/products/{new_name}"
                    if 'images' in product:
                        product['images'] = [f"/images/products/{new_name}"]
            except Exception as e:
                print(f"⚠️ [{i}] Erreur générale traitement: {e}")
                # Basculer sur placeholder
                product['image_url'] = ''
                product['image'] = ''
                if 'images' in product:
                    product['images'] = ['']
                not_found_count += 1
        else:
            # Fichier non trouvé, utiliser placeholder
            product['image_url'] = ''
            product['image'] = ''
            if 'images' in product:
                product['images'] = ['']
            not_found_count += 1
            print(f"⚠ [{i}] {product.get('name', '')[:50]} → placeholder (image non trouvée)")
    
    print()
    print("=" * 60)
    print("🧹 NETTOYAGE : Suppression des fichiers non-renommés...")
    
    # Supprimer tous les fichiers qui ne commencent pas par p-
    deleted_count = 0
    try:
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            try:
                for img_path in products_dir.rglob(ext):
                    if not img_path.name.startswith('p-'):
                        try:
                            img_path.unlink()
                            deleted_count += 1
                        except Exception as e:
                            print(f"  ⚠ Erreur suppression {img_path.name}: {e}")
            except Exception as e:
                print(f"  ⚠ Erreur scan extension {ext} pour suppression: {e}")
                continue
    except Exception as e:
        print(f"⚠️ Erreur générale lors du nettoyage: {e}")
    
    print(f"   → {deleted_count} fichiers supprimés")
    print()
    
    # Sauvegarder le JSON (TOUJOURS, même s'il y a eu des erreurs)
    print("💾 Sauvegarde du JSON...")
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print("   → JSON sauvegardé avec succès")
    except Exception as e:
        print(f"❌ ERREUR CRITIQUE: Impossible de sauvegarder le JSON: {e}")
        print("   → Les modifications sont perdues !")
        return
    
    print()
    print("=" * 60)
    print("✅ ASSAINISSEMENT TERMINÉ")
    print()
    print(f"📊 Statistiques:")
    print(f"   • Images renommées: {renamed_count}")
    print(f"   • Placeholders utilisés: {placeholder_count}")
    print(f"   • Images non trouvées: {not_found_count}")
    print(f"   • Fichiers supprimés: {deleted_count}")
    print(f"   • Backup créé: {backup_path}")
    print()

if __name__ == '__main__':
    main()

