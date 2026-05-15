"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { familyPrompts } from "@/data/family/prompts";
import { familyWorlds, getWorld } from "@/data/family/worlds";
import type {
  FamilyFiveWorld,
  Ritual,
} from "@/lib/family/types";

type Props = {
  onLogQuick: (world: FamilyFiveWorld, label: string) => void;
  /** Used to softly highlight the world tied to the user's existing rituals. */
  rituals: Ritual[];
};

/**
 * Soft suggestions panel — pick a world, see a short list of prompts.
 *
 * A click on a prompt logs a quick "we had a moment" against that world,
 * without forcing the user through a long reporting form.
 */
export function Suggestions({ onLogQuick, rituals }: Props) {
  const ritualWorlds = new Set(rituals.map((r) => r.world));
  const initialWorld = familyWorlds.find((w) => ritualWorlds.has(w.id))?.id ?? "talk";
  const [active, setActive] = useState<FamilyFiveWorld>(initialWorld);
  const world = getWorld(active);
  const prompts = familyPrompts[active] ?? [];

  return (
    <section>
      <header className="mb-4">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-hearth-700">
          a small bank of ideas
        </p>
        <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
          One small five, ready when you are.
        </h2>
      </header>

      <div className="flex flex-wrap gap-2">
        {familyWorlds.map((w) => (
          <button
            key={w.id}
            type="button"
            onClick={() => setActive(w.id)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-light transition-colors",
              active === w.id
                ? "border-hearth-500 bg-hearth-700 text-paper"
                : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
            )}
          >
            <span aria-hidden="true">{w.glyph}</span>
            {w.label}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-3xl border border-line bg-surface p-5 md:p-7">
        <p className="text-[14px] font-light italic leading-relaxed text-ink-soft">
          {world?.body}
        </p>
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {prompts.map((p) => (
            <li key={p.id} className="flex items-start gap-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-light leading-relaxed text-ink">
                  {p.label}
                </p>
                {p.hint && (
                  <p className="mt-1 text-[12px] font-light italic leading-relaxed text-ink-mute">
                    {p.hint}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => onLogQuick(active, p.label)}
                className="inline-flex h-9 shrink-0 items-center rounded-full border border-hearth-500 px-3 text-[12px] font-light text-hearth-700 transition-colors hover:bg-hearth-100"
              >
                We did this
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[12px] font-light italic leading-relaxed text-ink-mute">
          Nothing here needs to happen. Pick one if it feels right.
        </p>
      </div>
    </section>
  );
}
