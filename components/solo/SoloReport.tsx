"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { todayKey } from "@/lib/solo/format";
import type { SoloEntry, SoloPlan, SoloStatus } from "@/lib/solo/types";

type Props = {
  plan: SoloPlan;
  todayEntry: SoloEntry | undefined;
  onSubmit: (entry: SoloEntry) => void;
};

const OPTIONS: Array<{
  status: SoloStatus;
  label: string;
  hint: string;
}> = [
  { status: "done", label: "Done", hint: "I returned today." },
  { status: "partial", label: "Partially", hint: "A small piece counts." },
  { status: "missed", label: "Not today", hint: "And that is okay." },
];

export function SoloReport({ plan, todayEntry, onSubmit }: Props) {
  const [selected, setSelected] = useState<SoloStatus | null>(
    todayEntry?.status ?? null,
  );

  function pick(status: SoloStatus) {
    setSelected(status);
    const now = new Date();
    const entry: SoloEntry = {
      date: todayKey(now),
      status,
      hour: now.getHours(),
      durationMin: status === "done" ? plan.durationMin : undefined,
      reportedAt: now.toISOString(),
    };
    onSubmit(entry);
  }

  return (
    <div>
      <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
        Today
      </p>
      <h2 className="mt-3 text-xl font-light tracking-brand text-ink md:text-2xl">
        {todayEntry ? "How did it land?" : "How was today?"}
      </h2>

      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {OPTIONS.map((opt) => {
          const active = selected === opt.status;
          return (
            <button
              key={opt.status}
              type="button"
              onClick={() => pick(opt.status)}
              className={cn(
                "group flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 ease-calm",
                active
                  ? "border-ink/60 bg-ink text-paper shadow-soft"
                  : "border-line bg-surface text-ink hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft",
              )}
            >
              <span className="text-base font-light tracking-brand">
                {opt.label}
              </span>
              <span
                className={cn(
                  "mt-2 text-[13px] font-light leading-relaxed",
                  active ? "text-paper/70" : "text-ink-mute",
                )}
              >
                {opt.hint}
              </span>
            </button>
          );
        })}
      </div>

      {todayEntry && (
        <p className="mt-4 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          Reported · you can change it.
        </p>
      )}
    </div>
  );
}
