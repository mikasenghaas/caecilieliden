"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import PageNav from "@/app/components/page-nav";
import Footer from "@/app/components/footer";
import HorizontalPageSwipe from "@/app/components/horizontal-page-swipe";

// Shared "frame" for the site's main pages (project grid, art grid, and
// eventually about me): fixed home flower, top nav aligned with the content
// column, a fixed name/bio sidebar, and socials pinned to the bottom-left
// corner. Only the right-hand content (passed as children) differs per page.
export default function SiteFrame({ children }: { children: ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  // Measure the header's real rendered height so the fixed sidebar can start
  // at exactly the same "roof" as the main content below it, instead of a
  // guessed offset.
  useLayoutEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${headerEl.offsetHeight}px`
      );
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <CustomCursor />
      <HorizontalPageSwipe />

      {/* On tablet/desktop, the flower renders on its own row above the
          header, same as it always has. */}
      <div className="hidden sm:block">
        <FlowerLink />
      </div>

      <header
        ref={headerRef}
        className="max-w-[1400px] mx-auto px-4 md:px-12 pt-4 pb-6 sm:pt-8"
      >
        <div className="flex flex-row items-center gap-3 sm:gap-12 lg:gap-16">
          {/* On phone, the flower sits inline right here, at the same
              top-left spot article/artwork pages place it, with the filter
              directly beside it on the same line. */}
          <div className="sm:hidden shrink-0">
            <FlowerLink fixed={false} />
          </div>
          {/* Spacer reserving the full sidebar column width on tablet/desktop. */}
          <div className="hidden sm:block sm:w-56 md:w-64 lg:w-72 shrink-0" />
          <PageNav />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-12 pb-16">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 lg:gap-16">
          {/* Sidebar: bio (mobile only — desktop version is rendered fixed below) */}
          <div className="sm:hidden shrink-0">
            <div className="text-xs sm:text-sm leading-relaxed space-y-4">
              <h1 className="text-sm sm:text-base font-bold text-[#ED2E85]">Cæcilie Lidén Bode</h1>
              <p>Product designer and digital artist from Copenhagen.</p>
              <p>
                This is my <strong>project parking spot</strong>. Here you can see a mix of my{" "}
                <Link
                  href="/"
                  className="transition-colors duration-200 ease-out hover:text-[#ED2E85]"
                >
                  design projects
                </Link>{" "}
                and{" "}
                <Link
                  href="/art"
                  className="transition-colors duration-200 ease-out hover:text-[#ED2E85]"
                >
                  paintings
                </Link>
                .
              </p>
            </div>
          </div>

          {/* Spacer preserving the sidebar's width in the layout on desktop */}
          <div className="hidden sm:block sm:w-56 md:w-64 lg:w-72 shrink-0" />

          {/* Page content */}
          <div className="flex-1">{children}</div>
        </div>

        {/* Internship note + socials: part of normal page flow on mobile,
            sitting at the very bottom instead of pinned over the content. */}
        <div className="sm:hidden flex flex-col gap-3 mt-10">
          <div className="text-xs leading-relaxed space-y-4">
            <p className="font-bold text-[#ED2E85]">
              I am looking for a interaction / product design internship this spring!
            </p>
            <p className="font-bold text-[#ED2E85]">Feel free to reach out to me!</p>
          </div>
          <Footer />
        </div>
      </main>

      {/* Sidebar: name, bio — fixed to the viewport on desktop, never moves on
          scroll, starting level with the top of the main content. */}
      <div
        className="hidden sm:block fixed inset-x-0 pointer-events-none z-30"
        style={{ top: "var(--header-height, 5.5rem)" }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="sm:w-56 md:w-64 lg:w-72 pointer-events-auto">
            <div className="text-xs sm:text-sm leading-relaxed space-y-4">
              <h1 className="text-sm sm:text-base font-bold text-[#ED2E85]">Cæcilie Lidén Bode</h1>
              <p>Product designer and digital artist from Copenhagen.</p>
              <p>
                This is my <strong>project parking spot</strong>. Here you can see a mix of my{" "}
                <Link
                  href="/"
                  className="transition-colors duration-200 ease-out hover:text-[#ED2E85]"
                >
                  design projects
                </Link>{" "}
                and{" "}
                <Link
                  href="/art"
                  className="transition-colors duration-200 ease-out hover:text-[#ED2E85]"
                >
                  paintings
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Internship note + socials — fixed to the viewport on desktop, aligned
          to the same left margin as the bio sidebar and the main content column. */}
      <div className="hidden sm:block fixed inset-x-0 bottom-4 z-40 pointer-events-none">
        <div className="max-w-[1400px] mx-auto px-4 md:px-12">
          <div className="sm:w-56 md:w-64 lg:w-72 pointer-events-auto flex flex-col gap-3">
            <div className="text-xs sm:text-sm leading-relaxed space-y-4">
              <p className="font-bold text-[#ED2E85]">
                I am looking for a interaction / product design internship this spring!
              </p>
              <p className="font-bold text-[#ED2E85]">Feel free to reach out to me!</p>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
