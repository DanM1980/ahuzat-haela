const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressImagesSafe() {
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  const files = fs.readdirSync(galleryPath).filter(file => file.endsWith('.jpg') && !file.includes('_compressed'));
  
  console.log(`Found ${files.length} images to compress...`);
  
  for (const file of files) {
    const inputPath = path.join(galleryPath, file);
    const tempPath = path.join(galleryPath, file.replace('.jpg', '_temp.jpg'));
    const backupPath = path.join(galleryPath, file.replace('.jpg', '_backup.jpg'));
    
    try {
      // Get original file size
      const originalStats = fs.statSync(inputPath);
      const originalSizeMB = (originalStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`Compressing ${file} (${originalSizeMB}MB)...`);
      
      // Create backup first
      fs.copyFileSync(inputPath, backupPath);
      console.log(`  ✓ Backup created: ${file.replace('.jpg', '_backup.jpg')}`);
      
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
        .toFile(tempPath);
      
      // Get compressed file size
      const compressedStats = fs.statSync(tempPath);
      const compressedSizeMB = (compressedStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`  ✓ Compressed: ${originalSizeMB}MB → ${compressedSizeMB}MB`);
      
      // Only replace if compression was successful and file is smaller
      if (compressedStats.size < originalStats.size) {
        // Replace original with compressed version
        fs.unlinkSync(inputPath);
        fs.renameSync(tempPath, inputPath);
        console.log(`  ✓ Replaced original with compressed version`);
        
        // Keep backup for now
        console.log(`  ✓ Backup kept: ${file.replace('.jpg', '_backup.jpg')}`);
      } else {
        // Compression didn't help, keep original
        fs.unlinkSync(tempPath);
        console.log(`  ⚠ Compression didn't reduce size, keeping original`);
      }
      
    } catch (error) {
      console.error(`  ✗ Error compressing ${file}:`, error.message);
      
      // Clean up temp files
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }
  
  console.log('\nImage compression completed!');
  console.log('Backup files are kept with _backup.jpg suffix');
}

compressImagesSafe().catch(console.error);

