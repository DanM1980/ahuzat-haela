const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImagesBalanced() {
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  const files = fs.readdirSync(galleryPath).filter(file => 
    file.endsWith('.jpg') && 
    !file.includes('_compressed') && 
    !file.includes('_backup') &&
    !file.includes('_temp') &&
    !file.includes('_balanced')
  );
  
  console.log(`Found ${files.length} images to compress...`);
  
  for (const file of files) {
    const inputPath = path.join(galleryPath, file);
    const outputPath = path.join(galleryPath, file.replace('.jpg', '_balanced.jpg'));
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`Compressing ${file} (${originalSizeMB}MB)...`);
      
      // Compress image with higher quality for better balance
      await sharp(inputPath)
        .resize(2560, 1440, {  // Higher resolution
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 90,  // Higher quality
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
      const compressedSizeKB = (compressedStats.size / 1024).toFixed(0);
      
      console.log(`  ✓ Compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB (${compressedSizeKB}KB)`);
      console.log(`  ✓ Saved as: ${file.replace('.jpg', '_balanced.jpg')}`);
      
    } catch (error) {
      console.error(`  ✗ Error compressing ${file}:`, error.message);
    }
  }
  
  console.log('\n🎉 Balanced image compression completed!');
  console.log('📁 Compressed images saved with _balanced.jpg suffix');
  console.log('💡 These should be around 500KB-1MB each for better quality');
}

compressImagesBalanced().catch(console.error);
