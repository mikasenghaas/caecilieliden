import { Fragment } from "react";
import ArticleColumn, {
  ArticleChapter,
  ArticleFigure,
  ArticleSubheading,
} from "@/app/components/article-column";
import co3Image from "@/app/assets/co3.png";
import tellMakeImage from "@/app/assets/tellmake.png";
import makeEnactImage from "@/app/assets/makeenact.png";
import co2Image from "@/app/assets/co2.png";

// The four panels of one policy, in reading order. Kept as data rather than
// markup because the table below lays them out two across, so each panel's
// heading and its points are needed in two different rows.
const POLICY_PANELS = [
  {
    title: "Acceptable actions",
    items: [
      "Introduces itself as Akuttelefonen 1813's digital assistant",
      "Uses a neutral, professional tone",
      "States clearly that it is an AI",
      "Tells the user to call 112, the Danish emergency telephone number, if the situation is life-threatening",
    ],
  },
  {
    title: "Unacceptable actions",
    items: [
      "Asking \u201cwhat is your emergency?\u201d, since the word itself creates doubt",
      "Failing to disclose that it is an AI",
      "Failing to mention 112 in a life-threatening case",
      "Assuming anything about the patient or the situation",
    ],
  },
  {
    title: "Uncertainty thresholds",
    items: [
      "Does not yet know anything about the user",
      "Does not yet know anything about the situation",
      "Does not know how urgent the situation is",
      "Does not know what language the user speaks",
    ],
  },
  {
    title: "Vulnerabilities",
    items: [
      "User believes they are talking to a human",
      "User should call 112, but types to the AI instead",
      "Tone feels too cold or too warm, and the user does not feel met",
    ],
  },
];

