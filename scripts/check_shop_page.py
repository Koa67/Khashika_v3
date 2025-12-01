#!/usr/bin/env python3
"""Vérifier la configuration de la page shop."""

import os
import glob

print("🔍 Diagnostic de la page /shop")
print()

# Trouver le fichier de la page shop
patterns = [
    'app/shop/**/*.tsx',
    'app/shop/**/*.ts', 
    'app/shop/**/*.jsx',
    'app/shop/**/*.js',
    'pages/shop/**/*.tsx',
    'pages/shop/**/*.ts'
]

shop_files = []
for pattern in patterns:
    shop_files.extend(glob.glob(pattern, recursive=True))

if shop_files:
    print(f"📄 {len(shop_files)} fichier(s) trouvé(s) :")
    for f in shop_files:
        print(f"  - {f}")
        print()
        
        # Lire et chercher la logique de chargement
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
            # Afficher les 50 premières lignes
            lines = content.split('\n')[:50]
            print("    Extrait du fichier :")
            for i, line in enumerate(lines[:10], 1):
                print(f"    {i:3d}: {line}")
            print("    ...")
            print()
            
            # Chercher si pagination existe
            if 'slice(' in content or 'pagination' in content.lower():
                print(f"    ✓ Pagination détectée")
            else:
                print(f"    ⚠ Pas de pagination détectée")
            
            # Chercher combien de produits sont chargés
            if 'products.length' in content:
                print(f"    ⚠ Utilise products.length (tous les produits)")
            
            print()
else:
    print("❌ Aucun fichier shop trouvé")
    print()
    print("Recherche dans app/ et pages/...")
    
    # Lister la structure
    if os.path.exists('app'):
        print("\n�� Structure app/ :")
        for root, dirs, files in os.walk('app'):
            level = root.replace('app', '').count(os.sep)
            indent = ' ' * 2 * level
            print(f'{indent}{os.path.basename(root)}/')
            subindent = ' ' * 2 * (level + 1)
            for file in files:
                if file.endswith(('.tsx', '.ts', '.jsx', '.js')):
                    print(f'{subindent}{file}')

print()
print("💡 Solution recommandée :")
print("  - Implémenter une pagination (24-48 produits par page)")
print("  - Ou utiliser un scroll infini avec chargement progressif")
