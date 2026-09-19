"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Papa from "papaparse";
import ArticleColumn, { ArticleChapter } from "@/app/components/article-column";
import h1Image from "@/app/assets/h1.png";
import h2Image from "@/app/assets/h2.png";
import h3Image from "@/app/assets/h3.png";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRygBgv3rdWSyM9t8OYKxJvp50ORhlv1PEGWw2ChE0GqhTHNDGb1-dAQAZLrIQz_oG9_mvsw_bpesJe/pub?output=csv";

const REFRESH_INTERVAL_MS = 60_000;

// Nautilus/Fermat-style spiral: fixed angle step per point, radius growing
// with sqrt(idx) rather than a fixed amount per point. That means later
// coils add less distance from node 1 than a plain Archimedean spiral would,
// so the whorls stay layered close together (like a snail shell) instead of
// an ever-widening coil. Lower SPIRAL_RADIUS_SCALE for tighter/more
// overlapping layers, raise it for a more open spiral. The view itself is
// fit to however much data currently exists (see autoFitScale below), so it
// always fills the canvas rather than looking "zoomed out" while the sheet
// is small.
const SPIRAL_ANGLE_STEP_DEG = 25;
const SPIRAL_RADIUS_SCALE = 6;

// Fixed SVG coordinate space; pan is done via a transform on top of this,
// so the math stays simple regardless of how much data currently exists.
const VIEW_HALF = 500;

// Figure blur is a flat 4 screen pixels regardless of node size or how far
// autoFitScale has zoomed out for a larger dataset — divide by view.scale so
// the on-screen blur radius stays constant instead of shrinking/growing with
// zoom.
const FIGURE_BLUR_PX = 1;

// Entrance only: each node is born a fair distance from its true spiral
// position (as if drifting in from open space) and glides into place with a
// bouncy, slightly-overshooting easing — like it drifts past its resting
// spot in zero gravity before settling — staggered by a random delay (up to
// ENTRANCE_STAGGER_MS) so the whole spiral settles in gradually rather than
// snapping into place all at once. That's the only motion in the piece;
// once landed, a node stands still for good. Links are drawn between the
// currently-displayed (landing) positions so they visibly follow the nodes
// while they're still settling in. All distances are in the same user-unit
// space as the spiral coordinates.
const ENTRANCE_DISTANCE_MIN = 40;
const ENTRANCE_DISTANCE_MAX = 90;
const ENTRANCE_DURATION_MS = 1400;
const ENTRANCE_STAGGER_MS = 500;
const LANDING_EASE = "cubic-bezier(0.34, 1.56, 0.64, 1)";

