import json
import os
import shutil

def fix_missing_images():
    # Chemins
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"

    # Charger les données
    with open(json_path, 'r') as f:
        data = json.load(f)

    # Créer une liste des images orphelines
    all_images = []
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                all_images.append(os.path.join(root, file))

    # Associer les images aux produits sans image
    products_without_images = []
    for product in data['products']:
        if not product.get('image') or not product['image'].startswith('/images/products/'):
            products_without_images.append(product)

    print(f"Produits sans images: {len(products_without_images)}")

    # Associer les images
    for i, product in enumerate(products_without_images[:min(50, len(all_images))]):
        # Trouver une image correspondante (par slug ou nom)
        product_slug = product['slug']
        matching_images = [img for img in all_images if product_slug in img]

        if matching_images:
            img_path = matching_images[0]
            rel_path = img_path.replace(images_dir, '').lstrip('/')
            product['image'] = f"/images/products/{rel_path}"
            print(f"Associé: {product['id']} -> {rel_path}")
        elif i < len(all_images):
            # Utiliser une image orpheline si aucune correspondance
            img_path = all_images[i]
            rel_path = img_path.replace(images_dir, '').lstrip('/')
            product['image'] = f"/images/products/{rel_path}"
            print(f"Associé (orpheline): {product['id']} -> {rel_path}")

    # Sauvegarder
    with open(json_path, 'w') as f:
        json.dump(data, f, indent=2)

    print("✅ Correction des images manquantes terminée")

if __name__ == "__main__":
    fix_missing_images()

