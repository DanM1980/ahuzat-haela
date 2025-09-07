const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Create thumbnails directory if it doesn't exist
const thumbnailsDir = path.join(__dirname, '..', 'public', 'images', 'gallery', 'thumbnails');
if (!fs.existsSync(thumbnailsDir)) {
  fs.mkdirSync(thumbnailsDir, { recursive: true });
}

// Gallery images directory
const galleryDir = path.join(__dirname, '..', 'public', 'images', 'gallery');

// Get all image files from gallery directory
const imageFiles = fs.readdirSync(galleryDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
});

console.log(`Found ${imageFiles.length} images to process...`);

// Process each image
async function generateThumbnails() {
  for (const file of imageFiles) {
    const inputPath = path.join(galleryDir, file);
    const outputPath = path.join(thumbnailsDir, file);
    
    try {
      console.log(`Processing ${file}...`);
      
      await sharp(inputPath)
        .resize(400, 300, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);
        
      console.log(`✅ Created thumbnail for ${file}`);
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
  
  console.log('\n🎉 Thumbnail generation completed!');
  console.log(`📁 Thumbnails saved to: ${thumbnailsDir}`);
}

generateThumbnails().catch(console.error);
