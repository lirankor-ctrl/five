import type {
  Campaign,
  CampaignAction,
  Member,
  Organization,
  ReflectionEntry,
} from "@/lib/organizations/types";

/**
 * A believable mid-size sample organization, used to make every dashboard
 * meaningful from the first visit. The user can add their own campaigns
 * and actions on top of this — seeded items live in this module, user
 * additions live in localStorage.
 */

export const sampleOrg: Organization = {
  id: "org-northstar",
  name: "Northstar",
  tagline: "A 140-person product company. The kind your friends work at.",
  departments: [
    { id: "engineering", name: "Engineering", tone: "neutral" },
    { id: "design", name: "Design", tone: "neutral" },
    { id: "customer", name: "Customer", tone: "warm" },
    { id: "ops", name: "Operations", tone: "neutral" },
    { id: "people", name: "People", tone: "cool" },
    { id: "leadership", name: "Leadership", tone: "warm" },
  ],
  members: [
    // Leadership
    { id: "m-anna", name: "Anna H.", role: "admin", departmentId: "leadership" },
    { id: "m-marco", name: "Marco V.", role: "admin", departmentId: "leadership" },
    // Engineering
    { id: "m-elena", name: "Elena R.", role: "manager", departmentId: "engineering" },
    { id: "m-david", name: "David K.", role: "employee", departmentId: "engineering" },
    { id: "m-sara", name: "Sara M.", role: "employee", departmentId: "engineering" },
    { id: "m-rafa", name: "Rafa P.", role: "employee", departmentId: "engineering" },
    { id: "m-noah", name: "Noah T.", role: "employee", departmentId: "engineering" },
    // Design
    { id: "m-iris", name: "Iris L.", role: "manager", departmentId: "design" },
    { id: "m-jonas", name: "Jonas A.", role: "employee", departmentId: "design" },
    { id: "m-kim", name: "Kim O.", role: "employee", departmentId: "design" },
    // Customer
    { id: "m-tom", name: "Tom F.", role: "manager", departmentId: "customer" },
    { id: "m-mei", name: "Mei W.", role: "employee", departmentId: "customer" },
    { id: "m-ali", name: "Ali R.", role: "employee", departmentId: "customer" },
    { id: "m-lena", name: "Lena G.", role: "employee", departmentId: "customer" },
    // Operations
    { id: "m-sam", name: "Sam B.", role: "manager", departmentId: "ops" },
    { id: "m-priya", name: "Priya S.", role: "employee", departmentId: "ops" },
    // People
    { id: "m-julia", name: "Julia N.", role: "manager", departmentId: "people" },
    { id: "m-rita", name: "Rita C.", role: "employee", departmentId: "people" },
  ],
};

/** Convenience map for lookups in components. */
export const sampleMembers: Record<string, Member> = Object.fromEntries(
  sampleOrg.members.map((m) => [m.id, m]),
);

