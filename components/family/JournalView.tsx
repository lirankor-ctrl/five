"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { getWorld } from "@/data/family/worlds";
import {
  CADENCE_LABEL,
  FEELING_LABEL,
  dayMonthLabel,
  monthLabel,
} from "@/lib/family/format";
import {
  totalMomentsInMonth,
} from "@/lib/family/insights";
import { loadState } from "@/lib/family/storage";
import type {
  FamilyFiveWorld,
  FamilySession,
  FamilyState,
  Ritual,
} from "@/lib/family/types";

const DEFAULT_STATE: FamilyState = {
  group: null,
  rituals: [],
  sessions: [],
  version: 1,
};

export function JournalView() {
  const [state, setState] = useState<FamilyState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const done = useMemo(
    () => state.sessions.filter((s) => s.status === "done"),
    [state.sessions],
  );
  const totalAll = done.length;
  const totalThisMonth = useMemo(() => totalMomentsInMonth(state), [state]);

  // Group by month
  const byMonth = useMemo(() => {
    const map = new Map<string, { date: Date; items: FamilySession[] }>();
    for (const s of done) {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const bucket = map.get(key) ?? { date: d, items: [] };
      bucket.items.push(s);
      map.set(key, bucket);
    }
    const entries = Array.from(map.entries());
    entries.sort((a, b) => (a[0] < b[0] ? 1 : -1));
    for (const [, v] of entries) {
      v.items.sort((a, b) => (a.reportedAt < b.reportedAt ? 1 : -1));
    }
    return entries;
  }, [done]);

  // Per-world tally (whole history)
  const worldTally = useMemo(() => {
    const map = new Map<FamilyFiveWorld, number>();
    for (const s of done) map.set(s.world, (map.get(s.world) ?? 0) + 1);
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [done]);

  const ritualsById = useMemo(() => {
    const map = new Map<string, Ritual>();
    for (const r of state.rituals) map.set(r.id, r);
    return map;
  }, [state.rituals]);

  if (!hydrated) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </Container>
    );
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-hearth-700">
          family journal
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
          A soft record of small moments.
        </h1>
        <p className="mt-3 max-w-prose text-[14px] font-light text-ink-soft">
          Nothing to optimise. A quiet reminder of what you returned to. Future you will be glad these are here.
        </p>

        <div className="mt-8 flex flex-wrap items-baseline gap-10">
          <Headline value={String(totalThisMonth)} label={monthLabel().toLowerCase()} />
          <Headline value={String(totalAll)} label="all-time moments" />
        </div>
      </header>

      {/* Worlds tally */}
      {worldTally.length > 0 && (
        <section className="mt-10">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            the worlds that showed up
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {worldTally.map(([w, count]) => {
              const meta = getWorld(w);
              return (
                <li
                  key={w}
                  className="rounded-2xl border border-hearth-200 bg-hearth-50 p-4"
                >
                  <p className="text-[11px] font-light uppercase tracking-[0.22em] text-hearth-700">
                    {meta?.label}
                  </p>
                  <p className="mt-1 text-2xl font-thin tracking-brand text-ink">
                    {count}
                  </p>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Timeline */}
      <section className="mt-12">
        {byMonth.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-paper/40 p-10 text-center">
            <p className="text-[15px] font-light italic leading-relaxed text-ink-soft">
              No moments yet — and that is also a beginning. The first one will appear here.
            </p>
          </div>
        ) : (
          byMonth.map(([key, bucket]) => (
            <article key={key} className="mb-12">
              <header className="mb-5">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {bucket.date.toLocaleDateString(undefined, {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-2 text-[14px] font-light italic text-ink-soft">
                  {gentleMonthSummary(bucket.items.length)}
                </p>
              </header>
              <ul className="space-y-3">
                {bucket.items.map((s) => {
                  const world = getWorld(s.world);
                  const ritual = s.ritualId ? ritualsById.get(s.ritualId) : undefined;
                  return (
                    <li
                      key={s.id}
                      className="rounded-2xl border border-line bg-surface p-5"
                    >
                      <div className="flex items-start gap-4">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-hearth-200 bg-hearth-50 text-base font-light text-hearth-700",
                          )}
                        >
                          {world?.glyph ?? "·"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[15px] font-light text-ink">
                            {ritual?.label ?? world?.label ?? "A five"}
                          </p>
                          <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                            {dayMonthLabel(s.date)}
                            <span aria-hidden="true"> · </span>
                            {world?.label}
                            {ritual && (
                              <>
                                <span aria-hidden="true"> · </span>
                                {CADENCE_LABEL[ritual.cadence].toLowerCase()}
                              </>
                            )}
                            {s.durationMinutes && (
                              <>
                                <span aria-hidden="true"> · </span>
                                {s.durationMinutes} min
                              </>
                            )}
                          </p>
                          {s.note && (
                            <p className="mt-3 max-w-prose text-[15px] font-light italic leading-relaxed text-ink-soft">
                              “{s.note}”
                            </p>
                          )}
                          {s.feelings && s.feelings.length > 0 && (
                            <p className="mt-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                              felt: {s.feelings.map((f) => FEELING_LABEL[f]).join(" · ")}
                            </p>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>
          ))
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          A family is made of these.
        </p>
      </div>
    </Container>
  );
}

function Headline({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-1 text-3xl font-thin tracking-brand text-ink md:text-4xl">
        {value}
      </p>
    </div>
  );
}

function gentleMonthSummary(count: number): string {
  if (count === 1) return "One small moment this month.";
  if (count <= 3) return `${count} small moments. Already more than nothing.`;
  if (count <= 8) return `${count} moments. A soft rhythm.`;
  if (count <= 20) return `${count} moments. The home felt a little more like home.`;
  return `${count} moments. A river of small returns.`;
}
