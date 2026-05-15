"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { getCategory } from "@/data/creators/categories";
import { creators } from "@/data/creators/creators";
import { getMood } from "@/data/creators/moods";
import {
  AUDIENCE_LABEL,
  CREATOR_KIND_LABEL,
  DIFFICULTY_LABEL,
  ENERGY_LABEL,
  MEDIA_LABEL,
  PRICING_LABEL,
  SESSION_TYPE_LABEL,
  WORLD_LABEL,
} from "@/lib/creators/format";
import { impactFor } from "@/lib/creators/analytics";
import {
  addImpactReport,
  generateId,
  loadState,
  saveState,
  toggleSaved,
} from "@/lib/creators/storage";
import type {
  CreatorSession,
  CreatorsState,
  HumanImpactQuestion,
} from "@/lib/creators/types";
import { HumanImpactPanel } from "./HumanImpactPanel";

const DEFAULT_STATE: CreatorsState = {
  meCreatorId: "c-aria-veld",
  drafts: [],
  impactReports: [],
  saved: [],
  version: 1,
};

type Props = {
  session: CreatorSession;
};

export function ContentExperience({ session }: Props) {
  const [state, setState] = useState<CreatorsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CreatorsState) => {
    setState(next);
    saveState(next);
  }, []);

  const creator = useMemo(
    () => creators.find((c) => c.id === session.creatorId),
    [session.creatorId],
  );
  const category = getCategory(session.category);

  const counts = useMemo(() => impactFor(session, state), [session, state]);
  const alreadyReported = state.impactReports.some(
    (r) => r.sessionId === session.id,
  );
  const saved = state.saved.includes(session.id);

  function handleImpact(marked: HumanImpactQuestion[], note?: string) {
    persist(
      addImpactReport(state, {
        id: generateId("ir"),
        sessionId: session.id,
        marked,
        note,
        reportedAt: new Date().toISOString(),
      }),
    );
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <Link
        href="/cubes/creators/discover"
        className="inline-flex items-center gap-2 text-sm font-light text-ink-mute transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> discover
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          <span className="text-ink">{SESSION_TYPE_LABEL[session.type]}</span>
          <span aria-hidden="true">·</span>
          <span>{session.durationMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{DIFFICULTY_LABEL[session.difficulty]}</span>
          {category && (
            <>
              <span aria-hidden="true">·</span>
              <span>{category.label}</span>
            </>
          )}
        </div>
        <h1 className="mt-5 max-w-3xl font-serif text-3xl font-light leading-tight tracking-[-0.02em] text-ink md:text-5xl">
          {session.title}
        </h1>
        <p className="mt-5 max-w-prose font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
          {session.hook}
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>
      </header>

      {/* Description */}
      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            about this five
          </p>
          <p className="mt-3 max-w-prose font-serif text-[17px] font-light leading-[1.75] text-ink md:text-[18px]">
            {session.description}
          </p>

          {/* Moods */}
          {session.moods.length > 0 && (
            <div className="mt-8">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                fits these intentions
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {session.moods.map((m) => {
                  const mood = getMood(m);
                  if (!mood) return null;
                  return (
                    <li
                      key={m}
                      className="inline-flex h-8 items-center rounded-full border border-line bg-paper px-3 text-[12.5px] font-light italic text-ink-soft"
                    >
                      {mood.intention}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Course structure */}
          {(session.sessionCount || session.totalDays) && (
            <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                shape
              </p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {session.sessionCount && (
                  <div>
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      sessions
                    </p>
                    <p className="mt-1 font-serif text-2xl font-light text-ink">
                      {session.sessionCount}
                    </p>
                  </div>
                )}
                {session.totalDays && (
                  <div>
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      over
                    </p>
                    <p className="mt-1 font-serif text-2xl font-light text-ink">
                      {session.totalDays} days
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <Row label="Type" value={SESSION_TYPE_LABEL[session.type]} />
            <Row label="Duration" value={`${session.durationMinutes} min`} />
            <Row label="Difficulty" value={DIFFICULTY_LABEL[session.difficulty]} />
            <Row label="Energy" value={ENERGY_LABEL[session.energy]} />
            <Row label="Audience" value={AUDIENCE_LABEL[session.audience]} />
            <Row label="Where" value={WORLD_LABEL[session.world]} />
            <Row label="Cost" value={PRICING_LABEL[session.pricing]} />
            <Row
              label="Media"
              value={session.mediaTypes.map((m) => MEDIA_LABEL[m]).join(" · ")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => persist(toggleSaved(state, session.id))}
              disabled={!hydrated}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-full border text-[14px] font-light transition-colors",
                saved
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink hover:border-ink/40",
              )}
            >
              <span aria-hidden="true">✦</span>
              {saved ? "Saved" : "Save"}
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-[14px] font-light text-paper hover:bg-accent"
            >
              Start the five
            </button>
            <p className="text-[11px] font-light leading-relaxed text-ink-mute">
              The session opens here when published. Today this is a preview.
            </p>
          </div>
        </aside>
      </section>

      {/* Creator strip */}
      {creator && (
        <section className="mt-12">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            by
          </p>
          <Link
            href={`/cubes/creators/profile/${creator.id}`}
            className="group mt-3 block rounded-2xl border border-line bg-surface p-5 hover:border-ink/30 hover:shadow-soft"
          >
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line font-serif text-base font-light text-ink"
              >
                {creator.name
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <div className="min-w-0">
                <p className="font-serif text-lg font-light text-ink">
                  {creator.name}
                </p>
                <p className="mt-0.5 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {CREATOR_KIND_LABEL[creator.kind]}
                </p>
                <p className="mt-2 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-soft">
                  {creator.oneLine}
                </p>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Human impact */}
      <section className="mt-12">
        <HumanImpactPanel
          session={session}
          counts={counts}
          alreadyReported={alreadyReported}
          onSubmit={handleImpact}
        />
      </section>
    </Container>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/50 py-2 last:border-b-0">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="text-right text-[13.5px] font-light text-ink">{value}</p>
    </div>
  );
}
