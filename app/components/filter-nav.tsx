"use client";

import { FILTERS, useFilter } from "@/app/context/filter-context";

export default function FilterNav() {
  const { activeFilter, setActiveFilter } = useFilter();

  return (
    <nav className="flex flex-wrap items-center gap-[10px] sm:pl-4">
      {FILTERS.map((filter) => {
        const isActive = filter === activeFilter;
        return (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`p-[10px] border-2 text-xs sm:text-sm transition-colors duration-200 ${
              isActive
                ? "border-[#ED2E85] text-[#ED2E85]"
                : "border-black text-black hover:border-[#ED2E85] hover:text-[#ED2E85]"
            }`}
          >
            {filter}
          </button>
        );
      })}
    </nav>
  );
}
