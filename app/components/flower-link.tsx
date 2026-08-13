"use client";

import Link from "next/link";
import Image from "next/image";
import flowerSvg from "@/app/assets/flower.svg";
import flowerLightSvg from "@/app/assets/flower-light.svg";

interface FlowerLinkProps {
  theme?: "light" | "dark";
  fixed?: boolean;
  href?: string;
}

export default function FlowerLink({ theme = "light", fixed = true, href = "/" }: FlowerLinkProps) {
  const flowerIcon = theme === "dark" ? flowerLightSvg : flowerSvg;

  const positionClasses = fixed
    ? "relative xl:fixed mb-4 xl:m-0 xl:top-4 xl:left-4"
    : "relative";

  return (
    <Link
      href={href}
      className={`block w-fit shrink-0 ${positionClasses} z-50 xl:transition-transform xl:duration-300 xl:rotate-0 xl:hover:rotate-12`}
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
