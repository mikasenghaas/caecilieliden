import ImageBlock from "@/app/components/image-block";
import { getAllGalleryItems } from "@/lib/gallery";

export default function ArtPage() {
  const artworks = getAllGalleryItems();

  return (
    <div className="columns-2 lg:columns-3 gap-1.5 sm:gap-5 lg:gap-6">
      {artworks.map((item) => (
        <ImageBlock
          key={item.slug}
          src={item.images[0]}
          alt={item.metadata.title}
          href={`/gallery/${item.slug}`}
        />
      ))}
    </div>
  );
}
