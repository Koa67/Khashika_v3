#!/usr/bin/env python3
"""
Parse les fichiers HTML du clone local _LEGACY_CLONE pour extraire les correspondances Titre→Image.
Extrait toutes les pages produits et récupère titre + image pour chaque produit.
"""

import os
import json
import re
from pathlib import Path
from datetime import datetime
from bs4 import BeautifulSoup
from urllib.parse import urlparse, unquote

# Configuration
CLONE_DIR = Path("_LEGACY_CLONE")
OUTPUT_FILE = Path("data/truth_map.json")

# Titres génériques à ignorer (insensible à la casse)
GENERIC_TITLES = [
    "bijoux d'inde et ethniques",
    "khashika",
    "page d'accueil",
    "archives",
    "catégorie produit",
    "mon compte",
    "panier",
    "checkout",
    "commande"
]

def normalize_slug(text: str) -> str:
    """Normalise un texte en slug (minuscules, tirets, sans accents)."""
    # Remplacement des caractères accentués
    replacements = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n', 'ý': 'y', 'ÿ': 'y'
    }
    
    text = text.lower()
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    # Remplacement des caractères non-alphanumériques par des tirets
    text = re.sub(r'[^a-z0-9]+', '-', text)
    # Suppression des tirets en début/fin
    text = text.strip('-')
    
    return text

def is_product_page(soup: BeautifulSoup, file_path: Path) -> bool:
    """Détermine si un fichier HTML est une page produit."""
    # Vérifier le chemin
    path_str = str(file_path).lower()
    if '/produit/' in path_str or '/product/' in path_str:
        return True
    
    # Vérifier les classes CSS
    if soup.find('h1', class_=re.compile(r'product_title|product-title')):
        return True
    
    if soup.find('h1', class_='entry-title') and soup.find(class_=re.compile(r'product')):
        return True
    
    return False

def extract_title(soup: BeautifulSoup) -> str | None:
    """Extrait le titre du produit depuis le HTML."""
    # Priorité 1: h1.product_title
    title_elem = soup.find('h1', class_=re.compile(r'product_title|product-title'))
    if title_elem:
        title = title_elem.get_text(strip=True)
        if title:
            # Nettoyer les espaces multiples
            title = re.sub(r'\s+', ' ', title).strip()
            return title
    
    # Priorité 2: h1.entry-title
    title_elem = soup.find('h1', class_='entry-title')
    if title_elem:
        title = title_elem.get_text(strip=True)
        if title:
            title = re.sub(r'\s+', ' ', title).strip()
            return title
    
    return None

def extract_image(soup: BeautifulSoup) -> tuple[str | None, str | None]:
    """Extrait l'URL et le nom de fichier de l'image principale."""
    image_url = None
    image_filename = None
    
    # Priorité 1: .woocommerce-product-gallery__image img[src]
    img_elem = soup.select_one('.woocommerce-product-gallery__image img')
    if img_elem:
        image_url = img_elem.get('src') or img_elem.get('data-src')
    
    # Priorité 2: .woocommerce-product-gallery img[data-large_image]
    if not image_url:
        img_elem = soup.select_one('.woocommerce-product-gallery img[data-large_image]')
        if img_elem:
            image_url = img_elem.get('data-large_image')
    
    # Priorité 3: img.wp-post-image[src]
    if not image_url:
        img_elem = soup.find('img', class_='wp-post-image')
        if img_elem:
            image_url = img_elem.get('src')
    
    # Priorité 4: .product-images img[src]
    if not image_url:
        img_elem = soup.select_one('.product-images img')
        if img_elem:
            image_url = img_elem.get('src')
    
    # Priorité 5: Premier <img> avec "Photoroom" ou ".jpg/.jpeg" dans src
    if not image_url:
        for img_elem in soup.find_all('img'):
            src = img_elem.get('src', '')
            if src and ('photoroom' in src.lower() or '.jpg' in src.lower() or '.jpeg' in src.lower()):
                image_url = src
                break
    
    if image_url:
        # Extraire le nom de fichier
        parsed = urlparse(image_url)
        path = unquote(parsed.path)
        image_filename = Path(path).name
        
        # Si l'URL est relative, essayer de la convertir
        if not image_filename or image_filename == '/':
            # Extraire depuis le chemin complet
            image_filename = Path(path).name if path else None
    
    return image_url, image_filename

def should_ignore(title: str, image_filename: str | None) -> tuple[bool, str]:
    """Détermine si un produit doit être ignoré."""
    if not title or len(title) < 5:
        return True, "titre trop court ou vide"
    
    title_lower = title.lower()
    
    # Vérifier les titres génériques
    for generic in GENERIC_TITLES:
        if generic in title_lower:
            return True, f"titre générique: {generic}"
    
    # Vérifier l'image
    if not image_filename:
        return True, "aucune image trouvée"
    
    image_lower = image_filename.lower()
    if any(word in image_lower for word in ['logo', 'placeholder', 'default', 'icon']):
        return True, "image logo/placeholder"
    
    return False, ""

