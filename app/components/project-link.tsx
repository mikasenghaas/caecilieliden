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
      className={`relative flex items-center justify-center aspect-square hover:opacity-80 transition-opacity ${className}`}
    >
      <Image
        src={bigFlowerSvg}
        alt=""
        fill
        className="object-contain"
      />
      <span className="absolute inset-0 flex items-center justify-center text-white text-center text-sm font-medium px-8 leading-tight">
        {title}
      </span>
    </Link>
  );
}

