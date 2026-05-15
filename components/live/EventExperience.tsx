"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { getCategory } from "@/data/live/categories";
import { getHost } from "@/data/live/hosts";
import {
  CAMERA_LABEL,
  CATEGORY_LABEL,
  INTERACTION_HINT,
  INTERACTION_LABEL,
  REACTION_LABEL,
  relativeMinutes,
  shortDay,
  shortTime,
  todayKey,
} from "@/lib/live/format";
import { recurrenceLabel, statusFor } from "@/lib/live/schedule";
import {
  addCompletion,
  generateId,
  loadState,
  saveState,
  setIdentity,
  toggleSaved,
} from "@/lib/live/storage";
import type {
  FiveDoneRecord,
  LiveEvent,
  LiveState,
  Reaction,
} from "@/lib/live/types";
import { LiveDot } from "./LiveDot";

const DEFAULT_STATE: LiveState = {
  displayName: "Quiet five-er",
  anonymous: true,
  drafts: [],
  completions: [],
  saved: [],
  version: 1,
};

const REACTIONS: Reaction[] = ["thanks", "fire", "with-you", "next-five"];

type Props = {
  event: LiveEvent;
};

/**
 * Three states:
 *   pre  → lobby with countdown and identity controls
 *   live → shared timer + light interactions + sticky “I did my Five”
 *   done → confirmation + lightweight reactions
 *
 * The "live" state is mocked from the event's recurrence pattern.
 * A real realtime backend (presence channel, server timer) would
 * replace `statusFor` and `tick`-driven seconds-left here without
 * changing the component's surface.
 */
