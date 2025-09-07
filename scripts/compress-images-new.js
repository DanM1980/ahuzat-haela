const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImagesNew() {
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  const files = fs.readdirSync(galleryPath).filter(file => 
    file.endsWith('.jpg') && 
    !file.includes('_compressed') && 
    !file.includes('_backup') &&
    !file.includes('_temp')
  );
  
  console.log(`Found ${files.length} images to compress...`);
  
  for (const file of files) {
    const inputPath = path.join(galleryPath, file);
    const outputPath = path.join(galleryPath, file.replace('.jpg', '_compressed.jpg'));
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`Compressing ${file} (${originalSizeMB}MB)...`);
      
      // Compress image to smaller size
      await sharp(inputPath)
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 80,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`  ✓ Compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`);
      console.log(`  ✓ Saved as: ${file.replace('.jpg', '_compressed.jpg')}`);
      
    } catch (error) {
      console.error(`  ✗ Error compressing ${file}:`, error.message);
    }
  }
  
  console.log('\n🎉 Image compression completed!');
  console.log('📁 Compressed images saved with _compressed.jpg suffix');
  console.log('💡 You can now update your code to use the compressed versions');
}

compressImagesNew().catch(console.error);
