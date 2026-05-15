"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { eventCategories } from "@/data/live/categories";
import {
  CAMERA_LABEL,
  CATEGORY_LABEL,
  INTERACTION_HINT,
  INTERACTION_LABEL,
} from "@/lib/live/format";
import { formatHourMinute } from "@/lib/live/schedule";
import {
  addDraft,
  generateId,
  loadState,
  removeDraft,
  saveState,
} from "@/lib/live/storage";
import type {
  AccessLevel,
  CameraMode,
  EventCadence,
  EventCategory,
  InteractionStyle,
  LiveEvent,
  LiveState,
  RecurrencePattern,
} from "@/lib/live/types";

const DEFAULT_STATE: LiveState = {
  displayName: "Quiet five-er",
  anonymous: true,
  drafts: [],
  completions: [],
  saved: [],
  version: 1,
};

const CADENCES: EventCadence[] = ["one-time", "daily", "weekday", "weekly"];
const CADENCE_LABEL_LOCAL: Record<EventCadence, string> = {
  "one-time": "Once",
  daily: "Every day",
  weekday: "Every weekday",
  weekly: "Once a week",
};

const INTERACTIONS: InteractionStyle[] = [
  "silent",
  "guided",
  "check-in",
  "momentum-sprint",
];

const CAMERA_MODES: CameraMode[] = [
  "no-cameras",
  "guided-audio",
  "text-only",
  "cameras-on",
  "free-discussion",
];

const ACCESS_OPTIONS: AccessLevel[] = ["public", "limited", "private", "invite-only"];

const WEEKDAYS = [
  { i: 0, label: "Sun" },
  { i: 1, label: "Mon" },
  { i: 2, label: "Tue" },
  { i: 3, label: "Wed" },
  { i: 4, label: "Thu" },
  { i: 5, label: "Fri" },
  { i: 6, label: "Sat" },
];

