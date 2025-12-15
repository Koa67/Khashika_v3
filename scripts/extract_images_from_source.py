#!/usr/bin/env python3
"""
KHASHIKA - Extraction des images depuis les fichiers HTML legacy
================================================================
Extrait les vraies URLs d'images depuis _LEGACY_CLONE en utilisant source_url
de chaque produit pour localiser le fichier HTML correspondant.

Usage: python scripts/extract_images_from_source.py
Output: data/image_mapping.json
"""

import json
import os
import re
from urllib.parse import urlparse, unquote
from bs4 import BeautifulSoup
from pathlib import Path

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
PRODUCTS_JSON = PROJECT_ROOT / "lib" / "data" / "products-ultimate.json"
LEGACY_CLONE = PROJECT_ROOT / "_LEGACY_CLONE" / "www.khashika.com"
OUTPUT_FILE = PROJECT_ROOT / "data" / "image_mapping.json"


def source_url_to_local_path(source_url: str) -> Path:
    """
    Convertit une source_url en chemin local vers le fichier HTML.

    Ex: https://www.khashika.com/produit/sac-indien/
        -> _LEGACY_CLONE/www.khashika.com/produit/sac-indien/index.html
    """
    parsed = urlparse(source_url)
    path = parsed.path.strip('/')

    # Nettoyer le path
    path = unquote(path)  # Décoder les caractères URL encodés

    # Construire le chemin local
    local_path = LEGACY_CLONE / path / "index.html"

    return local_path


