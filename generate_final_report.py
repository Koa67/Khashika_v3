#!/usr/bin/env python3
"""
Script pour générer le rapport final de vérification
"""
import json
import os
from datetime import datetime

def generate_final_report():
    json_path = "lib/data/products-ultimate.json"
    images_dir = "public/images/products"
    backup_dir = os.path.join(images_dir, 'backups')
    
    # Charger les données
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Initialiser le rapport
    report = {
        "timestamp": datetime.now().isoformat(),
        "products": {
            "total": len(data['products']),
            "with_main_image": 0,
            "with_images_array": 0,
            "without_main_image": []
        },
        "images": {
            "main_images": {
                "total": 0,
                "unique": 0,
                "duplicates": 0
            },
            "arrays": {
                "total_in_arrays": 0,
                "valid_in_arrays": 0,
                "invalid_in_arrays": 0,
                "external_urls": 0
            },
            "filesystem": {
                "total": 0,
                "referenced": 0,
                "orphan": 0
            }
        },
        "details": {
            "products_without_main_image": [],
            "duplicate_main_images": {},
            "sample_invalid_images": []
        }
    }
    
    # Lister les images existantes dans le filesystem
    existing_images = set()
    for root, dirs, files in os.walk(images_dir):
        if 'backups' in root:
            continue
        for file in files:
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                rel_path = os.path.join(root, file).replace(images_dir, '').lstrip('/')
                existing_images.add(rel_path)
    
    report['images']['filesystem']['total'] = len(existing_images)
    
    # Analyser les produits
    main_image_usage = {}
    referenced_images = set()
    invalid_images_in_arrays = []
    
    for product in data['products']:
        # Image principale
        main_img = product.get('image', '')
        if main_img:
            if main_img.startswith('/images/products/'):
                report['products']['with_main_image'] += 1
                main_image_usage.setdefault(main_img, []).append(product['id'])
                ref_path = main_img.replace('/images/products/', '')
                referenced_images.add(ref_path)
            else:
                report['products']['without_main_image'].append(product['id'])
        else:
            report['products']['without_main_image'].append(product['id'])
        
        # Array d'images
        if 'images' in product and isinstance(product['images'], list):
            report['products']['with_images_array'] += 1
            report['images']['arrays']['total_in_arrays'] += len(product['images'])
            
            for img in product['images']:
                if img.startswith(('http://', 'https://')):
                    report['images']['arrays']['external_urls'] += 1
                elif img.startswith('/images/products/'):
                    ref_path = img.replace('/images/products/', '')
                    if ref_path in existing_images:
                        report['images']['arrays']['valid_in_arrays'] += 1
                        referenced_images.add(ref_path)
                    else:
                        report['images']['arrays']['invalid_in_arrays'] += 1
                        if len(invalid_images_in_arrays) < 10:
                            invalid_images_in_arrays.append(img)
    
    # Statistiques images principales
    report['images']['main_images']['total'] = len(main_image_usage)
    report['images']['main_images']['unique'] = len([img for img, ids in main_image_usage.items() if len(ids) == 1])
    duplicates = {img: ids for img, ids in main_image_usage.items() if len(ids) > 1}
    report['images']['main_images']['duplicates'] = len(duplicates)
    report['details']['duplicate_main_images'] = {img: len(ids) for img, ids in list(duplicates.items())[:10]}
    
    # Images référencées vs orphelines
    report['images']['filesystem']['referenced'] = len(referenced_images)
    report['images']['filesystem']['orphan'] = report['images']['filesystem']['total'] - len(referenced_images)
    
    # Détails
    report['details']['products_without_main_image'] = report['products']['without_main_image'][:20]
    report['details']['sample_invalid_images'] = invalid_images_in_arrays
    
    # Sauvegarder le rapport JSON
    with open('final_verification_report.json', 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # Générer un rapport texte lisible
    summary = f"""
{'=' * 70}
📋 RAPPORT FINAL DE VÉRIFICATION
{'=' * 70}

📦 PRODUITS
   Total: {report['products']['total']}
   Avec image principale: {report['products']['with_main_image']}/{report['products']['total']} ({report['products']['with_main_image']*100//report['products']['total']}%)
   Sans image principale: {len(report['products']['without_main_image'])}
   Avec array d'images: {report['products']['with_images_array']}/{report['products']['total']} ({report['products']['with_images_array']*100//report['products']['total']}%)

🖼️  IMAGES PRINCIPALES
   Total: {report['images']['main_images']['total']}
   Uniques: {report['images']['main_images']['unique']}
   Dupliquées: {report['images']['main_images']['duplicates']}

📸 ARRAYS D'IMAGES
   Total dans arrays: {report['images']['arrays']['total_in_arrays']}
   Valides: {report['images']['arrays']['valid_in_arrays']} ({report['images']['arrays']['valid_in_arrays']*100//max(report['images']['arrays']['total_in_arrays'], 1)}%)
   Invalides: {report['images']['arrays']['invalid_in_arrays']} ({report['images']['arrays']['invalid_in_arrays']*100//max(report['images']['arrays']['total_in_arrays'], 1)}%)
   URLs externes: {report['images']['arrays']['external_urls']}

💾 FILESYSTEM
   Images totales: {report['images']['filesystem']['total']}
   Images référencées: {report['images']['filesystem']['referenced']}
   Images orphelines: {report['images']['filesystem']['orphan']}

{'=' * 70}
"""
    
    print(summary)
    
    # Vérifier si tout est OK
    all_ok = (
        len(report['products']['without_main_image']) == 0 and
        report['images']['arrays']['invalid_in_arrays'] == 0 and
        report['images']['filesystem']['orphan'] == 0
    )
    
    if all_ok:
        print("✅ TOUT EST PARFAIT!")
    else:
        print("⚠️  PROBLÈMES DÉTECTÉS:")
        if len(report['products']['without_main_image']) > 0:
            print(f"   - {len(report['products']['without_main_image'])} produits sans image principale")
        if report['images']['arrays']['invalid_in_arrays'] > 0:
            print(f"   - {report['images']['arrays']['invalid_in_arrays']} références invalides dans les arrays")
        if report['images']['filesystem']['orphan'] > 0:
            print(f"   - {report['images']['filesystem']['orphan']} images orphelines dans le filesystem")
    
    print("=" * 70)
    print(f"📄 Rapport JSON sauvegardé: final_verification_report.json")
    
    return report

if __name__ == "__main__":
    generate_final_report()





