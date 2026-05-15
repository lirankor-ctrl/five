"use client";

import type {
  CubeSession,
  DraftCube,
  UserCube,
  YourOwnState,
} from "./types";

const KEY = "five.your-own.v1";

const defaultState: YourOwnState = {
  myCubes: [],
  sessions: [],
  followedCubes: [],
  draft: {},
  version: 1,
};

export function loadState(): YourOwnState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<YourOwnState>;
    return {
      myCubes: Array.isArray(parsed.myCubes) ? parsed.myCubes : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      followedCubes: Array.isArray(parsed.followedCubes)
        ? parsed.followedCubes
        : [],
      draft: parsed.draft ?? {},
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: YourOwnState): void {
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

export function publishCube(
  state: YourOwnState,
  cube: UserCube,
): YourOwnState {
  return { ...state, myCubes: [...state.myCubes, cube], draft: {} };
}

export function saveDraft(
  state: YourOwnState,
  draft: DraftCube,
): YourOwnState {
  return { ...state, draft };
}

export function clearDraft(state: YourOwnState): YourOwnState {
  return { ...state, draft: {} };
}

export function removeCube(
  state: YourOwnState,
  cubeId: string,
): YourOwnState {
  return {
    ...state,
    myCubes: state.myCubes.filter((c) => c.id !== cubeId),
    sessions: state.sessions.filter((s) => s.cubeId !== cubeId),
  };
}

export function toggleFollow(
  state: YourOwnState,
  cubeId: string,
): YourOwnState {
  const has = state.followedCubes.includes(cubeId);
  return {
    ...state,
    followedCubes: has
      ? state.followedCubes.filter((id) => id !== cubeId)
      : [...state.followedCubes, cubeId],
  };
}

export function addSession(
  state: YourOwnState,
  session: CubeSession,
): YourOwnState {
  return { ...state, sessions: [...state.sessions, session] };
}

/**
 * Duplicate / remix a community cube into the user's own drafts.
 * Preserves the original creator + bumps remix count locally.
 */
export function remixCube(
  state: YourOwnState,
  source: UserCube,
  newName?: string,
): { state: YourOwnState; draft: DraftCube } {
  const draft: DraftCube = {
    ...source,
    id: undefined,
    name: newName ?? `${source.name} (remix)`,
    creatorId: "user-me",
    creatorName: "You",
    visibility: "private",
    status: "draft",
    createdAt: undefined,
    followers: undefined,
    remixCount: undefined,
    evolutionVotes: undefined,
  };
  return { state: { ...state, draft }, draft };
}
