#!/usr/bin/env python3
"""
Script de nettoyage des images produits dupliquées.

Objectif (TASK.md) :
- Charger lib/data/products-scraped.json
- Identifier les images utilisées plus de 3 fois
- Pour ces produits "douteux", remplacer l'image par "" pour forcer le placeholder
- Sauvegarder le JSON corrigé

Note : dans le projet actuel, les données scrapées sont stockées dans
lib/data/products-ultimate.json. On applique donc la logique sur ce fichier
si products-scraped.json est absent.
"""

import json
from collections import Counter
from pathlib import Path
from typing import Any, Dict, List


ROOT_DIR = Path(__file__).resolve().parents[1]
SCRAPED_PATH_PRIMARY = ROOT_DIR / "lib" / "data" / "products-scraped.json"
SCRAPED_PATH_FALLBACK = ROOT_DIR / "lib" / "data" / "products-ultimate.json"


def load_products() -> (Path, List[Dict[str, Any]]):
    """
    Charge les produits depuis products-scraped.json ou, à défaut, products-ultimate.json.
    Retourne (chemin_fichier, liste_produits).
    """
    json_path: Path

    if SCRAPED_PATH_PRIMARY.exists():
        json_path = SCRAPED_PATH_PRIMARY
        print(f"📦 Chargement depuis {json_path}")
    elif SCRAPED_PATH_FALLBACK.exists():
        json_path = SCRAPED_PATH_FALLBACK
        print(f"📦 Fichier products-scraped.json introuvable, utilisation du fallback {json_path}")
    else:
        raise FileNotFoundError(
            "❌ Aucun fichier de données trouvé (products-scraped.json ni products-ultimate.json)."
        )

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Le JSON peut être soit un tableau direct, soit un objet { "products": [...] }
    if isinstance(data, list):
        products = data
    elif isinstance(data, dict) and isinstance(data.get("products"), list):
        products = data["products"]
    else:
        raise ValueError(f"❌ Structure JSON inattendue dans {json_path}")

    return json_path, products


def compute_image_usage(products: List[Dict[str, Any]]) -> Counter:
    """
    Calcule le nombre d'utilisations de chaque chemin d'image.
    On compte :
      - product['image'] si présent
      - product['image_url'] si présent
      - toutes les entrées de product['images'] si c'est une liste
    """
    counter: Counter = Counter()

    for product in products:
        if not isinstance(product, dict):
            continue

        img = product.get("image")
        if isinstance(img, str) and img.strip():
            counter[img.strip()] += 1

        img_url = product.get("image_url")
        if isinstance(img_url, str) and img_url.strip():
            counter[img_url.strip()] += 1

        images = product.get("images")
        if isinstance(images, list):
            for item in images:
                if isinstance(item, str) and item.strip():
                    counter[item.strip()] += 1

    return counter


def fix_image_duplication() -> None:
    """
    Implémente la logique de nettoyage :
    - Identifier les images utilisées plus de 3 fois
    - Pour les produits utilisant ces images, remplacer les champs image / image_url
      par "" et vider le tableau images pour forcer le placeholder du frontend.
    """
    json_path, products = load_products()

    print(f"🔍 {len(products)} produits chargés")

    usage = compute_image_usage(products)
    overused_images = {path for path, count in usage.items() if count > 3}

    print(f"📸 {len(usage)} chemins d'images uniques trouvés")
    print(f"⚠️ {len(overused_images)} images utilisées plus de 3 fois (candidates à nettoyage)")

    if not overused_images:
        print("✅ Aucune image dupliquée de façon abusive détectée. Aucun changement effectué.")
        return

    modified_count = 0
    total_images_cleared = 0

    for product in products:
        if not isinstance(product, dict):
            continue

        has_overused = False

        img = product.get("image")
        if isinstance(img, str) and img.strip() in overused_images:
            has_overused = True

        img_url = product.get("image_url")
        if isinstance(img_url, str) and img_url.strip() in overused_images:
            has_overused = True

        images = product.get("images")
        if isinstance(images, list):
            for item in images:
                if isinstance(item, str) and item.strip() in overused_images:
                    has_overused = True
                    break

        if not has_overused:
            continue

        # Produit "douteux" : on force le placeholder côté frontend
        modified_count += 1

        # Compter combien d'images on neutralise
        if isinstance(product.get("images"), list):
            total_images_cleared += len([x for x in product["images"] if isinstance(x, str) and x.strip()])

        product["image"] = ""
        product["image_url"] = ""
        product["images"] = []

    # Sauvegarde du JSON corrigé
    print(f"💾 Sauvegarde du fichier corrigé : {json_path}")

    # On conserve la structure d'origine (liste ou objet { products: [...] })
    with open(json_path, "r", encoding="utf-8") as f:
        original_data = json.load(f)

    if isinstance(original_data, list):
        new_data = products
    elif isinstance(original_data, dict):
        original_data["products"] = products
        new_data = original_data
    else:
        new_data = products

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=2)

    print("✅ Nettoyage terminé")
    print(f"   - Produits modifiés : {modified_count}")
    print(f"   - Images neutralisées (paths marqués comme dupliqués) : {len(overused_images)}")
    print(f"   - Total d'entrées dans 'images' vidées : {total_images_cleared}")


if __name__ == "__main__":
    fix_image_duplication()
























