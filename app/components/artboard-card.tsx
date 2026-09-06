import Link from "next/link";
import Image from "next/image";

// Front-page cards are laid out straight from their 470x470 Figma artboard:
// every coordinate below is in board pixels and converted to a percentage, so
// a card scales with its grid column instead of only being right at 470px.
// Type is the deliberate exception — it stays at the filter pills' fixed size.
const BOARD = 470;
const pct = (value: number) => `${(value / BOARD) * 100}%`;

// The card's outline: a rounded rectangle at rest, and on hover a wave that
// runs right around it, corners included.
//
// The wave is a chain of identical quarter-circle arcs. Each arc turns 90
// degrees, so alternating the direction of the turn walks a wave along a
// straight line, and repeating a turn once instead of alternating it swings
// the whole wave through 90 degrees — which is the corner. A corner is not a
// corner, then, but one more wave, the same size and shape as every other.
// That is what keeps it undistorted: bending a wave around a corner arc of its
// own would fan the crests out on the outside of the turn and pinch them on
// the inside, which is exactly what a drawn corner looks wrong doing.
//
// Because every arc is a quarter circle on a chord of one step, the wave's
// depth is not a free parameter: it is the arc's sagitta, about 0.207 of a
// step. The one dial is how many arcs go on a side.
//
// Both outlines are written as the same run of 44 cubics — ten to a side plus
// one for each corner — because that is what lets the browser interpolate
// between them, so hovering bends the straight edges into the wave rather than
// dissolving one drawing into another. Curves only interpolate against curves
// of the same shape of path, which is why the resting rectangle is subdivided
// into segments it does not otherwise need.
const OUTLINE = (() => {
  const INSET = 0.5; // the stroke's own centre line, half a pixel in
  const RESTING_RADIUS = 15;
  // Even, so that each side ends on the same turn it needs to repeat into the
  // corner, and all four corners come out identical.
  const ARCS_PER_SIDE = 10;
  // The handle length that turns a cubic into a quarter circle of radius one.
  const HANDLE = (4 / 3) * Math.tan(Math.PI / 8);

  const lo = INSET;
  const hi = BOARD - INSET;
  const round = (n: number) => Math.round(n * 100) / 100;

  type Point = { x: number; y: number };
  const curve = (c1: Point, c2: Point, to: Point) =>
    `C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(
      to.x,
    )} ${round(to.y)}`;

  // The wave, walked: hold a point and a heading, and let each arc move the
  // point along its chord and swing the heading by a right angle.
  const wave = (() => {
    const step = (hi - lo) / (ARCS_PER_SIDE + 1);
    const radius = step / Math.SQRT2; // the quarter circle spanning that chord
    const reach = HANDLE * radius;

    let at: Point = { x: lo + step, y: lo };
    let heading = Math.PI / 4; // the wave crosses its own line at 45 degrees
    let d = `M${round(at.x)} ${round(at.y)}`;

    const swing = (turn: 1 | -1) => {
      const chord = heading + (turn * Math.PI) / 4;
      const exit = heading + (turn * Math.PI) / 2;
      const to = {
        x: at.x + step * Math.cos(chord),
        y: at.y + step * Math.sin(chord),
      };
      d += curve(
        { x: at.x + reach * Math.cos(heading), y: at.y + reach * Math.sin(heading) },
        { x: to.x - reach * Math.cos(exit), y: to.y - reach * Math.sin(exit) },
        to,
      );
      at = to;
      heading = exit;
    };

    for (let side = 0; side < 4; side += 1) {
      for (let i = 0; i < ARCS_PER_SIDE; i += 1) swing(i % 2 === 0 ? -1 : 1);
      swing(1); // the repeated turn: this one arc is the corner
    }
    return `${d}Z`;
  })();

  // The resting rectangle, cut into the same 44 segments: ten flat ones along
  // each side, then the corner.
  const resting = (() => {
    const r = RESTING_RADIUS;
    const run = hi - lo - 2 * r; // the straight part of one side
    const piece = run / ARCS_PER_SIDE;
    const reach = HANDLE * r;
    // Clockwise from the top-left corner's end: where each side starts, and
    // the direction it runs in.
    const sides = [
      { x: lo + r, y: lo, dx: 1, dy: 0 },
      { x: hi, y: lo + r, dx: 0, dy: 1 },
      { x: hi - r, y: hi, dx: -1, dy: 0 },
      { x: lo, y: hi - r, dx: 0, dy: -1 },
    ];

    let d = `M${round(sides[0].x)} ${round(sides[0].y)}`;
    sides.forEach((from, index) => {
      const next = sides[(index + 1) % sides.length];
      let at: Point = { x: from.x, y: from.y };
      for (let i = 0; i < ARCS_PER_SIDE; i += 1) {
        const to = {
          x: from.x + from.dx * piece * (i + 1),
          y: from.y + from.dy * piece * (i + 1),
        };
        // Straight, but written as a cubic so it can bend into a wave.
        d += curve(
          { x: at.x + (to.x - at.x) / 3, y: at.y + (to.y - at.y) / 3 },
          { x: to.x - (to.x - at.x) / 3, y: to.y - (to.y - at.y) / 3 },
          to,
        );
        at = to;
      }
      d += curve(
        { x: at.x + from.dx * reach, y: at.y + from.dy * reach },
        { x: next.x - next.dx * reach, y: next.y - next.dy * reach },
        { x: next.x, y: next.y },
      );
    });
    return `${d}Z`;
  })();

  return { resting, wave };
})();

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
  /**
   * Not rendered at the moment. Kept, with the copy on each card, so the
   * hover overlay can be turned back on without rewriting it.
   */
  description?: string;
  /**
   * The box the description covers, in board pixels. Defaults to the first
   * artwork's box, which is right for the cards whose artwork is a single
   * square. The LED card's image is one full-bleed composite, so it names the
   * square photo inside that composite instead.
   */
  descriptionSlot?: { left: number; top: number; width: number; height: number };
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
      // Fixed width and one fixed type size, not a share of the grid: the card
      // is drawn from a 470px artboard, so anything that scaled with the
      // window would make the text drift against the artwork. The card keeps
      // one size and the row simply wraps once two no longer fit. max-w-full
      // is the one exception, for phones narrower than a card.
      className="group relative block aspect-square w-[460px] max-w-full shrink-0 rounded-[15px] bg-white font-plex text-[16px] font-normal leading-[22px] text-[#1B1B1B]"
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

      {/* The card itself no longer clips, so that the outline's stroke is not
          shaved by its own rounded corner. The artwork keeps its own clipped
          box, which is all that needed clipping: one card's image is a
          full-bleed composite. */}
      <div className="absolute inset-0 overflow-hidden rounded-[15px]">
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
      </div>

      {/* Anchored to the bottom rather than placed at a fixed height, so its
          last line sits the same distance off the bottom edge as the title's
          first line sits off the top. */}
      <span
        className="absolute whitespace-nowrap"
        style={{ left: pct(26), bottom: pct(31) }}
      >
        {footer}
      </span>

      {/* Drawn rather than bordered, so hover can bend one outline into
          another. The two shapes are handed over as custom properties and the
          swap itself lives in globals.css, since a CSS transition is what
          interpolates them. non-scaling-stroke keeps the line exactly one
          screen pixel whatever the board scales to. */}
      <svg
        viewBox={`0 0 ${BOARD} ${BOARD}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        <path
          className="artboard-outline"
          d={OUTLINE.resting}
          style={
            {
              "--outline-resting": `path("${OUTLINE.resting}")`,
              "--outline-wave": `path("${OUTLINE.wave}")`,
            } as React.CSSProperties
          }
          fill="none"
          stroke="#1B1B1B"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Link>
  );
}
