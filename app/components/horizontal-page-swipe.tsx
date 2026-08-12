"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PAGES } from "@/app/components/page-nav";

// Lets people navigate between pages (design projects <-> drawings and
// paintings <-> about me) by scrolling sideways or pressing the left/right
// arrow keys — alternatives to clicking the nav. The nav itself keeps
// working normally.
const SWIPE_THRESHOLD = 60; // accumulated horizontal px needed to trigger a page change
const AXIS_LOCK_RATIO = 1.5; // how much more horizontal than vertical motion is required
const GESTURE_RESET_MS = 200; // gap after which a paused gesture is treated as new

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export default function HorizontalPageSwipe() {
  const pathname = usePathname();
  const router = useRouter();
  const accumulatedX = useRef(0);
  const lastEventTime = useRef(0);
  // Tracks a navigation that's been requested but hasn't landed yet, so a
  // second key press/scroll before the route actually changes doesn't queue
  // up an extra navigation. Cleared as soon as `pathname` matches it below,
  // rather than after a guessed fixed delay — that fixed-delay approach
  // could unlock before the navigation actually completed, making the next
  // press feel like it did nothing.
  const pendingHref = useRef<string | null>(null);

  useEffect(() => {
    if (pendingHref.current === pathname) {
      pendingHref.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    function goToPage(direction: 1 | -1) {
      if (pendingHref.current) return;

      const currentIndex = PAGES.findIndex((page) => page.href === pathname);
      if (currentIndex === -1) return;

      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= PAGES.length) return;

      pendingHref.current = PAGES[nextIndex].href;
      router.push(PAGES[nextIndex].href);
    }

    function handleWheel(event: WheelEvent) {
      if (pendingHref.current) return;

      const { deltaX, deltaY } = event;

      // Only treat this as a page-swipe gesture when motion is
      // predominantly horizontal, so normal vertical scrolling is untouched.
      if (Math.abs(deltaX) < Math.abs(deltaY) * AXIS_LOCK_RATIO) {
        accumulatedX.current = 0;
        return;
      }

      const now = performance.now();
      if (now - lastEventTime.current > GESTURE_RESET_MS) {
        accumulatedX.current = 0;
      }
      lastEventTime.current = now;

      accumulatedX.current += deltaX;

      if (Math.abs(accumulatedX.current) < SWIPE_THRESHOLD) return;

      const direction = accumulatedX.current > 0 ? 1 : -1;
      accumulatedX.current = 0;
      goToPage(direction);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        goToPage(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPage(-1);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [pathname, router]);

  return null;
}
