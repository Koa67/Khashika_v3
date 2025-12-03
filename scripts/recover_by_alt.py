#!/usr/bin/env python3
"""
Script de récupération ultime : Récupère les images via l'attribut alt des balises img.
Méthode infaillible car l'alt contient le nom du produit.
"""

import json
import os
import shutil
import re
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
import requests
from fuzzywuzzy import fuzz

def normalize_text(text):
    """Normaliser un texte pour comparaison."""
    if not text:
        return ""
    # Enlever accents, mettre en minuscules, enlever espaces multiples
    text = text.lower().strip()
    text = re.sub(r'\s+', ' ', text)
    return text

def find_product_by_name(name, products_map, fuzzy_cache=None):
    """Trouver un produit par son nom (exact ou fuzzy avec cache)."""
    normalized_name = normalize_text(name)
    
    # 1. Match exact
    if normalized_name in products_map:
        return products_map[normalized_name]
    
    # 2. Vérifier le cache fuzzy
    if fuzzy_cache and normalized_name in fuzzy_cache:
        return fuzzy_cache[normalized_name]
    
    # 3. Match fuzzy (seuil 85%) - LIMITÉ aux 100 premiers caractères pour performance
    # On ne fait le fuzzy matching que si le nom est court (< 100 chars)
    if len(normalized_name) > 100:
        return None
    
    best_match = None
    best_score = 0
    
    # Limiter la recherche fuzzy aux produits dont le nom commence par les mêmes lettres
    # (optimisation majeure)
    prefix = normalized_name[:10] if len(normalized_name) >= 10 else normalized_name
    
    for product_name, product_data in products_map.items():
        # Early exit : si le nom ne commence pas par le même préfixe, skip
        if not product_name.startswith(prefix) and not normalized_name.startswith(product_name[:10]):
            continue
        
        score = fuzz.ratio(normalized_name, product_name)
        if score > best_score and score >= 85:
            best_score = score
            best_match = product_data
        
        # Early exit si score parfait
        if best_score >= 95:
            break
    
    # Mettre en cache si trouvé
    if fuzzy_cache and best_match:
        fuzzy_cache[normalized_name] = best_match
    
    return best_match

