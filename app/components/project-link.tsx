import Link from "next/link";
import Image from "next/image";
import bigFlowerSvg from "@/app/assets/big-flower.svg";

interface ProjectLinkProps {
  href: string;
  title: string;
  className?: string;
}

export default function ProjectLink({ href, title, className = "" }: ProjectLinkProps) {
  return (
    <Link
      href={href}
      className={`relative flex items-center justify-center transition-transform duration-200 ease-out hover:scale-[1.02] break-inside-avoid mb-4 sm:mb-5 lg:mb-6 ${className}`}
    >
      <Image
        src={bigFlowerSvg}
        alt=""
        className="w-full h-auto"
      />
      <span className="absolute inset-0 flex items-center justify-center text-white text-center font-medium px-20 leading-tight max-w-[90%] mx-auto">
        {title}
      </span>
    </Link>
  );
}
