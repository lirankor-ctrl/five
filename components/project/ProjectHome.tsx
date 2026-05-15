"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { projectTemplates } from "@/data/project/templates";
import {
  FREQUENCY_LABEL,
  PROJECT_TYPE_LABEL,
  STAGE_LABEL,
} from "@/lib/project/format";
import { suggestNextStep } from "@/lib/project/insights";
import {
  addAction,
  addMilestone,
  addProject,
  generateId,
  loadState,
  saveState,
} from "@/lib/project/storage";
import type {
  AISupportLevel,
  FiveProject,
  Frequency,
  GuidanceStyle,
  ProjectMilestone,
  ProjectsState,
  ProjectStage,
  ProjectType,
} from "@/lib/project/types";

type Mode = "list" | "pick-mode" | "quick" | "template" | "dream" | "rescue";

const DEFAULT_STATE: ProjectsState = {
  projects: [],
  milestones: [],
  actions: [],
  reflections: [],
  pivots: [],
  version: 1,
};

const PROJECT_TYPES: ProjectType[] = [
  "writing",
  "startup",
  "business",
  "relocation",
  "research",
  "product",
  "career-change",
  "learning",
  "creative",
  "financial",
  "family-project",
  "health",
];

const FREQUENCIES: Frequency[] = [
  "daily",
  "3-per-week",
  "weekly",
  "fridays",
  "evenings",
  "mornings",
  "flexible",
];

const STAGES: ProjectStage[] = [
  "idea",
  "starting",
  "in-progress",
  "stuck",
  "near-completion",
  "failed-before",
  "restarting",
];

const GUIDANCES: GuidanceStyle[] = [
  "gentle",
  "strategic",
  "creative",
  "practical",
  "emotional",
  "minimalist",
  "push",
];

const AI_LEVELS: AISupportLevel[] = ["none", "light", "active", "companion"];

const AI_LEVEL_LABEL: Record<AISupportLevel, string> = {
  none: "No AI",
  light: "Light guidance",
  active: "Active assistant",
  companion: "Intelligent companion",
};

const GUIDANCE_LABEL_INLINE: Record<GuidanceStyle, string> = {
  gentle: "Gentle",
  strategic: "Strategic",
  creative: "Creative",
  practical: "Practical",
  emotional: "Emotional",
  minimalist: "Minimalist",
  push: "Push mode",
};

