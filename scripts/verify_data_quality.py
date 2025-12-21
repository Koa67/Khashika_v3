#!/usr/bin/env python3
"""
Script de vérification de la qualité des données : génération d'un rapport HTML.

Ce script :
1. Charge products-scraped.json (ou products-ultimate.json en fallback)
2. Génère un rapport HTML interactif avec aperçu visuel de chaque produit
3. Détecte les produits sans images (placeholders)
4. Affiche des statistiques de qualité
"""

from pathlib import Path
import json
import sys
from collections import Counter

# Chemins des fichiers
DATA_PATH = Path('lib/data/products-scraped.json')
FALLBACK_PATH = Path('lib/data/products-ultimate.json')
REPORT_DIR = Path('reports')
REPORT_PATH = REPORT_DIR / 'products_image_report.html'


def load_products_data():
    """Charge les données produits depuis products-scraped.json ou fallback."""
    if DATA_PATH.exists():
        print(f"📂 Chargement de {DATA_PATH}")
        try:
            with open(DATA_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', data) if isinstance(data, dict) else data
            print(f"   ✅ {len(products)} produits chargés depuis products-scraped.json")
            return products
        except Exception as e:
            print(f"   ⚠️  Erreur lecture products-scraped.json: {e}")
    
    if FALLBACK_PATH.exists():
        print(f"📂 Fallback: Chargement de {FALLBACK_PATH}")
        try:
            with open(FALLBACK_PATH, 'r', encoding='utf-8') as f:
                data = json.load(f)
            products = data.get('products', data) if isinstance(data, dict) else data
            print(f"   ✅ {len(products)} produits chargés depuis products-ultimate.json")
            return products
        except Exception as e:
            print(f"   ⚠️  Erreur lecture products-ultimate.json: {e}")
    
    print("❌ Aucun fichier de données trouvé")
    sys.exit(1)


def get_product_image(product):
    """Extrait l'image principale d'un produit."""
    # Priorité 1: image (string)
    if 'image' in product and isinstance(product['image'], str) and product['image'].strip():
        img = product['image'].strip()
        if img and not img.startswith('http') and 'placeholder' not in img.lower():
            return img
    
    # Priorité 2: image_url (string)
    if 'image_url' in product and isinstance(product['image_url'], str) and product['image_url'].strip():
        img = product['image_url'].strip()
        if img and not img.startswith('http') and 'placeholder' not in img.lower():
            return img
    
    # Priorité 3: images[0] (première image du tableau)
    if 'images' in product and isinstance(product['images'], list) and len(product['images']) > 0:
        img = product['images'][0]
        if isinstance(img, str) and img.strip() and not img.startswith('http') and 'placeholder' not in img.lower():
            return img.strip()
    
    # Fallback: placeholder
    return '/placeholder-image.svg'


def analyze_quality(products):
    """Analyse la qualité des données et retourne des statistiques."""
    stats = {
        'total': len(products),
        'with_images': 0,
        'with_placeholders': 0,
        'by_category': Counter(),
        'image_usage': Counter(),
    }
    
    for product in products:
        if not isinstance(product, dict):
            continue
        
        # Catégorie
        category = product.get('category', 'Non catégorisé')
        stats['by_category'][category] += 1
        
        # Image
        img = get_product_image(product)
        if img == '/placeholder-image.svg' or 'placeholder' in img.lower():
            stats['with_placeholders'] += 1
        else:
            stats['with_images'] += 1
            stats['image_usage'][img] += 1
    
    return stats


def generate_html_report(products, stats):
    """Génère le rapport HTML."""
    print("\n📝 Génération du rapport HTML...")
    
    rows = []
    for idx, product in enumerate(products, 1):
        if not isinstance(product, dict):
            continue
        
        # Données du produit
        product_id = product.get('id', 'N/A')
        slug = product.get('slug', 'N/A')
        name = product.get('name') or product.get('title', 'N/A')
        category = product.get('category', 'N/A')
        price = product.get('price', 0.0)
        price_str = f"{price:.2f} €" if price > 0 else "Prix sur demande"
        
        # Image
        img = get_product_image(product)
        has_placeholder = img == '/placeholder-image.svg' or 'placeholder' in img.lower()
        
        # Style de la ligne (rouge si placeholder)
        row_style = 'background-color: #ffe5e5;' if has_placeholder else 'background-color: white;'
        
        # Lien vers la source
        source_url = product.get('source_url', '')
        source_link = f'<a href="{source_url}" target="_blank" style="color: #2596be; text-decoration: none;">🔗</a>' if source_url else ''
        
        row = f"""
        <tr style="{row_style}">
          <td style="font-weight: 600;">{product_id[:30]}...</td>
          <td>{slug[:40]}...</td>
          <td>{name[:50]}</td>
          <td>{category}</td>
          <td style="text-align: right;">{price_str}</td>
          <td style="text-align: center;">
            <img src="{img}" 
                 alt="{name}" 
                 style="max-width: 120px; max-height: 120px; border-radius: 4px; object-fit: contain; background: #f5f5f5; padding: 4px;"
                 onerror="this.src='/placeholder-image.svg'; this.style.border='2px solid red';" />
          </td>
          <td style="text-align: center;">{source_link}</td>
        </tr>
        """
        rows.append(row)
    
    # Statistiques HTML
    stats_html = f"""
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="margin-top: 0; color: #2596be;">📊 Statistiques</h2>
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
        <div style="padding: 10px; background: #f0f8ff; border-radius: 4px;">
          <strong>Total produits:</strong> {stats['total']}
        </div>
        <div style="padding: 10px; background: #e8f5e9; border-radius: 4px;">
          <strong>Avec images:</strong> {stats['with_images']} ({stats['with_images']/stats['total']*100:.1f}%)
        </div>
        <div style="padding: 10px; background: #fff3e0; border-radius: 4px;">
          <strong>Avec placeholders:</strong> {stats['with_placeholders']} ({stats['with_placeholders']/stats['total']*100:.1f}%)
        </div>
      </div>
      
      <h3 style="margin-top: 20px; color: #2596be;">Par catégorie:</h3>
      <ul style="list-style: none; padding: 0;">
        {''.join([f'<li style="padding: 5px 0;">{cat}: {count} produits</li>' for cat, count in stats['by_category'].most_common(10)])}
      </ul>
    </div>
    """
    
    # HTML complet
    html = f"""
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Rapport Qualité Images Produits - Khashika</title>
        <style>
          * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }}
          
          body {{
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            background: #f4f1eb;
            padding: 20px;
            color: #1a1a1a;
          }}
          
          .container {{
            max-width: 1600px;
            margin: 0 auto;
          }}
          
          h1 {{
            color: #2596be;
            margin-bottom: 10px;
            font-size: 2em;
          }}
          
          .subtitle {{
            color: #666;
            margin-bottom: 30px;
          }}
          
          table {{
            border-collapse: collapse;
            width: 100%;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            border-radius: 8px;
            overflow: hidden;
          }}
          
          thead {{
            background: linear-gradient(135deg, #2596be 0%, #1e7a9e 100%);
            color: white;
          }}
          
          th {{
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 0.9em;
            position: sticky;
            top: 0;
            z-index: 10;
          }}
          
          td {{
            padding: 10px 8px;
            font-size: 0.85em;
            border-bottom: 1px solid #e0e0e0;
          }}
          
          tbody tr:hover {{
            background-color: #f9f9f9;
          }}
          
          .placeholder-row {{
            background-color: #ffe5e5 !important;
          }}
          
          .search-box {{
            margin-bottom: 20px;
            padding: 10px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }}
          
          .search-box input {{
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 1em;
          }}
          
          .search-box input:focus {{
            outline: none;
            border-color: #2596be;
          }}
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📸 Rapport Qualité Images Produits</h1>
          <p class="subtitle">Généré le {Path(__file__).stat().st_mtime} | Total: {stats['total']} produits</p>
          
          {stats_html}
          
          <div class="search-box">
            <input type="text" 
                   id="searchInput" 
                   placeholder="🔍 Rechercher par nom, slug, catégorie..." 
                   onkeyup="filterTable()" />
          </div>
          
          <table id="productsTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Slug</th>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Prix</th>
                <th>Image</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {''.join(rows)}
            </tbody>
          </table>
        </div>
        
        <script>
          function filterTable() {{
            const input = document.getElementById('searchInput');
            const filter = input.value.toLowerCase();
            const table = document.getElementById('productsTable');
            const rows = table.getElementsByTagName('tr');
            
            for (let i = 1; i < rows.length; i++) {{
              const row = rows[i];
              const text = row.textContent || row.innerText;
              if (text.toLowerCase().indexOf(filter) > -1) {{
                row.style.display = '';
              }} else {{
                row.style.display = 'none';
              }}
            }}
          }}
        </script>
      </body>
    </html>
    """
    
    return html


def main():
    """Fonction principale."""
    print("=" * 70)
    print("📊 VÉRIFICATION DE LA QUALITÉ DES DONNÉES")
    print("=" * 70)
    
    # 1. Charger les données
    products = load_products_data()
    
    # 2. Analyser la qualité
    print("\n🔍 Analyse de la qualité...")
    stats = analyze_quality(products)
    
    print(f"   📊 Total produits: {stats['total']}")
    print(f"   ✅ Avec images: {stats['with_images']} ({stats['with_images']/stats['total']*100:.1f}%)")
    print(f"   ⚠️  Avec placeholders: {stats['with_placeholders']} ({stats['with_placeholders']/stats['total']*100:.1f}%)")
    print(f"   📁 Catégories: {len(stats['by_category'])}")
    
    # 3. Générer le rapport HTML
    html = generate_html_report(products, stats)
    
    # 4. Sauvegarder le rapport
    REPORT_DIR.mkdir(parents=True, exist_ok=True)
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"\n✅ Rapport généré: {REPORT_PATH}")
    print(f"   📂 Ouvrez ce fichier dans votre navigateur pour visualiser")
    
    print("\n" + "=" * 70)
    print("✅ VÉRIFICATION TERMINÉE")
    print("=" * 70)


if __name__ == '__main__':
    main()






















