/**
 * 🎯 SCRIPT BULLET-PROOF : Extraction des Images depuis la Source de Vérité
 * 
 * POURQUOI CE SCRIPT FONCTIONNE (quand les autres ont échoué) :
 * - Ne se fie PAS aux noms de fichiers (DSC05427.jpeg ≠ slug)
 * - Va directement sur LA PAGE PRODUIT (source de vérité)
 * - Extrait UNIQUEMENT l'image principale (pas sidebar/footer)
 * - Valide avec l'attribut ALT (doit matcher le nom du produit)
 * - Télécharge et renomme proprement avec le slug
 * 
 * USAGE:
 *   1. npm install (depuis ce dossier)
 *   2. Copie ton products-ultimate.json dans ce dossier
 *   3. npx tsx extract-images-bulletproof.ts
 *   4. Vérifie les 16 premiers avant de continuer
 * 
 * AUTEUR: Claude Opus 4.5 pour N33K0DR - Projet Khashika v2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Fichier source des produits
  PRODUCTS_JSON: './products-ultimate.json',
  
  // Dossier de sortie pour les images
  OUTPUT_DIR: './extracted-images',
  
  // Dossier de mapping/rapport
  REPORTS_DIR: './reports',
  
  // Base URL du site
  BASE_URL: 'https://www.khashika.com',
  
  // Délai entre chaque requête (ms) - respecter le rate limiting
  DELAY_MS: 1500,
  
  // Nombre max de produits à traiter (pour test)
  // Mets -1 pour traiter TOUS les produits
  MAX_PRODUCTS: 16, // Commence par 16 pour valider
  
  // Timeout pour les requêtes HTTP (ms)
  TIMEOUT_MS: 30000,
  
  // Nombre de retries en cas d'échec
  MAX_RETRIES: 3,
};

// ============================================
// TYPES
// ============================================
interface Product {
  id?: string;
  name: string;
  slug: string;
  price?: number;
  category?: string;
  images?: string[];
  image?: string;
  image_url?: string;
  original_url?: string;
}

interface ExtractionResult {
  slug: string;
  productName: string;
  success: boolean;
  imageUrl?: string;
  localPath?: string;
  altText?: string;
  altMatchesName?: boolean;
  error?: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'FAILED';
}

interface Report {
  timestamp: string;
  totalProducts: number;
  processed: number;
  successful: number;
  failed: number;
  highConfidence: number;
  mediumConfidence: number;
  lowConfidence: number;
  results: ExtractionResult[];
}

// ============================================
// UTILITAIRES
// ============================================
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Normalise le texte pour comparaison
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9\s]/g, ' ')    // Garde seulement alphanum
    .replace(/\s+/g, ' ')             // Normalise les espaces
    .trim();
}

// Calcule la similarité entre deux textes (0-1)
function textSimilarity(text1: string, text2: string): number {
  const norm1 = normalizeText(text1);
  const norm2 = normalizeText(text2);
  
  if (norm1 === norm2) return 1;
  
  const words1 = new Set(norm1.split(' ').filter(w => w.length > 2));
  const words2 = new Set(norm2.split(' ').filter(w => w.length > 2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = [...words1].filter(w => words2.has(w));
  const union = new Set([...words1, ...words2]);
  
  return intersection.length / union.size;
}

// Détermine le niveau de confiance
function getConfidence(similarity: number, hasImage: boolean): 'HIGH' | 'MEDIUM' | 'LOW' | 'FAILED' {
  if (!hasImage) return 'FAILED';
  if (similarity >= 0.7) return 'HIGH';
  if (similarity >= 0.4) return 'MEDIUM';
  return 'LOW';
}

// ============================================
// HTTP CLIENT
// ============================================
async function fetchPage(url: string, retries = CONFIG.MAX_RETRIES): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const request = protocol.get(url, {
      timeout: CONFIG.TIMEOUT_MS,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          fetchPage(redirectUrl, retries).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        if (retries > 0) {
          setTimeout(() => {
            fetchPage(url, retries - 1).then(resolve).catch(reject);
          }, 2000);
          return;
        }
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      let data = '';
      response.setEncoding('utf8');
      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    });
    
    request.on('error', (err) => {
      if (retries > 0) {
        setTimeout(() => {
          fetchPage(url, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(err);
      }
    });
    
    request.on('timeout', () => {
      request.destroy();
      if (retries > 0) {
        setTimeout(() => {
          fetchPage(url, retries - 1).then(resolve).catch(reject);
        }, 2000);
      } else {
        reject(new Error('Timeout'));
      }
    });
  });
}

async function downloadImage(url: string, destPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    
    const file = fs.createWriteStream(destPath);
    
    protocol.get(url, {
      timeout: CONFIG.TIMEOUT_MS,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      }
    }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, destPath).then(resolve).catch(reject);
          return;
        }
      }
      
      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) {
        fs.unlinkSync(destPath);
      }
      reject(err);
    });
  });
}

// ============================================
// EXTRACTEUR D'IMAGES WOOCOMMERCE
// ============================================

/**
 * Extrait l'image principale d'une page produit WooCommerce
 * 
 * Stratégie d'extraction (par ordre de priorité) :
 * 1. Image dans la galerie WooCommerce (div.woocommerce-product-gallery)
 * 2. Image avec class="wp-post-image"
 * 3. Image dans figure.woocommerce-product-gallery__wrapper
 * 4. Première image dans div.product avec src contenant "uploads"
 */
