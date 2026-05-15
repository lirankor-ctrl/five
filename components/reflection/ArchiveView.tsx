"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { longDate } from "@/lib/reflection/format";
import { loadState } from "@/lib/reflection/storage";
import type {
  ReflectionDialogueResponse,
  ReflectionReport,
  ReflectionState,
} from "@/lib/reflection/types";

const DEFAULT_STATE: ReflectionState = {
  archive: [],
  dialogue: [],
  cadence: "weekly",
  version: 1,
};

export function ArchiveView() {
  const [state, setState] = useState<ReflectionState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const responsesByReport = useMemo(() => {
    const map = new Map<string, ReflectionDialogueResponse[]>();
    for (const d of state.dialogue) {
      const arr = map.get(d.reportId) ?? [];
      arr.push(d);
      map.set(d.reportId, arr);
    }
    return map;
  }, [state.dialogue]);

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
      <header className="border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          reflection archive
        </p>
        <h1 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          Past readings.
        </h1>
        <p className="mt-3 max-w-prose text-[14px] font-light text-ink-soft">
          The reports you have saved. Across many months these become a small archive of how you have been moving.
        </p>
      </header>

      <section className="mt-10">
        {state.archive.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[15px] font-light italic leading-relaxed text-ink-soft">
              No saved reports yet. Save a report from the reader to start an archive.
            </p>
            <Link
              href="/cubes/reflection/report"
              className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-light text-paper hover:bg-accent"
            >
              Read this week →
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {state.archive.map((r) => {
              const open = openId === r.id;
              const responses = responsesByReport.get(r.id) ?? [];
              return (
                <li
                  key={r.id}
                  className="rounded-2xl border border-line bg-surface p-5 md:p-7"
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : r.id)}
                    className="flex w-full items-baseline justify-between gap-4 text-left"
                  >
                    <div>
                      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                        {longDate(new Date(r.generatedAt))}
                      </p>
                      <p className="mt-2 text-[16px] font-light text-ink">
                        {r.opening}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute"
                    >
                      {open ? "close" : "open"}
                    </span>
                  </button>
                  {open && <ArchiveDetail report={r} responses={responses} />}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          A living archive of human evolution.
        </p>
      </div>
    </Container>
  );
}

function ArchiveDetail({
  report,
  responses,
}: {
  report: ReflectionReport;
  responses: ReflectionDialogueResponse[];
}) {
  return (
    <div className="mt-6 space-y-6 border-t border-line/60 pt-6">
      <div>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          momentum snapshot
        </p>
        <p className="mt-2 text-[14.5px] font-light leading-relaxed text-ink-soft">
          {report.snapshot.paragraph}
        </p>
        {report.snapshot.signals.length > 0 && (
          <ul className="mt-3 space-y-1 text-[13px] font-light leading-relaxed text-ink-soft">
            {report.snapshot.signals.map((s) => (
              <li key={s.cubeId}>
                · <span className="text-ink">{s.cubeLabel}</span>: {s.narrative}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          swot reflection
        </p>
        <ul className="mt-2 space-y-1 text-[13px] font-light leading-relaxed text-ink-soft">
          {report.swot.map((s, i) => (
            <li key={i}>
              <span className="text-ink-mute">[{s.kind}]</span> {s.body}
            </li>
          ))}
        </ul>
      </div>

      {report.crossRiver.length > 0 && (
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            cross-river opportunities
          </p>
          <ul className="mt-2 space-y-1 text-[13px] font-light leading-relaxed text-ink-soft">
            {report.crossRiver.map((c) => (
              <li key={c.id}>· {c.body}</li>
            ))}
          </ul>
        </div>
      )}

      {responses.length > 0 && (
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            your responses
          </p>
          <ul className="mt-2 space-y-2 text-[13.5px] font-light leading-relaxed text-ink">
            {responses.map((r) => (
              <li key={r.id}>
                <span className="mr-2 text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {r.kind.replace("-", " ")}
                </span>
                {r.body ?? <em className="text-ink-mute">no note</em>}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          closing
        </p>
        <p className="mt-2 text-[14.5px] font-light italic leading-relaxed text-ink">
          {report.closing}
        </p>
      </div>
    </div>
  );
}