// Deterministic pseudo-random value in [0, 1) from an integer seed, so each
// node's entrance offset is stable across renders without storing extra
// per-node state.
function floatSeed(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function entranceOffset(seed: number): { dx: number; dy: number } {
  const dist =
    ENTRANCE_DISTANCE_MIN +
    seed * (ENTRANCE_DISTANCE_MAX - ENTRANCE_DISTANCE_MIN);
  const angle = seed * Math.PI * 2;
  return { dx: Math.cos(angle) * dist, dy: Math.sin(angle) * dist };
}

// Style for a node's animated offset layer: glides to its resting offset
// with the bouncy landing easing, staggered on first entrance so nodes
// don't all land in sync.
function nodeAnimStyle(
  offset: { dx: number; dy: number; isSettled: boolean },
  seed: number,
): React.CSSProperties {
  const transform = `translate(${offset.dx}px, ${offset.dy}px)`;
  const delay = offset.isSettled ? 0 : seed * ENTRANCE_STAGGER_MS;
  return {
    transform,
    transition: `transform ${ENTRANCE_DURATION_MS}ms ${LANDING_EASE} ${delay}ms`,
  };
}

type Shape = "plus" | "flower" | "circle";

// professional -> plus (crisp/structured), personal -> flower (matches the
// site's own flower motif), random -> circle (also the default fallback).
const CATEGORY_SHAPE: Record<string, Shape> = {
  professional: "plus",
  personal: "flower",
  random: "circle",
};
const DEFAULT_SHAPE: Shape = "circle";

// Path data lifted from app/assets/plus-dataviz.svg and flower-dataviz.svg so
// they can be filled/sized per-node inside the canvas SVG.
const PLUS_VIEWBOX = { w: 50, h: 50 };
const PLUS_PATH =
  "M25 0C32.5984 0 31.7523 18.2477 31.7523 18.2477C31.7523 18.2477 50 17.4016 50 25C50 32.5984 31.7523 31.7523 31.7523 31.7523C31.7523 31.7523 32.5984 50 25 50C17.4016 50 18.2477 31.7523 18.2477 31.7523C18.2477 31.7523 0 32.5984 0 25C0 17.4016 18.2477 18.2477 18.2477 18.2477C18.2477 18.2477 17.4016 0 25 0Z";

const FLOWER_VIEWBOX = { w: 55, h: 53 };
const FLOWER_PATH =
  "M15.9508 8.01663C19.4521 -2.67224 34.573 -2.67225 38.0742 8.01662L39.1488 11.2972H42.3628C53.6616 11.2972 58.3347 25.7743 49.1684 32.3803L46.6494 34.1958L47.6617 37.2863C51.1691 47.9938 38.9353 56.9405 29.7944 50.3528L27.0125 48.3479L24.2306 50.3528C15.0898 56.9405 2.85602 47.9938 6.36335 37.2862L7.37567 34.1958L4.85665 32.3803C-4.30965 25.7743 0.36352 11.2972 11.6622 11.2972H14.8763L15.9508 8.01663Z";

// Uniform scale so the shape's larger bounding dimension maps to `size`.
function shapeScale(shape: Shape, size: number): number {
  if (shape === "plus") return size / Math.max(PLUS_VIEWBOX.w, PLUS_VIEWBOX.h);
  if (shape === "flower")
    return size / Math.max(FLOWER_VIEWBOX.w, FLOWER_VIEWBOX.h);
  return 1;
}

const OUTCOME_COLOR: Record<string, string> = {
  accepted: "#C4F5FC",
  rejected: "#DB3A34",
  pending: "#BF9ACA",
};

// Manually authored, occasional field notes — newest entries go at the end
// of this list; display order is handled separately so it can be flipped.
interface FieldNote {
  date: string; // ISO yyyy-mm-dd
  text: string;
}
const FIELD_NOTES: FieldNote[] = [
  {
    date: "2026-08-10",
    text: "Learning that you can actually just message anyone. Way less scary than it seems.",
  },
  {
    date: "2026-08-11",
    text: "People would rather leave me pending than reject me.",
  },
  {
    date: "2026-08-11",
    text: "Felt unsure how small or big an ask had to be to add it to my list. Decided to add it no matter the size. Recently sent a lot of Instagram DMs for interviews for a project I am doing. Instead of combining all DMs into one ask, I have now expanded it so each has its own ask.",
  },
  {
    date: "2026-08-13",
    text: "It is kind of hard coming up with things to be rejected for.",
  },
  {
    date: "2026-09-13",
    text: "1000/12 = around 83. I have to make 83 asks a month! I am so behind...",
  },
  {
    date: "2026-09-13",
    text: "Very rewarding being accepted from asks I did not expect anything from.",
  },
];

// "2026-08-11" becomes "11-8-2026" — day first, no leading zero on the month.
function formatNoteDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${Number(day)}-${Number(month)}-${year}`;
}

interface RejectionRow {
  count: number;
  date: string;
  ask: string;
  category: string;
  fearlvl: number;
  outcome: string;
}

interface VizNode {
  row: RejectionRow;
  x: number;
  y: number;
  size: number;
  shape: Shape;
  color: string;
}

function clampFearLevel(value: number): number {
  if (!Number.isFinite(value)) return 2;
  return Math.min(3, Math.max(1, Math.round(value)));
}

// Only 3 fear levels now (1-3), so just 3 discrete node sizes with a subtle
// step between them rather than the wider pow-based spread used for 1-5.
function nodeSize(fearlvl: number): number {
  const base = 4;
  const step = 2;
  return base + (fearlvl - 1) * step;
}

export default function RejectionsJourneyPage() {
  const [rows, setRows] = useState<RejectionRow[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const hasDataRef = useRef(false);

  // view = { scale, x, y } maps raw spiral coordinates into the fixed
  // -500..500 viewBox: screenPoint = (x, y) + scale * (rawX, rawY). The
  // visualization is fixed in place — no panning — so x/y always stay 0 and
  // only scale (auto-fit to the current data) ever changes.
  const [view, setView] = useState({ scale: 1, x: 0, y: 0 });

  // Counts that have finished their one-time entrance settle (CSS-transitioned
  // from their random entrance offset back to their true spiral position).
  const [settledCounts, setSettledCounts] = useState<Set<number>>(new Set());

  const [notesNewestFirst, setNotesNewestFirst] = useState(true);
  const sortedFieldNotes = useMemo(() => {
    const sorted = [...FIELD_NOTES].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
    return notesNewestFirst ? sorted.reverse() : sorted;
  }, [notesNewestFirst]);

  const fetchData = useCallback(() => {
    // Google's published-CSV endpoint caches aggressively; bust it so
    // polling actually picks up new rows.
    const url = `${CSV_URL}&_=${Date.now()}`;

    Papa.parse<Record<string, string>>(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim().toLowerCase(),
      complete: (results) => {
        const parsed: RejectionRow[] = results.data
          .filter((r) => r.date || r.ask || r.count)
          .map((r, i) => ({
            count: parseInt(r.count, 10) || i,
            date: (r.date || "").trim(),
            ask: (r.ask || "").trim(),
            category: (r.category || "").trim().toLowerCase(),
            fearlvl: clampFearLevel(parseInt(r.fearlvl, 10)),
            outcome: (r.outcome || "").trim().toLowerCase(),
          }));

        parsed.sort((a, b) => a.count - b.count);

        hasDataRef.current = true;
        setRows(parsed);
        setStatus("ready");
        setErrorMessage("");
      },
      error: (err: Error) => {
        if (!hasDataRef.current) {
          setStatus("error");
          setErrorMessage(err.message || "Couldn't load the sheet.");
        } else {
          setErrorMessage("Couldn't refresh — showing the last loaded data.");
        }
      },
    });
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(() => fetchData(), REFRESH_INTERVAL_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  const nodes: VizNode[] = useMemo(
    () =>
      rows.map((row, idx) => {
        const angleRad = (idx * SPIRAL_ANGLE_STEP_DEG * Math.PI) / 180;
        const radius = SPIRAL_RADIUS_SCALE * Math.sqrt(idx);
        return {
          row,
          x: radius * Math.cos(angleRad),
          y: radius * Math.sin(angleRad),
          size: nodeSize(row.fearlvl),
          shape: CATEGORY_SHAPE[row.category] || DEFAULT_SHAPE,
          color: OUTCOME_COLOR[row.outcome] || OUTCOME_COLOR.pending,
        };
      }),
    [rows],
  );

  // Shortly after new rows appear, flip them to "settled" so their CSS
  // transition animates from the entrance offset back to (0, 0) — the one
  // "floats in, then stands still" motion. Uses a functional update so this
  // effect only needs to depend on `nodes`.
  useEffect(() => {
    const newCounts = nodes
      .map((n) => n.row.count)
      .filter((count) => !settledCounts.has(count));
    if (newCounts.length === 0) return;
    const id = requestAnimationFrame(() => {
      setSettledCounts((prev) => {
        const next = new Set(prev);
        newCounts.forEach((count) => next.add(count));
        return next;
      });
    });
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes]);

  // Per-node animated offset: just the entrance offset, decaying to 0 once
  // settled. Kept separate from the base `nodes` positions so autoFitScale
  // (below) doesn't jitter, and so shapes can apply the offset via a
  // CSS-transitioned style transform (only presentation-attribute
  // transforms don't animate; style ones do).
  const nodeOffsets = nodes.map((node) => {
    const isSettled = settledCounts.has(node.row.count);
    const entrance = isSettled
      ? { dx: 0, dy: 0 }
      : entranceOffset(floatSeed(node.row.count));
    return { dx: entrance.dx, dy: entrance.dy, isSettled };
  });

  const displayNodes: VizNode[] = nodes.map((node, i) => ({
    ...node,
    x: node.x + nodeOffsets[i].dx,
    y: node.y + nodeOffsets[i].dy,
  }));

  const curves: string[] = [];
  for (let i = 1; i < displayNodes.length; i++) {
    const prev = displayNodes[i - 1];
    const curr = displayNodes[i];
    curves.push(`M ${prev.x} ${prev.y} L ${curr.x} ${curr.y}`);
  }

  // Scale that fits all current nodes snugly inside the view — this is what
  // keeps the spiral "filled in" whether there are 5 points or 900.
  const autoFitScale = useMemo(() => {
    if (nodes.length === 0) return 1;
    let maxExtent = 0;
    for (const node of nodes) {
      const extent = Math.hypot(node.x, node.y) + node.size / 2;
      if (extent > maxExtent) maxExtent = extent;
    }
    return (VIEW_HALF * 0.88) / Math.max(maxExtent, 1);
  }, [nodes]);

  // Snap to the auto-fit view whenever the data changes.
  useEffect(() => {
    setView({ scale: autoFitScale, x: 0, y: 0 });
  }, [autoFitScale]);

  const totalAsks = rows.length;
  // Date of the most recent row in the sheet itself (last ask logged),
  // rather than when this page last polled — reflects when I actually
  // updated the sheet.
  const lastEntryDate = rows.length > 0 ? rows[rows.length - 1].date : "";

  const chapters: ArticleChapter[] = [
    {
      // What the experiment is, before the piece that tracks it. Marked full so
      // it shows no heading — it is the article's opening, not a section of it
      // — and so it does not take a turn in the left/right alternation, which
      // leaves the visualization below on the left with its key beside it.
      id: "premise",
      label: "the experiment",
      full: true,
      // Held to the width of the text column in the chapters below, so the
      // opening reads at the same measure as the rest of the article rather
      // than running the full 1266 of the page.
      content: (
        <div className="max-w-[828px] space-y-4">
          <p>
            Through Instagram, I discovered a girl trying to get rejected 1000
            times. What she found was not rejection, but opportunities. I am
            doing the same experiment from June 2026 to June 2027.
          </p>
          <p>
            <strong>To get rejected, I have to make asks.</strong> An ask
            includes everything from job and internship applications, to asking
            someone I admire for coffee, to signing up for something crazy.
          </p>
          <p>
            This visualization updates every time I make an ask, showing whether
            I was accepted, rejected, or am still pending a response. It also
            shows how much fear I felt making each ask, and which area of my
            life it belonged to.
          </p>
        </div>
      ),
    },
    {
      id: "viz",
      label: "live data visualization",
      // The spiral is the one thing on the page worth the full 1266, so it gets
      // the whole width to itself with the key in the margin beside it. Full-
      // width chapters hide their heading by default; this one keeps it, since
      // it is a section of the article and not a picture belonging to the
      // section above.
      full: true,
      showLabel: true,
      content: (
        <>
          {/* The spiral held to the right of the chapter with the reading and
              the key in the space left beside it. Only from 1328, where the
              page is at its full 1266 and there is room for both; below that
              the two stack and the key falls under the spiral.

              Pulled up a heading's worth so the top of the spiral lands level
              with "live data visualization", the way a picture does against
              its chapter heading. 38 is that heading's 22px line and the 16px
              gap-y-4 the chapter's rows sit apart. The left-hand column pads
              the same amount back on, so only the spiral rises and the reading
              still starts below the heading rather than beside it. */}
          <div className="grid gap-8 min-[1328px]:-mt-[38px] min-[1328px]:grid-cols-[minmax(0,1fr)_700px]">
            {/* Kept square: the SVG's own viewBox keeps the spiral circular and
                centred whatever the column's width, so it scales to fit rather
                than forcing the page sideways. Capped rather than filling the
                chapter — a square drawn at the page's whole 1266 is taller than
                the window, so the spiral could never be seen whole. */}
            <div className="relative mx-auto aspect-square w-full max-w-[700px] min-[1328px]:col-start-2 min-[1328px]:row-start-1">
              {status === "loading" && (
                <div className="flex h-full w-full items-center justify-center border-2 border-black/10">
                  <p className="font-mono text-foreground/60">
                    Loading rejections…
                  </p>
                </div>
              )}

              {status === "error" && (
                <div className="flex h-full w-full flex-col items-center justify-center gap-4 border-2 border-black/10 px-6 text-center">
                  <p className="font-mono text-foreground/70">
                    Couldn&apos;t load the sheet. {errorMessage}
                  </p>
                  <button
                    type="button"
                    onClick={() => fetchData()}
                    className="border-2 border-black px-3 py-1.5 text-black transition-colors duration-200 hover:border-[#ED2E85] hover:text-[#ED2E85]"
                  >
                    Try again
                  </button>
                </div>
              )}

              {status === "ready" && rows.length === 0 && (
                <div className="flex h-full w-full items-center justify-center border-2 border-black/10">
                  <p className="font-mono text-foreground/60">
                    No asks logged yet — check back soon.
                  </p>
                </div>
              )}

              {status === "ready" && rows.length > 0 && (
                <div className="h-full w-full select-none">
                  <svg
                    viewBox={`-${VIEW_HALF} -${VIEW_HALF} ${VIEW_HALF * 2} ${VIEW_HALF * 2}`}
                    className="h-full w-full"
                    role="img"
                    aria-label="Spiral visualization of rejection tracking data"
                  >
                    <defs>
                      {/* Divide by view.scale so the blur stays a flat
                        FIGURE_BLUR_PX on screen regardless of node size or how
                        far autoFitScale has zoomed out for a bigger dataset. */}
                      <filter
                        id="figure-blur"
                        x="-80%"
                        y="-80%"
                        width="260%"
                        height="260%"
                      >
                        <feGaussianBlur
                          stdDeviation={FIGURE_BLUR_PX / view.scale}
                        />
                      </filter>
                    </defs>
                    <g
                      transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}
                    >
                      <g
                        fill="none"
                        stroke="#1B1B1B"
                        strokeOpacity={0.15}
                        strokeWidth={1.5 / view.scale}
                        strokeDasharray={`${4 / view.scale} ${3 / view.scale}`}
                      >
                        {curves.map((d, i) => (
                          <path key={i} d={d} />
                        ))}
                      </g>
                      <g filter="url(#figure-blur)">
                        {nodes.map((node, i) => {
                          const offset = nodeOffsets[i];
                          const animStyle = nodeAnimStyle(
                            offset,
                            floatSeed(node.row.count),
                          );

                          if (node.shape === "plus") {
                            const s = shapeScale("plus", node.size);
                            return (
                              <g
                                key={node.row.count}
                                transform={`translate(${node.x} ${node.y})`}
                              >
                                <g style={animStyle}>
                                  <path
                                    d={PLUS_PATH}
                                    fill={node.color}
                                    transform={`scale(${s}) translate(${-PLUS_VIEWBOX.w / 2} ${-PLUS_VIEWBOX.h / 2})`}
                                  />
                                </g>
                              </g>
                            );
                          }
                          if (node.shape === "flower") {
                            const s = shapeScale("flower", node.size);
                            return (
                              <g
                                key={node.row.count}
                                transform={`translate(${node.x} ${node.y})`}
                              >
                                <g style={animStyle}>
                                  <path
                                    d={FLOWER_PATH}
                                    fill={node.color}
                                    transform={`scale(${s}) translate(${-FLOWER_VIEWBOX.w / 2} ${-FLOWER_VIEWBOX.h / 2})`}
                                  />
                                </g>
                              </g>
                            );
                          }
                          return (
                            <g
                              key={node.row.count}
                              transform={`translate(${node.x} ${node.y})`}
                            >
                              <g style={animStyle}>
                                <circle
                                  cx={0}
                                  cy={0}
                                  r={node.size / 2}
                                  fill={node.color}
                                />
                              </g>
                            </g>
                          );
                        })}
                      </g>
                      {/* Small unblurred black core dot, like a normal node's center. */}
                      <g fill="#1B1B1B">
                        {nodes.map((node, i) => {
                          const offset = nodeOffsets[i];
                          const dotStyle = nodeAnimStyle(
                            offset,
                            floatSeed(node.row.count),
                          );
                          return (
                            <g
                              key={node.row.count}
                              transform={`translate(${node.x} ${node.y})`}
                            >
                              <g style={dotStyle}>
                                <circle
                                  cx={0}
                                  cy={0}
                                  r={Math.max(0.5, node.size * 0.08)}
                                />
                              </g>
                            </g>
                          );
                        })}
                      </g>
                    </g>
                  </svg>
                </div>
              )}
            </div>

            {/* The key, set in the margin beside the spiral so it can be read
                against the thing it describes. Ranged left — the chapter
                justifies its prose, which would tear holes in lines this
                short. Centred against the drawing rather than hung from the
                top, which against a circle reads as stranded. */}
            <div className="space-y-4 text-left min-[1328px]:col-start-1 min-[1328px]:row-start-1 min-[1328px]:self-start min-[1328px]:pt-[38px]">
              {/* Two separate children, not a stacked pair, so the column's
                  own spacing sets them a line apart. */}
              <p className="text-[#ED2E85]">{totalAsks} asks made so far</p>
              {lastEntryDate && (
                <p className="text-foreground/50">
                  Last updated {lastEntryDate}
                </p>
              )}

              {errorMessage && rows.length > 0 && (
                <p className="text-[#D6473C]">{errorMessage}</p>
              )}

              <div>
                <p className="mb-2">Shape = category</p>
                <div className="flex flex-col gap-1.5">
                  <LegendRow>
                    <LegendShapeIcon shape="plus" />
                    professional
                  </LegendRow>
                  <LegendRow>
                    <LegendShapeIcon shape="flower" />
                    personal
                  </LegendRow>
                  <LegendRow>
                    <LegendShapeIcon shape="circle" />
                    random
                  </LegendRow>
                </div>
              </div>

              <div>
                <p className="mb-2">Color = outcome</p>
                <div className="flex flex-col gap-1.5">
                  <LegendRow>
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: OUTCOME_COLOR.accepted }}
                    />
                    accepted
                  </LegendRow>
                  <LegendRow>
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: OUTCOME_COLOR.rejected }}
                    />
                    rejected
                  </LegendRow>
                  <LegendRow>
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full"
                      style={{ backgroundColor: OUTCOME_COLOR.pending }}
                    />
                    pending
                  </LegendRow>
                </div>
              </div>

              <div>
                <p className="mb-2">Size = fear level</p>
                <p className="text-foreground/60">
                  Bigger nodes are asks that felt scarier to make (1&ndash;3).
                </p>
              </div>

              <div>
                <p className="mb-2">Position = sequence of asks</p>
                <p className="text-foreground/60">
                  Each ask spirals outward from the center. #1 sits at the
                  middle, and the spiral grows as the count goes up.
                </p>
              </div>
            </div>
          </div>
        </>
      ),
    },
    {
      id: "notes",
      label: "field notes",
      content: (
        <>
          <p>
            Besides the data visualization, I am collecting field notes on the
            go. These are my thoughts, realizations, struggles, and learnings
            from the experiment.
          </p>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setNotesNewestFirst((prev) => !prev)}
              title={
                notesNewestFirst
                  ? "Showing newest first"
                  : "Showing oldest first"
              }
              aria-label="Toggle notes order"
              className="border-2 border-black/10 p-1.5 text-black transition-colors duration-200 hover:border-[#ED2E85] hover:text-[#ED2E85]"
            >
              <SortArrowsIcon />
            </button>
          </div>

          {/* Four notes deep, then it scrolls, so the list stays a panel beside
              the article instead of growing without end as notes are added.
              The height is four short cards and the gaps between them; a long
              note naturally shows fewer. */}
          <div className="flex max-h-[380px] flex-col gap-3 overflow-y-auto pr-2">
            {sortedFieldNotes.map((note, i) => (
              <div
                key={`${note.date}-${i}`}
                className="border-2 border-black/10 p-4"
              >
                <p className="mb-1.5 text-foreground/50">
                  {formatNoteDate(note.date)}
                </p>
                <p>{note.text}</p>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      id: "process",
      label: "design process",
      content: (
        <>
          <p>
            The design process for this data visualization was rather simple. I
            wanted to visualize my journey in a simple but aesthetic way,
            illustrating the concepts of time, fear, and outcome. The images
            show my honest sketching, where I was playing with what the
            different elements should represent. Category came later, while
            coding assisted by Claude Code.
          </p>
        </>
      ),
    },
    {
      // The sketches are what the process came out as, so they follow it at the
      // page's full width instead of shrinking into the picture column beside
      // the paragraph that describes them.
      id: "process-artefacts",
      label: "sketches and visual references",
      full: true,
      content: (
        // The sketch in one column and the two references stacked flush in the
        // other, so the pair reads as one picture with one caption.
        //
        // The column widths are not a choice: they are what makes the stack
        // come out exactly as tall as the sketch beside it. The sketch is 1.130
        // wide to 1 tall and the two references 1:1 and 0.728:1, so at column
        // widths a and b the two heights are a/1.130 and b(1/1 + 1/0.728) =
        // 2.374b. Setting those equal gives a = 2.68b, which is the ratio the
        // two fr units are in. items-start, so the shorter column is not
        // stretched to the taller if the caption lengths differ.
        <div className="grid items-start gap-8 min-[768px]:grid-cols-[2.68fr_1fr]">
          <figure>
            <Image
              src={h1Image}
              alt="Sketches working out what each element of the visualization should represent"
              className="block h-auto w-full"
            />
            <ImageCaption>
              My sketching, working out what time, fear and outcome should look
              like.
            </ImageCaption>
          </figure>

          <figure>
            <a
              href="https://dk.pinterest.com/pin/787918897354920626/"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden"
            >
              <Image
                src={h2Image}
                alt="Visual reference collected while sketching (opens on Pinterest)"
                className="block h-auto w-full"
              />
            </a>
            <a
              href="https://dk.pinterest.com/pin/787918897354920072/"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden"
            >
              <Image
                src={h3Image}
                alt="Visual reference collected while sketching (opens on Pinterest)"
                className="block h-auto w-full"
              />
            </a>
            <ImageCaption>
              The references I drew it against, found{" "}
              <CaptionLink href="https://dk.pinterest.com/pin/787918897354920626/">
                here
              </CaptionLink>{" "}
              and{" "}
              <CaptionLink href="https://dk.pinterest.com/pin/787918897354920072/">
                here
              </CaptionLink>
              .
            </ImageCaption>
          </figure>
        </div>
      ),
    },
  ];

  // Same two lines as this project's card on the front page, so arriving from
  // the grid the heading does not change wording under you.
  return (
    <ArticleColumn
      title="1000 rejections"
      year="2026-2027"
      chapters={chapters}
    />
  );
}

function LegendRow({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2">{children}</div>;
}

// What a picture is, set under it. Greyed and ranged left, so it reads as a
// note on the picture rather than as another line of the article.
function ImageCaption({ children }: { children: React.ReactNode }) {
  return (
    <figcaption className="mt-3 text-left text-foreground/50">
      {children}
    </figcaption>
  );
}

// A source credited inside a caption. Underlined, since a caption is already
// grey and a colour change alone would not read as a link there.
function CaptionLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 transition-colors duration-200 hover:text-[#ED2E85]"
    >
      {children}
    </a>
  );
}

// Two small arrows (one up, one down) indicating the notes list can be
// flipped between newest-first and oldest-first.
function SortArrowsIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 10.5V2M4 2L1.5 4.5M4 2L6.5 4.5" />
      <path d="M10 3.5V12M10 12L7.5 9.5M10 12L12.5 9.5" />
    </svg>
  );
}

function LegendShapeIcon({ shape }: { shape: Shape }) {
  if (shape === "plus") {
    const s = shapeScale("plus", 14);
    return (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d={PLUS_PATH}
          fill="#1B1B1B"
          transform={`translate(7 7) scale(${s}) translate(${-PLUS_VIEWBOX.w / 2} ${-PLUS_VIEWBOX.h / 2})`}
        />
      </svg>
    );
  }
  if (shape === "flower") {
    const s = shapeScale("flower", 14);
    return (
      <svg width="14" height="14" viewBox="0 0 14 14">
        <path
          d={FLOWER_PATH}
          fill="#1B1B1B"
          transform={`translate(7 7) scale(${s}) translate(${-FLOWER_VIEWBOX.w / 2} ${-FLOWER_VIEWBOX.h / 2})`}
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="6" fill="#1B1B1B" />
    </svg>
  );
}
