import { ReactNode } from "react";

// Article pages are set in IBM Plex Sans throughout. It's applied once here
// rather than per page so the MDX articles and the hand-built slide decks
// can't drift apart; anything that needs a heavier weight still opts in with
// its own font-bold.
export default function ProjectsLayout({ children }: { children: ReactNode }) {
  return <div className="font-plex not-italic">{children}</div>;
}
