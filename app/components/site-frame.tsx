"use client";

import { ReactNode, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  // The home flower is a "go home" button — redundant (and hidden) on the
  // pages SiteFrame covers (design projects, drawings and paintings, about
  // me), since PageNav already lets you get to any of them. It stays visible
  // on article/project and gallery/artwork pages, which render it directly.
  const isSiteFramePage = pathname === "/" || pathname === "/art" || pathname === "/about";

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

      {!isSiteFramePage && <FlowerLink fixed="always" />}

      <header
        ref={headerRef}
        className="max-w-[1400px] mx-auto px-4 md:px-12 pt-6 pb-6 sm:pt-8"
      >
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 lg:gap-16">
          <div className="sm:w-56 md:w-64 lg:w-72 shrink-0" />
          <PageNav />
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 md:px-12 pb-16">
        <div className="flex flex-col sm:flex-row gap-10 sm:gap-12 lg:gap-16">
          {/* Sidebar: name, bio (mobile only — desktop version is rendered fixed below) */}
          <div className="sm:hidden shrink-0">
            <h1 className="text-sm sm:text-base font-bold leading-relaxed mb-4 text-[#ED2E85]">
              Cæcilie Lidén Bode
            </h1>
            <div className="text-xs sm:text-sm leading-relaxed space-y-4">
              <p>Product designer and digital artist from Copenhagen.</p>
              <p>
                I work across research, interaction, and visual design to shape how digital products look, feel, and
                behave. I&apos;m currently exploring concepts of play through my projects and learning new tools.
              </p>
              <p>This is my project parking spot. Here you can see a mix of my design projects and paintings.</p>
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
            <p>I am looking for a interaction / product design internship this spring.</p>
            <p>You are welcome to connect with me!</p>
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
            <h1 className="text-sm sm:text-base font-bold leading-relaxed mb-4 text-[#ED2E85]">
              Cæcilie Lidén Bode
            </h1>
            <div className="text-xs sm:text-sm leading-relaxed space-y-4">
              <p>Product designer and digital artist from Copenhagen.</p>
              <p>
                I work across research, interaction, and visual design to shape how digital products look, feel, and
                behave. I&apos;m currently exploring concepts of play through my projects and learning new tools.
              </p>
              <p>This is my project parking spot. Here you can see a mix of my design projects and paintings.</p>
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
              <p>I am looking for a interaction / product design internship this spring.</p>
              <p>You are welcome to connect with me!</p>
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}
