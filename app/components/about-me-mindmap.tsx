"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { useFilter } from "@/app/context/filter-context";
import TextBlock from "@/app/components/text-block";

type SatelliteNode =
  | { kind: "text"; text: string; parentId?: number }
  | { kind: "image"; src: StaticImageData; alt: string; parentId?: number };

const SATELLITE_NODES: SatelliteNode[] = [
  { kind: "text", text: "I am from Copenhagen." },
  { kind: "text", text: "BSc in Digital Design and Interactive Technologies from the IT-University of Copenhagen." },
  { kind: "text", text: "I thrive when I am being creative and when I play." },
  { kind: "text", text: "I love drawing, painting, and journalling." },
  { kind: "text", text: "I enjoy bouldering, swimming, and running." },
  { kind: "text", text: "Currently trying to learn touchdesigner." },
  { kind: "text", text: "I've run Copenhagen Marathon twice!" },
];

const SATELLITE_COUNT = SATELLITE_NODES.length;

// Each satellite's parent node id (0 = the center node). Satellites can be
// attached to another satellite instead of the center, forming a small
// sub-branch (e.g. the BSc node has a child elaborating on it).
const PARENT_ID_BY_ID: number[] = [-1, ...SATELLITE_NODES.map((node) => node.parentId ?? 0)];

// Deterministic pseudo-random-looking radius offsets (golden-angle based),
// so the starting layout doesn't look like a perfect, robotic circle.
const RADIUS_JITTER_RATIO = Array.from({ length: SATELLITE_COUNT }, (_, index) => 0.1 * Math.sin(index * 2.399963));

const CHILD_LINK_PADDING = 40;

const LINK_STRENGTH = 0.01;
const REPULSION_STRENGTH = 12000;
const DAMPING = 0.82;
const RETURN_SPRING_STRENGTH = 0.05;
const RETURN_DAMPING = 0.8;
const RETURN_DONE_DISTANCE = 0.75;

// A small continuous, per-node oscillating force so nodes never fully settle
// into a static layout — they keep gently drifting, with the spring/repulsion
// forces above keeping that drift loose and slow rather than letting nodes
// wander off or collide. Frequencies are irrational multiples of each other
// (and offset per node id) so nodes drift in and out of sync rather than
// pulsing in unison.
const WANDER_STRENGTH = 0.18;
const WANDER_FREQUENCY_X = 0.010;
const WANDER_FREQUENCY_Y = 0.0085;

const DOT_SIZE = 8;
const LABEL_GAP = 4;
const COLLISION_PADDING = 14;
const COLLISION_ITERATIONS = 12;
const EDGE_MARGIN = 16;
// The center is now just an invisible anchor point the free-floating nodes
// gently gather around (no image/dot is rendered for it), so it sits in the
// middle of the container rather than being offset for content below it.
const CENTER_Y_FRACTION = 0.5;

// Below this width, the draggable radial mind-map (designed for wider
// screens) doesn't have enough room to lay itself out and reads poorly.
// Phones get a simple static layout instead (see the early return below).
const MOBILE_BREAKPOINT_QUERY = "(max-width: 639px)";

interface SimNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  restLength: number;
}

interface Footprint {
  halfWidth: number;
  totalHeight: number;
  radius: number;
}

