"use client";

import { useEffect, useRef, useState } from "react";

const PINK = "#ED2E85";

const FACTS = [
  "I thrive when I am being creative.",
  "I think the world needs more play.",
  "I love drawing and painting.",
  "I often journal.",
  "I love bouldering with my friends.",
  "I love swimming.",
  "I love running.",
  "I really like coffee.",
  "I love bubbletea.",
  "Currently trying to learn touchdesigner.",
  "I've run Copenhagen Marathon twice!",
  "When I was a kid I wanted to be an inventor.",
];

const SPEED = 0.35; // px per frame — slow, fly-like drift
const TURN_JITTER = 0.045; // random per-frame wobble, so the path still looks organic
const STEER_STRENGTH = 0.02; // how eagerly heading corrects towards the current target
const ARRIVAL_DISTANCE = 60; // once this close to the target, head off towards a new one
const RETARGET_MIN_MS = 4000;
const RETARGET_MAX_MS = 9000;
const EDGE_MARGIN = 24;
const DRAG_THRESHOLD = 4; // px of pointer movement before a press counts as a drag, not a tap
const NODE_SIZE = 14; // visible dot size while idle
const HIT_SIZE = 44; // actual clickable size while idle (bigger than the dot)
const ACTIVE_SIZE = "min(115px, 40vw)"; // grown bubble size while revealing a fact
const GROW_DURATION = 500;
// Wait until the bubble has fully finished resizing before showing the text —
// otherwise the text reflows/rewraps mid-transition as the box resizes,
// which reads as clumsy rather than a clean reveal.
const TEXT_FADE_DELAY = GROW_DURATION;
const OPEN_DURATION = 2500; // how long the bubble stays open before closing
const TEXT_FADE_OUT_LEAD = 200; // fade text out this much before the bubble starts shrinking

function pickFactIndex(previousIndex: number | null) {
  if (FACTS.length <= 1) return 0;
  let index = previousIndex;
  while (index === previousIndex) {
    index = Math.floor(Math.random() * FACTS.length);
  }
  return index;
}

// Shortest signed distance from angle `from` to angle `to`, in radians,
// so steering always turns the "short way" instead of spinning around.
function angleDelta(from: number, to: number) {
  return Math.atan2(Math.sin(to - from), Math.cos(to - from));
}

