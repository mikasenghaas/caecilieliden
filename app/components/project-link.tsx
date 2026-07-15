import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface ProjectLinkProps {
  href: string;
  title: string;
  year: string;
  image?: StaticImageData | string;
  className?: string;
}

export default function ProjectLink({ href, title, year, image, className = "" }: ProjectLinkProps) {
  return (
    <Link
      href={href}
      className={`block transition-transform duration-200 ease-out hover:scale-[1.02] break-inside-avoid mb-1.5 sm:mb-5 lg:mb-6 ${className}`}
    >
      {image ? (
        <div className="relative w-full aspect-[305/200] overflow-hidden">
          <Image src={image} alt={title} fill className="object-cover" />
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
