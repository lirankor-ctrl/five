"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { formatHour } from "@/lib/tipping/format";
import { generatePatternId } from "@/lib/tipping/storage";
import type {
  Boundary,
  BoundaryUnit,
  SuggestedCategory,
  TippingPattern,
} from "@/lib/tipping/types";
import { suggestedCategories } from "@/data/tipping/categories";
import { suggestedTriggers } from "@/data/tipping/triggers";

type Props = {
  hasExisting: boolean;
  onCreate: (pattern: TippingPattern) => void;
  onCancel?: () => void;
};

type BoundaryKind = Boundary["kind"];

const BOUNDARY_LABEL: Record<BoundaryKind, string> = {
  "daily-cap": "Daily cap",
  "weekly-cap": "Weekly cap",
  "weekday-only": "Only on certain days",
  "time-window": "Outside a time window",
  custom: "Something else",
};

const UNIT_OPTIONS: BoundaryUnit[] = ["minutes", "hours", "times", "currency"];
const UNIT_LABEL: Record<BoundaryUnit, string> = {
  minutes: "min",
  hours: "hr",
  times: "times",
  currency: "$",
};

const WEEKDAYS = [
  { i: 0, label: "S" },
  { i: 1, label: "M" },
  { i: 2, label: "T" },
  { i: 3, label: "W" },
  { i: 4, label: "T" },
  { i: 5, label: "F" },
  { i: 6, label: "S" },
];

