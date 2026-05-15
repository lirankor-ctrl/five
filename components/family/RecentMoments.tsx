import Link from "next/link";
import { cn } from "@/lib/cn";
import { getWorld } from "@/data/family/worlds";
import { dayMonthLabel } from "@/lib/family/format";
import type { FamilySession } from "@/lib/family/types";

/**
 * A short list of the most recent moments. Always renders done-only items
 * and never shows missed days — that lives elsewhere if at all.
 */
export function RecentMoments({
  sessions,
  limit = 6,
}: {
  sessions: FamilySession[];
  limit?: number;
}) {
  const recent = sessions
    .filter((s) => s.status === "done")
    .slice()
    .sort((a, b) => (a.reportedAt < b.reportedAt ? 1 : -1))
    .slice(0, limit);

  if (recent.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6">
        <p className="text-[14px] font-light leading-relaxed text-ink-soft">
          No moments yet — that is also a start. The first one will appear here.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line border-y border-line">
      {recent.map((s) => {
        const world = getWorld(s.world);
        return (
          <li key={s.id} className="flex items-start gap-4 py-4">
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-hearth-200 bg-hearth-50 text-base font-light text-hearth-700",
              )}
            >
              {world?.glyph ?? "·"}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-light text-ink">
                <span className="text-ink-soft">{world?.label ?? "Five"}</span>
                {s.note && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span className="font-serif italic text-ink-soft">
                      “{s.note}”
                    </span>
                  </>
                )}
              </p>
              <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {dayMonthLabel(s.date)}
                {s.durationMinutes && (
                  <>
                    <span aria-hidden="true"> · </span>
                    {s.durationMinutes} min
                  </>
                )}
                {s.feelings && s.feelings.length > 0 && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>{s.feelings.join(" · ")}</span>
                  </>
                )}
              </p>
            </div>
          </li>
        );
      })}
      <li className="pt-3 text-right">
        <Link
          href="/cubes/family/journal"
          className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          See the full journal →
        </Link>
      </li>
    </ul>
  );
}
