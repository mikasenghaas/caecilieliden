"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MouseEvent } from "react";

// The /about route still exists and works, it is just kept out of the filter
// (and so out of the swipe/cycle order) until the page is ready to show.
export const PAGES = [
  { href: "/", label: "design projects" },
  { href: "/art", label: "paintings" },
];

// Every pill always shows its full label, so the capsule is simply the label
// with a half-circle cap of padding at each end. CAP_WIDTH is half the h-9
// (36px) height, which makes those caps true half-circles.
const CAP_WIDTH = 18;

// The capsule shared by every page filter, so they can never drift apart.
function Pill({ active, children }: { active: boolean; children: string }) {
  return (
    <span
      style={{ borderRadius: CAP_WIDTH, paddingInline: CAP_WIDTH }}
      className={`group flex h-9 items-center border bg-white transition-colors duration-200 hover:border-[#ED2E85] ${
        active ? "border-[#ED2E85]" : "border-black"
      }`}
    >
      <span
        // One fixed size at every width: the pills are the first thing
        // on the page, so a label that grew a step partway through a
        // resize was the most visible thing moving.
        className={`whitespace-nowrap font-mono text-[14px] font-normal transition-colors duration-200 group-hover:text-[#ED2E85] ${
          active ? "text-[#ED2E85]" : "text-black"
        }`}
      >
        {children}
      </span>
    </span>
  );
}

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
    <nav className="flex w-full flex-wrap items-center justify-start gap-[10px]">
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
            <Pill active={isActive}>{page.label}</Pill>
          </Link>
        );
      })}
    </nav>
  );
}
