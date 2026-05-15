"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import {
  COMMUNITY_TYPE_HINT,
  COMMUNITY_TYPE_LABEL,
} from "@/lib/community/format";
import { generateCommunityInsights } from "@/lib/community/insights";
import { discoverCommunities, recommendForUser } from "@/lib/community/match";
import { loadState, saveState, toggleJoin } from "@/lib/community/storage";
import type {
  CommunityState,
  CommunityType,
  DiscoverFilters,
} from "@/lib/community/types";
import { CommunityCard } from "./CommunityCard";

const DEFAULT_STATE: CommunityState = {
  joinedCommunities: [],
  myDrops: [],
  myJournal: null,
  followedPaths: [],
  pathProgress: {},
  version: 1,
};

const TYPES: CommunityType[] = [
  "interest",
  "identity",
  "micro-multipotential",
];

export function DiscoverView() {
  const [state, setState] = useState<CommunityState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [filters, setFilters] = useState<DiscoverFilters>({});
  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CommunityState) => {
    setState(next);
    saveState(next);
  }, []);

  const results = useMemo(
    () => discoverCommunities(filters, committedQuery),
    [filters, committedQuery],
  );
  const recommended = useMemo(
    () => recommendForUser(state, 4),
    [state],
  );
  const insights = useMemo(
    () => generateCommunityInsights(state),
    [state],
  );

  const hasFilters =
    Boolean(committedQuery) ||
    Boolean(filters.type) ||
    Boolean(filters.tag);

  return (
    <Container size="wide" className="pb-24 pt-10 md:pt-14">
      <header className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          discover
        </p>
        <h1 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          A small community for the next drip.
        </h1>
        <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          Calm, slow, often quiet. Sorted by what fits you — not by what is trending.
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>

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
              placeholder="Try “philosophy” or “returning”…"
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

      {/* Type filters */}
      <section className="mx-auto mt-8 max-w-5xl">
        <p className="mb-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          type
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const active = filters.type === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() =>
                  setFilters((f) => ({ ...f, type: active ? undefined : t }))
                }
                className={cn(
                  "rounded-2xl border bg-surface px-4 py-3 text-left transition-all hover:border-ink/30",
                  active ? "border-ink/50 bg-paper" : "border-line",
                )}
              >
                <p className="text-[14px] font-light text-ink">
                  {COMMUNITY_TYPE_LABEL[t]}
                </p>
                <p className="mt-1 max-w-[28ch] text-[11.5px] font-light italic leading-relaxed text-ink-mute">
                  {COMMUNITY_TYPE_HINT[t]}
                </p>
              </button>
            );
          })}
        </div>
        {hasFilters && (
          <div className="mt-4 text-right">
            <button
              type="button"
              onClick={() => {
                setFilters({});
                setQuery("");
                setCommittedQuery("");
              }}
              className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              clear all
            </button>
          </div>
        )}
      </section>

      {/* Recommendations */}
      {recommended.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl">
          <header className="mb-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              compatible with you
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              People like you tend to land here.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommended.map((c) => (
              <CommunityCard
                key={c.id}
                community={c}
                joined={hydrated ? state.joinedCommunities.includes(c.id) : false}
                onToggleJoin={() => persist(toggleJoin(state, c.id))}
              />
            ))}
          </div>
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
        </section>
      )}

      {/* Results */}
      <section className="mx-auto mt-12 max-w-5xl">
        <header className="mb-5 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              all communities
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              {filters.type
                ? `${COMMUNITY_TYPE_LABEL[filters.type]} communities`
                : "Browse the whole map."}
            </h2>
          </div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            {results.length} {results.length === 1 ? "place" : "places"}
          </p>
        </header>
        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              Nothing matches yet. Try different words or loosen the filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((c) => (
              <CommunityCard
                key={c.id}
                community={c}
                joined={hydrated ? state.joinedCommunities.includes(c.id) : false}
                onToggleJoin={() => persist(toggleJoin(state, c.id))}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Compatibility, not popularity.
        </p>
      </div>
    </Container>
  );
}