export function ProjectHome() {
  const [state, setState] = useState<ProjectsState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [mode, setMode] = useState<Mode>("list");

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
    // Optionally auto-open mode-picker if URL says so.
    const params =
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search);
    const m = params?.get("mode");
    if (m === "template" || m === "dream" || m === "rescue" || m === "quick") {
      setMode(m as Mode);
    }
  }, []);

  const persist = useCallback((next: ProjectsState) => {
    setState(next);
    saveState(next);
  }, []);

  const active = useMemo(
    () => state.projects.filter((p) => !p.archivedAt),
    [state.projects],
  );

  function commitProject(
    project: FiveProject,
    milestones: Array<{ title: string; body?: string }>,
    firstActionTitle?: string,
  ) {
    let next = addProject(state, project);
    milestones.forEach((m, i) => {
      const milestone: ProjectMilestone = {
        id: generateId("ms"),
        projectId: project.id,
        ordinal: i + 1,
        title: m.title,
        body: m.body,
      };
      next = addMilestone(next, milestone);
      // Attach first action to milestone 1.
      if (i === 0 && firstActionTitle) {
        next = addAction(next, {
          id: generateId("a"),
          projectId: project.id,
          milestoneId: milestone.id,
          title: firstActionTitle,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
      }
    });
    persist(next);
    setMode("list");
    // Navigate to single-project page.
    if (typeof window !== "undefined") {
      window.location.assign(`/cubes/project/p/${project.id}`);
    }
  }

  if (!hydrated) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-14">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </Container>
    );
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="border-b border-line/60 pb-8">
        <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
          your studio
        </p>
        <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
          The projects you are keeping alive.
        </h1>
        <p className="mt-3 max-w-prose text-[14px] font-light text-ink-soft">
          One project at a time, or several quietly at once. Each one lives in its own small studio.
        </p>
      </header>

      {/* Active projects */}
      {active.length > 0 && mode === "list" && (
        <section className="mt-10">
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {active.map((p) => (
              <ProjectListItem key={p.id} project={p} state={state} />
            ))}
          </ul>
        </section>
      )}

      {/* Begin a project (always shown) */}
      <section className="mt-10">
        {mode === "list" && (
          <button
            type="button"
            onClick={() => setMode("pick-mode")}
            className="inline-flex h-11 items-center rounded-full bg-ink px-6 text-[14px] font-light text-paper hover:bg-accent"
          >
            + Begin a project
          </button>
        )}

        {mode === "pick-mode" && (
          <ModePicker
            onPick={(m) => setMode(m)}
            onCancel={() => setMode("list")}
          />
        )}

        {mode === "quick" && (
          <QuickForm
            onCancel={() => setMode("list")}
            onCommit={(project) => {
              commitProject(project, [], undefined);
            }}
          />
        )}

        {mode === "template" && (
          <TemplateForm
            onCancel={() => setMode("list")}
            onCommit={(project, milestones, firstAction) =>
              commitProject(project, milestones, firstAction)
            }
          />
        )}

        {mode === "dream" && (
          <DreamForm
            onCancel={() => setMode("list")}
            onCommit={(project, milestones, firstAction) =>
              commitProject(project, milestones, firstAction)
            }
          />
        )}

        {mode === "rescue" && (
          <RescueForm
            onCancel={() => setMode("list")}
            onCommit={(project, milestones, firstAction) =>
              commitProject(project, milestones, firstAction)
            }
          />
        )}
      </section>

      {active.length === 0 && mode === "list" && (
        <section className="mt-12 rounded-3xl border border-dashed border-line bg-paper/40 p-8 text-center">
          <p className="text-[15px] font-light italic leading-relaxed text-ink-soft">
            No projects yet. Pick a beginning shape above. Five minutes is enough to start.
          </p>
        </section>
      )}

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          A quiet studio where the dream becomes a rhythm.
        </p>
      </div>
    </Container>
  );
}

function ProjectListItem({
  project,
  state,
}: {
  project: FiveProject;
  state: ProjectsState;
}) {
  const myActions = state.actions.filter((a) => a.projectId === project.id);
  const pending = myActions.filter((a) => a.status === "pending");
  const done = myActions.filter((a) => a.status === "done");
  const reflections = state.reflections.filter(
    (r) => r.projectId === project.id,
  );
  const next = suggestNextStep(project, myActions, pending, reflections);
  return (
    <li className="rounded-2xl border border-line bg-surface p-6">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {PROJECT_TYPE_LABEL[project.type]} · {STAGE_LABEL[project.stage]}
      </p>
      <h3 className="mt-2 text-xl font-light tracking-brand text-ink">
        <Link
          href={`/cubes/project/p/${project.id}`}
          className="hover:underline underline-offset-4"
        >
          {project.name}
        </Link>
      </h3>
      <p className="mt-2 text-[14px] font-light italic leading-relaxed text-ink-soft">
        {project.bigGoal}
      </p>
      <div className="mt-4 rounded-xl border border-line/70 bg-paper/60 p-3 text-[13px] font-light leading-relaxed text-ink">
        <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
          next best step
        </p>
        <p className="mt-1">{next.title}</p>
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        <span>
          {done.length} done · {pending.length} queued
        </span>
        <Link
          href={`/cubes/project/p/${project.id}`}
          className="text-ink hover:underline"
        >
          Enter →
        </Link>
      </div>
    </li>
  );
}

