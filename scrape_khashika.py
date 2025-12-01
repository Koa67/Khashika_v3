#!/usr/bin/env python3
"""
Scraper complet pour récupérer TOUS les produits du site Khashika
Source: https://www.khashika.com/eboutique-bijoux-indiens/
Objectif: 726 produits avec données complètes et images
"""

import json
import os
import re
import time
import requests
from pathlib import Path
from typing import Dict, List, Optional, Set
from urllib.parse import urljoin, urlparse, parse_qs
from bs4 import BeautifulSoup
import urllib3

# Désactiver les warnings SSL
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Configuration
BASE_URL = 'https://www.khashika.com'
START_URL = 'https://www.khashika.com/eboutique-bijoux-indiens/'
OUTPUT_JSON = Path('lib/data/products-scraped.json')
IMAGES_DIR = Path('public/images/products')
REPORT_FILE = Path('scraping_report.txt')
DELAY = 0.8  # Délai entre requêtes (secondes)
MAX_RETRIES = 3
SAVE_INTERVAL = 50  # Sauvegarder tous les 50 produits

# Headers réalistes
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Accept-Encoding': 'gzip, deflate, br',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    'Referer': BASE_URL,
}

# Session pour réutiliser les connexions
session = requests.Session()
session.headers.update(HEADERS)


def slugify(text: str) -> str:
    """Convertit un texte en slug"""
    if not text:
        return ''
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    return text.strip('-')


def fetch_url(url: str, retries: int = MAX_RETRIES) -> Optional[str]:
    """Récupère le contenu HTML d'une URL avec retry"""
    for attempt in range(retries):
        try:
            response = session.get(url, verify=False, timeout=15)
            response.raise_for_status()
            return response.text
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)  # Backoff exponentiel
                continue
            else:
                print(f"   ⚠️  Erreur fetch {url} (tentative {attempt + 1}/{retries}): {e}")
                return None
    return None


