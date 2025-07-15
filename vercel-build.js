// Vercel build script to ensure hero image is properly handled
// This script runs during the build process to verify and fix image paths

const fs = require('fs');
const path = require('path');

// Log the build environment
console.log('Build environment:', process.env.NODE_ENV);
console.log('Vercel URL:', process.env.VERCEL_URL || 'Not deployed on Vercel');

// Check if we're in the build directory
const buildDir = path.resolve('./dist');
const publicDir = path.resolve('./public');

console.log('Checking build directory:', buildDir);
console.log('Public directory:', publicDir);

// Ensure the hero image is copied to the build output
try {
  if (fs.existsSync(buildDir)) {
    console.log('Build directory exists, checking for hero image');

    // Source hero image
    const sourceImage = path.join(publicDir, 'hero-image.jpg');

    // Destination in build directory
    const destImage = path.join(buildDir, 'hero-image.jpg');

    if (fs.existsSync(sourceImage)) {
      console.log('Hero image found in public directory');

      // Copy the image to the build directory if it doesn't exist
      if (!fs.existsSync(destImage)) {
        console.log('Copying hero image to build directory');
        fs.copyFileSync(sourceImage, destImage);
        console.log('Hero image copied successfully');
      } else {
        console.log('Hero image already exists in build directory');
      }
    } else {
      console.error('Hero image not found in public directory:', sourceImage);
    }
  } else {
    console.log('Build directory does not exist yet, skipping image check');
  }
} catch (error) {
  console.error('Error during build script execution:', error);
}

console.log('Build script completed');
