"use client";

import Link from "next/link";
import { cn } from "@/lib/cn";
import { getCategory } from "@/data/live/categories";
import { getHost } from "@/data/live/hosts";
import {
  CAMERA_LABEL,
  CATEGORY_LABEL,
  INTERACTION_LABEL,
  relativeMinutes,
  shortDay,
  shortTime,
} from "@/lib/live/format";
import { recurrenceLabel, statusFor } from "@/lib/live/schedule";
import type { LiveEvent } from "@/lib/live/types";
import { LiveDot } from "./LiveDot";

type Props = {
  event: LiveEvent;
  saved: boolean;
  onToggleSaved: () => void;
};

export function EventCard({ event, saved, onToggleSaved }: Props) {
  const status = statusFor(event);
  const host = getHost(event.hostId);
  const category = getCategory(event.category);
  const isLive = status.kind === "live";
  const startsAt =
    status.kind === "live"
      ? status.startsAt
      : status.startsAt;

  let metaLine = recurrenceLabel(event.recurrence);
  if (status.kind === "live") {
    metaLine = `Live now · ${relativeMinutes(status.secondsLeft)} left`;
  } else if (status.kind === "starting-soon") {
    metaLine = `Starts in ${relativeMinutes(status.secondsUntil)}`;
  } else if (status.kind === "later-today") {
    metaLine = `Today · ${shortTime(startsAt)}`;
  } else if (status.kind === "later-this-week") {
    metaLine = `${shortDay(startsAt)} · ${shortTime(startsAt)}`;
  }

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-surface p-6 transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:shadow-soft md:p-7",
        isLive
          ? "border-ink/40 ring-1 ring-ink/15"
          : "border-line hover:border-ink/30",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          <span aria-hidden="true" className="text-ink">
            {category.glyph}
          </span>
          <span className="text-ink">{CATEGORY_LABEL[event.category]}</span>
          <span aria-hidden="true">·</span>
          <span>{event.durationMinutes} min</span>
        </div>
        {isLive ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.22em] text-paper">
            <LiveDot />
            live
          </span>
        ) : event.access !== "public" ? (
          <span className="inline-flex items-center rounded-full border border-line bg-paper px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em] text-ink-mute">
            {event.access}
          </span>
        ) : null}
      </div>

      <h3 className="mt-4 text-lg font-light leading-snug tracking-brand text-ink md:text-xl">
        <Link
          href={`/cubes/live-event/event/${event.id}`}
          className="hover:underline underline-offset-4"
        >
          {event.name}
        </Link>
      </h3>
      {event.hook && (
        <p className="mt-1 text-[14px] font-light italic leading-relaxed text-ink-soft">
          {event.hook}
        </p>
      )}

      <p className="mt-4 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {metaLine}
      </p>

      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-light uppercase tracking-[0.18em] text-ink-mute">
        <span className="rounded-full border border-line px-2 py-0.5">
          {INTERACTION_LABEL[event.interaction]}
        </span>
        <span className="rounded-full border border-line px-2 py-0.5">
          {CAMERA_LABEL[event.cameraMode]}
        </span>
        {event.recorded ? (
          <span className="rounded-full border border-line px-2 py-0.5">
            recorded
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-end justify-between gap-3 pt-6 text-[12px] font-light text-ink-mute">
        <span>
          hosted by{" "}
          <span className="text-ink-soft">
            {host?.name ?? "—"}
          </span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleSaved}
            aria-label={saved ? "Remove from saved" : "Save"}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-full border text-[14px] transition-colors",
              saved
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
            )}
          >
            <span aria-hidden="true">✦</span>
          </button>
          <Link
            href={`/cubes/live-event/event/${event.id}`}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-light transition-colors",
              isLive
                ? "bg-ink text-paper hover:bg-accent"
                : "border border-line text-ink hover:border-ink/40",
            )}
          >
            {isLive ? "Join" : "Open"}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      <div className="mt-5 border-t border-line/70 pt-4 text-[11px] font-light uppercase tracking-[0.2em] text-ink-mute">
        {event.community.daysActive} days active
        <span aria-hidden="true"> · </span>
        {event.community.weeklyCompletions} this week
      </div>
    </article>
  );
}
