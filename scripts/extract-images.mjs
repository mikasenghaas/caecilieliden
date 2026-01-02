#!/usr/bin/env node

/**
 * Extract embedded raster images from SVG files
 * 
 * These SVGs contain base64-encoded PNG/JPEG images which add ~33% overhead.
 * This script extracts the original images and saves them as proper files.
 */

import { readFile, writeFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

const PUBLIC_DIR = './public';
const GALLERY_DIR = join(PUBLIC_DIR, 'gallery');
const PROJECTS_DIR = join(PUBLIC_DIR, 'projects');
const SIZE_THRESHOLD = 50 * 1024; // 50KB - SVGs larger than this likely have embedded images

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

async function extractImageFromSvg(svgPath) {
  const pngPath = svgPath.replace('.svg', '.png');
  const jpgPath = svgPath.replace('.svg', '.jpg');
  
  try {
    // Read the SVG file
    const svgContent = await readFile(svgPath, 'utf-8');
    
    // Find base64 image data - could be PNG or JPEG
    // Try xlink:href first (older SVG format)
    let match = svgContent.match(/xlink:href="data:image\/(png|jpeg|jpg);base64,([^"]+)"/);
    
    // If not found, try href (newer SVG format)
    if (!match) {
      match = svgContent.match(/href="data:image\/(png|jpeg|jpg);base64,([^"]+)"/);
    }
    
    if (!match) {
      return { success: false, error: 'No embedded base64 image found' };
    }
    
    const imageType = match[1].toLowerCase();
    const base64Data = match[2];
    
    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    // Determine output path based on image type
    const outputPath = (imageType === 'png') ? pngPath : jpgPath;
    const outputExt = (imageType === 'png') ? 'png' : 'jpg';
    
    // Write the extracted image
    await writeFile(outputPath, imageBuffer);
    
    const newStats = await stat(outputPath);
    
    return { 
      success: true, 
      outputPath, 
      outputExt,
      newSize: newStats.size,
      imageType: imageType.toUpperCase()
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('🖼️  SVG Image Extraction Script\n');
  console.log('Extracting embedded raster images from SVG files...\n');
  
  // Find all large SVGs in gallery and projects
  const galleryFiles = await getAllSvgFiles(GALLERY_DIR);
  const projectFiles = await getAllSvgFiles(PROJECTS_DIR);
  const allFiles = [...galleryFiles, ...projectFiles];
  
  if (allFiles.length === 0) {
    console.log('No SVG files with embedded images found.');
    return;
  }
  
  console.log(`Found ${allFiles.length} SVG files to process:\n`);
  
  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  
  for (const file of allFiles) {
    const relativePath = file.path.replace('./', '');
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    console.log(`📄 ${relativePath} (${sizeMB} MB)`);
    
    const result = await extractImageFromSvg(file.path);
    
    if (result.success) {
      const newSizeMB = (result.newSize / 1024 / 1024).toFixed(2);
      const reduction = ((1 - result.newSize / file.size) * 100).toFixed(1);
      const outputRelative = result.outputPath.replace('./', '');
      console.log(`   ✅ Extracted ${result.imageType} → ${result.outputExt.toUpperCase()}: ${newSizeMB} MB (${reduction}% smaller)`);
      console.log(`   📁 Saved to: ${outputRelative}\n`);
      totalOriginalSize += file.size;
      totalNewSize += result.newSize;
      successCount++;
    } else {
      console.log(`   ⏭️  Skipped: ${result.error}\n`);
    }
  }
  
  if (totalOriginalSize > 0) {
    console.log('\n📊 Summary:');
    console.log(`   Files processed: ${successCount}`);
    console.log(`   Original total (SVG): ${(totalOriginalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   New total (PNG/JPG): ${(totalNewSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   Saved: ${((totalOriginalSize - totalNewSize) / 1024 / 1024).toFixed(2)} MB (${((1 - totalNewSize / totalOriginalSize) * 100).toFixed(1)}%)`);
    console.log('\n✨ Done! The extracted images are exact copies of the originals (no quality loss).');
    console.log('   Update your components to use the new .png/.jpg files instead of .svg');
  }
}

main().catch(console.error);

