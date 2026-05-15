"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import {
  refKindLabel,
  researchNotes,
  researchReferences,
} from "@/data/tipping/research";

/**
 * "You Are Not Alone" — the research/community panel.
 *
 * Collapsed by default. Tone is non-shaming editorial — short notes plus
 * a reading shelf. No URLs ship today; the shelf is structural and the
 * source label tells the user where to find it.
 */
export function NotAlone() {
  const [open, setOpen] = useState(false);

  return (
    <section className={cn("rounded-3xl border border-line bg-paper", open && "bg-ember-50/40")}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left md:px-8 md:py-7"
        aria-expanded={open}
      >
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ember-700">
            you are not alone
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            What the research actually says.
          </h2>
          {!open && (
            <p className="mt-2 max-w-prose text-[14px] font-light leading-relaxed text-ink-soft">
              Short, non-shaming notes on why these patterns are so common — and what helps.
            </p>
          )}
        </div>
        <span
          aria-hidden="true"
          className={cn(
            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-all",
            open && "rotate-180 border-ember-500 text-ember-700",
          )}
        >
          ↓
        </span>
      </button>

      {open && (
        <div className="space-y-12 border-t border-line/60 px-6 py-8 md:px-8 md:py-10">
          <div className="space-y-8">
            {researchNotes.map((note) => (
              <article key={note.id} className="border-l border-ember-200 pl-5">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ember-700">
                  {note.eyebrow}
                </p>
                <h3 className="mt-2 text-[17px] font-light tracking-brand text-ink md:text-lg">
                  {note.title}
                </h3>
                <p className="mt-3 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
                  {note.body}
                </p>
              </article>
            ))}
          </div>

          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              a short reading shelf
            </p>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {researchReferences.map((r) => (
                <li
                  key={r.id}
                  className="flex items-center justify-between gap-6 py-3 text-[14px] font-light text-ink"
                >
                  <span>
                    {r.title}
                    <span className="ml-2 text-ink-mute">— {r.source}</span>
                  </span>
                  <span className="shrink-0 text-[11px] font-light uppercase tracking-[0.22em] text-ember-700">
                    {refKindLabel[r.kind]}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 max-w-prose text-[12px] font-light leading-relaxed text-ink-mute">
              External links will attach when this shelf moves to a CMS. The point of this section is not to send you to more screens. It is to make the loop visible.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
