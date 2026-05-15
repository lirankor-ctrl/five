"use client";

import { cn } from "@/lib/cn";
import type { ContentCategoryId } from "@/lib/content/types";
import { contentCategories } from "@/data/content/categories";

type Props = {
  selected: ContentCategoryId | undefined;
  onSelect: (id: ContentCategoryId | undefined) => void;
};

export function CategoryGrid({ selected, onSelect }: Props) {
  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <p className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute">
          Categories
        </p>
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(undefined)}
            className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
          >
            clear
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {contentCategories.map((c) => {
          const active = c.id === selected;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(active ? undefined : c.id)}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border bg-surface p-4 text-left transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:shadow-soft",
                active
                  ? "border-ink/50 bg-paper"
                  : "border-line hover:border-ink/30",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base font-light",
                  active
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft group-hover:border-ink/30 group-hover:text-ink",
                )}
              >
                {c.glyph}
              </span>
              <div className="min-w-0">
                <p className="text-[15px] font-light text-ink">{c.label}</p>
                <p className="truncate text-[12px] font-light text-ink-mute">
                  {c.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
