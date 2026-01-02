import Image from "next/image";

interface MdxImageProps {
  src: string;
  alt?: string;
  caption?: string;
}

export default function MdxImage({ src, alt, caption }: MdxImageProps) {
  return (
    <figure className="my-8 space-y-3">
      <div className="relative w-full">
        <Image
          src={src}
          alt={alt || caption || "Project image"}
          width={800}
          height={600}
          className="w-full h-auto"
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

