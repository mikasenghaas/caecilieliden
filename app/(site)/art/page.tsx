import ImageBlock from "@/app/components/image-block";
import { getAllGalleryItems } from "@/lib/gallery";

// Manual display order (overrides the default alphabetical-by-slug order),
// swapped per request: tulips/blue-heron, then self-portrait/portrait-of-my-sister.
const ORDER = [
  "tulips",
  "cherry-girl",
  "red-waves",
  "chicken",
  "graphics-for-portfolio-website",
  "blue-heron",
  "mosaic-of-life",
  "blurry-flowers",
  "fruits",
  "self-portrait",
  "mika",
  "portrait-of-my-sister",
  "dream-landscape",
];

export default function ArtPage() {
  const artworks = getAllGalleryItems().sort(
    (a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug)
  );

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
