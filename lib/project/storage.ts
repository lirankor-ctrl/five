"use client";

import type {
  FiveAction,
  FiveProject,
  ProjectMilestone,
  ProjectPivot,
  ProjectReflection,
  ProjectsState,
} from "./types";

const KEY = "five.project.v1";

const defaultState: ProjectsState = {
  projects: [],
  milestones: [],
  actions: [],
  reflections: [],
  pivots: [],
  version: 1,
};

export function loadState(): ProjectsState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<ProjectsState>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      milestones: Array.isArray(parsed.milestones) ? parsed.milestones : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
      pivots: Array.isArray(parsed.pivots) ? parsed.pivots : [],
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: ProjectsState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function generateId(prefix = "x"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}

// ─── Project mutations ─────────────────────────────────────────
export function addProject(
  state: ProjectsState,
  project: FiveProject,
): ProjectsState {
  return { ...state, projects: [...state.projects, project] };
}

export function updateProject(
  state: ProjectsState,
  projectId: string,
  patch: Partial<FiveProject>,
): ProjectsState {
  return {
    ...state,
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, ...patch } : p,
    ),
  };
}

export function archiveProject(
  state: ProjectsState,
  projectId: string,
): ProjectsState {
  return updateProject(state, projectId, {
    archivedAt: new Date().toISOString(),
  });
}

export function deleteProject(
  state: ProjectsState,
  projectId: string,
): ProjectsState {
  return {
    ...state,
    projects: state.projects.filter((p) => p.id !== projectId),
    milestones: state.milestones.filter((m) => m.projectId !== projectId),
    actions: state.actions.filter((a) => a.projectId !== projectId),
    reflections: state.reflections.filter((r) => r.projectId !== projectId),
    pivots: state.pivots.filter((p) => p.projectId !== projectId),
  };
}

export function pivotProject(
  state: ProjectsState,
  projectId: string,
  toName: string,
  reason: string,
): ProjectsState {
  const project = state.projects.find((p) => p.id === projectId);
  if (!project) return state;
  const pivot: ProjectPivot = {
    id: generateId("pv"),
    projectId,
    fromName: project.name,
    toName,
    reason,
    pivotedAt: new Date().toISOString(),
  };
  return {
    ...state,
    projects: state.projects.map((p) =>
      p.id === projectId ? { ...p, name: toName } : p,
    ),
    pivots: [...state.pivots, pivot],
  };
}

// ─── Milestones ────────────────────────────────────────────────
export function addMilestone(
  state: ProjectsState,
  milestone: ProjectMilestone,
): ProjectsState {
  return { ...state, milestones: [...state.milestones, milestone] };
}

export function toggleMilestoneDone(
  state: ProjectsState,
  milestoneId: string,
): ProjectsState {
  return {
    ...state,
    milestones: state.milestones.map((m) =>
      m.id === milestoneId
        ? { ...m, doneAt: m.doneAt ? undefined : new Date().toISOString() }
        : m,
    ),
  };
}

// ─── Actions ───────────────────────────────────────────────────
export function addAction(
  state: ProjectsState,
  action: FiveAction,
): ProjectsState {
  return { ...state, actions: [...state.actions, action] };
}

export function markActionDone(
  state: ProjectsState,
  actionId: string,
): ProjectsState {
  return {
    ...state,
    actions: state.actions.map((a) =>
      a.id === actionId
        ? { ...a, status: "done", doneAt: new Date().toISOString() }
        : a,
    ),
  };
}

export function skipAction(
  state: ProjectsState,
  actionId: string,
): ProjectsState {
  return {
    ...state,
    actions: state.actions.map((a) =>
      a.id === actionId ? { ...a, status: "skipped" } : a,
    ),
  };
}

// ─── Reflections ───────────────────────────────────────────────
export function addReflection(
  state: ProjectsState,
  reflection: ProjectReflection,
): ProjectsState {
  return { ...state, reflections: [...state.reflections, reflection] };
}

export function clearAll(): ProjectsState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
