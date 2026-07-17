"use client";

import { useFilter } from "@/app/context/filter-context";

export default function BackgroundGraphic() {
  const { activeFilter } = useFilter();

  if (activeFilter === "about me") return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/stardustgraphics.svg')] bg-top bg-no-repeat bg-cover opacity-90" />
  );
}
