import Link from "next/link";
import Image from "next/image";
import flowerSvg from "@/app/assets/flower.svg";
import flowerLightSvg from "@/app/assets/flower-light.svg";

interface FlowerLinkProps {
  theme?: "light" | "dark";
}

export default function FlowerLink({ theme = "light" }: FlowerLinkProps) {
  const flowerIcon = theme === "dark" ? flowerLightSvg : flowerSvg;
  
  return (
    <Link href="/" className="hidden lg:block fixed top-4 left-4 z-50 transition-transform duration-300 hover:rotate-12">
      <Image
        src={flowerIcon}
        alt="Home"
        width={55}
        height={58}
        priority
      />
    </Link>
  );
}

