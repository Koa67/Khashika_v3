#!/usr/bin/env python3
"""
Script d'extraction ultime pour migrer 100% des données depuis _LEGACY_CLONE
Extrait : Produits (avec attributs), Images (galerie complète), Pages de contenu
"""

import os
import json
import re
import warnings
from pathlib import Path
from bs4 import BeautifulSoup, XMLParsedAsHTMLWarning
from typing import Dict, List, Any, Optional
import shutil

# Supprimer les warnings XML
warnings.filterwarnings("ignore", category=XMLParsedAsHTMLWarning)

# Configuration
LEGACY_DIR = Path('_LEGACY_CLONE/www.khashika.com')
OUTPUT_DIR = Path('lib/data')
IMAGES_DIR = Path('public/images/products')
PRODUCTS_OUTPUT = OUTPUT_DIR / 'products-ultimate.json'
PAGES_OUTPUT = OUTPUT_DIR / 'pages-ultimate.json'

def slugify(text: str) -> str:
    """Convertit un texte en slug URL-friendly"""
    if not text:
        return ''
    text = text.lower().strip()
    text = re.sub(r'[àáâãäå]', 'a', text)
    text = re.sub(r'[èéêë]', 'e', text)
    text = re.sub(r'[ìíîï]', 'i', text)
    text = re.sub(r'[òóôõö]', 'o', text)
    text = re.sub(r'[ùúûü]', 'u', text)
    text = re.sub(r'[ç]', 'c', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def extract_price(text: str) -> Optional[float]:
    """Extrait le prix depuis un texte (ex: "45,00 €" -> 45.0)"""
    if not text:
        return None
    
    # Cherche les patterns de prix
    patterns = [
        r'(\d+)[,\s](\d+)\s*€',  # "45,00 €" ou "45 00 €"
        r'(\d+)[,.](\d+)\s*€',   # "45.00 €"
        r'(\d+)\s*€',            # "45 €"
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text.replace(' ', ''))
        if match:
            if len(match.groups()) == 2:
                return float(f"{match.group(1)}.{match.group(2)}")
            else:
                return float(match.group(1))
    
    return None

def extract_attributes(soup: BeautifulSoup) -> Dict[str, str]:
    """Extrait les attributs du produit (Pierre, Matière, Dimensions, etc.)"""
    attributes = {}
    
    # Cherche dans les tableaux
    tables = soup.find_all('table', class_=re.compile(r'shop_attributes|attributes|specs'))
    for table in tables:
        rows = table.find_all('tr')
        for row in rows:
            th = row.find('th')
            td = row.find('td')
            if th and td:
                key = th.get_text(strip=True).lower()
                value = td.get_text(strip=True)
                
                if 'pierre' in key or 'stone' in key:
                    attributes['stone'] = value
                elif 'matière' in key or 'material' in key or 'materiau' in key:
                    attributes['material'] = value
                elif 'dimension' in key or 'size' in key or 'taille' in key:
                    attributes['dimensions'] = value
                elif 'origine' in key or 'origin' in key:
                    attributes['origin'] = value
    
    # Cherche dans les listes
    lists = soup.find_all('ul', class_=re.compile(r'attributes|specs|details'))
    for ul in lists:
        items = ul.find_all('li')
        for item in items:
            text = item.get_text(strip=True)
            # Pattern: "Pierre: Turquoise" ou "Matière: Argent"
            match = re.match(r'([^:]+):\s*(.+)', text)
            if match:
                key = match.group(1).lower()
                value = match.group(2)
                
                if 'pierre' in key or 'stone' in key:
                    attributes['stone'] = value
                elif 'matière' in key or 'material' in key:
                    attributes['material'] = value
                elif 'dimension' in key or 'size' in key:
                    attributes['dimensions'] = value
                elif 'origine' in key or 'origin' in key:
                    attributes['origin'] = value
    
    # Cherche dans le texte de la description
    description = soup.find('div', class_=re.compile(r'description|content|entry-content'))
    if description:
        desc_text = description.get_text()
        # Patterns dans le texte
        patterns = {
            'stone': r'(?:pierre|stone)[:\s]+([^\n,\.]+)',
            'material': r'(?:matière|material|materiau)[:\s]+([^\n,\.]+)',
            'dimensions': r'(?:dimension|size|taille)[:\s]+([^\n,\.]+)',
            'origin': r'(?:origine|origin)[:\s]+([^\n,\.]+)',
        }
        
        for attr_key, pattern in patterns.items():
            if attr_key not in attributes:
                match = re.search(pattern, desc_text, re.IGNORECASE)
                if match:
                    attributes[attr_key] = match.group(1).strip()
    
    return attributes

def extract_images(soup: BeautifulSoup, product_slug: str) -> List[str]:
    """Extrait toutes les images du produit (galerie complète)"""
    images = []
    
    # Image principale
    main_img = soup.find('img', class_=re.compile(r'main|featured|primary|product-image'))
    if main_img:
        src = main_img.get('src') or main_img.get('data-src') or main_img.get('data-lazy-src')
        if src:
            images.append(src)
    
    # Galerie (carrousel, thumbnails)
    galleries = soup.find_all(['div', 'ul'], class_=re.compile(r'gallery|images|thumbnails|carousel|slider'))
    for gallery in galleries:
        imgs = gallery.find_all('img')
        for img in imgs:
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src') or img.get('data-original')
            if src and src not in images:
                images.append(src)
    
    # Toutes les images dans la zone produit
    product_area = soup.find('div', class_=re.compile(r'product|single-product'))
    if product_area:
        imgs = product_area.find_all('img')
        for img in imgs:
            src = img.get('src') or img.get('data-src') or img.get('data-lazy-src')
            if src and src not in images and 'logo' not in src.lower() and 'icon' not in src.lower():
                images.append(src)
    
    # Nettoyer et copier les images
    cleaned_images = []
    for img_path in images:
        if not img_path or img_path.startswith('data:'):
            continue
        
        # Nettoyer le chemin
        if img_path.startswith('http'):
            # URL externe, on garde tel quel
            cleaned_images.append(img_path)
        else:
            # Chemin relatif, on le nettoie
            img_path = img_path.lstrip('/')
            if '_raw_assets' in img_path:
                filename = os.path.basename(img_path)
            else:
                filename = os.path.basename(img_path)
            
            # Créer le dossier produit
            product_img_dir = IMAGES_DIR / product_slug
            product_img_dir.mkdir(parents=True, exist_ok=True)
            
            # Copier l'image si elle existe
            legacy_img_path = LEGACY_DIR / img_path
            if legacy_img_path.exists():
                dest_path = product_img_dir / filename
                try:
                    shutil.copy2(legacy_img_path, dest_path)
                    cleaned_images.append(f'/images/products/{product_slug}/{filename}')
                except Exception as e:
                    print(f"Erreur copie image {img_path}: {e}")
            else:
                # Si l'image n'existe pas, on garde le chemin original
                cleaned_images.append(f'/images/products/{product_slug}/{filename}')
    
    return cleaned_images

def extract_product(html_path: Path) -> Optional[Dict[str, Any]]:
    """Extrait les données d'un produit depuis un fichier HTML"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # CIBLAGE PRÉCIS DU PRIX (WooCommerce)
        price = None
        price_elem = soup.find('p', class_='price') or soup.find('span', class_='amount')
        if price_elem:
            price = extract_price(price_elem.get_text())
        
        # Si pas de prix trouvé -> Ignorer le fichier
        if not price:
            return None
        
        # CIBLAGE PRÉCIS DU NOM (H1 produit WooCommerce)
        h1 = soup.find('h1', class_='product_title') or soup.find('h1')
        if not h1:
            return None
        
        name = h1.get_text(strip=True)
        
        # Si le H1 contient "Khashika" ou "Bijoux d'Inde" -> IGNORER (page générique)
        if 'khashika' in name.lower() or 'bijoux d\'inde' in name.lower() or 'bijoux d\'inde' in name.lower():
            return None
        
        # Vérifier que ce n'est pas juste un titre de page générique
        if len(name) < 3 or name.lower() in ['accueil', 'boutique', 'contact', 'livraison', 'mentions légales']:
            return None
        
        # Description
        description = ''
        desc_elem = soup.find('div', class_=re.compile(r'description|content|entry-content|product-description'))
        if desc_elem:
            # Nettoyer le HTML mais garder la structure
            for script in desc_elem.find_all(['script', 'style']):
                script.decompose()
            description = str(desc_elem)
        else:
            # Chercher dans les paragraphes
            paragraphs = soup.find_all('p')
            description = '\n'.join([p.get_text(strip=True) for p in paragraphs[:5]])
        
        # Attributs
        attributes = extract_attributes(soup)
        
        # Slug
        slug = slugify(name)
        
        # Images (galerie complète)
        images = extract_images(soup, slug)
        
        # Catégorie (depuis le breadcrumb ou menu)
        category = 'bijoux'
        breadcrumb = soup.find('nav', class_=re.compile(r'breadcrumb'))
        if breadcrumb:
            links = breadcrumb.find_all('a')
            if len(links) > 1:
                category = links[-1].get_text(strip=True).lower()
        
        return {
            'id': f'prod-{slug}',
            'name': name,
            'slug': slug,
            'title': name,
            'price': price,
            'description': description,
            'images': images,
            'image': images[0] if images else '/placeholder-image.svg',
            'image_url': images[0] if images else '/placeholder-image.svg',
            'attributes': attributes,
            'category': category,
            'isNew': False,
            'isOnSale': False,
        }
    
    except Exception as e:
        print(f"Erreur extraction produit {html_path}: {e}")
        return None

def extract_page_content(html_path: Path) -> Optional[Dict[str, str]]:
    """Extrait le contenu HTML d'une page institutionnelle"""
    try:
        with open(html_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        soup = BeautifulSoup(content, 'html.parser')
        
        # Identifier le type de page
        filename = html_path.stem.lower()
        title = soup.find('h1') or soup.find('title')
        page_title = title.get_text(strip=True) if title else filename
        
        page_type = None
        if 'livraison' in filename or 'shipping' in filename or 'delivery' in filename:
            page_type = 'delivery'
        elif 'histoire' in filename or 'story' in filename or 'about' in filename or 'a-propos' in filename:
            page_type = 'story'
        elif 'contact' in filename:
            page_type = 'contact'
        elif 'mentions' in filename or 'legal' in filename or 'cgv' in filename:
            page_type = 'legal'
        elif 'cgv' in filename or 'conditions' in filename:
            page_type = 'cgv'
        
        if not page_type:
            return None
        
        # Extraire le contenu principal
        content_elem = soup.find('article') or soup.find('div', class_=re.compile(r'entry-content|content|main-content|post-content'))
        
        if not content_elem:
            return None
        
        # Nettoyer le HTML
        for script in content_elem.find_all(['script', 'style']):
            script.decompose()
        
        # Supprimer les images legacy qui causent des 404
        for img in content_elem.find_all('img'):
            src = img.get('src', '')
            if 'wp-content' in src or 'logo-khashika' in src or 'DSC' in src or 'carte-' in src:
                img.decompose()
        
        html_content = str(content_elem)
        
        return {
            'type': page_type,
            'title': page_title,
            'content': html_content,
        }
    
    except Exception as e:
        print(f"Erreur extraction page {html_path}: {e}")
        return None

def should_process_file(file_path: Path) -> bool:
    """Vérifie si un fichier doit être traité (filtre les fichiers système)"""
    path_str = str(file_path).lower()
    file_name = file_path.name.lower()
    
    # Ignorer les fichiers avec ces chemins
    ignore_patterns = [
        'wp-content',
        'plugins',
        'themes',
        'node_modules',
        'vendor',
        'admin',
        'wp-admin',
        'wp-includes',
        'css',
        'js',
    ]
    
    for pattern in ignore_patterns:
        if pattern in path_str:
            return False
    
    # Ne garder que les fichiers .html (pas .cur.html, .bak.html, etc.)
    if not file_path.suffix == '.html':
        return False
    
    # Ignorer les fichiers de sauvegarde/temporaires dans le nom
    if any(x in file_name for x in ['.cur', '.bak', '.tmp', '.old', 'copy', 'backup', '~']):
        return False
    
    # Ignorer les fichiers avec ? ou % dans le nom (doublons d'URL)
    if '?' in file_name or '%' in file_name:
        return False
    
    # Ignorer les fichiers trop petits (probablement vides ou corrompus)
    try:
        if file_path.stat().st_size < 100:
            return False
    except:
        return False
    
    return True

def main():
    """Fonction principale d'extraction"""
    print("🕷️  Démarrage de l'extraction ultime...")
    
    if not LEGACY_DIR.exists():
        print(f"❌ Dossier {LEGACY_DIR} introuvable!")
        return
    
    # Créer les dossiers de sortie
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)
    
    products = []
    pages = {}
    seen_products = set()  # Déduplication en temps réel
    new_products_count = 0
    
    # Parcourir tous les fichiers HTML avec filtrage
    print("📂 Scan des fichiers HTML...")
    all_html_files = list(LEGACY_DIR.rglob('*.html'))
    html_files = [f for f in all_html_files if should_process_file(f)]
    
    total_files = len(html_files)
    print(f"📄 {len(all_html_files)} fichiers HTML trouvés")
    print(f"✅ {total_files} fichiers HTML valides après filtrage")
    print(f"🚀 Traitement en cours...\n")
    
    for index, html_file in enumerate(html_files, 1):
        # Barre de progression tous les 100 fichiers
        if index % 100 == 0 or index == total_files:
            print(f"[{index}/{total_files}] Traitement en cours... ({new_products_count} nouveaux produits trouvés)", end='\r')
        
        # Essayer d'extraire un produit
        product = extract_product(html_file)
        if product:
            # Déduplication : vérifier si le nom existe déjà
            product_name_normalized = product['name'].lower().strip()
            if product_name_normalized in seen_products:
                # Doublon détecté, ignorer
                continue
            
            # Nouveau produit, l'ajouter
            seen_products.add(product_name_normalized)
            products.append(product)
            new_products_count += 1
            continue
        
        # Essayer d'extraire une page de contenu
        page = extract_page_content(html_file)
        if page:
            pages[page['type']] = page['content']
    
    print()  # Nouvelle ligne après la progression
    
    # Sauvegarder les produits
    print(f"\n💾 Sauvegarde de {len(products)} produits uniques...")
    with open(PRODUCTS_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump({'products': products}, f, ensure_ascii=False, indent=2)
    
    # Sauvegarder les pages
    print(f"💾 Sauvegarde de {len(pages)} pages...")
    with open(PAGES_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)
    
    print(f"\n🎉 Migration terminée!")
    print(f"   - {len(products)} produits uniques extraits (doublons ignorés)")
    print(f"   - {len(pages)} pages extraites")
    print(f"   - Images copiées dans {IMAGES_DIR}")

if __name__ == '__main__':
    main()

