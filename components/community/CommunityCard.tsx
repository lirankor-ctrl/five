"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { COMMUNITY_TYPE_LABEL } from "@/lib/community/format";
import type { Community } from "@/lib/community/types";

type Props = {
  community: Community;
  joined: boolean;
  onToggleJoin: () => void;
};

export function CommunityCard({ community: c, joined, onToggleJoin }: Props) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft group-hover:border-ink/30 group-hover:text-ink"
          >
            {c.glyph}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {COMMUNITY_TYPE_LABEL[c.type]}
            </p>
            <h3 className="mt-1 text-lg font-light tracking-brand text-ink md:text-xl">
              <Link
                href={`/cubes/community/c/${c.id}`}
                className="hover:underline underline-offset-4"
              >
                {c.name}
              </Link>
            </h3>
          </div>
        </div>
      </div>

      <p className="mt-4 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
        {c.oneLine}
      </p>

      <p className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {c.memberCount.toLocaleString()} people · {c.weeklyDrops} drops this week
      </p>

      {c.presence.length > 0 && (
        <div className="mt-4 rounded-xl border border-line/70 bg-paper/60 p-3 text-[12px] font-light leading-relaxed text-ink-soft">
          {c.presence.slice(0, 2).map((p, i) => (
            <p key={i}>
              <span className="text-ink">{p.count}</span> {p.activity}
            </p>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between gap-3 pt-6">
        <Link
          href={`/cubes/community/c/${c.id}`}
          className="text-[12.5px] font-light text-ink-soft hover:text-ink"
        >
          Enter →
        </Link>
        <button
          type="button"
          onClick={onToggleJoin}
          className={cn(
            "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-light transition-colors",
            joined
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink hover:border-ink/40",
          )}
        >
          {joined ? "Joined" : "Join"}
        </button>
      </div>
    </article>
  );
}
