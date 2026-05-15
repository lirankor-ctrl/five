import type { ReactNode } from "react";
import { Newsreader } from "next/font/google";
import { CreatorsNav } from "@/components/creators/CreatorsNav";

const newsreader = Newsreader({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});

/**
 * Scoped layout for the five creators cube.
 *
 * Sets the editorial serif (Newsreader) on the branch so creator
 * philosophy lines and content titles can use `font-serif` for the
 * calm-creator-economy aesthetic — without polluting other cubes.
 */
export default function CreatorsLayout({ children }: { children: ReactNode }) {
  return (
    <div className={newsreader.variable}>
      <CreatorsNav />
      {children}
    </div>
  );
}
