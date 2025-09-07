const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Gallery images directory
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

// Get all image files from gallery directory
const imageFiles = fs.readdirSync(galleryDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) && !file.includes('_backup');
});

console.log(`Found ${imageFiles.length} images to compress...`);

// Process each image
async function compressImages() {
  for (const file of imageFiles) {
    const inputPath = path.join(galleryDir, file);
    const tempPath = path.join(galleryDir, file.replace('.jpg', '_temp.jpg'));
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`Compressing ${file} (${originalSizeMB}MB)...`);
      
      // Compress image - resize to max 1920x1080 and reduce quality
      await sharp(inputPath)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .jpeg({ 
          quality: 75,
          progressive: true,
          mozjpeg: true
        })
        .toFile(tempPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(tempPath);
      const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`  ✓ Compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`);
      
      // Replace original with compressed version
      fs.unlinkSync(inputPath);
      fs.renameSync(tempPath, inputPath);
      
      console.log(`✅ Successfully compressed ${file}`);
    } catch (error) {
      console.error(`❌ Error compressing ${file}:`, error.message);
      
      // Clean up temp file if it exists
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }
  
  console.log('\n🎉 Image compression completed!');
  console.log(`📁 Compressed images saved to: ${galleryDir}`);
}

compressImages().catch(console.error);

