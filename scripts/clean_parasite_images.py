#!/usr/bin/env python3
"""
Script de nettoyage des images parasites.
Supprime les références aux logos, icônes de paiement, promos, etc.
"""

import json
import os
from pathlib import Path

JSON_PATH = Path('lib/data/products-ultimate.json')

# Liste noire des mots-clés indiquant des images parasites
PARASITE_KEYWORDS = [
    'logo',
    'khashika',  # logo du site
    'cofinoga',
    'visa',
    'mastercard',
    'paypal',
    'bancontact',
    'amex',
    'cb-',
    'carte-',
    'paiement',
    'payment',
    'promo',
    'code_promo',
    'livraison',
    'garantie',
    'icon',
    'sprite',
    'banner',
    'footer',
    'header',
    'nav',
    'menu',
    'social',
    'facebook',
    'instagram',
    'twitter',
    'pinterest',
    'youtube',
    'badge',
    'trust',
    'secure',
    'ssl',
    'lock',
    'cart',
    'checkout',
]

def is_parasite_image(image_path: str) -> bool:
    """Vérifie si une image est un parasite (logo, icône, etc.)"""
    if not image_path or not isinstance(image_path, str):
        return False
    
    path_lower = image_path.lower()
    
    # Vérifier les mots-clés
    for keyword in PARASITE_KEYWORDS:
        if keyword in path_lower:
            return True
    
    # Vérifier si l'image est trop petite (probablement une icône)
    # On garde cette vérification pour plus tard si on a accès aux dimensions
    
    return False

def image_exists(image_path: str) -> bool:
    """Vérifie si l'image existe sur le disque."""
    if not image_path or not isinstance(image_path, str):
        return False
    
    # Construire le chemin complet
    if image_path.startswith('/'):
        full_path = Path('public') / image_path.lstrip('/')
    else:
        full_path = Path('public') / image_path
    
    return full_path.exists()

def clean_products():
    """Nettoie les images parasites du JSON."""
    print("=" * 70)
    print("🧹 NETTOYAGE DES IMAGES PARASITES")
    print("=" * 70)
    
    # Charger le JSON
    print("\n📂 Chargement du JSON...")
    with open(JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', data) if isinstance(data, dict) else data
    print(f"   ✅ {len(products)} produits chargés")
    
    # Statistiques
    parasites_removed = 0
    images_validated = 0
    products_without_image = 0
    images_not_found = 0
    
    # Nettoyer chaque produit
    print("\n🔍 Analyse et nettoyage des images...")
    
    for product in products:
        if not isinstance(product, dict):
            continue
        
        # Nettoyer l'image principale
        main_image = product.get('image', '') or product.get('image_url', '')
        
        # Vérifier si c'est un parasite
        if is_parasite_image(main_image):
            print(f"   ⚠️  Parasite détecté: {main_image[:60]}")
            product['image'] = ''
            product['image_url'] = ''
            parasites_removed += 1
        elif main_image:
            # Vérifier si l'image existe
            if image_exists(main_image):
                images_validated += 1
            else:
                images_not_found += 1
                # Garder le chemin mais noter qu'il n'existe pas
        
        # Nettoyer le tableau d'images
        if 'images' in product and isinstance(product['images'], list):
            clean_images = []
            for img in product['images']:
                if not img or not isinstance(img, str):
                    continue
                
                if is_parasite_image(img):
                    parasites_removed += 1
                    continue
                
                # Garder l'image (même si elle n'existe pas, on la gardera pour référence)
                clean_images.append(img)
            
            product['images'] = clean_images
            
            # Si l'image principale a été supprimée, utiliser la première du tableau
            if not product.get('image') and not product.get('image_url'):
                if clean_images:
                    product['image'] = clean_images[0]
                    product['image_url'] = clean_images[0]
                else:
                    product['image'] = '/placeholder-image.svg'
                    product['image_url'] = '/placeholder-image.svg'
                    products_without_image += 1
    
    # Sauvegarder
    print("\n💾 Sauvegarde...")
    with open(JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("   ✅ JSON sauvegardé")
    
    # Rapport
    print("\n" + "=" * 70)
    print("✅ NETTOYAGE TERMINÉ")
    print("=" * 70)
    print(f"   📊 Produits traités: {len(products)}")
    print(f"   🗑️  Images parasites supprimées: {parasites_removed}")
    print(f"   ✅ Images validées: {images_validated}")
    print(f"   ⚠️  Images non trouvées sur disque: {images_not_found}")
    print(f"   🖼️  Produits avec placeholder: {products_without_image}")
    print("=" * 70)

if __name__ == '__main__':
    clean_products()



















