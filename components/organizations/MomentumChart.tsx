"use client";

import { useMemo } from "react";
import {
  engagementSeries,
  type MergedOrgData,
} from "@/lib/organizations/analytics";

/**
 * A single, calm SVG line chart of organization-wide done participation
 * across the last 28 days. Hairline-only. No legend chrome.
 */
export function MomentumChart({ data }: { data: MergedOrgData }) {
  const days = 28;

  const series = useMemo(() => {
    if (data.campaigns.length === 0) return [] as number[];
    const today = new Date();
    const out: number[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      // Average participation across active campaigns for that day
      let sum = 0;
      let count = 0;
      for (const c of data.campaigns) {
        const s = engagementSeries(c, data.actions, data.org, days);
        const hit = s.find((x) => x.date === key);
        if (hit) {
          sum += hit.participationRate;
          count++;
        }
      }
      out.push(count === 0 ? 0 : sum / count);
    }
    return out;
  }, [data]);

  if (series.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
        <p className="text-[14px] font-light text-ink-soft">
          Create a campaign to begin the chart.
        </p>
      </div>
    );
  }

  const width = 640;
  const height = 160;
  const pad = 16;
  const max = Math.max(0.01, ...series);
  const xStep = (width - pad * 2) / Math.max(1, series.length - 1);
  const points = series
    .map((v, i) => {
      const x = pad + i * xStep;
      const y = height - pad - (v / max) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const areaPoints = `${pad},${height - pad} ${points} ${pad + (series.length - 1) * xStep},${height - pad}`;

  return (
    <div className="rounded-2xl border border-line bg-surface p-4 md:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          organization-wide momentum
        </p>
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          last {days} days
        </p>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-3 h-40 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label="Average daily participation across active campaigns"
      >
        <polyline
          fill="rgba(14,14,12,0.06)"
          points={areaPoints}
        />
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          points={points}
          className="text-ink"
        />
      </svg>
    </div>
  );
}