export function EventExperience({ event }: Props) {
  const [state, setState] = useState<LiveState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const [sentReactions, setSentReactions] = useState<Reaction[]>([]);
  const [doneToday, setDoneToday] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const today = todayKey();
    const has = state.completions.some(
      (c) => c.eventId === event.id && c.date === today,
    );
    setDoneToday(has);
  }, [state.completions, event.id]);

  const status = useMemo(() => statusFor(event, now), [event, now]);
  const category = getCategory(event.category);
  const host = getHost(event.hostId);
  const saved = state.saved.includes(event.id);

  // Mock "live" participant count: deterministic per event + minute.
  const livePeopleCount = useMemo(() => {
    if (status.kind !== "live") return 0;
    const minute = Math.floor(now.getTime() / 60000);
    const seed = hash(`${event.id}-${minute}`);
    const base = Math.max(2, Math.floor(event.community.weeklyCompletions / 6));
    return base + (Math.abs(seed) % 4);
  }, [status, event, now]);

  const persist = useCallback((next: LiveState) => {
    setState(next);
    saveState(next);
  }, []);

  function handleReaction(r: Reaction) {
    setSentReactions((prev) =>
      prev.includes(r) ? prev : [...prev, r],
    );
  }

  function handleDone() {
    const record: FiveDoneRecord = {
      id: generateId("done"),
      eventId: event.id,
      date: todayKey(),
      reactions: sentReactions,
      reportedAt: new Date().toISOString(),
    };
    persist(addCompletion(state, record));
    setDoneToday(true);
  }

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
      <Link
        href="/cubes/live-event/discover"
        className="inline-flex items-center gap-2 text-sm font-light text-ink-mute transition-colors hover:text-ink"
      >
        <span aria-hidden="true">←</span> discover
      </Link>

      <header className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            <span aria-hidden="true" className="text-ink">
              {category.glyph}
            </span>
            <span className="text-ink">{CATEGORY_LABEL[event.category]}</span>
            <span aria-hidden="true">·</span>
            <span>{event.durationMinutes} min</span>
            <span aria-hidden="true">·</span>
            <span>{recurrenceLabel(event.recurrence)}</span>
          </div>
          <h1 className="mt-4 text-balance text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            {event.name}
          </h1>
          {event.hook && (
            <p className="mt-3 max-w-prose text-[16px] font-light italic leading-relaxed text-ink-soft md:text-lg">
              {event.hook}
            </p>
          )}
          <div className="mt-6 w-20">
            <RiverLine />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {status.kind === "live" && (
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 text-[11px] font-light uppercase tracking-[0.22em] text-paper">
              <LiveDot />
              live
            </span>
          )}
          <button
            type="button"
            onClick={() => persist(toggleSaved(state, event.id))}
            aria-label={saved ? "Remove from saved" : "Save"}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full border text-[15px] transition-colors",
              saved
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
            )}
          >
            <span aria-hidden="true">✦</span>
          </button>
        </div>
      </header>

      {/* Main state-aware panel */}
      <section className="mt-10">
        {status.kind === "live" ? (
          <LivePanel
            event={event}
            now={now}
            endsAt={status.endsAt}
            secondsLeft={status.secondsLeft}
            livePeopleCount={livePeopleCount}
            doneToday={doneToday}
            sentReactions={sentReactions}
            onReaction={handleReaction}
            onDone={handleDone}
          />
        ) : (
          <LobbyPanel
            event={event}
            startsAt={status.startsAt}
            now={now}
            secondsUntil={
              status.kind === "starting-soon" ? status.secondsUntil : undefined
            }
          />
        )}
      </section>

      {/* Identity / about / community */}
      <section className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            about this live
          </p>
          <p className="mt-3 max-w-prose text-[15.5px] font-light leading-relaxed text-ink md:text-base">
            {event.description}
          </p>
          <p className="mt-4 max-w-prose text-[13px] font-light italic leading-relaxed text-ink-mute">
            {INTERACTION_HINT[event.interaction]}
          </p>
        </div>
        <aside className="space-y-4">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <Row label="Host" value={host?.name ?? "—"} />
            <Row label="Interaction" value={INTERACTION_LABEL[event.interaction]} />
            <Row label="Camera" value={CAMERA_LABEL[event.cameraMode]} />
            <Row label="Access" value={event.access} />
            <Row label="Language" value={event.language.toUpperCase()} />
            <Row label="Recorded" value={event.recorded ? "Yes" : "No"} />
          </div>

          {/* Identity controls */}
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              your identity here
            </p>
            <input
              type="text"
              value={state.displayName}
              onChange={(e) =>
                persist(setIdentity(state, e.target.value, state.anonymous))
              }
              className="mt-3 w-full border-b border-line bg-transparent pb-1 text-[15px] font-light text-ink focus:border-ink/40 focus:outline-none"
            />
            <label className="mt-4 flex cursor-pointer items-center gap-3 text-[13px] font-light text-ink-soft">
              <input
                type="checkbox"
                checked={state.anonymous}
                onChange={(e) =>
                  persist(setIdentity(state, state.displayName, e.target.checked))
                }
                className="h-4 w-4"
              />
              <span>Stay anonymous in this room</span>
            </label>
          </div>
        </aside>
      </section>

      {/* Community energy */}
      <section className="mt-12 rounded-3xl border border-line bg-surface p-6 md:p-8">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          community energy
        </p>
        <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
          Repeat momentum, not vanity.
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat
            label="days active"
            value={String(event.community.daysActive)}
          />
          <Stat
            label="this week"
            value={String(event.community.weeklyCompletions)}
          />
          <Stat
            label="total fives"
            value={String(event.community.totalCompletions)}
          />
          <Stat
            label="people"
            value={String(event.community.uniqueParticipants)}
          />
        </div>
        <p className="mt-6 max-w-prose text-[13px] font-light italic leading-relaxed text-ink-mute">
          No likes. No followers. No popularity. Only the number of times someone came back and confirmed they did their five.
        </p>
      </section>
    </Container>
  );
}

function LobbyPanel({
  event,
  startsAt,
  now,
  secondsUntil,
}: {
  event: LiveEvent;
  startsAt: Date;
  now: Date;
  secondsUntil?: number;
}) {
  const isStartingSoon = secondsUntil !== undefined;
  const sameDay =
    startsAt.toDateString() === now.toDateString();
  const dayLabel = sameDay ? "today" : shortDay(startsAt);
  return (
    <div className="rounded-3xl border border-line bg-paper p-8 text-center md:p-12">
      <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
        lobby
      </p>
      <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
        {isStartingSoon
          ? "Starting soon."
          : sameDay
            ? "Later today."
            : "Coming up."}
      </h2>
      <p className="mt-3 text-[15px] font-light text-ink-soft">
        {dayLabel} · {shortTime(startsAt)}
        {isStartingSoon && (
          <>
            {" "}
            <span aria-hidden="true">·</span> in {relativeMinutes(secondsUntil!)}
          </>
        )}
      </p>
      <div className="mx-auto mt-8 w-20">
        <RiverLine />
      </div>
      <p className="mx-auto mt-6 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-mute">
        The room opens at the start time. Quiet now — please come back. Or hit save.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/cubes/live-event/discover"
          className="inline-flex h-10 items-center rounded-full border border-line bg-transparent px-5 text-[13px] font-light text-ink-soft hover:border-ink/40 hover:text-ink"
        >
          See other lives
        </Link>
      </div>
      <p className="mt-8 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        next · {event.durationMinutes} min · {event.access}
      </p>
    </div>
  );
}