function ModePicker({
  onPick,
  onCancel,
}: {
  onPick: (m: Mode) => void;
  onCancel: () => void;
}) {
  const choices: Array<{
    id: Exclude<Mode, "list" | "pick-mode">;
    label: string;
    body: string;
  }> = [
    {
      id: "quick",
      label: "Quick · I know what it is.",
      body:
        "A short calm form. Name, type, big goal, why it matters. You can add milestones later.",
    },
    {
      id: "template",
      label: "From a template",
      body:
        "Real starting points for the dreams people quietly carry. Six templates with pre-built milestones.",
    },
    {
      id: "dream",
      label: "Dream to Plan",
      body:
        "Your idea is still hazy. Answer five gentle questions and we will shape it into a small first plan.",
    },
    {
      id: "rescue",
      label: "Rescue an abandoned one",
      body:
        "There is already an unfinished version of this dream. Bring it back to life with tiny revival actions.",
    },
  ];
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        how would you like to begin?
      </p>
      <h2 className="mt-3 text-xl font-light tracking-brand text-ink md:text-2xl">
        Four small front doors.
      </h2>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        {choices.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onPick(c.id)}
            className="rounded-2xl border border-line bg-paper p-5 text-left transition-all hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft"
          >
            <p className="text-[15px] font-light tracking-brand text-ink">
              {c.label}
            </p>
            <p className="mt-2 text-[13.5px] font-light italic leading-relaxed text-ink-soft">
              {c.body}
            </p>
          </button>
        ))}
      </div>
      <div className="mt-6 text-right">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          cancel
        </button>
      </div>
    </div>
  );
}

