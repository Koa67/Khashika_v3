#!/usr/bin/env python3
"""
Télécharge les images depuis le site source Khashika.
Charge truth_map.json et télécharge chaque image dans public/images/products/.
"""

import json
import requests
import time
from pathlib import Path
from urllib.parse import urlparse

# Configuration
TRUTH_MAP_FILE = Path("data/truth_map.json")
IMAGES_DIR = Path("public/images/products")
DELAY_BETWEEN_DOWNLOADS = 0.5

def get_file_extension(url: str) -> str:
    """Extrait l'extension du fichier depuis l'URL."""
    parsed = urlparse(url)
    path = Path(parsed.path)
    ext = path.suffix.lower()
    
    # Normaliser les extensions
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
        
    except requests.RequestException as e:
        return False

def main():
    """Fonction principale."""
    print("=" * 60)
    print("📥 TÉLÉCHARGEMENT DES IMAGES")
    print("=" * 60)
    
    # Vérifier que le fichier truth_map existe
    if not TRUTH_MAP_FILE.exists():
        print(f"❌ Fichier {TRUTH_MAP_FILE} introuvable.")
        print("   Exécutez d'abord: python3 scripts/scrape_live_site.py")
        return
    
    # Charger truth_map.json
    print(f"📂 Chargement de {TRUTH_MAP_FILE}...")
    with open(TRUTH_MAP_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', [])
    
    if not products:
        print("❌ Aucun produit trouvé dans truth_map.json")
        return
    
    print(f"✓ {len(products)} produits chargés\n")
    
    # Créer le dossier images si nécessaire
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Télécharger les images
    print(f"📥 Téléchargement de {len(products)} images...\n")
    
    downloaded = 0
    failed = 0
    skipped = 0
    
    for i, product in enumerate(products, 1):
        slug = product.get('slug', '')
        image_url = product.get('original_image_url', '')
        
        if not slug or not image_url:
            print(f"  [{i}/{len(products)}] ⚠ Données manquantes pour le produit {i}")
            failed += 1
            continue
        
        # Déterminer le chemin de sortie
        ext = get_file_extension(image_url)
        output_path = IMAGES_DIR / f"{slug}{ext}"
        
        # Vérifier si l'image existe déjà
        if output_path.exists():
            print(f"  [{i}/{len(products)}] ⊘ Skipped: {slug}{ext} (déjà existant)")
            skipped += 1
            continue
        
        print(f"  [{i}/{len(products)}] Téléchargement: {slug}{ext}...", end=" ")
        
        success = download_image(image_url, output_path)
        
        if success:
            print("✓")
            downloaded += 1
        else:
            print("✗ Échec")
            failed += 1
        
        # Délai entre téléchargements
        if i < len(products):
            time.sleep(DELAY_BETWEEN_DOWNLOADS)
    
    # Rapport final
    print("\n" + "=" * 60)
    print("✅ TÉLÉCHARGEMENT TERMINÉ")
    print("=" * 60)
    print(f"✓ {downloaded} images téléchargées")
    print(f"⊘ {skipped} images déjà existantes (ignorées)")
    print(f"⚠ {failed} échecs")
    print(f"📁 Dossier: {IMAGES_DIR}")

if __name__ == "__main__":
    main()


















