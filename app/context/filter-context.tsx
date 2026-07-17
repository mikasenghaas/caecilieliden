"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export const FILTERS = ["all", "digital design projects", "drawings & paintings"] as const;
export type Filter = (typeof FILTERS)[number] | "about me";

const STORAGE_KEY = "activeFilter";
const ALL_FILTERS = [...FILTERS, "about me"] as const;

function isFilter(value: unknown): value is Filter {
  return typeof value === "string" && (ALL_FILTERS as readonly string[]).includes(value);
}

interface FilterContextValue {
  activeFilter: Filter;
  setActiveFilter: (filter: Filter) => void;
  aboutMeResetSignal: number;
  resetAboutMe: () => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilterState] = useState<Filter>("all");
  const [aboutMeResetSignal, setAboutMeResetSignal] = useState(0);

  // Restore whichever filter was active before navigating away (e.g. into
  // a gallery or project page), so clicking back to home doesn't dump the
  // user back into "all".
  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (isFilter(stored)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore of persisted UI state on mount
      setActiveFilterState(stored);
    }
  }, []);

  const setActiveFilter = (filter: Filter) => {
    setActiveFilterState(filter);
    sessionStorage.setItem(STORAGE_KEY, filter);
  };

  return (
    <FilterContext.Provider
      value={{
        activeFilter,
        setActiveFilter,
        aboutMeResetSignal,
        resetAboutMe: () => setAboutMeResetSignal((value) => value + 1),
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
