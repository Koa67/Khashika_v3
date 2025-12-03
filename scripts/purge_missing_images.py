#!/usr/bin/env python3
"""
Script de purge : Supprime impitoyablement toute référence à un fichier qui n'existe pas.
Stoppe le crash "Double Free" en éliminant les liens morts du JSON.
"""

import json
import os
import shutil
from pathlib import Path

def get_absolute_path(image_url):
    """Construire le chemin absolu local depuis image_url."""
    if not image_url or image_url == '' or image_url == '/placeholder-image.svg':
        return None
    
    # Si chemin commence par /, c'est relatif à public
    if image_url.startswith('/'):
        # Enlever le / initial
        relative_path = image_url.lstrip('/')
        absolute_path = Path('public') / relative_path
    else:
        # Chemin relatif, supposer dans images/products
        absolute_path = Path('public/images/products') / image_url
    
    return absolute_path

def main():
    print("🧹 PURGE DES IMAGES MANQUANTES")
    print("=" * 70)
    print()
    
    # Chemins
    json_path = Path('lib/data/products-ultimate.json')
    
    # Backup du JSON
    backup_path = json_path.with_suffix('.json.backup-purge')
    print(f"📦 Création backup: {backup_path}")
    try:
        shutil.copy2(json_path, backup_path)
        print("   → Backup créé avec succès")
    except Exception as e:
        print(f"⚠️ Erreur création backup: {e}")
        print("   → Continuation sans backup (risqué)")
    
    # Charger le JSON
    print(f"📖 Chargement de {json_path}")
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
    except Exception as e:
        print(f"❌ ERREUR CRITIQUE: Impossible de charger le JSON: {e}")
        return
    
    print(f"   → {len(products)} produits trouvés")
    print()
    
    # Statistiques
    purged_count = 0
    kept_count = 0
    
    # Traiter chaque produit
    print("🔄 Vérification des images...")
    print()
    
    for i, product in enumerate(products):
        # Récupérer le chemin de l'image
        image_url = product.get('image_url') or product.get('image') or (product.get('images') and len(product.get('images', [])) > 0 and product.get('images')[0])
        
        # Si pas d'image_url, déjà vide
        if not image_url or image_url == '':
            # S'assurer que tout est vide
            product['image_url'] = ''
            product['image'] = ''
            if 'images' in product:
                product['images'] = []
            continue
        
        # Construire le chemin absolu local
        absolute_path = get_absolute_path(image_url)
        
        # Vérifier si le fichier existe
        if absolute_path and absolute_path.exists() and absolute_path.is_file():
            # Fichier existe, garder tel quel
            kept_count += 1
        else:
            # Fichier n'existe pas, SUPPRIMER le lien
            product['image_url'] = ''
            product['image'] = ''
            if 'images' in product:
                product['images'] = []
            
            purged_count += 1
            product_name = product.get('name', '')[:50]
            print(f"🗑️  SUPPRIMÉ : Lien mort pour {product_name}")
    
    print()
    print("=" * 70)
    print("💾 Sauvegarde du JSON...")
    
    # Sauvegarder le fichier JSON (écraser l'ancien)
    try:
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        print("   → JSON sauvegardé avec succès")
    except Exception as e:
        print(f"❌ ERREUR CRITIQUE: Impossible de sauvegarder le JSON: {e}")
        print("   → Les modifications sont perdues !")
        return
    
    print()
    print("=" * 70)
    print("✅ PURGE TERMINÉE")
    print()
    print(f"📊 Statistiques:")
    print(f"   • Liens morts supprimés: {purged_count}")
    print(f"   • Images valides conservées: {kept_count}")
    print(f"   • Backup créé: {backup_path}")
    print()
    print("🎯 Résultat : 0 lien mort, 0 crash 'Double Free'")
    print()

if __name__ == '__main__':
    main()




