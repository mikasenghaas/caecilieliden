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

  // In the page flow on phone (so it scrolls away with everything else) and
  // pinned to the viewport from sm up. Both modes land the flower on exactly
  // the same 16px/16px corner — every caller pads its in-flow wrapper by
  // px-4 pt-4 — so crossing the breakpoint doesn't move it, and it sits in
  // the same place on the front page as it does inside an article.
  const positionClasses = fixed
    ? "relative sm:fixed sm:top-4 sm:left-4"
    : "relative";

  return (
    <Link
      href={href}
      className={`block w-fit shrink-0 ${positionClasses} z-50 sm:transition-transform sm:duration-300 sm:rotate-0 sm:hover:rotate-12`}
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
