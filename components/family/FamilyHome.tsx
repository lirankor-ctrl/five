"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { CADENCE_LABEL, todayKey } from "@/lib/family/format";
import {
  generateFamilyInsights,
  recentDoneDays,
  totalMomentsInMonth,
} from "@/lib/family/insights";
import {
  addRitual,
  addSession,
  dismissTodayPrompt,
  generateId,
  loadState,
  removeRitual,
  saveState,
  setGroup,
} from "@/lib/family/storage";
import type {
  FamilyFiveWorld,
  FamilyGroup,
  FamilySession,
  FamilyState,
  Ritual,
} from "@/lib/family/types";
import { getWorld } from "@/data/family/worlds";
import { FamilySetup } from "./FamilySetup";
import { InsightsPanel } from "./InsightsPanel";
import { RecentMoments } from "./RecentMoments";
import { Suggestions } from "./Suggestions";
import { TodayPrompt } from "./TodayPrompt";

const DEFAULT_STATE: FamilyState = {
  group: null,
  rituals: [],
  sessions: [],
  version: 1,
};

export function FamilyHome() {
  const [state, setState] = useState<FamilyState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: FamilyState) => {
    setState(next);
    saveState(next);
  }, []);

  const today = todayKey();

  const activeRituals = useMemo(
    () => state.rituals.filter((r) => r.active),
    [state.rituals],
  );

  const insights = useMemo(() => generateFamilyInsights(state), [state]);
  const monthCount = useMemo(() => totalMomentsInMonth(state), [state]);

  const last14 = useMemo(() => recentDoneDays(state, 14), [state]);

  const sessionsForRitualToday = (ritualId: string) =>
    state.sessions.find((s) => s.ritualId === ritualId && s.date === today);

  function handleSetupComplete(group: FamilyGroup, ritual: Ritual) {
    let next = setGroup(state, group);
    next = addRitual(next, ritual);
    persist(next);
  }

  function handleReport(session: FamilySession) {
    // Replace today's session if it already exists for this ritual.
    const filtered = state.sessions.filter(
      (s) =>
        !(s.ritualId === session.ritualId && s.date === session.date),
    );
    persist({ ...state, sessions: [...filtered, session] });
  }

  function handleQuickLog(world: FamilyFiveWorld, label: string) {
    const session: FamilySession = {
      id: generateId("s"),
      world,
      participantIds: [],
      date: today,
      status: "done",
      durationMinutes: 5,
      note: label,
      reportedAt: new Date().toISOString(),
    };
    persist(addSession(state, session));
  }

  function handleRemoveRitual(id: string) {
    persist(removeRitual(state, id));
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

  if (!state.group) {
    return <FamilySetup onComplete={handleSetupComplete} />;
  }

  const group = state.group;
  const dismissedToday = state.dismissedTodayPrompt === today;
  const hasReportedAnyToday = state.sessions.some((s) => s.date === today);

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-hearth-700">
            five family · home
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
            {group.label}.
          </h1>
          <p className="mt-2 text-[14px] font-light text-ink-soft">
            {group.members.length === 1
              ? `${group.members[0].name} · alone, for now.`
              : `${group.members.length} people, on a soft rhythm.`}
          </p>
        </div>
        <div className="flex items-baseline gap-6">
          <Stat
            value={String(monthCount)}
            label="moments this month"
          />
        </div>
      </header>

      {/* Gentle today framing */}
      {!dismissedToday && !hasReportedAnyToday && activeRituals.length > 0 && (
        <section className="mt-8 rounded-2xl border border-hearth-200 bg-hearth-50 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-hearth-700">
                a soft check-in
              </p>
              <p className="mt-2 text-[16px] font-light leading-relaxed text-ink md:text-lg">
                Did you have a Five today? You can answer below — or not.
              </p>
            </div>
            <button
              type="button"
              onClick={() => persist(dismissTodayPrompt(state, today))}
              className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              dismiss for today
            </button>
          </div>
        </section>
      )}

      {/* Active rituals */}
      <section className="mt-8 space-y-4">
        {activeRituals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6">
            <p className="text-[14px] font-light leading-relaxed text-ink-soft">
              No rituals yet. You can add one below — or just use a suggestion from the bank.
            </p>
          </div>
        ) : (
          activeRituals.map((r) => (
            <TodayPrompt
              key={r.id}
              ritual={r}
              todaysSession={sessionsForRitualToday(r.id)}
              onReport={handleReport}
            />
          ))
        )}
      </section>

      {/* Rhythm strip */}
      <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            last fourteen days
          </p>
          <div className="mt-4 flex items-end gap-1.5" aria-hidden="true">
            {last14.map((d) => (
              <span
                key={d.date}
                className={cn(
                  "block w-2 rounded-full",
                  d.done ? "bg-hearth-700" : "bg-line/70",
                )}
                style={{ height: d.done ? 22 : 8 }}
                title={`${d.date} · ${d.done ? "moment" : "no moment"}`}
              />
            ))}
          </div>
          <p className="mt-4 text-[12px] font-light italic leading-relaxed text-ink-mute">
            Not a streak. Just a soft picture of the days that held a moment.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            quiet observations
          </p>
          <div className="mt-4">
            <InsightsPanel insights={insights} />
          </div>
        </div>
      </section>

      {/* Suggestions */}
      <section className="mt-12">
        <Suggestions rituals={activeRituals} onLogQuick={handleQuickLog} />
      </section>

      {/* Recent moments */}
      <section className="mt-12">
        <header className="mb-4">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-hearth-700">
            recent moments
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            What you returned to.
          </h2>
        </header>
        <RecentMoments sessions={state.sessions} limit={6} />
      </section>

      {/* Rituals list (manage) */}
      <section className="mt-12">
        <header className="mb-4 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-hearth-700">
              your rituals
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              Small rhythms you have set.
            </h2>
          </div>
          <Link
            href="/cubes/family/home?reset"
            className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            scroll={false}
          >
            + add another
          </Link>
        </header>
        {activeRituals.length === 0 ? (
          <p className="text-[14px] font-light italic text-ink-soft">
            No rituals yet.
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {activeRituals.map((r) => {
              const world = getWorld(r.world);
              return (
                <li key={r.id} className="flex items-center gap-4 py-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hearth-200 bg-hearth-50 text-base font-light text-hearth-700"
                  >
                    {world?.glyph ?? "·"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-light text-ink">{r.label}</p>
                    <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      {world?.label}
                      <span aria-hidden="true"> · </span>
                      {CADENCE_LABEL[r.cadence]}
                      {r.cadence === "custom" && r.customCadenceLabel && (
                        <>
                          <span aria-hidden="true"> · </span>
                          {r.customCadenceLabel}
                        </>
                      )}
                      <span aria-hidden="true"> · </span>
                      {r.durationMinutes} min
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveRitual(r.id)}
                    className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                  >
                    remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-6">
          <AddRitualInline
            onAdd={(ritual) => persist(addRitual(state, ritual))}
          />
        </div>
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          You do not need a perfect family. Just the next small five.
        </p>
      </div>
    </Container>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-right">
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-1 text-2xl font-thin tracking-brand text-ink md:text-3xl">
        {value}
      </p>
    </div>
  );
}

/**
 * A compact "add another ritual" inline form. Mirrors the setup flow but
 * cheaper to use — three fields, one button.
 */
function AddRitualInline({ onAdd }: { onAdd: (r: Ritual) => void }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("");
  const [world, setWorld] = useState<FamilyFiveWorld>("talk");
  const [cadence, setCadence] = useState<Ritual["cadence"]>("daily");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 items-center rounded-full border border-line bg-surface px-4 text-[12.5px] font-light text-ink-soft hover:border-hearth-300 hover:text-ink"
      >
        + add another small ritual
      </button>
    );
  }

  function commit() {
    if (!label.trim()) return;
    onAdd({
      id: generateId("r"),
      label: label.trim(),
      world,
      participantPreset: "whole-family",
      participantIds: [],
      cadence,
      durationMinutes: 5,
      createdAt: new Date().toISOString(),
      active: true,
    });
    setLabel("");
    setOpen(false);
  }

  const cadences: Ritual["cadence"][] = [
    "daily",
    "few-per-week",
    "weekly",
    "before-sleep",
    "after-dinner",
  ];

  return (
    <div className="rounded-2xl border border-line bg-surface p-5">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="What is this small ritual called?"
        className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-light text-ink placeholder:text-ink-mute/70 focus:border-hearth-500 focus:outline-none"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        {getWorld("talk") &&
          (
            [
              "talk",
              "read",
              "play",
              "learn",
              "move",
              "values",
              "couple",
              "school",
            ] as FamilyFiveWorld[]
          ).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWorld(w)}
              className={cn(
                "inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-light transition-colors",
                world === w
                  ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                  : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
              )}
            >
              {getWorld(w)?.label}
            </button>
          ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {cadences.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCadence(c)}
            className={cn(
              "inline-flex h-8 items-center rounded-full border px-3 text-[12px] font-light transition-colors",
              cadence === c
                ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
            )}
          >
            {CADENCE_LABEL[c]}
          </button>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          cancel
        </button>
        <button
          type="button"
          onClick={commit}
          disabled={!label.trim()}
          className={cn(
            "inline-flex h-9 items-center rounded-full bg-hearth-700 px-4 text-[13px] font-light text-paper hover:opacity-90",
            !label.trim() && "cursor-not-allowed opacity-40",
          )}
        >
          Add
        </button>
      </div>
    </div>
  );
}