def download_image(url: str, destination: Path) -> bool:
    """Télécharge une image depuis une URL"""
    try:
        response = session.get(url, verify=False, timeout=15, stream=True)
        response.raise_for_status()
        
        with open(destination, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        return True
    except Exception as e:
        print(f"   ⚠️  Erreur téléchargement image {url}: {e}")
        return False


def find_all_product_links(html: str) -> List[str]:
    """Trouve tous les liens produits sur une page"""
    soup = BeautifulSoup(html, 'html.parser')
    links = []
    seen = set()
    
    # Méthode 1: Liens avec classe woocommerce-LoopProduct-link
    product_links = soup.find_all('a', class_=re.compile(r'woocommerce-LoopProduct-link', re.I))
    for link in product_links:
        href = link.get('href', '').strip()
        if href and href not in seen:
            if href.startswith('/'):
                full_url = urljoin(BASE_URL, href)
            elif href.startswith('http'):
                if BASE_URL in href:
                    full_url = href
                else:
                    continue
            else:
                full_url = urljoin(BASE_URL, href)
            
            if full_url not in seen:
                seen.add(full_url)
                links.append(full_url)
    
    # Méthode 2: Liens contenant /produit/ ou /product/
    if not links:
        all_links = soup.find_all('a', href=re.compile(r'/produit/|/product/', re.I))
        for link in all_links:
            href = link.get('href', '').strip()
            if href:
                if href.startswith('/'):
                    full_url = urljoin(BASE_URL, href)
                elif href.startswith('http') and BASE_URL in href:
                    full_url = href
                else:
                    continue
                
                if full_url not in seen:
                    seen.add(full_url)
                    links.append(full_url)
    
    return links


def find_next_page_url(html: str, current_url: str) -> Optional[str]:
    """Trouve l'URL de la page suivante"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # Chercher les liens "Suivant" ou "Next"
    next_links = soup.find_all('a', href=True, string=re.compile(r'Suivant|Next|›|»', re.I))
    if next_links:
        for link in next_links:
            href = link.get('href', '')
            if href:
                if href.startswith('/'):
                    return urljoin(BASE_URL, href)
                elif href.startswith('http') and BASE_URL in href:
                    return href
    
    # Chercher par numéro de page
    page_links = soup.find_all('a', href=re.compile(r'page/\d+|paged=\d+|p=\d+', re.I))
    if page_links:
        # Extraire le numéro de page actuel
        current_page = 1
        page_match = re.search(r'page/(\d+)|paged=(\d+)|p=(\d+)', current_url)
        if page_match:
            current_page = int(page_match.group(1) or page_match.group(2) or page_match.group(3) or 1)
        
        # Trouver la page suivante
        for link in page_links:
            href = link.get('href', '')
            page_match = re.search(r'page/(\d+)|paged=(\d+)|p=(\d+)', href)
            if page_match:
                next_page = int(page_match.group(1) or page_match.group(2) or page_match.group(3) or 1)
                if next_page == current_page + 1:
                    if href.startswith('/'):
                        return urljoin(BASE_URL, href)
                    elif href.startswith('http') and BASE_URL in href:
                        return href
    
    return None


def extract_product_data(html: str, url: str) -> Optional[Dict]:
    """Extrait toutes les données d'un produit depuis sa page"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # 1. Titre (H1 ou .product-title)
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
    
    # 2. Nom (slugifié depuis le titre)
    name = title
    slug = slugify(title)
    
    # 3. Prix
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
    
    # 4. Description HTML complète
    description = ''
    desc_elem = soup.find('div', class_=re.compile(r'product.*description|entry-content|woocommerce-product-details', re.I))
    if desc_elem:
        description = str(desc_elem)
    elif soup.find('div', id='product-description'):
        description = str(soup.find('div', id='product-description'))
    
    # 5. Images (TOUTES les images du produit)
    images = []
    image_urls = set()
    
    # Galerie WooCommerce
    gallery = soup.find('div', class_=re.compile(r'woocommerce-product-gallery|product.*gallery', re.I))
    if gallery:
        imgs = gallery.find_all('img')
        for img in imgs:
            src = img.get('src') or img.get('data-src') or img.get('data-large_image') or img.get('data-srcset', '').split(',')[0].strip().split(' ')[0]
            if src and src not in image_urls:
                if src.startswith('http'):
                    image_urls.add(src)
                elif src.startswith('/'):
                    image_urls.add(urljoin(BASE_URL, src))
    
    # Images dans le contenu
    content_imgs = soup.find_all('img', src=re.compile(r'wp-content/uploads|product', re.I))
    for img in content_imgs:
        src = img.get('src') or img.get('data-src')
        if src:
            if src.startswith('http'):
                if src not in image_urls:
                    image_urls.add(src)
            elif src.startswith('/'):
                full_url = urljoin(BASE_URL, src)
                if full_url not in image_urls:
                    image_urls.add(full_url)
    
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
        # Chercher dans data-product-sku
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
    
    # 9. Badges (Nouveau, En solde)
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
        'source_url': url,
    }


