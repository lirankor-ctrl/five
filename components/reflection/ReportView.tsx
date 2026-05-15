"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { generateReport } from "@/lib/reflection/generate";
import { CUBE_HREF, longDate } from "@/lib/reflection/format";
import {
  addDialogue,
  archiveReport,
  generateId,
  loadState,
  saveState,
  setCadence,
} from "@/lib/reflection/storage";
import type {
  ReflectionDialogueKind,
  ReflectionReport,
  ReflectionState,
  ReportCadence,
  SWOTKind,
} from "@/lib/reflection/types";

const DEFAULT_STATE: ReflectionState = {
  archive: [],
  dialogue: [],
  cadence: "weekly",
  version: 1,
};

const CADENCES: ReportCadence[] = [
  "manual",
  "daily",
  "weekly",
  "biweekly",
  "monthly",
];

const CADENCE_LABEL: Record<ReportCadence, string> = {
  manual: "Manual",
  daily: "Daily",
  weekly: "Weekly",
  biweekly: "Biweekly",
  monthly: "Monthly",
};

const SWOT_LABEL: Record<SWOTKind, string> = {
  strength: "Strength",
  weakness: "Friction",
  opportunity: "Opportunity",
  threat: "Worth watching",
};

const DIALOGUE_OPTIONS: Array<{
  kind: ReflectionDialogueKind;
  label: string;
}> = [
  { kind: "accurate", label: "This feels accurate." },
  { kind: "surprising", label: "This surprised me." },
  { kind: "off", label: "This doesn't feel right." },
  { kind: "explore-more", label: "I want to explore this more." },
  { kind: "unusual", label: "This week was unusual." },
  { kind: "matters", label: "This matters to me." },
];

