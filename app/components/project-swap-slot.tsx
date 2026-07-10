"use client";

import { useFilter } from "@/app/context/filter-context";
import ProjectLink from "@/app/components/project-link";

type ProjectKey = "led" | "live-action";

const PROJECTS: Record<ProjectKey, { href: string; title: string; year: string }> = {
  led: {
    href: "/projects/led-installation-strangers-transit",
    title: "LED Installation for Strangers on Transit",
    year: "2026",
  },
  "live-action": {
    href: "/projects/codesign-project",
    title: "Co-Design with a Live-Action Roleplay Community",
    year: "2025",
  },
};

interface ProjectSwapSlotProps {
  slot: "A" | "B";
}

export default function ProjectSwapSlot({ slot }: ProjectSwapSlotProps) {
  const { activeFilter } = useFilter();

  if (activeFilter === "drawings & paintings") return null;

  const isDigitalFilter = activeFilter === "digital design projects";
  const key: ProjectKey = isDigitalFilter
    ? slot === "A"
      ? "led"
      : "live-action"
    : slot === "A"
      ? "live-action"
      : "led";

  const project = PROJECTS[key];

  return <ProjectLink href={project.href} title={project.title} year={project.year} />;
}