function extractMainImage(html: string, productName: string): { imageUrl: string | null; altText: string | null } {
  // Patterns pour trouver l'image principale (du plus spécifique au moins spécifique)
  const patterns = [
    // Pattern 1: Image dans data-large_image (galerie WooCommerce)
    /data-large_image="([^"]+wp-content\/uploads\/[^"]+)"/gi,
    
    // Pattern 2: Image href dans galerie
    /<a[^>]+href="([^"]+wp-content\/uploads\/[^"]+)"[^>]*class="[^"]*woocommerce-product-gallery__image/gi,
    
    // Pattern 3: Image principale WooCommerce
    /<img[^>]+class="[^"]*wp-post-image[^"]*"[^>]+src="([^"]+wp-content\/uploads\/[^"]+)"/gi,
    
    // Pattern 4: Image dans figure de galerie
    /<figure[^>]+class="[^"]*woocommerce-product-gallery__wrapper[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+wp-content\/uploads\/[^"]+)"/gi,
    
    // Pattern 5: data-src pour lazy loading
    /<img[^>]+data-src="([^"]+wp-content\/uploads\/[^"]+)"/gi,
    
    // Pattern 6: srcset avec la plus grande image
    /srcset="[^"]*([^"\s,]+wp-content\/uploads\/[^"\s,]+-\d{3,4}x\d{3,4}\.[a-z]+)/gi,
  ];
  
  let bestImageUrl: string | null = null;
  let altText: string | null = null;
  
  // Essaie chaque pattern
  for (const pattern of patterns) {
    const matches = html.matchAll(pattern);
    for (const match of matches) {
      const url = match[1];
      if (url && url.includes('wp-content/uploads') && !url.includes('placeholder')) {
        // Nettoie l'URL (prend la version sans dimensions si possible)
        let cleanUrl = url;
        
        // Si c'est une URL avec dimensions, essaie de trouver l'original
        const dimensionMatch = url.match(/^(.+)-\d+x\d+(\.[a-z]+)$/i);
        if (dimensionMatch) {
          // On garde l'URL avec dimensions car l'original peut ne pas exister
          cleanUrl = url;
        }
        
        bestImageUrl = cleanUrl;
        break;
      }
    }
    if (bestImageUrl) break;
  }
  
  // Extrait le texte alt de l'image principale
  if (bestImageUrl) {
    // Cherche la balise img qui contient cette URL
    const imgPattern = new RegExp(
      `<img[^>]+(?:src|data-src|data-large_image)="${bestImageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*alt="([^"]*)"`,
      'i'
    );
    const altMatch = html.match(imgPattern);
    if (altMatch) {
      altText = altMatch[1];
    } else {
      // Cherche l'alt dans le contexte proche
      const altPattern = /alt="([^"]+)"/gi;
      const contextStart = html.indexOf(bestImageUrl) - 500;
      const context = html.substring(Math.max(0, contextStart), contextStart + 1000);
      const contextAltMatch = context.match(altPattern);
      if (contextAltMatch) {
        altText = contextAltMatch[0].replace(/alt="|"/g, '');
      }
    }
  }
  
  return { imageUrl: bestImageUrl, altText };
}

