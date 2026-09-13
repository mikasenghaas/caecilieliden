import ArticleColumn, {
  ArticleChapter,
  ArticleFigure,
  ArticleSubheading,
} from "@/app/components/article-column";
import YouTubeEmbed from "@/app/components/youtube-embed";
import strangersImage from "@/app/assets/strangers.png";
import friendImage from "@/app/assets/friend.png";
import stogImage from "@/app/assets/stog.png";
import ledImage from "@/app/assets/ledmig.png";

// One chapter per stage of the project, read straight down. The labels are what
// the filter beside the article shows, so they are kept short enough for a pill.
const CHAPTERS: ArticleChapter[] = [
  {
    id: "concept",
    label: "design concept",
    content: (
      <>
        <p>
          Public transport is a space where passengers are neither working nor
          resting, and many fill the void with their phones or daydreaming.
        </p>
        <p>
          I saw it as a site for something more meaningful and playful, which is
          why this project explores how play can open up the liminal, in-between
          state of public transport, while experimenting with how play can be
          used as part of design processes.
        </p>
        <p>
          I ended up designing an interactive LED system, where passengers can
          interact with each other indirectly. From your seat, a joystick lets
          you steer a small light, or &quot;character,&quot; along LED strips
          that wrap around the vehicle&apos;s architecture. Along the way you
          can blink at, chase, and high-five the lights of fellow passengers.
        </p>
      </>
    ),
  },
  {
    // The video is the concept moving rather than described, so it follows
    // straight on from the concept and takes the page's full width — the
    // picture column would have shown it at a third of the size.
    id: "installation",
    label: "the installation",
    full: true,
    // The embed carries vertical margin of its own, for when it sits partway
    // through a run of prose. Here it is the whole chapter, so the heading's
    // own spacing is the only spacing wanted and its margin is cancelled.
    content: (
      <div className="[&>figure]:my-0">
        <YouTubeEmbed videoId="5nCzgXgS_kk" />
      </div>
    ),
  },
  {
    id: "motivation",
    label: "motivation",
    content: (
      <>
        <p>What motivated this project was two questions:</p>
        <ol className="list-inside list-decimal space-y-2 text-[#ED2E85] marker:text-[#ED2E85]">
          <li>How can play be used as a design approach?</li>
          <li>How can I get even the most serious person to play?</li>
        </ol>
        <p>
          These two questions were all I started with. It was only through the
          design process that I came to understand why play matters and why
          public transport is such an interesting design space.
        </p>

        <ArticleSubheading>why play?</ArticleSubheading>
        <p>
          Most of the spaces around us are designed to make us productive. Even
          the time we spend waiting is optimized, filled, scrolled through. Free
          time, genuinely unstructured and un-owned, is rare. I find play
          important because it resists this. It&apos;s not productive, it&apos;s
          not for anything, and that&apos;s exactly why it matters to me. Play
          is a small refusal, a moment where we take a space back for ourselves.
        </p>

        <ArticleSubheading>and why public transport?</ArticleSubheading>
        <p>
          Third places are rare, spaces that aren&apos;t home or work, where we
          can just exist among others. Public transport isn&apos;t quite that
          either, but it might be the closest thing many of us have, the one
          place we&apos;re still forced to share space with the general public.
          So what&apos;s the point of that closeness if no one is actually
          present? Most of us disappear into our phones the moment we sit down,
          physically together, but somewhere else entirely. I wanted to see if
          people could be pulled back into the room they&apos;re already sitting
          in.
        </p>
      </>
    ),
    media: (
      <>
        <ArticleFigure
          src={stogImage}
          alt="Passengers on an S-train"
        />
        <ArticleFigure
          src={strangersImage}
          alt="Passengers on a train"
        />
      </>
    ),
  },
  {
    id: "method",
    label: "design process",
    content: (
      <>
        <p>
          Rather than plan the design process upfront, I approached the project
          through &quot;revealing&quot;. This meant{" "}
          <strong>staying open to what emerged</strong>, instead of
          &quot;enframing,&quot; which forces the material into a predetermined
          shape.
        </p>
        <p>
          From academics, I am used to working through enframing, sorting the
          design process into categories and often following the double diamond
          model. I was interested in trying something different like revealing,
          because I wanted the process to{" "}
          <strong>feel like I was playing</strong>, making my own rules and
          following my intuition of what the next step was.
        </p>
        <p>
          In practice, this meant starting from what motivated me, making people
          play, and seeing where it led me. To make people play, I needed to
          understand the openings and limitations of public transport. I gave a
          friend prompts to reflect on what play could be on public transport,
          then started generating ideas from her input. Eventually I came up
          with a concept that went through phases of adjustment, based on input
          from my conversations with people and things I read.
        </p>
        <p>
          The prototype was built with an Arduino Uno, WS2812B LED strips, and
          custom cardboard controllers, using the FastLED library. The
          interaction logic in C++ was written with Claude Code.
        </p>
      </>
    ),
    // Given its own portrait shape rather than being letterboxed inside a
    // landscape one, so it fills the column edge to edge instead of sitting in
    // a band of white.
    media: (
      <ArticleFigure
        src={friendImage}
        ratio="aspect-[502/668]"
        alt="A friend reflecting on play prompts"
      />
    ),
  },
  {
    id: "testing",
    label: "testing",
    content: (
      <>
        <p>
          Besides smaller and less structured testing, I did one bigger test.
          Here I planted an upscaled version of the prototype in a student
          caf&eacute;, on the counter where people waited for their coffee, and
          sat in the corner to observe.
        </p>
        <p>
          While a caf&eacute; does not fully represent public transport, I
          considered it a smaller scale waiting space, which made it more
          fitting for this stage of the project.
        </p>
        <ArticleSubheading>what happened?</ArticleSubheading>
        <p>
          I was really happy to see that people discovered the system unprompted
          and invented their own games with it, racing lights, trying to
          &quot;collide,&quot; and sneaking around invisibly by holding down the
          button, all while interacting with strangers through it.
        </p>
        <p>
          Many were curious, but not everyone tried it, and in general they
          didn&apos;t try it for long.
        </p>
        <p>
          The tests confirmed there&apos;s real potential for playful, unplanned
          interaction between strangers in waiting spaces. Designing for play
          means designing at the edge of a space&apos;s unwritten rules, its
          &quot;wiggle space.&quot;
        </p>
        <p>
          The test showed me where the caf&eacute;&apos;s edges sit. Staying
          quiet in the queue was negotiable, and strangers ended up talking
          about the lights. Waiting longer for your coffee was not. When the
          baristas kept playing instead of serving, someone asked them to get
          back to it.
        </p>
      </>
    ),
    media: (
      <ArticleFigure
        src="/projects/led-installation-strangers-transit/cafe.png"
        ratio="aspect-[1190/668]"
        alt="Strangers interacting with each other during a test in café Analog at ITU"
      />
    ),
  },
  {
    id: "result",
    label: "learnings",
    content: (
      <>
        <p>
          Working through the design process by letting openings reveal
          themselves, I experienced a form of creative freedom that let me
          approach the project with playfulness rather than control. I observed
          myself spending more time in conversation with the materials, and made
          several{" "}
          <strong>
            unplanned discoveries that turned out to be the most important ones
            of this project.
          </strong>
        </p>
        <p>
          I discovered that play can be used as a design approach by{" "}
          <strong>designing the frame, rather than the behavior.</strong> I
          didn&apos;t script an interaction or a game with specific rules.
          Instead I built a stage with minimal rules, and stepped back. The
          moments that worked best (racing lights, sneaking around invisibly,
          colliding on purpose) were things people found on their own.
        </p>
        <p>
          I also learned that getting even the most serious person to play
          depends on <strong>understanding the wiggle space</strong> of the
          design space, which is where the risk lies. Push too far and it tips
          into boundary work, where people defend the norm instead of playing
          with it. The goal isn&apos;t to break the rules of a space, but to
          nudge just enough that a rule becomes visible and negotiable. This
          also points to the downside of revealing. I am still not sure what the
          space of public transport allows, and a more enframed process would
          likely have covered that early on.
        </p>
      </>
    ),
    media: (
      <ArticleFigure
        src={ledImage}
        alt="The finished LED installation running in the vehicle"
      />
    ),
  },
];

// Same two lines as this project's card on the front page, so arriving from the
// grid the heading does not change wording under you.
export default function LedInstallationPage() {
  return (
    <ArticleColumn
      title="Strangers on transit"
      year="2026"
      chapters={CHAPTERS}
    />
  );
}
