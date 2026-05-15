import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Concept } from "@/lib/manifesto/types";

/**
 * Visual concept map — placeholder layout.
 *
 * Renders the concept and its related concepts as a quiet radial cluster,
 * positioned by polar coordinates. Not interactive yet — the structure is
 * here so a future SVG/canvas version can drop in without breaking links.
 */
export function ConceptMap({
  center,
  related,
  className,
}: {
  center: Concept;
  related: Concept[];
  className?: string;
}) {
  const count = Math.max(related.length, 1);
  return (
    <div
      className={cn(
        "relative mx-auto h-[360px] w-full max-w-xl rounded-3xl border border-line bg-surface md:h-[460px]",
        className,
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="rounded-full border border-ink/30 bg-paper px-5 py-3 text-center">
          <p className="text-[10px] font-light uppercase tracking-[0.25em] text-ink-mute">
            you are here
          </p>
          <p className="mt-1 font-serif text-base font-light text-ink">
            {center.title}
          </p>
        </div>
      </div>
      {related.map((c, i) => {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const radius = 38; // percent of half-width
        const x = 50 + Math.cos(angle) * radius;
        const y = 50 + Math.sin(angle) * radius;
        return (
          <Link
            key={c.id}
            href={`/cubes/manifesto/micro-multipotentiality/${c.id}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-paper px-3 py-2 text-center text-[11px] font-light tracking-[-0.005em] text-ink-soft transition-colors hover:border-ink/40 hover:text-ink md:text-xs"
          >
            {c.title}
          </Link>
        );
      })}
      {/* Quiet hairlines from centre to each node */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        {related.map((_, i) => {
          const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
          const radius = 38;
          const x2 = 50 + Math.cos(angle) * radius;
          const y2 = 50 + Math.sin(angle) * radius;
          return (
            <line
              key={i}
              x1="50%"
              y1="50%"
              x2={`${x2}%`}
              y2={`${y2}%`}
              stroke="currentColor"
              strokeOpacity="0.12"
              strokeWidth="1"
            />
          );
        })}
      </svg>
    </div>
  );
}
