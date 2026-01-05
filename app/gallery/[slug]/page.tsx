import { notFound } from "next/navigation";
import Image from "next/image";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
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
    <>
      <style>{`html, body { background-color: #1B1B1B !important; }`}</style>
      <CustomCursor />
      <div className="min-h-screen bg-foreground text-background">
        <FlowerLink theme="dark" />

      <main className="min-h-screen flex items-center justify-center px-6 py-12">
        {/* Mobile layout */}
        <div className="lg:hidden flex flex-col items-start w-full mt-16 mb-8">
          <div className="mb-4 text-start">
            <h1 className="font-display text-sm uppercase tracking-wide mb-1">
              {metadata.title}
            </h1>
            <p className="text-xs text-background/60">
              {metadata.year}
            </p>
          </div>
          <div className="flex flex-col space-y-6 max-w-3xl w-full">
            {images.map((imagePath, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={imagePath}
                  alt={`${metadata.title} - Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop layout: image centered, metadata to the left */}
        <div className="hidden lg:block relative w-full max-w-lg mt-28 mb-14">
          {/* Metadata - positioned absolutely to the left of the image */}
          <aside className="absolute right-full top-0 mr-8 text-right w-40">
            <h1 className="font-display text-sm uppercase tracking-wide mb-1">
              {metadata.title}
            </h1>
            <p className="text-xs text-background/60">
              {metadata.year}
            </p>
          </aside>

          {/* Images - centered */}
          <div className="flex flex-col space-y-6">
            {images.map((imagePath, index) => (
              <div key={index} className="relative w-full">
                <Image
                  src={imagePath}
                  alt={`${metadata.title} - Image ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  loading={index === 0 ? "eager" : "lazy"}
                  priority={index === 0}
                  sizes="(max-width: 1024px) 100vw, 512px"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
      </div>
    </>
  );
}

