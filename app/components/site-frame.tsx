"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import PageNav from "@/app/components/page-nav";
import BioBlock from "@/app/components/bio-block";
import ContactBlock from "@/app/components/contact-block";
import HorizontalPageSwipe from "@/app/components/horizontal-page-swipe";

// Shared "frame" for the site's main pages (project grid, art grid, and
// eventually about me): fixed home flower, top nav aligned with the content
// column, a fixed name/bio sidebar, and socials pinned to the bottom-left
// corner. Only the right-hand content (passed as children) differs per page.
// The page container shrink-wraps its content rather than filling the window:
// its two widths are exactly the sidebar + gap + one card, and the same + two
// cards. Because it is mx-auto and exactly that wide, the bio and the projects
// centre on screen as one block and the gap between them is always the same
// 64px — no column ever absorbs the leftover width. Every fixed element uses
// this same container, so they stay aligned with the content column.
// 844 = 32 padding + 288 sidebar + 64 gap + 460 card.
// 1328 = the same with two cards (944).
const CONTAINER =
  "mx-auto w-full max-w-[844px] min-[1328px]:max-w-[1328px] px-4";

export default function SiteFrame({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  // Measure the header's real rendered height so the fixed sidebar can start
  // at exactly the same "roof" as the main content below it, instead of a
  // guessed offset.
  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateHeight = () => {
      // The header's own height isn't enough: below xl the flower sits in the
      // flow above it, so the content's real "roof" is the header's bottom
      // edge in page coordinates, not its height.
      const bottom =
        headerEl.getBoundingClientRect().bottom + window.scrollY;
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

      {/* From sm up FlowerLink pins itself to the viewport's top-left, so this
          header row holds only the filter and nothing below it moves as the
          window resizes. On phone the flower is in the flow instead (it should
          scroll away with the page), and it shares this row with the filter
          rather than taking one of its own. The row is the flower's own 55px
          height and both ends sit on its baseline, so the bottom of the flower
          lines up with the bottom of the filter pills. */}
      <header ref={headerRef} className={`${CONTAINER} pt-4 pb-6 sm:pt-12`}>
        {/* Stacked: the filter is right-aligned to the content column below it
            (the bio and cards, capped at a card's width and centred), not to
            the window, so it stays flush with their right edge as the window
            widens. From lg the column is offset by the sidebar + its gap
            instead, putting the filter directly above the projects. Its fixed
            height keeps the header identical in both, so the filter never
            moves down — only across, and only when the bio does. */}
        <div className="mx-auto flex h-[55px] w-full max-w-[460px] flex-row items-end justify-between sm:items-center sm:justify-end lg:mx-0 lg:max-w-none lg:justify-start lg:pl-[352px]">
          <FlowerLink />
          <PageNav />
        </div>
      </header>

      <main className={`${CONTAINER} pb-16`}>
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
          {/* Bio in the stacked layout — the lg version is rendered fixed
              below. Capped to a card's width so the justified word rows never
              stretch wider than the projects sitting underneath them. */}
          <div className="lg:hidden w-full max-w-[460px] mx-auto shrink-0">
            <BioBlock />
          </div>

          {/* Spacer preserving the sidebar's width in the layout on desktop */}
          <div className="hidden lg:block lg:w-72 shrink-0" />

          {/* Page content */}
          <div className="min-w-0">{children}</div>
        </div>

        {/* Internship note + socials: part of normal page flow when stacked,
            sitting at the very bottom instead of pinned over the content. */}
        <div className="lg:hidden flex flex-col gap-3 mt-10 w-full max-w-[460px] mx-auto">
          <ContactBlock />
        </div>
      </main>

      {/* Sidebar: name, bio — fixed to the viewport on desktop, never moves on
          scroll, starting level with the top of the main content. */}
      <div
        className="hidden lg:block fixed inset-x-0 pointer-events-none z-30"
        style={{ top: "var(--header-height, 5.5rem)" }}
      >
        <div className={CONTAINER}>
          <div className="w-72 pointer-events-auto">
            <BioBlock />
          </div>
        </div>
      </div>

      {/* Internship note + socials — fixed to the viewport on desktop, aligned
          to the same left margin as the bio sidebar and the main content column. */}
      <div className="hidden lg:block fixed inset-x-0 bottom-16 z-40 pointer-events-none">
        <div className={CONTAINER}>
          <div className="w-72 pointer-events-auto flex flex-col gap-3">
            <ContactBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
