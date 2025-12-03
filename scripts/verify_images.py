#!/usr/bin/env python3
"""
Vérifie que les images téléchargées sont valides et que les chemins dans le JSON sont corrects.
"""

import json
import os
from pathlib import Path

try:
    from PIL import Image
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False
    print("⚠ PIL/Pillow non disponible. Validation d'image désactivée.")

# Configuration
PRODUCTS_JSON = Path("lib/data/products-ultimate.json")
REPORT_FILE = Path("data/missing_images_report.txt")

def verify_image(image_path: Path) -> bool:
    """Vérifie qu'une image est valide."""
    if not PIL_AVAILABLE:
        # Vérification basique : fichier existe et a une taille > 0
        return image_path.exists() and image_path.stat().st_size > 0
    
    try:
        with Image.open(image_path) as img:
            img.verify()
        return True
    except Exception:
        return False

def main():
    """Fonction principale."""
    print("=" * 60)
    print("🔍 VÉRIFICATION DES IMAGES")
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
    
    print("🔍 Vérification des images...")
    print()
    
    valid = 0
    missing = []
    corrupted = []
    
    for i, product in enumerate(products, 1):
        image_url = product.get('image_url', '')
        
        if not image_url:
            missing.append({
                "product": product.get('name', product.get('title', 'N/A')),
                "reason": "pas d'image_url"
            })
            continue
        
        # Construire le chemin complet
        if image_url.startswith('/'):
            image_path = Path(f"public{image_url}")
        else:
            image_path = Path(f"public/images/products/{image_url}")
        
        if not image_path.exists():
            missing.append({
                "product": product.get('name', product.get('title', 'N/A')),
                "image_url": image_url,
                "path": str(image_path),
                "reason": "fichier non trouvé"
            })
            continue
        
        # Vérifier que l'image est valide
        if verify_image(image_path):
            valid += 1
            if i % 100 == 0:
                print(f"  [{i}/{len(products)}] ✓ {valid} images valides...")
        else:
            corrupted.append({
                "product": product.get('name', product.get('title', 'N/A')),
                "image_url": image_url,
                "path": str(image_path),
                "reason": "image corrompue"
            })
    
    # Sauvegarder le rapport des images manquantes
    if missing:
        REPORT_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            f.write("IMAGES MANQUANTES\n")
            f.write("=" * 60 + "\n\n")
            for item in missing:
                f.write(f"Produit: {item['product']}\n")
                f.write(f"  URL: {item.get('image_url', 'N/A')}\n")
                f.write(f"  Chemin: {item.get('path', 'N/A')}\n")
                f.write(f"  Raison: {item.get('reason', 'N/A')}\n")
                f.write("\n")
    
    # Rapport final
    print()
    print("=" * 60)
    print("📊 RÉSUMÉ DE LA VÉRIFICATION")
    print("=" * 60)
    print(f"✓ {valid} images valides")
    print(f"❌ {len(missing)} images manquantes")
    print(f"⚠ {len(corrupted)} images corrompues")
    
    if missing:
        print(f"\n📄 Rapport détaillé : {REPORT_FILE}")
        print("\nExemples d'images manquantes :")
        for item in missing[:5]:
            print(f"  - {item['product'][:50]}... ({item.get('reason', 'N/A')})")
        if len(missing) > 5:
            print(f"  ... et {len(missing) - 5} autres")
    
    if corrupted:
        print("\n⚠ Images corrompues :")
        for item in corrupted[:5]:
            print(f"  - {item['product'][:50]}...")
        if len(corrupted) > 5:
            print(f"  ... et {len(corrupted) - 5} autres")

if __name__ == "__main__":
    main()




