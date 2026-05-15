/**
 * Domain types for the five project cube.
 *
 * Designed to support real personal projects — books, startups,
 * relocations, career changes — without becoming a task manager.
 * Vocabulary is intentional: "five action" (not "task"),
 * "stuck → reduce" (not "skip"), "pivot" (never "fail").
 */

export type ProjectType =
  | "writing"
  | "startup"
  | "business"
  | "relocation"
  | "research"
  | "product"
  | "career-change"
  | "learning"
  | "creative"
  | "financial"
  | "family-project"
  | "health";

export type ProjectStage =
  | "idea"
  | "starting"
  | "in-progress"
  | "stuck"
  | "near-completion"
  | "failed-before"
  | "restarting"
  | "rescued";

export type Frequency =
  | "daily"
  | "3-per-week"
  | "weekly"
  | "fridays"
  | "evenings"
  | "mornings"
  | "flexible";

export type GuidanceStyle =
  | "gentle"
  | "strategic"
  | "creative"
  | "practical"
  | "emotional"
  | "minimalist"
  | "push";

export type AISupportLevel = "none" | "light" | "active" | "companion";

export type FiveProject = {
  id: string;
  name: string;
  type: ProjectType;
  bigGoal: string;
  whyItMatters: string;
  frequency: Frequency;
  durationMinutes: number;
  stage: ProjectStage;
  guidanceStyle: GuidanceStyle;
  aiSupportLevel: AISupportLevel;
  createdAt: string;
  archivedAt?: string;
  /** Optional template the project was created from. */
  templateId?: string;
  /** Optional active sprint. */
  sprint?: ProjectSprint;
  /** Project rescue context, if user came in via the rescue flow. */
  rescue?: ProjectRescueContext;
};

export type ProjectMilestone = {
  id: string;
  projectId: string;
  ordinal: number;
  title: string;
  body?: string;
  doneAt?: string;
};

export type ActionStatus = "pending" | "done" | "skipped";

export type FiveAction = {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  /** When this is a reduced version of a larger step, store the original. */
  reducedFrom?: string;
  status: ActionStatus;
  /** Scheduled day, YYYY-MM-DD; "today" if not specified. */
  scheduledFor?: string;
  doneAt?: string;
  durationMinutes?: number;
  createdAt: string;
};

export type ReflectionFeeling =
  | "clear"
  | "stuck"
  | "energised"
  | "tired"
  | "excited"
  | "doubt";

export type ProjectReflection = {
  id: string;
  projectId: string;
  actionId?: string;
  body: string;
  feeling?: ReflectionFeeling;
  createdAt: string;
};

export type ProjectPivot = {
  id: string;
  projectId: string;
  fromName: string;
  toName: string;
  reason: string;
  pivotedAt: string;
};

export type ProjectSprint = {
  goal: string;
  durationDays: number;
  startedAt: string;
  endedAt?: string;
};

export type ProjectRescueContext = {
  whenItStopped: string;
  whyItStopped: string;
  whatStillExists: string;
  doesItStillMatter: "yes" | "maybe" | "not-sure";
  revivalDefinition: string;
};

export type TimelineEvent =
  | { id: string; kind: "created"; at: string }
  | { id: string; kind: "milestone-done"; at: string; milestoneTitle: string }
  | { id: string; kind: "action-done"; at: string; actionTitle: string }
  | { id: string; kind: "reflection"; at: string; body: string }
  | { id: string; kind: "stuck-reduced"; at: string; from: string; to: string }
  | { id: string; kind: "pivot"; at: string; from: string; to: string; reason: string }
  | { id: string; kind: "rescue"; at: string }
  | { id: string; kind: "sprint-started"; at: string; goal: string; days: number }
  | { id: string; kind: "sprint-ended"; at: string };

export type ProjectInsight = {
  id: string;
  kind:
    | "early-momentum"
    | "best-time-of-day"
    | "reduction-helps"
    | "consistency"
    | "stuck-pattern"
    | "near-pivot"
    | "gentle-return";
  body: string;
};

export type ProjectsState = {
  projects: FiveProject[];
  milestones: ProjectMilestone[];
  actions: FiveAction[];
  reflections: ProjectReflection[];
  pivots: ProjectPivot[];
  version: 1;
};
