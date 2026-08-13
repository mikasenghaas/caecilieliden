import ProjectCard from "@/app/components/project-card";

// The cards are pure artwork — the title is baked into each image rather than
// drawn over it, so it's kept here only as the image's alt text.
const projects = [
  {
    href: "/projects/co-design-ai-acute-health",
    title: "Co-designing AI for Acute Health Service (Bachelor Thesis Project)",
    image: "/projects/co-design-ai-acute-health/card.png",
  },
  {
    href: "/projects/led-installation-strangers-transit",
    title: "Strangers on Transit LED Installation",
    image: "/projects/led-installation-strangers-transit/card.png",
  },
  {
    href: "/projects/1000-rejections-journey-creative-data-viz",
    title: "1000 Rejections, a Live Experiment and Creative Data Visualisation",
    image: "/projects/1000-rejections-journey-creative-data-viz/card.png",
  },
  {
    href: "/projects/codesign-project",
    title: "Co-designing with a Live-Action Roleplay Community",
    image: "/projects/codesign-project/card.png",
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
