"use client";

import { useFilter } from "@/app/context/filter-context";
import ProjectLink from "@/app/components/project-link";
import ledImage from "@/app/assets/led-installation.png";
import ledImageHover from "@/app/assets/led-installation-hover.png";
import roleplayImage from "@/app/assets/roleplay-front.png";
import roleplayImageHover from "@/app/assets/roleplay-front-hover.png";

type ProjectKey = "led" | "live-action";

const PROJECTS: Record<ProjectKey, { href: string; title: string; year: string; image?: typeof ledImage; hoverImage?: typeof ledImage }> = {
  led: {
    href: "/projects/led-installation-strangers-transit",
    title: "LED Installation for Strangers on Transit",
    year: "2026",
    image: ledImage,
    hoverImage: ledImageHover,
  },
  "live-action": {
    href: "/projects/codesign-project",
    title: "Co-Design with a Live-Action Roleplay Community",
    year: "2025",
    image: roleplayImage,
    hoverImage: roleplayImageHover,
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

  return (
    <ProjectLink
      href={project.href}
      title={project.title}
      year={project.year}
      image={project.image}
      hoverImage={project.hoverImage}
    />
  );
}
