"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

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
// rectangle is 0px wide, the two caps sit flush and form a full circle.
const CAP_WIDTH = 18; // half of the h-9 (36px) circle's diameter
const RECT_PADDING_X = 6; // horizontal padding inside the rectangle, per side

export default function PageNav() {
  const pathname = usePathname();
  const router = useRouter();
  const textRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [textWidths, setTextWidths] = useState<Record<string, number>>({});

  useEffect(() => {
    function measure() {
      const next: Record<string, number> = {};
      for (const page of PAGES) {
        const el = textRefs.current[page.href];
        if (el) next[page.href] = el.offsetWidth;
      }
      setTextWidths(next);
    }

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

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
    <>
      <nav className="flex flex-wrap items-center justify-start gap-[10px]">
        {PAGES.map((page) => {
          const isActive = pathname === page.href;
          const rectWidth = isActive
            ? (textWidths[page.href] ?? 0) + RECT_PADDING_X * 2
            : 0;

          return (
            <Link
              key={page.href}
              href={page.href}
              aria-label={page.label}
              onClick={isActive ? handleActiveClick : undefined}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 700, damping: 36 }}
                className="group flex h-9 items-center"
              >
                <span
                  style={{ width: CAP_WIDTH }}
                  className="h-9 shrink-0 rounded-l-full border-y border-l border-black bg-white transition-colors duration-200 group-hover:border-[#ED2E85]"
                />

                <motion.span
                  animate={{ width: rectWidth }}
                  transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 36,
                    delay: isActive ? 0 : 0.08,
                  }}
                  className="flex h-9 shrink-0 items-center justify-center overflow-hidden border-y border-black bg-white transition-colors duration-200 group-hover:border-[#ED2E85]"
                >
                  <motion.span
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.08, delay: isActive ? 0.18 : 0 }}
                    className="whitespace-nowrap text-black text-xs sm:text-sm transition-colors duration-200 group-hover:text-[#ED2E85]"
                  >
                    {page.label}
                  </motion.span>
                </motion.span>

                <span
                  style={{ width: CAP_WIDTH }}
                  className="h-9 shrink-0 rounded-r-full border-y border-r border-black bg-white transition-colors duration-200 group-hover:border-[#ED2E85]"
                />
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* Hidden measuring bank: same font classes as the real labels, used
          only to read each label's natural pixel width so the stretchy
          rectangle knows what width to animate to. */}
      <div aria-hidden className="fixed -left-[9999px] -top-[9999px] pointer-events-none">
        {PAGES.map((page) => (
          <span
            key={page.href}
            ref={(el) => {
              textRefs.current[page.href] = el;
            }}
            className="whitespace-nowrap text-xs sm:text-sm"
          >
            {page.label}
          </span>
        ))}
      </div>
    </>
  );
}