export default function AboutMeMindMap() {
  const { aboutMeResetSignal } = useFilter();
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeElRefs = useRef<(HTMLDivElement | null)[]>([]);
  const contentElRefs = useRef<(HTMLElement | null)[]>([]);
  const lineElRefs = useRef<(SVGLineElement | null)[]>([]);
  const nodesRef = useRef<SimNode[]>([]);
  const footprintsRef = useRef<(Footprint | null)[]>([]);
  const originalPositionsRef = useRef<{ x: number; y: number }[]>([]);
  const originalRestLengthsRef = useRef<number[]>([]);
  const draggingIdRef = useRef<number | null>(null);
  const returningRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const requestReturnRef = useRef<() => void>(() => {});
  const wanderTimeRef = useRef(0);

  // This component only ever mounts client-side (after the "About Me" filter
  // is selected), so window is always available here.
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);
    const update = () => setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  // Mobile-only: refs for measuring dot positions (so the connecting lines
  // between sub-branch nodes can be drawn) and a mounted flag that flips
  // shortly after layout to drive a simple opacity fade-in, instead of the
  // draggable version's physics animation.
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const mobileNodeDotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileLineRefs = useRef<(SVGLineElement | null)[]>([]);
  const [mobileMounted, setMobileMounted] = useState(false);

  useLayoutEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height * CENTER_Y_FRACTION;

    // Measure each node's rendered footprint (dot + content) so we can keep
    // nodes from ever overlapping or drifting off screen, regardless of how
    // long their text is or how big their image is.
    const footprints: (Footprint | null)[] = [];
    for (let id = 0; id <= SATELLITE_COUNT; id++) {
      const content = contentElRefs.current[id];
      if (!content) {
        footprints[id] = null;
        continue;
      }
      const contentWidth = content.offsetWidth;
      const contentHeight = content.offsetHeight;
      const totalHeight = DOT_SIZE + LABEL_GAP + contentHeight;
      footprints[id] = {
        halfWidth: contentWidth / 2,
        totalHeight,
        radius: Math.sqrt((contentWidth / 2) ** 2 + (totalHeight / 2) ** 2),
      };
    }
    footprintsRef.current = footprints;

    // Work out a starting radius that spaces satellites apart enough to
    // avoid overlap on average, while using as much of the available
    // screen space as possible (accounting for the off-center vertical
    // anchor point and each node's own footprint). Only root-level
    // satellites (attached directly to the center) sit on this circle;
    // satellites attached to another satellite are placed near their parent
    // instead, so they don't skew the main circle's spacing.
    const rootFootprints: Footprint[] = [];
    for (let id = 1; id <= SATELLITE_COUNT; id++) {
      if (PARENT_ID_BY_ID[id] !== 0) continue;
      const footprint = footprints[id];
      if (footprint) rootFootprints.push(footprint);
    }
    const avgDiameter =
      rootFootprints.reduce((sum, f) => sum + f.radius * 2, 0) / (rootFootprints.length || 1);
    const maxSatelliteRadius = rootFootprints.reduce((max, f) => Math.max(max, f.radius), 0);

    const requiredRadius = (rootFootprints.length * (avgDiameter + COLLISION_PADDING)) / (2 * Math.PI);
    const availableRadius =
      Math.min(centerX, rect.width - centerX, centerY, rect.height - centerY) - maxSatelliteRadius - EDGE_MARGIN;
    const baseRadius = Math.max(Math.min(requiredRadius, availableRadius), availableRadius * 0.85);

    const nodes: SimNode[] = [{ id: 0, x: centerX, y: centerY, vx: 0, vy: 0, restLength: 0 }];
    for (let index = 0; index < SATELLITE_COUNT; index++) {
      nodes.push({ id: index + 1, x: centerX, y: centerY, vx: 0, vy: 0, restLength: 0 });
    }

    // First pass: place root satellites evenly around the main circle.
    let rootCounter = 0;
    for (let index = 0; index < SATELLITE_COUNT; index++) {
      const id = index + 1;
      if (PARENT_ID_BY_ID[id] !== 0) continue;
      const angle = (rootCounter / (rootFootprints.length || 1)) * 2 * Math.PI - Math.PI / 2;
      const radius = baseRadius * (1 + RADIUS_JITTER_RATIO[index]);
      nodes[id].x = centerX + radius * Math.cos(angle);
      nodes[id].y = centerY + radius * Math.sin(angle);
      nodes[id].restLength = radius;
      rootCounter++;
    }

    // Second pass: place satellites attached to another satellite near
    // their (now resolved) parent position.
    for (let index = 0; index < SATELLITE_COUNT; index++) {
      const id = index + 1;
      const parentId = PARENT_ID_BY_ID[id];
      if (parentId === 0) continue;
      const parent = nodes[parentId];
      const parentFootprint = footprints[parentId];
      const childFootprint = footprints[id];
      const linkLength =
        parentFootprint && childFootprint
          ? parentFootprint.radius + childFootprint.radius + CHILD_LINK_PADDING
          : 100;
      const angle = index * 2.399963;
      nodes[id].x = parent.x + linkLength * Math.cos(angle);
      nodes[id].y = parent.y + linkLength * Math.sin(angle);
      nodes[id].restLength = linkLength;
    }

    nodesRef.current = nodes;

    requestReturnRef.current = () => {
      draggingIdRef.current = null;
      returningRef.current = true;
    };

    const clampToBounds = (node: SimNode) => {
      const footprint = footprintsRef.current[node.id];
      const containerRect = container.getBoundingClientRect();
      const halfWidth = (footprint?.halfWidth ?? 30) + EDGE_MARGIN;
      const totalHeight = (footprint?.totalHeight ?? 20) + EDGE_MARGIN;
      node.x = Math.min(Math.max(node.x, halfWidth), containerRect.width - halfWidth);
      node.y = Math.min(Math.max(node.y, EDGE_MARGIN), containerRect.height - totalHeight);
    };

    // Directly resolve any overlap between node footprints (dot + content),
    // so nodes never overlap regardless of drag position or initial layout.
    const resolveCollisions = () => {
      const currentNodes = nodesRef.current;
      for (let iter = 0; iter < COLLISION_ITERATIONS; iter++) {
        let anyOverlap = false;
        for (let i = 0; i < currentNodes.length; i++) {
          for (let j = i + 1; j < currentNodes.length; j++) {
            const a = currentNodes[i];
            const b = currentNodes[j];
            const footprintA = footprintsRef.current[a.id];
            const footprintB = footprintsRef.current[b.id];
            if (!footprintA || !footprintB) continue;

            const aCenterY = a.y + footprintA.totalHeight / 2;
            const bCenterY = b.y + footprintB.totalHeight / 2;
            const dx = a.x - b.x;
            const dy = aCenterY - bCenterY;
            let dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.001) dist = 0.001;

            const minDist = footprintA.radius + footprintB.radius + COLLISION_PADDING;
            if (dist >= minDist) continue;

            anyOverlap = true;
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap;
            const pushY = (dy / dist) * overlap;
            const aFixed = draggingIdRef.current === a.id;
            const bFixed = draggingIdRef.current === b.id;

            if (aFixed && bFixed) continue;
            if (aFixed) {
              b.x -= pushX;
              b.y -= pushY;
              clampToBounds(b);
            } else if (bFixed) {
              a.x += pushX;
              a.y += pushY;
              clampToBounds(a);
            } else {
              a.x += pushX / 2;
              a.y += pushY / 2;
              b.x -= pushX / 2;
              b.y -= pushY / 2;
              clampToBounds(a);
              clampToBounds(b);
            }
          }
        }
        if (!anyOverlap) break;
      }
    };

    const applyTransforms = () => {
      for (const node of nodesRef.current) {
        const el = nodeElRefs.current[node.id];
        if (el) el.style.transform = `translate(${node.x}px, ${node.y}px)`;
      }
      for (let index = 0; index < SATELLITE_COUNT; index++) {
        const satellite = nodesRef.current[index + 1];
        const parent = nodesRef.current[PARENT_ID_BY_ID[satellite.id]];
        const line = lineElRefs.current[index];
        if (line) {
          line.setAttribute("x1", String(parent.x));
          line.setAttribute("y1", String(parent.y));
          line.setAttribute("x2", String(satellite.x));
          line.setAttribute("y2", String(satellite.y));
        }
      }
    };

    // One physics integration step (repulsion + center springs), used both
    // to silently pre-settle the layout before first paint and on every
    // visible frame afterwards.
    const stepPhysics = () => {
      const currentNodes = nodesRef.current;
      const forces = currentNodes.map(() => ({ fx: 0, fy: 0 }));

      // Repulsion between satellite pairs only (excluding the center keeps
      // it from being pulled off to one side by uneven satellite spacing)
      for (let i = 1; i < currentNodes.length; i++) {
        for (let j = i + 1; j < currentNodes.length; j++) {
          const a = currentNodes[i];
          const b = currentNodes[j];
          let dx = a.x - b.x;
          let dy = a.y - b.y;
          let distSq = dx * dx + dy * dy;
          if (distSq < 1) distSq = 1;
          const dist = Math.sqrt(distSq);
          const force = REPULSION_STRENGTH / distSq;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          forces[i].fx += fx;
          forces[i].fy += fy;
          forces[j].fx -= fx;
          forces[j].fy -= fy;
        }
      }

      // Spring links from each satellite to its parent (the center, or
      // another satellite it's attached to). restLength is updated to match
      // wherever a node is dropped (see handlePointerUp below), so released
      // nodes hold their new position instead of springing back.
      for (let index = 1; index < currentNodes.length; index++) {
        const satellite = currentNodes[index];
        const parentId = PARENT_ID_BY_ID[satellite.id];
        const parent = currentNodes[parentId];
        const dx = satellite.x - parent.x;
        const dy = satellite.y - parent.y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const displacement = dist - satellite.restLength;
        const force = LINK_STRENGTH * displacement;
        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;
        forces[index].fx -= fx;
        forces[index].fy -= fy;
        forces[parentId].fx += fx;
        forces[parentId].fy += fy;
      }

      for (let index = 0; index < currentNodes.length; index++) {
        const node = currentNodes[index];
        if (draggingIdRef.current === node.id) continue;
        node.vx = (node.vx + forces[index].fx) * DAMPING;
        node.vy = (node.vy + forces[index].fy) * DAMPING;
        node.x += node.vx;
        node.y += node.vy;
        clampToBounds(node);
      }

      resolveCollisions();
    };

    // The jittered starting circle isn't a physics equilibrium (repulsion
    // between satellites isn't accounted for), so running the simulation
    // from there would visibly "spring open" into its resting layout on
    // every mount. Instead, silently fast-forward the simulation here,
    // before the first paint, so what's first shown is already settled.
    const SETTLE_ITERATIONS = 200;
    for (let i = 0; i < SETTLE_ITERATIONS; i++) {
      stepPhysics();
    }
    for (const node of nodesRef.current) {
      node.vx = 0;
      node.vy = 0;
    }
    resolveCollisions();

    originalPositionsRef.current = nodesRef.current.map((node) => ({ x: node.x, y: node.y }));
    originalRestLengthsRef.current = nodesRef.current.map((node) => node.restLength);

    applyTransforms();

    const tick = () => {
      const currentNodes = nodesRef.current;

      // When a reset was requested, animate every node back towards its
      // original starting position with a simple damped spring, ignoring
      // the normal repulsion/link forces until everything has arrived.
      if (returningRef.current) {
        let allSettled = true;
        for (const node of currentNodes) {
          const target = originalPositionsRef.current[node.id];
          if (!target) continue;
          const dx = target.x - node.x;
          const dy = target.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > RETURN_DONE_DISTANCE || Math.abs(node.vx) > 0.01 || Math.abs(node.vy) > 0.01) {
            allSettled = false;
          }
          node.vx = (node.vx + dx * RETURN_SPRING_STRENGTH) * RETURN_DAMPING;
          node.vy = (node.vy + dy * RETURN_SPRING_STRENGTH) * RETURN_DAMPING;
          node.x += node.vx;
          node.y += node.vy;
        }

        if (allSettled) {
          returningRef.current = false;
          for (const node of currentNodes) {
            const target = originalPositionsRef.current[node.id];
            if (target) {
              node.x = target.x;
              node.y = target.y;
            }
            node.vx = 0;
            node.vy = 0;
            node.restLength = originalRestLengthsRef.current[node.id] ?? node.restLength;
          }
        }

        applyTransforms();
        frameRef.current = requestAnimationFrame(tick);
        return;
      }

      stepPhysics();
      applyTransforms();
      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [isMobile]);

  // Mobile: draw the pink connecting lines between sub-branch nodes (e.g. the
  // BSc node and its child) by measuring their actual rendered positions,
  // and fade everything in once. Root-level nodes have no center to connect
  // to anymore, so they get no line. Re-measured on resize since the static
  // grid layout can reflow at different widths.
  useLayoutEffect(() => {
    if (!isMobile) return;
    const container = mobileContainerRef.current;
    if (!container) return;

    const updateLines = () => {
      const containerRect = container.getBoundingClientRect();

      const dotCenters: { x: number; y: number }[] = [];
      for (let index = 0; index < SATELLITE_COUNT; index++) {
        const dot = mobileNodeDotRefs.current[index];
        if (!dot) {
          dotCenters.push({ x: 0, y: 0 });
          continue;
        }
        const dotRect = dot.getBoundingClientRect();
        dotCenters.push({
          x: dotRect.left + dotRect.width / 2 - containerRect.left,
          y: dotRect.top + dotRect.height / 2 - containerRect.top,
        });
      }

      for (let index = 0; index < SATELLITE_COUNT; index++) {
        const line = mobileLineRefs.current[index];
        if (!line) continue;
        const parentId = PARENT_ID_BY_ID[index + 1];
        if (parentId === 0) continue;
        const from = dotCenters[parentId - 1];
        const to = dotCenters[index];
        line.setAttribute("x1", String(from.x));
        line.setAttribute("y1", String(from.y));
        line.setAttribute("x2", String(to.x));
        line.setAttribute("y2", String(to.y));
      }
    };

    updateLines();
    const mountTimeout = setTimeout(() => setMobileMounted(true), 20);
    window.addEventListener("resize", updateLines);
    return () => {
      clearTimeout(mountTimeout);
      window.removeEventListener("resize", updateLines);
      setMobileMounted(false);
    };
  }, [isMobile]);

  // Whenever the About Me button is re-clicked while already on this page,
  // aboutMeResetSignal increments; animate any dragged nodes back to their
  // original starting positions instead of leaving the page.
  const isFirstResetRef = useRef(true);
  useEffect(() => {
    if (isFirstResetRef.current) {
      isFirstResetRef.current = false;
      return;
    }
    requestReturnRef.current();
  }, [aboutMeResetSignal]);

  const handlePointerDown = (nodeId: number) => (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    draggingIdRef.current = nodeId;

    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const node = nodesRef.current.find((candidate) => candidate.id === nodeId);
      if (!node) return;
      node.x = moveEvent.clientX - rect.left;
      node.y = moveEvent.clientY - rect.top;
      node.vx = 0;
      node.vy = 0;
    };

    const handlePointerUp = () => {
      // Freeze this node's new position as its resting distance from its
      // parent (center or another satellite) so the spring force doesn't
      // pull it back afterwards.
      const node = nodesRef.current.find((candidate) => candidate.id === nodeId);
      const parent = node ? nodesRef.current[PARENT_ID_BY_ID[node.id]] : undefined;
      if (node && parent && node.id !== 0) {
        const dx = node.x - parent.x;
        const dy = node.y - parent.y;
        node.restLength = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      }

      draggingIdRef.current = null;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  // Phones: a plain static layout (front-page intro text, then the
  // free-floating nodes in a compact grid) instead of the draggable radial
  // mind-map, so everything is readable and mostly fits without scrolling.
  if (isMobile) {
    return (
      <div>
        <TextBlock>
          <p className="mb-4">
            My name is <span className="font-bold text-[#ED2E85]">Cæcilie Lidén Bode</span> and
            I am a digital designer from Copenhagen.
          </p>
          <p className="mb-4">
            I study, analyze and design interactions between people, society and digital technology.
          </p>
          <p className="mb-4">
            Currently I am very interested in concepts of <span className="font-bold text-[#ED2E85]">creativity</span>,{" "}
            <span className="font-bold text-[#ED2E85]">play</span>, and{" "}
            <span className="font-bold text-[#ED2E85]">co-design,</span> and am in a process of
            exploring the digital world and learning new tools.
          </p>
          <p>
            This is my <span className="font-bold text-[#ED2E85]">project parking</span> spot. Here you can see a mix of my digital design
            projects and personal art pieces.
          </p>
        </TextBlock>

        <div ref={mobileContainerRef} className="relative flex flex-col items-center pb-8">
          <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
            {SATELLITE_NODES.map((_, index) => {
              if (PARENT_ID_BY_ID[index + 1] === 0) return null;
              return (
                <line
                  key={index}
                  ref={(el) => {
                    mobileLineRefs.current[index] = el;
                  }}
                  stroke="#ED2E85"
                  strokeWidth="1"
                  strokeLinecap="round"
                  className="transition-opacity duration-500 ease-out"
                  style={{ opacity: mobileMounted ? 1 : 0, transitionDelay: `${80 + index * 40}ms` }}
                />
              );
            })}
          </svg>

          <div className="grid grid-cols-2 gap-x-3 gap-y-4">
            {SATELLITE_NODES.map((satelliteNode, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-1 text-center transition-opacity duration-500 ease-out"
                style={{ opacity: mobileMounted ? 1 : 0, transitionDelay: `${80 + index * 40}ms` }}
              >
                <span
                  ref={(el) => {
                    mobileNodeDotRefs.current[index] = el;
                  }}
                  className="block w-1.5 h-1.5 rounded-full bg-[#ED2E85]"
                />
                {satelliteNode.kind === "text" ? (
                  <p className="text-[11px] leading-snug select-none">{satelliteNode.text}</p>
                ) : (
                  <Image
                    src={satelliteNode.src}
                    alt={satelliteNode.alt}
                    className="w-full h-auto object-cover pointer-events-none"
                    draggable={false}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 pb-12">
      <div className="flex-1">
        <TextBlock>
          <p className="mb-4">
            My name is <span className="font-bold text-[#ED2E85]">Cæcilie Lidén Bode</span> and
            I am a digital designer from Copenhagen.
          </p>
          <p className="mb-4">
            I study, analyze and design interactions between people, society and digital technology.
          </p>
          <p className="mb-4">
            Currently I am very interested in concepts of <span className="font-bold text-[#ED2E85]">creativity</span>,{" "}
            <span className="font-bold text-[#ED2E85]">play</span>, and{" "}
            <span className="font-bold text-[#ED2E85]">co-design,</span> and am in a process of
            exploring the digital world and learning new tools.
          </p>
          <p>
            This is my <span className="font-bold text-[#ED2E85]">project parking</span> spot. Here you can see a mix of my digital design
            projects and personal art pieces.
          </p>
        </TextBlock>
      </div>

      <div ref={containerRef} className="relative flex-[2] h-[600px] sm:h-[700px] touch-none">
        <svg className="absolute inset-0 w-full h-full overflow-visible">
          {SATELLITE_NODES.map((_, index) => {
            if (PARENT_ID_BY_ID[index + 1] === 0) return null;
            return (
              <line
                key={index}
                ref={(el) => {
                  lineElRefs.current[index] = el;
                }}
                stroke="#ED2E85"
                strokeWidth="1"
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {SATELLITE_NODES.map((satelliteNode, index) => {
          const id = index + 1;
          return (
            <div
              key={id}
              ref={(el) => {
                nodeElRefs.current[id] = el;
              }}
              onPointerDown={handlePointerDown(id)}
              className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
            >
              <span className="block w-2 h-2 rounded-full bg-[#ED2E85] -translate-x-1/2 -translate-y-1/2" />
              {satelliteNode.kind === "text" ? (
                <span
                  ref={(el) => {
                    contentElRefs.current[id] = el;
                  }}
                  className="absolute top-full left-0 -translate-x-1/2 mt-1 w-40 sm:w-48 text-xs sm:text-sm text-center leading-snug select-none"
                >
                  {satelliteNode.text}
                </span>
              ) : (
                <div
                  ref={(el) => {
                    contentElRefs.current[id] = el;
                  }}
                  className="absolute top-full left-0 -translate-x-1/2 mt-1 w-24 sm:w-32 select-none"
                >
                  <Image
                    src={satelliteNode.src}
                    alt={satelliteNode.alt}
                    className="w-full h-auto object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
