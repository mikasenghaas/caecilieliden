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
  const files = fs.readdirSync(itemDir);
  const images = files
    .filter((file) => /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file))
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

