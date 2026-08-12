import { ReactNode } from "react";
import SiteFrame from "@/app/components/site-frame";

// Shared layout for the design-projects / drawings-and-paintings / about-me
// pages. Putting SiteFrame here (rather than inside each page.tsx) keeps it
// — and the PageNav filter it renders — mounted across client-side
// navigation between these routes, instead of remounting from scratch. That
// persistence is what lets PageNav's AnimatePresence crossfade actually
// animate between the old and new active page, rather than snapping
// instantly because the whole nav was just torn down and rebuilt.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return <SiteFrame>{children}</SiteFrame>;
}
