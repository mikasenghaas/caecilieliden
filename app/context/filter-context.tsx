"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export const FILTERS = ["all", "digital design projects", "drawings & paintings"] as const;
export type Filter = (typeof FILTERS)[number];

interface FilterContextValue {
  activeFilter: Filter;
  setActiveFilter: (filter: Filter) => void;
}

const FilterContext = createContext<FilterContextValue | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  return (
    <FilterContext.Provider value={{ activeFilter, setActiveFilter }}>
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
