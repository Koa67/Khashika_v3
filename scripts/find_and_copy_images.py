#!/usr/bin/env python3
"""
Localise et copie les images originales depuis le clone _LEGACY_CLONE.
Recherche récursive des fichiers images et les copie dans public/images/products/.
"""

import json
import shutil
from pathlib import Path

# Configuration
TRUTH_MAP_FILE = Path("data/truth_map.json")
CLONE_DIR = Path("_LEGACY_CLONE")
IMAGES_DIR = Path("public/images/products")
MISSING_IMAGES_FILE = Path("data/missing_images.json")

# Dossiers de recherche prioritaires
SEARCH_DIRS = [
    CLONE_DIR / "wp-content" / "uploads",
    CLONE_DIR,
    Path("_raw_assets")  # Si existe
]

def find_image_file(filename: str, search_dirs: list) -> Path | None:
    """Recherche récursive d'un fichier image."""
    # Nettoyer le nom de fichier
    filename_clean = filename.strip()
    
    # Essayer avec l'extension originale
    for search_dir in search_dirs:
        if not search_dir.exists():
            continue
        
        # Recherche exacte
        found = search_dir.rglob(filename_clean)
        for path in found:
            if path.is_file():
                return path
        
        # Si non trouvé, essayer sans extension puis avec différentes extensions
        name_without_ext = Path(filename_clean).stem
        
        for ext in ['.jpg', '.jpeg', '.png', '.webp']:
            test_filename = name_without_ext + ext
            found = search_dir.rglob(test_filename)
            for path in found:
                if path.is_file():
                    return path
        
        # Essayer des variantes (avec/sans tirets, underscores)
        variants = [
            name_without_ext.replace('_', '-'),
            name_without_ext.replace('-', '_'),
            name_without_ext.replace(' ', '-'),
            name_without_ext.replace(' ', '_')
        ]
        
        for variant in variants:
            for ext in ['.jpg', '.jpeg', '.png', '.webp']:
                test_filename = variant + ext
                found = search_dir.rglob(test_filename)
                for path in found:
                    if path.is_file():
                        return path
    
    return None

def get_file_extension(image_path: Path) -> str:
    """Détermine l'extension du fichier."""
    ext = image_path.suffix.lower()
    
    # Normaliser
    if ext in ['.jpg', '.jpeg']:
        return '.jpg'
    elif ext == '.png':
        return '.png'
    elif ext == '.webp':
        return '.webp'
    else:
        return '.jpg'  # Par défaut

def main():
    """Fonction principale."""
    print("=" * 60)
    print("📥 COPIE DES IMAGES DEPUIS LE CLONE")
    print("=" * 60)
    print()
    
    # Vérifier que le fichier truth_map existe
    if not TRUTH_MAP_FILE.exists():
        print(f"❌ Fichier {TRUTH_MAP_FILE} introuvable.")
        print("   Exécutez d'abord: python3 scripts/parse_local_clone.py")
        return
    
    # Charger truth_map.json
    print(f"📂 Chargement de {TRUTH_MAP_FILE}...")
    with open(TRUTH_MAP_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    products = data.get('products', [])
    
    if not products:
        print("❌ Aucun produit trouvé dans truth_map.json")
        return
    
    print(f"✓ {len(products)} produits chargés")
    print()
    
    # Créer le dossier images si nécessaire
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    # Vérifier les dossiers de recherche
    print("🔍 Vérification des dossiers de recherche...")
    available_dirs = []
    for search_dir in SEARCH_DIRS:
        if search_dir.exists():
            print(f"  ✓ {search_dir}")
            available_dirs.append(search_dir)
        else:
            print(f"  ⊘ {search_dir} (n'existe pas)")
    
    if not available_dirs:
        print("❌ Aucun dossier de recherche disponible !")
        return
    
    print()
    print(f"📥 Recherche de {len(products)} images...")
    print()
    
    copied = 0
    missing = []
    skipped = 0
    
    for i, product in enumerate(products, 1):
        slug = product.get('slug', '')
        image_filename = product.get('original_image_filename', '')
        title = product.get('title', '')
        
        if not slug or not image_filename:
            print(f"  [{i:03d}/{len(products)}] ⚠ Données manquantes pour le produit {i}")
            missing.append({
                "product": title,
                "slug": slug,
                "filename": image_filename,
                "reason": "données manquantes"
            })
            continue
        
        # Déterminer le chemin de sortie
        # D'abord, essayer de trouver l'extension depuis le fichier source
        ext = '.jpg'
        if image_filename:
            ext = get_file_extension(Path(image_filename))
        
        output_path = IMAGES_DIR / f"{slug}{ext}"
        
        # Vérifier si l'image existe déjà
        if output_path.exists():
            print(f"  [{i:03d}/{len(products)}] ⊘ Skipped: {slug}{ext} (déjà existant)")
            skipped += 1
            continue
        
        # Rechercher l'image
        print(f"  [{i:03d}/{len(products)}] Recherche: {image_filename[:40]}...", end=" ")
        
        source_path = find_image_file(image_filename, available_dirs)
        
        if source_path:
            try:
                # Copier l'image
                shutil.copy2(source_path, output_path)
                print(f"✓ → {slug}{ext}")
                copied += 1
            except Exception as e:
                print(f"✗ Erreur de copie: {e}")
                missing.append({
                    "product": title,
                    "slug": slug,
                    "filename": image_filename,
                    "reason": f"erreur de copie: {e}"
                })
        else:
            print(f"❌ MANQUANTE")
            missing.append({
                "product": title,
                "slug": slug,
                "filename": image_filename,
                "reason": "fichier non trouvé"
            })
    
    # Sauvegarder la liste des images manquantes
    if missing:
        MISSING_IMAGES_FILE.parent.mkdir(parents=True, exist_ok=True)
        with open(MISSING_IMAGES_FILE, 'w', encoding='utf-8') as f:
            json.dump(missing, f, ensure_ascii=False, indent=2)
    
    # Rapport final
    print()
    print("=" * 60)
    print("📊 RÉSUMÉ DE LA COPIE")
    print("=" * 60)
    print(f"✓ {copied}/{len(products)} images copiées avec succès ({copied*100//len(products) if products else 0}%)")
    print(f"⊘ {skipped} images déjà existantes (ignorées)")
    print(f"❌ {len(missing)} images manquantes")
    print(f"💾 Destination : {IMAGES_DIR}")
    
    if missing:
        print()
        print("❌ IMAGES MANQUANTES :")
        for item in missing[:10]:  # Afficher les 10 premières
            print(f"   - {item['filename']} → Produit: \"{item['product'][:50]}...\"")
        if len(missing) > 10:
            print(f"   ... et {len(missing) - 10} autres")
        print(f"   (Liste complète dans: {MISSING_IMAGES_FILE})")

if __name__ == "__main__":
    main()

