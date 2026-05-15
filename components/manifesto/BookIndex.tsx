"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { loadReadingState } from "@/lib/manifesto/storage";
import type { BookChapter, ReadingState } from "@/lib/manifesto/types";

type Props = {
  chapters: BookChapter[];
};

export function BookIndex({ chapters }: Props) {
  const [state, setState] = useState<ReadingState | null>(null);

  useEffect(() => {
    setState(loadReadingState());
  }, []);

  return (
    <ul className="divide-y divide-line border-y border-line">
      {chapters.map((chapter) => {
        const progress = state?.progress?.[chapter.id] ?? 0;
        const bookmarked = state?.bookmarks?.includes(chapter.id) ?? false;
        const started = progress > 0.02;
        const completed = progress >= 0.95;
        return (
          <li key={chapter.id}>
            <Link
              href={`/cubes/manifesto/book/${chapter.id}`}
              className="group flex flex-col gap-2 py-8 transition-colors md:flex-row md:items-baseline md:gap-10 md:py-10"
            >
              <span className="w-10 shrink-0 font-serif text-sm font-light italic text-ink-mute md:text-base">
                {romanise(chapter.number)}
              </span>
              <div className="flex-1">
                <h3 className="font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink transition-colors group-hover:text-accent md:text-3xl">
                  {chapter.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-[15px] font-light leading-relaxed text-ink-soft">
                  {chapter.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  <span>{chapter.readingMinutes} min</span>
                  {chapter.audioAvailable && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>audio</span>
                    </>
                  )}
                  {started && !completed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-ink">
                        {Math.round(progress * 100)}% read
                      </span>
                    </>
                  )}
                  {completed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-ink">finished</span>
                    </>
                  )}
                  {bookmarked && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-ink">bookmarked</span>
                    </>
                  )}
                </div>
              </div>
              <span
                aria-hidden="true"
                className={cn(
                  "self-end text-2xl font-light text-ink-mute transition-all md:self-baseline",
                  "group-hover:translate-x-0.5 group-hover:text-ink",
                )}
              >
                →
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function romanise(n: number): string {
  const numerals: Array<[number, string]> = [
    [10, "x"],
    [9, "ix"],
    [5, "v"],
    [4, "iv"],
    [1, "i"],
  ];
  let out = "";
  let remaining = n;
  for (const [value, sym] of numerals) {
    while (remaining >= value) {
      out += sym;
      remaining -= value;
    }
  }
  return out;
}
