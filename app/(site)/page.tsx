import ProjectCard from "@/app/components/project-card";

const projects = [
  {
    href: "/projects/co-design-ai-acute-health",
    title: "Co-designing AI for Acute Health Situations\n(Bachelor Thesis Project)",
    year: "2026",
    image: "/projects/co-design-ai-acute-health/thesis-new-new.png",
  },
  {
    href: "/projects/led-installation-strangers-transit",
    title: "Strangers on Transit LED Installation",
    year: "2026",
    image: "/projects/led-installation-strangers-transit/led-new.png",
  },
  {
    href: "/projects/1000-rejections-journey-creative-data-viz",
    title: "1000 Rejections, a Live Experiment\nand Creative Data Visualisation",
    year: "2026",
    image: "/projects/1000-rejections-journey-creative-data-viz/rejections-new.png",
  },
  {
    href: "/projects/codesign-project",
    title: "Co-designing with a Live-Action Roleplay Community",
    year: "2025",
    image: "/projects/codesign-project/roleplay-new.png",
  },
  {
    href: "/projects/never-late-bed",
    title: "Never-Late Bed",
    year: "2024",
    image: "/projects/never-late-bed/neverlate-new.png",
  },
];

export default function Home() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 content-start">
      {projects.map((project) => (
        <ProjectCard key={project.href} {...project} />
      ))}
    </div>
  );
}
