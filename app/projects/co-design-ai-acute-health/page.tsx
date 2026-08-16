"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import SlideNav from "@/app/components/slide-nav";
import co3Image from "@/app/assets/co3.png";
import tellMakeImage from "@/app/assets/tellmake.png";
import makeEnactImage from "@/app/assets/makeenact.png";
import co2Image from "@/app/assets/co2.png";

// Same "powerpoint"-style deck as the other two project pages: one slide
// visible at a time, switched via the pill nav fixed to the bottom-middle of
// the screen. Kept to five slides because a sixth pill pushes the nav past
// the width of a phone screen and wraps it onto a second line.
const SLIDES = [
  { id: "project", label: "the project" },
  { id: "process", label: "design process" },
  { id: "events", label: "design events" },
  { id: "results", label: "results" },
  { id: "learnings", label: "learnings" },
];

// Shared "content frame" for every slide: the article's max-w-6xl gives the
// width, CONTENT_HEIGHT the height. Only applied from md up, since below that
// the grids collapse to one column and everything stacks, where a fixed
// height would clip rather than align.
const CONTENT_HEIGHT = "md:h-[30rem]";

// Every photo in the deck explains itself on hover: a tinted layer fades in
// with a description of what the photo shows, and nothing is drawn on the
// photo otherwise. Its container needs the "group" class for this to fire.
function ImageCaption({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-center bg-black/70 p-4 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none">
      <p>{children}</p>
    </div>
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export default function CoDesignAiAcuteHealthPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = SLIDES[activeIndex];

  // Left/right arrow keys step through the slides, clamped to the ends rather
  // than wrapping, since this is a linear narrative and not a cycle like the
  // front-page filter.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isTypingTarget(event.target)) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <style>{`html, body { background-color: #FFFFFF !important; }`}</style>
      <CustomCursor />
      <div className="min-h-screen bg-white text-foreground">
        {/* On phone the flower sits alone in the top-left; the filter is
            pinned to the bottom of the screen instead (see below). */}
        <header className="sm:hidden max-w-[1400px] mx-auto px-4 pt-4 pb-6">
          <FlowerLink fixed={false} />
        </header>

        {/* Tablet and up: flower on its own row, filter pinned near the bottom. */}
        <div className="hidden sm:block px-4 pt-4 md:px-12 lg:p-0">
          <FlowerLink />
        </div>

        <main className="min-h-screen flex flex-col px-6 md:px-12 pb-28">
          {/* Fixed at the same top position on every slide, independent of
              how tall each slide's content is. */}
          <div className="w-full max-w-6xl mx-auto pt-2 sm:pt-16 lg:pt-24">
            <h1 className="text-xs sm:text-sm leading-relaxed mb-1 font-bold [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]">
              Co-designing AI for the Danish emergency medical helpline
              Akuttelefonen 1813 (Bachelor Thesis Project)
            </h1>
            <p className="text-xs sm:text-sm text-foreground/60 [paint-order:stroke_fill] [-webkit-text-stroke:7px_white]">
              2026
            </p>
          </div>

          <div className="flex-1 flex items-start justify-center w-full pt-8 sm:pt-10">
            <article className="w-full max-w-6xl min-h-[240px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSlide.id === "project" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${CONTENT_HEIGHT} text-left text-xs sm:text-sm leading-relaxed`}
                    >
                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          In Denmark&apos;s Capital Region, the emergency
                          medical helpline Akuttelefonen 1813 answers close to
                          900,000 calls a year, roughly a third of them
                          non-acute, and on the busiest days callers wait hours
                          to get through. Together with Amalie Caram&eacute;s
                          Slot Larsen and Caroline Caram&eacute;s Slot Larsen, I
                          explored{" "}
                          <strong>
                            how AI could support this system and reduce
                            non-acute calls without failing people who genuinely
                            need help.
                          </strong>
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          The project started as a question of how to minimize
                          the queue at Akuttelefonen 1813, and developed into a
                          question of how to make citizens more confident and
                          certain about their own situation.
                        </p>
                        <p>
                          We discovered that a reason for many non-acute calls
                          is{" "}
                          <strong>
                            uncertainty about what actually defines an
                            &quot;acute&quot; situation.
                          </strong>{" "}
                          Some call to be on the safe side, while others do not
                          call at all because they do not want to bother the
                          system, even when their situation might be acute.
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          Through a co-design process with citizens who had
                          called Akuttelefonen 1813 before, we developed a set
                          of interaction design policies for an AI self-help
                          system meant to guide people and increase their
                          certainty. We worked with themes such as uncertainty,
                          trust, and self-evaluation, and how these differ
                          across personas. We hoped this would not necessarily
                          only make the queue shorter, but lower the percentage
                          of non-acute callers and make sure the people who need
                          help get it.
                        </p>
                        <p className="text-foreground/50">
                          Our findings were presented to relevant stakeholders
                          in August 2026.
                        </p>
                      </div>
                    </div>
                  ) : activeSlide.id === "process" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${CONTENT_HEIGHT} text-left text-xs sm:text-sm leading-relaxed`}
                    >
                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          <strong>
                            Designing healthcare technology means designing for
                            high risk situations
                          </strong>
                          , where small mistakes have big consequences.
                        </p>
                        <p>
                          A survey or a set of simple interviews would therefore
                          not do. We needed a thorough understanding of the
                          problem area and therefore included{" "}
                          <strong>
                            ten citizens who had called Akuttelefonen 1813
                            before as co-designers.
                          </strong>
                        </p>
                        <p>
                          Involving them this early meant the design was shaped
                          by real needs before anything was built, which matters
                          most when a wrong assumption can cost someone their
                          health.
                        </p>
                        <p>
                          We would have included Akuttelefonen 1813 nurses in
                          the co-design events, since they bring another
                          perspective, but they were busy answering the calls.
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>We conducted:</p>
                        <ul className="list-disc space-y-1 pl-3.5">
                          <li>
                            Three one-on-one interviews with former callers
                          </li>
                          <li>One focus group with three parent couples</li>
                          <li>
                            Two workshops where the real design happened, with a
                            mix of the citizens from the interviews and the
                            focus group plus a few new ones
                          </li>
                        </ul>
                        <p>
                          More specifically, we worked through a Tell-Make-Enact
                          framework, where the phases melted together as a
                          story, a response to it, and a test of that response
                          often happened in the same moment.
                        </p>
                        <p>
                          The main benefit of co-designing the AI in this
                          project was mutual learning: the citizens were the
                          experts on the experience of calling Akuttelefonen
                          1813, on their needs and vulnerabilities, and on the
                          mental models they held of it. We were the experts on
                          design tools and processes, and could notice patterns
                          the citizens were not consciously aware of.
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 md:h-full md:min-h-0">
                        {/* object-cover rather than object-contain, so each
                            photo fills its half of the column exactly and the
                            two end up the same width (the column's) rather than
                            each being sized by its own ratio. */}
                        <div className="group relative h-56 w-full overflow-hidden md:h-auto md:min-h-0 md:flex-1">
                          <Image
                            src={co2Image}
                            alt="Materials from the perfect conversation exercise in the workshops"
                            fill
                            className="object-cover"
                          />
                          <ImageCaption>
                            Materials from the perfect conversation exercise in
                            the workshops.
                          </ImageCaption>
                        </div>
                        <div className="group relative h-56 w-full overflow-hidden md:h-auto md:min-h-0 md:flex-1">
                          <Image
                            src={co3Image}
                            alt="Participants working through the design exercises during the focus group"
                            fill
                            className="object-cover"
                          />
                          <ImageCaption>
                            Participants working through the design exercises
                            during the focus group.
                          </ImageCaption>
                        </div>
                      </div>
                    </div>
                  ) : activeSlide.id === "events" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${CONTENT_HEIGHT} text-left text-xs sm:text-sm leading-relaxed`}
                    >
                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          <strong>Focus group</strong>
                        </p>
                        <p>
                          The initial interviews informed what to look for in
                          the focus group. There we mapped the
                          participants&apos; user journeys with Akuttelefonen
                          1813. To provoke them to reflect on how they had felt
                          along the way, we made the discussion concrete with a
                          timeline and a set of smileys.
                        </p>
                        <p>
                          Later we placed an AI sticker on certain points of
                          their journeys and discussed what AI could mean and
                          look like there. This showed us their motivations,
                          their pains, their understanding of AI, and what the
                          frame of AI could be in this project.
                        </p>
                        <div className="group relative h-56 w-full overflow-hidden md:h-auto md:min-h-0 md:flex-1">
                          <Image
                            src={tellMakeImage}
                            alt="A participant's user journey mapped on a timeline, with smileys marking how each step felt"
                            fill
                            className="object-cover"
                          />
                          <ImageCaption>
                            A participant&apos;s user journey mapped on a
                            timeline, with smileys marking how each step felt.
                          </ImageCaption>
                        </div>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          <strong>Workshops</strong>
                        </p>
                        <p>
                          The centerpiece of the workshops was an exercise
                          called{" "}
                          <strong>&quot;the perfect conversation&quot;</strong>.
                          Participants were asked to imagine they were an AI
                          chat: a fictional user, S&oslash;ren, had hurt his
                          foot, and it was up to them to respond to his messages
                          and guide him through it.
                        </p>
                        <p>
                          At each step we handed them a set of pre-written
                          responses, one per tone, from clinical to highly
                          empathetic. We never said which was which, because we
                          wanted their instinct, not a reasoned case for a
                          style.
                        </p>
                        <p>
                          After each choice we asked why they picked it and what
                          they would rather have heard. That was often more
                          revealing than the choice itself, since it surfaced
                          the gap between an answer that sounds reassuring and
                          one people actually trust.
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3 md:h-full md:min-h-0">
                        {/* Absorbs whatever height the paragraph below leaves
                            over, so the image sits at the top of the column and
                            the text still finishes inside the frame. */}
                        {/* object-contain rather than object-cover, so the full
                            width of the hand of cards is visible instead of
                            being cropped at the sides. The box keeps its height
                            and the leftover fills with the page's white. */}
                        <div className="group relative h-56 w-full overflow-hidden bg-white md:h-auto md:min-h-0 md:flex-1">
                          <Image
                            src={makeEnactImage}
                            alt="A participant holding the pre-written response cards during the perfect conversation exercise"
                            fill
                            className="object-contain"
                          />
                          <ImageCaption>
                            A participant&apos;s hand of AI answers to respond
                            to S&oslash;ren&apos;s prompt.
                          </ImageCaption>
                        </div>
                        <p className="shrink-0">
                          By the end we could lay the cards chosen most often
                          across participants side by side and map the perfect
                          conversation.{" "}
                          <strong>
                            The most informative part, however, was never which
                            response was chosen, but what was said around the
                            choice.
                          </strong>{" "}
                          The hesitation, the reasoning, and the wording
                          participants reached for instead were what told us how
                          the AI should actually speak.
                        </p>
                      </div>
                    </div>
                  ) : activeSlide.id === "results" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-3 gap-6 md:min-h-[30rem] text-left text-xs sm:text-sm leading-relaxed`}
                    >
                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          The result is a set of{" "}
                          <strong>Interaction Design Policies</strong> (a
                          framework adapted from Google&apos;s PAIR), covering
                          the seven critical moments we identified in the focus
                          group and workshops. For each moment we defined what
                          the AI should do, what it should never do, what it
                          does not yet know, and where the user is most at risk.
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          We investigated whether the AI should triage live
                          calls in the queue. The focus group pointed elsewhere,
                          since the bigger stake was the caller&apos;s
                          uncertainty. We agreed on a self-service tool to turn
                          to before calling, showing whether the situation is
                          acute or nudging them to call. The idea came from the
                          citizens who already google their symptoms or ask
                          ChatGPT first.
                        </p>
                      </div>

                      {/* The only column without the image under it, so it runs
                          the full height of the slide. */}
                      <div className="flex flex-col justify-start space-y-3 md:row-span-2">
                        <p>
                          Across both workshops, the perfect conversation
                          converged on a clear pattern. Every participant,
                          without knowing the categories existed, picked the
                          same tone:{" "}
                          <strong>
                            neutral, professional, and action-oriented
                          </strong>
                          . Empathy was actively rejected. Several said a warm
                          or caring tone from an AI felt fake, precisely because
                          they knew it was not a person saying it.
                        </p>
                        <p>
                          The deeper theme connecting all findings is trust.{" "}
                          <strong>
                            Trust in health AI is not one fixed thing, it
                            depends on who is asking.
                          </strong>{" "}
                          The same person who wants a blunt answer about a
                          sprained ankle wants something else when it is their
                          child running a fever at 2am. Some people hesitate to
                          reach out at all, worried about bothering anyone.
                          Others would rather call one time too many. An AI that
                          only spoke in one register would fail one of these
                          groups by design.
                        </p>
                      </div>

                      {/* One of the seven policies, written out as a real table
                          rather than a picture so it stays readable and
                          selectable. Sits under the first two columns and is
                          sized by their combined width. */}
                      <div className="group relative flex flex-col justify-start overflow-hidden md:col-span-2 md:col-start-1 md:-mt-14 md:self-start">
                        <div className="text-[11px] leading-snug transition-opacity duration-200 group-hover:opacity-0 motion-reduce:transition-none">
                          <p className="mb-1.5">
                            <strong>
                              Critical moment 1: The user opens the chat for the
                              first time
                            </strong>
                          </p>
                          <table className="w-full table-fixed border-separate border-spacing-1">
                            <tbody className="align-top">
                              <tr>
                                <th className="bg-black/10 px-2 py-1 text-left font-semibold">
                                  Acceptable actions
                                </th>
                                <th className="bg-black/10 px-2 py-1 text-left font-semibold">
                                  Unacceptable actions
                                </th>
                              </tr>
                              <tr>
                                <td className="bg-black/5 px-2 py-1">
                                  <ul className="list-disc space-y-0.5 pl-3.5">
                                    <li>
                                      Introduces itself as Akuttelefonen
                                      1813&apos;s digital assistant
                                    </li>
                                    <li>Uses a neutral, professional tone</li>
                                    <li>States clearly that it is an AI</li>
                                    <li>
                                      Tells the user to call 112, the Danish
                                      emergency telephone number, if the
                                      situation is life-threatening
                                    </li>
                                  </ul>
                                </td>
                                <td className="bg-black/5 px-2 py-1">
                                  <ul className="list-disc space-y-0.5 pl-3.5">
                                    <li>
                                      Asking &quot;what is your
                                      emergency?&quot;, since the word itself
                                      creates doubt
                                    </li>
                                    <li>
                                      Failing to disclose that it is an AI
                                    </li>
                                    <li>
                                      Failing to mention 112 in a
                                      life-threatening case
                                    </li>
                                    <li>
                                      Assuming anything about the patient or the
                                      situation
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                              <tr>
                                <th className="bg-black/10 px-2 py-1 text-left font-semibold">
                                  Uncertainty thresholds
                                </th>
                                <th className="bg-black/10 px-2 py-1 text-left font-semibold">
                                  Vulnerabilities
                                </th>
                              </tr>
                              <tr>
                                <td className="bg-black/5 px-2 py-1">
                                  <ul className="list-disc space-y-0.5 pl-3.5">
                                    <li>
                                      Does not yet know anything about the user
                                    </li>
                                    <li>
                                      Does not yet know anything about the
                                      situation
                                    </li>
                                    <li>
                                      Does not know how urgent the situation is
                                    </li>
                                    <li>
                                      Does not know what language the user
                                      speaks
                                    </li>
                                  </ul>
                                </td>
                                <td className="bg-black/5 px-2 py-1">
                                  <ul className="list-disc space-y-0.5 pl-3.5">
                                    <li>
                                      User believes they are talking to a human
                                    </li>
                                    <li>
                                      User should call 112, but types to the AI
                                      instead
                                    </li>
                                    <li>
                                      Tone feels too cold or too warm, and the
                                      user does not feel met
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <ImageCaption>
                          One of the seven interaction design policies. Each
                          policy sets out what the AI may do at a critical
                          moment, what it must never do, what it does not yet
                          know, and where the user is most at risk.
                        </ImageCaption>
                      </div>
                    </div>
                  ) : activeSlide.id === "learnings" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${CONTENT_HEIGHT} text-left text-xs sm:text-sm leading-relaxed`}
                    >
                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          Most interaction design deals with something you can
                          pin down. A button does the same thing every time. A
                          screen looks the same to every user. You can build a
                          prototype, hand it to someone, and know exactly what
                          you are testing. AI does not offer that certainty.
                          Funnily enough, the question I found myself asking
                          most throughout this project was &quot;what am I even
                          designing?&quot;
                        </p>
                        <p>
                          Designing for something that behaves differently every
                          time means you cannot predict exactly what will
                          happen. In a sense I like to think of it as I was
                          designing a stage where the interaction plays out.
                          Through the co-design process we shaped that stage,
                          its boundaries and how the AI should behave on it, so
                          citizens would feel comfortable stepping onto it.
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          Another counterintuitive thing I learned is that{" "}
                          <strong>
                            too much trust in a system can be just as dangerous
                            as too little.
                          </strong>{" "}
                          Overtrust means people act on an AI&apos;s suggestion
                          even when their own judgment says something is off.
                          Undertrust means people ignore a system that could
                          actually help them, or abandon it altogether. Going
                          in, I expected undertrust to be the bigger risk in
                          healthcare. It turned out overtrust was the harder one
                          to design against.
                        </p>
                        <p>
                          Part of that is because trust here is borrowed.
                          Citizens said they would trust an AI far more coming
                          from Akuttelefonen 1813 than from a private app, which
                          makes them willing to use it, and at the same time
                          makes its answers sound more certain than they are.
                        </p>
                      </div>

                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          The question I could not answer is who carries the
                          responsibility. If a citizen follows the AI and comes
                          to harm, is it the developers, the region,
                          Akuttelefonen 1813, or the citizen? Saying the final
                          call is always the citizen&apos;s is easier in theory
                          than in practice, since the relationship is never
                          equal.
                        </p>
                        <p>
                          What we could do was design for that asymmetry rather
                          than pretend it away. In a domain where one kind of
                          mistake is survivable and the other is not, it is
                          better for the AI to send ten citizens too many than
                          one too few.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </article>
          </div>
        </main>

        {/* Slide nav: fixed to the bottom-middle of the screen. On phone it
            sits in a full-width white footer bar flush with the bottom edge,
            so content scrolling past does not show through behind it. From sm
            up it floats free over the page as before. */}
        <div className="flex fixed inset-x-0 bottom-0 sm:bottom-20 z-40 justify-center px-4 py-4 sm:py-0 bg-white sm:bg-transparent pointer-events-none">
          <div className="pointer-events-auto">
            <SlideNav
              slides={SLIDES}
              activeIndex={activeIndex}
              onSelect={setActiveIndex}
            />
          </div>
        </div>
      </div>
    </>
  );
}