export function ReportView() {
  const [state, setState] = useState<ReflectionState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [report, setReport] = useState<ReflectionReport | null>(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    const loaded = loadState();
    setState(loaded);
    setHydrated(true);
    // Surface the latest archived report if any; otherwise generate fresh.
    if (loaded.archive.length > 0) {
      setReport(loaded.archive[0]);
    } else {
      setReport(generateReport(7));
    }
  }, []);

  const persist = useCallback((next: ReflectionState) => {
    setState(next);
    saveState(next);
  }, []);

  const generated = useMemo(
    () => (report ? new Date(report.generatedAt) : null),
    [report],
  );

  function regenerate() {
    const fresh = generateReport(7);
    setReport(fresh);
  }
  function save() {
    if (!report) return;
    persist(archiveReport(state, report));
  }
  function respond(kind: ReflectionDialogueKind) {
    if (!report) return;
    persist(
      addDialogue(state, {
        id: generateId("d"),
        reportId: report.id,
        kind,
        body: note.trim() || undefined,
        createdAt: new Date().toISOString(),
      }),
    );
    setNote("");
  }

  if (!hydrated || !report) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          generating…
        </p>
      </Container>
    );
  }

  const responsesForThis = state.dialogue.filter(
    (d) => d.reportId === report.id,
  );

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      {/* Header */}
      <header className="border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          reflection report
        </p>
        <h1 className="mt-3 text-balance text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          A letter about your week.
        </h1>
        <p className="mt-3 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {generated ? longDate(generated) : ""}
          <span aria-hidden="true"> · </span>
          window: last 7 days
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button variant="primary" size="md" onClick={regenerate}>
            Generate again
          </Button>
          <Button variant="secondary" size="md" onClick={save}>
            Save to archive
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <label className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              cadence
            </label>
            <select
              value={state.cadence}
              onChange={(e) =>
                persist(setCadence(state, e.target.value as ReportCadence))
              }
              className="rounded-full border border-line bg-paper px-4 py-2 text-[12.5px] font-light text-ink focus:border-ink/40 focus:outline-none"
            >
              {CADENCES.map((c) => (
                <option key={c} value={c}>
                  {CADENCE_LABEL[c]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Opening */}
      <section className="mx-auto mt-12 max-w-2xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          opening
        </p>
        <p className="mt-4 text-balance text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
          {report.opening}
        </p>
      </section>

      <RuleDots />

      {/* Snapshot */}
      <section className="mx-auto max-w-2xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          momentum snapshot
        </p>
        <p className="mt-4 text-[17px] font-light leading-relaxed text-ink md:text-lg">
          {report.snapshot.paragraph}
        </p>
        {report.snapshot.signals.length > 0 && (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {report.snapshot.signals.map((s) => (
              <li
                key={s.cubeId}
                className="flex items-start gap-4 py-4"
              >
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft"
                >
                  {s.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-light text-ink">
                    <Link
                      href={CUBE_HREF[s.cubeId] ?? "/cubes"}
                      className="hover:underline underline-offset-4"
                    >
                      {s.cubeLabel}
                    </Link>
                  </p>
                  <p className="mt-1 text-[13px] font-light italic leading-relaxed text-ink-soft">
                    {s.narrative}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <RuleDots />

      {/* SWOT */}
      <section className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          dynamic human reading
        </p>
        <h2 className="mt-3 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
          What is real underneath the activity.
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {report.swot.map((s, i) => (
            <li
              key={i}
              className={cn(
                "rounded-2xl border bg-surface p-5",
                toneFor(s.kind),
              )}
            >
              <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {SWOT_LABEL[s.kind]}
              </p>
              <p className="mt-2 text-[15px] font-light leading-relaxed text-ink">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <RuleDots />

      {/* Cross-river */}
      <section className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          where the river may flow next
        </p>
        <h2 className="mt-3 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
          Quiet bridges between the cubes.
        </h2>
        {report.crossRiver.length === 0 ? (
          <p className="mt-6 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-mute">
            No obvious bridges this week. That is fine — bridges appear when they appear.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {report.crossRiver.map((o) => (
              <li
                key={o.id}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <p className="text-[15px] font-light leading-relaxed text-ink">
                  {o.body}
                </p>
                {o.cta && (
                  <Link
                    href={o.cta.href}
                    className="mt-3 inline-flex h-9 items-center rounded-full border border-line bg-paper px-4 text-[13px] font-light text-ink hover:border-ink/40"
                  >
                    {o.cta.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <RuleDots />

      {/* Emotional */}
      <section className="mx-auto max-w-2xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          emotional reading
        </p>
        <h2 className="mt-3 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
          Alive vs steady vs fragile.
        </h2>
        <ul className="mt-6 space-y-3">
          {report.emotional.map((e, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[15px] font-light leading-relaxed text-ink-soft"
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40"
              />
              <span>
                <span className="mr-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {e.kind}
                </span>
                {e.body}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <RuleDots />

      {/* Dialogue */}
      <section className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          a small response
        </p>
        <h2 className="mt-3 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
          The report is the beginning of a conversation.
        </h2>
        <p className="mt-3 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-mute">
          Choose how this reading felt. Optionally add a line. Over time, this is how the report learns to speak to you.
        </p>

        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional · one line in response"
          className="mt-5 w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />

        <div className="mt-3 flex flex-wrap gap-2">
          {DIALOGUE_OPTIONS.map((o) => (
            <button
              key={o.kind}
              type="button"
              onClick={() => respond(o.kind)}
              className="inline-flex h-9 items-center rounded-full border border-line px-4 text-[12.5px] font-light text-ink hover:border-ink/40"
            >
              {o.label}
            </button>
          ))}
        </div>

        {responsesForThis.length > 0 && (
          <p className="mt-5 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
            {responsesForThis.length} response{responsesForThis.length === 1 ? "" : "s"} on this report.
          </p>
        )}
      </section>

      <RuleDots />

      {/* Closing */}
      <section className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          closing
        </p>
        <p className="mt-5 text-balance text-xl font-light italic leading-snug text-ink md:text-2xl">
          {report.closing}
        </p>
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          You are not your streaks. You are the shape of your becoming.
        </p>
      </div>
    </Container>
  );
}

function RuleDots() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto my-16 flex w-20 items-center justify-between md:my-20"
    >
      <span className="inline-block h-1 w-1 rounded-full bg-ink/20" />
      <span className="inline-block h-1 w-1 rounded-full bg-ink/30" />
      <span className="inline-block h-1 w-1 rounded-full bg-ink/20" />
    </div>
  );
}

function toneFor(kind: SWOTKind): string {
  switch (kind) {
    case "strength":
      return "border-ink/40 bg-paper";
    case "opportunity":
      return "border-ink/30 bg-paper";
    case "weakness":
      return "border-line bg-surface";
    case "threat":
      return "border-line bg-surface";
  }
}
