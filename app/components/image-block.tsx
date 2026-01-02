import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ImageBlockProps {
  src: StaticImageData | string;
  alt: string;
  href?: string;
  className?: string;
  priority?: boolean;
}

// Helper to convert SVG paths to WebP if available
function getOptimizedSrc(src: string): string {
  // Convert .svg to .webp for gallery and project images (our WebP files are pre-generated)
  if (typeof src === 'string' && src.endsWith('.svg') && (src.includes('/gallery/') || src.includes('/projects/'))) {
    return src.replace('.svg', '.webp');
  }
  return src;
}

export default function ImageBlock({ src, alt, href, className = "", priority = false }: ImageBlockProps) {
  const isStaticImage = typeof src !== "string";
  const hoverStyles = href ? "cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02]" : "";
  
  // Use optimized WebP version if available
  const optimizedSrc = isStaticImage ? src : getOptimizedSrc(src);
  
  const imageElement = (
    <div className={`relative w-full break-inside-avoid mb-4 sm:mb-5 lg:mb-6 ${hoverStyles} ${className}`}>
      {isStaticImage ? (
        <Image
          src={optimizedSrc}
          alt={alt}
          className="w-full h-auto"
          priority={priority}
        />
      ) : (
        <Image
          src={optimizedSrc}
          alt={alt}
          width={800}
          height={600}
          className="w-full h-auto"
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block break-inside-avoid">{imageElement}</Link>;
  }

  return imageElement;
}
