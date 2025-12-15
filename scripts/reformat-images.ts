/**
 * Script de reformatage des images produits
 * Convertit toutes les images en 1178x785 (ratio 3:2)
 * 
 * Usage:
 *   1. npm install sharp
 *   2. npx tsx scripts/reformat-images.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Configuration
const CONFIG = {
  targetWidth: 1178,
  targetHeight: 785,
  quality: 90,
  inputDir: './public/images/products',
  backupDir: './public/images/products_backup_original',
  supportedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
};

async function main() {
  // Import sharp dynamically
  const sharp = (await import('sharp')).default;
  
  const inputDir = path.resolve(CONFIG.inputDir);
  const backupDir = path.resolve(CONFIG.backupDir);

  console.log('🎨 Khashika Image Reformatter');
  console.log('=============================');
  console.log(`📐 Target size: ${CONFIG.targetWidth}x${CONFIG.targetHeight} (ratio 3:2)`);
  console.log(`📁 Input directory: ${inputDir}`);
  console.log(`💾 Backup directory: ${backupDir}`);
  console.log('');

  // 1. Create backup directory
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log('✅ Backup directory created');
  }

  // 2. Get all image files
  const files = fs.readdirSync(inputDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return CONFIG.supportedExtensions.includes(ext);
  });

  console.log(`📷 Found ${files.length} images to process`);
  console.log('');

  // 3. Process each image
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const backupPath = path.join(backupDir, file);
    
    try {
      // Backup original if not already backed up
      if (!fs.existsSync(backupPath)) {
        fs.copyFileSync(inputPath, backupPath);
      }

      // Get image metadata
      const metadata = await sharp(inputPath).metadata();
      const originalWidth = metadata.width || 0;
      const originalHeight = metadata.height || 0;
      const originalRatio = originalWidth / originalHeight;
      const targetRatio = CONFIG.targetWidth / CONFIG.targetHeight;

      // Calculate crop dimensions to maintain center focus
      let cropWidth: number, cropHeight: number, cropLeft: number, cropTop: number;

      if (originalRatio > targetRatio) {
        // Image is wider than target ratio - crop sides
        cropHeight = originalHeight;
        cropWidth = Math.round(originalHeight * targetRatio);
        cropLeft = Math.round((originalWidth - cropWidth) / 2);
        cropTop = 0;
      } else {
        // Image is taller than target ratio - crop top/bottom
        cropWidth = originalWidth;
        cropHeight = Math.round(originalWidth / targetRatio);
        cropLeft = 0;
        cropTop = Math.round((originalHeight - cropHeight) / 2);
      }

      // Process image: extract center region, then resize
      const outputBuffer = await sharp(inputPath)
        .extract({
          left: cropLeft,
          top: cropTop,
          width: cropWidth,
          height: cropHeight,
        })
        .resize(CONFIG.targetWidth, CONFIG.targetHeight, {
          fit: 'fill',
          withoutEnlargement: false,
        })
        .jpeg({ quality: CONFIG.quality })
        .toBuffer();

      // Write processed image
      fs.writeFileSync(inputPath, outputBuffer);
      
      processed++;
      
      // Progress indicator
      if (processed % 50 === 0) {
        console.log(`⏳ Processed ${processed}/${files.length} images...`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error);
      errors++;
    }
  }

  console.log('');
  console.log('=============================');
  console.log('📊 Summary:');
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('');
  console.log('🎉 Done! All images are now 1178x785 (3:2 ratio)');
  console.log('💡 Original images backed up in:', backupDir);
}

main().catch(console.error);
