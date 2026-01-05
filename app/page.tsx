import FlowerLink from "@/app/components/flower-link";
import Header from "@/app/components/header";
import TextBlock from "@/app/components/text-block";
import ImageBlock from "@/app/components/image-block";
import ProjectLink from "@/app/components/project-link";
import Footer from "@/app/components/footer";
import CustomCursor from "@/app/components/custom-cursor";

// Gallery images - now from public/gallery directories
import outlineFlower from "@/app/assets/outline-flower.svg";
import flowerArduino from "@/app/assets/flower-arduino.svg";
import flowerCodesign from "@/app/assets/flower-codesign-project.svg";

export default function Home() {
  return (
    <div className="min-h-screen">
      <CustomCursor />
      <FlowerLink />
      
      <main className="max-w-6xl mx-auto px-2 sm:px-6 md:px-12">
        <Header />
        
        {/* Portfolio Grid - Masonry layout with CSS columns */}
        <div className="columns-2 lg:columns-3 gap-1.5 sm:gap-5 lg:gap-6 pb-12">
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

          <ImageBlock src="/gallery/red-waves/red-waves-1.png" alt="Red Waves" href="/gallery/red-waves" />

          <ProjectLink
            href="/projects/never-late-bed"
            flower={flowerArduino}
          />

          <ImageBlock src="/gallery/chicken/chicken-1.png" alt="Chicken" href="/gallery/chicken" />

          {/* Column 2 (3-col layout) */}
          <TextBlock className="lg:break-before-column">
            <p>
              This is my <b>project parking spot</b>. Here you can see a mix of my digital design
              projects and personal art pieces.
            </p>
          </TextBlock>

          <ImageBlock src="/gallery/tulips/tulips-1.png" alt="Tulips" href="/gallery/tulips" />

          <ImageBlock src="/gallery/mosaic-of-life/mosaic-of-life-1.png" alt="Mosaic of Life" href="/gallery/mosaic-of-life" />

          <ImageBlock src="/gallery/dream-landscape/dream-landscape-1.png" alt="Dream Landscape" href="/gallery/dream-landscape" className="break-before-column lg:break-before-auto" />

          <ImageBlock src="/gallery/cherry-girl/cherry-girl-1.png" alt="Cherry Girl" href="/gallery/cherry-girl" />

          <ImageBlock src="/gallery/portrait-of-my-sister/portrait-of-my-sister-1.png" alt="Portrait of my Sister" href="/gallery/portrait-of-my-sister" />

          {/* Column 3 (3-col layout) */}
          <ImageBlock src="/gallery/self-portrait/self-portrait-1.png" alt="Self Portrait" href="/gallery/self-portrait" className="lg:break-before-column" />

          <ProjectLink
            href="/projects/codesign-project"
            flower={flowerCodesign}
          />

          <ImageBlock src="/gallery/fruits/fruits-1.png" alt="Fruits" href="/gallery/fruits" />

          <ImageBlock src="/gallery/mika/mika-1.png" alt="Mika" href="/gallery/mika" />
        </div>
        
        <Footer />
      </main>
    </div>
  );
}
