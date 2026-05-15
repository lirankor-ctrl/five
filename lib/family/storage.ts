"use client";

import type {
  FamilyGroup,
  FamilyMember,
  FamilySession,
  FamilyState,
  Ritual,
} from "./types";

const KEY = "five.family.v1";

const defaultState: FamilyState = {
  group: null,
  rituals: [],
  sessions: [],
  version: 1,
};

export function loadState(): FamilyState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<FamilyState>;
    return {
      group: parsed.group ?? null,
      rituals: Array.isArray(parsed.rituals) ? parsed.rituals : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      dismissedTodayPrompt: parsed.dismissedTodayPrompt,
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: FamilyState): void {
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

export function setGroup(
  state: FamilyState,
  group: FamilyGroup,
): FamilyState {
  return { ...state, group };
}

export function addMember(
  state: FamilyState,
  member: FamilyMember,
): FamilyState {
  if (!state.group) return state;
  return {
    ...state,
    group: { ...state.group, members: [...state.group.members, member] },
  };
}

export function removeMember(
  state: FamilyState,
  memberId: string,
): FamilyState {
  if (!state.group) return state;
  return {
    ...state,
    group: {
      ...state.group,
      members: state.group.members.filter((m) => m.id !== memberId),
    },
    rituals: state.rituals.map((r) => ({
      ...r,
      participantIds: r.participantIds.filter((id) => id !== memberId),
    })),
  };
}

export function addRitual(
  state: FamilyState,
  ritual: Ritual,
): FamilyState {
  return { ...state, rituals: [...state.rituals, ritual] };
}

export function updateRitual(
  state: FamilyState,
  ritualId: string,
  patch: Partial<Ritual>,
): FamilyState {
  return {
    ...state,
    rituals: state.rituals.map((r) =>
      r.id === ritualId ? { ...r, ...patch } : r,
    ),
  };
}

export function removeRitual(
  state: FamilyState,
  ritualId: string,
): FamilyState {
  return {
    ...state,
    rituals: state.rituals.filter((r) => r.id !== ritualId),
  };
}

export function addSession(
  state: FamilyState,
  session: FamilySession,
): FamilyState {
  return { ...state, sessions: [...state.sessions, session] };
}

export function dismissTodayPrompt(
  state: FamilyState,
  dayKey: string,
): FamilyState {
  return { ...state, dismissedTodayPrompt: dayKey };
}

export function clearAll(): FamilyState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
