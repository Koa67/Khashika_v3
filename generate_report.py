import json
import os

def generate_report():
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"

    with open(json_path, 'r') as f:
        data = json.load(f)

    # 1. Produits sans image
    no_image = [p for p in data['products'] if not p.get('image') or not p['image'].startswith('/images/products/')]

    # 2. Images dupliquées
    image_usage = {}
    for p in data['products']:
        if p.get('image'):
            image_usage.setdefault(p['image'], []).append(p['id'])

    duplicates = {img: ids for img, ids in image_usage.items() if len(ids) > 1}

    # 3. Images orphelines
    all_images = set()
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                rel_path = os.path.join(root, file).replace(images_dir, '').lstrip('/')
                all_images.add(rel_path)

    referenced_images = {p['image'].replace('/images/products/', '') for p in data['products'] if p.get('image')}
    orphans = all_images - referenced_images

    # Générer le rapport
    report = {
        "products_without_images": len(no_image),
        "duplicate_images": len(duplicates),
        "orphan_images": len(orphans),
        "details": {
            "products_without_images": no_image,
            "duplicate_images": duplicates,
            "sample_orphan_images": list(orphans)[:20]
        }
    }

    with open('product_image_report.json', 'w') as f:
        json.dump(report, f, indent=2)

    print("Rapport généré: product_image_report.json")

if __name__ == "__main__":
    generate_report()

