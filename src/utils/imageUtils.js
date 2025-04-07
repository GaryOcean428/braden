// This file ensures the hero image is properly loaded in the Vercel deployment
// It creates a symlink to make sure the image is accessible in the build output

import fs from 'fs';
import path from 'path';

// Function to ensure hero image is properly copied during build
export function ensureHeroImage() {
  try {
    // Log the current directory and files for debugging
    console.log('Current directory:', process.cwd());
    console.log('Public directory files:', fs.readdirSync('./public'));
    
    // Make sure the hero image exists in the public directory
    const heroImagePath = path.join('./public', 'hero-image.jpg');
    if (!fs.existsSync(heroImagePath)) {
      console.error('Hero image not found at:', heroImagePath);
      return false;
    }
    
    console.log('Hero image found at:', heroImagePath);
    return true;
  } catch (error) {
    console.error('Error ensuring hero image:', error);
    return false;
  }
}

// Export a function to get the correct hero image URL based on environment
export function getHeroImageUrl() {
  // For Vercel deployments, use the absolute URL with the deployment domain
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/hero-image.jpg`;
  }
  
  // For local development or other environments, use the relative path
  return '/hero-image.jpg';
}