export function TippingOnboarding({ hasExisting, onCreate, onCancel }: Props) {
  const [picked, setPicked] = useState<SuggestedCategory | null>(null);
  const [custom, setCustom] = useState("");
  const [boundary, setBoundary] = useState<Boundary>({
    kind: "daily-cap",
    value: 20,
    unit: "minutes",
  });
  const [customBoundary, setCustomBoundary] = useState("");
  const [cadence, setCadence] = useState<"daily" | "weekly">("daily");
  const [triggers, setTriggers] = useState<string[]>([]);

  const title = useMemo(() => {
    if (custom.trim().length > 0) return custom.trim();
    if (picked) return picked.label;
    return "";
  }, [picked, custom]);

  const ready = title.length > 0;

  function applyCategory(c: SuggestedCategory) {
    setPicked(c);
    setCustom("");
    if (c.defaultBoundary) setBoundary(c.defaultBoundary);
  }

  function applyCustom(value: string) {
    setCustom(value);
    if (value.trim().length > 0) setPicked(null);
  }

  function toggleTrigger(t: string) {
    setTriggers((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  }

  function commit() {
    if (!ready) return;
    let finalBoundary = boundary;
    if (boundary.kind === "custom") {
      finalBoundary = {
        kind: "custom",
        description: customBoundary.trim() || "Notice the pattern",
      };
    }
    const pattern: TippingPattern = {
      id: generatePatternId(),
      title,
      categoryId: picked?.id,
      boundary: finalBoundary,
      trackingCadence: cadence,
      triggerTags: triggers,
      createdAt: new Date().toISOString(),
    };
    onCreate(pattern);
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-10 md:px-10 md:pt-16">
      <header className="mb-12 md:mb-16">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ember-700">
          five tipping point
        </p>
        <h1 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
          {hasExisting ? "Name another pattern." : "Name the pattern, gently."}
        </h1>
        <div className="mt-6 w-20">
          <RiverLine />
        </div>
        <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink-soft md:text-base">
          Not to quit forever. To set a boundary you actually live with, and to
          notice the days inside it. This is private. Nothing here is shared.
        </p>
      </header>

      <section className="space-y-12">
        <Step ordinal="01" label="What would you like to manage?">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {suggestedCategories.map((c) => {
              const active = picked?.id === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => applyCategory(c)}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border p-4 text-left transition-all duration-300 ease-calm",
                    active
                      ? "border-ember-500 bg-ember-50"
                      : "border-line bg-surface hover:border-ember-300 hover:bg-ember-50/40",
                  )}
                >
                  <span className="text-[15px] font-light text-ink">
                    {c.label}
                  </span>
                  <span className="mt-1 text-[12px] font-light leading-relaxed text-ink-mute">
                    {c.note}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 border-t border-line/60 pt-8">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              or write your own
            </p>
            <input
              type="text"
              value={custom}
              onChange={(e) => applyCustom(e.target.value)}
              placeholder="Something private. Anything."
              className="mt-3 w-full border-b border-line bg-transparent pb-3 text-xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ember-500 focus:outline-none"
            />
          </div>
        </Step>

        <Step
          ordinal="02"
          label="What is the boundary?"
          hint="Not zero. A size you can actually live with."
        >
          <ChoiceRow>
            {(Object.keys(BOUNDARY_LABEL) as BoundaryKind[]).map((k) => (
              <Pill
                key={k}
                active={boundary.kind === k}
                onClick={() => switchBoundaryKind(k, boundary, setBoundary)}
              >
                {BOUNDARY_LABEL[k]}
              </Pill>
            ))}
          </ChoiceRow>

          {(boundary.kind === "daily-cap" || boundary.kind === "weekly-cap") && (
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-light text-ink-soft">
              <span>Up to</span>
              <input
                type="number"
                min={0}
                max={9999}
                value={boundary.value}
                onChange={(e) => {
                  const v = Math.max(0, parseInt(e.target.value, 10) || 0);
                  setBoundary({ ...boundary, value: v });
                }}
                className="h-9 w-20 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ember-500 focus:outline-none"
              />
              <div className="flex flex-wrap gap-2">
                {UNIT_OPTIONS.map((u) => (
                  <Pill
                    key={u}
                    size="sm"
                    active={boundary.unit === u}
                    onClick={() => setBoundary({ ...boundary, unit: u })}
                  >
                    {UNIT_LABEL[u]}
                  </Pill>
                ))}
              </div>
              <span>
                a {boundary.kind === "daily-cap" ? "day" : "week"}.
              </span>
            </div>
          )}

          {boundary.kind === "weekday-only" && (
            <div className="mt-5">
              <p className="mb-3 text-xs font-light uppercase tracking-[0.18em] text-ink-mute">
                Days it is allowed
              </p>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map((d) => {
                  const active = boundary.allowedDays.includes(d.i);
                  return (
                    <button
                      key={d.i}
                      type="button"
                      onClick={() => {
                        const next = active
                          ? boundary.allowedDays.filter((x) => x !== d.i)
                          : [...boundary.allowedDays, d.i];
                        setBoundary({ kind: "weekday-only", allowedDays: next });
                      }}
                      className={cn(
                        "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-light transition-colors",
                        active
                          ? "border-ember-500 bg-ember-100 text-ember-700"
                          : "border-line text-ink-soft hover:border-ember-300 hover:text-ink",
                      )}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {boundary.kind === "time-window" && (
            <div className="mt-5 space-y-4 text-sm font-light text-ink-soft">
              <div className="flex flex-wrap items-center gap-3">
                <span>Not after</span>
                <input
                  type="range"
                  min={0}
                  max={23}
                  value={boundary.notAfter ?? 23}
                  onChange={(e) =>
                    setBoundary({
                      ...boundary,
                      notAfter: parseInt(e.target.value, 10),
                    })
                  }
                  className="h-1 w-40 accent-ember-700"
                />
                <span className="tabular-nums text-ink">
                  {formatHour(boundary.notAfter ?? 23)}
                </span>
              </div>
            </div>
          )}

          {boundary.kind === "custom" && (
            <div className="mt-5">
              <input
                type="text"
                value={customBoundary}
                onChange={(e) => setCustomBoundary(e.target.value)}
                placeholder="Describe the boundary in your own words"
                className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-light text-ink placeholder:text-ink-mute/70 focus:border-ember-500 focus:outline-none"
              />
            </div>
          )}
        </Step>

        <Step ordinal="03" label="Daily or weekly check-in?">
          <ChoiceRow>
            <Pill active={cadence === "daily"} onClick={() => setCadence("daily")}>
              Daily
            </Pill>
            <Pill active={cadence === "weekly"} onClick={() => setCadence("weekly")}>
              Weekly
            </Pill>
          </ChoiceRow>
        </Step>

        <Step
          ordinal="04"
          label="When does this usually show up?"
          hint="Optional. You can change these later. They help the assistant later, if you turn it on."
        >
          <div className="flex flex-wrap gap-2">
            {suggestedTriggers.map((t) => {
              const active = triggers.includes(t);
              return (
                <Pill
                  key={t}
                  size="sm"
                  active={active}
                  onClick={() => toggleTrigger(t)}
                >
                  {t}
                </Pill>
              );
            })}
          </div>
        </Step>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={commit}
          disabled={!ready}
          className={cn(!ready && "cursor-not-allowed opacity-40")}
        >
          {hasExisting ? "Add this pattern" : "Begin"}
        </Button>
        {hasExisting && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            Cancel
          </button>
        )}
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          You can adjust this later.
        </p>
      </div>
    </div>
  );
}

function switchBoundaryKind(
  kind: BoundaryKind,
  current: Boundary,
  set: (b: Boundary) => void,
): void {
  if (kind === current.kind) return;
  if (kind === "daily-cap")
    return set({ kind: "daily-cap", value: 20, unit: "minutes" });
  if (kind === "weekly-cap")
    return set({ kind: "weekly-cap", value: 2, unit: "times" });
  if (kind === "weekday-only")
    return set({ kind: "weekday-only", allowedDays: [0, 6] });
  if (kind === "time-window") return set({ kind: "time-window", notAfter: 22 });
  return set({ kind: "custom", description: "" });
}

function Step({
  ordinal,
  label,
  hint,
  children,
}: {
  ordinal: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-[11px] font-light uppercase tracking-[0.25em] text-ember-700">
          {ordinal}
        </span>
        <h2 className="text-base font-light tracking-brand text-ink md:text-lg">
          {label}
        </h2>
      </div>
      {hint && (
        <p className="mb-4 max-w-prose text-[13px] font-light leading-relaxed text-ink-mute">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function ChoiceRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Pill({
  active,
  onClick,
  children,
  size = "md",
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full border px-4 text-sm font-light transition-colors duration-200 ease-calm",
        size === "sm" ? "h-8 px-3 text-[13px]" : "h-10",
        active
          ? "border-ember-500 bg-ember-100 text-ember-700"
          : "border-line text-ink-soft hover:border-ember-300 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
