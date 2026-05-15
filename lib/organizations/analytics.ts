import {
  sampleMembers,
  sampleOrg,
  seededActions,
  seededCampaigns,
  seededReflections,
} from "@/data/organizations/sample";
import type {
  Campaign,
  CampaignAction,
  CultureSignal,
  Department,
  EngagementMetric,
  Organization,
  OrganizationsState,
  ReflectionEntry,
} from "./types";

/**
 * Combines seeded sample data with the user's overlay. The merged shape
 * is what all dashboards / pages read from — components never reach into
 * storage or sample data directly.
 */
export type MergedOrgData = {
  org: Organization;
  campaigns: Campaign[];
  actions: CampaignAction[];
  reflections: ReflectionEntry[];
};

export function merge(state: OrganizationsState): MergedOrgData {
  const seededIds = new Set(seededCampaigns.map((c) => c.id));
  // User can override / extend seeded campaigns; never duplicate ids.
  const campaigns = [
    ...seededCampaigns.filter((c) => !state.campaigns.some((u) => u.id === c.id)),
    ...state.campaigns,
  ];
  const seededActionKey = (a: CampaignAction) =>
    `${a.campaignId}|${a.actorId}|${a.date}`;
  const userKeys = new Set(state.actions.map(seededActionKey));
  const actions = [
    ...seededActions.filter((a) => !userKeys.has(seededActionKey(a))),
    ...state.actions,
  ];
  const reflections = [...seededReflections, ...state.reflections];
  // Hide seeded ids the user has explicitly deleted (not implemented today,
  // but the structure is here so a future "remove seed" command is trivial).
  void seededIds;
  return { org: sampleOrg, campaigns, actions, reflections };
}

export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function isWithinCampaign(c: Campaign, date: Date = new Date()): boolean {
  return date >= new Date(c.startedAt) && date <= new Date(c.endsAt);
}

export function campaignAudience(
  c: Campaign,
  org: Organization,
): { memberIds: string[]; size: number } {
  const inDept = (deptId: string) =>
    c.departmentIds.length === 0 || c.departmentIds.includes(deptId);
  const inRole = (role: string) =>
    !c.targetRole || c.targetRole === role;
  const members = org.members.filter(
    (m) => inDept(m.departmentId) && inRole(m.role),
  );
  return { memberIds: members.map((m) => m.id), size: members.length };
}

/** Daily participation across the campaign's expected audience. */
export function engagementSeries(
  c: Campaign,
  actions: CampaignAction[],
  org: Organization,
  days = 14,
): EngagementMetric[] {
  const { memberIds, size } = campaignAudience(c, org);
  const memberSet = new Set(memberIds);
  const out: EngagementMetric[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = todayKey(d);
    const day = actions.filter(
      (a) => a.campaignId === c.id && a.date === key && a.status === "done" && memberSet.has(a.actorId),
    );
    out.push({
      campaignId: c.id,
      date: key,
      actionsCount: day.length,
      participationRate: size === 0 ? 0 : Math.min(1, day.length / size),
    });
  }
  return out;
}

export function totalParticipation14d(
  c: Campaign,
  actions: CampaignAction[],
  org: Organization,
): number {
  const series = engagementSeries(c, actions, org, 14);
  if (series.length === 0) return 0;
  return series.reduce((a, s) => a + s.participationRate, 0) / series.length;
}

export function memberMomentum(
  data: MergedOrgData,
): Array<{ memberId: string; streak: number; consistency14d: number }> {
  const result: Array<{ memberId: string; streak: number; consistency14d: number }> = [];
  for (const m of data.org.members) {
    const mine = data.actions.filter((a) => a.actorId === m.id);
    if (mine.length === 0) {
      result.push({ memberId: m.id, streak: 0, consistency14d: 0 });
      continue;
    }
    // Streak: contiguous days with at least one "done"
    const doneByDate = new Map<string, boolean>();
    for (const a of mine) {
      if (a.status === "done") doneByDate.set(a.date, true);
    }
    let streak = 0;
    const d = new Date();
    if (!doneByDate.has(todayKey(d))) d.setDate(d.getDate() - 1);
    while (doneByDate.has(todayKey(d))) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    // Consistency = unique done-days in the last 14d / 14
    const today = new Date();
    let doneDays = 0;
    for (let i = 0; i < 14; i++) {
      const dd = new Date(today);
      dd.setDate(dd.getDate() - i);
      if (doneByDate.has(todayKey(dd))) doneDays++;
    }
    result.push({ memberId: m.id, streak, consistency14d: doneDays / 14 });
  }
  return result;
}

