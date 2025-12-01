#!/usr/bin/env python3
"""
Scraper Selenium ULTIME pour récupérer TOUS les produits du site Khashika
Source: https://www.khashika.com/eboutique-bijoux-indiens/
Objectif: 726 produits avec données complètes et images (chargement JavaScript)
"""

import json
import os
import re
import time
from pathlib import Path
from typing import Dict, List, Optional, Set
from urllib.parse import urljoin, urlparse

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import requests
from tqdm import tqdm
import urllib3

# Désactiver les warnings SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
BASE_URL = 'https://www.khashika.com'
START_URL = 'https://www.khashika.com/eboutique-bijoux-indiens/'
OUTPUT_JSON = Path('lib/data/products-scraped.json')
IMAGES_BASE_DIR = Path('public/images/products')
REPORT_FILE = Path('scraping_report.txt')
DELAY = 1.5  # Délai entre requêtes (secondes)
MAX_RETRIES = 3
SAVE_INTERVAL = 50  # Sauvegarder tous les 50 produits
PAGE_TIMEOUT = 30  # Timeout par page (secondes)
PRODUCT_WAIT_TIMEOUT = 20  # Timeout pour attendre les produits (secondes)

# Headers pour téléchargement d'images
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
}

# Session pour téléchargement d'images
session = requests.Session()
session.headers.update(HEADERS)


def setup_driver(headless: bool = True) -> webdriver.Chrome:
    """Configure et retourne un driver Chrome avec webdriver_manager"""
    chrome_options = Options()
    
    if headless:
        chrome_options.add_argument('--headless')
    
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    # Désactiver les images pour aller plus vite (on les télécharge après)
    prefs = {
        'profile.managed_default_content_settings.images': 2,
        'profile.default_content_setting_values.notifications': 2
    }
    chrome_options.add_experimental_option('prefs', prefs)
    
    # Utiliser webdriver_manager pour installer Chrome automatiquement
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    driver.set_page_load_timeout(PAGE_TIMEOUT)
    
    return driver


def slugify(text: str) -> str:
    """Convertit un texte en slug"""
    if not text:
        return ''
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def download_image(url: str, destination: Path) -> bool:
    """Télécharge une image depuis une URL"""
    try:
        response = session.get(url, verify=False, timeout=15, stream=True)
        response.raise_for_status()
        
        destination.parent.mkdir(parents=True, exist_ok=True)
        
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"   ⚠️  Erreur téléchargement image {url}: {e}")
        return False


