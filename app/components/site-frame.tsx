"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import PageNav from "@/app/components/page-nav";
import BioBlock from "@/app/components/bio-block";
import ContactBlock, {
  InternshipNote,
  SocialLinks,
} from "@/app/components/contact-block";
import HorizontalPageSwipe from "@/app/components/horizontal-page-swipe";

// Shared "frame" for the site's main pages (project grid, art grid, and
// eventually about me): fixed home flower, top nav aligned with the content
// column, a fixed name/bio sidebar, and socials pinned to the bottom-left
// corner. Only the right-hand content (passed as children) differs per page.
// The page container shrink-wraps its content rather than filling the window:
// its two widths are exactly the sidebar + gap + one card, and the same + a
// wide card. Because it is mx-auto and exactly that wide, the bio and the
// projects centre on screen as one block and the gap between them is fixed —
// no column ever absorbs the leftover width. Every fixed element uses this
// same container, so they stay aligned with the content column.
//
// The side padding is 87px from lg up, which is where the flower stops
// scrolling with the page and pins itself to the viewport's corner. 87 is
// 16 + 55 + 16: the flower's own offset, the flower, and the same offset
// again, so it sits in the margin with equal white space on either side
// instead of the content starting flush against it. Below lg the flower is
// in the flow at the top of the page and needs no room beside it, so the
// padding stays 16 and small windows keep their width.
//
// 986  = 174 padding + 288 sidebar + 64 gap + 460 card.
// 1440 = 174 padding + 288 sidebar + 34 gap + 944 wide card. The gap is the
// narrower of the two there because that is what buys the wide card its 944
// back out of the width the bigger margins take.
const CONTAINER =
  "mx-auto w-full max-w-[844px] px-4 min-[1024px]:max-w-[986px] min-[1024px]:px-[87px] min-[1328px]:max-w-[1440px]";

export default function SiteFrame({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  // Measure the header's real rendered height so the fixed sidebar can start
  // at exactly the same "roof" as the main content below it, instead of a
  // guessed offset.
  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateHeight = () => {
      // The bottom edge in page coordinates rather than the height, so
      // anything sitting above the header is counted in too.
      const bottom = headerEl.getBoundingClientRect().bottom + window.scrollY;
      document.documentElement.style.setProperty(
        "--header-height",
        `${bottom}px`,
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerEl);
    // Crossing the xl breakpoint moves the flower out of the flow, shifting
    // the header without resizing it.
    window.addEventListener("resize", updateHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CustomCursor />
      <HorizontalPageSwipe />

      {/* FlowerLink pins itself to the viewport's top-left, so it is not part
          of this row and nothing here can move it. The header itself holds
          only the filter. */}
      <FlowerLink />

      <header ref={headerRef} className={`${CONTAINER} pt-4 pb-6 sm:pt-12`}>
        {/* Stacked: the filter is right-aligned to the content column below it
            (the bio and cards, capped at a card's width and centred), not to
            the window, so it stays flush with their right edge as the window
            widens. From lg the column is offset by the sidebar + its gap
            instead, putting the filter directly above the projects. The row
            keeps the flower's 55px as a minimum so the header is identical in
            both, but may grow if the pills wrap on a narrow window. */}
        {/* The left padding is the sidebar plus the gap beside it, so the
            filter starts exactly above the projects. Both are written as
            arbitrary min-widths rather than one named and one arbitrary, so
            Tailwind sorts them by number and the wider one really does land
            last — the gap narrows at 1328 and this has to follow it. */}
        <div className="mx-auto flex min-h-[55px] w-full max-w-[460px] flex-row items-end justify-between gap-3 sm:items-center sm:justify-end lg:mx-0 lg:max-w-none lg:justify-start min-[1024px]:pl-[352px] min-[1328px]:pl-[322px]">
          {/* Below sm the flower overlaps this row, so the filter is held
              clear of it. Above sm the row is right-aligned and the two never
              meet. */}
          <div aria-hidden className="size-[55px] shrink-0 sm:hidden" />
          <PageNav />
        </div>
      </header>

      <main className={`${CONTAINER} pb-16`}>
        <div className="flex flex-col lg:flex-row gap-10 min-[1024px]:gap-16 min-[1328px]:gap-[34px]">
          {/* Bio in the stacked layout — the lg version is rendered fixed
              below. Capped to a card's width so the justified word rows never
              stretch wider than the projects sitting underneath them. */}
          <div className="lg:hidden w-full max-w-[460px] mx-auto shrink-0">
            <BioBlock />
          </div>

          {/* Spacer preserving the sidebar's width in the layout on desktop */}
          <div className="hidden lg:block lg:w-72 shrink-0" />

          {/* Page content. lg:flex-1 is load-bearing: without it this column
              is shrink-to-fit, so its width is whatever its contents claim.
              The art grid claims nothing until its images have laid out, which
              collapsed the column to just its own column gaps — everything
              inside rendered a few pixels wide and then sprang out to full
              size once the pictures arrived. Growing into the row's leftover
              space instead makes the width a fact of the layout, known on the
              first frame and independent of what is inside.

              A query container, so the project cards can switch shape on how
              much room they have actually been given rather than on the window
              width. The two are not the same number: a classic scrollbar is
              part of the window but not of the page, so at a window of 1328 to
              1342 the media query said "wide" while the column was still a few
              pixels short of the 944 a wide card needs. The card took the
              leftover width instead, and since its text does not scale with
              it, words dropped between lines for that whole stretch. */}
          <div className="@container min-w-0 lg:flex-1">{children}</div>
        </div>

        {/* Internship note + socials: part of normal page flow when stacked,
            sitting at the very bottom instead of pinned over the content. */}
        <div className="lg:hidden flex flex-col gap-3 mt-10 w-full max-w-[460px] mx-auto">
          <ContactBlock />
        </div>
      </main>

      {/* Sidebar: one fixed column running from the top of the main content
          down to the bottom margin, holding its three pieces spread evenly
          apart — bio at the top, socials at the foot, and the internship note
          sitting midway between them rather than bunched up against the
          socials. Pinned to the viewport, so it never moves on scroll. */}
      <div
        className="hidden lg:flex fixed inset-x-0 bottom-16 z-30 pointer-events-none"
        style={{ top: "var(--header-height, 5.5rem)" }}
      >
        <div className={`${CONTAINER} flex`}>
          <div className="w-72 pointer-events-auto flex flex-col justify-between">
            <BioBlock />
            <InternshipNote />
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
