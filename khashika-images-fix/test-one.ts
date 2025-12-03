/**
 * Script de test rapide sur UN seul produit
 * Pour vérifier que le scraping fonctionne avant de lancer sur tous les produits
 * 
 * Usage: npx tsx test-one.ts "nom-du-produit-slug"
 */

import { createClient } from '@supabase/supabase-js'
import * as cheerio from 'cheerio'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function scrapeProductImages(productUrl: string): Promise<string[]> {
  console.log(`🔍 Scraping: ${productUrl}\n`)
  
  const response = await fetch(productUrl)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  
  const html = await response.text()
  const $ = cheerio.load(html)
  
  const images: string[] = []
  
  // Méthode 1: Galerie WooCommerce
  console.log('📸 Méthode 1: Galerie WooCommerce')
  $('.woocommerce-product-gallery__image img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-large_image')
    console.log(`   Trouvé: ${src}`)
    if (src && src.includes('khashika.com/wp-content/uploads/')) {
      images.push(src)
    }
  })
  
  // Méthode 2: Toutes les images produit
  if (images.length === 0) {
    console.log('\n📸 Méthode 2: Toutes les images produit')
    $('.product img, .woocommerce img').each((_, el) => {
      const src = $(el).attr('src')
      console.log(`   Trouvé: ${src}`)
      if (src && src.includes('khashika.com/wp-content/uploads/')) {
        images.push(src)
      }
    })
  }
  
  // Méthode 3: Srcset
  if (images.length === 0) {
    console.log('\n📸 Méthode 3: Srcset')
    $('img[srcset]').each((_, el) => {
      const srcset = $(el).attr('srcset')
      if (srcset && srcset.includes('khashika.com/wp-content/uploads/')) {
        console.log(`   Trouvé srcset: ${srcset.substring(0, 100)}...`)
        const urls = srcset.split(',').map(s => s.trim().split(' ')[0])
        images.push(...urls.filter(url => url.includes('khashika.com')))
      }
    })
  }
  
  const uniqueImages = [...new Set(images)]
    .map(url => url.trim())
    .filter(url => url.startsWith('http'))
  
  return uniqueImages
}

async function testOne(slugOrUrl: string) {
  console.log('🧪 TEST SUR UN PRODUIT')
  console.log('='.repeat(60) + '\n')

  try {
    let productUrl: string
    let productId: string | null = null
    let productName: string | null = null

    // Si c'est déjà une URL complète
    if (slugOrUrl.startsWith('http')) {
      productUrl = slugOrUrl
    } else {
      // Chercher le produit dans la base
      const { data: product, error } = await supabase
        .from('products')
        .select('id, name, slug, original_url, images')
        .or(`slug.eq.${slugOrUrl},id.eq.${slugOrUrl}`)
        .single()

      if (error) {
        console.error('❌ Produit non trouvé dans la base:', error.message)
        console.log('\n💡 Tu peux aussi tester directement avec une URL:')
        console.log('   npx tsx test-one.ts "https://www.khashika.com/produit/ton-produit/"')
        return
      }

      productId = product.id
      productName = product.name
      productUrl = product.original_url || `https://www.khashika.com/produit/${product.slug}/`

      console.log(`📦 Produit trouvé: ${productName}`)
      console.log(`🔗 URL: ${productUrl}`)
      console.log(`🖼️  Images actuelles: ${JSON.stringify(product.images)}\n`)
    }

    // Scraper les images
    console.log('='.repeat(60))
    const images = await scrapeProductImages(productUrl)
    console.log('='.repeat(60) + '\n')

    if (images.length === 0) {
      console.log('❌ Aucune image trouvée!')
      console.log('\n💡 Suggestions:')
      console.log('   1. Vérifie que l\'URL est correcte')
      console.log('   2. Va sur la page manuellement et inspecte le HTML')
      console.log('   3. Adapte les sélecteurs CSS dans le script')
      return
    }

    console.log(`✅ ${images.length} image(s) trouvée(s):\n`)
    images.forEach((img, i) => {
      console.log(`   ${i + 1}. ${img}`)
    })

    // Si on a l'ID du produit, proposer de mettre à jour
    if (productId) {
      console.log('\n' + '='.repeat(60))
      console.log('💾 Voudrais-tu mettre à jour ce produit maintenant? (y/n)')
      console.log('='.repeat(60))
      
      // Pour l'instant, on affiche juste ce qui serait fait
      console.log('\n📝 Commande de mise à jour:')
      console.log(`
await supabase
  .from('products')
  .update({ images: ${JSON.stringify(images, null, 2)} })
  .eq('id', '${productId}')
      `)
    }

    console.log('\n✅ Test terminé! Si ça marche bien, lance:')
    console.log('   npx tsx fix-images.ts')

  } catch (error) {
    console.error('\n❌ Erreur:', error)
  }
}

// Vérification
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const arg = process.argv[2]
if (!arg) {
  console.error('❌ Usage: npx tsx test-one.ts "slug-du-produit"')
  console.error('   ou:    npx tsx test-one.ts "https://www.khashika.com/produit/..."')
  process.exit(1)
}

testOne(arg)
