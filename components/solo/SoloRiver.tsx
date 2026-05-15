import { cn } from "@/lib/cn";
import { recentDays } from "@/lib/solo/insights";
import type { SoloEntry } from "@/lib/solo/types";

const STATUS_TONE: Record<
  NonNullable<ReturnType<typeof recentDays>[number]["status"]>,
  string
> = {
  done: "bg-ink",
  partial: "bg-ink/45",
  missed: "bg-line",
};

/**
 * A 14-day quiet strip of the user's reports. Not a heatmap, not a streak
 * graph — just a soft rhythm.
 */
export function SoloRiver({
  entries,
  days = 14,
}: {
  entries: SoloEntry[];
  days?: number;
}) {
  const series = recentDays(entries, days);
  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {series.map((d, i) => {
        const tone = d.status ? STATUS_TONE[d.status] : "bg-line/70";
        const height = d.status === "done" ? 22 : d.status === "partial" ? 14 : 8;
        return (
          <span
            key={d.date + i}
            className={cn("block w-2 rounded-full", tone)}
            style={{ height }}
            title={`${d.date} · ${d.status ?? "—"}`}
          />
        );
      })}
    </div>
  );
}
