"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { sampleMembers, sampleOrg } from "@/data/organizations/sample";
import {
  merge,
  totalParticipation14d,
} from "@/lib/organizations/analytics";
import { generateOrganizationalInsights } from "@/lib/organizations/insights";
import {
  addCampaign,
  addReflection,
  deleteCampaign,
  loadState,
  saveState,
  setRole,
  upsertAction,
} from "@/lib/organizations/storage";
import type {
  Campaign,
  CampaignAction,
  OrganizationsState,
  ReflectionEntry,
  Role,
} from "@/lib/organizations/types";
import { ActionFeed } from "./ActionFeed";
import { CampaignBuilder } from "./CampaignBuilder";
import { CampaignCard } from "./CampaignCard";
import { CampaignDetail } from "./CampaignDetail";
import { InsightsPanel } from "./InsightsPanel";
import { RoleSwitcher } from "./RoleSwitcher";

const DEFAULT_STATE: OrganizationsState = {
  currentRole: "admin",
  currentOrgId: sampleOrg.id,
  currentMemberId: "m-anna",
  campaigns: [],
  actions: [],
  reflections: [],
  version: 1,
};

export function OrganizationsConsole() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<OrganizationsState>(DEFAULT_STATE);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [openCampaignId, setOpenCampaignId] = useState<string | null>(null);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: OrganizationsState) => {
    setState(next);
    saveState(next);
  }, []);

  const data = useMemo(() => merge(state), [state]);
  const insights = useMemo(
    () => generateOrganizationalInsights(data),
    [data],
  );

  const role: Role = state.currentRole;
  const currentMember = sampleMembers[state.currentMemberId] ?? sampleMembers["m-anna"];

  // Visible campaigns depend on role:
  //   admin -> all active campaigns
  //   manager -> campaigns relevant to manager's department or open to managers
  //   employee -> campaigns the employee is in the audience for
  const visibleCampaigns = useMemo(() => {
    return data.campaigns
      .filter((c) => c.active)
      .filter((c) => {
        if (role === "admin") return true;
        if (role === "manager") {
          const inDept =
            c.departmentIds.length === 0 ||
            c.departmentIds.includes(currentMember.departmentId);
          return inDept && (c.targetRole === undefined || c.targetRole === "manager");
        }
        const inDept =
          c.departmentIds.length === 0 ||
          c.departmentIds.includes(currentMember.departmentId);
        return inDept && (c.targetRole === undefined || c.targetRole === "employee");
      })
      .sort((a, b) => {
        const pa = totalParticipation14d(a, data.actions, data.org);
        const pb = totalParticipation14d(b, data.actions, data.org);
        return pb - pa;
      });
  }, [data, role, currentMember]);

  const openCampaign = data.campaigns.find((c) => c.id === openCampaignId) ?? null;
  const isUserCreated = openCampaign
    ? state.campaigns.some((c) => c.id === openCampaign.id)
    : false;

  function handleCreateCampaign(campaign: Campaign) {
    persist(addCampaign(state, campaign));
    setBuilderOpen(false);
    setOpenCampaignId(campaign.id);
  }

  function handleLogAction(action: CampaignAction) {
    persist(upsertAction(state, action));
  }

  function handleAddReflection(entry: ReflectionEntry) {
    persist(addReflection(state, entry));
  }

  function handleDeleteCampaign(id: string) {
    persist(deleteCampaign(state, id));
    if (openCampaignId === id) setOpenCampaignId(null);
  }

  function handleRoleChange(next: Role) {
    persist(setRole(state, next));
    setOpenCampaignId(null);
  }

  if (!hydrated) {
    return (
      <Container size="default" className="pb-24 pt-10 md:pt-16">
        <p className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          one moment…
        </p>
      </Container>
    );
  }

  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
            five organizations · console
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
            {data.org.name}.
          </h1>
          <p className="mt-2 max-w-prose text-[14px] font-light text-ink-soft">
            {data.org.tagline}
          </p>
        </div>
        <RoleSwitcher
          role={role}
          memberName={currentMember.name}
          onChange={handleRoleChange}
        />
      </header>

      {/* Campaign detail (in place, not modal) when one is selected */}
      {openCampaign && (
        <section className="mt-10">
          <CampaignDetail
            campaign={openCampaign}
            org={data.org}
            actions={data.actions}
            reflections={data.reflections}
            currentMemberId={currentMember.id}
            currentMemberName={currentMember.name}
            onLogAction={handleLogAction}
            onAddReflection={handleAddReflection}
            onClose={() => setOpenCampaignId(null)}
            onDelete={
              isUserCreated
                ? () => handleDeleteCampaign(openCampaign.id)
                : undefined
            }
          />
        </section>
      )}

      {/* Campaigns */}
      <section className="mt-10">
        <header className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {role === "employee"
                ? "your campaigns"
                : role === "manager"
                  ? "campaigns for your team"
                  : "active campaigns"}
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              {role === "employee"
                ? "Five minutes, on the days you can."
                : role === "manager"
                  ? "What your team is running."
                  : "Quiet practices in motion."}
            </h2>
          </div>
          {role !== "employee" && (
            <Button
              variant="primary"
              size="md"
              onClick={() => setBuilderOpen(true)}
            >
              + new campaign
            </Button>
          )}
        </header>

        {visibleCampaigns.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-8 text-center">
            <p className="text-[14px] font-light text-ink-soft">
              No active campaigns yet. Start one above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {visibleCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                campaign={c}
                actions={data.actions}
                org={data.org}
                onOpen={() => setOpenCampaignId(c.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Action feed + Insights */}
      <section className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <header className="mb-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              recent activity
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              The drops, as they fall.
            </h2>
          </header>
          <ActionFeed
            actions={data.actions}
            reflections={data.reflections}
            campaigns={data.campaigns}
            members={sampleMembers}
            limit={12}
          />
        </div>
        <div>
          <header className="mb-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              organizational observations
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              What the data is quietly saying.
            </h2>
          </header>
          <InsightsPanel insights={insights} />
          <p className="mt-4 max-w-[34ch] text-[12px] font-light leading-relaxed text-ink-mute">
            A future organizational AI coaching layer will deepen these — without becoming a surveillance tool. Tone stays calm.
          </p>
        </div>
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light text-ink-mute">
          Culture is built in micro-actions.
        </p>
      </div>

      <CampaignBuilder
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onCreate={handleCreateCampaign}
      />
    </Container>
  );
}
