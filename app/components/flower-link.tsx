import Link from "next/link";
import Image from "next/image";
import flowerSvg from "@/app/assets/flower.svg";

export default function FlowerLink() {
  return (
    <Link href="/" className="fixed top-6 left-6 z-50 hover:opacity-80 transition-opacity">
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

