"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { generateReport } from "@/lib/reflection/generate";
import { CUBE_HREF, longDate } from "@/lib/reflection/format";
import {
  archiveReport,
  loadState,
  saveState,
} from "@/lib/reflection/storage";
import type {
  ReflectionReport,
  ReflectionState,
  SWOTKind,
} from "@/lib/reflection/types";

const DEFAULT_STATE: ReflectionState = {
  archive: [],
  dialogue: [],
  cadence: "weekly",
  version: 1,
};

const DEFAULT_WINDOW = 7;

const WINDOW_OPTIONS: { value: number; label: string }[] = [
  { value: 7, label: "Last 7 days" },
  { value: 14, label: "Last 14 days" },
  { value: 30, label: "Last 30 days" },
  { value: 90, label: "Last 90 days" },
];

const SWOT_LABEL: Record<SWOTKind, string> = {
  strength: "Strength",
  weakness: "Friction",
  opportunity: "Opportunity",
  threat: "Worth watching",
};

export function ReflectionReports() {
  const [state, setState] = useState<ReflectionState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [report, setReport] = useState<ReflectionReport | null>(null);
  const [windowDays, setWindowDays] = useState<number>(DEFAULT_WINDOW);
  const [archivedReportId, setArchivedReportId] = useState<string | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ReflectionState) => {
    setState(next);
    saveState(next);
  }, []);

  const sortedArchive = useMemo(
    () =>
      [...state.archive].sort(
        (a, b) =>
          new Date(b.generatedAt).getTime() -
          new Date(a.generatedAt).getTime(),
      ),
    [state.archive],
  );

  const isCurrentSaved = report ? report.id === archivedReportId : false;

  function generate(days: number = DEFAULT_WINDOW) {
    const fresh = generateReport(days);
    setReport(fresh);
    setWindowDays(days);
    setArchivedReportId(null);
  }

  function changeWindow(days: number) {
    setWindowDays(days);
    const fresh = generateReport(days);
    setReport(fresh);
    setArchivedReportId(null);
  }

  function saveCurrent() {
    if (!report || isCurrentSaved) return;
    const next = archiveReport(state, report);
    persist(next);
    setArchivedReportId(report.id);
  }

  function openArchived(r: ReflectionReport) {
    setReport(r);
    setWindowDays(r.windowDays);
    setArchivedReportId(r.id);
  }

  function dismiss() {
    setReport(null);
    setArchivedReportId(null);
    setWindowDays(DEFAULT_WINDOW);
  }

  return (
    <section
      aria-labelledby="reports-heading"
      className="mt-12 md:mt-16"
    >
      <header className="max-w-prose">
        <p
          id="reports-heading"
          className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute"
        >
          Reports
        </p>
        <h2 className="mt-3 text-balance text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
          A calm letter about your river.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
          Generate a small, narrative report from your movement across the
          cubes. Defaults to the last seven days. You can change the window
          inside the report, and save reports to see how the river has been
          shifting over time.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-[1fr_280px] md:gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main report column */}
        <div className="min-w-0">
          {!report ? (
            <EmptyState
              onGenerate={() => generate(DEFAULT_WINDOW)}
              hasArchive={hydrated && sortedArchive.length > 0}
            />
          ) : (
            <ReportPanel
              report={report}
              windowDays={windowDays}
              isSaved={isCurrentSaved}
              onChangeWindow={changeWindow}
              onSave={saveCurrent}
              onRegenerate={() => generate(windowDays)}
              onDismiss={dismiss}
            />
          )}
        </div>

        {/* Sidebar */}
        <aside aria-labelledby="archive-heading" className="min-w-0">
          <div className="rounded-2xl border border-line bg-surface p-5 md:sticky md:top-20">
            <p
              id="archive-heading"
              className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute"
            >
              Past reports
            </p>
            {!hydrated ? (
              <p className="mt-4 text-[13px] font-light italic text-ink-mute">
                loading…
              </p>
            ) : sortedArchive.length === 0 ? (
              <p className="mt-4 text-[13px] font-light italic leading-relaxed text-ink-mute">
                No reports yet. Saved reports will appear here so you can
                read them again and notice how things have moved.
              </p>
            ) : (
              <ul className="mt-4 -mx-1 max-h-[420px] overflow-y-auto md:max-h-[520px]">
                {sortedArchive.map((r) => {
                  const isOpen = report?.id === r.id;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => openArchived(r)}
                        className={cn(
                          "block w-full rounded-xl px-3 py-3 text-left transition-colors duration-300 ease-calm",
                          isOpen
                            ? "bg-paper"
                            : "hover:bg-paper",
                        )}
                      >
                        <p className="text-[13px] font-light text-ink">
                          {longDate(new Date(r.generatedAt))}
                        </p>
                        <p className="mt-1 text-[11px] font-light uppercase tracking-[0.18em] text-ink-mute">
                          {r.windowDays}-day window
                          <span aria-hidden="true"> · </span>
                          {r.snapshot.totalDonesInWindow} drop
                          {r.snapshot.totalDonesInWindow === 1 ? "" : "s"}
                          <span aria-hidden="true"> · </span>
                          {r.snapshot.activeCubesCount} cube
                          {r.snapshot.activeCubesCount === 1 ? "" : "s"}
                        </p>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function EmptyState({
  onGenerate,
  hasArchive,
}: {
  onGenerate: () => void;
  hasArchive: boolean;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-7 md:p-9">
      <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
        when you are ready
      </p>
      <h3 className="mt-4 text-balance text-xl font-light leading-snug tracking-brand text-ink md:text-2xl">
        Generate a reflection report.
      </h3>
      <p className="mt-3 max-w-[52ch] text-[15px] leading-relaxed text-ink-soft">
        A short, calm letter about how your week has been moving — drawn
        from your activity across the cubes. The default window is the last
        seven days. You can change it once the report is open.
      </p>
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button variant="primary" size="md" onClick={onGenerate}>
          Generate report
        </Button>
        <p className="text-[13px] font-light text-ink-mute">
          {hasArchive
            ? "Or open a past report from the list →"
            : "Defaults to the last 7 days."}
        </p>
      </div>
    </div>
  );
}

function ReportPanel({
  report,
  windowDays,
  isSaved,
  onChangeWindow,
  onSave,
  onRegenerate,
  onDismiss,
}: {
  report: ReflectionReport;
  windowDays: number;
  isSaved: boolean;
  onChangeWindow: (days: number) => void;
  onSave: () => void;
  onRegenerate: () => void;
  onDismiss: () => void;
}) {
  const generated = new Date(report.generatedAt);

  return (
    <article className="rounded-2xl border border-line bg-surface p-6 md:p-9">
      {/* Header / controls */}
      <header className="border-b border-line/70 pb-6">
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          reflection report
        </p>
        <h3 className="mt-3 text-balance text-2xl font-light leading-tight tracking-brand text-ink md:text-3xl">
          A letter about your river.
        </h3>
        <p className="mt-3 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {longDate(generated)}
          <span aria-hidden="true"> · </span>
          window: {report.windowDays}-day
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2">
            <span className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              window
            </span>
            <select
              value={windowDays}
              onChange={(e) => onChangeWindow(Number(e.target.value))}
              className="rounded-full border border-line bg-paper px-4 py-2 text-[13px] font-light text-ink focus:border-ink/40 focus:outline-none"
            >
              {WINDOW_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant={isSaved ? "secondary" : "primary"}
            size="sm"
            onClick={onSave}
            disabled={isSaved}
            aria-disabled={isSaved}
            className={isSaved ? "cursor-default opacity-70" : ""}
          >
            {isSaved ? "Saved" : "Save to history"}
          </Button>
          <Button variant="ghost" size="sm" onClick={onRegenerate}>
            Generate again
          </Button>
          <button
            type="button"
            onClick={onDismiss}
            className="ml-auto text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>
      </header>

      {/* Opening */}
      <section className="pt-8">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          opening
        </p>
        <p className="mt-3 text-balance text-xl font-light leading-snug tracking-brand text-ink md:text-2xl">
          {report.opening}
        </p>
      </section>

      <RuleDots />

      {/* Snapshot */}
      <section>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          momentum snapshot
        </p>
        <p className="mt-3 text-[15px] font-light leading-relaxed text-ink md:text-[16px]">
          {report.snapshot.paragraph}
        </p>
        {report.snapshot.signals.length > 0 && (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {report.snapshot.signals.map((s) => (
              <li key={s.cubeId} className="flex items-start gap-4 py-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft"
                >
                  {s.glyph}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-light text-ink">
                    {CUBE_HREF[s.cubeId] ? (
                      <Link
                        href={CUBE_HREF[s.cubeId]}
                        className="hover:underline underline-offset-4"
                      >
                        {s.cubeLabel}
                      </Link>
                    ) : (
                      s.cubeLabel
                    )}
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
      <section>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          dynamic human reading
        </p>
        <h4 className="mt-3 text-xl font-light leading-snug tracking-brand text-ink md:text-2xl">
          What is real underneath the activity.
        </h4>
        <ul className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
          {report.swot.map((s, i) => (
            <li
              key={i}
              className={cn(
                "rounded-2xl border bg-paper p-4",
                toneFor(s.kind),
              )}
            >
              <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {SWOT_LABEL[s.kind]}
              </p>
              <p className="mt-2 text-[14.5px] font-light leading-relaxed text-ink">
                {s.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {report.crossRiver.length > 0 && (
        <>
          <RuleDots />
          <section>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              where the river may flow next
            </p>
            <h4 className="mt-3 text-xl font-light leading-snug tracking-brand text-ink md:text-2xl">
              Quiet bridges between the cubes.
            </h4>
            <ul className="mt-5 space-y-3">
              {report.crossRiver.map((o) => (
                <li
                  key={o.id}
                  className="rounded-2xl border border-line bg-paper p-4"
                >
                  <p className="text-[14.5px] font-light leading-relaxed text-ink">
                    {o.body}
                  </p>
                  {o.cta && (
                    <Link
                      href={o.cta.href}
                      className="mt-3 inline-flex h-8 items-center rounded-full border border-line bg-surface px-3 text-[12.5px] font-light text-ink hover:border-ink/40"
                    >
                      {o.cta.label} →
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <RuleDots />

      {/* Emotional */}
      <section>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          emotional reading
        </p>
        <ul className="mt-4 space-y-3">
          {report.emotional.map((e, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-[14.5px] font-light leading-relaxed text-ink-soft"
            >
              <span
                aria-hidden="true"
                className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40"
              />
              <span>
                <span className="mr-2 text-[10.5px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {e.kind}
                </span>
                {e.body}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <RuleDots />

      {/* Closing */}
      <section className="text-center">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          closing
        </p>
        <p className="mx-auto mt-4 max-w-prose text-balance text-lg font-light italic leading-snug text-ink md:text-xl">
          {report.closing}
        </p>
        <div className="mt-8 flex justify-center">
          <RiverLine />
        </div>
      </section>
    </article>
  );
}

function RuleDots() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto my-10 flex w-16 items-center justify-between md:my-14"
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
      return "border-ink/40";
    case "opportunity":
      return "border-ink/30";
    case "weakness":
      return "border-line";
    case "threat":
      return "border-line";
  }
}
