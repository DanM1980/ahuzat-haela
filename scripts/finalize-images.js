const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function finalizeImages() {
  const sourcePath = path.join(__dirname, '../build/pics/gallery');
  const targetPath = path.join(__dirname, '../public/images/gallery');
  
  // Get all image files from build directory
  const files = fs.readdirSync(sourcePath).filter(file => 
    file.endsWith('.jpg') && !file.includes('_backup')
  );
  
  console.log(`Found ${files.length} images to process...`);
  
  for (const file of files) {
    const inputPath = path.join(sourcePath, file);
    const outputPath = path.join(targetPath, file);
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`Processing ${file} (${originalSizeMB}MB)...`);
      
      // Compress image with balanced quality
      await sharp(inputPath)
        .resize(2560, 1440, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ 
          quality: 90,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
      const compressedSizeKB = (compressedStats.size / 1024).toFixed(0);
      
      console.log(`  ✓ Compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB (${compressedSizeKB}KB)`);
      
    } catch (error) {
      console.error(`  ✗ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\n🎉 Image processing completed!');
  console.log('📁 All images are now optimized and ready to use');
}

finalizeImages().catch(console.error);
