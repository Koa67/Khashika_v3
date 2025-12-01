#!/usr/bin/env python3
"""
Script de scraping ciblé depuis la page boutique.
Extrait uniquement les produits depuis le grid #products-grid.
C'est la source de vérité : les images affichées dans le grid sont les bonnes.
"""

import json
import time
import requests
from pathlib import Path
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from urllib.parse import urlparse, urljoin
import re

BASE_URL = "https://www.khashika.com"
SHOP_URL = f"{BASE_URL}/eboutique-bijoux-indiens/"
OUTPUT_JSON = Path("lib/data/products-from-shop-grid.json")
IMAGES_DIR = Path("public/images/products")
PRODUCTS_DIR = IMAGES_DIR

def extract_full_image_url(srcset: str, src: str = "") -> str:
    """Extrait l'URL de l'image full size depuis le srcset."""
    if not srcset and not src:
        return ""
    
    if not srcset:
        # Si pas de srcset, utiliser src directement
        return src
    
    # Le srcset contient plusieurs URLs avec des tailles
    # Format: "url1 293w, url2 300w, url3 1024w, url4 768w, url5 440w, url6 1280w"
    # On veut la version sans dimensions (la plus grande)
    urls = srcset.split(',')
    
    # Chercher l'URL sans dimensions (celle qui se termine par .jpeg sans -xxx)
    for url in urls:
        url_clean = url.strip().split()[0]  # Prendre juste l'URL, pas la taille
        # Si l'URL ne contient pas de dimensions (pas de -293x195), c'est la full size
        if not re.search(r'-\d+x\d+\.(jpeg|jpg|png)', url_clean):
            return url_clean
    
    # Sinon, prendre la plus grande (celle avec 1280w ou 1024w)
    largest_url = ""
    largest_size = 0
    for url in urls:
        parts = url.strip().split()
        if len(parts) >= 2:
            size_str = parts[1]  # "293w", "1024w", etc.
            try:
                size = int(size_str.replace('w', ''))
                if size > largest_size:
                    largest_size = size
                    largest_url = parts[0]
            except:
                pass
    
    if largest_url:
        return largest_url
    
    # En dernier recours, prendre la première URL ou src
    return urls[0].strip().split()[0] if urls else src

def download_image(url: str, product_slug: str, image_index: int = 1) -> str:
    """Télécharge une image et la sauvegarde dans le dossier du produit."""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Créer le dossier du produit
        product_dir = PRODUCTS_DIR / product_slug
        product_dir.mkdir(parents=True, exist_ok=True)
        
        # Déterminer l'extension
        parsed = urlparse(url)
        ext = Path(parsed.path).suffix or '.jpg'
        
        # Nom du fichier
        filename = f"image-{image_index}{ext}"
        filepath = product_dir / filename
        
        # Sauvegarder
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        return f"/images/products/{product_slug}/{filename}"
    except Exception as e:
        print(f"   ⚠️  Erreur téléchargement {url}: {e}")
        return ""

