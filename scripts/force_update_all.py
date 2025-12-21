#!/usr/bin/env python3
"""Force la mise à jour de TOUS les produits avec images p-X."""

import json
import os
import re
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import unquote, urljoin
import unicodedata

def normalize_slug(text):
    """Normaliser un texte en slug propre."""
    # Décoder URL encoding
    text = unquote(text)
    # Supprimer accents
    text = unicodedata.normalize('NFKD', text)
    text = text.encode('ascii', 'ignore').decode('utf-8')
    # Minuscules
    text = text.lower()
    # Remplacer tout sauf lettres/chiffres par tirets
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Nettoyer
    text = text.strip('-')
    text = re.sub(r'-+', '-', text)
    return text

def find_product_image(soup):
    """Trouver l'image principale du produit."""
    selectors = [
        '.woocommerce-product-gallery__image img',
        'img.wp-post-image',
        '.product-images img',
        '.woocommerce-product-gallery img'
    ]
    
    for selector in selectors:
        img = soup.select_one(selector)
        if img:
            return img
    return None

def get_image_url(img):
    """Récupérer l'URL de l'image."""
    img_url = (img.get('src') or 
               img.get('data-src') or 
               img.get('data-large_image') or 
               img.get('data-large-image'))
    
    if img_url:
        # Convertir en URL absolue si nécessaire
        if not img_url.startswith('http'):
            img_url = urljoin('https://www.khashika.com', img_url)
    
    return img_url

def download_image(url, dest_path):
    """Télécharger une image."""
    try:
        response = requests.get(url, timeout=15, stream=True)
        response.raise_for_status()
        
        # Créer le dossier parent si nécessaire
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        
        with open(dest_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return True
    except Exception as e:
        print(f"    ❌ Erreur téléchargement : {e}")
        return False

print("=" * 60)
print("🔄 MISE À JOUR FORCÉE DE TOUS LES PRODUITS")
print("=" * 60)
print()

# Charger le JSON
with open('lib/data/products-ultimate.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

print(f"📂 {len(products)} produits chargés")

# Identifier les produits avec images p-X
products_to_fix = []
for product in products:
    image_url = product.get('image_url', '')
    if '/p-' in image_url or (image_url and not os.path.exists(f"public{image_url}")):
        products_to_fix.append(product)

print(f"⚠ {len(products_to_fix)} produits à corriger")
print()

# Backup
os.makedirs('lib/data/backups', exist_ok=True)
backup_path = 'lib/data/backups/products-ultimate.json.before-force-update'
with open(backup_path, 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)
print(f"💾 Backup créé : {backup_path}")
print()

# Traiter chaque produit
print("🔄 Traitement des produits...")
print()

success_count = 0
fail_count = 0

for i, product in enumerate(products_to_fix, 1):
    name = product.get('name', 'Sans nom')
    original_slug = product.get('slug', '')
    clean_slug = normalize_slug(name)
    
    print(f"[{i:3d}/{len(products_to_fix)}] {name[:50]}...")
    
    # Essayer plusieurs URLs
    url_variants = [
        f"https://www.khashika.com/produit/{clean_slug}/",
        f"https://www.khashika.com/produit/{original_slug}/",
        f"https://www.khashika.com/produit/{clean_slug}",
    ]
    
    # Ajouter source_url si disponible
    if product.get('source_url'):
        url_variants.insert(0, product['source_url'])
    
    found = False
    for url in url_variants:
        try:
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                soup = BeautifulSoup(response.text, 'html.parser')
                img = find_product_image(soup)
                
                if img:
                    img_url = get_image_url(img)
                    
                    if img_url:
                        # Déterminer l'extension
                        extension = 'jpg'
                        if img_url.lower().endswith('.jpeg'):
                            extension = 'jpeg'
                        elif img_url.lower().endswith('.png'):
                            extension = 'png'
                        elif img_url.lower().endswith('.webp'):
                            extension = 'webp'
                        else:
                            # Essayer de détecter depuis l'URL
                            parsed_url = img_url.lower()
                            if '.jpeg' in parsed_url:
                                extension = 'jpeg'
                            elif '.png' in parsed_url:
                                extension = 'png'
                            elif '.webp' in parsed_url:
                                extension = 'webp'
                        
                        # Chemin de destination
                        dest_filename = f"{clean_slug}.{extension}"
                        dest_path = f"public/images/products/{dest_filename}"
                        
                        # Télécharger
                        if download_image(img_url, dest_path):
                            # Mettre à jour le produit
                            product['image_url'] = f"/images/products/{dest_filename}"
                            product['image'] = f"/images/products/{dest_filename}"
                            if 'images' in product and len(product['images']) > 0:
                                product['images'][0] = f"/images/products/{dest_filename}"
                            
                            print(f"    ✓ {dest_filename}")
                            success_count += 1
                            found = True
                            break
        
        except Exception as e:
            continue
    
    if not found:
        print(f"    ❌ Échec (toutes URLs)")
        fail_count += 1
    
    # Délai poli
    if i < len(products_to_fix):
        time.sleep(0.5)

print()
print("=" * 60)
print("📊 RÉSUMÉ")
print("=" * 60)
print(f"✓ {success_count} produits corrigés")
print(f"❌ {fail_count} échecs")
print()

# Sauvegarder
print("💾 Sauvegarde du JSON mis à jour...")
with open('lib/data/products-ultimate.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2, ensure_ascii=False)

print("✓ JSON sauvegardé")
print()

# Supprimer les anciennes images p-*
print("🗑 Suppression des anciennes images p-*...")
deleted = 0
images_dir = 'public/images/products/'
if os.path.exists(images_dir):
    for filename in os.listdir(images_dir):
        if filename.startswith('p-') and (filename.endswith('.jpg') or filename.endswith('.jpeg')):
            filepath = os.path.join(images_dir, filename)
            # Vérifier qu'aucun produit ne l'utilise
            if not any(p.get('image_url', '').endswith(filename) for p in products):
                try:
                    os.remove(filepath)
                    deleted += 1
                except Exception:
                    pass

print(f"✓ {deleted} anciennes images supprimées")
print()

print("=" * 60)
print("✅ MISE À JOUR TERMINÉE !")
print("=" * 60)


















