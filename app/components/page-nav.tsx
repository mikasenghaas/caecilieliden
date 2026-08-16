"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { motion } from "motion/react";

// The /about route still exists and works, it is just kept out of the filter
// (and so out of the swipe/cycle order) until the page is ready to show.
export const PAGES = [
  { href: "/", label: "design projects" },
  { href: "/art", label: "drawings and paintings" },
];

// The whole pill is a single bordered, overflow-hidden capsule (not three
// separately-bordered pieces) so there's exactly one border line with no
// seams. Its two ends are fixed-width spacers (no border/radius of their own —
// the capsule's own radius + overflow-hidden already gives them their curved
// shape) and the middle is the label's flex container; only the capsule's
// overall width changes.
//
// That width comes from animating the label box's own width between 0 and
// auto, so the capsule simply reflows around it. It is deliberately *not*
// Framer's `layout`: a layout animation fakes size changes with scaleX, which
// squashes the round caps into ellipses for the length of the animation.
// Framer can only approximately correct that distortion, and the residue was
// clearly visible on phone, where the label widths (and so the scale factors)
// are largest relative to the pill. Animating real width applies no transform
// at all, so the caps stay perfect half-circles, and the neighbouring pills
// reposition off the true layout every frame instead of needing their own
// synced layout animation to avoid overlapping.
const CAP_WIDTH = 18; // half of the h-9 (36px) circle's diameter
// Critically damped (damping = 2 * sqrt(stiffness)), so the width settles on
// its target without ever going past it. A bouncier spring overshoots the
// final width by a few percent mid-animation, and on a phone the row of pills
// only just fits across the screen, so those few percent were enough to push
// the last pill onto a second line for the length of the animation.
const SPRING = { type: "spring" as const, stiffness: 700, damping: 53 };

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
            className="block h-9"
          >
            <span
              // CAP_WIDTH is exactly half the h-9 height, so each end is a
              // true half-circle.
              style={{ borderRadius: CAP_WIDTH }}
              className="group flex h-9 items-center overflow-hidden border border-black bg-white transition-colors duration-200 hover:border-[#ED2E85]"
            >
              <span style={{ width: CAP_WIDTH }} className="h-9 shrink-0" />

              <motion.span
                initial={false}
                animate={{ width: isActive ? "auto" : 0 }}
                transition={SPRING}
                className="flex h-9 flex-none items-center justify-center overflow-hidden"
              >
                <motion.span
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.08, delay: isActive ? 0.18 : 0 }}
                  className="shrink-0 whitespace-nowrap px-1.5 font-mono text-black text-xs sm:text-sm transition-colors duration-200 group-hover:text-[#ED2E85]"
                >
                  {page.label}
                </motion.span>
              </motion.span>

              <span style={{ width: CAP_WIDTH }} className="h-9 shrink-0" />
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
