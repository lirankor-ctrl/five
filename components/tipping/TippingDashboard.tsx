"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import type {
  CheckIn,
  TippingPattern,
  TippingState,
} from "@/lib/tipping/types";
import { NotAlone } from "./NotAlone";
import { PatternCard } from "./PatternCard";
import { PatternSettings } from "./PatternSettings";

type Props = {
  state: TippingState;
  onCheckIn: (entry: CheckIn) => void;
  onReflect: (entry: CheckIn) => void;
  onAddPattern: () => void;
  onArchive: (patternId: string) => void;
  onUnarchive: (patternId: string) => void;
  onDelete: (patternId: string) => void;
  onEdit: (patternId: string) => void;
  onToggleAssistant: (next: boolean) => void;
};

export function TippingDashboard({
  state,
  onCheckIn,
  onReflect,
  onAddPattern,
  onArchive,
  onUnarchive,
  onDelete,
  onEdit,
  onToggleAssistant,
}: Props) {
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const settingsPattern =
    state.patterns.find((p) => p.id === settingsId) ?? null;

  const active = state.patterns.filter((p) => !p.archivedAt);
  const archived = state.patterns.filter((p) => p.archivedAt);

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24 pt-10 md:px-10 md:pt-16">
      <Link
        href="/cubes"
        className="inline-flex items-center gap-2 text-sm font-light text-ink-mute transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> Cube map
      </Link>

      <header className="mt-8 md:mt-10">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ember-700">
          five tipping point
        </p>
        <h1 className="mt-4 text-balance text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
          Less chaos. Same life.
        </h1>
        <p className="mt-4 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          You are not trying to be perfect here. You are turning an
          uncontrolled negative into a chosen, smaller one — and noticing
          the days you stayed inside it.
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>
      </header>

      <section className="mt-12 space-y-6">
        {active.map((p) => (
          <PatternCard
            key={p.id}
            pattern={p}
            state={state}
            onCheckIn={onCheckIn}
            onReflect={onReflect}
            onOpenSettings={(id) => setSettingsId(id)}
          />
        ))}
      </section>

      <section className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-8">
        <div className="max-w-[40ch] text-[14px] font-light text-ink-soft">
          More than one pattern is okay. Each one keeps its own boundary and
          its own quiet record.
        </div>
        <Button variant="secondary" size="md" onClick={onAddPattern}>
          + add another pattern
        </Button>
      </section>

      {/* Assistant offer */}
      <section className="mt-10">
        {!state.assistantEnabled ? (
          <button
            type="button"
            onClick={() => onToggleAssistant(true)}
            className={cn(
              "block w-full rounded-2xl border border-dashed border-line bg-transparent p-5 text-left transition-colors hover:border-ember-300",
            )}
          >
            <p className="text-xs font-light uppercase tracking-[0.22em] text-ember-700">
              optional
            </p>
            <p className="mt-2 text-[15px] font-light text-ink">
              Turn on the quiet assistant — gentle, realistic observations only.
            </p>
            <p className="mt-2 max-w-prose text-[13px] font-light leading-relaxed text-ink-mute">
              No coaching. No interrogation. No streak pressure. Only what your check-ins quietly reveal.
            </p>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onToggleAssistant(false)}
            className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            turn the assistant off
          </button>
        )}
      </section>

      {/* You are not alone */}
      <section className="mt-12">
        <NotAlone />
      </section>

      {archived.length > 0 && (
        <section className="mt-12">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            archived
          </p>
          <ul className="mt-4 space-y-3 border-y border-line/60 py-4">
            {archived.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 text-[14px] font-light text-ink-soft"
              >
                <span>{p.title}</span>
                <button
                  type="button"
                  onClick={() => onUnarchive(p.id)}
                  className="text-[12px] font-light uppercase tracking-[0.22em] text-ember-700 hover:opacity-70"
                >
                  resume
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <p className="text-sm font-light text-ink-mute">
          Reduce the chaos. Regain the direction.
        </p>
      </div>

      <PatternSettings
        open={settingsId !== null}
        pattern={settingsPattern}
        onClose={() => setSettingsId(null)}
        onArchive={(id) => {
          onArchive(id);
          setSettingsId(null);
        }}
        onUnarchive={(id) => {
          onUnarchive(id);
          setSettingsId(null);
        }}
        onDelete={(id) => {
          onDelete(id);
          setSettingsId(null);
        }}
        onEdit={(id) => {
          onEdit(id);
          setSettingsId(null);
        }}
      />
    </div>
  );
}
