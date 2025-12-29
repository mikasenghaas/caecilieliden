import Image, { StaticImageData } from "next/image";

interface ImageBlockProps {
  src: StaticImageData | string;
  alt: string;
  className?: string;
}

export default function ImageBlock({ src, alt, className = "" }: ImageBlockProps) {
  return (
    <div className={`relative w-full aspect-square overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
      />
    </div>
  );
}

