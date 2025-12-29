import Image, { StaticImageData } from "next/image";

interface ImageBlockProps {
  src: StaticImageData | string;
  alt: string;
  className?: string;
}

export default function ImageBlock({ src, alt, className = "" }: ImageBlockProps) {
  return (
    <div className={`relative w-full break-inside-avoid mb-4 sm:mb-5 lg:mb-6 cursor-pointer transition-transform duration-200 ease-out hover:scale-[1.02] ${className}`}>
      <Image
        src={src}
        alt={alt}
        className="w-full h-auto"
      />
    </div>
  );
}
