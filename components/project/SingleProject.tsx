"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import {
  FREQUENCY_LABEL,
  PROJECT_TYPE_LABEL,
  STAGE_LABEL,
  FEELING_LABEL,
  timeAgo,
} from "@/lib/project/format";
import {
  generateProjectInsights,
  reduceStep,
  suggestNextStep,
} from "@/lib/project/insights";
import {
  addAction,
  addReflection,
  archiveProject,
  generateId,
  loadState,
  markActionDone,
  pivotProject,
  saveState,
  toggleMilestoneDone,
  updateProject,
} from "@/lib/project/storage";
import type {
  FiveAction,
  FiveProject,
  ProjectMilestone,
  ProjectReflection,
  ProjectsState,
  ProjectSprint,
  ReflectionFeeling,
  TimelineEvent,
} from "@/lib/project/types";

type Tab =
  | "overview"
  | "next-five"
  | "milestones"
  | "notes"
  | "companion"
  | "timeline";

const DEFAULT_STATE: ProjectsState = {
  projects: [],
  milestones: [],
  actions: [],
  reflections: [],
  pivots: [],
  version: 1,
};

const FEELINGS: ReflectionFeeling[] = [
  "clear",
  "energised",
  "excited",
  "tired",
  "stuck",
  "doubt",
];

type Props = { projectId: string };

