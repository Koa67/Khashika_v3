/**
 * Script d'extraction des prix depuis le legacy clone
 * et mise à jour de products-ultimate.json
 * 
 * Usage: npx tsx scripts/extract-prices.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const LEGACY_PRODUIT_DIR = './_LEGACY_CLONE/www.khashika.com/produit';
const PRODUCTS_JSON_PATH = './lib/data/products-ultimate.json';
const OUTPUT_PATH = './lib/data/products-ultimate.json';
const BACKUP_PATH = './lib/data/products-ultimate-before-prices.backup.json';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  source_url?: string;
  sku?: string;
  [key: string]: unknown;
}

interface PriceData {
  price: number;
  name: string;
  sku: string;
  legacySlug: string;
}

/**
 * Extraire le prix d'un fichier HTML via JSON-LD ou autres patterns
 */
function extractPriceFromHTML(htmlContent: string, folderName: string): PriceData | null {
  let price = 0;
  let name = '';
  let sku = '';

  // Méthode 1: JSON-LD Schema.org
  const jsonLdMatches = htmlContent.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  
  for (const match of jsonLdMatches) {
    try {
      const jsonStr = match[1].trim();
      const jsonData = JSON.parse(jsonStr);
      
      // Chercher le produit dans @graph ou directement
      let product = null;
      if (jsonData['@graph'] && Array.isArray(jsonData['@graph'])) {
        product = jsonData['@graph'].find((item: any) => item['@type'] === 'Product');
      } else if (jsonData['@type'] === 'Product') {
        product = jsonData;
      }
      
      if (product) {
        name = product.name || name;
        sku = product.sku || sku;
        
        if (product.offers) {
          const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
          if (offer && offer.price) {
            price = parseFloat(offer.price);
          }
        }
        
        if (price > 0) break;
      }
    } catch (e) {
      // Continue to next match
    }
  }

  // Méthode 2: Pattern HTML WooCommerce price
  if (price === 0) {
    // Pattern: <span class="woocommerce-Price-amount amount">24,00&nbsp;<span...>€</span></span>
    const priceMatch = htmlContent.match(/class="woocommerce-Price-amount amount"[^>]*>([0-9]+[,.]?[0-9]*)\s*[&nbsp;]*<span[^>]*class="woocommerce-Price-currencySymbol"/i);
    if (priceMatch) {
      price = parseFloat(priceMatch[1].replace(',', '.'));
    }
  }

  // Méthode 3: Pattern meta itemprop price
  if (price === 0) {
    const metaPrice = htmlContent.match(/itemprop="price"\s+content="([0-9.]+)"/i);
    if (metaPrice) {
      price = parseFloat(metaPrice[1]);
    }
  }

  // Méthode 4: Pattern "price":"XX.XX" dans le JSON inline
  if (price === 0) {
    const inlinePrice = htmlContent.match(/"price"\s*:\s*"([0-9.]+)"/);
    if (inlinePrice) {
      price = parseFloat(inlinePrice[1]);
    }
  }

  // Extraire le SKU si pas trouvé
  if (!sku) {
    const skuMatch = htmlContent.match(/UGS\s*:?\s*<[^>]*>([A-Z0-9]+)/i) ||
                     htmlContent.match(/"sku"\s*:\s*"([^"]+)"/i) ||
                     htmlContent.match(/class="sku"[^>]*>([^<]+)/i);
    if (skuMatch) {
      sku = skuMatch[1].trim();
    }
  }

  // Extraire le nom si pas trouvé
  if (!name) {
    const titleMatch = htmlContent.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([^<]+)/i) ||
                       htmlContent.match(/<title>([^<|]+)/i);
    if (titleMatch) {
      name = titleMatch[1].trim();
    }
  }

  if (price > 0) {
    return { price, name, sku, legacySlug: folderName };
  }

  return null;
}

/**
 * Normaliser un slug pour comparaison
 */
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever accents
    .replace(/['']/g, '')            // Enlever apostrophes
    .replace(/[^a-z0-9]+/g, ' ')     // Remplacer non-alphanum par espaces
    .trim()
    .replace(/\s+/g, ' ');           // Normaliser espaces
}

