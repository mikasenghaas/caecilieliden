import Link from "next/link";
import Image from "next/image";

// Front-page cards are laid out straight from their Figma artboard: every
// coordinate is in board pixels and expressed as a percentage, so a card scales
// with its grid column instead of only being right at one size. Type is the
// deliberate exception — it stays at the filter pills' fixed size.
//
// There are two boards. The wide one is two of the old 470px squares side by
// side plus the gap that sat between them, and fills a whole row: title, art
// and year down the left square, intro and keywords down the right. Once the
// page is too narrow for that, the card returns to the single square and drops
// the right-hand column, since there is no room to set it.
const WIDE_W = 964;
const SQUARE_W = 470;
const BOARD_H = 470;

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
// On a board that is no longer square the two axes get their own arc count, so
// the waves stay roughly the same size on a long side as on a short one. The
// two step lengths are then not free either: walking a side advances by that
// side's steps plus one corner arc, which is a step of the *previous* side, so
// the walk only closes back on itself when
//   stepY + arcsX * stepX = width   and   stepX + arcsY * stepY = height.
// Solving that pair is what the two expressions below are.
//
// Both outlines are written as the same run of cubics — the arcs of a side
// plus one for each corner — because that is what lets the browser interpolate
// between them, so hovering bends the straight edges into the wave rather than
// dissolving one drawing into another. Curves only interpolate against curves
// of the same shape of path, which is why the resting rectangle is subdivided
// into segments it does not otherwise need.
//
// Arc counts are per board, picked so that a step comes out about the same
// length whichever board is drawn — that is what keeps the wave the same size
// on the square card as on the wide one, rather than stretching with it.
const outlineFor = (boardW: number, arcsX: number, arcsY: number) => {
  const INSET = 0.5; // the stroke's own centre line, half a pixel in
  const RESTING_RADIUS = 15;
  // The handle length that turns a cubic into a quarter circle of radius one.
  const HANDLE = (4 / 3) * Math.tan(Math.PI / 8);

  const lo = INSET;
  const hiX = boardW - INSET;
  const hiY = BOARD_H - INSET;
  const width = hiX - lo;
  const height = hiY - lo;
  const denominator = arcsX * arcsY - 1;
  const stepX = (width * arcsY - height) / denominator;
  const stepY = (height * arcsX - width) / denominator;
  const round = (n: number) => Math.round(n * 100) / 100;

  type Point = { x: number; y: number };
  const curve = (c1: Point, c2: Point, to: Point) =>
    `C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(
      to.x,
    )} ${round(to.y)}`;

  // The wave, walked: hold a point and a heading, and let each arc move the
  // point along its chord and swing the heading by a right angle.
  const wave = (() => {
    // The start is where the left side's corner arc lands, one vertical step
    // in along the top edge.
    let at: Point = { x: lo + stepY, y: lo };
    let heading = Math.PI / 4; // the wave crosses its own line at 45 degrees
    let d = `M${round(at.x)} ${round(at.y)}`;

    const swing = (turn: 1 | -1, step: number) => {
      const radius = step / Math.SQRT2; // the quarter circle spanning that chord
      const reach = HANDLE * radius;
      const chord = heading + (turn * Math.PI) / 4;
      const exit = heading + (turn * Math.PI) / 2;
      const to = {
        x: at.x + step * Math.cos(chord),
        y: at.y + step * Math.sin(chord),
      };
      d += curve(
        {
          x: at.x + reach * Math.cos(heading),
          y: at.y + reach * Math.sin(heading),
        },
        { x: to.x - reach * Math.cos(exit), y: to.y - reach * Math.sin(exit) },
        to,
      );
      at = to;
      heading = exit;
    };

    [
      { arcs: arcsX, step: stepX },
      { arcs: arcsY, step: stepY },
      { arcs: arcsX, step: stepX },
      { arcs: arcsY, step: stepY },
    ].forEach((side) => {
      for (let i = 0; i < side.arcs; i += 1)
        swing(i % 2 === 0 ? -1 : 1, side.step);
      swing(1, side.step); // the repeated turn: this one arc is the corner
    });
    return `${d}Z`;
  })();

  // The resting rectangle, cut into the same segments: a flat one for each of
  // the side's arcs, then the corner.
  const resting = (() => {
    const r = RESTING_RADIUS;
    const reach = HANDLE * r;
    // Clockwise from the top-left corner's end: where each side starts, the
    // direction it runs in, and how many pieces it is cut into.
    const sides = [
      { x: lo + r, y: lo, dx: 1, dy: 0, arcs: arcsX, run: width - 2 * r },
      { x: hiX, y: lo + r, dx: 0, dy: 1, arcs: arcsY, run: height - 2 * r },
      { x: hiX - r, y: hiY, dx: -1, dy: 0, arcs: arcsX, run: width - 2 * r },
      { x: lo, y: hiY - r, dx: 0, dy: -1, arcs: arcsY, run: height - 2 * r },
    ];

    let d = `M${round(sides[0].x)} ${round(sides[0].y)}`;
    sides.forEach((from, index) => {
      const next = sides[(index + 1) % sides.length];
      const piece = from.run / from.arcs;
      let at: Point = { x: from.x, y: from.y };
      for (let i = 0; i < from.arcs; i += 1) {
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
};

// Both arc counts even, so that each side ends on the same turn it needs to
// repeat into the corner and all four corners come out identical. 22x10 on the
// wide board and 10x10 on the square both give a step of about 42px.
const WIDE_OUTLINE = outlineFor(WIDE_W, 22, 10);
const SQUARE_OUTLINE = outlineFor(SQUARE_W, 10, 10);

// The card reads as two columns. The left one stacks title, artwork and year;
// the right one stacks tag, intro and keywords. Both are laid out as real
// stacks rather than placed by hand, so the artwork simply takes whatever
// height is left between the text above and below it and can never sit on top
// of either, whatever length the title runs to.
//
// The insets are written out as percentages because they have to change with
// the board and Tailwind needs to see the literal value. In board pixels they
// are the same on both: 26 in from the sides, 31 off the top and bottom.
//   sides, square board   26/470 = 5.5319%
//   sides, wide board     26/964 = 2.6971%
//   top and bottom        31/470 = 6.5957%   (both boards are 470 tall)
//   left column ends at 470   (964-470)/964 = 51.2448%
//   right column starts at 488     488/964 = 50.6224%
const COLUMN_BAND = "top-[6.5957%] bottom-[6.5957%]";
const LEFT_COLUMN = `left-[5.5319%] right-[5.5319%] @min-[944px]:left-[2.6971%] @min-[944px]:right-[51.2448%]`;
const RIGHT_COLUMN = `left-[50.6224%] right-[2.6971%]`;

export interface Artwork {
  src: string;
}

export interface CardDesign {
  /** Title, pre-broken into the lines the artboard uses. */
  lines: string[];
  footer: string;
  artwork: Artwork[];
  /** Optional label above the intro. A colour marks it with a dot as a status. */
  tag?: { label: string; color?: string };
  /** The short intro, set down the right-hand column. */
  description?: string;
  /** Fields the project sits under, listed along the bottom right. */
  keywords?: string[];
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
  const { lines, footer, artwork, tag, description, keywords } = design;

  return (
    <Link
      href={href}
      aria-label={title}
      // Fixed width and one fixed type size, not a share of the grid: the card
      // is drawn from a fixed artboard, so anything that scaled with the
      // window would make the text drift against the artwork. 944px is the two
      // old squares plus the gap that sat between them. max-w-full is the one
      // exception, for windows narrower than a card.
      //
      // The shape is a container query on the content column, so it turns
      // wide exactly when that column reaches 944 and the card can be drawn at
      // its true size. Asking the window instead left a stretch where the card
      // was called wide but only had 941 to draw in, and because the text does
      // not scale with the board, that shortfall showed up as words moving
      // between lines.
      className="group relative block aspect-square w-[944px] max-w-full shrink-0 rounded-[15px] bg-white font-plex text-[16px] font-normal leading-[22px] text-[#1B1B1B] @min-[944px]:aspect-[964/470]"
    >
      {/* Title, artwork, year. The artwork is the only part that flexes, so it
          absorbs the whole difference between a one-line and a three-line
          title and the year stays pinned to the bottom either way. */}
      <div className={`absolute flex flex-col ${COLUMN_BAND} ${LEFT_COLUMN}`}>
        <span className="whitespace-pre-line">{lines.join("\n")}</span>

        {/* min-h-0 lets this shrink below the image's own height, which is what
            stops a tall picture from pushing the year off the bottom. The
            margin is the clear space asked of it, top and bottom. */}
        <div className="relative my-4 min-h-0 flex-1">
          {artwork.map((art) => (
            <Image
              key={art.src}
              src={art.src}
              alt=""
              fill
              sizes="(max-width: 1000px) 46vw, 435px"
              // Contain, not cover: the picture is fitted whole into the space
              // left over and centred there, rather than cropped to fill it.
              className="object-contain"
            />
          ))}
        </div>

        <span className="whitespace-nowrap">{footer}</span>
      </div>

      {/* The intro, with the tag over it and the keywords under it. Same shape
          as the left column, so the intro centres against the artwork and the
          keywords sit on the same line as the year. Dropped entirely on the
          square board: there is no second column to set it in, and squeezing it
          into the first would bury the artwork. */}
      <div
        className={`absolute hidden flex-col ${COLUMN_BAND} ${RIGHT_COLUMN} @min-[944px]:flex`}
      >
        {tag && (
          <span className="flex items-center gap-[8px] self-end whitespace-nowrap">
            {tag.color && (
              <span
                className="size-1 shrink-0 rounded-full"
                style={{ backgroundColor: tag.color }}
              />
            )}
            {tag.label}
          </span>
        )}

        <span className="flex min-h-0 flex-1 items-center">{description}</span>

        {keywords && (
          <span className="self-end whitespace-nowrap">
            {keywords.join(" • ")}
          </span>
        )}
      </div>

      {/* Drawn rather than bordered, so hover can bend one outline into
          another. The two shapes are handed over as custom properties and the
          swap itself lives in globals.css, since a CSS transition is what
          interpolates them. non-scaling-stroke keeps the line exactly one
          screen pixel whatever the board scales to.

          One outline per board, each shown only at the size it was drawn for. A
          viewBox stretches to fit its element, so reusing the wide drawing on
          the square card would squash every wave along with it. */}
      <Outline
        board={SQUARE_W}
        shape={SQUARE_OUTLINE}
        className="@min-[944px]:hidden"
      />
      <Outline
        board={WIDE_W}
        shape={WIDE_OUTLINE}
        className="hidden @min-[944px]:block"
      />
    </Link>
  );
}

function Outline({
  board,
  shape,
  className,
}: {
  board: number;
  shape: { resting: string; wave: string };
  className: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${board} ${BOARD_H}`}
      aria-hidden
      className={`pointer-events-none absolute inset-0 size-full overflow-visible ${className}`}
    >
      <path
        className="artboard-outline"
        d={shape.resting}
        style={
          {
            "--outline-resting": `path("${shape.resting}")`,
            "--outline-wave": `path("${shape.wave}")`,
          } as React.CSSProperties
        }
        fill="none"
        stroke="#1B1B1B"
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
