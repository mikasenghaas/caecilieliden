import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  href: string;
  title: string;
  image: string;
}

export default function ProjectCard({ href, title, image }: ProjectCardProps) {
  return (
    <Link
      href={href}
      className="group relative block w-full aspect-square max-w-[470px] overflow-hidden bg-[#EDEDED] transition-transform duration-200 ease-out hover:scale-[1.01]"
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover opacity-90 transition-opacity duration-200 ease-out group-hover:opacity-100"
        sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 470px"
      />
    </Link>
  );
}
