"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";

export const PAGES = [
  { href: "/", label: "design projects" },
  { href: "/art", label: "drawings and paintings" },
  { href: "/about", label: "about me" },
];

// Each filter is built from three pieces — a fixed-size left cap, a
// stretchy middle rectangle, and a fixed-size right cap — instead of one
// element whose whole box is resized. Resizing a single rounded element
// distorts its border-radius/content mid-animation; only ever animating the
// (unrounded) middle rectangle's width avoids that entirely. When the
// rectangle has no padding/content, the two caps sit flush and form a full
// circle.
//
// The rectangle's width itself is never measured or set from JS — it's
// driven by Framer Motion's `layout` animation, which reads the real,
// already-laid-out DOM size (padding present or not, label mounted or not)
// and smoothly interpolates between old/new sizes. That sidesteps an
// earlier JS-measurement approach entirely: measuring label widths in an
// effect and animating to a computed pixel value meant the very first paint
// of a fresh mount (e.g. this component fully remounting after leaving a
// project/painting detail page, which lives outside the layout that keeps
// this nav mounted) could briefly render before that measurement had run,
// flashing every label at once. `layout` has no such gap — with no prior
// frame to interpolate from on mount, it just renders at the final,
// already-correct layout immediately.
const CAP_WIDTH = 18; // half of the h-9 (36px) circle's diameter
const SPRING = { type: "spring" as const, stiffness: 700, damping: 36 };

export default function PageNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleActiveClick = (e: MouseEvent) => {
    // Clicking the already-active filter changes the page instead of doing
    // nothing — spam-clicking it just cycles forward through the pages,
    // wrapping around to the start at the end.
    e.preventDefault();
    const currentIndex = PAGES.findIndex((page) => page.href === pathname);
    const nextIndex = (currentIndex + 1) % PAGES.length;
    router.push(PAGES[nextIndex].href);
  };

  return (
    <nav className="flex flex-wrap items-center justify-start gap-[10px]">
      {PAGES.map((page) => {
        const isActive = pathname === page.href;

        return (
          <Link
            key={page.href}
            href={page.href}
            aria-label={page.label}
            onClick={isActive ? handleActiveClick : undefined}
          >
            <span className="group flex h-9 items-center">
              <span
                style={{ width: CAP_WIDTH }}
                className="h-9 shrink-0 rounded-l-full border-y border-l border-black bg-white transition-colors duration-200 group-hover:border-[#ED2E85]"
              />

              <motion.span
                layout
                transition={{ ...SPRING, delay: isActive ? 0 : 0.08 }}
                className="flex h-9 shrink-0 items-center justify-center overflow-hidden border-y border-black bg-white transition-colors duration-200 group-hover:border-[#ED2E85]"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.08, delay: 0.18 } }}
                      exit={{ opacity: 0, transition: { duration: 0.08 } }}
                      className="whitespace-nowrap px-1.5 text-black text-xs sm:text-sm transition-colors duration-200 group-hover:text-[#ED2E85]"
                    >
                      {page.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>

              <span
                style={{ width: CAP_WIDTH }}
                className="h-9 shrink-0 rounded-r-full border-y border-r border-black bg-white transition-colors duration-200 group-hover:border-[#ED2E85]"
              />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
