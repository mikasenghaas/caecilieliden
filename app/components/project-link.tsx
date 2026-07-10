import Link from "next/link";

interface ProjectLinkProps {
  href: string;
  title: string;
  year: string;
  className?: string;
}

export default function ProjectLink({ href, title, year, className = "" }: ProjectLinkProps) {
  return (
    <Link
      href={href}
      className={`block transition-transform duration-200 ease-out hover:scale-[1.02] break-inside-avoid mb-1.5 sm:mb-5 lg:mb-6 ${className}`}
    >
      <div className="w-full h-[200px] bg-gray-300" />
      <p className="mt-2 text-xs sm:text-sm leading-relaxed [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]">
        {title}
        <br />
        {year}
      </p>
    </Link>
  );
}
