"use client";

import { ReactNode } from "react";
import { useFilter } from "@/app/context/filter-context";
import AboutMeMindMap from "@/app/components/about-me-mindmap";

export default function AboutMeGate({ children }: { children: ReactNode }) {
  const { activeFilter } = useFilter();

  return activeFilter === "about me" ? <AboutMeMindMap /> : <>{children}</>;
}
