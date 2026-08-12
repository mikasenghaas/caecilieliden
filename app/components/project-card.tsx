import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
  href: string;
  title: string;
  year: string;
  description?: string;
  image?: string;
}

export default function ProjectCard({
  href,
  title,
  year,
  description = "Short text",
  image,
}: ProjectCardProps) {
  // A title may contain "\n" to force a line break at a specific point on
  // the card (front page only — this doesn't affect the article page, which
  // renders its own title separately from frontmatter).
  const titleLines = title.split("\n");
  const flatTitle = titleLines.join(" ");

  return (
    <Link
      href={href}
      className="group relative block w-full aspect-square max-w-[470px] overflow-hidden rounded-[20px] bg-[#EDEDED] p-6 sm:p-7 lg:p-8 transition-transform duration-200 ease-out hover:scale-[1.01]"
    >
      {image && (
        <Image
          src={image}
          alt={flatTitle}
          fill
          className="object-cover opacity-90 transition-opacity duration-200 ease-out group-hover:opacity-100"
          sizes="(max-width: 640px) 100vw, (max-width: 1400px) 50vw, 470px"
        />
      )}
      <div className="relative z-10">
        <p className="text-xs sm:text-sm font-bold leading-relaxed mb-1">
          {titleLines.map((line, i) => (
            <span key={i}>
              {i > 0 && <br />}
              {line}
            </span>
          ))}
        </p>
        {!image && (
          <p className="text-xs sm:text-sm leading-relaxed mb-1 text-black/70">{description}</p>
        )}
        <p className="text-xs sm:text-sm leading-relaxed text-black/50">{year}</p>
      </div>
    </Link>
  );
}