def collect_all_product_links(driver: webdriver.Chrome, headless_mode: bool = True) -> List[str]:
    """
    LOGIQUE DE NAVIGATION CRUCIALE:
    - Navigue sur toutes les pages de pagination
    - Attend que les produits soient visibles avec WebDriverWait (sélecteurs multiples)
    - Cherche le bouton "Suivant" (a.next) et boucle tant qu'il existe
    - Récolte TOUS les liens produits (href) sur chaque page
    """
    all_links = []
    visited_urls = set()
    current_url = START_URL
    page_count = 0
    
    print("📄 Collecte de tous les liens produits (pagination)...")
    
    while current_url and page_count < 200:  # Limite de sécurité
        if current_url in visited_urls:
            break
        
        visited_urls.add(current_url)
        page_count += 1
        
        print(f"   📄 Page {page_count}: {current_url}")
        
        try:
            driver.get(current_url)
            
            # === GESTION POPUP COOKIES RGPD ===
            print("   🍪 Gestion de la popup cookies...")
            try:
                # Attendre la popup (max 5 secondes)
                cookie_selectors = [
                    "button[id*='accept']",
                    "button[class*='accept']", 
                    "a[id*='accept']",
                    ".cookie-accept",
                    "#cookie-accept",
                    "[class*='consent'] button",
                    "[id*='consent'] button",
                    "button[onclick*='accept']",
                    ".cookie-banner button",
                    "#cookie-banner button"
                ]
                
                cookie_button = None
                for selector in cookie_selectors:
                    try:
                        cookie_button = WebDriverWait(driver, 2).until(
                            EC.element_to_be_clickable((By.CSS_SELECTOR, selector))
                        )
                        break
                    except:
                        continue
                
                # Chercher aussi par texte "Accepter" ou "Accept"
                if not cookie_button:
                    try:
                        cookie_button = WebDriverWait(driver, 2).until(
                            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Accepter') or contains(text(), 'Accept') or contains(text(), 'J\'accepte')]"))
                        )
                    except:
                        pass
                
                if cookie_button:
                    cookie_button.click()
                    print("   ✅ Cookies acceptés")
                    time.sleep(2)  # Attendre que la popup disparaisse
                else:
                    print("   ⚠️  Pas de popup cookies détectée")
            except Exception as e:
                print(f"   ⚠️  Erreur cookies (on continue): {e}")
            
            # === STRATÉGIE ALTERNATIVE : Injecter JavaScript pour supprimer la popup ===
            try:
                driver.execute_script("""
                    // Supprimer tous les overlays de cookies
                    document.querySelectorAll('[class*="cookie"], [id*="cookie"], [class*="consent"], [id*="consent"], [class*="gdpr"], [id*="gdpr"]').forEach(el => {
                        if (el.style) el.style.display = 'none';
                        el.remove();
                    });
                    // Réactiver le scroll
                    document.body.style.overflow = 'auto';
                    // Supprimer les classes qui bloquent
                    document.body.classList.remove('no-scroll', 'overflow-hidden');
                """)
                time.sleep(1)
            except Exception as e:
                print(f"   ⚠️  Erreur injection JS (on continue): {e}")
            # === FIN GESTION COOKIES ===
            
            # ATTENTE CRUCIALE: Essayer plusieurs sélecteurs avec WebDriverWait
            product_loaded = False
            selectors_to_try = [
                '.product',
                '.product-item',
                'a.woocommerce-LoopProduct-link',
                '.woocommerce ul.products li',
                'article.product',
                '[class*="product"]',
                'a[href*="/produit/"]',
                'a[href*="/product/"]'
            ]
            
            for selector in selectors_to_try:
                try:
                    WebDriverWait(driver, PRODUCT_WAIT_TIMEOUT).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )
                    product_loaded = True
                    print(f"   ✅ Produits détectés avec sélecteur: {selector}")
                    break
                except TimeoutException:
                    continue
            
            if not product_loaded:
                # Debug: Afficher le titre de la page et quelques éléments trouvés
                print(f"   ⚠️  Aucun sélecteur n'a fonctionné. Debug:")
                print(f"      - Titre page: {driver.title}")
                print(f"      - URL actuelle: {driver.current_url}")
                
                # Essayer de trouver n'importe quel lien
                all_links_on_page = driver.find_elements(By.TAG_NAME, 'a')
                print(f"      - Nombre total de liens sur la page: {len(all_links_on_page)}")
                
                # Chercher des liens contenant "produit" ou "product"
                product_links_found = []
                for link in all_links_on_page[:20]:  # Limiter à 20 pour debug
                    href = link.get_attribute('href')
                    if href and ('produit' in href.lower() or 'product' in href.lower()):
                        product_links_found.append(href)
                
                if product_links_found:
                    print(f"      - Liens produits potentiels trouvés: {len(product_links_found)}")
                    for link in product_links_found[:5]:
                        print(f"        * {link}")
                
                # Attendre un peu plus et réessayer
                time.sleep(5)
                try:
                    WebDriverWait(driver, PRODUCT_WAIT_TIMEOUT).until(
                        EC.presence_of_any_element_located([
                            (By.CSS_SELECTOR, '.product'),
                            (By.CSS_SELECTOR, '.product-item'),
                            (By.CSS_SELECTOR, 'a[href*="/produit/"]'),
                            (By.CSS_SELECTOR, 'a[href*="/product/"]')
                        ])
                    )
                    product_loaded = True
                    print(f"   ✅ Produits détectés après attente supplémentaire")
                except TimeoutException:
                    print(f"   ⚠️  Timeout: Les produits ne se sont pas chargés sur la page {page_count}")
                    
                    # === MODE DEBUG : Sauvegarder screenshot et HTML ===
                    debug_mode = os.getenv('DEBUG', 'false').lower() == 'true'
                    if debug_mode or not headless_mode:
                        try:
                            screenshot_path = f'debug_page_{page_count}.png'
                            driver.save_screenshot(screenshot_path)
                            print(f"   📸 Screenshot sauvegardé: {screenshot_path}")
                            
                            html_path = f'debug_page_{page_count}.html'
                            with open(html_path, 'w', encoding='utf-8') as f:
                                f.write(driver.page_source)
                            print(f"   📄 HTML sauvegardé: {html_path}")
                        except Exception as e:
                            print(f"   ⚠️  Erreur sauvegarde debug: {e}")
                    # === FIN MODE DEBUG ===
                    
                    # Ne pas break, continuer pour essayer de trouver des liens quand même
            
            time.sleep(3)  # Attendre le chargement complet du JS
            
            # Récupérer TOUS les liens produits sur cette page (stratégie large)
            page_links = []
            
            # Stratégie 1: Sélecteurs spécifiques WooCommerce
            selectors = [
                '.product a',
                '.product-item a',
                'a.woocommerce-LoopProduct-link',
                '.woocommerce ul.products li a',
                'article.product a',
                '[class*="product"] a'
            ]
            
            for selector in selectors:
                try:
                    elements = driver.find_elements(By.CSS_SELECTOR, selector)
                    for elem in elements:
                        href = elem.get_attribute('href')
                        if href and BASE_URL in href and href not in all_links and '/produit/' in href.lower():
                            page_links.append(href)
                            all_links.append(href)
                except:
                    continue
            
            # Stratégie 2: Chercher tous les liens contenant "produit" ou "product"
            if not page_links:
                all_links_on_page = driver.find_elements(By.TAG_NAME, 'a')
                for link in all_links_on_page:
                    href = link.get_attribute('href')
                    if href and BASE_URL in href:
                        href_lower = href.lower()
                        if ('/produit/' in href_lower or '/product/' in href_lower) and href not in all_links:
                            # Exclure les liens admin/cart/etc
                            if not any(exclude in href_lower for exclude in ['/cart/', '/checkout/', '/account/', '/wp-admin/', '/wp-json/']):
                                page_links.append(href)
                                all_links.append(href)
            
            print(f"   📦 {len(page_links)} nouveaux produits trouvés (Total: {len(all_links)})")
            
            # PAGINATION: Chercher le bouton "Suivant" (a.next)
            next_button = None
            try:
                # Chercher a.next ou bouton avec classe "next"
                next_button = driver.find_element(By.CSS_SELECTOR, 'a.next, .next a, a[rel="next"]')
            except NoSuchElementException:
                # Chercher par texte "Suivant" ou "Next"
                try:
                    next_button = driver.find_element(By.XPATH, "//a[contains(text(), 'Suivant') or contains(text(), 'Next')]")
                except NoSuchElementException:
                    pass
            
            if next_button:
                next_url = next_button.get_attribute('href')
                if next_url and next_url != current_url and BASE_URL in next_url:
                    current_url = next_url
                    time.sleep(DELAY)
                else:
                    print(f"   ✅ Fin de la pagination (page {page_count})")
                    break
            else:
                print(f"   ✅ Fin de la pagination - Pas de bouton suivant (page {page_count})")
                break
        
        except Exception as e:
            print(f"   ⚠️  Erreur sur la page {page_count}: {e}")
            import traceback
            traceback.print_exc()
            break
    
    print(f"\n📦 Total: {len(all_links)} liens produits uniques collectés")
    return all_links


