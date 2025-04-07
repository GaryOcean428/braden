import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a gradient background with text overlay for hero image
async function generateHeroImage() {
  try {
    // Create a gradient background
    const width = 1920;
    const height = 1080;
    
    // Create a gradient SVG
    const svg = `
    <svg width="${width}" height="${height}">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2c3e50" stop-opacity="1" />
          <stop offset="100%" stop-color="#811a2c" stop-opacity="1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad)" />
      <text x="50%" y="50%" font-family="Arial" font-size="80" fill="white" text-anchor="middle">Braden Group</text>
      <text x="50%" y="58%" font-family="Arial" font-size="40" fill="white" text-anchor="middle">Shaping Tomorrow's Workforce Today</text>
    </svg>
    `;
    
    // Convert SVG to JPEG
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 90 })
      .toFile(path.join(__dirname, 'public', 'hero-image.jpg'));
    
    console.log('Hero image generated successfully!');
  } catch (error) {
    console.error('Error generating hero image:', error);
  }
}

generateHeroImage();
