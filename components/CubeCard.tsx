import Link from "next/link";
import type { Cube } from "@/lib/types";
import { cn } from "@/lib/cn";

const statusLabel: Record<Cube["status"], string> = {
  start: "Start",
  explore: "Explore",
  "coming-soon": "Coming soon",
};

const statusStyle: Record<Cube["status"], string> = {
  start: "text-ink",
  explore: "text-ink-soft",
  "coming-soon": "text-ink-mute",
};

export function CubeCard({ cube }: { cube: Cube }) {
  return (
    <Link
      href={`/cubes/${cube.id}`}
      className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-7"
    >
      <div>
        <div className="mb-5 flex items-start justify-between">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line text-lg font-light text-ink-soft transition-colors group-hover:border-ink/30 group-hover:text-ink"
            aria-hidden="true"
          >
            {cube.accent?.glyph ?? "·"}
          </span>
          <span
            className={cn(
              "text-[11px] font-light uppercase tracking-[0.2em]",
              statusStyle[cube.status],
            )}
          >
            {statusLabel[cube.status]}
          </span>
        </div>

        <h3 className="text-xl font-light tracking-brand text-ink">
          {cube.name}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
          {cube.shortDescription}
        </p>
      </div>

      <div className="mt-8 flex items-center justify-between text-sm font-light text-ink-mute transition-colors group-hover:text-ink">
        <span>Enter</span>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
}
