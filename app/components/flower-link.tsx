import Link from "next/link";
import Image from "next/image";
import flowerSvg from "@/app/assets/flower.svg";

export default function FlowerLink() {
  return (
    <Link href="/" className="hidden lg:block fixed top-4 left-4 z-50 hover:opacity-80 transition-opacity">
      <Image
        src={flowerSvg}
        alt="Home"
        width={55}
        height={58}
        priority
      />
    </Link>
  );
}

