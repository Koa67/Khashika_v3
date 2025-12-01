import json
import os
import shutil

def clean_images():
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"
    backup_dir = os.path.join(images_dir, 'backups')

    # 1. Charger les images référencées
    with open(json_path, 'r') as f:
        data = json.load(f)

    referenced_images = set()
    for product in data['products']:
        if product.get('image'):
            referenced_images.add(product['image'].replace('/images/products/', ''))

    # 2. Trouver les images orphelines
    all_images = set()
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                rel_path = os.path.join(root, file).replace(images_dir, '').lstrip('/')
                all_images.add(rel_path)

    orphan_images = all_images - referenced_images
    print(f"Images orphelines: {len(orphan_images)}")

    # 3. Déplacer vers backup (au lieu de supprimer)
    os.makedirs(backup_dir, exist_ok=True)

    moved_count = 0
    for img in orphan_images:
        src = os.path.join(images_dir, img)
        dst = os.path.join(backup_dir, img)
        try:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.move(src, dst)
            moved_count += 1
        except Exception as e:
            print(f"Erreur avec {img}: {e}")

    print(f"✅ {moved_count} images déplacées vers {backup_dir}")

if __name__ == "__main__":
    clean_images()

