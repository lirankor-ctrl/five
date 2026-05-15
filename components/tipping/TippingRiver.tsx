import { cn } from "@/lib/cn";
import { recentStatuses } from "@/lib/tipping/insights";
import type { CheckIn } from "@/lib/tipping/types";

/**
 * A calm 14-day strip. Warm tones only — never red.
 *
 *   within  → tall ember bar (a held day)
 *   partial → mid ember-300 bar
 *   over    → short, neutral line bar (descriptive, not punitive)
 *   no data → quiet hairline
 */
export function TippingRiver({
  checkIns,
  days = 14,
}: {
  checkIns: CheckIn[];
  days?: number;
}) {
  const series = recentStatuses(checkIns, days);
  return (
    <div className="flex items-end gap-1.5" aria-hidden="true">
      {series.map((d, i) => {
        let tone = "bg-line/70";
        let height = 6;
        if (d.status === "within") {
          tone = "bg-ember-700";
          height = 22;
        } else if (d.status === "partial") {
          tone = "bg-ember-300";
          height = 14;
        } else if (d.status === "over") {
          tone = "bg-ink/25";
          height = 8;
        }
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
