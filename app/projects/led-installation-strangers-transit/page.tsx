"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import FlowerLink from "@/app/components/flower-link";
import CustomCursor from "@/app/components/custom-cursor";
import SlideNav from "@/app/components/slide-nav";
import strangersImage from "@/app/assets/strangers.png";
import friendImage from "@/app/assets/friend.png";
import stogImage from "@/app/assets/stog.png";
import pr1Image from "@/app/assets/pr1.png";
import pr3Image from "@/app/assets/pr3.png";
import ledImage from "@/app/assets/ledmig.png";

// "Powerpoint"-style presentation of the project: one stage visible at a
// time, switched via the pill nav fixed to the bottom-middle of the screen
// (same look/animation as the front-page filter). Only "concept" has its
// real layout/content so far — the rest render nothing until their content
// is ready.
const SLIDES = [
  { id: "concept", label: "design concept" },
  { id: "motivation", label: "motivation" },
  { id: "method", label: "design process" },
  { id: "testing", label: "testing" },
  { id: "result", label: "learnings" },
];

// Every slide lays its content out inside the same "content frame": the
// article's max-w-6xl gives the shared width, and CONTENT_HEIGHT gives the
// shared height. The frame is sized to the concept slide, whose video is the
// tallest thing in the deck — 26rem is that video's height (the concept
// image's h-72 plus the mt-3 gap and its ~5-line caption below it), so the
// concept slide keeps the proportions it already had while every other slide
// now has a definite box to fill instead of just sizing to its own content.
//
// Only applied from md up: below that the grid collapses to one column and
// everything stacks, so a fixed frame height would overflow rather than align.
const CONTENT_HEIGHT = "md:h-[26rem]";
const MEDIA_HEIGHT_MOBILE = "h-52 sm:h-64";
const VIDEO_HEIGHT_MOBILE = "h-64 sm:h-80 md:h-full";

// From the design process slide onwards, every photo explains itself on
// hover: a tinted layer fades in with a description of what it shows, while
// anything already drawn on the photo fades out so the two never stack. The
// photo's container needs the "group" class for this to fire.
const FADE_ON_HOVER =
  "transition-opacity duration-200 group-hover:opacity-0 motion-reduce:transition-none";

