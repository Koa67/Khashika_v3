#!/usr/bin/env python3
"""
Met à jour products-ultimate.json avec les bonnes images depuis truth_map.json.
Fait le matching entre les produits et met à jour les image_url.
"""

import json
import re
from pathlib import Path
try:
    from fuzzywuzzy import fuzz
    FUZZYWUZZY_AVAILABLE = True
except ImportError:
    from difflib import SequenceMatcher
    FUZZYWUZZY_AVAILABLE = False

# Configuration
PRODUCTS_JSON = Path("lib/data/products-ultimate.json")
TRUTH_MAP_FILE = Path("data/truth_map.json")
BACKUP_SUFFIX = ".backup"

def normalize_slug(text: str) -> str:
    """Normalise un texte en slug (même logique que scrape_live_site.py)."""
    replacements = {
        'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
        'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
        'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
        'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
        'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
        'ç': 'c', 'ñ': 'n'
    }
    
    text = text.lower()
    for old, new in replacements.items():
        text = text.replace(old, new)
    
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    
    return text

def similarity_score(str1: str, str2: str) -> float:
    """Calcule un score de similarité entre deux chaînes (0-100 pour fuzzywuzzy, 0-1 pour difflib)."""
    if FUZZYWUZZY_AVAILABLE:
        return fuzz.ratio(str1.lower(), str2.lower())
    else:
        return SequenceMatcher(None, str1.lower(), str2.lower()).ratio() * 100

def find_best_match(product_title: str, truth_products: list, threshold: float = 90.0) -> dict | None:
    """Trouve le meilleur match dans truth_products pour un titre donné."""
    product_slug = normalize_slug(product_title)
    
    # Tentative 1: Match exact par slug
    for truth_product in truth_products:
        if truth_product.get('slug') == product_slug:
            return truth_product
    
    # Tentative 2: Match par titre exact (insensible à la casse)
    product_title_lower = product_title.lower().strip()
    for truth_product in truth_products:
        truth_title = truth_product.get('title', '').lower().strip()
        if truth_title == product_title_lower:
            return truth_product
    
    # Tentative 3: Match par similarité (fuzzy) avec fuzzywuzzy
    best_match = None
    best_score = 0.0
    
    for truth_product in truth_products:
        truth_title = truth_product.get('title', '')
        score = similarity_score(product_title, truth_title)
        
        if score > best_score and score >= threshold:
            best_score = score
            best_match = truth_product
    
    # Tentative 4: Match par début de titre (premiers mots)
    if not best_match:
        product_words = product_title.lower().split()[:3]  # Premiers 3 mots
        for truth_product in truth_products:
            truth_title = truth_product.get('title', '').lower()
            truth_words = truth_title.split()[:3]
            
            # Vérifier si les premiers mots correspondent
            if product_words and truth_words:
                if product_words[0] == truth_words[0] and len(product_words) > 1:
                    if product_words[1] == truth_words[1] if len(truth_words) > 1 else False:
                        return truth_product
    
    return best_match

def main():
    """Fonction principale."""
    print("=" * 60)
    print("🔄 MISE À JOUR DU JSON PRODUITS")
    print("=" * 60)
    
    # Vérifier les fichiers
    if not PRODUCTS_JSON.exists():
        print(f"❌ Fichier {PRODUCTS_JSON} introuvable.")
        return
    
    if not TRUTH_MAP_FILE.exists():
        print(f"❌ Fichier {TRUTH_MAP_FILE} introuvable.")
        print("   Exécutez d'abord: python3 scripts/parse_local_clone.py")
        return
    
    # Charger les données
    print(f"📂 Chargement de {PRODUCTS_JSON}...")
    with open(PRODUCTS_JSON, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📂 Chargement de {TRUTH_MAP_FILE}...")
    with open(TRUTH_MAP_FILE, 'r', encoding='utf-8') as f:
        truth_data = json.load(f)
    
    truth_products = truth_data.get('products', [])
    
    print(f"✓ {len(products)} produits à mettre à jour")
    print(f"✓ {len(truth_products)} produits dans truth_map\n")
    
    # Créer une sauvegarde
    backup_path = PRODUCTS_JSON.with_suffix(PRODUCTS_JSON.suffix + BACKUP_SUFFIX)
    print(f"💾 Création de la sauvegarde: {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Mettre à jour les produits
    print(f"\n🔄 Mise à jour des image_url...\n")
    
    matched = 0
    not_matched = []
    
    for i, product in enumerate(products, 1):
        product_title = product.get('title') or product.get('name', '')
        
        if not product_title:
            not_matched.append(f"Produit {i} (pas de titre)")
            continue
        
        # Chercher le match
        match = find_best_match(product_title, truth_products)
        
        if match:
            # Vérifier que l'image existe dans public/images/products/
            slug = match.get('slug', '')
            image_filename = match.get('original_image_filename', '')
            
            # Déterminer l'extension
            ext = '.jpg'
            if image_filename:
                if image_filename.lower().endswith('.jpeg'):
                    ext = '.jpg'
                elif image_filename.lower().endswith('.png'):
                    ext = '.png'
                elif image_filename.lower().endswith('.webp'):
                    ext = '.webp'
            
            image_path = Path(f"public/images/products/{slug}{ext}")
            
            # Mettre à jour seulement si l'image existe
            if image_path.exists():
                new_image_url = f"/images/products/{slug}{ext}"
                
                product['image_url'] = new_image_url
                product['image'] = new_image_url
                
                # Mettre à jour aussi le premier élément de images si présent
                if 'images' in product and len(product['images']) > 0:
                    product['images'][0] = new_image_url
                
                matched += 1
                
                if i % 50 == 0:
                    print(f"  [{i}/{len(products)}] ✓ {matched} produits mis à jour...")
            else:
                # Image non trouvée, garder l'image actuelle
                not_matched.append(f"{product_title} (image manquante: {slug}{ext})")
                if len(not_matched) <= 10:
                    print(f"  [{i}/{len(products)}] ⚠ Image manquante pour: {product_title[:50]}")
        else:
            not_matched.append(product_title)
            if len(not_matched) <= 10:  # Logger les 10 premiers
                print(f"  [{i}/{len(products)}] ⚠ No match for: {product_title[:50]}")
    
    # Sauvegarder le JSON mis à jour
    print(f"\n💾 Sauvegarde de {PRODUCTS_JSON}...")
    with open(PRODUCTS_JSON, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Rapport final
    print("\n" + "=" * 60)
    print("✅ MISE À JOUR TERMINÉE")
    print("=" * 60)
    print(f"✓ {matched}/{len(products)} produits mis à jour")
    print(f"⚠ {len(not_matched)} produits sans correspondance")
    print(f"💾 Sauvegarde: {backup_path}")
    print(f"📁 Fichier mis à jour: {PRODUCTS_JSON}")
    
    if not_matched and len(not_matched) > 10:
        print(f"\n⚠ Exemples de produits sans correspondance ({min(10, len(not_matched))} premiers):")
        for title in not_matched[:10]:
            print(f"  - {title[:60]}")

if __name__ == "__main__":
    main()

