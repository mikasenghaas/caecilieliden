import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ImageBlockProps {
  src: StaticImageData | string;
  alt: string;
  href?: string;
  className?: string;
  priority?: boolean;
}

export default function ImageBlock({ src, alt, href, className = "", priority = false }: ImageBlockProps) {
  const isStaticImage = typeof src !== "string";
  const hoverStyles = href ? "cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02]" : "";
  
  const imageElement = (
    <div className={`relative w-full break-inside-avoid mb-1.5 sm:mb-5 lg:mb-6 ${hoverStyles} ${className}`}>
      {isStaticImage ? (
        <Image
          src={src}
          alt={alt}
          className="w-full h-auto"
          priority={priority}
        />
      ) : (
        <Image
          src={src}
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