def download_product_images(product: Dict, product_slug: str) -> List[str]:
    """Télécharge toutes les images d'un produit et retourne les chemins locaux"""
    if not IMAGES_DIR.exists():
        IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    local_images = []
    image_urls = product.get('images_urls', [])
    
    for idx, img_url in enumerate(image_urls):
        if not img_url:
            continue

        # Nom de fichier basé sur le slug du produit
        if idx == 0:
            filename = f'{product_slug}.jpg'
        else:
            filename = f'{product_slug}-{idx}.jpg'
        
        destination = IMAGES_DIR / filename
        
        # Télécharger l'image
        if download_image(img_url, destination):
            local_path = f'/images/products/{filename}'
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
    print("🌐 SCRAPER KHASHIKA - Récupération complète des produits")
    print("="*70)
    print(f"📡 URL source: {START_URL}")
    print(f"💾 Sortie JSON: {OUTPUT_JSON}")
    print(f"📷 Dossier images: {IMAGES_DIR}")
    print()
    
    # Initialisation
    all_products = []
    all_product_links = []
    visited_pages = set()
    visited_products = set()
    errors = []
    
    # Étape 1: Parcourir toutes les pages de pagination
    print("📄 ÉTAPE 1: Récupération de toutes les pages produits...")
    current_url = START_URL
    page_count = 0
    
    while current_url and page_count < 200:  # Limite de sécurité
        if current_url in visited_pages:
            break
        
        visited_pages.add(current_url)
        page_count += 1
        
        print(f"   📄 Page {page_count}: {current_url}")
        
        html = fetch_url(current_url)
        if not html:
            errors.append(f"Impossible de charger la page {page_count}")
            break
        
        # Extraire les liens produits
        product_links = find_all_product_links(html)
        print(f"   📦 {len(product_links)} produits trouvés sur cette page")
        
        for link in product_links:
            if link not in visited_products:
                visited_products.add(link)
                all_product_links.append(link)
        
        # Chercher la page suivante
        next_url = find_next_page_url(html, current_url)
        if next_url and next_url != current_url:
            current_url = next_url
            time.sleep(DELAY)
        else:
            print(f"   ✅ Fin de la pagination (page {page_count})")
            break
    
    print(f"\n📦 Total: {len(all_product_links)} liens produits uniques collectés")
    print()
    
    # Étape 2: Scraper chaque produit
    print("🔍 ÉTAPE 2: Scraping des pages produits...")
    start_time = time.time()
    
    for idx, product_url in enumerate(all_product_links, 1):
        print(f"   [{idx}/{len(all_product_links)}] Scraping: {product_url[:80]}...", end=' ')
        
        html = fetch_url(product_url)
        if not html:
            errors.append(f"Produit {idx}: Impossible de charger {product_url}")
            print("❌")
            continue
        
        product_data = extract_product_data(html, product_url)
        if not product_data:
            errors.append(f"Produit {idx}: Impossible d'extraire les données")
            print("❌")
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
        
        images_count = len(local_images)
        print(f"✅ ({images_count} image{'s' if images_count != 1 else ''})")
        
        # Sauvegarde progressive
        if idx % SAVE_INTERVAL == 0:
            save_progress(all_products, OUTPUT_JSON)
            elapsed = time.time() - start_time
            remaining = (elapsed / idx) * (len(all_product_links) - idx)
            print(f"   💾 Sauvegarde intermédiaire ({idx} produits) - Temps restant: ~{int(remaining/60)}min")
        
        time.sleep(DELAY)
    
    print()
    
    # Étape 3: Sauvegarde finale
    print("💾 ÉTAPE 3: Sauvegarde finale...")
    save_progress(all_products, OUTPUT_JSON)
    print(f"✅ Fichier sauvegardé: {OUTPUT_JSON}")
    
    # Étape 4: Génération du rapport
    print("\n📊 ÉTAPE 4: Génération du rapport...")
    elapsed_time = time.time() - start_time
    
    report = f"""
{'='*70}
RAPPORT DE SCRAPING KHASHIKA
{'='*70}

Date: {time.strftime('%Y-%m-%d %H:%M:%S')}
URL source: {START_URL}

STATISTIQUES:
- Pages parcourues: {page_count}
- Produits trouvés: {len(all_product_links)}
- Produits scrapés avec succès: {len(all_products)}
- Produits avec images: {len([p for p in all_products if p.get('images') and len(p['images']) > 0 and p['images'][0] != '/placeholder-image.svg'])}
- Images téléchargées: {sum(len(p.get('images', [])) for p in all_products)}
- Erreurs rencontrées: {len(errors)}

Temps total: {int(elapsed_time/60)}min {int(elapsed_time%60)}s
Vitesse moyenne: {len(all_products)/elapsed_time*60:.1f} produits/minute

FICHIERS GÉNÉRÉS:
- JSON: {OUTPUT_JSON} ({len(all_products)} produits)
- Images: {IMAGES_DIR} ({sum(len(p.get('images', [])) for p in all_products)} fichiers)

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


if __name__ == '__main__':
    main()