/**
 * Extraire les mots-clés significatifs d'un slug
 */
function extractKeywords(slug: string): Set<string> {
  const normalized = normalizeForComparison(slug);
  const words = normalized.split(' ').filter(w => w.length > 2);
  
  // Mots à ignorer (stopwords)
  const stopwords = new Set([
    'avec', 'pour', 'dans', 'une', 'des', 'les', 'est', 'sont', 'cette', 'ces',
    'qui', 'que', 'sur', 'par', 'aux', 'tout', 'tous', 'toutes', 'vous',
    'bijou', 'bijoux', 'fabrication', 'artisanale', 'provenance', 'inde',
    'indien', 'indienne', 'indiens', 'indiennes', 'femme', 'homme',
    'taille', 'longueur', 'hauteur', 'largeur', 'diametre', 'diam',
    'petit', 'petite', 'grand', 'grande', 'beau', 'belle', 'joli', 'jolie',
    'tres', 'bien', 'bon', 'bonne', 'vrai', 'vraie', 'naturel', 'naturelle',
    'prix', 'qualite', 'elegante', 'elegant', 'moderne', 'tendance',
    'authentique', 'typique', 'original', 'originale', 'facile', 'porter'
  ]);
  
  return new Set(words.filter(w => !stopwords.has(w)));
}

/**
 * Calculer le score de similarité entre deux ensembles de mots-clés
 */
function calculateSimilarity(keywords1: Set<string>, keywords2: Set<string>): number {
  if (keywords1.size === 0 || keywords2.size === 0) return 0;
  
  let matches = 0;
  for (const word of keywords1) {
    if (keywords2.has(word)) {
      matches++;
    }
  }
  
  // Jaccard similarity
  const union = new Set([...keywords1, ...keywords2]);
  return matches / union.size;
}

