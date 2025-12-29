import Image from "next/image";
import Link from "next/link";
import caecilieSvg from "@/app/assets/caecilie.svg";

export default function Header() {
  return (
    <header className="w-full flex flex-col items-center pt-16 pb-8 md:pt-20 md:pb-12">
      <Image
        src={caecilieSvg}
        alt="Caecilie Lidèn Bode"
        className="w-full max-w-md md:max-w-lg"
        priority
      />
      <Link
        href="/cv"
        className="fixed top-6 right-6 z-50 font-[family-name:var(--font-madimi)] text-lg hover:opacity-70 transition-opacity"
      >
        CV
      </Link>
    </header>
  );
}