// ============================================
// PROCESSEUR PRINCIPAL
// ============================================

async function processProduct(product: Product): Promise<ExtractionResult> {
  const result: ExtractionResult = {
    slug: product.slug,
    productName: product.name,
    success: false,
    confidence: 'FAILED',
  };
  
  try {
    // Construit l'URL de la page produit
    const productUrl = `${CONFIG.BASE_URL}/produit/${product.slug}/`;
    
    console.log(`  📄 Fetch: ${productUrl}`);
    
    // Récupère la page
    const html = await fetchPage(productUrl);
    
    if (!html || html.length < 1000) {
      result.error = 'Page vide ou trop courte';
      return result;
    }
    
    // Extrait l'image principale
    const { imageUrl, altText } = extractMainImage(html, product.name);
    
    if (!imageUrl) {
      result.error = 'Aucune image trouvée sur la page';
      return result;
    }
    
    result.imageUrl = imageUrl;
    result.altText = altText || 'N/A';
    
    // Calcule la similarité entre le nom du produit et le texte alt
    const similarity = altText ? textSimilarity(product.name, altText) : 0;
    result.altMatchesName = similarity > 0.4;
    result.confidence = getConfidence(similarity, true);
    
    // Détermine l'extension du fichier
    const ext = path.extname(imageUrl).toLowerCase() || '.jpg';
    const localFileName = `${product.slug}${ext}`;
    const localPath = path.join(CONFIG.OUTPUT_DIR, localFileName);
    
    // Télécharge l'image
    console.log(`  💾 Download: ${localFileName}`);
    await downloadImage(imageUrl, localPath);
    
    result.localPath = localPath;
    result.success = true;
    
    return result;
    
  } catch (error: any) {
    result.error = error.message || 'Erreur inconnue';
    return result;
  }
}

