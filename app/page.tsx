import FlowerLink from "@/app/components/flower-link";
import Header from "@/app/components/header";
import TextBlock from "@/app/components/text-block";
import ImageBlock from "@/app/components/image-block";
import ProjectLink from "@/app/components/project-link";
import Footer from "@/app/components/footer";

// Gallery images - now from public/gallery directories
import outlineFlower from "@/app/assets/outline-flower.svg";

export default function Home() {
  return (
    <div className="min-h-screen">
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
          
          <ImageBlock src="/gallery/006/006-1.svg" alt="Painting" href="/gallery/006" />
          
          <ProjectLink 
            href="/projects/never-late-bed" 
            title="Melting Icebergs: A Creative Data Visualization" 
          />
          
          <ImageBlock src="/gallery/007/007-1.svg" alt="Swan illustration" href="/gallery/007" />

          {/* Column 2 */}
          <TextBlock>
            <p>
              This is my <b>project parking spot</b>. Here you can see a mix of my digital design 
              projects and personal art pieces.
            </p>
          </TextBlock>
          
          <ImageBlock src="/gallery/002/002-1.svg" alt="Tulips illustration" href="/gallery/002" />
          
          <ImageBlock src="/gallery/003/003-1.svg" alt="Art piece" href="/gallery/003" />
          
          <ImageBlock src="/gallery/004/004-1.svg" alt="Digital artwork" href="/gallery/004" />
          
          <ImageBlock src="/gallery/008/008-1.svg" alt="Character illustration" href="/gallery/008" />
          
          <ImageBlock src="/gallery/009/009-1.svg" alt="Photography" href="/gallery/009" />

          {/* Column 3 */}
          <ImageBlock src="/gallery/001/001-1.svg" alt="Portrait" href="/gallery/001" />
          
          <ProjectLink 
            href="/projects/never-late-bed" 
            title="Co-Designing an App with a Live-Action Roleplay Community" 
          />
          
          <ImageBlock src="/gallery/005/005-1.svg" alt="Abstract art" href="/gallery/005" />
          
          <ProjectLink 
            href="/projects/never-late-bed" 
            title="An Arduino project: The Never-Late Bed" 
          />
          
          <ImageBlock src="/gallery/010/010-1.svg" alt="Illustration" href="/gallery/010" />
        </div>
        
        <Footer 
          email="hello@caecilieliden.com"
          linkedinUrl="https://linkedin.com"
          pinterestUrl="https://pinterest.com"
        />
      </main>
    </div>
  );
}
