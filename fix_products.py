import json
import os
import shutil

def fix_products():
    # Chemins
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"

    # 1. Charger les données
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # 2. Créer une liste des images disponibles
    available_images = []
    for root, dirs, files in os.walk(images_dir):
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                full_path = os.path.join(root, file)
                rel_path = full_path.replace(images_dir, '').lstrip('/')
                available_images.append(rel_path)

    print(f"Images disponibles: {len(available_images)}")

    # 3. Identifier les produits sans image ou avec image incorrecte
    products_to_fix = []
    for product in data['products']:
        current_image = product.get('image', '')
        if not current_image or not current_image.startswith('/images/products/'):
            products_to_fix.append(product)
        elif not os.path.exists(os.path.join(images_dir, current_image.lstrip('/'))):
            products_to_fix.append(product)

    print(f"Produits à corriger: {len(products_to_fix)}")

    # 4. Associer les images
    fixed_count = 0
    for product in products_to_fix:
        # Essayer de trouver une image correspondant au slug
        matching_images = [img for img in available_images if product['slug'] in img]

        if matching_images:
            chosen_img = matching_images[0]
            product['image'] = f"/images/products/{chosen_img}"
            fixed_count += 1
            available_images.remove(chosen_img)
        elif available_images:
            # Utiliser une image orpheline si aucune correspondance
            chosen_img = available_images[0]
            product['image'] = f"/images/products/{chosen_img}"
            fixed_count += 1
            available_images.remove(chosen_img)

    # 5. Sauvegarder les modifications
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"✅ {fixed_count} produits corrigés")

    # 6. Vérification
    with open(json_path, 'r') as f:
        data = json.load(f)

    products_with_images = [p for p in data['products'] if p.get('image') and p['image'].startswith('/images/products/')]
    print(f"Produits avec images: {len(products_with_images)}/{len(data['products'])}")

if __name__ == "__main__":
    fix_products()

