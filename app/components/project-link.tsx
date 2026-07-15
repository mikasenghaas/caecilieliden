import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface ProjectLinkProps {
  href: string;
  title: string;
  year: string;
  image?: StaticImageData | string;
  hoverImage?: StaticImageData | string;
  className?: string;
}

export default function ProjectLink({ href, title, year, image, hoverImage, className = "" }: ProjectLinkProps) {
  return (
    <Link
      href={href}
      className={`group block transition-transform duration-200 ease-out hover:scale-[1.02] break-inside-avoid mb-1.5 sm:mb-5 lg:mb-6 ${className}`}
    >
      {image ? (
        <div className="relative w-full aspect-[305/200] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover ${hoverImage ? "transition-opacity duration-200 ease-out group-hover:opacity-0" : ""}`}
          />
          {hoverImage && (
            <Image
              src={hoverImage}
              alt={title}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
            />
          )}
        </div>
      ) : (
        <div className="w-full aspect-[305/200] bg-gray-300" />
      )}
      <p className="mt-2 text-xs sm:text-sm leading-relaxed [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]">
        {title}
        <br />
        {year}
      </p>
    </Link>
  );
}
