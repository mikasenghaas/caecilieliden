import Image from "next/image";

interface MdxImageProps {
  src: string;
  alt?: string;
  caption?: string;
  priority?: boolean;
  width?: string;
}

export default function MdxImage({ src, alt, caption, priority = false, width = "100%" }: MdxImageProps) {
  return (
    <figure className="my-8 space-y-3 mx-auto" style={{ maxWidth: width }}>
      <div className="relative w-full">
        <Image
          src={src}
          alt={alt || caption || "Project image"}
          width={800}
          height={600}
          className="w-full h-auto"
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 800px"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-foreground/60 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

