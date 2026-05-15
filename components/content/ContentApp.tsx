"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { contentItems } from "@/data/content/items";
import { contentProviders } from "@/data/content/providers";
import { generateContentInsights } from "@/lib/content/insights";
import { searchContent, type Filters } from "@/lib/content/match";
import {
  addSavedPath,
  completeSession,
  discardSession,
  generateId,
  loadState,
  removeSavedPath,
  saveState,
  startSession,
} from "@/lib/content/storage";
import type {
  ContentCategoryId,
  ContentItem,
  ContentSession,
  ContentState,
  SavedContentPath,
} from "@/lib/content/types";
import { CategoryGrid } from "./CategoryGrid";
import { ContentCard } from "./ContentCard";
import { ContentHero } from "./ContentHero";
import { ContentInsightsPanel } from "./ContentInsightsPanel";
import { FilterBar } from "./FilterBar";
import { RecentSessions } from "./RecentSessions";
import { ReportSheet } from "./ReportSheet";
import { SavedPaths } from "./SavedPaths";

const providerMap = new Map(contentProviders.map((p) => [p.id, p]));
const itemMap = new Map(contentItems.map((it) => [it.id, it]));

export function ContentApp() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<ContentState>({
    sessions: [],
    savedPaths: [],
    version: 1,
  });

  const [query, setQuery] = useState("");
  const [committedQuery, setCommittedQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [showFilters, setShowFilters] = useState(false);

  const [activeSession, setActiveSession] = useState<ContentSession | null>(null);
  const [reportItem, setReportItem] = useState<ContentItem | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ContentState) => {
    setState(next);
    saveState(next);
  }, []);

  const results = useMemo(
    () => searchContent(committedQuery, filters, 40),
    [committedQuery, filters],
  );

  const insights = useMemo(
    () => generateContentInsights(state),
    [state],
  );

  function submitQuery() {
    setCommittedQuery(query);
  }

  function handleCategorySelect(id: ContentCategoryId | undefined) {
    setFilters((f) => ({ ...f, category: id }));
  }

  function handleFilterChange(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }));
  }

  function clearAllFilters() {
    setFilters({});
    setQuery("");
    setCommittedQuery("");
  }

  function handleStart(item: ContentItem) {
    const { state: next, session } = startSession(state, item.id);
    persist(next);
    setActiveSession(session);
    setReportItem(item);

    // Open the external link in a new tab. We don't navigate the app away —
    // the user comes back to FIVE to report.
    if (typeof window !== "undefined") {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    }
    setReportOpen(true);
  }

  function handleReportSubmit(patch: {
    status: ContentSession["status"];
    actualMinutes?: number;
    feeling?: ContentSession["feeling"];
    continueWithType: boolean;
    savePath: boolean;
  }) {
    if (!activeSession || !reportItem) return;
    let next = completeSession(state, activeSession.id, {
      status: patch.status,
      actualMinutes: patch.actualMinutes,
      feeling: patch.feeling,
      continueWithType: patch.continueWithType,
    });
    if (patch.savePath) {
      const path: SavedContentPath = {
        id: generateId(),
        label: reportItem.title,
        categoryId: reportItem.category,
        contentType: reportItem.contentType,
        difficulty: reportItem.difficulty,
        freeOnly: reportItem.pricing === "free",
        createdAt: new Date().toISOString(),
      };
      next = addSavedPath(next, path);
    }
    persist(next);
    setReportOpen(false);
    setActiveSession(null);
    setReportItem(null);
  }

  function handleReportDiscard() {
    if (!activeSession) return;
    persist(discardSession(state, activeSession.id));
    setReportOpen(false);
    setActiveSession(null);
    setReportItem(null);
  }

  function handleSavePath(item: ContentItem) {
    const path: SavedContentPath = {
      id: generateId(),
      label: item.title,
      categoryId: item.category,
      contentType: item.contentType,
      difficulty: item.difficulty,
      freeOnly: item.pricing === "free",
      createdAt: new Date().toISOString(),
    };
    persist(addSavedPath(state, path));
  }

  function openSavedPath(path: SavedContentPath) {
    setFilters({
      category: path.categoryId,
      contentType: path.contentType,
      difficulty: path.difficulty,
      pricing: path.freeOnly ? "free" : undefined,
    });
    setQuery("");
    setCommittedQuery("");
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
  }

  function repeatItem(itemId: string) {
    const item = itemMap.get(itemId);
    if (item) handleStart(item);
  }

  const hasFiltersOrQuery =
    Boolean(committedQuery) ||
    Boolean(filters.category) ||
    Boolean(filters.contentType) ||
    Boolean(filters.difficulty) ||
    Boolean(filters.maxDuration) ||
    (filters.pricing && filters.pricing !== "any");

  return (
    <div className="pb-24">
      <ContentHero
        query={query}
        onQuery={setQuery}
        onSubmit={submitQuery}
      />

      <div className="mx-auto mt-12 w-full max-w-3xl px-6 md:px-10">
        <CategoryGrid
          selected={filters.category}
          onSelect={handleCategorySelect}
        />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-transparent px-4 text-[13px] font-light text-ink-soft hover:border-ink/30 hover:text-ink"
          >
            <span>{showFilters ? "Hide filters" : "More filters"}</span>
            <span aria-hidden="true">{showFilters ? "↑" : "↓"}</span>
          </button>
          {hasFiltersOrQuery && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              clear all
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4">
            <FilterBar
              contentType={filters.contentType}
              difficulty={filters.difficulty}
              pricing={filters.pricing}
              maxDuration={filters.maxDuration}
              onChange={handleFilterChange}
            />
          </div>
        )}
      </div>

      {/* Results */}
      <section className="mx-auto mt-12 w-full max-w-5xl px-6 md:px-10">
        <header className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="text-base font-light tracking-brand text-ink md:text-lg">
            {committedQuery
              ? `For "${committedQuery}"`
              : filters.category
                ? "In this category"
                : "A small selection"}
          </h2>
          <p className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute">
            {results.length} {results.length === 1 ? "result" : "results"}
          </p>
        </header>

        {results.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[15px] font-light text-ink-soft">
              Nothing matched. Loosen a filter or try different words.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((it) => (
              <ContentCard
                key={it.id}
                item={it}
                provider={providerMap.get(it.providerId)}
                onStart={handleStart}
                onSavePath={handleSavePath}
              />
            ))}
          </div>
        )}
      </section>

      {/* Lower sections — only meaningful after first activity, but rendered with empty states */}
      <section className="mx-auto mt-20 w-full max-w-5xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <Subhead
              eyebrow="recent sessions"
              title="What you returned to."
            />
            <RecentSessions
              sessions={hydrated ? state.sessions : []}
              onRepeat={repeatItem}
            />
          </div>
          <div>
            <Subhead
              eyebrow="saved paths"
              title="Shapes worth coming back to."
            />
            <SavedPaths
              paths={hydrated ? state.savedPaths : []}
              onOpen={openSavedPath}
              onRemove={(id) => persist(removeSavedPath(state, id))}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto mt-20 w-full max-w-3xl px-6 md:px-10">
        <Subhead
          eyebrow="quiet observations"
          title="What your sessions are telling us."
        />
        <ContentInsightsPanel insights={hydrated ? insights : []} />
      </section>

      <div className="mx-auto mt-16 flex w-full max-w-3xl flex-col items-center gap-3 border-t border-line/70 px-6 pt-12 text-center md:px-10">
        <RiverLine />
        <p className="mt-4 text-sm font-light text-ink-mute">
          A focused internet, in five-minute portions.
        </p>
        <Link
          href="/cubes"
          className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
        >
          ← back to the cube map
        </Link>
      </div>

      <ReportSheet
        open={reportOpen}
        session={activeSession}
        item={reportItem}
        onClose={() => setReportOpen(false)}
        onSubmit={handleReportSubmit}
        onDiscard={handleReportDiscard}
      />
    </div>
  );
}

function Subhead({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <header className={cn("mb-6")}>
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
        {title}
      </h2>
    </header>
  );
}