// ── Quick form ────────────────────────────────────────────────────
function QuickForm({
  onCancel,
  onCommit,
}: {
  onCancel: () => void;
  onCommit: (p: FiveProject) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProjectType>("writing");
  const [bigGoal, setBigGoal] = useState("");
  const [why, setWhy] = useState("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [duration, setDuration] = useState<number>(5);
  const [stage, setStage] = useState<ProjectStage>("idea");
  const [guidance, setGuidance] = useState<GuidanceStyle>("gentle");
  const [ai, setAi] = useState<AISupportLevel>("light");

  const ready = name.trim().length > 0 && bigGoal.trim().length > 0;

  function commit() {
    if (!ready) return;
    onCommit({
      id: generateId("p"),
      name: name.trim(),
      type,
      bigGoal: bigGoal.trim(),
      whyItMatters: why.trim(),
      frequency,
      durationMinutes: duration,
      stage,
      guidanceStyle: guidance,
      aiSupportLevel: ai,
      createdAt: new Date().toISOString(),
    });
  }

  return (
    <FormShell
      title="A small honest setup."
      eyebrow="quick · 9 fields"
      onCancel={onCancel}
      onCommit={commit}
      commitLabel="Open this studio"
      ready={ready}
    >
      <Field label="01 · name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My book · Portugal · The studio"
          className="w-full border-b border-line bg-transparent pb-2 text-2xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="02 · project type">
        <ChipGrid
          options={PROJECT_TYPES}
          value={type}
          onSelect={(v) => setType(v)}
          labels={PROJECT_TYPE_LABEL}
        />
      </Field>
      <Field label="03 · big goal">
        <input
          type="text"
          value={bigGoal}
          onChange={(e) => setBigGoal(e.target.value)}
          placeholder="What would you like to be true, eventually?"
          className="w-full border-b border-line bg-transparent pb-2 text-lg font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="04 · why it matters" hint="Not what — why.">
        <textarea
          rows={2}
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="The emotional honest version."
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="05 · five frequency">
        <ChipGrid
          options={FREQUENCIES}
          value={frequency}
          onSelect={(v) => setFrequency(v)}
          labels={FREQUENCY_LABEL}
        />
      </Field>
      <Field label="06 · session duration">
        <div className="flex flex-wrap gap-2">
          {[5, 10, 15, 25].map((d) => (
            <Pill key={d} active={duration === d} onClick={() => setDuration(d)}>
              {d} min
            </Pill>
          ))}
        </div>
      </Field>
      <Field label="07 · current state">
        <ChipGrid
          options={STAGES}
          value={stage}
          onSelect={(v) => setStage(v)}
          labels={STAGE_LABEL}
        />
      </Field>
      <Field label="08 · guidance style">
        <ChipGrid
          options={GUIDANCES}
          value={guidance}
          onSelect={(v) => setGuidance(v)}
          labels={GUIDANCE_LABEL_INLINE}
        />
      </Field>
      <Field label="09 · ai support level" hint="None is allowed. Companion is the deepest.">
        <ChipGrid
          options={AI_LEVELS}
          value={ai}
          onSelect={(v) => setAi(v)}
          labels={AI_LEVEL_LABEL}
        />
      </Field>
    </FormShell>
  );
}

// ── Template form ─────────────────────────────────────────────────
function TemplateForm({
  onCancel,
  onCommit,
}: {
  onCancel: () => void;
  onCommit: (
    p: FiveProject,
    milestones: Array<{ title: string; body?: string }>,
    firstAction?: string,
  ) => void;
}) {
  const [templateId, setTemplateId] = useState(projectTemplates[0].id);
  const template = projectTemplates.find((t) => t.id === templateId)!;
  const [name, setName] = useState(template.name);
  const [bigGoal, setBigGoal] = useState(template.defaultBigGoal);
  const [why, setWhy] = useState(template.defaultWhyItMatters);
  const [frequency, setFrequency] = useState<Frequency>("daily");

  // Reset defaults when template changes
  useEffect(() => {
    setName(template.name);
    setBigGoal(template.defaultBigGoal);
    setWhy(template.defaultWhyItMatters);
  }, [template]);

  const ready = name.trim().length > 0 && bigGoal.trim().length > 0;

  function commit() {
    if (!ready) return;
    const project: FiveProject = {
      id: generateId("p"),
      name: name.trim(),
      type: template.type,
      bigGoal: bigGoal.trim(),
      whyItMatters: why.trim(),
      frequency,
      durationMinutes: 5,
      stage: "starting",
      guidanceStyle: "gentle",
      aiSupportLevel: "light",
      createdAt: new Date().toISOString(),
      templateId: template.id,
    };
    onCommit(
      project,
      template.milestones.map((m) => ({ title: m.title, body: m.body })),
      template.milestones[0]?.firstAction,
    );
  }

  return (
    <FormShell
      title="A real starting point."
      eyebrow="from a template"
      onCancel={onCancel}
      onCommit={commit}
      commitLabel="Use this template"
      ready={ready}
    >
      <Field label="01 · template">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          {projectTemplates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTemplateId(t.id)}
              className={cn(
                "rounded-2xl border p-4 text-left transition-all duration-300",
                t.id === templateId
                  ? "border-ink/50 bg-paper"
                  : "border-line bg-surface hover:border-ink/30",
              )}
            >
              <p className="text-[14px] font-light tracking-brand text-ink">
                {t.glyph} {t.name}
              </p>
              <p className="mt-1 text-[12.5px] font-light italic leading-relaxed text-ink-soft">
                {t.oneLine}
              </p>
            </button>
          ))}
        </div>
      </Field>
      <Field label="02 · name it">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border-b border-line bg-transparent pb-2 text-xl font-light tracking-brand text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="03 · adjust the big goal">
        <input
          type="text"
          value={bigGoal}
          onChange={(e) => setBigGoal(e.target.value)}
          className="w-full border-b border-line bg-transparent pb-2 text-[16px] font-light text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="04 · adjust the why">
        <textarea
          rows={2}
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="05 · how often, gently">
        <ChipGrid
          options={FREQUENCIES}
          value={frequency}
          onSelect={(v) => setFrequency(v)}
          labels={FREQUENCY_LABEL}
        />
      </Field>
      <Field label="milestones included">
        <ol className="space-y-2 border-l border-line pl-5">
          {template.milestones.map((m, i) => (
            <li
              key={i}
              className="text-[13.5px] font-light leading-relaxed text-ink-soft"
            >
              <span className="text-ink-mute">{String(i + 1).padStart(2, "0")}</span>{" "}
              <span className="text-ink">{m.title}</span>
              {m.body && <span className="ml-2 italic">— {m.body}</span>}
            </li>
          ))}
        </ol>
        <p className="mt-3 text-[12px] font-light italic text-ink-mute">
          The first five-minute action of milestone one will be queued for you: <em>{template.milestones[0]?.firstAction}</em>
        </p>
      </Field>
    </FormShell>
  );
}

