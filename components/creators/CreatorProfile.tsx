"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { creators } from "@/data/creators/creators";
import {
  analyticsFor,
  sessionsByCreator,
} from "@/lib/creators/analytics";
import {
  CREATOR_KIND_LABEL,
  IMPACT_QUESTION_LABEL,
} from "@/lib/creators/format";
import { loadState, saveState, toggleSaved } from "@/lib/creators/storage";
import type { Creator, CreatorsState } from "@/lib/creators/types";
import { SessionCard } from "./SessionCard";

const DEFAULT_STATE: CreatorsState = {
  meCreatorId: "c-aria-veld",
  drafts: [],
  impactReports: [],
  saved: [],
  version: 1,
};

type Props = { creator: Creator };

export function CreatorProfile({ creator }: Props) {
  const [state, setState] = useState<CreatorsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const sessions = useMemo(
    () => sessionsByCreator(creator.id, state),
    [creator.id, state],
  );
  const analytics = useMemo(
    () => analyticsFor(creator, state),
    [creator, state],
  );
  const creatorMap = useMemo(
    () => new Map(creators.map((c) => [c.id, c])),
    [],
  );

  function persistToggle(id: string) {
    const next = toggleSaved(state, id);
    setState(next);
    saveState(next);
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <Link
        href="/cubes/creators/discover"
        className="inline-flex items-center gap-2 text-sm font-light text-ink-mute transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> discover
      </Link>

      {/* Profile header */}
      <header className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-[auto_1fr] md:items-start">
        <span
          aria-hidden="true"
          className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-line bg-paper font-serif text-2xl font-light text-ink"
        >
          {creator.name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </span>
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            {CREATOR_KIND_LABEL[creator.kind]} · @{creator.handle}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-light leading-tight tracking-[-0.02em] text-ink md:text-5xl">
            {creator.name}.
          </h1>
          <p className="mt-4 max-w-prose font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
            {creator.oneLine}
          </p>
          <div className="mt-6 w-20">
            <RiverLine />
          </div>
        </div>
      </header>

      {/* Philosophy */}
      <section className="mt-10">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          philosophy
        </p>
        <p className="mt-3 max-w-prose font-serif text-[17px] font-light leading-[1.75] text-ink md:text-[18px]">
          {creator.philosophy}
        </p>
      </section>

      {/* Momentum impact */}
      <section className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat
          label="sessions"
          value={String(analytics.totalSessions)}
        />
        <Stat
          label="impact reports"
          value={String(analytics.totalImpactReports)}
        />
        <Stat
          label="retention"
          value={`${Math.round(analytics.retentionRate * 100)}%`}
        />
        <Stat
          label="return rate"
          value={`${Math.round(analytics.returnRate * 100)}%`}
        />
      </section>

      {analytics.topImpact && (
        <p className="mt-4 max-w-prose text-[13px] font-light italic leading-relaxed text-ink-mute">
          Most-marked impact across this creator’s work — <span className="text-ink-soft">{IMPACT_QUESTION_LABEL[analytics.topImpact].toLowerCase()}</span>.
        </p>
      )}

      {/* Sessions */}
      <section className="mt-12">
        <header className="mb-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            collection
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
            What this creator has published.
          </h2>
        </header>
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              No sessions yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((s) => (
              <SessionCard
                key={s.id}
                session={s}
                creator={creatorMap.get(s.creatorId)}
                state={state}
                saved={hydrated ? state.saved.includes(s.id) : false}
                onSave={() => persistToggle(s.id)}
              />
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
        {value}
      </p>
    </div>
  );
}
