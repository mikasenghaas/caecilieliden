import Image from "next/image";

interface MdxImageProps {
  src: string;
  alt?: string;
  caption?: string;
  priority?: boolean;
}

// Helper to convert SVG paths to WebP if available
function getOptimizedSrc(src: string): string {
  // Convert .svg to .webp for project images (our WebP files are pre-generated)
  if (src.endsWith('.svg') && src.includes('/projects/')) {
    return src.replace('.svg', '.webp');
  }
  return src;
}

export default function MdxImage({ src, alt, caption, priority = false }: MdxImageProps) {
  const optimizedSrc = getOptimizedSrc(src);
  
  return (
    <figure className="my-8 space-y-3">
      <div className="relative w-full">
        <Image
          src={optimizedSrc}
          alt={alt || caption || "Project image"}
          width={800}
          height={600}
          className="w-full h-auto"
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-background/60 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