def extract_product_data(driver: webdriver.Chrome, url: str) -> Optional[Dict]:
    """
    EXTRACTION PRODUIT:
    - Visite chaque lien produit
    - Extrait: Titre (H1), Prix, Description HTML, Images, Attributs
    """
    for retry in range(MAX_RETRIES):
        try:
            driver.get(url)
            
            # Attendre que le contenu soit chargé
            try:
                WebDriverWait(driver, PAGE_TIMEOUT).until(
                    EC.presence_of_element_located((By.TAG_NAME, 'h1'))
                )
                time.sleep(1)  # Attendre le chargement JS
            except TimeoutException:
                if retry < MAX_RETRIES - 1:
                    time.sleep(2 ** retry)
                    continue
                return None
            
            # Parser avec BeautifulSoup après chargement JS
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            
            # 1. Titre (H1)
            title = None
            h1 = soup.find('h1', class_=re.compile(r'product.*title|entry-title', re.I))
            if h1:
                title = h1.get_text(strip=True)
            if not title:
                h1 = soup.find('h1')
                if h1:
                    title = h1.get_text(strip=True)
            
            if not title or len(title) < 3:
                return None
            
            # 2. Nom et slug
            name = title
            slug = slugify(title)
            
            # 3. Prix (Nettoyer le format)
            price = 0.0
            price_elem = soup.find('span', class_=re.compile(r'price|woocommerce-Price-amount', re.I))
            if price_elem:
                price_text = price_elem.get_text(strip=True)
                # Extraire le nombre (ex: "84,00 €" -> 84.00)
                price_match = re.search(r'([\d,]+\.?\d*)', price_text.replace(',', '.'))
                if price_match:
                    try:
                        price = float(price_match.group(1).replace(',', '.'))
                    except:
                        pass
            
            # 4. Description HTML complète (#tab-description ou .description)
            description = ''
            desc_elem = soup.find('div', id='tab-description')
            if desc_elem:
                description = str(desc_elem)
            else:
                desc_elem = soup.find('div', class_=re.compile(r'description|woocommerce-product-details__short-description', re.I))
                if desc_elem:
                    description = str(desc_elem)
                elif soup.find('div', id='product-description'):
                    description = str(soup.find('div', id='product-description'))
            
            # 5. Images: cibler UNIQUEMENT la galerie WooCommerce principale
            image_urls = set()

            def should_keep_image(src: str) -> bool:
                """Filtre les images parasites (logos, icônes, bannières, etc.)."""
                if not src or not isinstance(src, str):
                    return False
                src_lower = src.lower()
                # Exclure les logos, icônes de paiement, sprites, placeholders, etc.
                banned_fragments = [
                    'logo',
                    'carte-',
                    'visa',
                    'mastercard',
                    'paypal',
                    'icon',
                    'sprite',
                    'placeholder',
                    'bancontact',
                    'cb-',
                    'amex',
                ]
                return not any(fragment in src_lower for fragment in banned_fragments)

            def extract_image_src(img_elem) -> Optional[str]:
                """Extrait l'URL d'image depuis un élément img avec plusieurs stratégies."""
                # Priorité 1: data-large_image (WooCommerce)
                src = img_elem.get('data-large_image')
                if src:
                    return src
                
                # Priorité 2: src standard
                src = img_elem.get('src')
                if src:
                    return src
                
                # Priorité 3: data-src (lazy loading)
                src = img_elem.get('data-src')
                if src:
                    return src
                
                # Priorité 4: srcset (première entrée)
                srcset = img_elem.get('data-srcset') or img_elem.get('srcset')
                if srcset:
                    first_entry = srcset.split(',')[0].strip().split(' ')[0]
                    if first_entry:
                        return first_entry
                
                return None

            # STRATÉGIE 1: Sélecteurs WooCommerce prioritaires
            gallery_selectors = [
                '.woocommerce-product-gallery__image img',
                '.woocommerce-product-gallery img',
                '.product-gallery img',
                '.product-images img',
                'div.product-images img',
                'div.images img',
            ]
            
            for selector in gallery_selectors:
                gallery_imgs = soup.select(selector)
                for img in gallery_imgs:
                    src = extract_image_src(img)
                    if not src:
                        continue
                    
                    if src.startswith('/'):
                        src = urljoin(BASE_URL, src)
                    
                    if not should_keep_image(src):
                        continue
                    
                    image_urls.add(src)
                
                if image_urls:  # Si on a trouvé des images, arrêter
                    break

            # STRATÉGIE 2: Fallback - Chercher dans le contenu principal (wp-content/uploads)
            if not image_urls:
                content_imgs = soup.find_all('img', src=re.compile(r'wp-content/uploads', re.I))
                for img in content_imgs[:10]:  # Augmenter à 10 images
                    src = extract_image_src(img)
                    if not src:
                        continue
                    
                    if src.startswith('/'):
                        src = urljoin(BASE_URL, src)
                    
                    if not should_keep_image(src):
                        continue
                    
                    image_urls.add(src)

            # STRATÉGIE 3: Fallback ultime - Toutes les images dans la zone produit (sauf header/footer)
            if not image_urls:
                # Chercher dans la zone produit principale
                product_area = soup.find('div', class_=re.compile(r'product|single-product', re.I))
                if product_area:
                    all_imgs = product_area.find_all('img')
                    for img in all_imgs[:15]:  # Limiter à 15 images
                        src = extract_image_src(img)
                        if not src:
                            continue
                        
                        if src.startswith('/'):
                            src = urljoin(BASE_URL, src)
                        
                        # Vérifier que c'est une vraie image produit (taille raisonnable, pas un sprite)
                        if not should_keep_image(src):
                            continue
                        
                        # Exclure les très petites images (probablement des icônes)
                        width = img.get('width')
                        height = img.get('height')
                        if width and height:
                            try:
                                w, h = int(width), int(height)
                                if w < 50 or h < 50:  # Ignorer les images < 50px
                                    continue
                            except:
                                pass
                        
                        image_urls.add(src)
            
            # 6. Catégorie
            category = ''
            cat_elem = soup.find('span', class_=re.compile(r'posted_in|product.*category', re.I))
            if cat_elem:
                cat_link = cat_elem.find('a')
                if cat_link:
                    category = cat_link.get_text(strip=True)
            
            # 7. SKU
            sku = ''
            sku_elem = soup.find('span', class_=re.compile(r'sku', re.I))
            if sku_elem:
                sku = sku_elem.get_text(strip=True)
            else:
                sku_attr = soup.find(attrs={'data-product-sku': True})
                if sku_attr:
                    sku = sku_attr.get('data-product-sku', '')
            
            # 8. Stock
            in_stock = True
            stock_elem = soup.find('p', class_=re.compile(r'stock|availability', re.I))
            if stock_elem:
                stock_text = stock_elem.get_text(strip=True).lower()
                if 'rupture' in stock_text or 'out of stock' in stock_text or 'indisponible' in stock_text:
                    in_stock = False
            
            # 9. Attributs: Tableaux de caractéristiques
            attributes = {}
            attr_table = soup.find('table', class_=re.compile(r'attributes|variations', re.I))
            if attr_table:
                rows = attr_table.find_all('tr')
                for row in rows:
                    th = row.find('th')
                    td = row.find('td')
                    if th and td:
                        key = th.get_text(strip=True).lower()
                        value = td.get_text(strip=True)
                        attributes[key] = value
            
            # 10. Badges (Nouveau, En solde)
            is_new = False
            is_on_sale = False
            badge_elems = soup.find_all(['span', 'div'], class_=re.compile(r'badge|label|tag', re.I))
            for badge in badge_elems:
                badge_text = badge.get_text(strip=True).lower()
                if 'nouveau' in badge_text or 'new' in badge_text:
                    is_new = True
                if 'solde' in badge_text or 'sale' in badge_text or 'promo' in badge_text:
                    is_on_sale = True
            
            return {
                'id': f'prod-{slug}',
                'name': name,
                'slug': slug,
                'title': title,
                'price': price,
                'description': description,
                'images_urls': list(image_urls),  # URLs brutes pour téléchargement
                'category': category,
                'sku': sku,
                'inStock': in_stock,
                'isNew': is_new,
                'isOnSale': is_on_sale,
                'attributes': attributes,
                'source_url': url,
            }
        
        except Exception as e:
            if retry < MAX_RETRIES - 1:
                time.sleep(2 ** retry)
                continue
            print(f"   ⚠️  Erreur lors de l'extraction de {url}: {e}")
            return None
    
    return None


