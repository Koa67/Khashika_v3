#!/usr/bin/env python3
"""
Scraper du site Khashika en ligne pour récupérer les correspondances Titre→Image.
Extrait toutes les URLs produits depuis /shop/ et récupère titre + image pour chaque produit.
"""

import requests
from bs4 import BeautifulSoup
import json
import time
import re
from urllib.parse import urljoin, urlparse
from pathlib import Path

# Configuration
BASE_URL = "https://www.khashika.com"
SHOP_URL = f"{BASE_URL}/shop/"
OUTPUT_FILE = Path("data/truth_map.json")
DELAY_BETWEEN_REQUESTS = 0.8  # Délai poli entre requêtes

def normalize_slug(text: str) -> str:
    """Normalise un texte en slug (minuscules, tirets, sans accents)."""
    # Remplacement des caractères accentués
    replacements = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n'
    }
    
    text = text.lower()
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Remplacement des caractères non-alphanumériques par des tirets
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Suppression des tirets en début/fin
    text = text.strip('-')
    
    return text

def extract_product_urls(shop_url: str) -> list:
    """Extrait toutes les URLs de produits depuis la page shop."""
    product_urls = []
    page = 1
    
    print(f"🔍 Découverte des URLs produits depuis {shop_url}...")
    
    while True:
        # Gérer la pagination
        if page == 1:
            url = shop_url
        else:
            url = f"{shop_url}page/{page}/"
        
        try:
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Chercher les liens produits (variations possibles)
            product_links = soup.find_all('a', href=re.compile(r'/product/'))
            
            if not product_links:
                # Essayer d'autres sélecteurs
                product_links = soup.find_all('a', class_=re.compile(r'product|woocommerce'))
            
            page_urls = []
            for link in product_links:
                href = link.get('href', '')
                if '/product/' in href:
                    full_url = urljoin(BASE_URL, href)
                    if full_url not in product_urls:
                        page_urls.append(full_url)
            
            if not page_urls:
                print(f"  ⚠ Aucun produit trouvé sur la page {page}, arrêt.")
                break
            
            product_urls.extend(page_urls)
            print(f"  ✓ Page {page}: {len(page_urls)} produits trouvés (Total: {len(product_urls)})")
            
            # Vérifier s'il y a une page suivante
            next_link = soup.find('a', class_=re.compile(r'next|pagination'))
            if not next_link or page > 50:  # Limite de sécurité
                break
            
            page += 1
            time.sleep(DELAY_BETWEEN_REQUESTS)
            
        except requests.RequestException as e:
            print(f"  ⚠ Erreur lors de la récupération de la page {page}: {e}")
            break
    
    # Dédupliquer
    product_urls = list(set(product_urls))
    print(f"✓ {len(product_urls)} URLs produits uniques trouvées\n")
    
    return product_urls

def extract_product_data(product_url: str) -> dict | None:
    """Extrait le titre et l'image d'un produit depuis sa page."""
    try:
        response = requests.get(product_url, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Extraire le titre
        title = None
        title_selectors = [
            'h1.product_title',
            'h1.entry-title',
            'h1',
            '.product-title',
            '.woocommerce-product-title'
        ]
        
        for selector in title_selectors:
            title_elem = soup.select_one(selector)
            if title_elem:
                title = title_elem.get_text(strip=True)
                break
        
        if not title:
            print(f"  ⚠ Titre non trouvé pour {product_url}")
            return None
        
        # Extraire l'image principale
        image_url = None
        image_selectors = [
            '.woocommerce-product-gallery img',
            'img.wp-post-image',
            '.product-image img',
            '.product-gallery img',
            'img.attachment-woocommerce_single'
        ]
        
        for selector in image_selectors:
            img_elem = soup.select_one(selector)
            if img_elem:
                image_url = img_elem.get('src') or img_elem.get('data-src')
                if image_url:
                    # Convertir en URL absolue si nécessaire
                    image_url = urljoin(BASE_URL, image_url)
                    break
        
        if not image_url:
            # Dernière tentative : chercher toutes les images
            img_elem = soup.find('img', src=re.compile(r'wp-content/uploads'))
            if img_elem:
                image_url = urljoin(BASE_URL, img_elem.get('src'))
        
        if not image_url:
            print(f"  ⚠ Image non trouvée pour {product_url}")
            return None
        
        # Extraire le nom de fichier
        parsed_url = urlparse(image_url)
        image_filename = Path(parsed_url.path).name
        
        # Créer le slug
        slug = normalize_slug(title)
        
        return {
            "title": title,
            "slug": slug,
            "original_image_url": image_url,
            "original_image_filename": image_filename
        }
        
    except requests.RequestException as e:
        print(f"  ⚠ Erreur lors du scraping de {product_url}: {e}")
        return None

def main():
    """Fonction principale."""
    print("=" * 60)
    print("🔍 SCRAPING DU SITE KHASHIKA EN LIGNE")
    print("=" * 60)
    
    # Créer le dossier data si nécessaire
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Étape 1: Découvrir les URLs produits
    product_urls = extract_product_urls(SHOP_URL)
    
    if not product_urls:
        print("❌ Aucune URL produit trouvée. Arrêt.")
        return
    
    # Étape 2: Extraire les données de chaque produit
    print(f"\n📦 Extraction des données pour {len(product_urls)} produits...\n")
    
    products = []
    errors = []
    
    for i, url in enumerate(product_urls, 1):
        print(f"  [{i}/{len(product_urls)}] Scraping: {url[:60]}...", end=" ")
        
        product_data = extract_product_data(url)
        
        if product_data:
            products.append(product_data)
            print(f"✓ {product_data['title'][:40]}")
        else:
            errors.append(url)
            print("✗ Échec")
        
        # Délai entre requêtes
        if i < len(product_urls):
            time.sleep(DELAY_BETWEEN_REQUESTS)
    
    # Sauvegarder les résultats
    output_data = {
        "products": products,
        "metadata": {
            "total_scraped": len(products),
            "total_urls": len(product_urls),
            "errors": len(errors),
            "error_urls": errors
        }
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    # Rapport final
    print("\n" + "=" * 60)
    print("✅ SCRAPING TERMINÉ")
    print("=" * 60)
    print(f"✓ {len(products)} produits récupérés avec succès")
    print(f"⚠ {len(errors)} erreurs")
    print(f"📁 Fichier sauvegardé: {OUTPUT_FILE}")
    
    if errors:
        print(f"\n⚠ URLs en erreur ({len(errors)}):")
        for url in errors[:10]:  # Afficher les 10 premières
            print(f"  - {url}")
        if len(errors) > 10:
            print(f"  ... et {len(errors) - 10} autres")

if __name__ == "__main__":
    main()



















