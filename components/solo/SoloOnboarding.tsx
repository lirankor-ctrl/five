"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { formatHour } from "@/lib/solo/format";
import type {
  SoloFrequency,
  SoloPlan,
  SoloTimeOfDay,
} from "@/lib/solo/types";

type Props = {
  onBegin: (plan: SoloPlan) => void;
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

const ANCHOR_EXAMPLES = ["coffee", "work", "dinner", "putting kids to bed"];

export function SoloOnboarding({ onBegin }: Props) {
  const [field, setField] = useState("");
  const [frequency, setFrequency] = useState<SoloFrequency>({ kind: "daily" });
  const [timeOfDay, setTimeOfDay] = useState<SoloTimeOfDay>({ kind: "morning" });
  const [durationMin, setDurationMin] = useState<number>(5);
  const [customMinutes, setCustomMinutes] = useState<string>("");
  const [anchorText, setAnchorText] = useState<string>("");
  const [hourValue, setHourValue] = useState<number>(8);
  const [perWeek, setPerWeek] = useState<number>(3);
  const [specificDays, setSpecificDays] = useState<number[]>([1, 3, 5]);

  const ready = useMemo(() => field.trim().length > 0, [field]);

  function commit() {
    if (!ready) return;
    let normalisedTime: SoloTimeOfDay = timeOfDay;
    if (timeOfDay.kind === "hour") {
      normalisedTime = { kind: "hour", hour: hourValue };
    } else if (timeOfDay.kind === "anchor") {
      const a = anchorText.trim() || "coffee";
      normalisedTime = { kind: "anchor", anchor: a };
    }

    let normalisedFreq: SoloFrequency = frequency;
    if (frequency.kind === "weekly") {
      normalisedFreq = { kind: "weekly", perWeek };
    } else if (frequency.kind === "specific-days") {
      normalisedFreq = { kind: "specific-days", days: specificDays };
    }

    let normalisedDuration = durationMin;
    if (durationMin === -1) {
      const parsed = parseInt(customMinutes, 10);
      normalisedDuration = Number.isFinite(parsed) && parsed > 0 ? parsed : 5;
    }

    onBegin({
      field: field.trim(),
      frequency: normalisedFreq,
      timeOfDay: normalisedTime,
      durationMin: normalisedDuration,
      assistantEnabled: false,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 pb-24 pt-10 md:px-10 md:pt-16">
      <header className="mb-14">
        <p className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
          five solo
        </p>
        <h1 className="mt-4 text-balance text-3xl font-light leading-snug tracking-brand text-ink md:text-4xl">
          A small action, returned to.
        </h1>
        <div className="mt-6 w-20">
          <RiverLine />
        </div>
        <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-ink-soft md:text-base">
          One thing you&rsquo;d like to stay quietly consistent with. Set it
          gently — you can adjust later.
        </p>
      </header>

      <section className="space-y-12">
        <FieldStep
          ordinal="01"
          label="What would you like to return to?"
        >
          <input
            type="text"
            value={field}
            onChange={(e) => setField(e.target.value)}
            placeholder="Guitar · stretching · journaling…"
            autoFocus
            className="w-full border-b border-line bg-transparent pb-3 text-2xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </FieldStep>

        <FieldStep ordinal="02" label="How often?">
          <ChoiceRow>
            <Pill
              active={frequency.kind === "daily"}
              onClick={() => setFrequency({ kind: "daily" })}
            >
              Every day
            </Pill>
            <Pill
              active={frequency.kind === "weekly"}
              onClick={() => setFrequency({ kind: "weekly", perWeek })}
            >
              X times a week
            </Pill>
            <Pill
              active={frequency.kind === "specific-days"}
              onClick={() =>
                setFrequency({ kind: "specific-days", days: specificDays })
              }
            >
              Specific days
            </Pill>
            <Pill
              active={frequency.kind === "flexible"}
              onClick={() => setFrequency({ kind: "flexible" })}
            >
              Flexible
            </Pill>
          </ChoiceRow>

          {frequency.kind === "weekly" && (
            <div className="mt-5 flex items-center gap-3 text-sm font-light text-ink-soft">
              <span>About</span>
              <input
                type="number"
                min={1}
                max={7}
                value={perWeek}
                onChange={(e) => {
                  const v = Math.max(
                    1,
                    Math.min(7, parseInt(e.target.value, 10) || 1),
                  );
                  setPerWeek(v);
                  setFrequency({ kind: "weekly", perWeek: v });
                }}
                className="h-9 w-14 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
              />
              <span>times a week.</span>
            </div>
          )}

          {frequency.kind === "specific-days" && (
            <div className="mt-5 flex flex-wrap gap-2">
              {WEEKDAYS.map((d) => {
                const active = specificDays.includes(d.i);
                return (
                  <button
                    key={d.i}
                    type="button"
                    onClick={() => {
                      const next = active
                        ? specificDays.filter((x) => x !== d.i)
                        : [...specificDays, d.i];
                      setSpecificDays(next);
                      setFrequency({ kind: "specific-days", days: next });
                    }}
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-full border text-sm font-light transition-colors",
                      active
                        ? "border-ink/60 bg-ink text-paper"
                        : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                    )}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          )}
        </FieldStep>

        <FieldStep ordinal="03" label="When during the day?">
          <ChoiceRow>
            <Pill
              active={timeOfDay.kind === "morning"}
              onClick={() => setTimeOfDay({ kind: "morning" })}
            >
              Morning
            </Pill>
            <Pill
              active={timeOfDay.kind === "afternoon"}
              onClick={() => setTimeOfDay({ kind: "afternoon" })}
            >
              Afternoon
            </Pill>
            <Pill
              active={timeOfDay.kind === "evening"}
              onClick={() => setTimeOfDay({ kind: "evening" })}
            >
              Evening
            </Pill>
            <Pill
              active={timeOfDay.kind === "hour"}
              onClick={() => setTimeOfDay({ kind: "hour", hour: hourValue })}
            >
              A specific hour
            </Pill>
            <Pill
              active={timeOfDay.kind === "anchor"}
              onClick={() =>
                setTimeOfDay({ kind: "anchor", anchor: anchorText || "coffee" })
              }
            >
              After something
            </Pill>
          </ChoiceRow>

          {timeOfDay.kind === "hour" && (
            <div className="mt-5 flex items-center gap-3 text-sm font-light text-ink-soft">
              <span>Around</span>
              <input
                type="range"
                min={0}
                max={23}
                value={hourValue}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setHourValue(v);
                  setTimeOfDay({ kind: "hour", hour: v });
                }}
                className="h-1 w-48 accent-ink"
              />
              <span className="tabular-nums text-ink">
                {formatHour(hourValue)}
              </span>
            </div>
          )}

          {timeOfDay.kind === "anchor" && (
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 text-sm font-light text-ink-soft">
                <span>After</span>
                <input
                  type="text"
                  value={anchorText}
                  onChange={(e) => {
                    setAnchorText(e.target.value);
                    setTimeOfDay({
                      kind: "anchor",
                      anchor: e.target.value || "coffee",
                    });
                  }}
                  placeholder="coffee, work, …"
                  className="h-9 w-56 border-b border-line bg-transparent px-1 text-ink focus:border-ink/40 focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {ANCHOR_EXAMPLES.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => {
                      setAnchorText(a);
                      setTimeOfDay({ kind: "anchor", anchor: a });
                    }}
                    className="text-xs font-light uppercase tracking-[0.18em] text-ink-mute hover:text-ink"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </FieldStep>

        <FieldStep ordinal="04" label="How long, each time?">
          <ChoiceRow>
            <Pill active={durationMin === 5} onClick={() => setDurationMin(5)}>
              5 min
            </Pill>
            <Pill
              active={durationMin === 10}
              onClick={() => setDurationMin(10)}
            >
              10 min
            </Pill>
            <Pill
              active={durationMin === 15}
              onClick={() => setDurationMin(15)}
            >
              15 min
            </Pill>
            <Pill
              active={durationMin === -1}
              onClick={() => setDurationMin(-1)}
            >
              Custom
            </Pill>
          </ChoiceRow>

          {durationMin === -1 && (
            <div className="mt-5 flex items-center gap-3 text-sm font-light text-ink-soft">
              <input
                type="number"
                min={1}
                max={240}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="20"
                className="h-9 w-20 rounded-md border border-line bg-transparent px-3 text-center text-ink focus:border-ink/40 focus:outline-none"
              />
              <span>minutes.</span>
            </div>
          )}

          <p className="mt-5 max-w-prose text-[13px] leading-relaxed text-ink-mute">
            Small actions are the point. Five minutes is enough.
          </p>
        </FieldStep>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
        <Button
          variant="primary"
          size="lg"
          onClick={commit}
          disabled={!ready}
          className={cn(!ready && "cursor-not-allowed opacity-40")}
        >
          Begin
        </Button>
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          You can adjust this later.
        </p>
      </div>
    </div>
  );
}

function FieldStep({
  ordinal,
  label,
  children,
}: {
  ordinal: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          {ordinal}
        </span>
        <h2 className="text-base font-light tracking-brand text-ink md:text-lg">
          {label}
        </h2>
      </div>
      <div>{children}</div>
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
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center rounded-full border px-4 text-sm font-light transition-colors duration-200 ease-calm",
        active
          ? "border-ink/60 bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