export function SingleProject({ projectId }: Props) {
  const [state, setState] = useState<ProjectsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");

  // Inline action sheets
  const [stuckOpen, setStuckOpen] = useState(false);
  const [reducedTitle, setReducedTitle] = useState<string>("");
  const [pivotOpen, setPivotOpen] = useState(false);
  const [pivotName, setPivotName] = useState("");
  const [pivotReason, setPivotReason] = useState("");
  const [sprintOpen, setSprintOpen] = useState(false);
  const [sprintGoal, setSprintGoal] = useState("");
  const [sprintDays, setSprintDays] = useState<number>(10);
  const [companionOutput, setCompanionOutput] = useState<string | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: ProjectsState) => {
    setState(next);
    saveState(next);
  }, []);

  const project = state.projects.find((p) => p.id === projectId);
  const milestones = useMemo(
    () =>
      state.milestones
        .filter((m) => m.projectId === projectId)
        .slice()
        .sort((a, b) => a.ordinal - b.ordinal),
    [state.milestones, projectId],
  );
  const actions = useMemo(
    () => state.actions.filter((a) => a.projectId === projectId),
    [state.actions, projectId],
  );
  const reflections = useMemo(
    () =>
      state.reflections
        .filter((r) => r.projectId === projectId)
        .slice()
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
    [state.reflections, projectId],
  );

  const pendingActions = actions.filter((a) => a.status === "pending");
  const doneActions = actions.filter((a) => a.status === "done");
  const insights = useMemo(
    () => (project ? generateProjectInsights(project, actions, reflections) : []),
    [project, actions, reflections],
  );

  const nextStep = useMemo(
    () =>
      project
        ? suggestNextStep(project, actions, pendingActions, reflections)
        : null,
    [project, actions, pendingActions, reflections],
  );

  const currentMilestone =
    milestones.find((m) => !m.doneAt) ?? milestones[milestones.length - 1];

  const timeline: TimelineEvent[] = useMemo(() => {
    if (!project) return [];
    const events: TimelineEvent[] = [
      { id: "created", kind: "created", at: project.createdAt },
    ];
    if (project.rescue) {
      events.push({ id: "rescue", kind: "rescue", at: project.createdAt });
    }
    for (const a of actions.filter((a) => a.status === "done")) {
      events.push({
        id: `a-${a.id}`,
        kind: "action-done",
        at: a.doneAt ?? a.createdAt,
        actionTitle: a.title,
      });
    }
    for (const m of milestones.filter((m) => m.doneAt)) {
      events.push({
        id: `m-${m.id}`,
        kind: "milestone-done",
        at: m.doneAt!,
        milestoneTitle: m.title,
      });
    }
    for (const r of reflections) {
      events.push({
        id: `r-${r.id}`,
        kind: "reflection",
        at: r.createdAt,
        body: r.body,
      });
    }
    for (const p of state.pivots.filter((p) => p.projectId === projectId)) {
      events.push({
        id: `pv-${p.id}`,
        kind: "pivot",
        at: p.pivotedAt,
        from: p.fromName,
        to: p.toName,
        reason: p.reason,
      });
    }
    if (project.sprint) {
      events.push({
        id: `sp-start`,
        kind: "sprint-started",
        at: project.sprint.startedAt,
        goal: project.sprint.goal,
        days: project.sprint.durationDays,
      });
      if (project.sprint.endedAt) {
        events.push({
          id: `sp-end`,
          kind: "sprint-ended",
          at: project.sprint.endedAt,
        });
      }
    }
    events.sort((a, b) => (a.at < b.at ? 1 : -1));
    return events;
  }, [project, milestones, actions, reflections, state.pivots, projectId]);

  if (!hydrated) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <Link
          href="/cubes/project/home"
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          ← your projects
        </Link>
        <h1 className="mt-10 text-2xl font-light tracking-brand text-ink">
          We couldn&rsquo;t find that project on this device.
        </h1>
        <p className="mt-3 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-soft">
          Projects live locally on the device where they were created. A future server backend will fix this.
        </p>
      </Container>
    );
  }

  // ── Actions ───────────────────────────────────────────────────
  function logActionDone(action: FiveAction) {
    persist(markActionDone(state, action.id));
  }
  function logFiveQuick(title: string, reducedFrom?: string) {
    const a: FiveAction = {
      id: generateId("a"),
      projectId,
      title,
      reducedFrom,
      status: "done",
      durationMinutes: project!.durationMinutes,
      doneAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    persist(addAction(state, a));
  }
  function queueAction(title: string) {
    persist(
      addAction(state, {
        id: generateId("a"),
        projectId,
        title,
        status: "pending",
        createdAt: new Date().toISOString(),
      }),
    );
  }

  function openStuck() {
    const original = nextStep?.title ?? "Open the project for five minutes.";
    setReducedTitle(reduceStep(original));
    setStuckOpen(true);
  }
  function acceptReduced() {
    if (reducedTitle.trim().length === 0) return;
    const original = nextStep?.title ?? undefined;
    queueAction(reducedTitle.trim());
    // Insert a "reduced" reflection too, so the timeline shows the shrink event.
    persist(
      addReflection(state, {
        id: generateId("r"),
        projectId,
        body: `Reduced step: "${reducedTitle.trim()}" (from "${original ?? "current step"}")`,
        feeling: "clear",
        createdAt: new Date().toISOString(),
      }),
    );
    setStuckOpen(false);
  }

  function pivot() {
    if (pivotName.trim().length === 0 || pivotReason.trim().length === 0) return;
    persist(pivotProject(state, projectId, pivotName.trim(), pivotReason.trim()));
    setPivotOpen(false);
    setPivotName("");
    setPivotReason("");
  }

  function startSprint() {
    if (sprintGoal.trim().length === 0) return;
    const sprint: ProjectSprint = {
      goal: sprintGoal.trim(),
      durationDays: sprintDays,
      startedAt: new Date().toISOString(),
    };
    persist(updateProject(state, projectId, { sprint }));
    setSprintOpen(false);
    setSprintGoal("");
  }
  function endSprint() {
    if (!project!.sprint) return;
    persist(
      updateProject(state, projectId, {
        sprint: { ...project!.sprint, endedAt: new Date().toISOString() },
      }),
    );
  }

  function generateWeeklyPlan() {
    if (!currentMilestone) {
      setCompanionOutput(
        "There are no milestones yet. Add one first, and we can plan around it.",
      );
      return;
    }
    const lines = [
      `Mon · Five minutes on "${currentMilestone.title}". The smallest possible piece.`,
      `Wed · One short reflection note. What is becoming clearer?`,
      `Fri · Five minutes again. Notice what you have learned.`,
      `Sat · Optional. Read what you wrote this week. Nothing else.`,
    ];
    setCompanionOutput(lines.join("\n"));
  }
  function reduceOverwhelm() {
    setCompanionOutput(
      `Today only: ${reduceStep(nextStep?.title ?? "Open the project.")}\n\nTomorrow: re-read this line.`,
    );
  }
  function mapNextSteps() {
    const remaining = milestones.filter((m) => !m.doneAt);
    if (remaining.length === 0) {
      setCompanionOutput(
        "All milestones look done — or none exist yet. Worth adding one or two new milestones.",
      );
      return;
    }
    const lines = remaining.slice(0, 3).map((m, i) => `${i + 1}. ${m.title}`);
    setCompanionOutput(
      "Next three milestones, in order — small steps each:\n\n" + lines.join("\n"),
    );
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <Link
        href="/cubes/project/home"
        className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
      >
        ← your projects
      </Link>

      {/* Header */}
      <header className="mt-6 border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          {PROJECT_TYPE_LABEL[project.type]} · {STAGE_LABEL[project.stage]}
          {project.sprint && !project.sprint.endedAt && (
            <span className="ml-3 rounded-full border border-ink/40 bg-paper px-2 py-0.5 text-[10px] text-ink">
              sprint · {project.sprint.durationDays} days
            </span>
          )}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-light tracking-brand text-ink md:text-5xl">
          {project.name}
        </h1>
        <p className="mt-3 max-w-prose text-[16px] font-light italic leading-relaxed text-ink-soft md:text-lg">
          {project.bigGoal}
        </p>
        {project.whyItMatters && (
          <p className="mt-3 max-w-prose text-[14px] font-light leading-relaxed text-ink-soft">
            <span className="text-ink-mute">why · </span>
            {project.whyItMatters}
          </p>
        )}

        {/* Quick action row */}
        <div className="mt-6 flex flex-wrap gap-2">
          {nextStep && (
            <Button
              variant="primary"
              size="md"
              onClick={() => logFiveQuick(nextStep.title)}
            >
              I did my Five
            </Button>
          )}
          <SecondaryAction onClick={openStuck}>I&rsquo;m stuck</SecondaryAction>
          <SecondaryAction onClick={openStuck}>Make it smaller</SecondaryAction>
          <SecondaryAction onClick={() => setTab("companion")}>
            Plan my week
          </SecondaryAction>
          <SecondaryAction onClick={() => setPivotOpen((v) => !v)}>
            Pivot project
          </SecondaryAction>
          <SecondaryAction
            onClick={() => setSprintOpen((v) => !v)}
            disabled={Boolean(project.sprint && !project.sprint.endedAt)}
          >
            {project.sprint && !project.sprint.endedAt
              ? "Sprint running"
              : "Start a sprint"}
          </SecondaryAction>
          {project.sprint && !project.sprint.endedAt && (
            <SecondaryAction onClick={endSprint}>End sprint</SecondaryAction>
          )}
        </div>

        {/* Inline action sheets */}
        {stuckOpen && (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              the smaller version
            </p>
            <p className="mt-3 text-[15px] font-light italic leading-relaxed text-ink-soft">
              When life feels heavy, do not break the human. Reduce the step.
            </p>
            <input
              type="text"
              value={reducedTitle}
              onChange={(e) => setReducedTitle(e.target.value)}
              className="mt-3 w-full rounded-md border border-line bg-paper p-3 text-[15px] font-light text-ink focus:border-ink/40 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setStuckOpen(false)}
                className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={acceptReduced}
                className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent"
              >
                Queue this smaller step
              </button>
            </div>
          </div>
        )}

        {pivotOpen && (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              pivot · the project evolves
            </p>
            <p className="mt-3 text-[14px] font-light italic leading-relaxed text-ink-soft">
              The original plan is not sacred. Movement is.
            </p>
            <input
              type="text"
              value={pivotName}
              onChange={(e) => setPivotName(e.target.value)}
              placeholder="New project name"
              className="mt-3 w-full rounded-md border border-line bg-paper p-3 text-[15px] font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
            />
            <textarea
              rows={2}
              value={pivotReason}
              onChange={(e) => setPivotReason(e.target.value)}
              placeholder="One honest line — why are you pivoting?"
              className="mt-3 w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setPivotOpen(false)}
                className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={pivot}
                disabled={!pivotName.trim() || !pivotReason.trim()}
                className={cn(
                  "inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent",
                  (!pivotName.trim() || !pivotReason.trim()) &&
                    "cursor-not-allowed opacity-40",
                )}
              >
                Pivot
              </button>
            </div>
          </div>
        )}

        {sprintOpen && (
          <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              short momentum sprint
            </p>
            <p className="mt-3 text-[14px] font-light italic leading-relaxed text-ink-soft">
              A short, real outcome. 5, 10, or 30 days.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[5, 10, 30].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSprintDays(d)}
                  className={cn(
                    "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                    sprintDays === d
                      ? "border-ink/50 bg-ink text-paper"
                      : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                  )}
                >
                  {d} days
                </button>
              ))}
            </div>
            <input
              type="text"
              value={sprintGoal}
              onChange={(e) => setSprintGoal(e.target.value)}
              placeholder="What is the real outcome? e.g. 'finish book structure'"
              className="mt-3 w-full rounded-md border border-line bg-paper p-3 text-[15px] font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSprintOpen(false)}
                className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
              >
                cancel
              </button>
              <button
                type="button"
                onClick={startSprint}
                disabled={!sprintGoal.trim()}
                className={cn(
                  "inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent",
                  !sprintGoal.trim() && "cursor-not-allowed opacity-40",
                )}
              >
                Start sprint
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="mt-8 flex flex-wrap gap-2 border-b border-line/60 pb-3">
        {(
          [
            "overview",
            "next-five",
            "milestones",
            "notes",
            "companion",
            "timeline",
          ] as Tab[]
        ).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-light uppercase tracking-[0.22em] transition-colors",
              tab === t ? "bg-ink text-paper" : "text-ink-mute hover:text-ink",
            )}
          >
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Tabs body */}
      {tab === "overview" && (
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div>
            {/* Next five card */}
            {nextStep && (
              <div className="rounded-3xl border border-ink/30 bg-paper p-6 md:p-8">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  your next five
                </p>
                <h2 className="mt-3 text-2xl font-light tracking-brand text-ink md:text-3xl">
                  {nextStep.title}
                </h2>
                <p className="mt-2 text-[13px] font-light italic leading-relaxed text-ink-mute">
                  {nextStep.reason}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => logFiveQuick(nextStep.title)}
                    className="inline-flex h-10 items-center rounded-full bg-ink px-5 text-[13px] font-light text-paper hover:bg-accent"
                  >
                    I did my Five
                  </button>
                  <button
                    type="button"
                    onClick={openStuck}
                    className="inline-flex h-10 items-center rounded-full border border-line bg-transparent px-5 text-[13px] font-light text-ink hover:border-ink/40"
                  >
                    Make it smaller
                  </button>
                </div>
              </div>
            )}

            {/* Current milestone */}
            {currentMilestone && (
              <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  current milestone
                </p>
                <h3 className="mt-2 text-lg font-light tracking-brand text-ink md:text-xl">
                  {currentMilestone.title}
                </h3>
                {currentMilestone.body && (
                  <p className="mt-2 text-[14px] font-light italic leading-relaxed text-ink-soft">
                    {currentMilestone.body}
                  </p>
                )}
              </div>
            )}

            {/* Soft progress */}
            <div className="mt-6 rounded-2xl border border-line bg-surface p-6">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                soft progress
              </p>
              <div className="mt-3 grid grid-cols-3 gap-4">
                <Stat
                  label="five-actions done"
                  value={String(doneActions.length)}
                />
                <Stat
                  label="milestones reached"
                  value={`${milestones.filter((m) => m.doneAt).length}/${milestones.length}`}
                />
                <Stat
                  label="reflections"
                  value={String(reflections.length)}
                />
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                quiet observations
              </p>
              <ul className="mt-3 space-y-3 text-[13.5px] font-light leading-relaxed text-ink-soft">
                {insights.map((i) => (
                  <li key={i.id} className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink/40"
                    />
                    <span>{i.body}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                shape
              </p>
              <p className="mt-3 text-[13.5px] font-light leading-relaxed text-ink-soft">
                {FREQUENCY_LABEL[project.frequency]} · {project.durationMinutes} min sessions
              </p>
              <p className="mt-2 text-[12px] font-light italic text-ink-mute">
                The shape is yours to change.
              </p>
            </div>
            <button
              type="button"
              onClick={() => persist(archiveProject(state, projectId))}
              className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
            >
              archive this project (keeps history)
            </button>
          </aside>
        </section>
      )}

      {tab === "next-five" && (
        <NextFiveTab
          project={project}
          pendingActions={pendingActions}
          onLogDone={logActionDone}
          onLogQuick={(t) => logFiveQuick(t)}
          onQueue={queueAction}
          onStuck={openStuck}
        />
      )}

      {tab === "milestones" && (
        <MilestonesTab
          milestones={milestones}
          actions={actions}
          onToggleMilestone={(id) => persist(toggleMilestoneDone(state, id))}
          onQueueAction={(title, milestoneId) =>
            persist(
              addAction(state, {
                id: generateId("a"),
                projectId,
                milestoneId,
                title,
                status: "pending",
                createdAt: new Date().toISOString(),
              }),
            )
          }
        />
      )}

      {tab === "notes" && (
        <NotesTab
          reflections={reflections}
          onAdd={(body, feeling) =>
            persist(
              addReflection(state, {
                id: generateId("r"),
                projectId,
                body,
                feeling,
                createdAt: new Date().toISOString(),
              }),
            )
          }
        />
      )}

      {tab === "companion" && (
        <CompanionTab
          project={project}
          output={companionOutput}
          onPlanWeek={generateWeeklyPlan}
          onReduceOverwhelm={reduceOverwhelm}
          onMapNext={mapNextSteps}
        />
      )}

      {tab === "timeline" && <TimelineTab events={timeline} />}

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Where the dream becomes a rhythm.
        </p>
      </div>
    </Container>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────

function SecondaryAction({
  onClick,
  children,
  disabled,
}: {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-10 items-center rounded-full border border-line bg-transparent px-4 text-[13px] font-light text-ink hover:border-ink/40",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-2 text-xl font-thin tracking-brand text-ink md:text-2xl">
        {value}
      </p>
    </div>
  );
}

function NextFiveTab({
  project,
  pendingActions,
  onLogDone,
  onLogQuick,
  onQueue,
  onStuck,
}: {
  project: FiveProject;
  pendingActions: FiveAction[];
  onLogDone: (a: FiveAction) => void;
  onLogQuick: (title: string) => void;
  onQueue: (title: string) => void;
  onStuck: () => void;
}) {
  const [draft, setDraft] = useState("");
  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl border border-line bg-surface p-6 md:p-7">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          write a five for yourself
        </p>
        <p className="mt-1 max-w-prose text-[13px] font-light italic text-ink-mute">
          The smallest credible step you can take in {project.durationMinutes} minutes.
        </p>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder='"Write five possible titles." "Open the document."'
          className="mt-3 w-full border-b border-line bg-transparent pb-2 text-[16px] font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              if (draft.trim().length === 0) return;
              onQueue(draft.trim());
              setDraft("");
            }}
            className="inline-flex h-9 items-center rounded-full border border-line px-4 text-[13px] font-light text-ink hover:border-ink/40"
          >
            Queue for later
          </button>
          <button
            type="button"
            onClick={() => {
              if (draft.trim().length === 0) return;
              onLogQuick(draft.trim());
              setDraft("");
            }}
            className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent"
          >
            Did it — log
          </button>
          <button
            type="button"
            onClick={onStuck}
            className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
          >
            stuck · make smaller
          </button>
        </div>
      </div>

      {pendingActions.length > 0 && (
        <div>
          <p className="mb-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            queued five-actions
          </p>
          <ul className="space-y-2">
            {pendingActions.map((a) => (
              <li
                key={a.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-4"
              >
                <div className="min-w-0">
                  <p className="text-[15px] font-light text-ink">{a.title}</p>
                  {a.reducedFrom && (
                    <p className="mt-1 text-[11.5px] font-light italic text-ink-mute">
                      reduced from &ldquo;{a.reducedFrom}&rdquo;
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onLogDone(a)}
                  className="inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent"
                >
                  Done
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function MilestonesTab({
  milestones,
  actions,
  onToggleMilestone,
  onQueueAction,
}: {
  milestones: ProjectMilestone[];
  actions: FiveAction[];
  onToggleMilestone: (id: string) => void;
  onQueueAction: (title: string, milestoneId: string) => void;
}) {
  const [composer, setComposer] = useState<{ id: string; text: string } | null>(
    null,
  );

  if (milestones.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
        <p className="text-[14px] font-light italic text-ink-soft">
          No milestones yet. Templates seed these — quick mode does not. Add some from your studio.
        </p>
      </section>
    );
  }
  return (
    <section className="mt-8 space-y-3">
      {milestones.map((m) => {
        const myActions = actions.filter((a) => a.milestoneId === m.id);
        return (
          <article
            key={m.id}
            className={cn(
              "rounded-2xl border bg-surface p-5",
              m.doneAt ? "border-ink/30 bg-paper" : "border-line",
            )}
          >
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => onToggleMilestone(m.id)}
                aria-label={m.doneAt ? "Mark as not done" : "Mark as done"}
                className={cn(
                  "mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-light transition-colors",
                  m.doneAt
                    ? "border-ink bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/40 hover:text-ink",
                )}
              >
                {m.doneAt ? "✓" : m.ordinal}
              </button>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  milestone {m.ordinal}
                </p>
                <h3
                  className={cn(
                    "mt-2 text-lg font-light tracking-brand md:text-xl",
                    m.doneAt
                      ? "text-ink-soft line-through decoration-ink/40"
                      : "text-ink",
                  )}
                >
                  {m.title}
                </h3>
                {m.body && (
                  <p className="mt-1 text-[14px] font-light italic leading-relaxed text-ink-soft">
                    {m.body}
                  </p>
                )}
                {myActions.length > 0 && (
                  <ul className="mt-3 space-y-1 border-l border-line pl-4 text-[13.5px] font-light text-ink-soft">
                    {myActions.map((a) => (
                      <li key={a.id}>
                        {a.status === "done" ? "✓ " : "· "}
                        <span
                          className={cn(
                            a.status === "done" &&
                              "line-through decoration-ink/40",
                          )}
                        >
                          {a.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {composer?.id === m.id ? (
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={composer.text}
                      onChange={(e) =>
                        setComposer({ id: m.id, text: e.target.value })
                      }
                      placeholder="A small five-minute action for this milestone"
                      className="h-9 flex-1 rounded-md border border-line bg-paper px-3 text-[14px] font-light text-ink focus:border-ink/40 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (composer.text.trim().length === 0) return;
                        onQueueAction(composer.text.trim(), m.id);
                        setComposer(null);
                      }}
                      className="inline-flex h-9 items-center rounded-full bg-ink px-3 text-[12.5px] font-light text-paper hover:bg-accent"
                    >
                      Queue
                    </button>
                    <button
                      type="button"
                      onClick={() => setComposer(null)}
                      className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                    >
                      cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setComposer({ id: m.id, text: "" })}
                    className="mt-3 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
                  >
                    + add five-action
                  </button>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}

function NotesTab({
  reflections,
  onAdd,
}: {
  reflections: ProjectReflection[];
  onAdd: (body: string, feeling?: ReflectionFeeling) => void;
}) {
  const [text, setText] = useState("");
  const [feeling, setFeeling] = useState<ReflectionFeeling | null>(null);

  function commit() {
    if (text.trim().length === 0) return;
    onAdd(text.trim(), feeling ?? undefined);
    setText("");
    setFeeling(null);
  }

  return (
    <section className="mt-8">
      <div className="rounded-2xl border border-line bg-surface p-5">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          one short reflection
        </p>
        <textarea
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What did you realise? What blocked you? What idea emerged?"
          className="mt-3 w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {FEELINGS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFeeling(feeling === f ? null : f)}
                className={cn(
                  "inline-flex h-8 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
                  feeling === f
                    ? "border-ink/50 bg-ink text-paper"
                    : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
                )}
              >
                {FEELING_LABEL[f]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={commit}
            disabled={text.trim().length === 0}
            className={cn(
              "inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent",
              text.trim().length === 0 && "cursor-not-allowed opacity-40",
            )}
          >
            Save
          </button>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {reflections.length === 0 && (
          <p className="text-[14px] font-light italic text-ink-soft">
            No notes yet. Even one short sentence is a note.
          </p>
        )}
        {reflections.map((r) => (
          <li key={r.id} className="rounded-2xl border border-line bg-surface p-5">
            <p className="text-[14.5px] font-light leading-relaxed text-ink">
              {r.body}
            </p>
            <p className="mt-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {timeAgo(r.createdAt)}
              {r.feeling && (
                <>
                  <span aria-hidden="true"> · </span>
                  <span className="text-ink-soft">felt {FEELING_LABEL[r.feeling].toLowerCase()}</span>
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function CompanionTab({
  project,
  output,
  onPlanWeek,
  onReduceOverwhelm,
  onMapNext,
}: {
  project: FiveProject;
  output: string | null;
  onPlanWeek: () => void;
  onReduceOverwhelm: () => void;
  onMapNext: () => void;
}) {
  return (
    <section className="mt-8 space-y-6">
      <div className="rounded-3xl border border-line bg-surface p-6 md:p-7">
        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          project companion
        </p>
        <h2 className="mt-3 text-xl font-light tracking-brand text-ink md:text-2xl">
          Calm, collaborative — not in charge.
        </h2>
        <p className="mt-3 max-w-prose text-[14px] font-light italic leading-relaxed text-ink-soft">
          AI should not replace the dreamer. It should protect the momentum. AI level on this project: <span className="text-ink">{project.aiSupportLevel}</span>.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onPlanWeek}
            className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 text-[13px] font-light text-ink hover:border-ink/40"
          >
            Plan my week
          </button>
          <button
            type="button"
            onClick={onMapNext}
            className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 text-[13px] font-light text-ink hover:border-ink/40"
          >
            Map next steps
          </button>
          <button
            type="button"
            onClick={onReduceOverwhelm}
            className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 text-[13px] font-light text-ink hover:border-ink/40"
          >
            Reduce overwhelm
          </button>
        </div>
      </div>

      {output && (
        <div className="rounded-2xl border border-line bg-paper p-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            companion · output
          </p>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-[14.5px] font-light leading-relaxed text-ink">
            {output}
          </pre>
        </div>
      )}
    </section>
  );
}

function TimelineTab({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
        <p className="text-[14px] font-light italic text-ink-soft">
          Nothing on the timeline yet.
        </p>
      </section>
    );
  }
  return (
    <section className="mt-8">
      <ul className="space-y-3 border-l border-line pl-6">
        {events.map((e) => (
          <li key={e.id} className="relative">
            <span
              aria-hidden="true"
              className="absolute -left-[31px] top-1.5 inline-block h-2 w-2 rounded-full bg-ink/60"
            />
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {timeAgo(e.at)}
            </p>
            <p className="mt-1 text-[14.5px] font-light leading-relaxed text-ink">
              {describeEvent(e)}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function describeEvent(e: TimelineEvent): string {
  switch (e.kind) {
    case "created":
      return "Project began.";
    case "rescue":
      return "Project was rescued from a previous abandoned version.";
    case "action-done":
      return `Did a five — “${e.actionTitle}”.`;
    case "milestone-done":
      return `Reached milestone: “${e.milestoneTitle}”.`;
    case "reflection":
      return `Reflection: ${e.body.length > 120 ? e.body.slice(0, 120) + "…" : e.body}`;
    case "stuck-reduced":
      return `Reduced a step — “${e.from}” became “${e.to}”.`;
    case "pivot":
      return `Pivoted — “${e.from}” became “${e.to}”. ${e.reason}`;
    case "sprint-started":
      return `Sprint started — ${e.days} days. Goal: ${e.goal}.`;
    case "sprint-ended":
      return "Sprint ended.";
  }
}