const today = new Date();
function dayKey(offsetDays: number): string {
  const d = new Date(today);
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}
function isoDaysAgo(offsetDays: number, hour = 10): string {
  const d = new Date(today);
  d.setDate(d.getDate() - offsetDays);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

export const seededCampaigns: Campaign[] = [
  {
    id: "c-empowerment-q",
    type: "empowerment",
    name: "This quarter, five minutes of recognition",
    goal: "Improve manager-to-report trust through small, named recognition.",
    kpi: "Manager check-in completion + engagement score",
    cadence: "weekly",
    durationDays: 60,
    startedAt: isoDaysAgo(28),
    endsAt: isoDaysAgo(-32),
    departmentIds: [],
    targetRole: "manager",
    active: true,
    createdAt: isoDaysAgo(30),
  },
  {
    id: "c-appreciation-month",
    type: "appreciation",
    name: "Peer thanks · month one",
    goal: "Make daily peer recognition normal across teams.",
    kpi: "Number of specific peer thanks per week",
    cadence: "daily",
    durationDays: 30,
    startedAt: isoDaysAgo(14),
    endsAt: isoDaysAgo(-16),
    departmentIds: [],
    active: true,
    createdAt: isoDaysAgo(15),
  },
  {
    id: "c-reflection-team",
    type: "reflection",
    name: "Friday five — team reflection",
    goal: "Build a calmer team rhythm by ending each week with a short reflection.",
    kpi: "Weekly reflection participation rate",
    cadence: "weekly",
    durationDays: 90,
    startedAt: isoDaysAgo(21),
    endsAt: isoDaysAgo(-69),
    departmentIds: ["engineering", "design", "customer"],
    active: true,
    createdAt: isoDaysAgo(22),
  },
  {
    id: "c-lost-customer-spring",
    type: "lost-customer",
    name: "Reconnect — quiet accounts",
    goal: "Reach the customers who have been treated as a row in a sheet for too long.",
    kpi: "Number of real, named conversations per week",
    cadence: "daily",
    durationDays: 21,
    startedAt: isoDaysAgo(10),
    endsAt: isoDaysAgo(-11),
    departmentIds: ["customer"],
    active: true,
    createdAt: isoDaysAgo(11),
  },
];

/**
 * Build a believable trail of seeded action history.
 *
 * Distribution favours managers for empowerment, customer team for
 * lost-customer, and broad participation for appreciation/reflection.
 * Statuses skew positive but include realistic gaps.
 */
function makeSeed(): { actions: CampaignAction[]; reflections: ReflectionEntry[] } {
  const actions: CampaignAction[] = [];
  const reflections: ReflectionEntry[] = [];

  function add(
    id: string,
    campaignId: string,
    actorId: string,
    daysAgo: number,
    status: CampaignAction["status"],
    impact?: CampaignAction["perceivedImpact"],
    minutes = 5,
  ) {
    const actor = sampleMembers[actorId];
    if (!actor) return;
    actions.push({
      id,
      campaignId,
      actorId,
      actorName: actor.name,
      date: dayKey(daysAgo),
      status,
      durationMinutes: minutes,
      perceivedImpact: impact,
      reportedAt: isoDaysAgo(daysAgo, 17),
    });
  }

  function reflect(actionId: string, campaignId: string, actorId: string, text: string, tags?: string[], daysAgo = 0) {
    reflections.push({
      id: `r-${actionId}`,
      actionId,
      campaignId,
      actorId,
      text,
      tags,
      createdAt: isoDaysAgo(daysAgo, 17),
    });
  }

  // Empowerment — managers, weekly cadence over 4 weeks
  const managers = ["m-elena", "m-iris", "m-tom", "m-sam", "m-julia"];
  let i = 0;
  for (const offset of [27, 20, 13, 6]) {
    for (const m of managers) {
      i++;
      const status: CampaignAction["status"] = i % 11 === 0 ? "not-done" : "done";
      const impact: CampaignAction["perceivedImpact"] = i % 3 === 0 ? "high" : i % 2 === 0 ? "medium" : "low";
      add(`a-emp-${i}`, "c-empowerment-q", m, offset, status, status === "done" ? impact : undefined);
    }
  }
  reflect(
    "a-emp-3",
    "c-empowerment-q",
    "m-elena",
    "Recognition landed unexpectedly hard. They didn’t realise the migration work was visible.",
    ["recognition", "engineering"],
    13,
  );
  reflect(
    "a-emp-10",
    "c-empowerment-q",
    "m-tom",
    "Honest 1:1 turned into a 20-minute conversation about workload. Worth the time.",
    ["1:1", "burnout"],
    20,
  );

  // Appreciation — daily cadence, broad participation, last 14 days
  const allEmployees = sampleOrg.members.filter((m) => m.role !== "admin");
  let aid = 0;
  for (let offset = 13; offset >= 0; offset--) {
    // 4-9 people per day, weighted positive
    const count = 4 + ((offset * 3) % 6);
    for (let k = 0; k < count; k++) {
      aid++;
      const member = allEmployees[(offset + k) % allEmployees.length];
      const status: CampaignAction["status"] = aid % 14 === 0 ? "not-done" : "done";
      const impact: CampaignAction["perceivedImpact"] = aid % 5 === 0 ? "high" : aid % 3 === 0 ? "medium" : "low";
      add(`a-app-${aid}`, "c-appreciation-month", member.id, offset, status, status === "done" ? impact : undefined);
    }
  }
  reflect(
    "a-app-3",
    "c-appreciation-month",
    "m-mei",
    "Said thanks for a piece of work that almost shipped silently. Felt good to name it.",
    ["customer", "recognition"],
    13,
  );

  // Reflection — weekly cadence, last 3 weeks, partial participation
  let rid = 0;
  for (const offset of [21, 14, 7]) {
    for (const m of allEmployees) {
      rid++;
      // ~70% participation
      if (rid % 10 < 3) continue;
      const impact: CampaignAction["perceivedImpact"] = rid % 4 === 0 ? "high" : rid % 2 === 0 ? "medium" : "low";
      add(`a-ref-${rid}`, "c-reflection-team", m.id, offset, "done", impact);
    }
  }
  reflect(
    "a-ref-5",
    "c-reflection-team",
    "m-jonas",
    "Realised we keep solving the same review problem. We should name it and stop pretending it’s new.",
    ["process", "design"],
    14,
  );
  reflect(
    "a-ref-22",
    "c-reflection-team",
    "m-david",
    "What we kept: pair-on-bugs Fridays. What we learned: rollbacks aren’t failures.",
    ["engineering", "learning"],
    7,
  );

  // Lost customer — customer team only, last 10 days, ~60% done
  const customerTeam = sampleOrg.members.filter((m) => m.departmentId === "customer");
  let lid = 0;
  for (let offset = 9; offset >= 0; offset--) {
    for (const m of customerTeam) {
      lid++;
      const status: CampaignAction["status"] = lid % 7 === 0 ? "not-done" : "done";
      const impact: CampaignAction["perceivedImpact"] = lid % 3 === 0 ? "high" : "medium";
      add(`a-lc-${lid}`, "c-lost-customer-spring", m.id, offset, status, status === "done" ? impact : undefined);
    }
  }
  reflect(
    "a-lc-4",
    "c-lost-customer-spring",
    "m-lena",
    "Called a dormant account. They thought we’d shut down. Got a ten-minute conversation that mattered.",
    ["customer", "outreach"],
    8,
  );
  reflect(
    "a-lc-18",
    "c-lost-customer-spring",
    "m-ali",
    "Found a real friction in the onboarding flow. Filing it now.",
    ["friction", "onboarding"],
    3,
  );

  return { actions, reflections };
}

export const { actions: seededActions, reflections: seededReflections } = makeSeed();
