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

export default function Home() {
  return (
    <div className="min-h-screen">
      <FlowerLink />
      
      <main className="max-w-6xl mx-auto px-6 md:px-12">
        <Header />
        
        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pb-12 items-start">
          {/* Row 1 */}
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
          
          <TextBlock>
            <p>
              This is my project parking spot. Here you can see a mix of my digital design 
              projects and personal art pieces.
            </p>
          </TextBlock>
          
          <ImageBlock src={gallery001} alt="Portrait" />
          
          {/* Row 2 */}
          <ImageBlock src={gallery002} alt="Tulips illustration" />
          
          <ImageBlock src={gallery003} alt="Art piece" />
          
          <ProjectLink 
            href="#" 
            title="Co-Designing an App with a Live-Action Roleplay Community" 
          />
          
          {/* Row 3 */}
          <TextBlock className="flex items-center justify-center">
            <div className="border-2 border-dashed border-foreground/40 rounded-full p-8 text-center">
              <p className="text-sm text-foreground/60">
                Empty slot for my Bachelor thesis<br />
                (Coming spring 2026)
              </p>
            </div>
          </TextBlock>
          
          <ImageBlock src={gallery004} alt="Digital artwork" />
          
          <ImageBlock src={gallery005} alt="Abstract art" />
          
          {/* Row 4 */}
          <ImageBlock src={gallery006} alt="Painting" />
          
          <ImageBlock src={gallery007} alt="Landscape" />
          
          <ProjectLink 
            href="#" 
            title="Melting Icebergs: A Creative Data Visualization" 
          />
          
          {/* Row 5 */}
          <ProjectLink 
            href="#" 
            title="An Arduino project: The Never-Late Bed" 
          />
          
          <ImageBlock src={gallery008} alt="Character illustration" />
          
          <ImageBlock src={gallery009} alt="Photography" />
          
          {/* Row 6 */}
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
