"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import {
  AUDIENCE_LABEL,
  DIFFICULTY_LABEL,
  PRICING_LABEL,
  SESSION_TYPE_LABEL,
} from "@/lib/creators/format";
import { impactTotal } from "@/lib/creators/analytics";
import type {
  Creator,
  CreatorSession,
  CreatorsState,
} from "@/lib/creators/types";
import { impactFor } from "@/lib/creators/analytics";

type Props = {
  session: CreatorSession;
  creator?: Creator;
  state: CreatorsState;
  saved: boolean;
  onSave: () => void;
};

export function SessionCard({ session, creator, state, saved, onSave }: Props) {
  const counts = impactFor(session, state);
  const total = impactTotal(counts);

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          <span className="text-ink">{SESSION_TYPE_LABEL[session.type]}</span>
          <span aria-hidden="true">·</span>
          <span>{session.durationMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{DIFFICULTY_LABEL[session.difficulty]}</span>
        </div>
        <PriceTag pricing={session.pricing} sponsored={session.sponsored} />
      </div>

      <h3 className="mt-5 font-serif text-xl font-light leading-snug tracking-[-0.01em] text-ink md:text-2xl">
        <Link href={`/cubes/creators/content/${session.id}`} className="hover:underline underline-offset-4">
          {session.title}
        </Link>
      </h3>
      <p className="mt-2 font-serif text-[15px] italic font-light leading-relaxed text-ink-soft">
        {session.hook}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-light uppercase tracking-[0.18em] text-ink-mute">
        {session.sessionCount && (
          <span>{session.sessionCount} sessions</span>
        )}
        <span>{AUDIENCE_LABEL[session.audience]}</span>
        {session.mediaTypes.slice(0, 3).map((m) => (
          <span key={m} className="rounded-full border border-line px-2 py-0.5">
            {m}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6">
        <Link
          href={`/cubes/creators/profile/${session.creatorId}`}
          className="text-[12px] font-light text-ink-mute hover:text-ink"
        >
          by{" "}
          <span className="text-ink-soft">
            {creator?.name ?? "unknown"}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSave}
            aria-label={saved ? "Remove from saved" : "Save"}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-full border text-[15px] transition-colors",
              saved
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
            )}
          >
            <span aria-hidden="true">✦</span>
          </button>
          <Link
            href={`/cubes/creators/content/${session.id}`}
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent"
          >
            Open
          </Link>
        </div>
      </div>

      {total > 0 && (
        <div className="mt-5 border-t border-line/70 pt-4 text-[11px] font-light uppercase tracking-[0.18em] text-ink-mute">
          {total} human impact reports
        </div>
      )}
    </article>
  );
}

function PriceTag({
  pricing,
  sponsored,
}: {
  pricing: CreatorSession["pricing"];
  sponsored?: boolean;
}) {
  if (sponsored) {
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-ink-mute">
        partner pick
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-ink-soft">
      {PRICING_LABEL[pricing]}
    </span>
  );
}
