"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import flowerSvg from "@/app/assets/flower.svg";
import flowerLightSvg from "@/app/assets/flower-light.svg";

interface FlowerLinkProps {
  theme?: "light" | "dark";
  fixed?: boolean;
}

export default function FlowerLink({ theme = "light", fixed = true }: FlowerLinkProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const flowerIcon = theme === "dark" ? flowerLightSvg : flowerSvg;

  const positionClasses = fixed
    ? "relative lg:fixed mb-4 lg:m-0 lg:top-4 lg:left-4"
    : "relative";

  return (
    <Link
      href="/"
      className={`block w-fit shrink-0 ${positionClasses} z-50 lg:transition-transform lg:duration-300 ${
        isHome
          ? "lg:rotate-0 lg:hover:rotate-12"
          : "lg:rotate-12 lg:hover:rotate-0"
      }`}
    >
      <Image
        src={flowerIcon}
        alt="Home"
        width={55}
        height={55}
        priority
      />
    </Link>
  );
}