def download_product_images(product: Dict, product_slug: str) -> List[str]:
    """
    GESTION DES IMAGES:
    - Télécharge physiquement chaque image trouvée
    - Sauvegarde dans public/images/products/{slug}/
    - Nomme les fichiers proprement (image-1.jpg, image-2.jpg)
    """
    product_images_dir = IMAGES_BASE_DIR / product_slug
    local_images = []
    image_urls = product.get('images_urls', [])
    
    for idx, img_url in enumerate(image_urls, 1):
        if not img_url:
            continue
        
        # Nommer les fichiers proprement: image-1.jpg, image-2.jpg
        filename = f'image-{idx}.jpg'
        destination = product_images_dir / filename
        
        # Télécharger l'image
        if download_image(img_url, destination):
            local_path = f'/images/products/{product_slug}/{filename}'
            local_images.append(local_path)
            time.sleep(0.3)  # Délai entre téléchargements d'images
    
    return local_images


def save_progress(products: List[Dict], output_file: Path):
    """Sauvegarde progressive des produits"""
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    output_data = {
        'products': products,
        'total': len(products),
        'scraped_at': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)


def main():
    """Fonction principale"""
    print("="*70)
    print("🌐 SCRAPER KHASHIKA SELENIUM ULTIME")
    print("="*70)
    print(f"📡 URL source: {START_URL}")
    print(f"💾 Sortie JSON: {OUTPUT_JSON}")
    print(f"📷 Dossier images: {IMAGES_BASE_DIR}")
    print()
    
    # Initialiser le driver
    # Pour debug: mettre HEADLESS=false pour voir ce qui se passe
    # Pour debug avancé: mettre DEBUG=true pour sauvegarder screenshots et HTML
    headless_mode = os.getenv('HEADLESS', 'true').lower() == 'true'
    debug_mode = os.getenv('DEBUG', 'false').lower() == 'true'
    print(f"🚀 Initialisation du navigateur {'headless' if headless_mode else 'visible'}...")
    if debug_mode:
        print("🔍 Mode DEBUG activé (screenshots et HTML seront sauvegardés)")
    driver = setup_driver(headless=headless_mode)
    
    try:
        # Initialisation
        all_products = []
        errors = []
        
        # ÉTAPE 1: Collecter tous les liens produits (pagination)
        all_product_links = collect_all_product_links(driver, headless_mode)
        
        if not all_product_links:
            print("❌ Aucun lien produit trouvé. Arrêt du scraping.")
            return
        
        print()
        
        # ÉTAPE 2: Scraper chaque produit
        print("🔍 ÉTAPE 2: Scraping des pages produits...")
        start_time = time.time()
        
        # Barre de progression
        with tqdm(total=len(all_product_links), desc="Scraping produits", unit="produit") as pbar:
            for idx, product_url in enumerate(all_product_links, 1):
                pbar.set_description(f"Produit {idx}/{len(all_product_links)}")
                
                product_data = extract_product_data(driver, product_url)
                
                if not product_data:
                    errors.append(f"Produit {idx}: Impossible d'extraire les données de {product_url}")
                    pbar.update(1)
                    continue
                
                # Télécharger les images
                product_slug = product_data['slug']
                local_images = download_product_images(product_data, product_slug)
                
                if local_images:
                    product_data['images'] = local_images
                    product_data['image'] = local_images[0] if local_images else '/placeholder-image.svg'
                    product_data['image_url'] = local_images[0] if local_images else ''
                else:
                    product_data['images'] = ['/placeholder-image.svg']
                    product_data['image'] = '/placeholder-image.svg'
                    product_data['image_url'] = ''
                
                # Nettoyer les données
                del product_data['images_urls']  # Plus besoin des URLs brutes
                
                all_products.append(product_data)
                
                # Sauvegarde progressive
                if idx % SAVE_INTERVAL == 0:
                    save_progress(all_products, OUTPUT_JSON)
                    elapsed = time.time() - start_time
                    remaining = (elapsed / idx) * (len(all_product_links) - idx)
                    pbar.set_postfix({
                        'sauvegardé': f'{idx}/{len(all_product_links)}',
                        'temps restant': f'~{int(remaining/60)}min'
                    })
                
                time.sleep(DELAY)
                pbar.update(1)
        
        print()
        
        # ÉTAPE 3: Sauvegarde finale
        print("💾 ÉTAPE 3: Sauvegarde finale...")
        save_progress(all_products, OUTPUT_JSON)
        print(f"✅ Fichier sauvegardé: {OUTPUT_JSON}")
        
        # ÉTAPE 4: Génération du rapport
        print("\n📊 ÉTAPE 4: Génération du rapport...")
        elapsed_time = time.time() - start_time
        
        report = f"""
{'='*70}
RAPPORT DE SCRAPING KHASHIKA (SELENIUM ULTIME)
{'='*70}

Date: {time.strftime('%Y-%m-%d %H:%M:%S')}
URL source: {START_URL}

STATISTIQUES:
- Produits trouvés: {len(all_product_links)}
- Produits scrapés avec succès: {len(all_products)}
- Produits avec images: {len([p for p in all_products if p.get('images') and len(p['images']) > 0 and p['images'][0] != '/placeholder-image.svg'])}
- Images téléchargées: {sum(len(p.get('images', [])) for p in all_products)}
- Erreurs rencontrées: {len(errors)}

Temps total: {int(elapsed_time/60)}min {int(elapsed_time%60)}s
Vitesse moyenne: {len(all_products)/elapsed_time*60:.1f} produits/minute

FICHIERS GÉNÉRÉS:
- JSON: {OUTPUT_JSON} ({len(all_products)} produits)
- Images: {IMAGES_BASE_DIR} ({sum(len(p.get('images', [])) for p in all_products)} fichiers)

"""
        
        if errors:
            report += f"\nERREURS ({len(errors)}):\n"
            for error in errors[:20]:  # Limiter à 20 erreurs
                report += f"  - {error}\n"
            if len(errors) > 20:
                report += f"  ... et {len(errors) - 20} autres erreurs\n"
        
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            f.write(report)
        
        print(f"✅ Rapport sauvegardé: {REPORT_FILE}")
        
        # Résumé final
        print("\n" + "="*70)
        print("✅ SCRAPING TERMINÉ!")
        print("="*70)
        print(f"📦 {len(all_products)} produits scrapés")
        print(f"📷 {sum(len(p.get('images', [])) for p in all_products)} images téléchargées")
        print(f"⏱️  Temps: {int(elapsed_time/60)}min {int(elapsed_time%60)}s")
        print(f"💾 Fichier: {OUTPUT_JSON}")
        print(f"📊 Rapport: {REPORT_FILE}")
        print("="*70)
    
    finally:
        # Fermer le driver
        driver.quit()
        print("\n🔒 Navigateur fermé")


if __name__ == '__main__':
    main()
