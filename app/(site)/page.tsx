import ArtboardCard, { CardDesign } from "@/app/components/artboard-card";

// Each card is drawn in code from its 964x470 Figma artboard: the title, year,
// intro and keywords are all real text, and only the photography/illustration
// is an image. `title` stays the long, readable version used as the link's
// accessible name.
const projects: {
  href: string;
  title: string;
  design: CardDesign;
}[] = [
  {
    href: "/projects/co-design-ai-acute-health",
    title:
      "Co-designing AI for the Danish emergency medical helpline Akuttelefonen 1813 (Bachelor Thesis Project)",
    design: {
      lines: [
        "Co-designing AI for the Danish emergency medical helpline",
        "Akuttelefonen 1813",
      ],
      footer: "2026 bachelor thesis project",
      description:
        'Denmark\'s emergency helpline Akuttelefonen 1813 answers ~900,000 calls a year. A third of the calls are non-acute, with wait times of hours on the busiest days. We found uncertainty to be the main cause. People cannot tell whether their own situation counts as "acute." Through co-design with former callers, we developed a set of interaction design policies for an AI self-triage system that helps people assess their own situation with confidence.',
      keywords: [
        "Healthcare",
        "Participatory AI",
        "Co-design",
        "Interaction Design",
      ],
      artwork: [{ src: "/projects/co-design-ai-acute-health/aico.png" }],
    },
  },
  {
    href: "/projects/led-installation-strangers-transit",
    title: "Strangers on Transit LED Installation",
    design: {
      lines: ["Strangers on transit"],
      footer: "2026 led installation",
      description:
        "On transport we sit together but disappear into our phones. I built a playful LED system that lets strangers connect through low stakes interaction.",
      keywords: ["Play", "Interaction Design", "Arduino", "Public Space"],
      artwork: [
        { src: "/projects/led-installation-strangers-transit/artwork.png" },
      ],
    },
  },
  {
    href: "/projects/1000-rejections-journey-creative-data-viz",
    title: "1000 Rejections, a Live Experiment and Creative Data Visualization",
    design: {
      lines: ["1000 rejections"],
      footer: "2026-2027 creative data visualization",
      tag: { label: "live experiment", color: "#EE2427" },
      description:
        "A live data visualization of 1000 asks/rejections over a year. Every ask I make adds a node to a spiral that grows and flowers outward as I grow.",
      keywords: ["Creative Coding", "Data Visualization", "Personal Data"],
      artwork: [
        { src: "/projects/1000-rejections-journey-creative-data-viz/dots.png" },
      ],
    },
  },
  {
    href: "/projects/codesign-project",
    title: "Co-designing with a Live-Action Roleplay Community",
    design: {
      lines: ["Co-design with a", "live-action roleplay community"],
      footer: "2025",
      description:
        "Long check in queues at events were wearing the volunteers down. With them we co-designed a QR-code check in that cuts the manual work.",
      keywords: ["Participatory Design", "Co-design", "Mutual Learning"],
      artwork: [{ src: "/projects/codesign-project/photo.png" }],
    },
  },
];

export default function Home() {
  return (
    // Snapped to exactly one or two cards wide, never anything in between, so
    // the row shrink-wraps its cards instead of stretching to whatever space
    // is going. The switch is a container query on the content column, so it
    // happens the moment that column really can hold a 944px card and not a
    // pixel before — see the note on the container in SiteFrame.
    <div className="mx-auto flex max-w-[460px] flex-wrap content-start justify-center gap-6 @min-[944px]:max-w-[944px]">
      {projects.map((project) => (
        <ArtboardCard key={project.href} {...project} />
      ))}
    </div>
  );
}
