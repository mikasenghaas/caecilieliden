import ledImage from "@/app/assets/led-installation-front.png";
import FlowerLink from "@/app/components/flower-link";
import FilterNav from "@/app/components/filter-nav";
// import AboutMeButton from "@/app/components/about-me-button";
import AboutMeGate from "@/app/components/about-me-gate";
import BackgroundGraphic from "@/app/components/background-graphic";
import TextBlock from "@/app/components/text-block";
import ImageBlock from "@/app/components/image-block";
import ProjectLink from "@/app/components/project-link";
import MobileProjectSlot from "@/app/components/mobile-project-slot";
import ThesisRoleplaySlot from "@/app/components/thesis-roleplay-slot";
import Footer from "@/app/components/footer";
import CustomCursor from "@/app/components/custom-cursor";
import FilterableItem from "@/app/components/filterable-item";
import { FilterProvider } from "@/app/context/filter-context";

export default function Home() {
  return (
    <FilterProvider>
      <div className="relative z-0 min-h-screen bg-white">
        <BackgroundGraphic />
        <CustomCursor />
        <header className="max-w-6xl mx-auto px-4 md:px-12 pt-4 pb-4 sm:pb-6">
          <div className="flex flex-col xl:flex-row xl:flex-wrap items-start xl:items-end gap-4 xl:min-h-[55px]">
            <FlowerLink />
            <FilterNav />
            {/* <AboutMeButton /> */}
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-4 md:px-12">
        <AboutMeGate>
          {/* 2-Column Layout (below lg) */}
          <div className="flex gap-1.5 sm:gap-5 pb-12 lg:hidden">
            {/* Column 1 */}
            <div className="flex-1 flex flex-col">
              <TextBlock>
                <p className="mb-4">
                  My name is <span className="font-bold text-[#ED2E85]">Cæcilie Lidén Bode</span> and
                  I am a digital designer from Copenhagen.
                </p>
                <p className="mb-4">
                  I study, analyze and design interactions between people, society and digital technology.
                </p>
                <p className="mb-4">
                  Currently I am very interested in concepts of <span className="font-bold text-[#ED2E85]">creativity</span>,{" "}
                  <span className="font-bold text-[#ED2E85]">play</span>, and{" "}
                  <span className="font-bold text-[#ED2E85]">co-design,</span> and am in a process of
                  exploring the digital world and learning new tools.
                </p>
                <p>
                  This is my <span className="font-bold text-[#ED2E85]">project parking spot</span>. Here you can see a mix of my digital design
                  projects and personal art pieces.
                </p>
              </TextBlock>

              <MobileProjectSlot position="column1-a" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/red-waves/red-waves-1.png" alt="Red Waves" href="/gallery/red-waves" />
              </FilterableItem>

              <MobileProjectSlot position="column1-b" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/mosaic-of-life/mosaic-of-life-1.png" alt="Mosaic of Life" href="/gallery/mosaic-of-life" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/fruits/fruits-1.png" alt="Fruits" href="/gallery/fruits" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/chicken/chicken-1.png" alt="Chicken" href="/gallery/chicken" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/portrait-of-my-sister/portrait-of-my-sister-1.png" alt="Portrait of My Sister" href="/gallery/portrait-of-my-sister" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/graphics-for-portfolio-website/graphics-for-portfolio-1.png" alt="Graphics for Portfolio" href="/gallery/graphics-for-portfolio-website" />
              </FilterableItem>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col">
              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/tulips/tulips-1.png" alt="Tulips" href="/gallery/tulips" />
              </FilterableItem>

              <MobileProjectSlot position="column2-a" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/self-portrait/self-portrait-1.png" alt="Self Portrait" href="/gallery/self-portrait" />
              </FilterableItem>

              <MobileProjectSlot position="column2-b" />

              <MobileProjectSlot position="column2-c" />

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
                  My name is <span className="font-bold text-[#ED2E85]">Cæcilie Lidén Bode</span> and
                  I am a digital designer from Copenhagen.
                </p>
                <p className="mb-4">
                  I study, analyze and design interactions between people, society and digital technology.
                </p>
                <p className="mb-4">
                  Currently I am very interested in concepts of <span className="font-bold text-[#ED2E85]">creativity</span>,{" "}
                  <span className="font-bold text-[#ED2E85]">play</span>, and{" "}
                  <span className="font-bold text-[#ED2E85]">co-design,</span> and am in a process of
                  exploring the digital world and learning new tools.
                </p>
                <p>
                  This is my <span className="font-bold text-[#ED2E85]">project parking spot</span>. Here you can see a mix of my digital design
                  projects and personal art pieces.
                </p>
              </TextBlock>

              <ThesisRoleplaySlot position="column1-primary" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/dream-landscape/dream-landscape-1.png" alt="Dream Landscape" href="/gallery/dream-landscape" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/chicken/chicken-1.png" alt="Chicken" href="/gallery/chicken" />
              </FilterableItem>

              <ThesisRoleplaySlot position="column1-secondary" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/graphics-for-portfolio-website/graphics-for-portfolio-1.png" alt="Graphics for Portfolio" href="/gallery/graphics-for-portfolio-website" />
              </FilterableItem>
            </div>

            {/* Column 2 */}
            <div className="flex-1 flex flex-col">
              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/tulips/tulips-1.png" alt="Tulips" href="/gallery/tulips" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/red-waves/red-waves-1.png" alt="Red Waves" href="/gallery/red-waves" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/mosaic-of-life/mosaic-of-life-1.png" alt="Mosaic of Life" href="/gallery/mosaic-of-life" />
              </FilterableItem>

              <ThesisRoleplaySlot position="column2-primary" />

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/cherry-girl/cherry-girl-1.png" alt="Cherry Girl" href="/gallery/cherry-girl" />
              </FilterableItem>

              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/portrait-of-my-sister/portrait-of-my-sister-1.png" alt="Portrait of My Sister" href="/gallery/portrait-of-my-sister" />
              </FilterableItem>

              <ThesisRoleplaySlot position="column2-secondary" />
            </div>

            {/* Column 3 */}
            <div className="flex-1 flex flex-col">
              <FilterableItem category="artwork">
                <ImageBlock src="/gallery/self-portrait/self-portrait-1.png" alt="Self Portrait" href="/gallery/self-portrait" />
              </FilterableItem>

              <FilterableItem category="project">
                <ProjectLink
                  href="/projects/led-installation-strangers-transit"
                  title="Strangers on Transit LED Installation"
                  year="2026"
                  image={ledImage}
                />
              </FilterableItem>

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
        </AboutMeGate>

          <Footer />
        </main>
      </div>
    </FilterProvider>
  );
}
