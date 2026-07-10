import FlowerLink from "@/app/components/flower-link";
import FilterNav from "@/app/components/filter-nav";
import TextBlock from "@/app/components/text-block";
import ImageBlock from "@/app/components/image-block";
import ProjectLink from "@/app/components/project-link";
import ProjectSwapSlot from "@/app/components/project-swap-slot";
import Footer from "@/app/components/footer";
import CustomCursor from "@/app/components/custom-cursor";
import FilterableItem from "@/app/components/filterable-item";
import { FilterProvider } from "@/app/context/filter-context";

export default function Home() {
  return (
    <FilterProvider>
      <div className="relative z-0 min-h-screen bg-white">
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-[url('/stardustgraphics.svg')] bg-top bg-no-repeat bg-cover opacity-90"
        />
        <CustomCursor />
        <header className="max-w-6xl mx-auto px-4 md:px-12 pt-4 pb-4 sm:pb-6">
          <div className="flex flex-wrap items-end gap-4 min-h-[55px]">
            <FlowerLink />
            <FilterNav />
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 md:px-12">
          {/* 2-Column Layout (below lg) */}
          <div className="flex gap-1.5 sm:gap-5 pb-12 lg:hidden">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col">
              <TextBlock>
                <p className="mb-4">
                  Welcome to my page!
                </p>
                <p className="mb-4">
                  My name is <span className="font-bold text-[#ED2E85]">Cæcilie Lidén Bode</span> and
                  I am a Copenhagen based digital designer working with digital material and
                  interactive technologies.
                </p>
                <p>
                  Currently I am interested in concepts of <span className="font-bold text-[#ED2E85]">creativity</span>,{" "}
                  <span className="font-bold text-[#ED2E85]">play</span>, and{" "}
                  <span className="font-bold text-[#ED2E85]">co-design</span>, and am in a process of
                  exploring materials and learning new tools.
                </p>
              </TextBlock>

              <FilterableItem category="project">
                <ProjectLink
                  href="/projects/co-design-ai-acute-health"
                  title="Co-Design of AI Solution for Acute Health Situations (My Bachelor Thesis Project)"
                  year="2026"
                />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/red-waves/red-waves-1.png" alt="Red Waves" href="/gallery/red-waves" />
              </FilterableItem>

              <ProjectSwapSlot slot="A" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/mosaic-of-life/mosaic-of-life-1.png" alt="Mosaic of Life" href="/gallery/mosaic-of-life" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/fruits/fruits-1.png" alt="Fruits" href="/gallery/fruits" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/chicken/chicken-1.png" alt="Chicken" href="/gallery/chicken" />
              </FilterableItem>

              <FilterableItem category="project">
                <ProjectLink
                  href="/projects/never-late-bed"
                  title="The Never-Late Bed"
                  year="2024"
                />
              </FilterableItem>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col">
              <TextBlock>
                <p>
                  This is my <span className="font-bold text-[#ED2E85]">project parking</span> spot. Here you can see a mix of my digital design
                  projects and personal art pieces.
                </p>
              </TextBlock>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/tulips/tulips-1.png" alt="Tulips" href="/gallery/tulips" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/self-portrait/self-portrait-1.png" alt="Self Portrait" href="/gallery/self-portrait" />
              </FilterableItem>

              <ProjectSwapSlot slot="B" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/dream-landscape/dream-landscape-1.png" alt="Dream Landscape" href="/gallery/dream-landscape" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/cherry-girl/cherry-girl-1.png" alt="Cherry Girl" href="/gallery/cherry-girl" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/mika/mika-1.png" alt="Mika" href="/gallery/mika" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/portrait-of-my-sister/portrait-of-my-sister-1.png" alt="Portrait of my Sister" href="/gallery/portrait-of-my-sister" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/blurry-flowers/blurry-flowers-1.png" alt="Blurry Flowers" href="/gallery/blurry-flowers" />
              </FilterableItem>
            </div>
          </div>

          {/* 3-Column Layout (lg and above) */}
          <div className="hidden lg:flex gap-6 pb-12">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col">
              <TextBlock>
                <p className="mb-4">
                  Welcome to my page!
                </p>
                <p className="mb-4">
                  My name is <span className="font-bold text-[#ED2E85]">Cæcilie Lidén Bode</span> and
                  I am a Copenhagen based digital designer working with digital material and
                  interactive technologies.
                </p>
                <p>
                  Currently I am interested in concepts of <span className="font-bold text-[#ED2E85]">creativity</span>,{" "}
                  <span className="font-bold text-[#ED2E85]">play</span>, and{" "}
                  <span className="font-bold text-[#ED2E85]">co-design</span>, and am in a process of
                  exploring materials and learning new tools.
                </p>
              </TextBlock>

              <FilterableItem category="project">
                <ProjectLink
                  href="/projects/co-design-ai-acute-health"
                  title="Co-Design of AI Solution for Acute Health Situations (My Bachelor Thesis Project)"
                  year="2026"
                />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/dream-landscape/dream-landscape-1.png" alt="Dream Landscape" href="/gallery/dream-landscape" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/chicken/chicken-1.png" alt="Chicken" href="/gallery/chicken" />
              </FilterableItem>

              <FilterableItem category="project">
                <ProjectLink
                  href="/projects/never-late-bed"
                  title="The Never-Late Bed"
                  year="2024"
                />
              </FilterableItem>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col">
              <TextBlock>
                <p>
                  This is my <span className="font-bold text-[#ED2E85]">project parking</span> spot. Here you can see a mix of my digital design
                  projects and personal art pieces.
                </p>
              </TextBlock>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/tulips/tulips-1.png" alt="Tulips" href="/gallery/tulips" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/red-waves/red-waves-1.png" alt="Red Waves" href="/gallery/red-waves" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/mosaic-of-life/mosaic-of-life-1.png" alt="Mosaic of Life" href="/gallery/mosaic-of-life" />
              </FilterableItem>

              <ProjectSwapSlot slot="A" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/cherry-girl/cherry-girl-1.png" alt="Cherry Girl" href="/gallery/cherry-girl" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/portrait-of-my-sister/portrait-of-my-sister-1.png" alt="Portrait of my Sister" href="/gallery/portrait-of-my-sister" />
              </FilterableItem>
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col">
              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/self-portrait/self-portrait-1.png" alt="Self Portrait" href="/gallery/self-portrait" />
              </FilterableItem>

              <ProjectSwapSlot slot="B" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/fruits/fruits-1.png" alt="Fruits" href="/gallery/fruits" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/mika/mika-1.png" alt="Mika" href="/gallery/mika" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/blurry-flowers/blurry-flowers-1.png" alt="Blurry Flowers" href="/gallery/blurry-flowers" />
              </FilterableItem>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </FilterProvider>
  );
}
