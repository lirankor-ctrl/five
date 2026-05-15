"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { cn } from "@/lib/cn";
import { familyPrompts } from "@/data/family/prompts";
import { getWorld } from "@/data/family/worlds";
import {
  CADENCE_LABEL,
  FEELING_LABEL,
  WORKED_LABEL,
  todayKey,
} from "@/lib/family/format";
import { generateId } from "@/lib/family/storage";
import type {
  Feeling,
  FamilySession,
  Ritual,
  SessionStatus,
  Worked,
} from "@/lib/family/types";

type Props = {
  ritual: Ritual;
  todaysSession?: FamilySession;
  onReport: (session: FamilySession) => void;
};

const FEELINGS: Feeling[] = ["warm", "calm", "joyful", "tender", "lively", "honest"];
const WORKED_OPTIONS: Worked[] = ["yes", "maybe", "not-really"];

export function TodayPrompt({ ritual, todaysSession, onReport }: Props) {
  const world = getWorld(ritual.world);
  const promptsForWorld = familyPrompts[ritual.world] ?? [];
  // Rotate the visible prompt by date so the same ritual shows something new each day.
  const promptIndex =
    promptsForWorld.length === 0
      ? 0
      : Math.abs(hash(`${ritual.id}-${todayKey()}`)) % promptsForWorld.length;
  const prompt = promptsForWorld[promptIndex];

  const [status, setStatus] = useState<SessionStatus | null>(
    todaysSession?.status ?? null,
  );
  const [feelings, setFeelings] = useState<Feeling[]>(
    todaysSession?.feelings ?? [],
  );
  const [worked, setWorked] = useState<Worked | null>(todaysSession?.worked ?? null);
  const [note, setNote] = useState<string>(todaysSession?.note ?? "");
  const [showMore, setShowMore] = useState<boolean>(Boolean(todaysSession));

  function toggleFeeling(f: Feeling) {
    setFeelings((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f],
    );
  }

  function commit(nextStatus: SessionStatus) {
    setStatus(nextStatus);
    const session: FamilySession = {
      id: todaysSession?.id ?? generateId("s"),
      ritualId: ritual.id,
      world: ritual.world,
      participantIds: todaysSession?.participantIds ?? [],
      date: todayKey(),
      status: nextStatus,
      feelings: feelings.length > 0 ? feelings : undefined,
      note: note.trim() || undefined,
      worked: worked ?? undefined,
      durationMinutes: nextStatus === "done" ? ritual.durationMinutes : undefined,
      reportedAt: new Date().toISOString(),
    };
    onReport(session);
    if (nextStatus === "done") setShowMore(true);
  }

  function saveDetails() {
    if (status === null) commit("done");
    else {
      const session: FamilySession = {
        id: todaysSession?.id ?? generateId("s"),
        ritualId: ritual.id,
        world: ritual.world,
        participantIds: todaysSession?.participantIds ?? [],
        date: todayKey(),
        status,
        feelings: feelings.length > 0 ? feelings : undefined,
        note: note.trim() || undefined,
        worked: worked ?? undefined,
        durationMinutes: status === "done" ? ritual.durationMinutes : undefined,
        reportedAt: new Date().toISOString(),
      };
      onReport(session);
    }
  }

  return (
    <Card className="bg-hearth-50 border-hearth-200">
      <div className="flex items-start gap-4">
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hearth-200 bg-paper text-base font-light text-hearth-700"
        >
          {world?.glyph ?? "·"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-hearth-700">
            today · {world?.label.toLowerCase()}
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            {ritual.label}
          </h2>
          <p className="mt-1 text-[12px] font-light uppercase tracking-[0.2em] text-ink-mute">
            {CADENCE_LABEL[ritual.cadence].toLowerCase()}
            <span aria-hidden="true"> · </span>
            {ritual.durationMinutes} min
          </p>

          {prompt && (
            <p className="mt-5 max-w-prose text-[16px] font-light leading-relaxed text-ink md:text-lg">
              <em className="not-italic">A small idea:</em>{" "}
              <span className="font-serif italic text-ink-soft">
                “{prompt.label}”
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Outcome row */}
      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <OutcomeTile
          active={status === "done"}
          tone="done"
          onClick={() => commit("done")}
          title="We had a moment"
          hint="However small. It counts."
        />
        <OutcomeTile
          active={status === "not-today"}
          tone="not-today"
          onClick={() => commit("not-today")}
          title="Not today"
          hint="That is also okay."
        />
      </div>

      {/* Optional reflection */}
      {status === "done" && (
        <div className={cn("mt-6", !showMore && "hidden")}>
          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              how did it feel? · optional
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEELINGS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => toggleFeeling(f)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                    feelings.includes(f)
                      ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                      : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
                  )}
                >
                  {FEELING_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              one short note · optional
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Something you might want to remember."
              className="mt-2 w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-hearth-500 focus:outline-none"
            />
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              did this work for the family?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {WORKED_OPTIONS.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => setWorked(w)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                    worked === w
                      ? "border-hearth-500 bg-hearth-100 text-hearth-700"
                      : "border-line text-ink-soft hover:border-hearth-300 hover:text-ink",
                  )}
                >
                  {WORKED_LABEL[w]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              type="button"
              onClick={saveDetails}
              className="inline-flex h-9 items-center rounded-full bg-hearth-700 px-4 text-[13px] font-light text-paper hover:opacity-90"
            >
              Save details
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

function OutcomeTile({
  active,
  tone,
  onClick,
  title,
  hint,
}: {
  active: boolean;
  tone: "done" | "not-today";
  onClick: () => void;
  title: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border p-5 text-left transition-all duration-300 ease-calm",
        active && tone === "done"
          ? "border-hearth-700 bg-hearth-700 text-paper shadow-soft"
          : active && tone === "not-today"
            ? "border-ink/30 bg-paper text-ink shadow-soft"
            : "border-line bg-paper/70 text-ink hover:-translate-y-[1px] hover:border-hearth-300 hover:shadow-soft",
      )}
    >
      <p className="text-[15px] font-light tracking-brand">{title}</p>
      <p
        className={cn(
          "mt-2 text-[12.5px] font-light leading-relaxed",
          active && tone === "done" ? "text-paper/70" : "text-ink-mute",
        )}
      >
        {hint}
      </p>
    </button>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
