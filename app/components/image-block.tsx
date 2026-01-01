import Image, { StaticImageData } from "next/image";
import Link from "next/link";

interface ImageBlockProps {
  src: StaticImageData | string;
  alt: string;
  href?: string;
  className?: string;
}

export default function ImageBlock({ src, alt, href, className = "" }: ImageBlockProps) {
  const isStaticImage = typeof src !== "string";
  const hoverStyles = href ? "cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02]" : "";
  
  const imageElement = (
    <div className={`relative w-full break-inside-avoid mb-4 sm:mb-5 lg:mb-6 ${hoverStyles} ${className}`}>
      {isStaticImage ? (
        <Image
          src={src}
          alt={alt}
          className="w-full h-auto"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="w-full h-auto"
        />
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block break-inside-avoid">{imageElement}</Link>;
  }

  return imageElement;
}
