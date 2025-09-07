const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImages() {
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  const files = fs.readdirSync(galleryPath).filter(file => file.endsWith('.jpg'));
  
  console.log(`Found ${files.length} images to compress...`);
  
  for (const file of files) {
    const inputPath = path.join(galleryPath, file);
    const outputPath = path.join(galleryPath, file.replace('.jpg', '_compressed.jpg'));
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`Compressing ${file} (${originalSizeMB}MB)...`);
      
      // Compress image to ~1MB
      await sharp(inputPath)
        .jpeg({ 
          quality: 85,
          progressive: true,
          mozjpeg: true
        })
        .toFile(outputPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(outputPath);
      const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`✓ ${file}: ${originalSizeMB}MB → ${compressedSizeMB}MB`);
      
      // Replace original with compressed version
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath, inputPath);
      
    } catch (error) {
      console.error(`Error compressing ${file}:`, error.message);
    }
  }
  
  console.log('Image compression completed!');
}

compressImages().catch(console.error);