def download_image(url, dest_path):
    """Télécharger une image depuis une URL."""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, stream=True)
        response.raise_for_status()
        
        with open(dest_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return True
    except Exception as e:
        print(f"    ⚠️ Erreur téléchargement {url}: {e}")
        return False

def find_image_locally(image_src, base_dir):
    """Chercher une image localement dans _raw_assets ou _LEGACY_CLONE."""
    if not image_src:
        return None
    
    # Extraire le nom de fichier
    filename = os.path.basename(image_src)
    
    # Chercher dans _raw_assets/Products_HD
    search_dirs = [
        Path('_raw_assets/Products_HD'),
        Path('_raw_assets/Banners_Hero'),
        Path('_LEGACY_CLONE/www.khashika.com/wp-content/uploads'),
    ]
    
    for search_dir in search_dirs:
        if not search_dir.exists():
            continue
        
        # Chercher récursivement
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            for img_path in search_dir.rglob(ext):
                if img_path.name.lower() == filename.lower():
                    return img_path
    
    return None

def main():
    print("🔍 RÉCUPÉRATION ULTIME : IMAGES VIA ATTRIBUT ALT")
    print("=" * 70)
    print()
    
    # Chemins
    json_path = Path('lib/data/products-ultimate.json')
    clone_dir = Path('_LEGACY_CLONE/www.khashika.com')
    products_dir = Path('public/images/products')
    
    # Backup du JSON
    backup_path = json_path.with_suffix('.json.backup-recovery')
    print(f"📦 Création backup: {backup_path}")
    try:
        shutil.copy2(json_path, backup_path)
        print("   → Backup créé avec succès")
    except Exception as e:
        print(f"⚠️ Erreur création backup: {e}")
    
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
    
    # Créer une map : produit_nom -> {index, product}
    print("🗺️  Création de la map produit_nom -> index...")
    products_map = {}
    for i, product in enumerate(products):
        name = product.get('name', '')
        if name:
            normalized = normalize_text(name)
            products_map[normalized] = {'index': i, 'product': product}
    
    print(f"   → {len(products_map)} produits indexés")
    print()
    
    # Statistiques
    recovered_count = 0
    not_found_count = 0
    error_count = 0
    skipped_count = 0
    
    # Cache pour les matches fuzzy (évite de recalculer)
    fuzzy_cache = {}
    
    # Scanner tous les fichiers HTML
    print("🔍 Scan des fichiers HTML dans le clone...")
    html_files = list(clone_dir.rglob('*.html'))
    print(f"   → {len(html_files)} fichiers HTML trouvés")
    print()
    
    print("🔄 Traitement des images...")
    print("   (Appuyez sur Ctrl+C pour arrêter et sauvegarder le progrès)")
    print()
    
    # Parcourir les fichiers HTML
    processed_files = 0
    for html_file in html_files:
        processed_files += 1
        if processed_files % 1000 == 0:
            print(f"   → {processed_files}/{len(html_files)} fichiers traités... ({recovered_count} images récupérées)")
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Trouver toutes les balises img avec attribut alt
            for img in soup.find_all('img', alt=True):
                alt_text = img.get('alt', '').strip()
                src = img.get('src', '')
                
                if not alt_text or not src:
                    continue
                
                # Trouver le produit correspondant (avec cache)
                product_data = find_product_by_name(alt_text, products_map, fuzzy_cache)
                
                if not product_data:
                    skipped_count += 1
                    continue
                
                index = product_data['index']
                product = product_data['product']
                
                # Si le produit a déjà une image valide, skip
                current_image = product.get('image_url') or product.get('image')
                if current_image and current_image != '':
                    # Vérifier si le fichier existe
                    if current_image.startswith('/'):
                        file_path = Path('public') / current_image.lstrip('/')
                        if file_path.exists():
                            skipped_count += 1
                            continue
                
                # Extraire l'URL de l'image
                # Si src est relatif, construire l'URL absolue
                if src.startswith('http'):
                    image_url = src
                elif src.startswith('/'):
                    image_url = f"https://www.khashika.com{src}"
                else:
                    # URL relative, construire depuis le fichier HTML
                    base_url = f"https://www.khashika.com/{html_file.relative_to(clone_dir).parent}/"
                    image_url = urljoin(base_url, src)
                
                # Nom de fichier de destination
                new_name = f"p-{index}.jpg"
                new_path = products_dir / new_name
                
                # Si le fichier existe déjà, skip
                if new_path.exists():
                    continue
                
                # Chercher localement d'abord
                local_file = find_image_locally(src, clone_dir)
                
                if local_file:
                    # Copier depuis le fichier local
                    try:
                        shutil.copy2(local_file, new_path)
                        print(f"✅ [{index}] {product.get('name', '')[:50]}")
                        print(f"   Retrouvé : {alt_text[:50]} -> {local_file.name}")
                        
                        # Mettre à jour le JSON
                        product['image_url'] = f"/images/products/{new_name}"
                        product['image'] = f"/images/products/{new_name}"
                        if 'images' in product:
                            product['images'] = [f"/images/products/{new_name}"]
                        
                        recovered_count += 1
                    except Exception as e:
                        print(f"⚠️ [{index}] Erreur copie {local_file}: {e}")
                        error_count += 1
                else:
                    # Télécharger depuis l'URL
                    if download_image(image_url, new_path):
                        print(f"✅ [{index}] {product.get('name', '')[:50]}")
                        print(f"   Téléchargé : {alt_text[:50]} -> {os.path.basename(image_url)}")
                        
                        # Mettre à jour le JSON
                        product['image_url'] = f"/images/products/{new_name}"
                        product['image'] = f"/images/products/{new_name}"
                        if 'images' in product:
                            product['images'] = [f"/images/products/{new_name}"]
                        
                        recovered_count += 1
                        
                        # Délai poli entre téléchargements
                        time.sleep(0.5)
                    else:
                        not_found_count += 1
                        print(f"⚠️ [{index}] {product.get('name', '')[:50]} -> Image non trouvée")
        
        except KeyboardInterrupt:
            print()
            print("⚠️ Interruption utilisateur détectée")
            print("   → Sauvegarde du progrès...")
            break
        except Exception as e:
            print(f"⚠️ Erreur traitement {html_file}: {e}")
            error_count += 1
            continue
    
    print()
    print("=" * 70)
    print("💾 Sauvegarde du JSON...")
    
    # Sauvegarder le JSON
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print("   → JSON sauvegardé avec succès")
    except Exception as e:
        print(f"❌ ERREUR CRITIQUE: Impossible de sauvegarder le JSON: {e}")
        return
    
    print()
    print("=" * 70)
    print("✅ RÉCUPÉRATION TERMINÉE")
    print()
    print(f"📊 Statistiques:")
    print(f"   • Images récupérées: {recovered_count}")
    print(f"   • Images non trouvées: {not_found_count}")
    print(f"   • Images ignorées (déjà présentes): {skipped_count}")
    print(f"   • Erreurs: {error_count}")
    print(f"   • Fichiers HTML traités: {processed_files}/{len(html_files)}")
    print(f"   • Backup créé: {backup_path}")
    print()

if __name__ == '__main__':
    main()

