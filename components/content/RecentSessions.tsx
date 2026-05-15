"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { contentItems } from "@/data/content/items";
import { TYPE_LABEL, timeAgo } from "@/lib/content/format";
import type { ContentSession } from "@/lib/content/types";

type Props = {
  sessions: ContentSession[];
  onRepeat: (contentItemId: string) => void;
};

export function RecentSessions({ sessions, onRepeat }: Props) {
  const items = useMemo(() => new Map(contentItems.map((it) => [it.id, it])), []);
  const recent = useMemo(
    () =>
      sessions
        .slice()
        .sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1))
        .slice(0, 8),
    [sessions],
  );

  if (recent.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
        <p className="text-[14px] font-light text-ink-soft">
          Your recent five-minute sessions will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {recent.map((s) => {
        const item = items.get(s.contentItemId);
        if (!item) return null;
        const tone = sessionTone(s);
        return (
          <li key={s.id} className="flex items-center gap-4 py-4">
            <span
              aria-hidden="true"
              className={cn(
                "inline-block h-2 w-2 shrink-0 rounded-full",
                tone,
              )}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-light text-ink">
                {item.title}
              </p>
              <p className="mt-1 text-[12px] font-light uppercase tracking-[0.2em] text-ink-mute">
                {TYPE_LABEL[item.contentType]}
                <span aria-hidden="true"> · </span>
                {s.actualMinutes ?? item.durationMinutes} min
                <span aria-hidden="true"> · </span>
                {s.status === "done"
                  ? "done"
                  : s.status === "not-done"
                    ? "not today"
                    : "open"}
                <span aria-hidden="true"> · </span>
                {timeAgo(s.completedAt ?? s.startedAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRepeat(item.id)}
              className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
            >
              Again →
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function sessionTone(s: ContentSession): string {
  if (s.status === "done") return "bg-ink";
  if (s.status === "not-done") return "bg-line";
  return "bg-ink/30";
}