function LivePanel({
  event,
  now,
  endsAt,
  secondsLeft,
  livePeopleCount,
  doneToday,
  sentReactions,
  onReaction,
  onDone,
}: {
  event: LiveEvent;
  now: Date;
  endsAt: Date;
  secondsLeft: number;
  livePeopleCount: number;
  doneToday: boolean;
  sentReactions: Reaction[];
  onReaction: (r: Reaction) => void;
  onDone: () => void;
}) {
  const totalSeconds = event.durationMinutes * 60;
  const elapsed = Math.max(0, totalSeconds - secondsLeft);
  const pct = totalSeconds === 0 ? 0 : Math.min(1, elapsed / totalSeconds);
  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;

  return (
    <div className="rounded-3xl border border-ink/30 bg-paper p-8 text-center shadow-soft md:p-12">
      <div className="flex items-center justify-center gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        <LiveDot />
        live now · {livePeopleCount} {livePeopleCount === 1 ? "person" : "people"} doing this five with you
      </div>

      {/* Big timer */}
      <p className="mt-8 font-thin tracking-tight text-ink" aria-label="time remaining">
        <span className="text-7xl md:text-8xl">
          {String(mm).padStart(2, "0")}
        </span>
        <span className="text-7xl md:text-8xl">:</span>
        <span className="text-7xl md:text-8xl">
          {String(ss).padStart(2, "0")}
        </span>
      </p>
      <p className="mt-3 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
        ends at {shortTime(endsAt)} · {INTERACTION_LABEL[event.interaction]}
      </p>

      {/* Progress */}
      <div className="mx-auto mt-8 h-1 w-full max-w-md overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-ink transition-all duration-700 ease-calm"
          style={{ width: `${(pct * 100).toFixed(1)}%` }}
        />
      </div>

      {/* Reactions */}
      <div className="mx-auto mt-10 flex max-w-md flex-wrap items-center justify-center gap-2">
        {REACTIONS.map((r) => {
          const sent = sentReactions.includes(r);
          return (
            <button
              key={r}
              type="button"
              onClick={() => onReaction(r)}
              disabled={sent}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                sent
                  ? "border-ink bg-ink text-paper"
                  : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
              )}
            >
              {REACTION_LABEL[r]}
              {sent && <span aria-hidden="true" className="ml-1.5">·</span>}
            </button>
          );
        })}
      </div>
      <p className="mx-auto mt-3 max-w-prose text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        no likes here. just a few human signals.
      </p>

      {/* Done */}
      <div className="mt-10 border-t border-line/70 pt-8">
        {!doneToday ? (
          <>
            <button
              type="button"
              onClick={onDone}
              className="inline-flex h-12 items-center rounded-full bg-ink px-8 text-[14px] font-light text-paper hover:bg-accent"
            >
              I did my Five
            </button>
            <p className="mx-auto mt-4 max-w-prose text-[13px] font-light italic leading-relaxed text-ink-mute">
              You can confirm now or after the timer ends. The room is here to support the action — not replace it.
            </p>
          </>
        ) : (
          <div className="text-[15px] font-light leading-relaxed text-ink">
            <p className="font-serif italic text-ink-soft">
              Recorded. See you next five.
            </p>
            <p className="mt-2 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
              we will not remind you tomorrow — you will choose to come back
            </p>
          </div>
        )}
      </div>

      {/* Tick to keep state moving */}
      <span className="sr-only">{now.toISOString()}</span>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line/50 py-2 last:border-b-0">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="text-right text-[13.5px] font-light capitalize text-ink">
        {value}
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-2 text-2xl font-thin tracking-brand text-ink md:text-3xl">
        {value}
      </p>
    </div>
  );
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h | 0;
}
