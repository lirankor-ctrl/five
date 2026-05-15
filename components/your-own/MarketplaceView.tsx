"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { communityCubes } from "@/data/your-own/community-cubes";
import {
  CATEGORY_LABEL,
  EMOTIONAL_CATEGORIES,
} from "@/lib/your-own/format";
import {
  loadState,
  saveState,
  toggleFollow,
} from "@/lib/your-own/storage";
import type {
  EmotionalCategory,
  UserCube,
  YourOwnState,
} from "@/lib/your-own/types";
import { CubeCard } from "./CubeCard";

const DEFAULT_STATE: YourOwnState = {
  myCubes: [],
  sessions: [],
  followedCubes: [],
  draft: {},
  version: 1,
};

export function MarketplaceView() {
  const [state, setState] = useState<YourOwnState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [category, setCategory] = useState<EmotionalCategory | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: YourOwnState) => {
    setState(next);
    saveState(next);
  }, []);

  // All cubes = seeded + my published cubes
  const allCubes: UserCube[] = useMemo(() => {
    return [
      ...communityCubes,
      ...state.myCubes.filter(
        (c) => c.visibility === "community" || c.visibility === "public",
      ),
    ];
  }, [state.myCubes]);

  const filtered = useMemo(() => {
    const tokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    return allCubes.filter((c) => {
      if (category && c.category !== category) return false;
      if (tokens.length > 0) {
        const hay =
          `${c.name} ${c.subtitle} ${c.philosophy}`.toLowerCase();
        if (!tokens.every((t) => hay.includes(t))) return false;
      }
      return true;
    });
  }, [allCubes, category, query]);

  const evolutionCandidates = filtered.filter(
    (c) => c.status === "evolution-candidate",
  );
  const published = filtered.filter((c) => c.status === "published");

  return (
    <Container size="wide" className="pb-24 pt-10 md:pt-14">
      {/* Hero */}
      <header className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          momentum marketplace
        </p>
        <h1 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          Cubes built by people, for people.
        </h1>
        <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          Quietly curious. Browse momentum systems other humans built. Follow, remix, or just borrow the philosophy.
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>

        {/* Search */}
        <form
          onSubmit={(e) => e.preventDefault()}
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
              placeholder="Try “silence” or “recovery”…"
              className="flex-1 bg-transparent text-[15px] font-light text-ink placeholder:text-ink-mute/80 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
              >
                clear
              </button>
            )}
          </div>
        </form>
      </header>

      {/* Categories */}
      <section className="mx-auto mt-8 max-w-5xl">
        <p className="mb-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          emotional categories
        </p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONAL_CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(active ? null : c)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-light transition-colors",
                  active
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {CATEGORY_LABEL[c]}
              </button>
            );
          })}
          {category && (
            <button
              type="button"
              onClick={() => setCategory(null)}
              className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              clear
            </button>
          )}
        </div>
      </section>

      {/* Evolution candidates */}
      {evolutionCandidates.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl">
          <header className="mb-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              evolution candidates
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              Community cubes the team may evolve into official ones.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evolutionCandidates.map((c) => (
              <CubeCard
                key={c.id}
                cube={c}
                followed={hydrated ? state.followedCubes.includes(c.id) : false}
                onToggleFollow={() => persist(toggleFollow(state, c.id))}
              />
            ))}
          </div>
        </section>
      )}

      {/* Published */}
      <section className="mx-auto mt-12 max-w-5xl">
        <header className="mb-5 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              published
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              {category
                ? `${CATEGORY_LABEL[category]} cubes`
                : "Other community cubes."}
            </h2>
          </div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            {filtered.length} {filtered.length === 1 ? "cube" : "cubes"}
          </p>
        </header>
        {published.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              Nothing matches yet. Try a different word or loosen the category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {published.map((c) => (
              <CubeCard
                key={c.id}
                cube={c}
                followed={hydrated ? state.followedCubes.includes(c.id) : false}
                onToggleFollow={() => persist(toggleFollow(state, c.id))}
              />
            ))}
          </div>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Quiet creativity. No leaderboards.
        </p>
      </div>
    </Container>
  );
}
