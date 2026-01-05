import Link from "next/link";
import Image, { StaticImageData } from "next/image";

interface ProjectLinkProps {
  href: string;
  flower: StaticImageData;
  className?: string;
}

export default function ProjectLink({ href, flower, className = "" }: ProjectLinkProps) {
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
    </Link>
  );
}