// ── Dream-to-Plan ─────────────────────────────────────────────────
function DreamForm({
  onCancel,
  onCommit,
}: {
  onCancel: () => void;
  onCommit: (
    p: FiveProject,
    milestones: Array<{ title: string; body?: string }>,
    firstAction?: string,
  ) => void;
}) {
  const [dream, setDream] = useState("");
  const [yearGoal, setYearGoal] = useState("");
  const [whyMatters, setWhyMatters] = useState("");
  const [whatExists, setWhatExists] = useState("");
  const [whatMissing, setWhatMissing] = useState("");
  const [smallestStep, setSmallestStep] = useState("");

  const ready = dream.trim().length > 0 && yearGoal.trim().length > 0;

  function commit() {
    if (!ready) return;
    // Build a small first plan from the answers.
    const name =
      dream.trim().length > 40
        ? dream.trim().slice(0, 40) + "…"
        : dream.trim();
    const project: FiveProject = {
      id: generateId("p"),
      name,
      type: "creative",
      bigGoal: yearGoal.trim(),
      whyItMatters: whyMatters.trim(),
      frequency: "flexible",
      durationMinutes: 5,
      stage: "idea",
      guidanceStyle: "gentle",
      aiSupportLevel: "light",
      createdAt: new Date().toISOString(),
    };
    const milestones: Array<{ title: string; body?: string }> = [];
    if (whatExists.trim().length > 0) {
      milestones.push({
        title: "What already exists",
        body: whatExists.trim(),
      });
    }
    if (whatMissing.trim().length > 0) {
      milestones.push({ title: "What is missing", body: whatMissing.trim() });
    }
    milestones.push({
      title: "The first small move",
      body: smallestStep.trim() || "Decide the smallest step.",
    });
    onCommit(
      project,
      milestones,
      smallestStep.trim() || "Spend five minutes naming the smallest credible first step.",
    );
  }

  return (
    <FormShell
      title="From a hazy dream to a small first plan."
      eyebrow="dream to plan · 5 questions"
      onCancel={onCancel}
      onCommit={commit}
      commitLabel="Shape this into a project"
      ready={ready}
    >
      <Field label="01 · what is the dream, in one sentence?">
        <input
          type="text"
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="I want to do something with music…"
          className="w-full border-b border-line bg-transparent pb-2 text-xl italic font-light text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="02 · what would you love to happen in a year?">
        <textarea
          rows={2}
          value={yearGoal}
          onChange={(e) => setYearGoal(e.target.value)}
          placeholder="The honest soft version, not the heroic version."
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="03 · why does this matter to you?">
        <textarea
          rows={2}
          value={whyMatters}
          onChange={(e) => setWhyMatters(e.target.value)}
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="04 · what already exists?" hint="Notes, sketches, drafts, conversations, intentions.">
        <textarea
          rows={2}
          value={whatExists}
          onChange={(e) => setWhatExists(e.target.value)}
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="05 · what is missing?" hint="A skill, a piece of clarity, a decision, a person.">
        <textarea
          rows={2}
          value={whatMissing}
          onChange={(e) => setWhatMissing(e.target.value)}
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="06 · the smallest possible first step?">
        <textarea
          rows={2}
          value={smallestStep}
          onChange={(e) => setSmallestStep(e.target.value)}
          placeholder="If unsure, leave blank — we will queue a five-minute step for you."
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
    </FormShell>
  );
}