export default function FloatingNode() {
  const nodeRef = useRef<HTMLButtonElement>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const angleRef = useRef(Math.random() * Math.PI * 2);
  const targetRef = useRef({ x: 0, y: 0 });
  const nextRetargetAtRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const isActiveRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStateRef = useRef<{ startX: number; startY: number; dragged: boolean } | null>(null);
  const requestNewTargetRef = useRef<() => void>(() => {});
  const lastFactIndexRef = useRef<number | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [factIndex, setFactIndex] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    // Document (not viewport) dimensions, so the node can end up anywhere on
    // the page — including well below the fold — and scrolls along with the
    // page instead of staying pinned to the visible screen.
    const getPageWidth = () => document.documentElement.scrollWidth;
    const getPageHeight = () => document.documentElement.scrollHeight;

    const pickNewTarget = () => {
      targetRef.current = {
        x: Math.random() * (getPageWidth() - EDGE_MARGIN * 2) + EDGE_MARGIN,
        y: Math.random() * (getPageHeight() - EDGE_MARGIN * 2) + EDGE_MARGIN,
      };
      nextRetargetAtRef.current =
        Date.now() + RETARGET_MIN_MS + Math.random() * (RETARGET_MAX_MS - RETARGET_MIN_MS);
    };
    requestNewTargetRef.current = pickNewTarget;

    positionRef.current = {
      x: Math.random() * (getPageWidth() - EDGE_MARGIN * 2) + EDGE_MARGIN,
      y: Math.random() * (getPageHeight() - EDGE_MARGIN * 2) + EDGE_MARGIN,
    };
    pickNewTarget();

    const applyTransform = () => {
      const node = nodeRef.current;
      if (node) {
        node.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`;
      }
    };
    applyTransform();

    const tick = () => {
      // Freeze in place while a fact is being shown or while it's being
      // dragged, so it doesn't fight the reader/the pointer.
      if (!isActiveRef.current && !isDraggingRef.current) {
        const position = positionRef.current;
        const target = targetRef.current;
        const dx = target.x - position.x;
        const dy = target.y - position.y;

        if (
          Date.now() > nextRetargetAtRef.current ||
          Math.hypot(dx, dy) < ARRIVAL_DISTANCE
        ) {
          requestNewTargetRef.current();
        }

        // Gently steer towards the current target and add a small random
        // wobble each frame, so the node meanders like a fly across the
        // whole page rather than drifting in a tight, local random walk.
        const desiredAngle = Math.atan2(dy, dx);
        angleRef.current += angleDelta(angleRef.current, desiredAngle) * STEER_STRENGTH;
        angleRef.current += (Math.random() - 0.5) * TURN_JITTER;

        position.x += Math.cos(angleRef.current) * SPEED;
        position.y += Math.sin(angleRef.current) * SPEED;

        // Defensive clamp in case of jitter overshoot — steering already
        // keeps it heading back towards a target within these bounds.
        position.x = Math.min(Math.max(position.x, EDGE_MARGIN), getPageWidth() - EDGE_MARGIN);
        position.y = Math.min(Math.max(position.y, EDGE_MARGIN), getPageHeight() - EDGE_MARGIN);

        applyTransform();
      }

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, []);

  const revealFact = () => {
    if (isActiveRef.current) return; // ignore re-taps while already revealing a fact

    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    const nextFactIndex = pickFactIndex(lastFactIndexRef.current);
    lastFactIndexRef.current = nextFactIndex;
    setFactIndex(nextFactIndex);
    setIsActive(true);
    setShowText(false);

    timeoutRefs.current.push(
      setTimeout(() => setShowText(true), TEXT_FADE_DELAY),
      // Fade the text out first, then let the bubble shrink back to the dot,
      // so it "animates out" instead of just vanishing.
      setTimeout(() => setShowText(false), OPEN_DURATION - TEXT_FADE_OUT_LEAD),
      setTimeout(() => setIsActive(false), OPEN_DURATION),
    );
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (isActiveRef.current) return; // don't drag while a fact is showing
    event.currentTarget.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    dragStateRef.current = { startX: event.clientX, startY: event.clientY, dragged: false };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    const dragState = dragStateRef.current;
    if (dragState && !dragState.dragged) {
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) dragState.dragged = true;
    }

    const parent = nodeRef.current?.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    positionRef.current = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
    const node = nodeRef.current;
    if (node) {
      node.style.transform = `translate(${positionRef.current.x}px, ${positionRef.current.y}px) translate(-50%, -50%)`;
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);

    const wasDrag = dragStateRef.current?.dragged ?? false;
    dragStateRef.current = null;

    if (wasDrag) {
      // Head off towards a fresh spot instead of beelining back to
      // wherever the old target happened to be.
      requestNewTargetRef.current();
    } else {
      revealFact();
    }
  };

  return (
    <button
      ref={nodeRef}
      type="button"
      aria-label={
        isActive && factIndex !== null
          ? FACTS[factIndex]
          : "Floating decorative node, click and hold to drag, or tap to reveal a fact"
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="absolute top-0 left-0 z-40 hidden touch-none items-center justify-center rounded-full transition-[width,height] duration-500 ease-out select-none sm:flex"
      style={{
        width: isActive ? ACTIVE_SIZE : HIT_SIZE,
        height: isActive ? ACTIVE_SIZE : HIT_SIZE,
        backgroundColor: isActive ? PINK : "transparent",
        transitionDuration: `${GROW_DURATION}ms`,
      }}
    >
      <span
        className="block rounded-full transition-opacity duration-300"
        style={{
          width: NODE_SIZE,
          height: NODE_SIZE,
          backgroundColor: PINK,
          opacity: isActive ? 0 : 1,
        }}
      />
      {isActive && factIndex !== null && (
        <span
          className="absolute px-2.5 text-center text-xs leading-snug text-white transition-opacity duration-300"
          style={{ opacity: showText ? 1 : 0 }}
        >
          {FACTS[factIndex]}
        </span>
      )}
    </button>
  );
}