def extract_image_from_html(html_path: Path) -> dict:
    """
    Parse le fichier HTML et extrait l'image principale du produit.

    Stratégies d'extraction (par ordre de priorité):
    1. div.product_image[data-original]
    2. img.wp-post-image[data-large_image]
    3. img.wp-post-image[data-src]
    4. JSON-LD schema (thumbnailUrl ou image.url)
    5. a.zoom[href] contenant wp-content/uploads
    """
    result = {
        "found": False,
        "image_url": None,
        "extraction_method": None,
        "all_images": []
    }

    if not html_path.exists():
        return result

    try:
        with open(html_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        soup = BeautifulSoup(content, 'html.parser')

        # Méthode 1: div.product_image[data-original]
        product_div = soup.select_one('.product_image[data-original]')
        if product_div:
            img_url = product_div.get('data-original')
            if img_url and 'wp-content/uploads' in img_url:
                result["found"] = True
                result["image_url"] = img_url
                result["extraction_method"] = "product_image_data_original"
                result["all_images"].append(img_url)

        # Méthode 2: img.wp-post-image[data-large_image]
        if not result["found"]:
            img_tag = soup.select_one('img.wp-post-image[data-large_image]')
            if img_tag:
                img_url = img_tag.get('data-large_image')
                if img_url and 'wp-content/uploads' in img_url:
                    result["found"] = True
                    result["image_url"] = img_url
                    result["extraction_method"] = "wp_post_image_data_large"
                    result["all_images"].append(img_url)

        # Méthode 3: img.wp-post-image[data-src]
        if not result["found"]:
            img_tag = soup.select_one('img.wp-post-image[data-src]')
            if img_tag:
                img_url = img_tag.get('data-src')
                if img_url and 'wp-content/uploads' in img_url:
                    result["found"] = True
                    result["image_url"] = img_url
                    result["extraction_method"] = "wp_post_image_data_src"
                    result["all_images"].append(img_url)

        # Méthode 4: JSON-LD schema
        if not result["found"]:
            schema_scripts = soup.find_all('script', type='application/ld+json')
            for script in schema_scripts:
                try:
                    schema_data = json.loads(script.string)
                    # Chercher dans @graph
                    if isinstance(schema_data, dict) and '@graph' in schema_data:
                        for item in schema_data['@graph']:
                            if item.get('@type') == 'ImageObject':
                                img_url = item.get('url') or item.get('contentUrl')
                                if img_url and 'wp-content/uploads' in img_url:
                                    result["found"] = True
                                    result["image_url"] = img_url
                                    result["extraction_method"] = "json_ld_schema"
                                    result["all_images"].append(img_url)
                                    break
                            # Chercher thumbnailUrl dans WebPage
                            if item.get('@type') == 'WebPage':
                                thumb_url = item.get('thumbnailUrl')
                                if thumb_url and 'wp-content/uploads' in thumb_url:
                                    result["found"] = True
                                    result["image_url"] = thumb_url
                                    result["extraction_method"] = "json_ld_thumbnail"
                                    result["all_images"].append(thumb_url)
                                    break
                except (json.JSONDecodeError, TypeError):
                    continue

        # Méthode 5: a.zoom[href] avec wp-content/uploads
        if not result["found"]:
            zoom_link = soup.select_one('a.zoom[href*="wp-content/uploads"]')
            if zoom_link:
                href = zoom_link.get('href')
                # Convertir chemin relatif en URL absolue
                if href.startswith('../../'):
                    img_url = f"https://www.khashika.com/{href.replace('../../', '')}"
                elif href.startswith('/'):
                    img_url = f"https://www.khashika.com{href}"
                else:
                    img_url = href

                if 'wp-content/uploads' in img_url:
                    result["found"] = True
                    result["image_url"] = img_url
                    result["extraction_method"] = "zoom_link_href"
                    result["all_images"].append(img_url)

        # Collecter toutes les images de la galerie
        gallery_images = soup.select('.views-gallery img, .woocommerce-product-gallery img')
        for img in gallery_images:
            for attr in ['data-large_image', 'data-src', 'src']:
                img_url = img.get(attr)
                if img_url and 'wp-content/uploads' in img_url:
                    # Convertir en URL absolue si nécessaire
                    if img_url.startswith('../../'):
                        img_url = f"https://www.khashika.com/{img_url.replace('../../', '')}"
                    if img_url not in result["all_images"]:
                        result["all_images"].append(img_url)

    except Exception as e:
        result["error"] = str(e)

    return result


def extract_filename_from_url(url: str) -> str:
    """Extrait le nom de fichier d'une URL."""
    if not url:
        return ""
    parsed = urlparse(url)
    path = unquote(parsed.path)
    return os.path.basename(path)


def main():
    print("=" * 70)
    print("KHASHIKA - Extraction des images depuis les fichiers HTML legacy")
    print("=" * 70)
    print()

    # Vérifications préliminaires
    if not PRODUCTS_JSON.exists():
        print(f"ERREUR: Fichier non trouvé: {PRODUCTS_JSON}")
        return

    if not LEGACY_CLONE.exists():
        print(f"ERREUR: Dossier non trouvé: {LEGACY_CLONE}")
        return

    # Charger les produits
    print(f"Chargement de {PRODUCTS_JSON}...")
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)

    total = len(products)
    print(f"Nombre de produits: {total}")
    print()

    # Stats
    stats = {
        "total": total,
        "found": 0,
        "not_found": 0,
        "html_missing": 0,
        "extraction_errors": 0,
        "by_method": {}
    }

    mappings = []

    # Traiter chaque produit
    for idx, product in enumerate(products, 1):
        product_id = product.get('id', 'unknown')
        name = product.get('name', 'Sans nom')
        source_url = product.get('source_url', '')
        current_image = product.get('image', '')

        # Convertir source_url en chemin local
        local_html = source_url_to_local_path(source_url) if source_url else None

        # Extraire l'image
        if local_html and local_html.exists():
            extraction = extract_image_from_html(local_html)
        else:
            extraction = {"found": False, "html_missing": True}
            stats["html_missing"] += 1

        # Créer le mapping
        mapping = {
            "product_id": product_id,
            "name": name[:60] + "..." if len(name) > 60 else name,
            "source_url": source_url,
            "current_image": current_image,
            "correct_image_url": extraction.get("image_url"),
            "correct_image_filename": extract_filename_from_url(extraction.get("image_url", "")),
            "local_html_path": str(local_html.relative_to(PROJECT_ROOT)) if local_html else None,
            "html_exists": local_html.exists() if local_html else False,
            "extraction_method": extraction.get("extraction_method"),
            "all_gallery_images": extraction.get("all_images", [])
        }

        mappings.append(mapping)

        # Mise à jour des stats
        if extraction.get("found"):
            stats["found"] += 1
            method = extraction.get("extraction_method", "unknown")
            stats["by_method"][method] = stats["by_method"].get(method, 0) + 1
            status = "OK"
            filename = extract_filename_from_url(extraction.get("image_url", ""))
            print(f"[{idx}/{total}] {product_id[:50]} -> {filename}")
        else:
            stats["not_found"] += 1
            if extraction.get("html_missing"):
                status = "HTML_MISSING"
                print(f"[{idx}/{total}] {product_id[:50]} -> HTML non trouve")
            else:
                status = "NOT_FOUND"
                print(f"[{idx}/{total}] {product_id[:50]} -> Image non trouvee")

    # Construire le résultat final
    output = {
        "generated_at": __import__('datetime').datetime.now().isoformat(),
        "stats": stats,
        "mappings": mappings
    }

    # Sauvegarder le résultat
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    # Afficher le résumé
    print()
    print("=" * 70)
    print("RÉSUMÉ")
    print("=" * 70)
    print(f"Total produits traités : {stats['total']}")
    print(f"Images trouvées        : {stats['found']} ({stats['found']*100//stats['total']}%)")
    print(f"Images non trouvées    : {stats['not_found']}")
    print(f"  - HTML manquant      : {stats['html_missing']}")
    print()
    print("Méthodes d'extraction utilisées:")
    for method, count in stats["by_method"].items():
        print(f"  - {method}: {count}")
    print()
    print(f"Résultat sauvegardé dans: {OUTPUT_FILE}")
    print("=" * 70)


if __name__ == "__main__":
    main()
