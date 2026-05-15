"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import {
  IMPACT_QUESTIONS,
  IMPACT_QUESTION_LABEL,
} from "@/lib/creators/format";
import type {
  CreatorSession,
  HumanImpactCounts,
  HumanImpactQuestion,
} from "@/lib/creators/types";

type Props = {
  session: CreatorSession;
  counts: HumanImpactCounts;
  alreadyReported: boolean;
  onSubmit: (marked: HumanImpactQuestion[], note?: string) => void;
};

/**
 * Human impact rating UI — discrete positive-only questions, never stars.
 */
export function HumanImpactPanel({
  session,
  counts,
  alreadyReported,
  onSubmit,
}: Props) {
  const [marked, setMarked] = useState<HumanImpactQuestion[]>([]);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(alreadyReported);

  const total = useMemo(
    () => IMPACT_QUESTIONS.reduce((a, q) => a + (counts[q] ?? 0), 0),
    [counts],
  );

  function toggle(q: HumanImpactQuestion) {
    setMarked((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q],
    );
  }

  function commit() {
    if (marked.length === 0) return;
    onSubmit(marked, note.trim() || undefined);
    setSubmitted(true);
  }

  return (
    <section className="rounded-3xl border border-line bg-surface p-6 md:p-8">
      <header className="flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            human impact
          </p>
          <h3 className="mt-2 font-serif text-xl font-light tracking-[-0.01em] text-ink md:text-2xl">
            How did this land?
          </h3>
        </div>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {total} reports
        </p>
      </header>

      {!submitted && (
        <>
          <p className="mt-4 text-[14px] font-light leading-relaxed text-ink-soft">
            Pick anything that is honestly true. No stars, no scores. Creators only see counts — never your name.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {IMPACT_QUESTIONS.map((q) => {
              const active = marked.includes(q);
              return (
                <button
                  key={q}
                  type="button"
                  onClick={() => toggle(q)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors duration-300 ease-calm",
                    active
                      ? "border-ink/60 bg-ink text-paper"
                      : "border-line bg-paper/60 text-ink hover:border-ink/30",
                  )}
                >
                  <p className="text-[14px] font-light tracking-brand">
                    {IMPACT_QUESTION_LABEL[q]}
                  </p>
                </button>
              );
            })}
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Optional — one short line the creator might read."
            className="mt-5 w-full resize-none rounded-md border border-line bg-paper p-3 text-[14px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
          <div className="mt-5 flex items-center justify-end">
            <button
              type="button"
              onClick={commit}
              disabled={marked.length === 0}
              className={cn(
                "inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-light text-paper hover:bg-accent",
                marked.length === 0 && "cursor-not-allowed opacity-40",
              )}
            >
              Send impact
            </button>
          </div>
        </>
      )}

      {submitted && (
        <p className="mt-5 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
          Recorded. {session.title} now has {total + marked.length} human-impact marks. The creator only sees totals.
        </p>
      )}

      {/* Per-question counts */}
      <div className="mt-8 grid grid-cols-1 gap-3 border-t border-line/60 pt-6 md:grid-cols-2">
        {IMPACT_QUESTIONS.map((q) => {
          const c = counts[q] ?? 0;
          const pct = total === 0 ? 0 : (c / total) * 100;
          return (
            <div key={q}>
              <div className="flex items-center justify-between text-[13px] font-light">
                <span className="text-ink-soft">{IMPACT_QUESTION_LABEL[q]}</span>
                <span className="text-ink-mute tabular-nums">{c}</span>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full bg-ink"
                  style={{ width: `${pct.toFixed(0)}%`, opacity: 0.35 + (c / Math.max(1, total)) * 0.65 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