/** Average per-department done-rate over the last 14 days. */
export function departmentPulse(
  data: MergedOrgData,
): Array<{ department: Department; pulse: number; size: number }> {
  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() - 14);
  return data.org.departments.map((dept) => {
    const members = data.org.members.filter((m) => m.departmentId === dept.id);
    const memberIds = new Set(members.map((m) => m.id));
    const inWindow = data.actions.filter((a) => {
      if (!memberIds.has(a.actorId)) return false;
      const ad = new Date(a.date);
      return ad >= cutoff && ad <= today;
    });
    if (inWindow.length === 0) {
      return { department: dept, pulse: 0, size: members.length };
    }
    const doneCount = inWindow.filter((a) => a.status === "done").length;
    return {
      department: dept,
      pulse: doneCount / inWindow.length,
      size: members.length,
    };
  });
}

/** A heat row of done-counts per day per department. */
export function engagementHeatmap(
  data: MergedOrgData,
  days = 14,
): Array<{ department: Department; cells: Array<{ date: string; count: number }> }> {
  const today = new Date();
  return data.org.departments.map((dept) => {
    const memberIds = new Set(
      data.org.members.filter((m) => m.departmentId === dept.id).map((m) => m.id),
    );
    const cells: Array<{ date: string; count: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      const count = data.actions.filter(
        (a) => memberIds.has(a.actorId) && a.date === key && a.status === "done",
      ).length;
      cells.push({ date: key, count });
    }
    return { department: dept, cells };
  });
}

export function cultureSignals(
  data: MergedOrgData,
): CultureSignal[] {
  function rateForType(types: Campaign["type"][]): number {
    const campaignIds = new Set(
      data.campaigns.filter((c) => types.includes(c.type)).map((c) => c.id),
    );
    if (campaignIds.size === 0) return 0;
    const window = 14;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - window);
    const inWindow = data.actions.filter((a) => {
      if (!campaignIds.has(a.campaignId)) return false;
      return new Date(a.date) >= cutoff;
    });
    if (inWindow.length === 0) return 0;
    const done = inWindow.filter((a) => a.status === "done").length;
    return done / inWindow.length;
  }
  function trend(types: Campaign["type"][]): "up" | "down" | "steady" {
    const campaignIds = new Set(
      data.campaigns.filter((c) => types.includes(c.type)).map((c) => c.id),
    );
    if (campaignIds.size === 0) return "steady";
    const today = new Date();
    const earlierStart = new Date(today);
    earlierStart.setDate(earlierStart.getDate() - 14);
    const earlierEnd = new Date(today);
    earlierEnd.setDate(earlierEnd.getDate() - 8);
    const recentStart = new Date(today);
    recentStart.setDate(recentStart.getDate() - 7);
    function rate(from: Date, to: Date) {
      const within = data.actions.filter((a) => {
        if (!campaignIds.has(a.campaignId)) return false;
        const ad = new Date(a.date);
        return ad >= from && ad <= to;
      });
      if (within.length === 0) return null;
      const done = within.filter((a) => a.status === "done").length;
      return done / within.length;
    }
    const earlier = rate(earlierStart, earlierEnd);
    const recent = rate(recentStart, today);
    if (earlier === null || recent === null) return "steady";
    if (recent > earlier + 0.05) return "up";
    if (recent < earlier - 0.05) return "down";
    return "steady";
  }
  return [
    { id: "engagement", label: "Engagement", value: rateForType(["empowerment"]), trend: trend(["empowerment"]) },
    { id: "appreciation", label: "Appreciation", value: rateForType(["appreciation"]), trend: trend(["appreciation"]) },
    { id: "reflection", label: "Reflection", value: rateForType(["reflection"]), trend: trend(["reflection"]) },
    { id: "innovation", label: "Innovation", value: rateForType(["innovation"]), trend: trend(["innovation"]) },
    { id: "learning", label: "Learning", value: rateForType(["learning"]), trend: trend(["learning"]) },
    { id: "customer", label: "Customer", value: rateForType(["lost-customer"]), trend: trend(["lost-customer"]) },
  ];
}

export { sampleMembers };
