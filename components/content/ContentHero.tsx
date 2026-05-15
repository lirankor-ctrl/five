"use client";

import { FormEvent } from "react";
import { RiverLine } from "@/components/RiverLine";

type Props = {
  query: string;
  onQuery: (q: string) => void;
  onSubmit: () => void;
};

const QUICK_INTENTIONS = [
  "I want a quick breathing exercise",
  "Five minutes of Spanish",
  "Short philosophy idea",
  "Reset my focus",
  "Five-minute stretch",
  "Something creative",
];

export function ContentHero({ query, onQuery, onSubmit }: Props) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <header className="mx-auto w-full max-w-3xl px-6 pt-12 md:px-10 md:pt-20">
      <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
        five content
      </p>
      <h1 className="mt-4 text-balance text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
        Turn the internet into a five-minute growth engine.
      </h1>
      <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft md:text-base">
        Type what you want for the next five minutes — or pick a category.
        We&rsquo;ll point you at something existing, real, and small enough to finish.
      </p>
      <div className="mt-8 w-20">
        <RiverLine />
      </div>

      <form onSubmit={handleSubmit} className="mt-10">
        <div className="group flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 transition-colors focus-within:border-ink/40">
          <span aria-hidden="true" className="text-ink-mute">
            ⌕
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="What would you like for the next five minutes?"
            className="flex-1 bg-transparent text-[15px] font-light text-ink placeholder:text-ink-mute/80 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => onQuery("")}
              aria-label="Clear search"
              className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
            >
              clear
            </button>
          )}
          <button
            type="submit"
            className="ml-2 hidden h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent sm:inline-flex"
          >
            Find five
          </button>
        </div>
      </form>

      <div className="mt-5 flex flex-wrap gap-2">
        {QUICK_INTENTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              onQuery(q);
              onSubmit();
            }}
            className="rounded-full border border-line bg-transparent px-3 py-1 text-[12px] font-light text-ink-mute transition-colors hover:border-ink/40 hover:text-ink"
          >
            {q}
          </button>
        ))}
      </div>
    </header>
  );
}
