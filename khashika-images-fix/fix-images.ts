/**
 * Script pour corriger les URLs d'images des produits Khashika
 * 
 * Ce script va :
 * 1. Récupérer tous les produits de Supabase
 * 2. Pour chaque produit, scraper sa page sur khashika.com
 * 3. Extraire les vraies URLs d'images
 * 4. Mettre à jour la base de données
 * 
 * Usage: npx tsx fix-images.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'

// Configuration Supabase (à remplacer avec tes vraies clés)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_KEY'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

// Délai entre chaque requête pour ne pas surcharger le serveur
const DELAY_MS = 1000

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

interface Product {
  id: string
  name: string
  slug: string
  original_url?: string
  images?: string[]
}

/**
 * Scraper les images d'une page produit Khashika
 */
async function scrapeProductImages(productUrl: string): Promise<string[]> {
  try {
    console.log(`🔍 Scraping: ${productUrl}`)
    
    const response = await fetch(productUrl)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const html = await response.text()
    const $ = cheerio.load(html)
    
    const images: string[] = []
    
    // Chercher les images dans la galerie produit
    // WordPress utilise généralement ces sélecteurs :
    $('.woocommerce-product-gallery__image img').each((_, el) => {
      const src = $(el).attr('src') || $(el).attr('data-src')
      if (src && src.includes('khashika.com/wp-content/uploads/')) {
        // Récupérer l'URL pleine résolution si disponible
        const fullSrc = $(el).attr('data-large_image') || src
        images.push(fullSrc)
      }
    })
    
    // Fallback : chercher toutes les images du contenu
    if (images.length === 0) {
      $('.product img, .woocommerce-product-gallery img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src')
        if (src && src.includes('khashika.com/wp-content/uploads/')) {
          images.push(src)
        }
      })
    }
    
    // Fallback 2 : chercher dans les srcset
    if (images.length === 0) {
      $('img[srcset]').each((_, el) => {
        const srcset = $(el).attr('srcset')
        if (srcset && srcset.includes('khashika.com/wp-content/uploads/')) {
          // Extraire la plus grande image du srcset
          const urls = srcset.split(',').map(s => s.trim().split(' ')[0])
          images.push(...urls.filter(url => url.includes('khashika.com')))
        }
      })
    }
    
    // Nettoyer et dédupliquer
    const uniqueImages = [...new Set(images)]
      .map(url => url.trim())
      .filter(url => url.startsWith('http'))
    
    console.log(`✅ Trouvé ${uniqueImages.length} image(s)`)
    return uniqueImages
    
  } catch (error) {
    console.error(`❌ Erreur scraping ${productUrl}:`, error)
    return []
  }
}

/**
 * Construire l'URL du produit sur l'ancien site
 */
function buildOriginalUrl(product: Product): string {
  // Si l'URL originale est déjà stockée, l'utiliser
  if (product.original_url) {
    return product.original_url
  }
  
  // Sinon, construire l'URL à partir du slug
  return `https://www.khashika.com/produit/${product.slug}/`
}

/**
 * Mettre à jour les images d'un produit dans Supabase
 */
async function updateProductImages(productId: string, images: string[]) {
  if (images.length === 0) {
    console.log(`⚠️  Aucune image à mettre à jour pour ${productId}`)
    return false
  }
  
  try {
    const { error } = await supabase
      .from('products')
      .update({ images })
      .eq('id', productId)
    
    if (error) throw error
    
    console.log(`✅ Mis à jour ${images.length} image(s) pour produit ${productId}`)
    return true
    
  } catch (error) {
    console.error(`❌ Erreur mise à jour produit ${productId}:`, error)
    return false
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage du script de correction des images...\n')
  
  try {
    // 1. Récupérer tous les produits
    console.log('📦 Récupération des produits depuis Supabase...')
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, slug, original_url, images')
      .or('images.is.null,images.eq.{"/placeholder-image.svg"}')
    
    if (error) throw error
    
    if (!products || products.length === 0) {
      console.log('✅ Tous les produits ont déjà leurs images !')
      return
    }
    
    console.log(`📊 ${products.length} produits à traiter\n`)
    
    // 2. Traiter chaque produit
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i] as Product
      console.log(`\n[${i + 1}/${products.length}] ${product.name}`)
      
      // Construire l'URL originale
      const originalUrl = buildOriginalUrl(product)
      
      // Scraper les images
      const images = await scrapeProductImages(originalUrl)
      
      // Mettre à jour la base de données
      if (images.length > 0) {
        const success = await updateProductImages(product.id, images)
        if (success) successCount++
        else errorCount++
      } else {
        errorCount++
      }
      
      // Attendre avant la prochaine requête
      if (i < products.length - 1) {
        await sleep(DELAY_MS)
      }
    }
    
    // 3. Résumé
    console.log('\n' + '='.repeat(50))
    console.log('📊 RÉSUMÉ')
    console.log('='.repeat(50))
    console.log(`✅ Succès: ${successCount}`)
    console.log(`❌ Erreurs: ${errorCount}`)
    console.log(`📦 Total: ${products.length}`)
    console.log('='.repeat(50))
    
  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Vérification des variables d'environnement
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nCrée un fichier .env.local avec ces variables.')
  process.exit(1)
}

// Lancer le script
main()
