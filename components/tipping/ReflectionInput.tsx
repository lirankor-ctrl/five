"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import type { Reflection } from "@/lib/tipping/types";
import { suggestedTriggers } from "@/data/tipping/triggers";

type Props = {
  initial?: Reflection;
  patternTriggers: string[];
  onSave: (reflection: Reflection | undefined) => void;
};

/**
 * Optional reflection: a short note + selectable triggers.
 *
 * Defaults closed so the check-in stays fast. The user opens it when
 * they want to. The fields here become longitudinal pattern data later.
 */
export function ReflectionInput({
  initial,
  patternTriggers,
  onSave,
}: Props) {
  const [open, setOpen] = useState(Boolean(initial?.text || initial?.triggers?.length));
  const [text, setText] = useState(initial?.text ?? "");
  const [triggers, setTriggers] = useState<string[]>(initial?.triggers ?? []);

  // Show the user's pre-selected triggers first, then the rest, deduped.
  const tagOptions = Array.from(
    new Set([...patternTriggers, ...suggestedTriggers]),
  );

  function commit() {
    const trimmed = text.trim();
    const next: Reflection | undefined =
      trimmed.length === 0 && triggers.length === 0
        ? undefined
        : { text: trimmed || undefined, triggers: triggers.length ? triggers : undefined };
    onSave(next);
  }

  function toggle(t: string) {
    setTriggers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-5 inline-flex items-center gap-2 text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
      >
        + add a reflection
      </button>
    );
  }

  return (
    <div className="mt-5 rounded-2xl border border-line bg-paper/70 p-5">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        notes for yourself
      </p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What made today what it was?"
        rows={3}
        className="mt-3 w-full resize-none rounded-md border border-line bg-transparent p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ember-500 focus:outline-none"
      />

      <p className="mt-5 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        triggers, if any
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tagOptions.map((t) => {
          const active = triggers.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() => toggle(t)}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-light transition-colors",
                active
                  ? "border-ember-500 bg-ember-100 text-ember-700"
                  : "border-line text-ink-soft hover:border-ember-300 hover:text-ink",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            setOpen(false);
          }}
          className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          Close
        </button>
        <button
          type="button"
          onClick={commit}
          className="inline-flex h-9 items-center rounded-full border border-ember-700 bg-ember-700 px-5 text-[13px] font-light text-paper hover:opacity-90"
        >
          Save reflection
        </button>
      </div>
    </div>
  );
}