def main():
    """Fonction principale."""
    print("=" * 60)
    print("🔍 PARSING DU CLONE LOCAL _LEGACY_CLONE")
    print("=" * 60)
    print()
    
    # Vérifier que le dossier existe
    if not CLONE_DIR.exists():
        print(f"❌ Erreur : Dossier {CLONE_DIR} introuvable !")
        print("   Veuillez placer le clone à la racine du projet.")
        return
    
    print(f"📁 Scan du dossier clone...")
    print(f"✓ Dossier trouvé : {CLONE_DIR}")
    
    # Créer le dossier data si nécessaire
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    # Trouver tous les fichiers HTML
    html_files = list(CLONE_DIR.rglob("*.html"))
    print(f"✓ {len(html_files)} fichiers HTML trouvés")
    print()
    
    print("📄 Analyse des fichiers produits...")
    
    products = []
    seen_slugs = set()
    stats = {
        "total_html_files_scanned": len(html_files),
        "product_files_found": 0,
        "valid_products_extracted": 0,
        "duplicates_removed": 0,
        "ignored_generic_titles": 0,
        "ignored_no_image": 0,
        "ignored_other": 0
    }
    
    for i, html_file in enumerate(html_files, 1):
        try:
            with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            soup = BeautifulSoup(content, 'html.parser')
            
            # Vérifier si c'est une page produit
            if not is_product_page(soup, html_file):
                continue
            
            stats["product_files_found"] += 1
            
            # Extraire le titre
            title = extract_title(soup)
            if not title:
                continue
            
            # Extraire l'image
            image_url, image_filename = extract_image(soup)
            
            # Vérifier si on doit ignorer
            should_ignore_flag, ignore_reason = should_ignore(title, image_filename)
            
            if should_ignore_flag:
                if "générique" in ignore_reason:
                    stats["ignored_generic_titles"] += 1
                elif "image" in ignore_reason:
                    stats["ignored_no_image"] += 1
                else:
                    stats["ignored_other"] += 1
                
                print(f"[{i:04d}/{len(html_files)}] ⚠ IGNORÉ : {title[:40]}... ({ignore_reason})")
                continue
            
            # Créer le slug
            slug = normalize_slug(title)
            
            # Vérifier les doublons
            if slug in seen_slugs:
                stats["duplicates_removed"] += 1
                print(f"[{i:04d}/{len(html_files)}] ⚠ IGNORÉ : Doublon de \"{slug[:40]}\"")
                continue
            
            seen_slugs.add(slug)
            
            # Construire l'URL complète si nécessaire
            if image_url and not image_url.startswith('http'):
                # Essayer de construire une URL complète
                if image_url.startswith('/'):
                    image_url = f"https://www.khashika.com{image_url}"
                else:
                    image_url = f"https://www.khashika.com/wp-content/uploads/{image_filename}"
            
            # Ajouter le produit
            product = {
                "title": title,
                "slug": slug,
                "original_image_filename": image_filename,
                "original_image_url": image_url or "",
                "source_file": str(html_file.relative_to(Path.cwd()))
            }
            
            products.append(product)
            stats["valid_products_extracted"] += 1
            
            print(f"[{i:04d}/{len(html_files)}] ✓ \"{title[:40]}...\" → {image_filename[:30] if image_filename else 'N/A'}")
            
        except Exception as e:
            print(f"[{i:04d}/{len(html_files)}] ⚠ Erreur sur {html_file.name}: {e}")
            continue
    
    # Sauvegarder les résultats
    output_data = {
        "products": products,
        "metadata": {
            "extraction_date": datetime.now().isoformat(),
            **stats
        }
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    # Rapport final
    print()
    print("=" * 60)
    print("📊 RÉSUMÉ DE L'EXTRACTION")
    print("=" * 60)
    print(f"✓ {stats['valid_products_extracted']} produits valides extraits")
    print(f"⚠ {stats['duplicates_removed']} doublons supprimés")
    print(f"⚠ {stats['ignored_generic_titles']} titres génériques ignorés")
    print(f"⚠ {stats['ignored_no_image']} produits sans image")
    print(f"💾 Sauvegardé dans : {OUTPUT_FILE}")
    print()
    
    if products:
        print("📝 Exemples extraits :")
        for i, product in enumerate(products[:5], 1):
            print(f"  {i}. \"{product['title'][:50]}...\" → {product['original_image_filename'][:30] if product['original_image_filename'] else 'N/A'}")

if __name__ == "__main__":
    main()


