def slugify(text: str) -> str:
    """Convertit un texte en slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text

def scrape_shop_page(driver, page_num: int = 1):
    """Scrape une page de la boutique."""
    if page_num == 1:
        url = SHOP_URL
    else:
        url = f"{SHOP_URL}page/{page_num}/"
    
    print(f"\n📄 Page {page_num}: {url}")
    driver.get(url)
    
    # Attendre que le grid se charge
    try:
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "products-grid"))
        )
    except TimeoutException:
        print(f"   ⚠️  Timeout: grid non trouvé")
        return []
    
    # Extraire tous les produits du grid
    products = []
    product_elements = driver.find_elements(By.CSS_SELECTOR, "#products-grid .product-grid")
    
    print(f"   ✅ {len(product_elements)} produits trouvés")
    
    for idx, product_elem in enumerate(product_elements, 1):
        try:
            # Nom du produit
            name_elem = product_elem.find_element(By.CSS_SELECTOR, ".product-name a")
            name = name_elem.text.strip()
            
            # Lien vers la page produit
            product_link = name_elem.get_attribute("href")
            
            # Image principale
            img_elem = product_elem.find_element(By.CSS_SELECTOR, ".product_image")
            srcset = img_elem.get_attribute("srcset") or ""
            src = img_elem.get_attribute("src") or ""
            
            # Extraire l'URL full size
            image_url = extract_full_image_url(srcset, src)
            if not image_url:
                print(f"      ⚠️  Pas d'URL d'image trouvée")
                continue
            
            # Prix
            try:
                price_elem = product_elem.find_element(By.CSS_SELECTOR, ".price .woocommerce-Price-amount")
                price_text = price_elem.text.strip()
                # Extraire le nombre (ex: "7,00 €" -> 7.00)
                price_match = re.search(r'([\d,]+)', price_text.replace('.', '').replace(',', '.'))
                price = float(price_match.group(1)) if price_match else 0.0
            except:
                price = 0.0
            
            # Description courte
            try:
                desc_elem = product_elem.find_element(By.CSS_SELECTOR, ".product-descr")
                description = desc_elem.text.strip()[:200]  # Limiter à 200 caractères
            except:
                description = ""
            
            # Slug du produit
            product_slug = slugify(name)
            
            # Télécharger l'image
            print(f"   📸 [{idx}] {name[:50]}")
            local_image_path = download_image(image_url, product_slug, 1)
            
            if not local_image_path:
                print(f"      ⚠️  Image non téléchargée")
                continue
            
            product_data = {
                "id": f"prod-{product_slug}",
                "slug": product_slug,
                "name": name,
                "description": description,
                "price": price,
                "image_url": local_image_path,
                "image": local_image_path,
                "images": [local_image_path],
                "url": product_link,
                "source": "shop-grid"
            }
            
            products.append(product_data)
            print(f"      ✅ Image: {local_image_path}")
            
            # Petite pause pour ne pas surcharger le serveur
            time.sleep(0.5)
            
        except Exception as e:
            print(f"   ⚠️  Erreur produit {idx}: {e}")
            continue
    
    return products

def has_next_page(driver, page_num: int):
    """Vérifie s'il y a une page suivante."""
    try:
        # Chercher un lien "Suivant" ou "Next"
        next_selectors = [
            ".pagination .next",
            ".pagination a[rel='next']",
            "a.next",
            ".woocommerce-pagination .next",
            ".pagination a:contains('Suivant')",
            ".pagination a:contains('Next')"
        ]
        
        for selector in next_selectors:
            try:
                next_link = driver.find_element(By.CSS_SELECTOR, selector)
                if next_link and next_link.is_displayed():
                    return True
            except:
                continue
        
        # Vérifier s'il y a des produits sur la page actuelle
        products = driver.find_elements(By.CSS_SELECTOR, "#products-grid .product-grid")
        if len(products) > 0:
            # Si on a des produits, on continue (il pourrait y avoir une page suivante)
            # On va tester en essayant d'accéder à la page suivante
            return True
        
        return False
    except:
        # En cas de doute, on continue jusqu'à max_pages
        return page_num < 50

def scrape_all_shop_pages():
    """Scrape toutes les pages de la boutique."""
    print("=" * 70)
    print("🛍️  SCRAPING CIBLÉ DEPUIS LA PAGE BOUTIQUE")
    print("=" * 70)
    print(f"   URL: {SHOP_URL}")
    print("")
    
    # Initialiser Selenium
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    
    driver = webdriver.Chrome(options=options)
    
    all_products = []
    page_num = 1
    max_pages = 50  # Limite de sécurité
    
    try:
        while page_num <= max_pages:
            products = scrape_shop_page(driver, page_num)
            
            if not products:
                print(f"\n   ℹ️  Aucun produit trouvé sur la page {page_num}, arrêt.")
                break
            
            all_products.extend(products)
            
            # Si aucune page trouvée, arrêter
            if not products:
                print(f"\n   ✅ Aucun produit trouvé, arrêt.")
                break
            
            # Vérifier s'il y a une page suivante
            print(f"\n   🔍 Vérification de la page suivante...")
            page_num += 1
            next_url = f"{SHOP_URL}page/{page_num}/"
            
            # Tester si la page suivante existe en y allant
            driver.get(next_url)
            time.sleep(2)  # Attendre le chargement
            
            try:
                WebDriverWait(driver, 5).until(
                    EC.presence_of_element_located((By.ID, "products-grid"))
                )
                # Vérifier s'il y a des produits
                test_products = driver.find_elements(By.CSS_SELECTOR, "#products-grid .product-grid")
                if len(test_products) == 0:
                    print(f"\n   ✅ Dernière page atteinte (page {page_num-1})")
                    break
            except TimeoutException:
                print(f"\n   ✅ Dernière page atteinte (timeout sur page {page_num})")
                break
            
            time.sleep(1)  # Pause entre les pages
    
    finally:
        driver.quit()
    
    # Sauvegarder
    print(f"\n💾 Sauvegarde de {len(all_products)} produits...")
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump({"products": all_products}, f, indent=2, ensure_ascii=False)
    
    print(f"   ✅ Fichier sauvegardé: {OUTPUT_JSON}")
    
    # Rapport
    print("\n" + "=" * 70)
    print("✅ SCRAPING TERMINÉ")
    print("=" * 70)
    print(f"   📦 Produits scrapés: {len(all_products)}")
    print(f"   📄 Pages traitées: {page_num}")
    print(f"   💾 Fichier: {OUTPUT_JSON}")
    print("=" * 70)
    
    return all_products

if __name__ == '__main__':
    scrape_all_shop_pages()

