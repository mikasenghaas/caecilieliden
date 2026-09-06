import fs from "fs";
import path from "path";

const galleryDirectory = path.join(process.cwd(), "public/gallery");

export interface GalleryMetadata {
  title: string;
  year: string;
}

export interface GalleryImage {
  src: string;
  width: number;
  height: number;
}

export interface GalleryItem {
  slug: string;
  metadata: GalleryMetadata;
  images: GalleryImage[];
}

// Read an image's real pixel size straight out of its header. This runs on the
// server while the page is built, so the markup can reserve each picture's true
// shape up front. Without it every tile is declared at one guessed ratio and
// then snaps to its own the moment it decodes, which reflows the whole
// masonry — most visibly the first time the art page is opened, before
// anything is cached.
function readImageSize(file: string): { width: number; height: number } {
  const head = Buffer.alloc(32);
  const fd = fs.openSync(file, "r");
  try {
    fs.readSync(fd, head, 0, 32, 0);
  } finally {
    fs.closeSync(fd);
  }

  // PNG: width and height are the first two fields of the IHDR chunk.
  if (head.subarray(1, 4).toString("latin1") === "PNG") {
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
  }
  // GIF: the logical screen descriptor, little-endian, right after the header.
  if (head.subarray(0, 3).toString("latin1") === "GIF") {
    return { width: head.readUInt16LE(6), height: head.readUInt16LE(8) };
  }
  // JPEG: the size lives in a frame header, so the file has to be walked.
  if (head[0] === 0xff && head[1] === 0xd8) {
    const buf = fs.readFileSync(file);
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) {
        i += 1;
        continue;
      }
      const marker = buf[i + 1];
      // SOF0-SOF15, excluding the four that are not frame headers.
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
      }
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }

  // Unknown format: fall back to a square, which at least stays consistent.
  return { width: 1000, height: 1000 };
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
  // Prefer PNG/JPG over SVG (extracted raster images are smaller than embedded SVGs)
  const files = fs.readdirSync(itemDir);
  const imageFiles = files.filter((file) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file));
  
  // Build a map to prefer raster formats over SVG when both exist
  const imageMap = new Map<string, string>();
  for (const file of imageFiles) {
    const baseName = file.replace(/\.(jpg|jpeg|png|gif|svg|webp)$/i, '');
    const ext = file.split('.').pop()?.toLowerCase();
    const existing = imageMap.get(baseName);
    
    // Prefer PNG/JPG over SVG (our SVGs contain embedded rasters with base64 overhead)
    if (!existing) {
      imageMap.set(baseName, file);
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      // PNG/JPG wins over SVG (extracted images are smaller and identical quality)
      if (existing.endsWith('.svg')) {
        imageMap.set(baseName, file);
      }
    }
  }
  
  const images: GalleryImage[] = Array.from(imageMap.values())
    .sort()
    .map((file) => ({
      src: `/gallery/${slug}/${file}`, // URL path into the public directory
      ...readImageSize(path.join(itemDir, file)),
    }));

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

