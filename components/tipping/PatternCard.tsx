"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/Card";
import { cn } from "@/lib/cn";
import { describeBoundary, todayKey } from "@/lib/tipping/format";
import {
  checkInsFor,
  consistency,
  currentStreak,
  generateInsights,
} from "@/lib/tipping/insights";
import type {
  CheckIn,
  CheckInStatus,
  Reflection,
  TippingPattern,
  TippingState,
} from "@/lib/tipping/types";
import { CheckInTriad } from "./CheckIn";
import { ReflectionInput } from "./ReflectionInput";
import { TippingRiver } from "./TippingRiver";

type Props = {
  pattern: TippingPattern;
  state: TippingState;
  onCheckIn: (entry: CheckIn) => void;
  onReflect: (entry: CheckIn) => void;
  onOpenSettings: (patternId: string) => void;
};

export function PatternCard({
  pattern,
  state,
  onCheckIn,
  onReflect,
  onOpenSettings,
}: Props) {
  const today = todayKey();
  const allCheckIns = useMemo(
    () => checkInsFor(state, pattern.id),
    [state, pattern.id],
  );
  const todayEntry = allCheckIns.find((c) => c.date === today);
  const streak = useMemo(() => currentStreak(allCheckIns), [allCheckIns]);
  const cons = useMemo(() => consistency(allCheckIns, 14), [allCheckIns]);
  const insights = useMemo(
    () => (state.assistantEnabled ? generateInsights(pattern, allCheckIns) : []),
    [state.assistantEnabled, pattern, allCheckIns],
  );

  const [, force] = useState(0);

  function selectStatus(status: CheckInStatus) {
    const now = new Date();
    const entry: CheckIn = {
      patternId: pattern.id,
      date: todayKey(now),
      status,
      reflection: todayEntry?.reflection,
      reportedAt: now.toISOString(),
    };
    onCheckIn(entry);
    force((n) => n + 1);
  }

  function saveReflection(reflection: Reflection | undefined) {
    const now = new Date();
    const base: CheckIn = todayEntry ?? {
      patternId: pattern.id,
      date: todayKey(now),
      status: "within",
      reportedAt: now.toISOString(),
    };
    onReflect({ ...base, reflection, reportedAt: now.toISOString() });
  }

  const archived = Boolean(pattern.archivedAt);

  return (
    <Card className={cn("bg-surface", archived && "opacity-60")}>
      {/* Header */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ember-700">
            pattern · {pattern.trackingCadence}
          </p>
          <h2 className="mt-3 text-xl font-light tracking-brand text-ink md:text-2xl">
            {pattern.title}
          </h2>
          <p className="mt-2 text-[14px] font-light text-ink-soft">
            <span className="text-ink-mute">Boundary · </span>
            {describeBoundary(pattern.boundary)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenSettings(pattern.id)}
          aria-label="Open pattern settings"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-ember-500 hover:text-ember-700"
        >
          <span aria-hidden="true">⋯</span>
        </button>
      </div>

      {!archived && (
        <>
          <CheckInTriad
            selected={todayEntry?.status ?? null}
            onSelect={selectStatus}
          />

          <ReflectionInput
            initial={todayEntry?.reflection}
            patternTriggers={pattern.triggerTags}
            onSave={saveReflection}
          />
        </>
      )}

      {archived && (
        <p className="text-[14px] font-light italic text-ink-mute">
          Archived. Your records are kept.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 border-t border-line/60 pt-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
            last fourteen days
          </p>
          <div className="mt-4">
            <TippingRiver checkIns={allCheckIns} />
          </div>
        </div>
        <div className="flex items-baseline gap-8 md:justify-end">
          <Stat
            label="Held"
            value={streak === 0 ? "—" : `${streak}d`}
            hint="in a row"
          />
          <Stat
            label="Steady"
            value={
              allCheckIns.length === 0 ? "—" : `${Math.round(cons * 100)}%`
            }
            hint="last 14d"
          />
        </div>
      </div>

      {state.assistantEnabled && insights.length > 0 && (
        <div className="mt-6 rounded-2xl border border-ember-200 bg-ember-50/60 p-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ember-700">
            quiet observation
          </p>
          <ul className="mt-3 space-y-2">
            {insights.map((it, i) => (
              <li
                key={`${it.kind}-${i}`}
                className="flex items-start gap-3 text-[15px] font-light leading-relaxed text-ink-soft"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ember-500"
                />
                <span>{it.body}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
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
      <p className="mt-1 text-2xl font-thin tracking-brand text-ink md:text-3xl">
        {value}
      </p>
      <p className="mt-1 text-[12px] font-light text-ink-mute">{hint}</p>
    </div>
  );
}
