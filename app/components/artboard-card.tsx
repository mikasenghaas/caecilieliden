import Link from "next/link";
import Image from "next/image";

// Front-page cards are laid out straight from their 470x470 Figma artboard:
// every coordinate below is in board pixels and converted to a percentage, so
// a card scales with its grid column instead of only being right at 470px.
// Type is the deliberate exception — it stays at the filter pills' fixed size.
const BOARD = 470;
const pct = (value: number) => `${(value / BOARD) * 100}%`;

export interface Artwork {
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface CardDesign {
  /** Title, pre-broken into the lines the artboard uses. */
  lines: string[];
  footer: string;
  artwork: Artwork[];
  /** Optional right-aligned status label, marked with a coloured dot. */
  tag?: { label: string; color: string };
}

export default function ArtboardCard({
  href,
  title,
  design,
}: {
  href: string;
  title: string;
  design: CardDesign;
}) {
  const { lines, footer, artwork, tag } = design;

  return (
    <Link
      href={href}
      aria-label={title}
      className="group relative block aspect-square w-full max-w-[470px] overflow-hidden bg-[#EDEDED] font-mono text-xs leading-[22px] text-[#1B1B1B] transition-transform duration-200 ease-out hover:scale-[1.01] sm:text-sm"
    >
      <span
        className="absolute whitespace-pre-line"
        style={{ left: pct(26), top: pct(31) }}
      >
        {lines.join("\n")}
      </span>

      {tag && (
        <span
          className="absolute flex items-center gap-[8px] whitespace-nowrap"
          style={{ right: pct(25), top: pct(31) }}
        >
          <span
            className="size-1 shrink-0 rounded-full"
            style={{ backgroundColor: tag.color }}
          />
          {tag.label}
        </span>
      )}

      {artwork.map((art) => (
        <Image
          key={art.src}
          src={art.src}
          alt=""
          width={art.width * 2}
          height={art.height * 2}
          sizes="(max-width: 640px) 50vw, 235px"
          className="absolute object-cover"
          style={{
            left: pct(art.left),
            top: pct(art.top),
            width: pct(art.width),
            height: pct(art.height),
          }}
        />
      ))}

      <span
        className="absolute whitespace-nowrap"
        style={{ left: pct(26), top: pct(440) }}
      >
        {footer}
      </span>
    </Link>
  );
}