function ImageCaption({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-center bg-black/70 p-4 text-left text-xs sm:text-sm leading-relaxed text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 motion-reduce:transition-none">
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

export default function LedInstallationPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = SLIDES[activeIndex];

  // Left/right arrow keys step through the slides, clamped to the ends
  // (rather than wrapping) since this is a linear concept -> result
  // narrative, not a cycle like the front-page filter.
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
              Strangers on Transit
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
                  {activeSlide.id === "concept" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${CONTENT_HEIGHT}`}
                    >
                      <div className="md:col-span-5 flex flex-col md:h-full">
                        <div
                          className={`relative w-full ${MEDIA_HEIGHT_MOBILE} md:h-auto md:flex-1 overflow-hidden`}
                        >
                          <Image
                            src={strangersImage}
                            alt="Passengers on a train"
                            fill
                            priority
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
                          <div className="absolute inset-x-0 bottom-0 p-4 text-xs sm:text-sm leading-relaxed text-white space-y-3">
                            <p>
                              Public transport is a space where passengers are
                              neither working nor resting, and many fill the
                              void with their phones or daydreaming.
                            </p>
                            <p>
                              I saw it as a site for something more meaningful
                              and playful, which is why this project explores
                              how <strong className="text-white">play</strong>{" "}
                              can open up the liminal, in-between state of
                              public transport, while experimenting with how
                              play can be used as part of design processes.
                            </p>
                          </div>
                        </div>
                        <p className="text-left text-xs sm:text-sm leading-relaxed mt-3 px-4 shrink-0">
                          I ended up designing an{" "}
                          <strong>interactive LED system</strong>, where
                          passengers can interact with each other indirectly.
                          From your seat, a joystick lets you steer a small
                          light, or &quot;character,&quot; along LED strips that
                          wrap around the vehicle&apos;s architecture. Along the
                          way you can blink at, chase, and high-five the lights
                          of fellow passengers.
                        </p>
                      </div>

                      <div
                        className={`md:col-span-7 relative w-full ${VIDEO_HEIGHT_MOBILE} overflow-hidden`}
                      >
                        <iframe
                          className="absolute inset-0 w-full h-full"
                          src="https://www.youtube-nocookie.com/embed/5nCzgXgS_kk"
                          title="Strangers on Transit LED Installation"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : activeSlide.id === "motivation" ? (
                    <div
                      className={`grid grid-cols-1 md:grid-cols-12 gap-6 ${CONTENT_HEIGHT}`}
                    >
                      <div className="md:col-span-5 flex flex-col justify-start">
                        <p className="text-xs sm:text-sm leading-relaxed mb-3">
                          What motivated this project was two questions:
                        </p>
                        <ol className="list-decimal list-inside text-xs sm:text-sm leading-relaxed space-y-2">
                          <li>How can play be used as a design approach?</li>
                          <li>
                            How can I get even the most serious person to play?
                          </li>
                        </ol>
                        <p className="text-xs sm:text-sm leading-relaxed mt-3">
                          These two questions were all I started with. It was
                          only through the design process that I came to
                          understand why play matters and why public transport
                          is such an interesting design space.
                        </p>
                      </div>

                      {/* Taller than the other slides' images below md, since
                          the overlay text is long and the container clips. */}
                      <div className="md:col-span-7 relative w-full h-[28rem] md:h-full overflow-hidden">
                        <Image
                          src={stogImage}
                          alt="Passengers on an S-train"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50" />
                        <div className="absolute inset-0 flex flex-col justify-end items-start p-4 sm:p-6 text-left text-xs sm:text-sm leading-relaxed text-white space-y-4">
                          <div>
                            <p className="font-bold mb-1">Why play?</p>
                            <p>
                              Most of the spaces around us are designed to make
                              us productive. Even the time we spend waiting is
                              optimized, filled, scrolled through. Free time,
                              genuinely unstructured and un-owned, is rare. I
                              find play important because it resists this.
                              It&apos;s not productive, it&apos;s not for
                              anything, and that&apos;s exactly why it matters
                              to me. Play is a small refusal, a moment where we
                              take a space back for ourselves.
                            </p>
                          </div>

                          <div>
                            <p className="font-bold mb-1">
                              And why public transport?
                            </p>
                            <p>
                              Third places are rare, spaces that aren&apos;t
                              home or work, where we can just exist among
                              others. Public transport isn&apos;t quite that
                              either, but it might be the closest thing many of
                              us have, the one place we&apos;re still forced to
                              share space with the general public. So
                              what&apos;s the point of that closeness if no one
                              is actually present? Most of us disappear into our
                              phones the moment we sit down, physically
                              together, but somewhere else entirely. I wanted to
                              see if people could be pulled back into the room
                              they&apos;re already sitting in.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeSlide.id === "method" ? (
                    // The middle track is fixed to exactly the width the friend
                    // image ends up at (CONTENT_HEIGHT tall at its own 502x668
                    // ratio = 312.6px, rounded up to 19.6rem so it can't clip),
                    // rather than a fraction of the row. That way the only space
                    // between it and the collage is the grid's own gap-6 — the
                    // same gap-6 that separates pr1 from pr2.
                    <div
                      className={`grid grid-cols-1 md:grid-cols-[0.8fr_19.6rem_1fr] gap-6 ${CONTENT_HEIGHT}`}
                    >
                      <div className="flex flex-col justify-start space-y-3 text-left text-xs sm:text-sm leading-relaxed">
                        <p>
                          Rather than plan the design process upfront, I
                          approached the project through{" "}
                          <strong>&quot;revealing&quot;</strong>. This meant
                          staying open to what emerged, instead of
                          &quot;enframing,&quot; which forces the material into
                          a predetermined shape.
                        </p>
                        <p>
                          From academics, I am used to working through
                          enframing, sorting the design process into categories
                          and often following the double diamond model. I was
                          interested in trying something different like
                          revealing, because I wanted the process to feel like I
                          was playing, making my own rules and following my
                          intuition of what the next step was.
                        </p>
                      </div>

                      {/* Fills the frame's full height, and shrink-wraps to
                          whatever width that height implies at the image's own
                          aspect ratio, so nothing is ever cropped and the tint
                          overlay hugs the image instead of leaving bars. */}
                      <div className="group relative w-full md:w-fit md:h-full overflow-hidden">
                        <Image
                          src={friendImage}
                          alt="A friend reflecting on play prompts"
                          className="w-full h-auto md:h-full md:w-auto object-contain"
                        />
                        <div
                          className={`absolute inset-0 bg-black/45 ${FADE_ON_HOVER}`}
                        />
                        <ImageCaption>
                          A friend reflecting on prompts about what play could
                          be on public transport.
                        </ImageCaption>
                        <div
                          className={`absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 text-left text-xs sm:text-sm leading-relaxed text-white ${FADE_ON_HOVER}`}
                        >
                          <p>
                            In practice, this meant starting from what motivated
                            me, making people play, and seeing where it led me.
                            To make people play, I needed to understand the
                            openings and limitations of public transport. I gave
                            a friend prompts to reflect on what play could be on
                            public transport, then started generating ideas from
                            her input. Eventually I came up with a concept that
                            went through phases of adjustment, based on input
                            from my conversations with people and things I read.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`flex flex-col gap-6 ${MEDIA_HEIGHT_MOBILE} md:h-full`}
                      >
                        <div className="group relative w-full flex-1 overflow-hidden">
                          <Image
                            src={pr1Image}
                            alt="An early prototype of the LED installation"
                            className="object-cover"
                            fill
                          />
                          <ImageCaption>
                            An early prototype of the LED installation.
                          </ImageCaption>
                        </div>
                        <div className="group relative w-full flex-1 overflow-hidden">
                          <Image
                            src={pr3Image}
                            alt="Further prototyping of the LED installation"
                            className="object-cover"
                            fill
                          />
                          <div
                            className={`absolute inset-0 bg-black/45 ${FADE_ON_HOVER}`}
                          />
                          <ImageCaption>
                            Further prototyping of the LED installation.
                          </ImageCaption>
                          <div
                            className={`absolute inset-0 flex flex-col justify-center items-start p-4 text-left text-xs sm:text-sm leading-relaxed text-white ${FADE_ON_HOVER}`}
                          >
                            <p>
                              The prototype was built with an Arduino Uno,
                              WS2812B LED strips, and custom cardboard
                              controllers, using the FastLED library. The
                              interaction logic in C++ was written with Claude
                              Code.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : activeSlide.id === "testing" ? (
                    // The first track is fixed to exactly the width the photo
                    // ends up at once it fills the frame's height: 26rem tall at
                    // its own 1190x668 ratio is 741.1px, i.e. 46.32rem. Whatever
                    // is left over goes to the text beside it.
                    <div
                      className={`grid grid-cols-1 md:grid-cols-[46.32rem_1fr] gap-6 ${CONTENT_HEIGHT}`}
                    >
                      {/* Given that exact width, the box has the photo's own
                          aspect ratio, so the photo fills it edge to edge with
                          nothing cropped and nothing of the tint showing past it.
                          The caption only sits on top of the photo from md up:
                          on phone the image is too short to hold this much text,
                          so the same paragraph runs underneath it instead. */}
                      <div className="group relative w-full md:w-[46.32rem] md:h-full overflow-hidden">
                        <Image
                          src="/projects/led-installation-strangers-transit/cafe.png"
                          alt="Strangers interacting with each other during a test in café Analog at ITU"
                          width={1190}
                          height={668}
                          className="w-full h-auto md:h-full object-cover"
                        />
                        <div
                          className={`hidden md:block absolute inset-0 bg-black/35 ${FADE_ON_HOVER}`}
                        />
                        <div className="hidden md:block">
                          <ImageCaption>
                            Strangers interacting with each other during a test
                            in caf&eacute; Analog at ITU.
                          </ImageCaption>
                        </div>
                        <div
                          className={`mt-3 md:mt-0 md:absolute md:inset-0 md:flex md:flex-col md:justify-start md:items-start md:p-6 md:text-white text-left text-xs sm:text-sm leading-relaxed space-y-3 ${FADE_ON_HOVER}`}
                        >
                          <p>
                            Besides smaller and less structured testing, I did
                            one bigger test. Here I planted an upscaled version
                            of the prototype in a student caf&eacute;, on the
                            counter where people waited for their coffee, and
                            sat in the corner to observe.
                          </p>
                          <p>
                            While a caf&eacute; does not fully represent public
                            transport, I considered it a smaller scale waiting
                            space, which made it more fitting for this stage of
                            the project.
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-start space-y-3 text-left text-xs sm:text-sm leading-relaxed">
                        <div>
                          <p className="font-bold mb-1 text-[#ED2E85]">
                            What happened?
                          </p>
                          <p>
                            I was really happy to see that people discovered the
                            system unprompted and invented their own games with
                            it, racing lights, trying to &quot;collide,&quot;
                            and sneaking around invisibly by holding down the
                            button, all while interacting with strangers through
                            it.
                          </p>
                          <p className="mt-3">
                            Many were curious, but not everyone tried it, and in
                            general they didn&apos;t try it for long.
                          </p>
                        </div>
                        <p>
                          The tests confirmed there&apos;s real potential for
                          playful, unplanned interaction between strangers in
                          waiting spaces. Designing for play means designing at
                          the edge of a space&apos;s unwritten rules, its
                          &quot;wiggle space.&quot;
                        </p>
                        <p>
                          The test showed me where the caf&eacute;&apos;s edges
                          sit. Staying quiet in the queue was negotiable, and
                          strangers ended up talking about the lights. Waiting
                          longer for your coffee was not. When the baristas kept
                          playing instead of serving, someone asked them to get
                          back to it.
                        </p>
                      </div>
                    </div>
                  ) : activeSlide.id === "result" ? (
                    // Two text columns and the photo, all starting at the top of
                    // the shared frame.
                    <div
                      className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${CONTENT_HEIGHT} text-left text-xs sm:text-sm leading-relaxed`}
                    >
                      <div className="flex flex-col justify-start space-y-3">
                        <p>
                          Working through the design process by letting openings
                          reveal themselves, I experienced a form of creative
                          freedom that let me approach the project with
                          playfulness rather than control. I observed myself
                          spending more time in conversation with the materials,
                          and made several{" "}
                          <strong>
                            unplanned discoveries that turned out to be the most
                            important ones of this project.
                          </strong>
                        </p>
                        <p>
                          I discovered that play can be used as a design
                          approach by{" "}
                          <strong>
                            designing the frame, rather than the behavior.
                          </strong>{" "}
                          I didn&apos;t script an interaction or a game with
                          specific rules. Instead I built a stage with minimal
                          rules, and stepped back. The moments that worked best
                          (racing lights, sneaking around invisibly, colliding
                          on purpose) were things people found on their own.
                        </p>
                      </div>
                      <div className="flex flex-col justify-start">
                        <p>
                          I also learned that getting even the most serious
                          person to play depends on{" "}
                          <strong>understanding the wiggle space</strong> of the
                          design space, which is where the risk lies. Push too
                          far and it tips into boundary work, where people
                          defend the norm instead of playing with it. The goal
                          isn&apos;t to break the rules of a space, but to nudge
                          just enough that a rule becomes visible and
                          negotiable. This also points to the downside of
                          revealing. I am still not sure what the space of
                          public transport allows, and a more enframed process
                          would likely have covered that early on.
                        </p>
                      </div>

                      {/* Width-sized at its own ratio and top-aligned, so it
                          starts level with the two text columns rather than
                          stretching to the frame's height. */}
                      <div className="group relative md:self-start">
                        <Image
                          src={ledImage}
                          alt="The finished LED installation running in the vehicle"
                          className="w-full h-auto"
                        />
                        <ImageCaption>
                          The finished LED installation running in the vehicle.
                        </ImageCaption>
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
