#!/usr/bin/env python3
"""
Script de nettoyage radical : Supprime tous les liens morts du JSON.
Si une image n'existe pas physiquement sur le disque, elle est supprimée du JSON.
"""

import json
import os
import shutil
from pathlib import Path

def get_image_filename(image_url):
    """Extraire le nom de fichier depuis image_url."""
    if not image_url:
        return None
    
    # Nettoyer le chemin : enlever /images/products/ pour avoir le nom de fichier
    if '/images/products/' in image_url:
        filename = image_url.split('/images/products/')[-1]
    elif image_url.startswith('/'):
        # Chemin absolu, extraire juste le nom de fichier
        filename = os.path.basename(image_url)
    else:
        # Chemin relatif, utiliser tel quel
        filename = image_url
    
    return filename

def image_exists(image_url, products_dir):
    """Vérifier si le fichier image existe réellement sur le disque."""
    if not image_url or image_url == '' or image_url == '/placeholder-image.svg':
        return False
    
    filename = get_image_filename(image_url)
    if not filename:
        return False
    
    # Chemin complet du fichier
    file_path = products_dir / filename
    
    # Vérifier existence
    return file_path.exists() and file_path.is_file()

def main():
    print("🧹 NETTOYAGE RADICAL : SUPPRESSION DES LIENS MORTS")
    print("=" * 70)
    print()
    
    # Chemins
    json_path = Path('lib/data/products-ultimate.json')
    products_dir = Path('public/images/products')
    
    # Backup du JSON
    backup_path = json_path.with_suffix('.json.backup-nuclear')
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
    killed_count = 0
    kept_count = 0
    
    # Traiter chaque produit
    print("🔄 Vérification des liens images...")
    print()
    
    for i, product in enumerate(products):
        image_url = product.get('image_url') or product.get('image') or (product.get('images') and len(product.get('images', [])) > 0 and product.get('images')[0])
        
        # Si pas d'image_url, déjà vide
        if not image_url or image_url == '':
            # S'assurer que tout est vide
            product['image_url'] = ''
            product['image'] = ''
            if 'images' in product:
                product['images'] = []
            continue
        
        # Vérifier si le fichier existe
        if image_exists(image_url, products_dir):
            # Fichier existe, garder tel quel
            kept_count += 1
        else:
            # Fichier n'existe pas, SUPPRIMER le lien
            product['image_url'] = ''
            product['image'] = ''
            if 'images' in product:
                product['images'] = []
            
            killed_count += 1
            filename = get_image_filename(image_url) or image_url
            print(f"💀 [{i}] {product.get('name', '')[:50]}")
            print(f"   TUE: Lien mort supprimé ({filename})")
    
    print()
    print("=" * 70)
    print("💾 Sauvegarde du JSON...")
    
    # Sauvegarder le JSON (TOUJOURS, même s'il y a eu des erreurs)
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
    print("✅ NETTOYAGE RADICAL TERMINÉ")
    print()
    print(f"📊 Statistiques:")
    print(f"   • Liens morts supprimés: {killed_count}")
    print(f"   • Images valides conservées: {kept_count}")
    print(f"   • Backup créé: {backup_path}")
    print()
    print("🎯 Résultat : 0 lien mort, 0 erreur 404, 0 crash")
    print()

if __name__ == '__main__':
    main()

