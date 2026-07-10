"use client";

import { ReactNode } from "react";
import { useFilter } from "@/app/context/filter-context";

interface FilterableItemProps {
  category: "project" | "artwork";
  children: ReactNode;
}

export default function FilterableItem({ category, children }: FilterableItemProps) {
  const { activeFilter } = useFilter();

  const isVisible =
    activeFilter === "all" ||
    (activeFilter === "digital design projects" && category === "project") ||
    (activeFilter === "drawings & paintings" && category === "artwork");

  if (!isVisible) return null;

  return <>{children}</>;
}
