import fs from "fs";
import path from "path";

const galleryDirectory = path.join(process.cwd(), "public/gallery");

export interface GalleryMetadata {
  title: string;
  year: string;
}

export interface GalleryItem {
  slug: string;
  metadata: GalleryMetadata;
  images: string[];
}

export function getGallerySlugs(): string[] {
  const entries = fs.readdirSync(galleryDirectory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

export function getGalleryItem(slug: string): GalleryItem | null {
  const itemDir = path.join(galleryDirectory, slug);
  const metadataPath = path.join(itemDir, "metadata.json");

  if (!fs.existsSync(metadataPath)) {
    return null;
  }

  const metadata: GalleryMetadata = JSON.parse(
    fs.readFileSync(metadataPath, "utf8")
  );

  // Get all image files in the directory
  // Prefer WebP over SVG for performance (WebP files are pre-converted from large SVGs)
  const files = fs.readdirSync(itemDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file));
  
  // Build a map to prefer WebP over SVG when both exist
  const imageMap = new Map<string, string>();
  for (const file of imageFiles) {
    const baseName = file.replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '');
    const ext = file.split('.').pop()?.toLowerCase();
    const existing = imageMap.get(baseName);
    
    // Prefer WebP, then other formats, SVG last (since our SVGs are huge embedded rasters)
    if (!existing) {
      imageMap.set(baseName, file);
    } else if (ext === 'webp') {
      imageMap.set(baseName, file); // WebP always wins
    } else if (existing.endsWith('.svg') && ext !== 'svg') {
      imageMap.set(baseName, file); // Anything beats SVG except when we only have SVG
    }
  }
  
  const images = Array.from(imageMap.values())
    .sort()
    .map((file) => `/gallery/${slug}/${file}`); // Return URL paths for public directory

  return {
    slug,
    metadata,
    images,
  };
}

export function getAllGalleryItems(): GalleryItem[] {
  const slugs = getGallerySlugs();
  return slugs
    .map((slug) => getGalleryItem(slug))
    .filter((item): item is GalleryItem => item !== null);
}

