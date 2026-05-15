"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import {
  describeFrequency,
  describeTimeOfDay,
  todayKey,
} from "@/lib/solo/format";
import {
  consistencyRate,
  currentStreak,
  generateInsights,
} from "@/lib/solo/insights";
import type { SoloEntry, SoloPlan, SoloState } from "@/lib/solo/types";
import { SoloInsights } from "./SoloInsights";
import { SoloReport } from "./SoloReport";
import { SoloRiver } from "./SoloRiver";
import { SoloSettings } from "./SoloSettings";

type Props = {
  state: SoloState & { plan: SoloPlan };
  onReport: (entry: SoloEntry) => void;
  onEditPlan: () => void;
  onReset: () => void;
  onToggleAssistant: (next: boolean) => void;
};

export function SoloDashboard({
  state,
  onReport,
  onEditPlan,
  onReset,
  onToggleAssistant,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const today = todayKey();
  const todayEntry = state.entries.find((e) => e.date === today);

  const streak = useMemo(() => currentStreak(state.entries), [state.entries]);
  const consistency = useMemo(
    () => consistencyRate(state.entries, 14),
    [state.entries],
  );
  const insights = useMemo(() => generateInsights(state), [state]);

  const plan = state.plan;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 md:px-10 md:pt-16">
      <Link
        href="/cubes"
        className="inline-flex items-center gap-2 text-sm font-light text-ink-mute transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Cube map
      </Link>

      <header className="mt-8 flex items-start justify-between gap-6 md:mt-10">
        <div>
          <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            five solo
          </p>
          <h1 className="mt-3 text-balance text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            {plan.field}
          </h1>
          <p className="mt-3 text-[15px] font-light text-ink-soft">
            {describeTimeOfDay(plan.timeOfDay)} · {plan.durationMin} min ·{" "}
            <span className="text-ink-mute">
              {describeFrequency(plan.frequency).toLowerCase()}
            </span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSettingsOpen(true)}
          aria-label="Open settings"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
        >
          <span aria-hidden="true">⋯</span>
        </button>
      </header>

      <div className="mt-8 w-20">
        <RiverLine />
      </div>

      <section className="mt-10">
        <Card className="bg-surface">
          <SoloReport
            plan={plan}
            todayEntry={todayEntry}
            onSubmit={onReport}
          />
        </Card>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            Your river
          </p>
          <h3 className="mt-3 text-lg font-light tracking-brand text-ink">
            Small drops, gathering.
          </h3>
          <div className="mt-5">
            <SoloRiver entries={state.entries} />
          </div>
          <p className="mt-4 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            the last fourteen days
          </p>
        </Card>

        <Card>
          <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            Quiet rhythm
          </p>
          <div className="mt-4 flex items-baseline gap-8">
            <Stat
              label="Returned"
              value={streak === 0 ? "—" : `${streak}d`}
              hint="in a row"
            />
            <Stat
              label="Consistency"
              value={
                state.entries.length === 0
                  ? "—"
                  : `${Math.round(consistency * 100)}%`
              }
              hint="last 14d"
            />
          </div>
          <p className="mt-6 max-w-[36ch] text-[13px] font-light leading-relaxed text-ink-mute">
            Not a score. A gentle picture of how the days have been holding.
          </p>
        </Card>
      </section>

      {plan.assistantEnabled && (
        <section className="mt-10">
          <p className="mb-4 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            A quiet observation
          </p>
          <Card className="bg-surface">
            <SoloInsights insights={insights} />
          </Card>
        </section>
      )}

      {!plan.assistantEnabled && state.entries.length >= 3 && (
        <section className="mt-10">
          <button
            type="button"
            onClick={() => onToggleAssistant(true)}
            className={cn(
              "block w-full rounded-2xl border border-dashed border-line bg-transparent p-5 text-left transition-colors hover:border-ink/30",
            )}
          >
            <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
              Optional
            </p>
            <p className="mt-2 text-[15px] font-light text-ink">
              Turn on the quiet assistant — short, calm observations only.
            </p>
          </button>
        </section>
      )}

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <p className="text-sm font-light text-ink-mute">
          Small action &gt; perfection.
        </p>
      </div>

      <SoloSettings
        open={settingsOpen}
        plan={plan}
        onClose={() => setSettingsOpen(false)}
        onAssistantToggle={(next) => {
          onToggleAssistant(next);
        }}
        onEditPlan={() => {
          setSettingsOpen(false);
          onEditPlan();
        }}
        onReset={() => {
          setSettingsOpen(false);
          onReset();
        }}
      />
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div>
      <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
        {label}
      </p>
      <p className="mt-2 text-3xl font-thin tracking-brand text-ink">{value}</p>
      <p className="mt-1 text-[12px] font-light text-ink-mute">{hint}</p>
    </div>
  );
}