// ============================================
// MAIN
// ============================================

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🎯 EXTRACTION BULLET-PROOF DES IMAGES KHASHIKA');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Vérifie que le fichier JSON existe
  if (!fs.existsSync(CONFIG.PRODUCTS_JSON)) {
    console.error(`❌ Fichier non trouvé: ${CONFIG.PRODUCTS_JSON}`);
    console.log('\n📝 Instructions:');
    console.log('1. Copie ton fichier products-ultimate.json dans ce dossier');
    console.log('2. Relance le script\n');
    process.exit(1);
  }
  
  // Crée les dossiers de sortie
  if (!fs.existsSync(CONFIG.OUTPUT_DIR)) {
    fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(CONFIG.REPORTS_DIR)) {
    fs.mkdirSync(CONFIG.REPORTS_DIR, { recursive: true });
  }
  
  // Charge les produits
  const productsRaw = fs.readFileSync(CONFIG.PRODUCTS_JSON, 'utf-8');
  const products: Product[] = JSON.parse(productsRaw);
  
  console.log(`📦 Produits chargés: ${products.length}`);
  console.log(`🎯 Produits à traiter: ${CONFIG.MAX_PRODUCTS === -1 ? 'TOUS' : CONFIG.MAX_PRODUCTS}`);
  console.log(`⏱️  Délai entre requêtes: ${CONFIG.DELAY_MS}ms`);
  console.log('');
  
  // Filtre les produits avec un slug valide
  const validProducts = products.filter(p => p.slug && p.slug.length > 0);
  
  // Limite le nombre de produits si nécessaire
  const toProcess = CONFIG.MAX_PRODUCTS === -1 
    ? validProducts 
    : validProducts.slice(0, CONFIG.MAX_PRODUCTS);
  
  console.log(`✅ Produits valides à traiter: ${toProcess.length}\n`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Traite chaque produit
  const results: ExtractionResult[] = [];
  let successCount = 0;
  let highConfidenceCount = 0;
  let mediumConfidenceCount = 0;
  let lowConfidenceCount = 0;
  
  for (let i = 0; i < toProcess.length; i++) {
    const product = toProcess[i];
    console.log(`[${i + 1}/${toProcess.length}] 🔍 ${product.name}`);
    
    const result = await processProduct(product);
    results.push(result);
    
    if (result.success) {
      successCount++;
      if (result.confidence === 'HIGH') highConfidenceCount++;
      if (result.confidence === 'MEDIUM') mediumConfidenceCount++;
      if (result.confidence === 'LOW') lowConfidenceCount++;
      console.log(`  ✅ ${result.confidence} confidence | ALT: "${result.altText?.substring(0, 50)}..."`);
    } else {
      console.log(`  ❌ Échec: ${result.error}`);
    }
    
    console.log('');
    
    // Délai avant la prochaine requête
    if (i < toProcess.length - 1) {
      await sleep(CONFIG.DELAY_MS);
    }
  }
  
  // Génère le rapport
  const report: Report = {
    timestamp: new Date().toISOString(),
    totalProducts: products.length,
    processed: toProcess.length,
    successful: successCount,
    failed: toProcess.length - successCount,
    highConfidence: highConfidenceCount,
    mediumConfidence: mediumConfidenceCount,
    lowConfidence: lowConfidenceCount,
    results,
  };
  
  // Sauvegarde le rapport
  const reportPath = path.join(CONFIG.REPORTS_DIR, `extraction-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  // Affiche le résumé
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📊 RÉSUMÉ DE L\'EXTRACTION');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log(`  Total traité:     ${report.processed}`);
  console.log(`  ✅ Succès:        ${report.successful} (${Math.round(report.successful/report.processed*100)}%)`);
  console.log(`  ❌ Échecs:        ${report.failed}`);
  console.log('');
  console.log('  📈 Confiance:');
  console.log(`     🟢 HIGH:       ${report.highConfidence}`);
  console.log(`     🟡 MEDIUM:     ${report.mediumConfidence}`);
  console.log(`     🔴 LOW:        ${report.lowConfidence}`);
  console.log('');
  console.log(`  📁 Images sauvées: ${CONFIG.OUTPUT_DIR}/`);
  console.log(`  📋 Rapport:        ${reportPath}`);
  console.log('');
  
  // Conseils selon les résultats
  if (report.highConfidence >= report.processed * 0.8) {
    console.log('🎉 EXCELLENT ! Plus de 80% de confiance HIGH.');
    console.log('   Tu peux passer à l\'échelle complète (MAX_PRODUCTS = -1)');
  } else if (report.successful >= report.processed * 0.7) {
    console.log('✅ BON RÉSULTAT. Plus de 70% de succès.');
    console.log('   Vérifie manuellement quelques images avant de continuer.');
  } else {
    console.log('⚠️  ATTENTION. Moins de 70% de succès.');
    console.log('   Vérifie le rapport pour identifier les problèmes.');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📝 PROCHAINES ÉTAPES');
  console.log('═══════════════════════════════════════════════════════════════\n');
  console.log('1. Vérifie visuellement les images dans extracted-images/');
  console.log('2. Compare avec le site khashika.com pour 5-10 produits');
  console.log('3. Si OK, modifie MAX_PRODUCTS = -1 pour traiter tout');
  console.log('4. Lance update-json.ts pour mettre à jour products-ultimate.json');
  console.log('5. Lance sync-supabase.ts pour synchroniser avec la base\n');
}

main().catch(console.error);
