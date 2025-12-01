#!/usr/bin/env python3
"""
Script de nettoyage des données scrapées : détection des images sur-utilisées.

Ce script :
1. Charge products-scraped.json (ou products-ultimate.json en fallback)
2. Compte la fréquence d'utilisation de chaque image
3. Identifie les images utilisées par plus de 3 produits
4. Génère products_to_rescrape.json avec la liste des produits problématiques
"""

from collections import Counter
from pathlib import Path
import json
import sys

# Chemins des fichiers
DATA_PATH = Path('lib/data/products-scraped.json')
FALLBACK_PATH = Path('lib/data/products-ultimate.json')
OUTPUT_PATH = Path('lib/data/products_to_rescrape.json')

# Seuil de duplication abusive
DUPLICATION_THRESHOLD = 3


def load_products_data():
    """Charge les données produits depuis products-scraped.json ou fallback."""
    if DATA_PATH.exists():
        print(f"📂 Chargement de {DATA_PATH}")
        try:
            with open(DATA_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', data) if isinstance(data, dict) else data
            print(f"   ✅ {len(products)} produits chargés depuis products-scraped.json")
            return products
        except Exception as e:
            print(f"   ⚠️  Erreur lecture products-scraped.json: {e}")
    
    if FALLBACK_PATH.exists():
        print(f"📂 Fallback: Chargement de {FALLBACK_PATH}")
        try:
            with open(FALLBACK_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', data) if isinstance(data, dict) else data
            print(f"   ✅ {len(products)} produits chargés depuis products-ultimate.json")
            return products
        except Exception as e:
            print(f"   ⚠️  Erreur lecture products-ultimate.json: {e}")
    
    print("❌ Aucun fichier de données trouvé (products-scraped.json ou products-ultimate.json)")
    sys.exit(1)


def analyze_image_usage(products):
    """Analyse l'utilisation de chaque image et retourne les images sur-utilisées."""
    print("\n🔍 Analyse de l'utilisation des images...")
    
    usage = Counter()
    total_images = 0
    
    for product in products:
        if not isinstance(product, dict):
            continue
        
        # Collecter toutes les images du produit
        images = []
        
        # images[] (tableau)
        if 'images' in product and isinstance(product['images'], list):
            images.extend([img for img in product['images'] if isinstance(img, str) and img.strip()])
        
        # image (string)
        if 'image' in product and isinstance(product['image'], str) and product['image'].strip():
            images.append(product['image'].strip())
        
        # image_url (string)
        if 'image_url' in product and isinstance(product['image_url'], str) and product['image_url'].strip():
            images.append(product['image_url'].strip())
        
        # Compter les occurrences (normaliser les chemins)
        for img in images:
            img_normalized = img.strip()
            if img_normalized and not img_normalized.startswith('http'):
                usage[img_normalized] += 1
                total_images += 1
    
    print(f"   📊 Total images uniques: {len(usage)}")
    print(f"   📊 Total références images: {total_images}")
    
    # Identifier les images sur-utilisées
    overused_images = {img: count for img, count in usage.items() if count > DUPLICATION_THRESHOLD}
    
    if overused_images:
        print(f"\n⚠️  Images sur-utilisées (> {DUPLICATION_THRESHOLD} produits):")
        for img, count in sorted(overused_images.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"   - {img}: utilisée par {count} produits")
        if len(overused_images) > 10:
            print(f"   ... et {len(overused_images) - 10} autres images")
    else:
        print(f"\n✅ Aucune image sur-utilisée détectée (seuil: > {DUPLICATION_THRESHOLD})")
    
    return set(overused_images.keys()), usage


def identify_problematic_products(products, overused_images):
    """Identifie les produits qui utilisent des images sur-utilisées."""
    print("\n🎯 Identification des produits problématiques...")
    
    to_rescrape = []
    
    for product in products:
        if not isinstance(product, dict):
            continue
        
        # Collecter toutes les images du produit
        images = []
        if 'images' in product and isinstance(product['images'], list):
            images.extend([img for img in product['images'] if isinstance(img, str) and img.strip()])
        if 'image' in product and isinstance(product['image'], str) and product['image'].strip():
            images.append(product['image'].strip())
        if 'image_url' in product and isinstance(product['image_url'], str) and product['image_url'].strip():
            images.append(product['image_url'].strip())
        
        # Vérifier si le produit utilise une image sur-utilisée
        has_overused = False
        for img in images:
            img_normalized = img.strip()
            if img_normalized in overused_images:
                has_overused = True
                break
        
        if has_overused:
            to_rescrape.append({
                'id': product.get('id', ''),
                'slug': product.get('slug', ''),
                'name': product.get('name') or product.get('title', ''),
                'source_url': product.get('source_url', ''),
                'images': images,
            })
    
    print(f"   📦 {len(to_rescrape)} produits identifiés pour re-scraping")
    return to_rescrape


def main():
    """Fonction principale."""
    print("=" * 70)
    print("🧹 NETTOYAGE DES DONNÉES SCRAPÉES")
    print("=" * 70)
    
    # 1. Charger les données
    products = load_products_data()
    
    # 2. Analyser l'utilisation des images
    overused_images, usage = analyze_image_usage(products)
    
    # 3. Identifier les produits problématiques
    to_rescrape = identify_problematic_products(products, overused_images)
    
    # 4. Sauvegarder la liste des produits à re-scraper
    if to_rescrape:
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump(to_rescrape, f, ensure_ascii=False, indent=2)
        print(f"\n✅ Fichier généré: {OUTPUT_PATH}")
        print(f"   📝 {len(to_rescrape)} produits à re-scraper")
    else:
        print("\n✅ Aucun produit problématique détecté. Pas de fichier products_to_rescrape.json généré.")
        # Créer un fichier vide pour indiquer qu'il n'y a rien à faire
        OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)
        print(f"   📝 Fichier vide créé: {OUTPUT_PATH}")
    
    print("\n" + "=" * 70)
    print("✅ NETTOYAGE TERMINÉ")
    print("=" * 70)


if __name__ == '__main__':
    main()





