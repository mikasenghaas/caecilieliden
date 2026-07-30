"use client";

import { useFilter } from "@/app/context/filter-context";
import ProjectLink from "@/app/components/project-link";
import thesisImage from "@/app/assets/thesis-front.png";
import neverLateBedImage from "@/app/assets/never-late-bed-front.png";
import ledImage from "@/app/assets/led-installation-front.png";
import roleplayImage from "@/app/assets/roleplay-front.png";

// Mobile-only (below lg) project placement, kept separate from the desktop
// column logic (see thesis-roleplay-slot.tsx) since the two need completely
// different arrangements and must not affect one another.
//
// "all" filter: Thesis stays top of column 1, Never-Late-Bed and Roleplay
// swap places (Never-Late-Bed moves into column 1, Roleplay into column 2),
// and LED moves above the Self Portrait artwork in column 2.
//
// "digital design projects" filter: Roleplay is the only item in column 1;
// Thesis, LED, and Never-Late-Bed stack in that order in column 2.
type Position = "column1-a" | "column1-b" | "column2-a" | "column2-b" | "column2-c";

export default function MobileProjectSlot({ position }: { position: Position }) {
  const { activeFilter } = useFilter();
  if (activeFilter === "drawings & paintings") return null;

  const thesis = (
    <ProjectLink
      href="/projects/co-design-ai-acute-health"
      title="Co-designing AI for Acute Health Situations (Bachelor Thesis Project)"
      year="2026"
      image={thesisImage}
    />
  );
  const neverLateBed = (
    <ProjectLink href="/projects/never-late-bed" title="Never-Late Bed" year="2024" image={neverLateBedImage} />
  );
  const led = (
    <ProjectLink
      href="/projects/led-installation-strangers-transit"
      title="Strangers on Transit LED Installation"
      year="2026"
      image={ledImage}
    />
  );
  const roleplay = (
    <ProjectLink
      href="/projects/codesign-project"
      title="Co-designing with a Live-Action Roleplay Community"
      year="2025"
      image={roleplayImage}
    />
  );

  if (activeFilter === "digital design projects") {
    switch (position) {
      case "column1-b":
        return roleplay;
      case "column2-a":
        return thesis;
      case "column2-b":
        return led;
      case "column2-c":
        return neverLateBed;
      default:
        return null;
    }
  }

  // activeFilter === "all"
  switch (position) {
    case "column1-a":
      return thesis;
    case "column1-b":
      return neverLateBed;
    case "column2-a":
      return led;
    case "column2-b":
      return roleplay;
    default:
      return null;
  }
}
