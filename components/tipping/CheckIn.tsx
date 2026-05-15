"use client";

import { cn } from "@/lib/cn";
import type { CheckInStatus } from "@/lib/tipping/types";

type Props = {
  selected: CheckInStatus | null;
  onSelect: (status: CheckInStatus) => void;
};

const OPTIONS: Array<{
  status: CheckInStatus;
  label: string;
  hint: string;
}> = [
  { status: "within", label: "Stayed within", hint: "Today held." },
  {
    status: "partial",
    label: "Closer than before",
    hint: "Direction is what matters.",
  },
  {
    status: "over",
    label: "Past the boundary",
    hint: "Tomorrow is also a day.",
  },
];

/**
 * Three-way check-in.
 *
 * The middle option (partial victory) is intentionally the same visual
 * weight as the other two. It is not a consolation prize — it is a
 * first-class outcome.
 */
export function CheckInTriad({ selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
      {OPTIONS.map((opt) => {
        const active = selected === opt.status;
        return (
          <button
            key={opt.status}
            type="button"
            onClick={() => onSelect(opt.status)}
            className={cn(
              "group flex flex-col items-start rounded-2xl border p-5 text-left transition-all duration-300 ease-calm",
              active
                ? toneActive(opt.status)
                : "border-line bg-surface text-ink hover:-translate-y-[1px] hover:border-ember-300 hover:bg-ember-50/40",
            )}
          >
            <span
              className={cn(
                "text-[15px] font-light tracking-brand",
                active && opt.status === "within" && "text-paper",
              )}
            >
              {opt.label}
            </span>
            <span
              className={cn(
                "mt-2 text-[12px] font-light leading-relaxed",
                active
                  ? opt.status === "within"
                    ? "text-paper/70"
                    : "text-ember-700"
                  : "text-ink-mute",
              )}
            >
              {opt.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function toneActive(status: CheckInStatus): string {
  if (status === "within")
    return "border-ember-700 bg-ember-700 text-paper shadow-soft";
  if (status === "partial")
    return "border-ember-500 bg-ember-100 text-ember-700 shadow-soft";
  return "border-ink/30 bg-paper text-ink shadow-soft";
}