// One chapter per stage of the project, read straight down, the text side
// alternating left and right as you go.
const CHAPTERS: ArticleChapter[] = [
  {
    id: "summary",
    label: "project overview",
    content: (
      <>
        <p>
          In Denmark&apos;s Capital Region, the emergency medical helpline
          Akuttelefonen 1813 answers close to 900,000 calls a year, roughly a
          third of them non-acute, and on the busiest days callers wait hours to
          get through. Together with Amalie Caram&eacute;s Slot Larsen and
          Caroline Caram&eacute;s Slot Larsen, I explored{" "}
          <strong>
            how AI could support this system and reduce non-acute calls without
            failing people who genuinely need help.
          </strong>
        </p>
        <p>
          The project started as a question of how to minimize the queue at
          Akuttelefonen 1813, and developed into a question of how to make
          citizens more confident and certain about their own situation.
        </p>
        <p>
          We discovered that a reason for many non-acute calls is{" "}
          <strong>
            uncertainty about what actually defines an &quot;acute&quot;
            situation.
          </strong>{" "}
          Some call to be on the safe side, while others do not call at all
          because they do not want to bother the system, even when their
          situation might be acute.
        </p>
        <p>
          Through a co-design process with citizens who had called Akuttelefonen
          1813 before, we developed a set of interaction design policies for an
          AI self-help system meant to guide people and increase their
          certainty. We worked with themes such as uncertainty, trust, and
          self-evaluation, and how these differ across personas. We hoped this
          would not necessarily only make the queue shorter, but lower the
          percentage of non-acute callers and make sure the people who need help
          get it.
        </p>
        <p>
          Our findings were presented to relevant stakeholders in August 2026.
        </p>
      </>
    ),
  },
  {
    id: "process",
    label: "design process",
    content: (
      <>
        <p>
          <strong>
            Designing healthcare technology means designing for high risk
            situations
          </strong>
          , where small mistakes have big consequences.
        </p>
        <p>
          A survey or a set of simple interviews would therefore not do. We
          needed a thorough understanding of the problem area and therefore
          included{" "}
          <strong>
            ten citizens who had called Akuttelefonen 1813 before as
            co-designers.
          </strong>
        </p>
        <p>
          Involving them this early meant the design was shaped by real needs
          before anything was built, which matters most when a wrong assumption
          can cost someone their health.
        </p>
        <p>
          We would have included Akuttelefonen 1813 nurses in the co-design
          events, since they bring another perspective, but they were busy
          answering the calls.
        </p>
        <p>We conducted:</p>
        <ul className="list-disc space-y-1 pl-3.5">
          <li>Three one-on-one interviews with former callers</li>
          <li>One focus group with three parent couples</li>
          <li>
            Two workshops where the real design happened, with a mix of the
            citizens from the interviews and the focus group plus a few new ones
          </li>
        </ul>
        <p>
          More specifically, we worked through a Tell-Make-Enact framework,
          where the phases melted together as a story, a response to it, and a
          test of that response often happened in the same moment.
        </p>
        <p>
          The main benefit of co-designing the AI in this project was mutual
          learning: the citizens were the experts on the experience of calling
          Akuttelefonen 1813, on their needs and vulnerabilities, and on the
          mental models they held of it. We were the experts on design tools and
          processes, and could notice patterns the citizens were not consciously
          aware of.
        </p>
      </>
    ),
    media: (
      <>
        <ArticleFigure
          src={co2Image}
          alt="Materials from the perfect conversation exercise in the workshops"
        />
        <ArticleFigure
          src={co3Image}
          alt="Participants working through the design exercises during the focus group"
        />
      </>
    ),
  },
  {
    id: "events",
    label: "design events",
    content: (
      <>
        <ArticleSubheading>focus groups</ArticleSubheading>
        <p>
          The initial interviews informed what to look for in the focus group.
          There we mapped the participants&apos; user journeys with
          Akuttelefonen 1813. To provoke them to reflect on how they had felt
          along the way, we made the discussion concrete with a timeline and a
          set of smileys.
        </p>
        <p>
          Later we placed an AI sticker on certain points of their journeys and
          discussed what AI could mean and look like there. This showed us their
          motivations, their pains, their understanding of AI, and what the
          frame of AI could be in this project.
        </p>

        <ArticleSubheading>workshops</ArticleSubheading>
        <p>
          The centerpiece of the workshops was an exercise called{" "}
          <strong>&quot;the perfect conversation&quot;</strong>. Participants
          were asked to imagine they were an AI chat: a fictional user,
          S&oslash;ren, had hurt his foot, and it was up to them to respond to
          his messages and guide him through it.
        </p>
        <p>
          At each step we handed them a set of pre-written responses, one per
          tone, from clinical to highly empathetic. We never said which was
          which, because we wanted their instinct, not a reasoned case for a
          style.
        </p>
        <p>
          After each choice we asked why they picked it and what they would
          rather have heard. That was often more revealing than the choice
          itself, since it surfaced the gap between an answer that sounds
          reassuring and one people actually trust.
        </p>
        <p>
          By the end we could lay the cards chosen most often across
          participants side by side and map the perfect conversation.{" "}
          <strong>
            The most informative part, however, was never which response was
            chosen, but what was said around the choice.
          </strong>{" "}
          The hesitation, the reasoning, and the wording participants reached
          for instead were what told us how the AI should actually speak.
        </p>
      </>
    ),
    media: (
      <>
        <ArticleFigure
          src={tellMakeImage}
          alt="A participant's user journey mapped on a timeline, with smileys marking how each step felt"
        />
        {/* The picture opens with Søren's message in an outlined box, which at
            this size stops reading as a speech bubble and just draws a black
            rule across the top. The shape crops that quarter off and the
            bottom edge holds the fan of response cards in frame. */}
        <ArticleFigure
          src={makeEnactImage}
          ratio="aspect-[173/100]"
          align="object-bottom"
          alt="The fan of pre-written response cards, one per tone, laid out for the perfect conversation exercise"
        />
      </>
    ),
  },
  {
    id: "results",
    label: "results",
    content: (
      <>
        <p>
          The result is a set of <strong>Interaction Design Policies</strong> (a
          framework adapted from Google&apos;s PAIR), covering the seven
          critical moments we identified in the focus group and workshops. For
          each moment we defined what the AI should do, what it should never do,
          what it does not yet know, and where the user is most at risk.
        </p>
        <p>
          We investigated whether the AI should triage live calls in the queue.
          The focus group pointed elsewhere, since the bigger stake was the
          caller&apos;s uncertainty. We agreed on a self-service tool to turn to
          before calling, showing whether the situation is acute or nudging them
          to call. The idea came from the citizens who already google their
          symptoms or ask ChatGPT first.
        </p>

        <p>
          Across both workshops, the perfect conversation converged on a clear
          pattern. Every participant, without knowing the categories existed,
          picked the same tone:{" "}
          <strong>neutral, professional, and action-oriented</strong>. Empathy
          was actively rejected. Several said a warm or caring tone from an AI
          felt fake, precisely because they knew it was not a person saying it.
        </p>
        <p>
          The deeper theme connecting all findings is trust.{" "}
          <strong>
            Trust in health AI is not one fixed thing, it depends on who is
            asking.
          </strong>{" "}
          The same person who wants a blunt answer about a sprained ankle wants
          something else when it is their child running a fever at 2am. Some
          people hesitate to reach out at all, worried about bothering anyone.
          Others would rather call one time too many. An AI that only spoke in
          one register would fail one of these groups by design.
        </p>
      </>
    ),
    // One of the seven policies, written out as a real table rather than a
    // picture so it stays readable and selectable. Two panels across rather
    // than four stacked: stacked, the table ran far longer than the prose it
    // sits beside, and paired it is about half as tall. The line naming the
    // moment reads as a caption under the table rather than a title over it,
    // like the pictures in the other chapters.
    media: (
      <figure className="text-[11px] leading-snug">
        <table className="w-full table-fixed border-separate border-spacing-0 border border-black bg-white">
          <tbody className="align-top">
            {[0, 2].map((start) => {
              const pair = POLICY_PANELS.slice(start, start + 2);
              // Only the first pair carries a rule below it; the table's own
              // border closes the last one.
              const under = start === 0 ? "border-b border-black" : "";

              return (
                <Fragment key={start}>
                  <tr>
                    {pair.map((panel, column) => (
                      <th
                        key={panel.title}
                        className={`border-b border-black px-1.5 py-1 text-left font-bold ${
                          column === 0 ? "border-r border-black" : ""
                        }`}
                      >
                        {panel.title}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    {pair.map((panel, column) => (
                      <td
                        key={panel.title}
                        className={`px-1.5 py-1.5 ${under} ${
                          column === 0 ? "border-r border-black" : ""
                        }`}
                      >
                        <ul className="list-disc space-y-1 pl-3">
                          {panel.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </Fragment>
              );
            })}
          </tbody>
        </table>
        <figcaption className="mt-2 font-bold">
          Critical moment 1: The user opens the chat for the first time
        </figcaption>
      </figure>
    ),
  },
  {
    id: "reflections",
    label: "reflections and learnings",
    content: (
      <>
        <p>
          Most interaction design deals with something you can pin down. A
          button does the same thing every time. A screen looks the same to
          every user. You can build a prototype, hand it to someone, and know
          exactly what you are testing. AI does not offer that certainty.
          Funnily enough, the question I found myself asking most throughout
          this project was &quot;what am I even designing?&quot;
        </p>
        <p>
          Designing for something that behaves differently every time means you
          cannot predict exactly what will happen. In a sense I like to think of
          it as I was designing a stage where the interaction plays out. Through
          the co-design process we shaped that stage, its boundaries and how the
          AI should behave on it, so citizens would feel comfortable stepping
          onto it.
        </p>
        <p>
          Another counterintuitive thing I learned is that{" "}
          <strong>
            too much trust in a system can be just as dangerous as too little.
          </strong>{" "}
          Overtrust means people act on an AI&apos;s suggestion even when their
          own judgment says something is off. Undertrust means people ignore a
          system that could actually help them, or abandon it altogether. Going
          in, I expected undertrust to be the bigger risk in healthcare. It
          turned out overtrust was the harder one to design against.
        </p>
        <p>
          Part of that is because trust here is borrowed. Citizens said they
          would trust an AI far more coming from Akuttelefonen 1813 than from a
          private app, which makes them willing to use it, and at the same time
          makes its answers sound more certain than they are.
        </p>
        <p>
          The question I could not answer is who carries the responsibility. If
          a citizen follows the AI and comes to harm, is it the developers, the
          region, Akuttelefonen 1813, or the citizen? Saying the final call is
          always the citizen&apos;s is easier in theory than in practice, since
          the relationship is never equal.
        </p>
        <p>
          What we could do was design for that asymmetry rather than pretend it
          away. In a domain where one kind of mistake is survivable and the
          other is not, it is better for the AI to send ten citizens too many
          than one too few.
        </p>
      </>
    ),
  },
];

// Same two lines as this project's card on the front page, including its own
// line break, so arriving from the grid the heading does not change wording or
// shape under you.
export default function CoDesignAiAcuteHealthPage() {
  return (
    <ArticleColumn
      title={
        <span className="whitespace-pre-line">
          {
            "Co-designing AI for the Danish emergency medical helpline\nAkuttelefonen 1813"
          }
        </span>
      }
      year="2026 bachelor thesis project"
      chapters={CHAPTERS}
    />
  );
}
