import ArticleColumn, {
  ArticleChapter,
  ArticleFigure,
} from "@/app/components/article-column";

// The pictures all live in public/, so they are referenced by path rather than
// imported; each is given the shape of the file it points at so nothing below
// it moves as it loads.
const IMAGES = "/projects/codesign-project";

// A picture in a full-width chapter spans the whole page, not the 390px column
// the default describes.
const FULL_WIDTH_SIZES = "(max-width: 1024px) 100vw, 1266px";

// One chapter per stage of the project, read straight down. The labels are what
// the filter beside the article shows, so they are kept short enough for a pill.
const CHAPTERS: ArticleChapter[] = [
  {
    id: "summary",
    label: "project overview",
    content: (
      <>
        <p>
          In this project, we co-designed with a live-action role-play community
          called Rollespilsfabrikken, which hosts events for children and
          adults. Rather than starting from a predefined focus area, we began
          with an open-ended investigation of the community&apos;s practices and
          challenges.
        </p>
        <p>
          Through this process, event arrivals and check-in flows emerged as a
          central design opportunity for supporting volunteers during busy
          periods, which informed the development of a design concept co-created
          with the community.
        </p>
      </>
    ),
    media: (
      <ArticleFigure
        src={`${IMAGES}/bereal.png`}
        ratio="aspect-[1190/1062]"
        alt="A BeReal taken during the live-action role-play in the nature park"
      />
    ),
  },
  {
    id: "participation",
    label: "participation and workshops",
    content: (
      <>
        <p>
          We approached this project with an intention of understanding the
          community&apos;s lived experiences. We visited them at their clubhouse
          and participated in a live-action role-play in a nature park in
          Copenhagen. After observing, conversing, and fighting with cardboard
          swords, we started to develop an understanding of the
          community&apos;s practices, roles, and challenges.
        </p>
        <p>
          One particular challenge clearly stood out as the most painful one for
          the community. During check-in at the events, volunteers were
          constantly required to guide and assist parents of the children
          participating, causing the queue to be very long.{" "}
          <strong>
            While the parents themselves did not perceive the queue as a big
            problem, the volunteers were clearly affected
          </strong>
          , which led us to focus on the volunteers and treat parents as a
          future stakeholder group.
        </p>
        <p>
          We later learned, as we were exploring the situation through a
          workshop, that their existing sign-up and payment platform was
          confusing the parents and generated frequent support requests during
          event arrivals. Multiple parallel user flows existed depending on the
          user&apos;s situation, resulting in the volunteers handling some
          issues manually around the platform. The workshop highlighted the need
          for a simple solution that could be used under time pressure, with
          minimal interaction steps and fast scanning to avoid delays during
          peak arrival times.
        </p>
      </>
    ),
    media: (
      <>
        <ArticleFigure
          src={`${IMAGES}/queue.png`}
          ratio="aspect-[1768/628]"
          alt="The check-in queue at a live-action role-play event"
        />
        <ArticleFigure
          src={`${IMAGES}/materials.png`}
          ratio="aspect-[1190/430]"
          alt="The materials used in the workshop with the volunteers"
        />
      </>
    ),
  },
  {
    id: "concept",
    label: "the concept",
    content: (
      <p>
        To shape a concept that would make check-ins easier for the volunteers,
        we explored, in collaboration with the volunteers, how a solution could
        look by imagining and enacting different ways of checking in through
        scenario-based activities. A wide range of ideas came to life, including
        additional features and improvements to the existing system. Based on
        this input, we prioritized, together, the needs that directly reduced
        volunteer workload.
      </p>
    ),
  },
  {
    // The prototype and the flowcharts are what the concept came out as, so
    // they follow it at the page's full width instead of shrinking into the
    // picture column beside the paragraph that describes them.
    id: "concept-artefacts",
    label: "the concept in prototype and flowcharts",
    full: true,
    content: (
      <div className="space-y-8">
        <ArticleFigure
          src={`${IMAGES}/prototype.png`}
          ratio="aspect-[1196/490]"
          sizes={FULL_WIDTH_SIZES}
          alt="App prototype showing the QR-code check-in feature"
        />
        {/* The flowchart was exported for the site's old cream background at a
            low opacity — its darkest stroke is only 60% opaque, and pale
            yellow, so on white it all but disappears. The filter throws away
            the colour and multiplies what opacity is there, which puts the
            drawing back on the page as black ink without touching the file. */}
        <div className="[&_img]:[filter:url(#codesign-ink)]">
          <InkFilter />
          <ArticleFigure
            src={`${IMAGES}/flowcharts.png`}
            ratio="aspect-[1210/677]"
            sizes={FULL_WIDTH_SIZES}
            alt="Flowcharts of the check-in before and after our re-design"
          />
        </div>
      </div>
    ),
  },
  {
    id: "results",
    label: "results",
    content: (
      <p>
        Mutual learning was essential in shaping the final concept. The
        volunteers learned from us through the use of design tools that
        supported idea generation and structured conversations. In turn,{" "}
        <strong>
          I learned from the volunteers how playing can make a design process
          more explorative, open, and creative.
        </strong>
      </p>
    ),
  },
  {
    id: "results-artefacts",
    label: "sketches and wireframes from the workshops",
    full: true,
    content: (
      <ArticleFigure
        src={`${IMAGES}/sketches.png`}
        ratio="aspect-[1190/562]"
        sizes={FULL_WIDTH_SIZES}
        alt="Sketches and wireframes made and agreed upon at the workshops"
      />
    ),
  },
];

// Drops the image's own colour and multiplies its alpha, so a drawing exported
// at a fraction of full opacity reads as black ink on the page. sRGB rather
// than the filter default of linearRGB, so the amplified strokes keep the
// weight they were drawn at instead of lightening.
//
// Doubling is the whole range: the darkest stroke in the file is 60% opaque, so
// ×2 takes the labels and connectors to solid black while leaving the box fills
// grey. Anything higher flattens the two together and the labels disappear into
// the boxes they sit in.
function InkFilter() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <filter id="codesign-ink" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 2 0"
        />
      </filter>
    </svg>
  );
}

// Same two lines as this project's card on the front page, so arriving from the
// grid the heading does not change wording under you.
export default function CodesignProjectPage() {
  return (
    <ArticleColumn
      title={
        <span className="whitespace-pre-line">
          {"Co-design with a\nlive-action roleplay community"}
        </span>
      }
      year="2025"
      chapters={CHAPTERS}
    />
  );
}
