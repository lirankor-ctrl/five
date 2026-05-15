import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

/**
 * Scoped layout for the five manifesto cube.
 *
 * Adds a literary serif (Newsreader) only inside this branch of the tree.
 * The rest of the app keeps its sans-serif voice.
 */
export default function ManifestoLayout({ children }: { children: ReactNode }) {
  return <div className={newsreader.variable}>{children}</div>;
}
