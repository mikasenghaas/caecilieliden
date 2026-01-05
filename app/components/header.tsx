import Image from "next/image";
import caecilieSvg from "@/app/assets/caecilie.svg";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center pt-12 pb-8 sm:pt-16 sm:pb-8 md:pt-28 md:pb-14">
      <Image
        src={caecilieSvg}
        alt="Caecilie Lidèn Bode"
        className="w-full sm:max-w-md md:max-w-lg"
        priority
      />
    </header>
  );
}

