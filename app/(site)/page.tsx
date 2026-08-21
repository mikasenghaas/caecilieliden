import ArtboardCard, { CardDesign } from "@/app/components/artboard-card";

// Each card is drawn in code from its 470x470 Figma artboard: the title and
// footer are real text, and only the photography/illustration is an image.
// `title` stays the long, readable version used as the link's accessible name.
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
        "CO-DESIGNING AI FOR THE DANISH",
        "EMERGENCY MEDICAL HELPLINE",
        "AKUTTELEFONEN 1813",
      ],
      footer: "2026 BACHELOR THESIS PROJECT",
      description:
        "A third of calls are non-acute, because people are unsure what counts as acute. We co-designed interaction policies for an AI that makes them certain.",
      artwork: [
        {
          src: "/projects/co-design-ai-acute-health/photo.png",
          left: 176,
          top: 132,
          width: 204,
          height: 204,
        },
      ],
    },
  },
  {
    href: "/projects/led-installation-strangers-transit",
    title: "Strangers on Transit LED Installation",
    design: {
      lines: ["STRANGERS ON TRANSIT"],
      footer: "2026 LED INSTALLATION",
      description:
        "On transport we sit together but disappear into our phones. I built a playful LED system that lets strangers connect through low stakes interaction.",
      // Only the square photo inside the composite, not the drawing beside it.
      descriptionSlot: { left: 240, top: 232, width: 205, height: 205 },
      artwork: [
        {
          src: "/projects/led-installation-strangers-transit/artwork.png",
          left: 0,
          top: 56,
          width: 470,
          height: 382,
        },
      ],
    },
  },
  {
    href: "/projects/1000-rejections-journey-creative-data-viz",
    title: "1000 Rejections, a Live Experiment and Creative Data Visualization",
    design: {
      lines: ["1000 REJECTIONS"],
      footer: "2026-2027 CREATIVE DATA VISUALIZATION",
      tag: { label: "LIVE EXPERIMENT", color: "#EE2427" },
      description:
        "A live data visualization of 1000 asks/rejections over a year. Every ask I make adds a node to a spiral that grows and flowers outward as I grow.",
      artwork: [
        {
          src: "/projects/1000-rejections-journey-creative-data-viz/dots.png",
          left: 26,
          top: 78,
          width: 204,
          height: 204,
        },
      ],
    },
  },
  {
    href: "/projects/codesign-project",
    title: "Co-designing with a Live-Action Roleplay Community",
    design: {
      lines: ["CO-DESIGN WITH A", "LIVE-ACTION ROLEPLAY COMMUNITY"],
      footer: "2026",
      description:
        "Long check in queues at events were wearing the volunteers down. With them we co-designed a QR-code check in that cuts the manual work.",
      artwork: [
        {
          src: "/projects/codesign-project/photo.png",
          left: 59,
          top: 189,
          width: 204,
          height: 204,
        },
      ],
    },
  },
];

export default function Home() {
  return (
    // Snapped to exactly one or two cards wide, never anything in between, so
    // the row shrink-wraps its cards instead of stretching to whatever space
    // is going. 1328px is where the sidebar, the gap, two cards and the page
    // padding all fit at once — the same width SiteFrame's container snaps at.
    <div className="mx-auto flex max-w-[460px] flex-wrap content-start justify-center gap-6 min-[1328px]:max-w-[944px]">
      {projects.map((project) => (
        <ArtboardCard key={project.href} {...project} />
      ))}
    </div>
  );
}
