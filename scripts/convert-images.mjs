#!/usr/bin/env node

/**
 * Image Conversion Script
 * 
 * Converts large SVG files (that contain embedded raster data) to optimized WebP format.
 * This dramatically reduces file sizes while maintaining high visual quality.
 * 
 * Usage: node scripts/convert-images.mjs
 * 
 * Requirements: npm install sharp
 */

import { readdir, readFile, writeFile, stat, mkdir } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { existsSync } from 'fs';

// Dynamic import for sharp (needs to be installed)
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('Sharp is not installed. Please run: npm install sharp');
  process.exit(1);
}

const PUBLIC_DIR = './public';
const GALLERY_DIR = join(PUBLIC_DIR, 'gallery');
const PROJECTS_DIR = join(PUBLIC_DIR, 'projects');
const SIZE_THRESHOLD = 100 * 1024; // 100KB - SVGs larger than this are likely embedded rasters

async function getAllSvgFiles(dir) {
  const files = [];
  
  async function walk(currentDir) {
    try {
      const entries = await readdir(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.name.endsWith('.svg')) {
          const stats = await stat(fullPath);
          if (stats.size > SIZE_THRESHOLD) {
            files.push({ path: fullPath, size: stats.size });
          }
        }
      }
    } catch (err) {
      console.error(`Error reading ${currentDir}:`, err.message);
    }
  }
  
  await walk(dir);
  return files;
}

async function convertSvgToWebp(svgPath, quality = 95) {
  const webpPath = svgPath.replace('.svg', '.webp');
  
  try {
    // Read the SVG file
    const svgContent = await readFile(svgPath);
    
    // Convert to WebP using sharp with high quality
    // Sharp will handle SVGs that contain embedded raster images
    await sharp(svgContent)
      .webp({ quality, effort: 6, nearLossless: true }) // high quality, near lossless
      .toFile(webpPath);
    
    // Get the new file size
    const newStats = await stat(webpPath);
    
    return { success: true, newPath: webpPath, newSize: newStats.size };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('Finding large SVG files (>100KB)...\n');
  
  // Find all large SVGs in gallery and projects
  const galleryFiles = await getAllSvgFiles(GALLERY_DIR);
  const projectFiles = await getAllSvgFiles(PROJECTS_DIR);
  const allFiles = [...galleryFiles, ...projectFiles];
  
  if (allFiles.length === 0) {
    console.log('No large SVG files found that need conversion.');
    return;
  }
  
  console.log(`Found ${allFiles.length} large SVG files:\n`);
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  
  for (const file of allFiles) {
    const relativePath = file.path.replace(PUBLIC_DIR + '/', '');
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log(`📄 ${relativePath} (${sizeMB} MB)`);
    
    const result = await convertSvgToWebp(file.path);
    
    if (result.success) {
      const newSizeMB = (result.newSize / 1024 / 1024).toFixed(2);
      const reduction = ((1 - result.newSize / file.size) * 100).toFixed(1);
      console.log(`   ✅ Converted to WebP: ${newSizeMB} MB (${reduction}% smaller)\n`);
      totalOriginalSize += file.size;
      totalNewSize += result.newSize;
    } else {
      console.log(`   ❌ Failed: ${result.error}\n`);
    }
  }
  
  if (totalOriginalSize > 0) {
    console.log('\n📊 Summary:');
    console.log(`   Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   New total: ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved: ${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB (${((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1)}%)`);
    console.log('\n✨ Done! Now update your components to use the .webp files.');
    console.log('   You can safely delete the original .svg files after verifying the WebP versions look good.');
  }
}

main().catch(console.error);

