"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { engagementHeatmap } from "@/lib/organizations/analytics";
import type { OrganizationsState } from "@/lib/organizations/types";
import { merge } from "@/lib/organizations/analytics";

type Props = {
  state: OrganizationsState;
  days?: number;
};

/**
 * Quiet department × day heatmap. No alarming reds — only ink density.
 */
export function EngagementHeatmap({ state, days = 14 }: Props) {
  const data = useMemo(() => merge(state), [state]);
  const rows = useMemo(() => engagementHeatmap(data, days), [data, days]);
  const max = useMemo(() => {
    let m = 0;
    for (const r of rows) for (const c of r.cells) if (c.count > m) m = c.count;
    return Math.max(1, m);
  }, [rows]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-1">
        <thead>
          <tr>
            <th className="w-32 text-left text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
              department
            </th>
            <th className="text-left text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
              last {days} days
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.department.id}>
              <td className="pr-4 text-[13px] font-light text-ink">
                {row.department.name}
              </td>
              <td>
                <div className="flex items-center gap-1">
                  {row.cells.map((c, i) => {
                    const intensity = c.count / max;
                    return (
                      <span
                        key={c.date + i}
                        title={`${c.date} · ${c.count} actions`}
                        className={cn(
                          "block h-5 w-5 rounded-[4px]",
                          c.count === 0 ? "bg-line/70" : "bg-ink",
                        )}
                        style={c.count === 0 ? undefined : { opacity: 0.15 + intensity * 0.85 }}
                      />
                    );
                  })}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        density · not surveillance
      </p>
    </div>
  );
}
