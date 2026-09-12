"use client";

import Link from "next/link";
import Image from "next/image";
import flowerSvg from "@/app/assets/flower.svg";
import flowerLightSvg from "@/app/assets/flower-light.svg";

interface FlowerLinkProps {
  theme?: "light" | "dark";
  href?: string;
}

export default function FlowerLink({
  theme = "light",
  href = "/",
}: FlowerLinkProps) {
  const flowerIcon = theme === "dark" ? flowerLightSvg : flowerSvg;

  // The same 16px/16px corner at every width; only what that corner belongs to
  // changes. Below lg it is the top of the page, so the flower scrolls away
  // with everything else; from lg up it is the viewport, so it stays put.
  //
  // Out of the flow in both cases, which is the point. It used to be a normal
  // in-flow item of the header row on narrow windows, so its position was
  // whatever that row gave it — and the row centres on a 460px cap and
  // bottom-aligns its items, so the flower slid sideways as the window crossed
  // 492px and dropped down again whenever the filter pills wrapped. Placed
  // against the page instead, nothing in the header can reach it. Callers
  // reserve its 16 + 55 = 71px so nothing tucks underneath.
  return (
    <Link
      href={href}
      className="absolute top-4 left-4 z-50 block w-fit shrink-0 rotate-0 lg:fixed sm:transition-transform sm:duration-300 sm:hover:rotate-12"
    >
      <Image src={flowerIcon} alt="Home" width={55} height={55} priority />
    </Link>
  );
}
