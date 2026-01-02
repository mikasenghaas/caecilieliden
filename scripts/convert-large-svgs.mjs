#!/usr/bin/env node

/**
 * Convert extremely large SVG files that contain embedded base64 raster data.
 * These files are too large for standard XML parsers, so we extract the base64 data directly.
 */

import { readFile, writeFile, stat } from 'fs/promises';
import { join } from 'path';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Sharp is not installed. Please run: npm install sharp');
  process.exit(1);
}

// Files that failed in the standard conversion
const LARGE_FILES = [
  './public/gallery/chicken/chicken-1.svg',
  './public/gallery/mosaic-of-life/mosaic-of-life-1.svg',
  './public/gallery/red-waves/red-waves-1.svg',
  './public/gallery/red-waves/red-waves-2.svg',
  './public/gallery/red-waves/red-waves-3.svg',
];

async function extractAndConvertBase64(svgPath) {
  const webpPath = svgPath.replace('.svg', '.webp');
  
  try {
    // Read as text
    const svgContent = await readFile(svgPath, 'utf-8');
    
    // Find base64 image data - could be PNG or JPEG
    const base64Match = svgContent.match(/xlink:href="data:image\/(png|jpeg|jpg);base64,([^"]+)"/);
    
    if (!base64Match) {
      // Try alternate format without xlink namespace
      const altMatch = svgContent.match(/href="data:image\/(png|jpeg|jpg);base64,([^"]+)"/);
      if (!altMatch) {
        return { success: false, error: 'No embedded base64 image found' };
      }
      base64Match[1] = altMatch[1];
      base64Match[2] = altMatch[2];
    }
    
    const imageType = base64Match[1];
    const base64Data = base64Match[2];
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Convert to WebP with high quality to preserve details
    await sharp(imageBuffer)
      .webp({ quality: 95, effort: 6, nearLossless: true })
      .toFile(webpPath);
    
    const newStats = await stat(webpPath);
    return { success: true, newPath: webpPath, newSize: newStats.size, imageType };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🖼️  Large SVG Conversion Script\n');
  console.log('Converting files that are too large for standard XML parsing...\n');
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  
  for (const filePath of LARGE_FILES) {
    try {
      const stats = await stat(filePath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
      console.log(`📄 ${filePath} (${sizeMB} MB)`);
      
      const result = await extractAndConvertBase64(filePath);
      
      if (result.success) {
        const newSizeMB = (result.newSize / 1024 / 1024).toFixed(2);
        const reduction = ((1 - result.newSize / stats.size) * 100).toFixed(1);
        console.log(`   ✅ Converted ${result.imageType.toUpperCase()} to WebP: ${newSizeMB} MB (${reduction}% smaller)\n`);
        totalOriginalSize += stats.size;
        totalNewSize += result.newSize;
      } else {
        console.log(`   ❌ Failed: ${result.error}\n`);
      }
    } catch (error) {
      console.log(`   ❌ File not found or error: ${error.message}\n`);
    }
  }
  
  if (totalOriginalSize > 0) {
    console.log('\n📊 Summary:');
    console.log(`   Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   New total: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved: ${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB (${((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1)}%)`);
  }
}

main().catch(console.error);

