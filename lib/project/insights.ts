import type {
  FiveAction,
  FiveProject,
  ProjectInsight,
  ProjectReflection,
  ProjectsState,
} from "./types";

/**
 * Calm, project-shaped observations. Never punitive. Never "you fell
 * behind". Thresholds favour silence over speculation.
 */
export function generateProjectInsights(
  project: FiveProject,
  actions: FiveAction[],
  reflections: ProjectReflection[],
): ProjectInsight[] {
  const out: ProjectInsight[] = [];
  const done = actions.filter((a) => a.status === "done");

  if (done.length < 3) {
    out.push({
      id: "early",
      kind: "early-momentum",
      body:
        "Still early. A few more five-minute returns and patterns will start to surface here.",
    });
    return out;
  }

  // Best time-of-day
  const hourBuckets = new Map<string, number>();
  for (const a of done) {
    if (!a.doneAt) continue;
    const h = new Date(a.doneAt).getHours();
    const label = h < 11 ? "morning" : h < 17 ? "afternoon" : "evening";
    hourBuckets.set(label, (hourBuckets.get(label) ?? 0) + 1);
  }
  let bestTime: string | null = null;
  let bestCount = 0;
  for (const [k, v] of hourBuckets) {
    if (v > bestCount) {
      bestCount = v;
      bestTime = k;
    }
  }
  if (bestTime && bestCount >= 3) {
    out.push({
      id: "best-time",
      kind: "best-time-of-day",
      body: `Most of your fives on this project land in the ${bestTime}.`,
    });
  }

  // Reductions
  const reductions = done.filter((a) => Boolean(a.reducedFrom));
  if (reductions.length >= 2) {
    out.push({
      id: "reduction-helps",
      kind: "reduction-helps",
      body:
        "Reduced steps appear to land more reliably than full-sized ones. Keep that lever close.",
    });
  }

  // Stuck pattern
  const stuckReflections = reflections.filter((r) => r.feeling === "stuck" || r.feeling === "doubt");
  if (stuckReflections.length >= 3) {
    out.push({
      id: "stuck-pattern",
      kind: "stuck-pattern",
      body:
        "Stuck and doubt feelings have shown up a few times. Worth naming the underlying fear in a note.",
    });
  }

  // Consistency
  const last14 = new Date();
  last14.setDate(last14.getDate() - 14);
  const recent = done.filter((a) =>
    a.doneAt ? new Date(a.doneAt) >= last14 : false,
  );
  if (recent.length >= 5) {
    out.push({
      id: "consistency",
      kind: "consistency",
      body: `${recent.length} fives in the last two weeks. The project is alive.`,
    });
  }

  // Pivot signal
  if (stuckReflections.length >= 5 && reductions.length === 0) {
    out.push({
      id: "near-pivot",
      kind: "near-pivot",
      body:
        "Repeated stuck moments without reductions can be a quiet sign that the shape of the project may need to change.",
    });
  }

  if (out.length === 0) {
    out.push({
      id: "gentle",
      kind: "gentle-return",
      body: "A small rhythm is forming. Keep dripping.",
    });
  }

  return out;
}

/**
 * Suggest the next best five-minute step for a project, given how the
 * user has been moving lately. The point is calm — never the biggest
 * step. The smallest credible one.
 */
export function suggestNextStep(
  project: FiveProject,
  actions: FiveAction[],
  pendingActions: FiveAction[],
  reflections: ProjectReflection[],
): { title: string; reason: string } {
  // If there is a fresh pending action — surface it.
  const today = pendingActions[0];
  if (today) {
    return {
      title: today.title,
      reason: "From your milestones — already queued.",
    };
  }
  // If user feels stuck — reduce.
  const lastReflection = reflections
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
  if (lastReflection && (lastReflection.feeling === "stuck" || lastReflection.feeling === "doubt")) {
    return {
      title: "Just open the project. Look at it for five minutes.",
      reason: "Last reflection felt stuck — this is the smallest credible return.",
    };
  }
  // Default — open the project document.
  return {
    title: "Open the project. Make one tiny piece of progress.",
    reason: "A quiet first return.",
  };
}

/**
 * Reduce a step in a deliberately kind way. The output is meant to be
 * smaller than the input and emotionally honest.
 */
export function reduceStep(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("write") || lower.includes("draft")) {
    return "Write three sentences. Stop on time.";
  }
  if (lower.includes("plan") || lower.includes("structure")) {
    return "List two questions you do not yet know the answer to.";
  }
  if (lower.includes("research") || lower.includes("read")) {
    return "Spend five minutes reading one short article. No notes required.";
  }
  if (lower.includes("send") || lower.includes("email") || lower.includes("message")) {
    return "Draft the message. Do not send it yet.";
  }
  if (lower.includes("decide") || lower.includes("choose")) {
    return "Write the three fears around this decision. That is the whole step.";
  }
  if (lower.includes("build") || lower.includes("ship") || lower.includes("launch")) {
    return "Open the project. Make one tiny piece of progress.";
  }
  return "Open the project. Look at it for five minutes.";
}
