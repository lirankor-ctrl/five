"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  CATEGORY_LABEL,
  STATUS_LABEL,
  VISIBILITY_LABEL,
} from "@/lib/your-own/format";
import type { UserCube } from "@/lib/your-own/types";

type Props = {
  cube: UserCube;
  followed: boolean;
  onToggleFollow: () => void;
};

export function CubeCard({ cube, followed, onToggleFollow }: Props) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft group-hover:border-ink/30 group-hover:text-ink"
          >
            {cube.glyph}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {CATEGORY_LABEL[cube.category]}
            </p>
            <h3 className="mt-1 text-lg font-light tracking-brand text-ink md:text-xl">
              <Link
                href={`/cubes/your-own/c/${cube.id}`}
                className="hover:underline underline-offset-4"
              >
                {cube.name}
              </Link>
            </h3>
          </div>
        </div>
        {cube.status === "evolution-candidate" && (
          <span className="rounded-full border border-ink/40 bg-paper px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-ink">
            evolution candidate
          </span>
        )}
        {cube.status === "official" && (
          <span className="rounded-full border border-ink bg-ink px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-paper">
            official
          </span>
        )}
      </div>

      <p className="mt-4 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
        {cube.subtitle}
      </p>

      <p className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        by {cube.creatorName} · {VISIBILITY_LABEL[cube.visibility]}
      </p>

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {cube.followers ?? 0} followers · {cube.remixCount ?? 0} remixes
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFollow}
            className={cn(
              "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-light transition-colors",
              followed
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink hover:border-ink/40",
            )}
          >
            {followed ? "Following" : "Follow"}
          </button>
          <Link
            href={`/cubes/your-own/c/${cube.id}`}
            className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            open →
          </Link>
        </div>
      </div>

      {cube.status !== "published" && cube.status !== "draft" && (
        <p className="mt-4 border-t border-line/70 pt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {STATUS_LABEL[cube.status]} · {cube.evolutionVotes ?? 0} votes
        </p>
      )}
    </article>
  );
}
