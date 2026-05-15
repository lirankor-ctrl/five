"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { creators } from "@/data/creators/creators";
import { creatorCategories } from "@/data/creators/categories";
import { moods } from "@/data/creators/moods";
import { SESSION_TYPE_LABEL } from "@/lib/creators/format";
import { discoverSessions } from "@/lib/creators/match";
import { loadState, saveState, toggleSaved } from "@/lib/creators/storage";
import type {
  CreatorsState,
  DiscoverFilters,
  SessionType,
} from "@/lib/creators/types";
import { SessionCard } from "./SessionCard";

const DEFAULT_STATE: CreatorsState = {
  meCreatorId: "c-aria-veld",
  drafts: [],
  impactReports: [],
  saved: [],
  version: 1,
};

const SESSION_TYPE_OPTIONS: SessionType[] = [
  "thought-drop",
  "guided-session",
  "micro-course",
  "challenge",
  "parent-child",
  "organization-pack",
];

export function DiscoverView() {
  const [state, setState] = useState<CreatorsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  const [filters, setFilters] = useState<DiscoverFilters>({});
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CreatorsState) => {
    setState(next);
    saveState(next);
  }, []);

  const results = useMemo(
    () => discoverSessions(state, filters, committedQuery, 60),
    [state, filters, committedQuery],
  );

  const creatorMap = useMemo(
    () => new Map(creators.map((c) => [c.id, c])),
    [],
  );

  const hasFilters =
    Boolean(committedQuery) ||
    Boolean(filters.category) ||
    Boolean(filters.mood) ||
    Boolean(filters.type) ||
    Boolean(filters.maxDuration) ||
    Boolean(filters.energy) ||
    Boolean(filters.audience) ||
    (filters.pricing && filters.pricing !== "any");

  function clearAll() {
    setFilters({});
    setQuery("");
    setCommittedQuery("");
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      {/* Hero */}
      <header className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          discover
        </p>
        <h1 className="mt-5 font-serif text-3xl font-light leading-tight tracking-[-0.01em] text-ink md:text-5xl">
          What would you like for the next five minutes?
        </h1>
        <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          A curated, calm marketplace of short sessions — built by humans, not optimised by a feed.
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
              placeholder="Try “a five-minute reset” or “Swedish for beginners”…"
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

      {/* Mood intentions */}
      <section className="mt-10">
        <p className="mb-4 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          intentions
        </p>
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => {
            const active = filters.mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() =>
                  setFilters((f) => ({ ...f, mood: active ? undefined : m.id }))
                }
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-light italic transition-colors",
                  active
                    ? "border-ink/50 bg-ink text-paper not-italic"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {m.intention}
              </button>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section className="mt-8">
        <p className="mb-4 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          categories
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {creatorCategories.map((c) => {
            const active = filters.category === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    category: active ? undefined : c.id,
                  }))
                }
                className={cn(
                  "flex items-center gap-3 rounded-2xl border bg-surface p-3 text-left transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:shadow-soft",
                  active ? "border-ink/50 bg-paper" : "border-line hover:border-ink/30",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border text-base font-light",
                    active
                      ? "border-ink/50 bg-ink text-paper"
                      : "border-line text-ink-soft",
                  )}
                >
                  {c.glyph}
                </span>
                <div className="min-w-0">
                  <p className="text-[14px] font-light text-ink">{c.label}</p>
                  <p className="truncate text-[11px] font-light text-ink-mute">
                    {c.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Secondary filters */}
      <section className="mt-8 rounded-2xl border border-line bg-surface p-4 md:p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Group label="Type">
            <ChipRow>
              {SESSION_TYPE_OPTIONS.map((t) => (
                <Chip
                  key={t}
                  active={filters.type === t}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      type: f.type === t ? undefined : t,
                    }))
                  }
                >
                  {SESSION_TYPE_LABEL[t]}
                </Chip>
              ))}
            </ChipRow>
          </Group>

          <Group label="Duration">
            <ChipRow>
              {[3, 5, 7, 10].map((d) => (
                <Chip
                  key={d}
                  active={filters.maxDuration === d}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      maxDuration: f.maxDuration === d ? undefined : d,
                    }))
                  }
                >
                  ≤ {d} min
                </Chip>
              ))}
            </ChipRow>
          </Group>

          <Group label="Energy">
            <ChipRow>
              {(["low", "medium", "high"] as const).map((e) => (
                <Chip
                  key={e}
                  active={filters.energy === e}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      energy: f.energy === e ? undefined : e,
                    }))
                  }
                >
                  {e}
                </Chip>
              ))}
            </ChipRow>
          </Group>

          <Group label="Audience">
            <ChipRow>
              {(["solo", "child", "couple", "group"] as const).map((a) => (
                <Chip
                  key={a}
                  active={filters.audience === a}
                  onClick={() =>
                    setFilters((f) => ({
                      ...f,
                      audience: f.audience === a ? undefined : a,
                    }))
                  }
                >
                  {a}
                </Chip>
              ))}
            </ChipRow>
          </Group>
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {results.length} {results.length === 1 ? "session" : "sessions"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            clear all filters
          </button>
        )}
      </div>

      {/* Results */}
      <section className="mt-6">
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-10 text-center">
            <p className="text-[15px] font-light text-ink-soft">
              Nothing matches yet. Loosen a filter or try different words.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                creator={creatorMap.get(s.creatorId)}
                state={state}
                saved={hydrated ? state.saved.includes(s.id) : false}
                onSave={() => persist(toggleSaved(state, s.id))}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          A calm marketplace — curated, not algorithmic.
        </p>
      </div>
    </Container>
  );
}

function Group({
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
function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light capitalize transition-colors",
        active
          ? "border-ink/50 bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
