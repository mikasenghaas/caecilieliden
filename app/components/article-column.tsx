"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import CustomCursor from "@/app/components/custom-cursor";
import FlowerLink from "@/app/components/flower-link";

export interface ArticleChapter {
  id: string;
  label: string;
  content: ReactNode;
  // What sits in the narrower column beside the text — pictures, nearly
  // always. A chapter without any is simply text against white.
  media?: ReactNode;
  // Centres the picture column against the text instead of hanging it from the
  // top. For a chapter whose text column is one tall thing rather than prose —
  // a full-height visualization, say — where a short column beside it reads as
  // stranded at the top rather than as the start of a run.
  centerMedia?: boolean;
  // Runs the chapter across the full width of the page instead of splitting it
  // into a text column and a picture column. For a chapter that is one thing
  // rather than prose with pictures beside it — a video, say, which is worth
  // more at the page's full measure than at two thirds of it. Such a chapter
  // has no picture column, so `media` is ignored, and it shows no heading:
  // the one thing in it speaks for itself. `label` is still required, and is
  // what a screen reader announces for the section.
  full?: boolean;
}

// The same side margins as the front page, so a project opens into the same
// frame it was clicked out of. This is the container SiteFrame uses, verbatim
// — including the 87px padding that leaves the pinned flower equal white space
// on either side. See the comment there for where the numbers come from.
const CONTAINER =
  "mx-auto w-full max-w-[844px] px-4 min-[1024px]:max-w-[986px] min-[1024px]:px-[87px] min-[1328px]:max-w-[1440px]";

// The article alternates: text left, then text right, then left again. The text
// always takes the wider of the two columns, so the split turns over with it
// rather than the text moving into a narrow column every other chapter.
//
// 390 is the picture column's width in the design file, and it is pinned there
// once the container reaches its wide size: a ratio would keep scaling the
// pictures up with the window, and the pictures are meant to stay the smaller
// of the pair. The text takes everything else, so the pair stays a normal
// gutter apart instead of the row's spare width opening up between them.
// Below that the container is too narrow to hold both at full size, so a 62:38
// ratio takes over and they shrink together, text still the wider.
// Both breakpoints are written as arbitrary min-widths rather than one named
// and one arbitrary, so Tailwind sorts them by their number and the wider one
// really does land after — with `md:` the named variant was emitted last and
// the ratio kept overriding the pixel widths at every size.
const TEXT_LEFT =
  "min-[768px]:grid-cols-[minmax(0,62fr)_minmax(0,38fr)] min-[1328px]:grid-cols-[minmax(0,1fr)_390px]";
const TEXT_RIGHT =
  "min-[768px]:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] min-[1328px]:grid-cols-[390px_minmax(0,1fr)]";

// The order of the project grid on the front page, which is the order "next
// project" walks. It wraps at the end rather than dead-ending.
const PROJECT_ORDER = [
  "/projects/co-design-ai-acute-health",
  "/projects/led-installation-strangers-transit",
  "/projects/1000-rejections-journey-creative-data-viz",
  "/projects/codesign-project",
];

// Half the h-9 (36px) pill height, so each end is a true half-circle. Same as
// the front-page filter.
const CAP_WIDTH = 18;

