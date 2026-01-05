import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface ProjectLinkProps {
  href: string;
  title: string;
  flower: StaticImageData;
  className?: string;
  textClassName?: string;
}

export default function ProjectLink({ href, title, flower, className = "", textClassName = "" }: ProjectLinkProps) {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-center transition-transform duration-200 ease-out hover:scale-[1.02] break-inside-avoid mb-1.5 sm:mb-5 lg:mb-6 ${className}`}
    >
      <Image
        src={flower}
        alt=""
        className="w-full h-auto"
      />
      <span className={`absolute inset-0 flex items-center justify-center text-[#F2F5D3] text-center text-xs sm:text-base font-medium px-4 sm:px-20 leading-tight max-w-[90%] mx-auto ${textClassName}`}>
        {title}
      </span>
    </Link>
  );
}