export function CreateView() {
  const [state, setState] = useState<LiveState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  const [name, setName] = useState("");
  const [hook, setHook] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<EventCategory>("growth");
  const [duration, setDuration] = useState<number>(5);
  const [cadence, setCadence] = useState<EventCadence>("weekly");
  const [dayOfWeek, setDayOfWeek] = useState<number>(3);
  const [hour, setHour] = useState<number>(19);
  const [minute, setMinute] = useState<number>(0);
  const [interaction, setInteraction] = useState<InteractionStyle>("silent");
  const [cameraMode, setCameraMode] = useState<CameraMode>("no-cameras");
  const [access, setAccess] = useState<AccessLevel>("public");
  const [language, setLanguage] = useState<string>("en");
  const [recorded, setRecorded] = useState<boolean>(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: LiveState) => {
    setState(next);
    saveState(next);
  }, []);

  const ready = useMemo(
    () => name.trim().length > 0 && description.trim().length > 0,
    [name, description],
  );

  function publish() {
    if (!ready) return;
    const recurrence: RecurrencePattern = {
      cadence,
      hour,
      minute,
      dayOfWeek: cadence === "weekly" ? dayOfWeek : undefined,
    };
    const draft: LiveEvent = {
      id: generateId("e"),
      name: name.trim(),
      hostId: "h-leyla", // host = "you" placeholder; replaced by real auth later
      category,
      description: description.trim(),
      hook: hook.trim() || undefined,
      durationMinutes: duration,
      interaction,
      cameraMode,
      access,
      language,
      recorded,
      recurrence,
      community: {
        daysActive: 0,
        totalCompletions: 0,
        weeklyCompletions: 0,
        uniqueParticipants: 0,
      },
    };
    persist(addDraft(state, draft));
    // Reset minimal fields
    setName("");
    setHook("");
    setDescription("");
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
            host · new live
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
            Open a small room.
          </h1>
          <p className="mt-2 max-w-prose text-[14px] font-light text-ink-soft">
            Default settings keep the room calm: no cameras, no recording, anonymous mode allowed. You can change all of it.
          </p>
        </div>
        <Link
          href="/cubes/live-event/discover"
          className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          ← back to discover
        </Link>
      </header>

      <section className="mt-10 space-y-10">
        <Step ordinal="01" label="name">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Five Hemingway Thursdays"
            className="w-full border-b border-line bg-transparent pb-2 text-2xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="02" label="hook · optional one-line italic">
          <input
            type="text"
            value={hook}
            onChange={(e) => setHook(e.target.value)}
            placeholder="Same page. Different homes."
            className="w-full border-b border-line bg-transparent pb-2 text-lg italic font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="03" label="describe it">
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A few honest sentences."
            className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="04" label="category">
          <div className="flex flex-wrap gap-2">
            {eventCategories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={cn(
                  "inline-flex h-9 items-center gap-2 rounded-full border px-3 text-[13px] font-light transition-colors",
                  category === c.id
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                <span aria-hidden="true">{c.glyph}</span>
                {CATEGORY_LABEL[c.id]}
              </button>
            ))}
          </div>
        </Step>

        <Step ordinal="05" label="duration">
          <div className="flex flex-wrap gap-2">
            {[5, 10, 15].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(d)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-[13px] font-light transition-colors",
                  duration === d
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {d} min
              </button>
            ))}
          </div>
        </Step>

        <Step ordinal="06" label="recurrence">
          <div className="flex flex-wrap gap-2">
            {CADENCES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCadence(c)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[13px] font-light transition-colors",
                  cadence === c
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {CADENCE_LABEL_LOCAL[c]}
              </button>
            ))}
          </div>
          {cadence === "weekly" && (
            <div className="mt-4 flex flex-wrap gap-2">
              {WEEKDAYS.map((d) => (
                <button
                  key={d.i}
                  type="button"
                  onClick={() => setDayOfWeek(d.i)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                    dayOfWeek === d.i
                      ? "border-ink/50 bg-paper text-ink"
                      : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}
          <div className="mt-5 flex items-center gap-3 text-sm font-light text-ink-soft">
            <span>at</span>
            <input
              type="number"
              min={0}
              max={23}
              value={hour}
              onChange={(e) => setHour(Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0)))}
              className="h-9 w-16 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
            />
            <span>:</span>
            <input
              type="number"
              min={0}
              max={59}
              value={minute}
              onChange={(e) => setMinute(Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)))}
              className="h-9 w-16 rounded-md border border-line bg-transparent px-2 text-center text-ink focus:border-ink/40 focus:outline-none"
            />
            <span className="text-ink-mute">
              {formatHourMinute(hour, minute)}
            </span>
          </div>
        </Step>

        <Step ordinal="07" label="interaction">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {INTERACTIONS.map((i) => {
              const active = interaction === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setInteraction(i)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all duration-300 ease-calm",
                    active
                      ? "border-ink/50 bg-paper"
                      : "border-line bg-surface hover:border-ink/30",
                  )}
                >
                  <p className="text-[15px] font-light tracking-brand text-ink">
                    {INTERACTION_LABEL[i]}
                  </p>
                  <p className="mt-1 text-[12.5px] font-light italic leading-relaxed text-ink-mute">
                    {INTERACTION_HINT[i]}
                  </p>
                </button>
              );
            })}
          </div>
        </Step>

        <Step ordinal="08" label="camera mode">
          <div className="flex flex-wrap gap-2">
            {CAMERA_MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCameraMode(m)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                  cameraMode === m
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {CAMERA_LABEL[m]}
              </button>
            ))}
          </div>
        </Step>

        <Step ordinal="09" label="access">
          <div className="flex flex-wrap gap-2">
            {ACCESS_OPTIONS.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAccess(a)}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-light capitalize transition-colors",
                  access === a
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {a}
              </button>
            ))}
          </div>
        </Step>

        <Step ordinal="10" label="language">
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value.slice(0, 8))}
            placeholder="en"
            className="h-10 w-32 rounded-md border border-line bg-paper px-3 text-[14px] font-light text-ink focus:border-ink/40 focus:outline-none"
          />
        </Step>

        <Step ordinal="11" label="recorded?">
          <label className="inline-flex items-center gap-3 text-[14px] font-light text-ink-soft">
            <input
              type="checkbox"
              checked={recorded}
              onChange={(e) => setRecorded(e.target.checked)}
              className="h-4 w-4"
            />
            <span>
              Record this session. <em className="text-ink-mute">Default is off — and we recommend keeping it off.</em>
            </span>
          </label>
        </Step>
      </section>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-8">
        <p className="text-[12px] font-light text-ink-mute">
          Stored on this device. A future host backend will route this to scheduling + presence.
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={publish}
          disabled={!ready}
          className={cn(!ready && "cursor-not-allowed opacity-40")}
        >
          Open the room
        </Button>
      </div>

      {/* Drafts */}
      <section className="mt-16">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            your lives on this device
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            Drafts and rooms you have created.
          </h2>
        </header>
        {!hydrated ? null : state.drafts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              Nothing yet. Anything you create will appear here — and in discover.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {state.drafts.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-4 py-4">
                <div className="min-w-0">
                  <Link
                    href={`/cubes/live-event/event/${d.id}`}
                    className="block truncate text-[16px] font-light text-ink hover:underline"
                  >
                    {d.name}
                  </Link>
                  <p className="mt-1 text-[11px] font-light uppercase tracking-[0.2em] text-ink-mute">
                    {CATEGORY_LABEL[d.category]} · {d.durationMinutes} min · {INTERACTION_LABEL[d.interaction]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => persist(removeDraft(state, d.id))}
                  className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                >
                  remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Better small and alive than big and abandoned.
        </p>
      </div>
    </Container>
  );
}

function Step({
  ordinal,
  label,
  children,
}: {
  ordinal: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-3">
        <span className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          {ordinal}
        </span>
        <h3 className="text-[14px] font-light uppercase tracking-[0.2em] text-ink">
          {label}
        </h3>
      </div>
      {children}
    </section>
  );
}
