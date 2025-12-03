#!/usr/bin/env python3
"""
Script de dédoublonnage strict pour products-ultimate.json
Supprime tous les produits avec des slugs dupliqués, ne gardant que le premier.
"""

import json
import os
from pathlib import Path

def deduplicate_products():
    """Déduplique les produits basés sur le slug."""
    # Chemin vers le fichier JSON
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    json_path = project_root / 'lib' / 'data' / 'products-ultimate.json'
    
    # Vérifier que le fichier existe
    if not json_path.exists():
        print(f"❌ Erreur : {json_path} n'existe pas")
        return False
    
    # Charger le fichier JSON
    print(f"📂 Chargement de {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Convertir en liste si c'est un objet avec une clé 'products'
    if isinstance(data, dict) and 'products' in data:
        products = data['products']
    elif isinstance(data, list):
        products = data
    else:
        print("❌ Format JSON inattendu")
        return False
    
    original_count = len(products)
    print(f"📊 Produits avant dédoublonnage : {original_count}")
    
    # Dictionnaire pour tracker les slugs vus
    seen_slugs = {}
    unique_products = []
    duplicates_removed = 0
    
    # Parcourir les produits
    for product in products:
        # Obtenir le slug (ou générer depuis l'id/name si absent)
        slug = product.get('slug', '')
        if not slug:
            # Essayer de générer un slug depuis l'id ou le name
            if product.get('id'):
                slug = str(product.get('id'))
            elif product.get('name'):
                slug = product.get('name', '').lower().replace(' ', '-')
            else:
                # Si pas de slug, id ou name, on génère un slug unique basé sur l'index
                slug = f"product-{len(unique_products)}"
        
        # Normaliser le slug (enlever les espaces, mettre en minuscule)
        slug = str(slug).strip().lower()
        
        # Si le slug est déjà vu, ignorer ce produit (doublon)
        if slug in seen_slugs:
            duplicates_removed += 1
            print(f"  ⚠️  Doublon détecté et supprimé : slug='{slug}' (produit: {product.get('name', 'N/A')[:50]})")
            continue
        
        # Slug unique, le garder
        seen_slugs[slug] = True
        # S'assurer que le slug est bien défini dans le produit
        product['slug'] = slug
        unique_products.append(product)
    
    print(f"✅ Produits après dédoublonnage : {len(unique_products)}")
    print(f"🗑️  Doublons supprimés : {duplicates_removed}")
    
    # Sauvegarder le fichier nettoyé
    # Créer un backup avant modification
    backup_path = json_path.with_suffix('.json.backup_before_dedup')
    print(f"💾 Création du backup : {backup_path}")
    with open(backup_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    # Sauvegarder le fichier dédupliqué
    # Conserver la structure originale (liste ou objet)
    if isinstance(data, dict):
        output_data = {**data, 'products': unique_products}
    else:
        output_data = unique_products
    
    print(f"💾 Sauvegarde du fichier nettoyé : {json_path}")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Dédoublonnage terminé avec succès !")
    print(f"📊 Statistiques : {original_count} → {len(unique_products)} produits ({duplicates_removed} doublons supprimés)")
    
    return True

if __name__ == '__main__':
    success = deduplicate_products()
    exit(0 if success else 1)





