"use client";

import { motion } from "motion/react";

export interface SlideNavItem {
  id: string;
  label: string;
}

interface SlideNavProps {
  slides: SlideNavItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

// Same pill look and width animation as the front-page filter (see PageNav) —
// a single bordered, overflow-hidden capsule (not three separately-bordered
// pieces) so there's exactly one border line with no seams. Kept as its own
// component (rather than generalizing PageNav itself) since this one picks a
// local slide index via a button/callback instead of navigating routes via
// next/link.
// Half the h-9 height at sm+, i.e. a true half-circle on each end. On phone
// the caps are narrowed: these navs have up to four pills, and with the
// longest label expanded the full row is a few pixels wider than a 375px
// screen, which pushed the last pill onto a second line.
const CAP = "h-9 shrink-0 w-3 sm:w-[18px]";
// Critically damped, so the width never overshoots its target and bumps a
// pill onto a second line mid-animation. See PageNav.
const SPRING = { type: "spring" as const, stiffness: 700, damping: 53 };

export default function SlideNav({
  slides,
  activeIndex,
  onSelect,
}: SlideNavProps) {
  return (
    <nav className="flex flex-nowrap items-center justify-center gap-1.5 sm:gap-[10px]">
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={slide.id}
            type="button"
            aria-label={slide.label}
            aria-current={isActive}
            onClick={() => onSelect(index)}
            className="block h-9"
          >
            <span className="group flex h-9 items-center overflow-hidden rounded-full border border-black bg-white transition-colors duration-200 hover:border-[#ED2E85]">
              <span className={CAP} />

              {/* The label's real width is animated, rather than faking the
                  size change with Framer's `layout` (which resizes via
                  scaleX). Under scaleX the round caps get squashed into
                  ellipses for the length of the animation — Framer's
                  border-radius correction only approximates its way out of
                  that. Animating real width means no transform is ever
                  applied, so the caps stay perfect half-circles, and the
                  neighbouring pills reflow off the true layout each frame. */}
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
                  className="shrink-0 whitespace-nowrap px-1.5 font-mono font-normal text-black text-xs sm:text-sm transition-colors duration-200 group-hover:text-[#ED2E85]"
                >
                  {slide.label}
                </motion.span>
              </motion.span>

              <span className={CAP} />
            </span>
          </button>
        );
      })}
    </nav>
  );
}
