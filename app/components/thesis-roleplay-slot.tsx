"use client";

import { useFilter } from "@/app/context/filter-context";
import ProjectLink from "@/app/components/project-link";
import thesisImage from "@/app/assets/thesis-front.png";
import neverLateBedImage from "@/app/assets/never-late-bed-front.png";
import roleplayImage from "@/app/assets/roleplay-front.png";

// Handles the one part of the 3-column desktop layout that needs to
// rearrange between columns depending on the active filter: for "all", the
// Thesis + Never-Late-Bed pair lives in column 1 and Roleplay lives in
// column 2 (their original, fixed positions). For "digital design
// projects", Roleplay moves to column 1 and the Thesis + Never-Late-Bed
// pair moves to column 2 (Thesis on top, Never-Late-Bed on the bottom).
type Position = "column1-primary" | "column1-secondary" | "column2-primary" | "column2-secondary";

export default function ThesisRoleplaySlot({ position }: { position: Position }) {
  const { activeFilter } = useFilter();
  if (activeFilter === "drawings & paintings") return null;
  const isDigitalFilter = activeFilter === "digital design projects";

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
  const roleplay = (
    <ProjectLink
      href="/projects/codesign-project"
      title="Co-designing with a Live-Action Roleplay Community"
      year="2025"
      image={roleplayImage}
    />
  );

  switch (position) {
    case "column1-primary":
      return isDigitalFilter ? roleplay : thesis;
    case "column1-secondary":
      return isDigitalFilter ? null : neverLateBed;
    case "column2-primary":
      return isDigitalFilter ? thesis : roleplay;
    case "column2-secondary":
      return isDigitalFilter ? neverLateBed : null;
    default:
      return null;
  }
}