// ── Rescue ────────────────────────────────────────────────────────
function RescueForm({
  onCancel,
  onCommit,
}: {
  onCancel: () => void;
  onCommit: (
    p: FiveProject,
    milestones: Array<{ title: string; body?: string }>,
    firstAction?: string,
  ) => void;
}) {
  const [name, setName] = useState("");
  const [stopped, setStopped] = useState("");
  const [why, setWhy] = useState("");
  const [stillExists, setStillExists] = useState("");
  const [stillMatters, setStillMatters] = useState<
    "yes" | "maybe" | "not-sure"
  >("maybe");
  const [revival, setRevival] = useState("");

  const ready = name.trim().length > 0 && revival.trim().length > 0;

  function commit() {
    if (!ready) return;
    const project: FiveProject = {
      id: generateId("p"),
      name: name.trim(),
      type: "creative",
      bigGoal:
        "Revive this project gently — restore flow, not start over.",
      whyItMatters: why.trim(),
      frequency: "weekly",
      durationMinutes: 5,
      stage: "rescued",
      guidanceStyle: "gentle",
      aiSupportLevel: "light",
      createdAt: new Date().toISOString(),
      rescue: {
        whenItStopped: stopped.trim(),
        whyItStopped: why.trim(),
        whatStillExists: stillExists.trim(),
        doesItStillMatter: stillMatters,
        revivalDefinition: revival.trim(),
      },
    };
    const milestones: Array<{ title: string; body?: string }> = [
      {
        title: "Open the old version",
        body: "A small, low-pressure return to whatever still exists.",
      },
      {
        title: "Keep what is still true",
        body: "Identify the parts of the old version you still believe in.",
      },
      {
        title: "Quietly continue",
        body: revival.trim(),
      },
    ];
    onCommit(
      project,
      milestones,
      "Open the old files and read for five minutes. No decisions today.",
    );
  }

  return (
    <FormShell
      title="Bring it back to life. Not from scratch."
      eyebrow="rescue an abandoned project"
      onCancel={onCancel}
      onCommit={commit}
      commitLabel="Begin the rescue"
      ready={ready}
    >
      <Field label="01 · name">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="The old book draft · The startup idea from 2022…"
          className="w-full border-b border-line bg-transparent pb-2 text-xl font-light tracking-brand text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="02 · when did it stop?">
        <input
          type="text"
          value={stopped}
          onChange={(e) => setStopped(e.target.value)}
          placeholder="Roughly when?"
          className="w-full border-b border-line bg-transparent pb-2 text-[15px] font-light text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="03 · why did it stop?">
        <textarea
          rows={2}
          value={why}
          onChange={(e) => setWhy(e.target.value)}
          placeholder="The honest answer, not the polished one."
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="04 · what still exists?">
        <textarea
          rows={2}
          value={stillExists}
          onChange={(e) => setStillExists(e.target.value)}
          placeholder="Notes, files, a folder, a half-built draft."
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
      <Field label="05 · does it still matter to you?">
        <div className="flex flex-wrap gap-2">
          {(
            [
              { id: "yes", label: "Yes" },
              { id: "maybe", label: "Maybe" },
              { id: "not-sure", label: "Not sure" },
            ] as const
          ).map((o) => (
            <Pill
              key={o.id}
              active={stillMatters === o.id}
              onClick={() => setStillMatters(o.id)}
            >
              {o.label}
            </Pill>
          ))}
        </div>
      </Field>
      <Field label="06 · what would count as revival?">
        <textarea
          rows={2}
          value={revival}
          onChange={(e) => setRevival(e.target.value)}
          placeholder="The smallest definition of 'this is alive again'."
          className="w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink focus:border-ink/40 focus:outline-none"
        />
      </Field>
    </FormShell>
  );
}

// ── Form primitives ───────────────────────────────────────────────
function FormShell({
  eyebrow,
  title,
  onCancel,
  onCommit,
  commitLabel,
  ready,
  children,
}: {
  eyebrow: string;
  title: string;
  onCancel: () => void;
  onCommit: () => void;
  commitLabel: string;
  ready: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface p-6 md:p-8">
      <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-xl font-light tracking-brand text-ink md:text-2xl">
        {title}
      </h2>
      <div className="mt-8 space-y-8">{children}</div>
      <div className="mt-10 flex items-center justify-between gap-3 border-t border-line/70 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          cancel
        </button>
        <Button
          variant="primary"
          size="md"
          onClick={onCommit}
          disabled={!ready}
          className={cn(!ready && "cursor-not-allowed opacity-40")}
        >
          {commitLabel}
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </p>
      {hint && (
        <p className="mt-1 max-w-prose text-[12.5px] font-light italic leading-relaxed text-ink-mute">
          {hint}
        </p>
      )}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function ChipGrid<T extends string>({
  options,
  value,
  onSelect,
  labels,
}: {
  options: readonly T[];
  value: T;
  onSelect: (v: T) => void;
  labels: Record<T, string>;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <Pill key={o} active={value === o} onClick={() => onSelect(o)}>
          {labels[o]}
        </Pill>
      ))}
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 items-center rounded-full border px-3 text-[12.5px] font-light transition-colors",
        active
          ? "border-ink/50 bg-ink text-paper"
          : "border-line text-ink-soft hover:border-ink/30 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
