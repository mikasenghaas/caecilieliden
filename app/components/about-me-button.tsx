"use client";

import { useFilter } from "@/app/context/filter-context";

export default function AboutMeButton() {
  const { activeFilter, setActiveFilter, resetAboutMe } = useFilter();
  const isOpen = activeFilter === "about me";

  return (
    <button
      type="button"
      onClick={() => (isOpen ? resetAboutMe() : setActiveFilter("about me"))}
      className={`xl:ml-auto p-[10px] border-2 text-xs sm:text-sm transition-colors duration-200 ${
        isOpen
          ? "border-[#ED2E85] text-[#ED2E85]"
          : "border-black text-black hover:border-[#ED2E85] hover:text-[#ED2E85]"
      }`}
    >
      About Me
    </button>
  );
}
