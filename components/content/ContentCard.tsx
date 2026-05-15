"use client";

import { cn } from "@/lib/cn";
import {
  DIFFICULTY_LABEL,
  PRICING_LABEL,
  TYPE_LABEL,
} from "@/lib/content/format";
import type { ContentItem, ContentProvider } from "@/lib/content/types";

type Props = {
  item: ContentItem;
  provider?: ContentProvider;
  onStart: (item: ContentItem) => void;
  onSavePath: (item: ContentItem) => void;
};

export function ContentCard({ item, provider, onStart, onSavePath }: Props) {
  const isPaid = item.pricing === "paid";
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          <span className="text-ink">{TYPE_LABEL[item.contentType]}</span>
          <span aria-hidden="true">·</span>
          <span>{item.durationMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{DIFFICULTY_LABEL[item.difficulty]}</span>
        </div>
        <PriceTag pricing={item.pricing} sponsored={item.sponsored} />
      </div>

      <h3 className="mt-5 text-lg font-light leading-snug tracking-brand text-ink md:text-xl">
        {item.title}
      </h3>

      <p className="mt-2 text-[14.5px] font-light leading-relaxed text-ink-soft">
        {item.description}
      </p>

      <div className="mt-5 rounded-xl border border-line/70 bg-paper/50 p-3">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          why it fits five
        </p>
        <p className="mt-2 text-[13.5px] font-light leading-relaxed text-ink-soft">
          {item.whyItFits}
        </p>
      </div>

      <div className="mt-auto flex items-end justify-between gap-4 pt-6">
        <span className="text-[12px] font-light text-ink-mute">
          via{" "}
          <span className="text-ink-soft">
            {provider?.name ?? "unknown"}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSavePath(item)}
            aria-label="Save as a recurring path"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
            title="Save as a recurring path"
          >
            <span aria-hidden="true">✦</span>
          </button>
          <button
            type="button"
            onClick={() => onStart(item)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full bg-ink px-4 text-[13px] font-light text-paper transition-colors hover:bg-accent",
            )}
          >
            <span>Start five</span>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>

      {/* Sponsored is silent today — UI is ready when monetization turns on. */}
      {item.sponsored && (
        <p className="mt-3 text-[10px] font-light uppercase tracking-[0.2em] text-ink-mute">
          partner pick · {isPaid ? "paid" : "free"}
        </p>
      )}
    </article>
  );
}

function PriceTag({
  pricing,
  sponsored,
}: {
  pricing: ContentItem["pricing"];
  sponsored?: boolean;
}) {
  if (sponsored) {
    return (
      <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-ink-mute">
        sponsored
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-ink-soft">
      {PRICING_LABEL[pricing]}
    </span>
  );
}
