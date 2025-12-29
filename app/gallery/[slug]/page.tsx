import { notFound } from "next/navigation";
import Image from "next/image";
import FlowerLink from "@/app/components/flower-link";
import { getGalleryItem, getGallerySlugs } from "@/lib/gallery";

interface GalleryPageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for all gallery items
export async function generateStaticParams() {
  const slugs = getGallerySlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { slug } = await params;
  
  const item = getGalleryItem(slug);
  
  if (!item) {
    notFound();
  }

  const { metadata, images } = item;

  return (
    <div className="min-h-screen bg-foreground text-background">
      <FlowerLink theme="dark" />

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Left side - Metadata */}
          <aside className="lg:w-48 flex-shrink-0">
            <h1 className="font-display text-lg uppercase tracking-wide mb-1">
              {metadata.title}
            </h1>
            <p className="text-sm text-background/60">
              {metadata.year}
            </p>
          </aside>

          {/* Right side - Images */}
          <div className="flex-1 space-y-6">
            {images.map((imagePath, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={imagePath}
                  alt={`${metadata.title} - Image ${index + 1}`}
                  width={800}
                  height={800}
                  className="w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

