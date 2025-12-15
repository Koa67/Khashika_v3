#!/usr/bin/env python3
"""
KHASHIKA - Téléchargement et mise à jour des images produits
=============================================================
Télécharge les images correctes identifiées par extract_images_from_source.py
et met à jour products-ultimate.json avec les nouveaux chemins.

Usage: python scripts/download_and_update_images.py
Input: data/image_mapping.json
Output:
  - public/images/products_reconciled/
  - lib/data/products-ultimate.json (mis à jour)
  - lib/data/products-ultimate.backup.json
  - data/download_errors.json
"""

import json
import os
import re
import shutil
import time
import requests
from pathlib import Path
from urllib.parse import urlparse, unquote
from datetime import datetime

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
MAPPING_FILE = PROJECT_ROOT / "data" / "image_mapping.json"
PRODUCTS_JSON = PROJECT_ROOT / "lib" / "data" / "products-ultimate.json"
PRODUCTS_BACKUP = PROJECT_ROOT / "lib" / "data" / "products-ultimate.backup.json"
OUTPUT_DIR = PROJECT_ROOT / "public" / "images" / "products_reconciled"
LEGACY_UPLOADS = PROJECT_ROOT / "_LEGACY_CLONE" / "www.khashika.com" / "wp-content" / "uploads"
ERRORS_FILE = PROJECT_ROOT / "data" / "download_errors.json"

# Paramètres
RATE_LIMIT = 0.5  # secondes entre chaque téléchargement
MAX_RETRIES = 3
REQUEST_TIMEOUT = 30

# Headers pour simuler un navigateur
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
}


def sanitize_filename(product_id: str) -> str:
    """
    Convertit un product_id en nom de fichier propre.
    Ex: prod-sac-indien-tissus → sac-indien-tissus
    """
    # Supprimer le préfixe "prod-"
    name = product_id.replace("prod-", "", 1)

    # Nettoyer les caractères spéciaux
    name = re.sub(r'[^\w\-]', '-', name)
    name = re.sub(r'-+', '-', name)  # Supprimer les tirets multiples
    name = name.strip('-')

    # Limiter la longueur
    if len(name) > 80:
        name = name[:80].rsplit('-', 1)[0]

    return name


def get_extension_from_url(url: str) -> str:
    """Extrait l'extension du fichier depuis l'URL."""
    parsed = urlparse(url)
    path = unquote(parsed.path)
    ext = os.path.splitext(path)[1].lower()

    # Extensions valides
    valid_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    if ext in valid_extensions:
        return ext
    return '.jpeg'  # Par défaut


def find_local_image(image_url: str) -> Path | None:
    """
    Cherche l'image dans le clone local si le téléchargement échoue.
    """
    if not image_url:
        return None

    # Extraire le chemin relatif depuis l'URL
    # Ex: https://www.khashika.com/wp-content/uploads/DSC05580.jpeg
    #  → _LEGACY_CLONE/www.khashika.com/wp-content/uploads/DSC05580.jpeg

    parsed = urlparse(image_url)
    path = unquote(parsed.path).lstrip('/')

    # Essayer différents chemins possibles
    possible_paths = [
        LEGACY_UPLOADS / os.path.basename(path),  # Juste le nom de fichier
        PROJECT_ROOT / "_LEGACY_CLONE" / "www.khashika.com" / path,  # Chemin complet
    ]

    # Si le chemin contient une date (ex: 2024/01/), essayer aussi sans
    filename = os.path.basename(path)
    possible_paths.append(LEGACY_UPLOADS / filename)

    for local_path in possible_paths:
        if local_path.exists():
            return local_path

    # Recherche récursive dans wp-content/uploads
    if LEGACY_UPLOADS.exists():
        for found_file in LEGACY_UPLOADS.rglob(filename):
            return found_file

    return None


def download_image(url: str, dest_path: Path, retries: int = MAX_RETRIES) -> tuple[bool, str]:
    """
    Télécharge une image depuis une URL.
    Returns: (success: bool, message: str)
    """
    for attempt in range(retries):
        try:
            response = requests.get(
                url,
                headers=HEADERS,
                timeout=REQUEST_TIMEOUT,
                stream=True
            )

            if response.status_code == 200:
                # Vérifier que c'est bien une image
                content_type = response.headers.get('content-type', '')
                if 'image' not in content_type and 'octet-stream' not in content_type:
                    return False, f"Content-Type invalide: {content_type}"

                # Sauvegarder l'image
                with open(dest_path, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)

                # Vérifier la taille
                if dest_path.stat().st_size < 100:
                    dest_path.unlink()
                    return False, "Fichier trop petit (<100 bytes)"

                return True, "OK"

            elif response.status_code == 404:
                return False, "404 Not Found"

            else:
                if attempt < retries - 1:
                    time.sleep(1)
                    continue
                return False, f"HTTP {response.status_code}"

        except requests.Timeout:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return False, "Timeout"

        except requests.RequestException as e:
            if attempt < retries - 1:
                time.sleep(1)
                continue
            return False, str(e)

    return False, "Max retries exceeded"


