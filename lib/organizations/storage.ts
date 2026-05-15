"use client";

import { sampleOrg } from "@/data/organizations/sample";
import type {
  Campaign,
  CampaignAction,
  OrganizationsState,
  ReflectionEntry,
  Role,
} from "./types";

const KEY = "five.organizations.v1";

const defaultState: OrganizationsState = {
  currentRole: "admin",
  currentOrgId: sampleOrg.id,
  currentMemberId: "m-anna",
  campaigns: [],
  actions: [],
  reflections: [],
  version: 1,
};

export function loadState(): OrganizationsState {
  if (typeof window === "undefined") return defaultState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<OrganizationsState>;
    return {
      currentRole: (parsed.currentRole as Role) ?? "admin",
      currentOrgId: parsed.currentOrgId ?? sampleOrg.id,
      currentMemberId: parsed.currentMemberId ?? "m-anna",
      campaigns: Array.isArray(parsed.campaigns) ? parsed.campaigns : [],
      actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      reflections: Array.isArray(parsed.reflections) ? parsed.reflections : [],
      version: 1,
    };
  } catch {
    return defaultState;
  }
}

export function saveState(state: OrganizationsState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function generateId(prefix = "x"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function setRole(state: OrganizationsState, role: Role): OrganizationsState {
  // Move "you" to a plausible member for the chosen role.
  const fallbackByRole: Record<Role, string> = {
    admin: "m-anna",
    manager: "m-elena",
    employee: "m-david",
  };
  return {
    ...state,
    currentRole: role,
    currentMemberId: fallbackByRole[role],
  };
}

export function addCampaign(
  state: OrganizationsState,
  campaign: Campaign,
): OrganizationsState {
  return { ...state, campaigns: [...state.campaigns, campaign] };
}

export function updateCampaign(
  state: OrganizationsState,
  campaignId: string,
  patch: Partial<Campaign>,
): OrganizationsState {
  return {
    ...state,
    campaigns: state.campaigns.map((c) =>
      c.id === campaignId ? { ...c, ...patch } : c,
    ),
  };
}

export function deleteCampaign(
  state: OrganizationsState,
  campaignId: string,
): OrganizationsState {
  return {
    ...state,
    campaigns: state.campaigns.filter((c) => c.id !== campaignId),
    actions: state.actions.filter((a) => a.campaignId !== campaignId),
    reflections: state.reflections.filter((r) => r.campaignId !== campaignId),
  };
}

export function upsertAction(
  state: OrganizationsState,
  entry: CampaignAction,
): OrganizationsState {
  const others = state.actions.filter(
    (a) => !(a.campaignId === entry.campaignId && a.actorId === entry.actorId && a.date === entry.date),
  );
  return { ...state, actions: [...others, entry] };
}

export function addReflection(
  state: OrganizationsState,
  entry: ReflectionEntry,
): OrganizationsState {
  return { ...state, reflections: [...state.reflections, entry] };
}

export function clearAll(): OrganizationsState {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      // ignore
    }
  }
  return defaultState;
}