async function main() {
  console.log('🔍 Extraction des prix depuis le legacy clone...\n');
  
  // 1. Charger les produits actuels
  const productsRaw = fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8');
  const products: Product[] = JSON.parse(productsRaw);
  
  console.log(`📦 ${products.length} produits chargés depuis products-ultimate.json`);
  
  // 2. Créer un backup
  fs.writeFileSync(BACKUP_PATH, productsRaw);
  console.log(`💾 Backup créé: ${BACKUP_PATH}\n`);
  
  // 3. Scanner tous les dossiers produits du legacy clone
  if (!fs.existsSync(LEGACY_PRODUIT_DIR)) {
    console.error(`❌ Dossier legacy non trouvé: ${LEGACY_PRODUIT_DIR}`);
    process.exit(1);
  }
  
  const productDirs = fs.readdirSync(LEGACY_PRODUIT_DIR).filter(d => {
    const fullPath = path.join(LEGACY_PRODUIT_DIR, d);
    return fs.statSync(fullPath).isDirectory() && d !== '.DS_Store';
  });
  
  console.log(`📂 ${productDirs.length} dossiers produits trouvés\n`);
  
  // 4. Extraire les prix et créer les index
  const priceBySlug = new Map<string, PriceData>();
  const priceBySku = new Map<string, PriceData>();
  const priceByKeywords = new Map<string, PriceData>();
  
  let extractedCount = 0;
  
  for (const dir of productDirs) {
    const indexPath = path.join(LEGACY_PRODUIT_DIR, dir, 'index.html');
    
    if (!fs.existsSync(indexPath)) continue;
    
    try {
      const htmlContent = fs.readFileSync(indexPath, 'utf-8');
      const priceData = extractPriceFromHTML(htmlContent, dir);
      
      if (priceData && priceData.price > 0) {
        // Index par slug complet
        priceBySlug.set(dir, priceData);
        
        // Index par SKU
        if (priceData.sku) {
          priceBySku.set(priceData.sku.toLowerCase(), priceData);
        }
        
        // Index par premiers mots du slug (pour matching partiel)
        const shortSlug = dir.split('-').slice(0, 8).join('-');
        if (!priceBySlug.has(shortSlug)) {
          priceBySlug.set(shortSlug, priceData);
        }
        
        extractedCount++;
      }
    } catch (e) {
      // Ignorer silencieusement
    }
  }
  
  console.log(`✅ ${extractedCount} prix extraits du legacy clone\n`);
  
  // 5. Matcher et mettre à jour les produits
  let updatedCount = 0;
  let notFoundCount = 0;
  const notFoundProducts: string[] = [];
  const updatedProducts: Array<{name: string, oldPrice: number, newPrice: number}> = [];
  
  for (const product of products) {
    let priceData: PriceData | undefined;
    
    // Méthode 1: Match par SKU
    if (product.sku) {
      const skuClean = String(product.sku).replace(/^UGS\s*:?\s*/i, '').toLowerCase().trim();
      priceData = priceBySku.get(skuClean);
    }
    
    // Méthode 2: Match par source_url
    if (!priceData && product.source_url) {
      const urlMatch = product.source_url.match(/\/produit\/([^\/]+)\/?$/);
      if (urlMatch) {
        const urlSlug = urlMatch[1];
        priceData = priceBySlug.get(urlSlug);
        
        // Essayer avec le début du slug
        if (!priceData) {
          const shortSlug = urlSlug.split('-').slice(0, 8).join('-');
          priceData = priceBySlug.get(shortSlug);
        }
      }
    }
    
    // Méthode 3: Match par slug du produit
    if (!priceData && product.slug) {
      priceData = priceBySlug.get(product.slug);
      
      // Essayer avec le début du slug
      if (!priceData) {
        const shortSlug = product.slug.split('-').slice(0, 8).join('-');
        priceData = priceBySlug.get(shortSlug);
      }
    }
    
    // Méthode 4: Match par similarité de mots-clés
    if (!priceData && product.slug) {
      const productKeywords = extractKeywords(product.slug);
      let bestMatch: { data: PriceData; score: number } | null = null;
      
      for (const [legacySlug, data] of priceBySlug) {
        const legacyKeywords = extractKeywords(legacySlug);
        const score = calculateSimilarity(productKeywords, legacyKeywords);
        
        if (score > 0.5 && (!bestMatch || score > bestMatch.score)) {
          bestMatch = { data, score };
        }
      }
      
      if (bestMatch && bestMatch.score > 0.6) {
        priceData = bestMatch.data;
      }
    }
    
    // Appliquer le prix trouvé
    if (priceData && priceData.price > 0) {
      if (product.price !== priceData.price) {
        updatedProducts.push({
          name: product.name.substring(0, 50),
          oldPrice: product.price,
          newPrice: priceData.price
        });
        product.price = priceData.price;
        updatedCount++;
      }
    } else {
      notFoundCount++;
      if (notFoundProducts.length < 30) {
        notFoundProducts.push(product.slug);
      }
    }
  }
  
  // 6. Sauvegarder les produits mis à jour
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(products, null, 2));
  
  // 7. Afficher le résumé
  console.log('═══════════════════════════════════════════');
  console.log('📊 RÉSUMÉ:');
  console.log(`   ✅ Prix mis à jour: ${updatedCount}`);
  console.log(`   ⚠️  Non trouvés: ${notFoundCount}`);
  console.log(`   📁 Fichier sauvegardé: ${OUTPUT_PATH}`);
  console.log('═══════════════════════════════════════════\n');
  
  if (updatedProducts.length > 0) {
    console.log('📝 Exemples de mises à jour:');
    updatedProducts.slice(0, 15).forEach(p => {
      console.log(`   ${p.name}... : ${p.oldPrice}€ → ${p.newPrice}€`);
    });
    console.log('');
  }
  
  if (notFoundProducts.length > 0) {
    console.log('⚠️  Produits sans prix (premiers 30):');
    notFoundProducts.forEach(slug => console.log(`   - ${slug.substring(0, 60)}...`));
  }
  
  console.log('\n🎉 Extraction terminée!');
}

main().catch(console.error);
