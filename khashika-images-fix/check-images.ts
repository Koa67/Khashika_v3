/**
 * Script de diagnostic des images
 * 
 * Usage: npx tsx check-images.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function diagnose() {
  console.log('🔍 DIAGNOSTIC DES IMAGES KHASHIKA')
  console.log('='.repeat(60) + '\n')

  try {
    // 1. Compter les produits total
    const { count: totalProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })

    if (countError) throw countError
    console.log(`📦 Total produits: ${totalProducts}`)

    // 2. Compter les produits avec placeholder
    const { count: withPlaceholder, error: placeholderError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .contains('images', ['/placeholder-image.svg'])

    if (placeholderError) throw placeholderError
    console.log(`🖼️  Produits avec placeholder: ${withPlaceholder}`)

    // 3. Compter les produits sans images
    const { count: withoutImages, error: nullError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .or('images.is.null,images.eq.{}')

    if (nullError) throw nullError
    console.log(`❌ Produits sans images: ${withoutImages}`)

    // 4. Exemples de produits problématiques
    console.log('\n📋 EXEMPLES DE PRODUITS PROBLÉMATIQUES:\n')
    
    const { data: samples, error: samplesError } = await supabase
      .from('products')
      .select('id, name, slug, images, original_url')
      .or('images.is.null,images.cs.{"/placeholder-image.svg"}')
      .limit(5)

    if (samplesError) throw samplesError

    if (samples && samples.length > 0) {
      samples.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`)
        console.log(`   Slug: ${product.slug}`)
        console.log(`   Images: ${JSON.stringify(product.images)}`)
        console.log(`   URL originale: ${product.original_url || 'N/A'}`)
        console.log()
      })
    }

    // 5. Statistiques par type d'image
    const { data: allProducts, error: allError } = await supabase
      .from('products')
      .select('images')

    if (allError) throw allError

    let hasRealImages = 0
    let hasPlaceholder = 0
    let hasNull = 0
    let hasEmpty = 0

    allProducts?.forEach(p => {
      if (!p.images || p.images.length === 0) {
        hasNull++
      } else if (JSON.stringify(p.images).includes('placeholder')) {
        hasPlaceholder++
      } else if (JSON.stringify(p.images).includes('khashika.com')) {
        hasRealImages++
      } else {
        hasEmpty++
      }
    })

    console.log('\n📊 RÉPARTITION:')
    console.log(`   ✅ Vraies images (khashika.com): ${hasRealImages}`)
    console.log(`   🖼️  Placeholder: ${hasPlaceholder}`)
    console.log(`   ❌ Null/Vide: ${hasNull}`)
    console.log(`   ❓ Autre: ${hasEmpty}`)

    // 6. Recommandation
    const problematicCount = hasPlaceholder + hasNull + hasEmpty
    console.log('\n' + '='.repeat(60))
    console.log('💡 RECOMMANDATION:')
    console.log('='.repeat(60))
    
    if (problematicCount === 0) {
      console.log('✅ Toutes les images sont OK ! Rien à faire.')
    } else {
      console.log(`⚠️  ${problematicCount} produits nécessitent une correction.`)
      console.log('\nPour corriger, lance:')
      console.log('   npx tsx fix-images.ts --test  (pour tester sur 5 produits)')
      console.log('   npx tsx fix-images.ts          (pour corriger tout)')
    }

    // 7. Vérifier la structure de la table
    console.log('\n📐 STRUCTURE DE LA TABLE:')
    const { data: tableInfo, error: structError } = await supabase
      .from('products')
      .select('*')
      .limit(1)

    if (structError) throw structError
    
    if (tableInfo && tableInfo.length > 0) {
      console.log('   Colonnes disponibles:', Object.keys(tableInfo[0]).join(', '))
    }

  } catch (error) {
    console.error('\n❌ Erreur:', error)
    console.error('\nVérifie que:')
    console.error('1. Le fichier .env.local contient les bonnes clés Supabase')
    console.error('2. La table "products" existe bien')
    console.error('3. La SERVICE_ROLE_KEY a les bonnes permissions')
  }
}

// Vérification des variables d'environnement
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('Crée un fichier .env.local avec:')
  console.error('   NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('   SUPABASE_SERVICE_ROLE_KEY=...')
  process.exit(1)
}

diagnose()
