"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { creators } from "@/data/creators/creators";
import {
  analyticsFor,
  impactFor,
  impactTotal,
  sessionsByCreator,
} from "@/lib/creators/analytics";
import {
  IMPACT_QUESTION_LABEL,
  IMPACT_QUESTIONS,
} from "@/lib/creators/format";
import { loadState } from "@/lib/creators/storage";
import type {
  CreatorsState,
  HumanImpactCounts,
  HumanImpactQuestion,
} from "@/lib/creators/types";

const DEFAULT_STATE: CreatorsState = {
  meCreatorId: "c-aria-veld",
  drafts: [],
  impactReports: [],
  saved: [],
  version: 1,
};

export function AnalyticsView() {
  const [state, setState] = useState<CreatorsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const me = useMemo(
    () => creators.find((c) => c.id === state.meCreatorId) ?? creators[0],
    [state.meCreatorId],
  );

  const mySessions = useMemo(
    () => sessionsByCreator(me.id, state),
    [me, state],
  );

  const myAnalytics = useMemo(() => analyticsFor(me, state), [me, state]);

  // Aggregate impact across the creator's sessions, used for the breakdown.
  const aggregateImpact = useMemo<HumanImpactCounts>(() => {
    const out: HumanImpactCounts = {
      consistencyHelpful: 0,
      returned: 0,
      changedDay: 0,
      createdMomentum: 0,
      feltCalmer: 0,
      createdCuriosity: 0,
      realWorldAction: 0,
    };
    for (const s of mySessions) {
      const c = impactFor(s, state);
      for (const q of IMPACT_QUESTIONS) out[q] += c[q] ?? 0;
    }
    return out;
  }, [mySessions, state]);

  const totalImpact = impactTotal(aggregateImpact);

  // Top sessions ranked by total impact.
  const ranked = useMemo(() => {
    return mySessions
      .map((s) => {
        const c = impactFor(s, state);
        return { session: s, total: impactTotal(c), counts: c };
      })
      .sort((a, b) => b.total - a.total);
  }, [mySessions, state]);

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
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
            creator analytics
          </p>
          <h1 className="mt-3 font-serif text-3xl font-light tracking-[-0.01em] text-ink md:text-4xl">
            {me.name}&rsquo;s impact.
          </h1>
          <p className="mt-2 max-w-prose text-[14px] font-light text-ink-soft">
            A creator-shaped view. Not vanity metrics — human impact and return behaviour.
          </p>
        </div>
        <div className="flex items-baseline gap-8">
          <Headline value={String(myAnalytics.totalSessions)} label="sessions" />
          <Headline value={String(totalImpact)} label="impact marks" />
          <Headline
            value={`${Math.round(myAnalytics.retentionRate * 100)}%`}
            label="retention"
          />
        </div>
      </header>

      {/* Impact breakdown */}
      <section className="mt-10">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            what your sessions are doing
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
            Human impact — not engagement.
          </h2>
        </header>
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-line bg-surface p-6 md:grid-cols-2">
          {IMPACT_QUESTIONS.map((q) => {
            const c = aggregateImpact[q] ?? 0;
            const pct = totalImpact === 0 ? 0 : (c / totalImpact) * 100;
            return (
              <div key={q}>
                <div className="flex items-baseline justify-between text-[13.5px] font-light">
                  <span className="text-ink-soft">
                    {IMPACT_QUESTION_LABEL[q]}
                  </span>
                  <span className="text-ink-mute tabular-nums">{c}</span>
                </div>
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full bg-ink"
                    style={{
                      width: `${pct.toFixed(0)}%`,
                      opacity: 0.35 + (c / Math.max(1, totalImpact)) * 0.65,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Session leaderboard */}
      <section className="mt-12">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            sessions, ranked by human impact
          </p>
          <h2 className="mt-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
            What is landing.
          </h2>
        </header>
        {ranked.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              No sessions yet. Publish something in the studio to see this fill.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {ranked.map(({ session, total, counts }) => {
              const top = topMark(counts);
              return (
                <li key={session.id} className="flex items-start gap-4 py-4">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-[12px] font-light",
                      total > 0
                        ? "border-ink bg-ink text-paper"
                        : "border-line text-ink-mute",
                    )}
                  >
                    {total}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/cubes/creators/content/${session.id}`}
                      className="block truncate font-serif text-[16px] font-light text-ink hover:underline"
                    >
                      {session.title}
                    </Link>
                    <p className="mt-1 text-[11px] font-light uppercase tracking-[0.2em] text-ink-mute">
                      {session.durationMinutes} min
                      {top && (
                        <>
                          <span aria-hidden="true"> · </span>
                          most-marked · {IMPACT_QUESTION_LABEL[top]}
                        </>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Revenue placeholder */}
      <section className="mt-12 rounded-3xl border border-line bg-surface p-8 md:p-10">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          revenue · future
        </p>
        <h2 className="mt-2 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
          When the calm creator economy turns on.
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          {[
            "Revenue share on completed sessions.",
            "Subscription pool — Spotify-shaped distribution.",
            "Pay-per-session — usage-based payments.",
            "Sponsored / partner placements, clearly labelled.",
            "Premium creator tools (assistant features).",
            "Organization licensing on packs.",
          ].map((it) => (
            <div
              key={it}
              className="rounded-xl border border-line bg-paper px-4 py-3 text-[14px] font-light text-ink"
            >
              {it}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          A respectful creator analytics — calm, honest, momentum-shaped.
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
      <p className="mt-1 font-serif text-2xl font-light tracking-[-0.01em] text-ink md:text-3xl">
        {value}
      </p>
    </div>
  );
}

function topMark(counts: HumanImpactCounts): HumanImpactQuestion | null {
  let top: HumanImpactQuestion | null = null;
  let topCount = 0;
  for (const q of IMPACT_QUESTIONS) {
    const c = counts[q] ?? 0;
    if (c > topCount) {
      topCount = c;
      top = q;
    }
  }
  return top;
}
