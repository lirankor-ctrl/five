import { getCampaignType } from "@/data/organizations/campaign-types";
import {
  departmentPulse,
  engagementSeries,
  type MergedOrgData,
} from "./analytics";
import type { OrganizationalInsight } from "./types";

/**
 * Conservative, observational insights only.
 *
 * Never call this "AI coaching" in the UI today. These rules are
 * shaped so the same call site can be replaced with a real model later.
 * Thresholds favour silence over noise.
 */
export function generateOrganizationalInsights(
  data: MergedOrgData,
): OrganizationalInsight[] {
  const out: OrganizationalInsight[] = [];

  if (data.actions.length < 12) {
    out.push({
      id: "early",
      kind: "early-momentum",
      body:
        "Still early. After a couple of weeks of campaign action, real patterns will surface here.",
    });
    return out;
  }

  // Per-campaign momentum: compare last 7 days vs prior 7
  for (const c of data.campaigns) {
    if (!c.active) continue;
    const series = engagementSeries(c, data.actions, data.org, 14);
    if (series.length < 14) continue;
    const earlier = series.slice(0, 7).reduce((a, s) => a + s.participationRate, 0) / 7;
    const recent = series.slice(7).reduce((a, s) => a + s.participationRate, 0) / 7;
    const delta = recent - earlier;
    if (delta > 0.1) {
      out.push({
        id: `mom-up-${c.id}`,
        kind: "momentum-trend",
        body: `“${c.name}” has more weight in the last week than the week before.`,
        campaignId: c.id,
      });
    } else if (delta < -0.1) {
      out.push({
        id: `mom-dn-${c.id}`,
        kind: "momentum-trend",
        body: `“${c.name}” is quieter than it was last week. Worth a look.`,
        campaignId: c.id,
      });
    }
  }

  // Department effectiveness
  const pulses = departmentPulse(data)
    .filter((p) => p.size >= 2)
    .sort((a, b) => b.pulse - a.pulse);
  if (pulses.length >= 3) {
    const top = pulses[0];
    const bottom = pulses[pulses.length - 1];
    if (top.pulse - bottom.pulse > 0.15) {
      out.push({
        id: `dept-top-${top.department.id}`,
        kind: "high-performing-team",
        body: `${top.department.name} is showing up most consistently across active campaigns.`,
        departmentId: top.department.id,
      });
    }
    if (bottom.pulse < 0.4 && bottom.size >= 3) {
      out.push({
        id: `dept-low-${bottom.department.id}`,
        kind: "burnout-risk",
        body: `${bottom.department.name} has had a quieter two weeks. Could be capacity — worth checking, not flagging.`,
        departmentId: bottom.department.id,
      });
    }
  }

  // Campaign type effectiveness: which campaign type has the highest done-rate
  const byType = new Map<string, { done: number; total: number }>();
  for (const a of data.actions) {
    const c = data.campaigns.find((cc) => cc.id === a.campaignId);
    if (!c) continue;
    const bucket = byType.get(c.type) ?? { done: 0, total: 0 };
    bucket.total++;
    if (a.status === "done") bucket.done++;
    byType.set(c.type, bucket);
  }
  let bestType: string | null = null;
  let bestRate = 0;
  for (const [t, v] of byType) {
    if (v.total < 6) continue;
    const r = v.done / v.total;
    if (r > bestRate) {
      bestRate = r;
      bestType = t;
    }
  }
  if (bestType && bestRate >= 0.7) {
    const meta = getCampaignType(bestType as never);
    out.push({
      id: `eff-${bestType}`,
      kind: "campaign-effectiveness",
      body: `${meta.label} campaigns are landing — your highest done-rate sits there.`,
    });
  }

  // Behaviour correlation — reflection tags
  const tagCounts = new Map<string, number>();
  for (const r of data.reflections) {
    for (const t of r.tags ?? []) {
      tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }
  }
  if (tagCounts.size > 0) {
    let topTag = "";
    let topCount = 0;
    for (const [k, v] of tagCounts) {
      if (v > topCount) {
        topCount = v;
        topTag = k;
      }
    }
    if (topCount >= 3) {
      out.push({
        id: `corr-${topTag}`,
        kind: "behavior-correlation",
        body: `“${topTag}” shows up most often in reflections — a theme worth naming.`,
      });
    }
  }

  if (out.length === 0) {
    out.push({
      id: "steady",
      kind: "consistency",
      body: "A quiet, consistent rhythm across active campaigns. Nothing to change.",
    });
  }

  return out;
}
