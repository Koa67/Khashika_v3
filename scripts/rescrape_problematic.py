#!/usr/bin/env python3
"""
Script de re-scraping ciblé pour les produits problématiques.

Ce script :
1. Charge products_to_rescrape.json (liste des produits avec images sur-utilisées)
2. Re-scrappe uniquement ces produits avec le scraper durci
3. Met à jour les images dans products-scraped.json
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional

# Import des fonctions du scraper principal
# On doit être dans le répertoire racine pour que l'import fonctionne
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from scrape_khashika_selenium import extract_product_data, setup_driver, BASE_URL
except ImportError as e:
    print(f"❌ Erreur d'import du scraper: {e}")
    print("   Assurez-vous que scrape_khashika_selenium.py est dans le répertoire racine")
    sys.exit(1)

# Chemins des fichiers
TO_RESCRAPE_PATH = Path('lib/data/products_to_rescrape.json')
SCRAPED_PATH = Path('lib/data/products-scraped.json')
FALLBACK_PATH = Path('lib/data/products-ultimate.json')


def load_products_data():
    """Charge les données produits depuis products-scraped.json ou fallback."""
    if SCRAPED_PATH.exists():
        print(f"📂 Chargement de {SCRAPED_PATH}")
        try:
            with open(SCRAPED_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', data) if isinstance(data, dict) else data
            print(f"   ✅ {len(products)} produits chargés")
            return data, products
        except Exception as e:
            print(f"   ⚠️  Erreur lecture products-scraped.json: {e}")
    
    if FALLBACK_PATH.exists():
        print(f"📂 Fallback: Chargement de {FALLBACK_PATH}")
        try:
            with open(FALLBACK_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', data) if isinstance(data, dict) else data
            print(f"   ✅ {len(products)} produits chargés")
            return data, products
        except Exception as e:
            print(f"   ⚠️  Erreur lecture products-ultimate.json: {e}")
    
    print("❌ Aucun fichier de données trouvé")
    sys.exit(1)


def load_to_rescrape():
    """Charge la liste des produits à re-scraper."""
    if not TO_RESCRAPE_PATH.exists():
        print(f"⚠️  Fichier {TO_RESCRAPE_PATH} introuvable")
        print("   Exécutez d'abord: python3 scripts/clean_scraped_data.py")
        sys.exit(1)
    
    print(f"📂 Chargement de {TO_RESCRAPE_PATH}")
    try:
        with open(TO_RESCRAPE_PATH, 'r', encoding='utf-8') as f:
            to_rescrape = json.load(f)
        print(f"   ✅ {len(to_rescrape)} produits à re-scraper")
        return to_rescrape
    except Exception as e:
        print(f"   ❌ Erreur lecture: {e}")
        sys.exit(1)


def update_product_images(product: Dict, fresh_data: Dict):
    """Met à jour les images d'un produit avec les nouvelles données scrapées."""
    if 'images' in fresh_data and fresh_data['images']:
        product['images'] = fresh_data['images']
    
    if 'image' in fresh_data and fresh_data['image']:
        product['image'] = fresh_data['image']
    
    if 'image_url' in fresh_data and fresh_data['image_url']:
        product['image_url'] = fresh_data['image_url']
    
    # Si aucune image n'a été trouvée, vider les champs pour forcer le placeholder
    if not fresh_data.get('images') and not fresh_data.get('image'):
        product['images'] = []
        product['image'] = ''
        product['image_url'] = ''
        print("      ⚠️  Aucune image trouvée → placeholder")


def main():
    """Fonction principale."""
    print("=" * 70)
    print("🔄 RE-SCRAPING CIBLÉ DES PRODUITS PROBLÉMATIQUES")
    print("=" * 70)
    
    # 1. Charger la liste des produits à re-scraper
    to_rescrape = load_to_rescrape()
    
    if not to_rescrape:
        print("\n✅ Aucun produit à re-scraper. Tout est propre !")
        return
    
    # 2. Charger les données produits existantes
    data, products = load_products_data()
    
    # 3. Indexer les produits par slug pour accès rapide
    by_slug = {}
    for p in products:
        if isinstance(p, dict) and 'slug' in p:
            by_slug[p['slug']] = p
    
    print(f"\n📊 {len(by_slug)} produits indexés par slug")
    
    # 4. Initialiser le driver Selenium
    print("\n🚀 Initialisation du navigateur headless...")
    driver = setup_driver(headless=True)
    
    try:
        updated_count = 0
        failed_count = 0
        
        print(f"\n🔄 Re-scraping de {len(to_rescrape)} produits...\n")
        
        for idx, item in enumerate(to_rescrape, 1):
            slug = item.get('slug', '')
            name = item.get('name', 'N/A')
            source_url = item.get('source_url', '')
            
            if not slug:
                print(f"   ⚠️  [{idx}/{len(to_rescrape)}] Slug manquant, ignoré")
                failed_count += 1
                continue
            
            product = by_slug.get(slug)
            if not product:
                print(f"   ⚠️  [{idx}/{len(to_rescrape)}] Produit '{slug}' non trouvé dans les données")
                failed_count += 1
                continue
            
            # Utiliser source_url du produit si disponible, sinon construire depuis slug
            url = source_url or product.get('source_url', '')
            if not url:
                url = f"{BASE_URL}/produit/{slug}/"
            
            print(f"   [{idx}/{len(to_rescrape)}] {name[:50]}...")
            print(f"      🔗 {url}")
            
            # Re-scraper le produit
            try:
                fresh_data = extract_product_data(driver, url)
                
                if fresh_data:
                    # Mettre à jour uniquement les images
                    update_product_images(product, fresh_data)
                    updated_count += 1
                    print(f"      ✅ Images mises à jour ({len(fresh_data.get('images', []))} images)")
                else:
                    print(f"      ⚠️  Aucune donnée extraite")
                    failed_count += 1
            except Exception as e:
                print(f"      ❌ Erreur lors du scraping: {e}")
                failed_count += 1
        
        # 5. Sauvegarder les données mises à jour
        print(f"\n💾 Sauvegarde des données mises à jour...")
        
        # Préserver la structure originale (dict avec 'products' ou liste directe)
        if isinstance(data, dict) and 'products' in data:
            data['products'] = products
        else:
            data = products
        
        # Sauvegarder dans products-scraped.json
        SCRAPED_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(SCRAPED_PATH, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        print(f"   ✅ Données sauvegardées dans {SCRAPED_PATH}")
        
        # Statistiques finales
        print("\n" + "=" * 70)
        print("✅ RE-SCRAPING TERMINÉ")
        print("=" * 70)
        print(f"   📊 Produits mis à jour: {updated_count}")
        print(f"   ⚠️  Produits échoués: {failed_count}")
        print(f"   📁 Fichier: {SCRAPED_PATH}")
        
    finally:
        driver.quit()
        print("\n🔒 Navigateur fermé")


if __name__ == '__main__':
    main()






















