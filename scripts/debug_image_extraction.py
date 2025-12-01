#!/usr/bin/env python3
"""
Script de debug pour diagnostiquer pourquoi extract_product_data ne trouve pas d'images.
Teste une page produit spécifique et affiche tous les sélecteurs testés.
"""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from scrape_khashika_selenium import setup_driver, extract_product_data, BASE_URL
from bs4 import BeautifulSoup

# URL de test (premier produit problématique)
TEST_URL = "https://www.khashika.com/produit/ce-bracelet-est-monte-sur-un-elastique-tres-solide-avec-des-pierres-naturelles-7-chakras-il-convient-a-tous-les-poignets-les-perles-sont-rondes-avec-des-nuances-differentes-pierre-de-lune/"

def debug_page_structure(driver, url):
    """Analyse la structure HTML de la page pour comprendre pourquoi les images ne sont pas trouvées."""
    print(f"\n🔍 Analyse de la structure HTML de: {url}\n")
    
    driver.get(url)
    html = driver.page_source
    soup = BeautifulSoup(html, 'html.parser')
    
    # 1. Vérifier les sélecteurs WooCommerce
    print("=" * 70)
    print("1. SÉLECTEURS WOOCOMMERCE")
    print("=" * 70)
    
    selectors_to_test = [
        '.woocommerce-product-gallery__image img',
        '.woocommerce-product-gallery img',
        '.product-gallery img',
        '.product-images img',
        'div.product-images img',
        'div.images img',
    ]
    
    for selector in selectors_to_test:
        elements = soup.select(selector)
        print(f"   {selector}: {len(elements)} éléments trouvés")
        if elements:
            for i, img in enumerate(elements[:3], 1):
                src = img.get('src') or img.get('data-src') or img.get('data-large_image')
                print(f"      [{i}] {src}")
    
    # 2. Chercher toutes les images dans wp-content/uploads
    print("\n" + "=" * 70)
    print("2. IMAGES wp-content/uploads")
    print("=" * 70)
    
    wp_images = soup.find_all('img', src=lambda x: x and 'wp-content/uploads' in x.lower())
    print(f"   Total images wp-content/uploads: {len(wp_images)}")
    for i, img in enumerate(wp_images[:10], 1):
        src = img.get('src') or img.get('data-src') or img.get('data-large_image')
        width = img.get('width', 'N/A')
        height = img.get('height', 'N/A')
        print(f"   [{i}] {src} ({width}x{height})")
    
    # 3. Chercher toutes les images dans la zone produit
    print("\n" + "=" * 70)
    print("3. ZONE PRODUIT")
    print("=" * 70)
    
    product_area = soup.find('div', class_=lambda x: x and ('product' in x.lower() or 'single-product' in x.lower()))
    if product_area:
        all_imgs = product_area.find_all('img')
        print(f"   Total images dans zone produit: {len(all_imgs)}")
        for i, img in enumerate(all_imgs[:15], 1):
            src = img.get('src') or img.get('data-src') or img.get('data-large_image')
            width = img.get('width', 'N/A')
            height = img.get('height', 'N/A')
            classes = ' '.join(img.get('class', []))
            print(f"   [{i}] {src}")
            print(f"       Classes: {classes} | Size: {width}x{height}")
    else:
        print("   ⚠️  Zone produit non trouvée")
    
    # 4. Tester extract_product_data
    print("\n" + "=" * 70)
    print("4. TEST extract_product_data()")
    print("=" * 70)
    
    result = extract_product_data(driver, url)
    if result:
        print(f"   ✅ Titre: {result.get('name', 'N/A')}")
        print(f"   📸 Images trouvées: {len(result.get('images', []))}")
        if result.get('images'):
            for i, img in enumerate(result['images'][:5], 1):
                print(f"      [{i}] {img}")
        else:
            print("   ⚠️  Aucune image trouvée")
    else:
        print("   ❌ extract_product_data() a retourné None")
    
    # 5. Sauvegarder le HTML pour inspection manuelle
    debug_file = Path('debug_product_page.html')
    with open(debug_file, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"\n💾 HTML sauvegardé dans: {debug_file}")

def main():
    print("=" * 70)
    print("🐛 DEBUG EXTRACTION D'IMAGES")
    print("=" * 70)
    
    driver = setup_driver(headless=False)  # Mode visible pour debug
    
    try:
        debug_page_structure(driver, TEST_URL)
    finally:
        input("\n⏸️  Appuyez sur Entrée pour fermer le navigateur...")
        driver.quit()

if __name__ == '__main__':
    main()





