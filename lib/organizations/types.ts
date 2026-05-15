/**
 * Domain types for the five organizations cube.
 *
 * Designed for enterprise SaaS shape: multi-organization, departments,
 * roles, campaigns, actions, reflections, engagement metrics, and a
 * forward-looking organizational-insight layer. In-repo today via
 * localStorage; the same shapes work behind a Postgres / Supabase API.
 */

export type Role = "admin" | "manager" | "employee";

export type CampaignType =
  | "empowerment"
  | "lost-customer"
  | "innovation"
  | "learning"
  | "appreciation"
  | "reflection";

export type CampaignCadence = "daily" | "weekly";

export type Member = {
  id: string;
  name: string;
  role: Role;
  departmentId: string;
};

export type Department = {
  id: string;
  name: string;
  /** Display tone — drives a single accent dot in lists. */
  tone?: "neutral" | "warm" | "cool";
};

export type Organization = {
  id: string;
  name: string;
  tagline: string;
  departments: Department[];
  members: Member[];
};

export type Campaign = {
  id: string;
  type: CampaignType;
  name: string;
  goal: string;
  /** Single-line, human-readable success indicator. */
  kpi: string;
  cadence: CampaignCadence;
  durationDays: number;
  startedAt: string; // ISO
  endsAt: string; // ISO
  departmentIds: string[]; // [] = whole organization
  targetRole?: Role; // optional narrowing (e.g. managers only)
  active: boolean;
  createdAt: string;
};

export type ActionStatus = "done" | "not-done";
export type PerceivedImpact = "low" | "medium" | "high";

export type CampaignAction = {
  id: string;
  campaignId: string;
  actorId: string;
  actorName: string;
  /** Local date the action happened. */
  date: string; // YYYY-MM-DD
  status: ActionStatus;
  durationMinutes?: number;
  perceivedImpact?: PerceivedImpact;
  reportedAt: string; // ISO
};

export type ReflectionEntry = {
  id: string;
  actionId: string;
  campaignId: string;
  actorId: string;
  text: string;
  /** Optional human tags — “customer”, “friction”, “learning”, etc. */
  tags?: string[];
  createdAt: string;
};

export type EngagementMetric = {
  campaignId: string;
  date: string; // YYYY-MM-DD
  participationRate: number; // 0..1
  actionsCount: number;
};

export type OrganizationalInsight = {
  id: string;
  kind:
    | "consistency"
    | "high-performing-team"
    | "burnout-risk"
    | "campaign-effectiveness"
    | "behavior-correlation"
    | "momentum-trend"
    | "early-momentum";
  body: string;
  campaignId?: string;
  departmentId?: string;
};

export type EmployeeMomentum = {
  memberId: string;
  streakDays: number;
  consistency14d: number; // 0..1
};

export type CultureSignal = {
  id: "engagement" | "appreciation" | "reflection" | "innovation" | "learning" | "customer";
  label: string;
  /** Score 0..1, calm-coloured display. */
  value: number;
  trend: "up" | "down" | "steady";
};

/** Persisted local state — sits on top of the seeded sample organization. */
export type OrganizationsState = {
  currentRole: Role;
  currentOrgId: string;
  /** Member id playing the "you" role on this device. */
  currentMemberId: string;
  /** User-created campaigns. Seeded campaigns live in data/organizations. */
  campaigns: Campaign[];
  /** All logged actions (user-logged + persisted seeds the user has touched). */
  actions: CampaignAction[];
  /** All reflections written through the UI. */
  reflections: ReflectionEntry[];
  version: 1;
};
