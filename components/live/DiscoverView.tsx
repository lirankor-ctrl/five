"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { eventCategories } from "@/data/live/categories";
import {
  CATEGORY_LABEL,
  INTERACTION_LABEL,
} from "@/lib/live/format";
import { generateLiveInsights } from "@/lib/live/insights";
import { allEvents, discover, recommend } from "@/lib/live/match";
import { loadState, saveState, toggleSaved } from "@/lib/live/storage";
import type {
  DiscoverFilters,
  EventCategory,
  InteractionStyle,
  LiveState,
} from "@/lib/live/types";
import { EventCard } from "./EventCard";
import { LiveDot } from "./LiveDot";

const DEFAULT_STATE: LiveState = {
  displayName: "Quiet five-er",
  anonymous: true,
  drafts: [],
  completions: [],
  saved: [],
  version: 1,
};

const INTERACTION_OPTIONS: InteractionStyle[] = [
  "silent",
  "guided",
  "check-in",
  "momentum-sprint",
];

export function DiscoverView() {
  const [state, setState] = useState<LiveState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
    // Tick once a minute so "starts in" / "live ends in" stay current.
    const id = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  const persist = useCallback((next: LiveState) => {
    setState(next);
    saveState(next);
  }, []);

  const buckets = useMemo(
    () => discover(state, filters, committedQuery, now),
    [state, filters, committedQuery, now],
  );

  const recommended = useMemo(
    () => recommend(state, 4, now),
    [state, now],
  );

  const insights = useMemo(
    () => generateLiveInsights(state, allEvents(state)),
    [state],
  );

  const hasFilters =
    Boolean(committedQuery) ||
    Boolean(filters.category) ||
    Boolean(filters.interaction) ||
    Boolean(filters.maxDuration);

  function setSaved(eventId: string) {
    persist(toggleSaved(state, eventId));
  }

  function clearAll() {
    setFilters({});
    setQuery("");
    setCommittedQuery("");
  }

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
    <Container size="wide" className="pb-24 pt-10 md:pt-14">
      {/* Hero */}
      <header className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          live · discover
        </p>
        <h1 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          Who is on right now?
        </h1>
        <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          A calm map of small shared lives. Find one that fits the next five minutes — or come back later.
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setCommittedQuery(query);
          }}
          className="mt-8"
        >
          <div className="group flex items-center gap-3 rounded-full border border-line bg-surface px-5 py-3 transition-colors focus-within:border-ink/40">
            <span aria-hidden="true" className="text-ink-mute">
              ⌕
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search lives — try “stretch” or “writing”…"
              className="flex-1 bg-transparent text-[15px] font-light text-ink placeholder:text-ink-mute/80 focus:outline-none"
            />
            {(query || committedQuery) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setCommittedQuery("");
                }}
                className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
              >
                clear
              </button>
            )}
          </div>
        </form>
      </header>

      {/* Filters */}
      <section className="mx-auto mt-8 max-w-5xl">
        <p className="mb-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          categories
        </p>
        <div className="flex flex-wrap gap-2">
          {eventCategories.map((c) => {
            const active = filters.category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    category: active ? undefined : (c.id as EventCategory),
                  }))
                }
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-light transition-colors",
                  active
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                <span aria-hidden="true">{c.glyph}</span>
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <FilterGroup label="Interaction">
            <div className="flex flex-wrap gap-2">
              {INTERACTION_OPTIONS.map((i) => {
                const active = filters.interaction === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        interaction: active ? undefined : i,
                      }))
                    }
                    className={cn(
                      "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                      active
                        ? "border-ink/50 bg-ink text-paper"
                        : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                    )}
                  >
                    {INTERACTION_LABEL[i]}
                  </button>
                );
              })}
            </div>
          </FilterGroup>
          <FilterGroup label="Duration">
            <div className="flex flex-wrap gap-2">
              {[5, 10, 15].map((d) => {
                const active = filters.maxDuration === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        maxDuration: active ? undefined : d,
                      }))
                    }
                    className={cn(
                      "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                      active
                        ? "border-ink/50 bg-ink text-paper"
                        : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                    )}
                  >
                    ≤ {d} min
                  </button>
                );
              })}
            </div>
          </FilterGroup>
        </div>
        {hasFilters && (
          <div className="mt-5 text-right">
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              clear all filters
            </button>
          </div>
        )}
      </section>

      {/* Live now */}
      <Section
        eyebrow={
          <span className="inline-flex items-center gap-2">
            <LiveDot />
            live now
          </span>
        }
        title="On at this moment."
        empty="Nothing live right now. A few starting soon below."
      >
        {buckets.live.length > 0 && (
          <Grid>
            {buckets.live.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                saved={state.saved.includes(e.id)}
                onToggleSaved={() => setSaved(e.id)}
              />
            ))}
          </Grid>
        )}
      </Section>

      {/* Starting soon */}
      <Section
        eyebrow="starting soon"
        title="In the next hour."
        empty="None inside the next hour. Try later today."
      >
        {buckets.startingSoon.length > 0 && (
          <Grid>
            {buckets.startingSoon.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                saved={state.saved.includes(e.id)}
                onToggleSaved={() => setSaved(e.id)}
              />
            ))}
          </Grid>
        )}
      </Section>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <Section
          eyebrow="for you"
          title="Quiet recommendations."
        >
          <Grid>
            {recommended.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                saved={state.saved.includes(e.id)}
                onToggleSaved={() => setSaved(e.id)}
              />
            ))}
          </Grid>
          {insights.length > 0 && (
            <ul className="mx-auto mt-8 max-w-2xl space-y-2 text-[13.5px] font-light italic leading-relaxed text-ink-soft">
              {insights.map((it, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink/40"
                  />
                  <span>{it.body}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      )}

      {/* Later today */}
      <Section
        eyebrow="later today"
        title="Still ahead today."
        empty="Nothing more today."
      >
        {buckets.laterToday.length > 0 && (
          <Grid>
            {buckets.laterToday.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                saved={state.saved.includes(e.id)}
                onToggleSaved={() => setSaved(e.id)}
              />
            ))}
          </Grid>
        )}
      </Section>

      {/* This week */}
      <Section
        eyebrow="this week"
        title="Coming up."
        empty="Nothing scheduled in the next seven days. You could host one."
      >
        {buckets.laterThisWeek.length > 0 && (
          <Grid>
            {buckets.laterThisWeek.map((e) => (
              <EventCard
                key={e.id}
                event={e}
                saved={state.saved.includes(e.id)}
                onToggleSaved={() => setSaved(e.id)}
              />
            ))}
          </Grid>
        )}
      </Section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Small moments. Shared momentum.
        </p>
      </div>
    </Container>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      {children}
    </div>
  );
}

function Section({
  eyebrow,
  title,
  empty,
  children,
}: {
  eyebrow: React.ReactNode;
  title: string;
  empty?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="mt-14">
      <header className="mx-auto mb-6 max-w-5xl flex items-baseline justify-between gap-4">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            {title}
          </h2>
        </div>
      </header>
      {children ?? (
        <div className="mx-auto max-w-5xl rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
          <p className="text-[14px] font-light text-ink-soft">{empty}</p>
        </div>
      )}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
