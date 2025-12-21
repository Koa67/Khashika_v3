#!/usr/bin/env python3
"""
Script pour aplatir la structure d'images produits.
Déplace toutes les images des sous-dossiers vers /public/images/products/
et génère une map des anciens chemins vers les nouveaux noms.
"""

import os
import shutil
import json
from pathlib import Path
from collections import defaultdict

# Chemins
PRODUCTS_DIR = Path('public/images/products')
BACKUP_DIR = Path('public/images/products_backup_flatten')
MAPPING_FILE = Path('lib/data/image_path_mapping.json')

def flatten_images():
    """Aplatit la structure d'images et génère une map de chemins."""
    print("=" * 70)
    print("📁 APLATISSEMENT DE LA STRUCTURE D'IMAGES")
    print("=" * 70)
    
    if not PRODUCTS_DIR.exists():
        print(f"❌ Dossier introuvable: {PRODUCTS_DIR}")
        return False
    
    # Créer un backup
    print("\n📦 Création du backup...")
    if BACKUP_DIR.exists():
        shutil.rmtree(BACKUP_DIR)
    shutil.copytree(PRODUCTS_DIR, BACKUP_DIR, ignore=shutil.ignore_patterns('backups', 'backup*'))
    print(f"   ✅ Backup créé: {BACKUP_DIR}")
    
    # Map des anciens chemins vers nouveaux noms
    path_mapping = {}
    
    # Compteur pour les noms uniques
    file_counter = defaultdict(int)
    
    # Extensions d'images supportées
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
    
    # Scanner récursivement tous les fichiers images
    print("\n🔍 Scan des images...")
    all_images = []
    for root, dirs, files in os.walk(PRODUCTS_DIR):
        # Ignorer les dossiers de backup
        if 'backup' in root.lower() or 'backups' in root.lower():
            continue
        
        for file in files:
            file_path = Path(root) / file
            ext = file_path.suffix.lower()
            
            if ext in image_extensions:
                rel_path = file_path.relative_to(PRODUCTS_DIR)
                all_images.append((file_path, rel_path))
    
    print(f"   📸 {len(all_images)} images trouvées")
    
    # Traiter chaque image
    print("\n🔄 Déplacement des images...")
    moved_count = 0
    skipped_count = 0
    
    for file_path, rel_path in all_images:
        # Si l'image est déjà à la racine, la garder
        if rel_path.parent == Path('.'):
            # Vérifier si elle a déjà été traitée
            if str(rel_path) not in path_mapping:
                path_mapping[str(rel_path)] = str(rel_path)
            skipped_count += 1
            continue
        
        # Générer un nom unique
        base_name = file_path.stem
        ext = file_path.suffix
        
        # Nettoyer le nom (enlever caractères spéciaux)
        clean_name = base_name.replace(' ', '-').replace('_', '-')
        clean_name = ''.join(c for c in clean_name if c.isalnum() or c in '-')
        
        # Si le nom est trop long, le tronquer
        if len(clean_name) > 50:
            clean_name = clean_name[:50]
        
        # Générer un nom unique
        counter = file_counter[clean_name + ext]
        if counter > 0:
            new_name = f"{clean_name}-{counter}{ext}"
        else:
            new_name = f"{clean_name}{ext}"
        
        file_counter[clean_name + ext] += 1
        
        # Chemin de destination
        dest_path = PRODUCTS_DIR / new_name
        
        # Si le fichier existe déjà et est différent, incrémenter
        while dest_path.exists() and dest_path != file_path:
            counter = file_counter[clean_name + ext]
            new_name = f"{clean_name}-{counter}{ext}"
            dest_path = PRODUCTS_DIR / new_name
            file_counter[clean_name + ext] += 1
        
        # Déplacer le fichier
        try:
            if file_path != dest_path:
                shutil.move(str(file_path), str(dest_path))
                moved_count += 1
                print(f"   ✅ {rel_path} → {new_name}")
            else:
                skipped_count += 1
            
            # Enregistrer le mapping
            old_path = f"/images/products/{rel_path}"
            new_path = f"/images/products/{new_name}"
            path_mapping[old_path] = new_path
            
        except Exception as e:
            print(f"   ❌ Erreur avec {rel_path}: {e}")
    
    # Supprimer les sous-dossiers vides
    print("\n🧹 Suppression des sous-dossiers vides...")
    removed_dirs = 0
    for root, dirs, files in os.walk(PRODUCTS_DIR, topdown=False):
        # Ignorer les dossiers de backup
        if 'backup' in root.lower() or 'backups' in root.lower():
            continue
        
        dir_path = Path(root)
        if dir_path != PRODUCTS_DIR and not any(dir_path.iterdir()):
            try:
                dir_path.rmdir()
                removed_dirs += 1
                print(f"   ✅ Supprimé: {dir_path.relative_to(PRODUCTS_DIR)}")
            except Exception as e:
                print(f"   ⚠️  Impossible de supprimer {dir_path}: {e}")
    
    # Sauvegarder la map
    print("\n💾 Sauvegarde de la map des chemins...")
    MAPPING_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(MAPPING_FILE, 'w', encoding='utf-8') as f:
        json.dump(path_mapping, f, indent=2, ensure_ascii=False)
    print(f"   ✅ Map sauvegardée: {MAPPING_FILE}")
    
    # Résumé
    print("\n" + "=" * 70)
    print("✅ APLATISSEMENT TERMINÉ")
    print("=" * 70)
    print(f"   📸 Images traitées: {len(all_images)}")
    print(f"   ✅ Images déplacées: {moved_count}")
    print(f"   ⏭️  Images ignorées (déjà à la racine): {skipped_count}")
    print(f"   🗑️  Dossiers supprimés: {removed_dirs}")
    print(f"   📋 Mappings créés: {len(path_mapping)}")
    print(f"   💾 Backup: {BACKUP_DIR}")
    print("=" * 70)
    
    return True

if __name__ == '__main__':
    try:
        flatten_images()
    except Exception as e:
        print(f"\n❌ ERREUR: {e}")
        import traceback
        traceback.print_exc()
        exit(1)



