// A photo is just the photo: nothing is drawn over it, at rest or on hover.
// The description lives in `alt`, where a screen reader can reach it.
//
// Photos run the full width of their column and are given a shape rather than a
// height, so nothing below them moves as they load. `contain` is for the few
// whose subject reaches the edges and must not be cropped; the leftover fills
// with white. `align` decides which part of a cropped photo survives — the
// default keeps the middle, and naming an edge is how a picture with dead space
// or a stray rule along one side is trimmed without editing the file.
export function ArticleFigure({
  src,
  alt,
  contain = false,
  ratio = "aspect-[3/2]",
  align = "object-center",
  sizes = "(max-width: 768px) 100vw, 390px",
}: {
  src: React.ComponentProps<typeof Image>["src"];
  alt: string;
  contain?: boolean;
  ratio?: string;
  align?: string;
  // The default describes the picture column, which is where a figure nearly
  // always sits. A figure in a full-width chapter is three times that wide, and
  // would be fetched at the column's resolution and upscaled without saying so.
  sizes?: string;
}) {
  return (
    <div className={`relative w-full overflow-hidden bg-white ${ratio}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`${contain ? "object-contain" : "object-cover"} ${align}`}
      />
    </div>
  );
}

// A heading inside a chapter — "focus groups" under "design events". Set in the
// same small caps as the chapter heading above it but at normal weight, so the
// two never read as the same rank.
export function ArticleSubheading({ children }: { children: ReactNode }) {
  return (
    // The space above a subheading separates it from the run of text before
    // it, so the one that opens a chapter does not want it — with the padding
    // it started 16px lower than the picture beside it, which is the one place
    // the two columns are meant to line up exactly.
    <h3 className="pt-4 text-[15px] uppercase tracking-[0.08em] first:pt-0">
      {children}
    </h3>
  );
}

export default function ArticleColumn({
  title,
  year,
  chapters,
}: {
  title: ReactNode;
  year: string;
  chapters: ArticleChapter[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);

  const currentProject = Math.max(PROJECT_ORDER.indexOf(pathname), 0);
  const total = PROJECT_ORDER.length;
  const nextProject = PROJECT_ORDER[(currentProject + 1) % total];
  const previousProject = PROJECT_ORDER[(currentProject - 1 + total) % total];

  // Which side each chapter's text falls on. Counted over the chapters that
  // actually have two columns, so a full-width one in the middle does not turn
  // the alternation over — without this the chapters either side of it would
  // both land left, and the turn-taking that carries the eye down the page
  // would break exactly where the page is widest.
  let column = 0;
  const textOnLeft = chapters.map((chapter) =>
    chapter.full ? null : column++ % 2 === 0,
  );

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, chapters.length - 1));
      chapterRefs.current[clamped]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    },
    [chapters.length],
  );

  // Which chapter the reader is in, taken from the page rather than from the
  // last key they pressed, so an arrow after a plain scroll steps on from where
  // they actually are. The margins shrink the observed strip to a line a third
  // of the way down the window: the chapter crossing that line is the current
  // one, and a chapter taller than the screen still counts while it fills it.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = chapterRefs.current.indexOf(
            entry.target as HTMLElement,
          );
          if (index !== -1) setActiveIndex(index);
        });
      },
      { rootMargin: "-33% 0px -66% 0px" },
    );

    chapterRefs.current
      .filter((element): element is HTMLElement => element !== null)
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [chapters.length]);

  // The two axes carry the two scales of the site: down and up move a whole
  // chapter at a time rather than a few lines, so the vertical arrows walk this
  // article's structure, while left and right leave it for the neighbouring
  // project — the same walk the "next project" button takes, and wrapping the
  // same way. Chapters clamp at the ends, since one article is read in order.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }

      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goTo(activeIndex + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goTo(activeIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        router.push(nextProject);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        router.push(previousProject);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, goTo, router, nextProject, previousProject]);

  return (
    <>
      <style>{`html, body { background-color: #FFFFFF !important; }`}</style>
      <CustomCursor />

      <div className="min-h-screen bg-white text-foreground">
        {/* The flower pins itself to the viewport, so this is just the empty
            row it occupies — kept below lg so it does not crowd the title, and
            collapsed from lg up, where the flower has always been out of the
            flow. */}
        <div className="h-[71px] lg:h-0">
          <FlowerLink />
        </div>

        {/* 16/22 is exactly the front-page card's type, so a project reads at
            the same size as the card it was opened from. */}
        <main
          className={`${CONTAINER} pb-24 pt-10 text-[16px] leading-[22px] lg:pt-20`}
        >
          {/* The title is set like the bio on the front page — Plex Sans,
              light, italic — and held to a narrow measure so it stacks into a
              few short lines above the article instead of running the full
              width of the page. */}
          <header className="mb-8 max-w-[40rem]">
            <h1 className="text-[38px] font-light italic leading-[1.18]">
              {title}
            </h1>
            <p className="mt-2 font-light text-foreground/60">{year}</p>
          </header>

          {chapters.map((chapter, index) => {
            const left = textOnLeft[index];

            return (
              <section
                key={chapter.id}
                id={chapter.id}
                ref={(element) => {
                  chapterRefs.current[index] = element;
                }}
                aria-label={chapter.label}
                // Jumped to by the arrow keys, so it needs to come to rest
                // below the top of the window rather than against it.
                className="scroll-mt-16 [&:not(:last-child)]:mb-20"
              >
                {/* Two rows, not one: the heading has the first to itself and
                    both columns start in the second. That is what puts the top
                    of the first picture level with the first line of prose
                    rather than with the heading above it, and it holds however
                    tall the heading turns out to be — a wrapped one pushes both
                    columns down together. A full-width chapter keeps the single
                    column it already has at every width. */}
                <div
                  className={`grid grid-cols-1 gap-x-12 gap-y-4 ${
                    left === null ? "" : left ? TEXT_LEFT : TEXT_RIGHT
                  }`}
                >
                  {left !== null && (
                    <h2
                      className={`text-[15px] font-bold uppercase tracking-[0.08em] ${
                        left ? "" : "min-[768px]:col-start-2"
                      }`}
                    >
                      {chapter.label}
                    </h2>
                  )}

                  <div
                    // Justified, so both edges of the column are flush and each
                    // chapter reads as a square block of text. hyphens-auto is
                    // what keeps that from tearing holes in a line: without it
                    // a long word wraps whole and the words left behind stretch
                    // to fill the gap.
                    className={`space-y-4 text-justify hyphens-auto ${
                      left === null
                        ? ""
                        : `min-[768px]:row-start-2 ${
                            left
                              ? "min-[768px]:col-start-1"
                              : "min-[768px]:col-start-2"
                          }`
                    }`}
                  >
                    {chapter.content}
                  </div>

                  {/* Second row, like the text: the pictures start level with
                      the chapter's first line of prose, not with the heading
                      above it. Held to the top of that row rather than
                      stretched down it, so a short run of pictures sits beside
                      the start of the text instead of spreading to match its
                      height. */}
                  {left !== null && (
                    <div
                      className={`mt-4 space-y-8 min-[768px]:mt-0 min-[768px]:row-start-2 ${
                        chapter.centerMedia ? "self-center" : "self-start"
                      } ${
                        left
                          ? "min-[768px]:col-start-2"
                          : "min-[768px]:col-start-1"
                      }`}
                    >
                      {chapter.media}
                    </div>
                  )}
                </div>
              </section>
            );
          })}

          {/* The way out of the article, in the corner the eye ends up in. */}
          <div className="mt-24 flex justify-end">
            <Link href={nextProject} className="block h-9">
              <span
                style={{ borderRadius: CAP_WIDTH, paddingInline: CAP_WIDTH }}
                className="group flex h-9 items-center border border-black bg-white transition-colors duration-200 hover:border-[#ED2E85]"
              >
                <span className="whitespace-nowrap font-mono text-[14px] transition-colors duration-200 group-hover:text-[#ED2E85]">
                  next project &rarr;
                </span>
              </span>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
