#!/usr/bin/env python3
"""
Scrape les pages produits depuis khashika.com et télécharge les images.
Met à jour products-ultimate.json avec les nouvelles URLs d'images.
"""

import json
import requests
import time
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse
from datetime import datetime
from bs4 import BeautifulSoup

# Configuration
PRODUCTS_JSON = Path("lib/data/products-ultimate.json")
IMAGES_DIR = Path("public/images/products")
ERRORS_FILE = Path("data/scraping_errors.json")
DELAY_BETWEEN_REQUESTS = 0.5
MAX_RETRIES = 2
TIMEOUT = 10

def get_file_extension(url: str) -> str:
    """Détermine l'extension du fichier depuis l'URL."""
    parsed = urlparse(url)
    path = Path(parsed.path)
    ext = path.suffix.lower()
    
    # Normaliser
    if ext in ['.jpg', '.jpeg']:
        return '.jpg'
    elif ext == '.png':
        return '.png'
    elif ext == '.webp':
        return '.webp'
    else:
        return '.jpg'  # Par défaut

def download_image(image_url: str, output_path: Path) -> bool:
    """Télécharge une image depuis une URL."""
    try:
        response = requests.get(image_url, timeout=30, stream=True)
        response.raise_for_status()
        
        # Créer le dossier parent si nécessaire
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Sauvegarder l'image
        with open(output_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        return True
        
    except Exception as e:
        return False

def extract_image_url(soup: BeautifulSoup) -> str | None:
    """Extrait l'URL de l'image principale depuis le HTML."""
    # Priorité 1: .woocommerce-product-gallery__image img
    img = soup.select_one('.woocommerce-product-gallery__image img')
    if img:
        img_url = img.get('src') or img.get('data-src') or img.get('data-large_image')
        if img_url:
            return urljoin('https://www.khashika.com', img_url)
    
    # Priorité 2: img.wp-post-image
    img = soup.select_one('img.wp-post-image')
    if img:
        img_url = img.get('src') or img.get('data-src')
        if img_url:
            return urljoin('https://www.khashika.com', img_url)
    
    # Priorité 3: .product-images img
    img = soup.select_one('.product-images img')
    if img:
        img_url = img.get('src') or img.get('data-src')
        if img_url:
            return urljoin('https://www.khashika.com', img_url)
    
    # Priorité 4: Premier img avec wp-content/uploads
    for img in soup.find_all('img'):
        src = img.get('src', '')
        if 'wp-content/uploads' in src:
            return urljoin('https://www.khashika.com', src)
    
    return None

def try_url_variants(slug: str) -> list[str]:
    """Génère des variantes d'URL pour un slug."""
    variants = [
        f"https://www.khashika.com/produit/{slug}/",
        f"https://www.khashika.com/produit/{slug}",
        f"https://www.khashika.com/produit/{slug.replace('-', '_')}/",
    ]
    return variants

def scrape_product_page(product: dict) -> tuple[str | None, str | None]:
    """Scrape une page produit et retourne l'URL de l'image."""
    slug = product.get('slug', '')
    source_url = product.get('source_url', '')
    
    # Utiliser source_url si disponible, sinon construire
    urls_to_try = []
    if source_url:
        urls_to_try.append(source_url)
    else:
        urls_to_try.extend(try_url_variants(slug))
    
    for url in urls_to_try:
        for attempt in range(MAX_RETRIES + 1):
            try:
                response = requests.get(url, timeout=TIMEOUT)
                
                if response.status_code == 200:
                    soup = BeautifulSoup(response.text, 'html.parser')
                    image_url = extract_image_url(soup)
                    
                    if image_url:
                        return image_url, url
                    else:
                        # Image non trouvée sur cette page
                        break
                
                elif response.status_code == 404:
                    # Essayer la variante suivante
                    break
                
                else:
                    # Erreur serveur, réessayer
                    if attempt < MAX_RETRIES:
                        time.sleep(1)
                        continue
                    break
                    
            except requests.Timeout:
                if attempt < MAX_RETRIES:
                    time.sleep(1)
                    continue
                break
            except Exception as e:
                if attempt < MAX_RETRIES:
                    time.sleep(1)
                    continue
                break
    
    return None, None

def main():
    """Fonction principale."""
    start_time = datetime.now()
    
    print("=" * 60)
    print("🌐 SCRAPING ET TÉLÉCHARGEMENT DEPUIS KHASHIKA.COM")
    print("=" * 60)
    print()
    
    # Vérifier que le fichier existe
    if not PRODUCTS_JSON.exists():
        print(f"❌ Fichier {PRODUCTS_JSON} introuvable.")
        return
    
    # Charger les produits
    print(f"📂 Chargement de {PRODUCTS_JSON}...")
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"✓ {len(products)} produits chargés")
    print()
    
    # Créer le dossier images si nécessaire
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    ERRORS_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Créer une sauvegarde
    backup_path = PRODUCTS_JSON.with_suffix(PRODUCTS_JSON.suffix + ".backup")
    print(f"💾 Création de la sauvegarde: {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print()
    
    print(f"📊 {len(products)} produits à traiter")
    print()
    
    # Traiter chaque produit
    success_count = 0
    failed_count = 0
    errors = []
    updated_products = []
    
    for i, product in enumerate(products, 1):
        slug = product.get('slug', '')
        name = product.get('name', product.get('title', ''))
        
        if not slug:
            print(f"  [{i:03d}/{len(products)}] ⚠ Produit sans slug: {name[:40]}")
            failed_count += 1
            errors.append({
                "product": name,
                "slug": slug,
                "error": "slug manquant"
            })
            continue
        
        print(f"  [{i:03d}/{len(products)}] {name[:40]}...", end=" ")
        
        # Scraper la page
        image_url, page_url = scrape_product_page(product)
        
        if not image_url:
            print("❌ Image non trouvée")
            failed_count += 1
            errors.append({
                "product": name,
                "slug": slug,
                "url_tried": page_url or f"https://www.khashika.com/produit/{slug}/",
                "error": "image non trouvée sur la page"
            })
            time.sleep(DELAY_BETWEEN_REQUESTS)
            continue
        
        # Déterminer l'extension
        ext = get_file_extension(image_url)
        output_path = IMAGES_DIR / f"{slug}{ext}"
        
        # Vérifier si l'image existe déjà
        if output_path.exists():
            print(f"⊘ Déjà existant: {slug}{ext}")
            # Mettre à jour quand même le JSON
            new_image_url = f"/images/products/{slug}{ext}"
            product['image_url'] = new_image_url
            product['image'] = new_image_url
            if 'images' in product and len(product['images']) > 0:
                product['images'][0] = new_image_url
            updated_products.append(product)
            success_count += 1
            time.sleep(DELAY_BETWEEN_REQUESTS)
            continue
        
        # Télécharger l'image
        success = download_image(image_url, output_path)
        
        if success:
            # Mettre à jour le JSON
            new_image_url = f"/images/products/{slug}{ext}"
            product['image_url'] = new_image_url
            product['image'] = new_image_url
            if 'images' in product and len(product['images']) > 0:
                product['images'][0] = new_image_url
            
            updated_products.append(product)
            success_count += 1
            
            filename = Path(urlparse(image_url).path).name
            print(f"✓ → {slug}{ext}")
            print(f"      URL: {page_url or 'N/A'}")
            print(f"      Image: {filename[:50]}")
        else:
            print("❌ Échec du téléchargement")
            failed_count += 1
            errors.append({
                "product": name,
                "slug": slug,
                "image_url": image_url,
                "error": "échec du téléchargement"
            })
        
        # Délai entre requêtes
        if i < len(products):
            time.sleep(DELAY_BETWEEN_REQUESTS)
    
    # Sauvegarder les erreurs
    if errors:
        with open(ERRORS_FILE, 'w', encoding='utf-8') as f:
            json.dump(errors, f, ensure_ascii=False, indent=2)
    
    # Sauvegarder le JSON mis à jour
    print()
    print(f"💾 Sauvegarde de {PRODUCTS_JSON}...")
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Calculer le temps total
    end_time = datetime.now()
    duration = end_time - start_time
    minutes = int(duration.total_seconds() // 60)
    seconds = int(duration.total_seconds() % 60)
    
    # Rapport final
    print()
    print("=" * 60)
    print("📊 RÉSUMÉ FINAL")
    print("=" * 60)
    print(f"✓ {success_count}/{len(products)} produits traités avec succès ({success_count*100//len(products) if products else 0}%)")
    print(f"✓ {success_count} images téléchargées")
    print(f"❌ {failed_count} produits échoués")
    print(f"💾 JSON mis à jour : {PRODUCTS_JSON}")
    print(f"📁 Images : {IMAGES_DIR}")
    print(f"⏱ Temps total : {minutes} min {seconds} s")
    
    if errors:
        print()
        print(f"❌ ÉCHECS ({len(errors)}) :")
        for error in errors[:10]:  # Afficher les 10 premiers
            print(f"   {error['product'][:50]}... ({error.get('error', 'N/A')})")
        if len(errors) > 10:
            print(f"   ... et {len(errors) - 10} autres")
        print(f"   (Liste complète dans: {ERRORS_FILE})")

if __name__ == "__main__":
    main()

