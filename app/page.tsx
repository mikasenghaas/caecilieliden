import FlowerLink from "@/app/components/flower-link";
import Header from "@/app/components/header";
import TextBlock from "@/app/components/text-block";
import ImageBlock from "@/app/components/image-block";
import ProjectLink from "@/app/components/project-link";
import Footer from "@/app/components/footer";
import CustomCursor from "@/app/components/custom-cursor";

// Gallery images - now from public/gallery directories
import outlineFlower from "@/app/assets/outline-flower.svg";

export default function Home() {
  return (
    <div className="min-h-screen">
      <CustomCursor />
      <FlowerLink />
      
      <main className="max-w-6xl mx-auto px-6 md:px-12">
        <Header />
        
        {/* Portfolio Grid - Masonry layout with CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 lg:gap-6 pb-12">
          {/* Column 1 */}
          <TextBlock>
            <p className="mb-4">
              I am a bachelor student in <b>Digital Design & Interactive Technologies</b> at 
              the IT-University of Copenhagen (until summer 2026).
            </p>
            <p className="mb-4">
              What began as a personal interest in creating art and graphics has, through 
              my studies, developed into an aspiration of designing meaningful digital solutions. 
              I love creating with others and with people different to myself. I am particularly 
              interested in prototyping through <b>creative and playful processes</b>, turning ideas into 
              tangible experiences using both software and hardware.
            </p>
            <p>
              I aspire to contribute to the development of more <b>user centered, 
              mindful, and playful technology</b>.
            </p>
          </TextBlock>
          
          <ImageBlock src={outlineFlower} alt="Empty slot for Bachelor thesis - Coming spring 2026" />
          
          <ImageBlock src="/gallery/red-waves/red-waves-1.svg" alt="Red Waves" href="/gallery/red-waves" />
          
          <ProjectLink 
            href="/projects/melting-icebergs" 
            title="Melting Icebergs: A Creative Data Visualization" 
          />
          
          <ImageBlock src="/gallery/chicken/chicken-1.svg" alt="Chicken" href="/gallery/chicken" />

          {/* Column 2 */}
          <TextBlock className="break-before-column">
            <p>
              This is my <b>project parking spot</b>. Here you can see a mix of my digital design 
              projects and personal art pieces.
            </p>
          </TextBlock>
          
          <ImageBlock src="/gallery/tulips/tulips-1.svg" alt="Tulips" href="/gallery/tulips" />
          
          <ImageBlock src="/gallery/mosaic-of-life/mosaic-of-life-1.svg" alt="Mosaic of Life" href="/gallery/mosaic-of-life" />

          <ImageBlock src="/gallery/dream-landscape/dream-landscape-1.svg" alt="Dream Landscape" href="/gallery/dream-landscape" />
          
          <ImageBlock src="/gallery/cherry-girl/cherry-girl-1.svg" alt="Cherry Girl" href="/gallery/cherry-girl" />
          
          <ImageBlock src="/gallery/portrait-of-my-sister/portrait-of-my-sister-1.svg" alt="Portrait of my Sister" href="/gallery/portrait-of-my-sister" />

          {/* Column 3 */}
          <ImageBlock src="/gallery/self-portrait/self-portrait-1.svg" alt="Self Portrait" href="/gallery/self-portrait" />
          
          <ProjectLink 
            href="/projects/codesign-project" 
            title="Co-Designing an App with a Live-Action Roleplay Community" 
          />
          
          <ImageBlock src="/gallery/fruits/fruits-1.svg" alt="Fruits" href="/gallery/fruits" />
          
          <ProjectLink 
            href="/projects/never-late-bed" 
            title="An Arduino project: The Never-Late Bed" 
          />
          
          <ImageBlock src="/gallery/mika/mika-1.svg" alt="Mika" href="/gallery/mika" />
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