def main():
    print("=" * 70)
    print("KHASHIKA - Téléchargement et mise à jour des images")
    print("=" * 70)
    print()

    # Vérifications préliminaires
    if not MAPPING_FILE.exists():
        print(f"ERREUR: Fichier non trouvé: {MAPPING_FILE}")
        print("Exécutez d'abord: python scripts/extract_images_from_source.py")
        return

    if not PRODUCTS_JSON.exists():
        print(f"ERREUR: Fichier non trouvé: {PRODUCTS_JSON}")
        return

    # Charger le mapping
    print(f"Chargement de {MAPPING_FILE}...")
    with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
        mapping_data = json.load(f)

    mappings = mapping_data.get('mappings', [])
    valid_mappings = [m for m in mappings if m.get('correct_image_url')]

    print(f"Mappings totaux: {len(mappings)}")
    print(f"Mappings valides (avec image): {len(valid_mappings)}")
    print()

    # Créer le dossier de sortie
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Dossier de sortie: {OUTPUT_DIR}")
    print()

    # Créer le backup de products-ultimate.json
    print(f"Création du backup: {PRODUCTS_BACKUP}")
    shutil.copy2(PRODUCTS_JSON, PRODUCTS_BACKUP)
    print("Backup créé.")
    print()

    # Charger les produits
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)

    # Créer un index par product_id
    products_index = {p['id']: p for p in products}

    # Stats
    stats = {
        'total': len(valid_mappings),
        'downloaded': 0,
        'from_local': 0,
        'errors': 0,
        'updated_products': 0
    }

    errors = []
    updated_images = {}  # product_id -> new_image_path

    print("Début du téléchargement...")
    print("-" * 70)

    for idx, mapping in enumerate(valid_mappings, 1):
        product_id = mapping['product_id']
        correct_url = mapping['correct_image_url']
        original_filename = mapping.get('correct_image_filename', '')

        # Générer le nom de fichier de sortie
        safe_name = sanitize_filename(product_id)
        ext = get_extension_from_url(correct_url)
        output_filename = f"{safe_name}{ext}"
        output_path = OUTPUT_DIR / output_filename

        # Si le fichier existe déjà, skip
        if output_path.exists() and output_path.stat().st_size > 100:
            new_path = f"/images/products_reconciled/{output_filename}"
            updated_images[product_id] = new_path
            stats['downloaded'] += 1
            print(f"⏭️  [{idx}/{stats['total']}] {output_filename} (déjà présent)")
            continue

        # Télécharger l'image
        success, message = download_image(correct_url, output_path)

        if success:
            new_path = f"/images/products_reconciled/{output_filename}"
            updated_images[product_id] = new_path
            stats['downloaded'] += 1
            print(f"📥 [{idx}/{stats['total']}] {output_filename} ← {original_filename} ✅")
        else:
            # Fallback: chercher dans le clone local
            local_file = find_local_image(correct_url)

            if local_file:
                shutil.copy2(local_file, output_path)
                new_path = f"/images/products_reconciled/{output_filename}"
                updated_images[product_id] = new_path
                stats['from_local'] += 1
                print(f"⚠️  [{idx}/{stats['total']}] {output_filename} ERREUR {message}, fallback local...")
                print(f"✅ [{idx}/{stats['total']}] {output_filename} ← local OK")
            else:
                stats['errors'] += 1
                errors.append({
                    'product_id': product_id,
                    'url': correct_url,
                    'error': message,
                    'local_search': 'not found'
                })
                print(f"❌ [{idx}/{stats['total']}] {product_id[:40]} ERREUR: {message}")

        # Rate limiting
        time.sleep(RATE_LIMIT)

    print("-" * 70)
    print()

    # Mettre à jour products-ultimate.json
    print("Mise à jour de products-ultimate.json...")

    for product in products:
        product_id = product.get('id')
        if product_id in updated_images:
            new_image = updated_images[product_id]
            product['image'] = new_image
            product['image_url'] = new_image
            product['images'] = [new_image]  # Remplacer le tableau d'images
            stats['updated_products'] += 1

    # Sauvegarder les produits mis à jour
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Produits mis à jour: {stats['updated_products']}")
    print()

    # Sauvegarder les erreurs
    if errors:
        with open(ERRORS_FILE, 'w', encoding='utf-8') as f:
            json.dump({
                'generated_at': datetime.now().isoformat(),
                'total_errors': len(errors),
                'errors': errors
            }, f, ensure_ascii=False, indent=2)
        print(f"Erreurs sauvegardées dans: {ERRORS_FILE}")

    # Rapport final
    print()
    print("=" * 70)
    print("RAPPORT FINAL")
    print("=" * 70)
    print(f"Total à traiter        : {stats['total']}")
    print(f"Téléchargées (web)     : {stats['downloaded']}")
    print(f"Récupérées (local)     : {stats['from_local']}")
    print(f"Erreurs                : {stats['errors']}")
    print(f"Produits mis à jour    : {stats['updated_products']}")
    print()
    print(f"Dossier images         : {OUTPUT_DIR}")
    print(f"Backup JSON            : {PRODUCTS_BACKUP}")
    if errors:
        print(f"Fichier erreurs        : {ERRORS_FILE}")
    print("=" * 70)

    # Taux de succès
    success_rate = (stats['downloaded'] + stats['from_local']) / stats['total'] * 100 if stats['total'] > 0 else 0
    print(f"\nTaux de succès: {success_rate:.1f}%")


if __name__ == "__main__":
    main()
