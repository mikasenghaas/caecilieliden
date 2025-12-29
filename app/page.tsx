import FlowerLink from "@/app/components/flower-link";
import Header from "@/app/components/header";
import TextBlock from "@/app/components/text-block";
import ImageBlock from "@/app/components/image-block";
import ProjectLink from "@/app/components/project-link";
import Footer from "@/app/components/footer";

// Gallery images
import gallery001 from "@/app/assets/gallery/001.svg";
import gallery002 from "@/app/assets/gallery/002.svg";
import gallery003 from "@/app/assets/gallery/003.svg";
import gallery004 from "@/app/assets/gallery/004.svg";
import gallery005 from "@/app/assets/gallery/005.svg";
import gallery006 from "@/app/assets/gallery/006.svg";
import gallery007 from "@/app/assets/gallery/007.svg";
import gallery008 from "@/app/assets/gallery/008.svg";
import gallery009 from "@/app/assets/gallery/009.svg";
import gallery010 from "@/app/assets/gallery/010.svg";
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
              I am a bachelor student in Digital Design & Interactive Technologies at 
              the IT-University of Copenhagen (until summer 2026).
            </p>
            <p className="mb-4">
              What began as a personal interest in creating art and graphics has, through 
              my studies, developed into an aspiration of designing meaningful digital solutions. 
              I love creating with others and with people different to myself. I am particularly 
              interested in prototyping through creative and playful processes, turning ideas into 
              tangible experiences using both software and hardware.
            </p>
            <p>
              In the future, I hope to contribute to the development of more user centered, 
              mindful, and playful technology.
            </p>
          </TextBlock>
          
          <ImageBlock src={outlineFlower} alt="Empty slot for Bachelor thesis - Coming spring 2026" />
          
          <ImageBlock src={gallery006} alt="Painting" />
          
          <ProjectLink 
            href="#" 
            title="Melting Icebergs: A Creative Data Visualization" 
          />
          
          <ImageBlock src={gallery007} alt="Swan illustration" />

          {/* Column 2 */}
          <TextBlock>
            <p>
              This is my project parking spot. Here you can see a mix of my digital design 
              projects and personal art pieces.
            </p>
          </TextBlock>
          
          <ImageBlock src={gallery002} alt="Tulips illustration" />
          
          <ImageBlock src={gallery003} alt="Art piece" />
          
          <ImageBlock src={gallery004} alt="Digital artwork" />
          
          <ImageBlock src={gallery008} alt="Character illustration" />
          
          <ImageBlock src={gallery009} alt="Photography" />

          {/* Column 3 */}
          <ImageBlock src={gallery001} alt="Portrait" />
          
          <ProjectLink 
            href="#" 
            title="Co-Designing an App with a Live-Action Roleplay Community" 
          />
          
          <ImageBlock src={gallery005} alt="Abstract art" />
          
          <ProjectLink 
            href="#" 
            title="An Arduino project: The Never-Late Bed" 
          />
          
          <ImageBlock src={gallery010} alt="Illustration" />
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
