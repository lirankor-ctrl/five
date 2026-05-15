"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { sampleMembers } from "@/data/organizations/sample";
import {
  cultureSignals,
  departmentPulse,
  memberMomentum,
  merge,
  totalParticipation14d,
} from "@/lib/organizations/analytics";
import { generateOrganizationalInsights } from "@/lib/organizations/insights";
import { loadState } from "@/lib/organizations/storage";
import type { OrganizationsState } from "@/lib/organizations/types";
import { ActionFeed } from "./ActionFeed";
import { EngagementHeatmap } from "./EngagementHeatmap";
import { InsightsPanel } from "./InsightsPanel";
import { ManifestoStrip } from "./ManifestoStrip";
import { MomentumChart } from "./MomentumChart";

const DEFAULT_STATE: OrganizationsState = {
  currentRole: "admin",
  currentOrgId: "org-northstar",
  currentMemberId: "m-anna",
  campaigns: [],
  actions: [],
  reflections: [],
  version: 1,
};

export function AnalyticsView() {
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<OrganizationsState>(DEFAULT_STATE);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const data = useMemo(() => merge(state), [state]);
  const signals = useMemo(() => cultureSignals(data), [data]);
  const pulses = useMemo(() => departmentPulse(data), [data]);
  const momentum = useMemo(() => memberMomentum(data), [data]);
  const insights = useMemo(
    () => generateOrganizationalInsights(data),
    [data],
  );

  const topMembers = momentum
    .slice()
    .sort((a, b) => b.consistency14d - a.consistency14d)
    .slice(0, 5);

  const activeCampaigns = data.campaigns.filter((c) => c.active);
  const orgParticipation =
    activeCampaigns.length === 0
      ? 0
      : activeCampaigns.reduce(
          (a, c) => a + totalParticipation14d(c, data.actions, data.org),
          0,
        ) / activeCampaigns.length;

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
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line/60 pb-8">
        <div>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
            five organizations · analytics
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-brand text-ink md:text-4xl">
            Organizational pulse.
          </h1>
          <p className="mt-2 max-w-prose text-[14px] font-light text-ink-soft">
            A calm executive view. Density of human moments — not surveillance, not productivity scoring.
          </p>
        </div>
        <div className="flex items-baseline gap-8">
          <Headline
            value={`${Math.round(orgParticipation * 100)}%`}
            label="org participation · 14d"
          />
          <Headline
            value={`${data.actions.filter((a) => a.status === "done").length}`}
            label="done actions · all time"
          />
          <Headline
            value={`${activeCampaigns.length}`}
            label="active campaigns"
          />
        </div>
      </header>

      {/* Culture signals */}
      <section className="mt-10">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            culture signals
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            The six quiet currents.
          </h2>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {signals.map((s) => (
            <div
              key={s.id}
              className="rounded-2xl border border-line bg-surface p-5"
            >
              <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {s.label}
              </p>
              <p className="mt-3 text-3xl font-thin tracking-brand text-ink">
                {Math.round(s.value * 100)}%
              </p>
              <p
                className={cn(
                  "mt-2 text-[11px] font-light uppercase tracking-[0.22em]",
                  s.trend === "up"
                    ? "text-ink"
                    : s.trend === "down"
                      ? "text-ink-mute"
                      : "text-ink-mute",
                )}
              >
                {s.trend === "up" ? "↑ trending" : s.trend === "down" ? "↓ quieter" : "· steady"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Momentum chart */}
      <section className="mt-10">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            momentum
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            Average daily participation.
          </h2>
        </header>
        <MomentumChart data={data} />
      </section>

      {/* Engagement heatmap */}
      <section className="mt-12">
        <header className="mb-5">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            engagement heatmap
          </p>
          <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
            Where the moments are landing.
          </h2>
        </header>
        <div className="rounded-2xl border border-line bg-surface p-5 md:p-6">
          <EngagementHeatmap state={state} />
        </div>
      </section>

      {/* Department pulse + Top members */}
      <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            department pulse · 14d
          </p>
          <ul className="mt-4 space-y-3">
            {pulses.map((p) => (
              <li key={p.department.id}>
                <div className="flex items-center justify-between text-[14px] font-light">
                  <span className="text-ink">{p.department.name}</span>
                  <span className="text-ink-mute tabular-nums">
                    {Math.round(p.pulse * 100)}%
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full bg-ink"
                    style={{ width: `${Math.round(p.pulse * 100)}%`, opacity: 0.4 + p.pulse * 0.6 }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
            steadiest people · 14d
          </p>
          <ul className="mt-4 divide-y divide-line">
            {topMembers.map((m) => {
              const member = sampleMembers[m.memberId];
              return (
                <li
                  key={m.memberId}
                  className="flex items-center justify-between gap-3 py-3 text-[14px] font-light"
                >
                  <span className="text-ink">{member?.name ?? m.memberId}</span>
                  <span className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    {m.streak}d streak · {Math.round(m.consistency14d * 100)}%
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[12px] font-light leading-relaxed text-ink-mute">
            Visible to admins only. Never used to rank or pressure — only to notice who is quietly steady.
          </p>
        </div>
      </section>

      {/* Recent activity + insights */}
      <section className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
        <div>
          <header className="mb-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              recent activity
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              The pulse, in motion.
            </h2>
          </header>
          <ActionFeed
            actions={data.actions}
            reflections={data.reflections}
            campaigns={data.campaigns}
            members={sampleMembers}
            limit={16}
          />
        </div>
        <div>
          <header className="mb-5">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              observations
            </p>
            <h2 className="mt-2 text-xl font-light tracking-brand text-ink md:text-2xl">
              Quiet patterns.
            </h2>
          </header>
          <InsightsPanel insights={insights} />
        </div>
      </section>

      <section className="mt-16 border-t border-line/70 pt-12">
        <p className="mb-6 text-center text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          why we measure
        </p>
        <ManifestoStrip variant="compact" />
      </section>

      <div className="mt-16 flex flex-col items-center gap-3 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light text-ink-mute">
          A calm, strategic view — not a surveillance dashboard.
        </p>
      </div>
    </Container>
  );
}

function Headline({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-1 text-2xl font-thin tracking-brand text-ink md:text-3xl">
        {value}
      </p>
    </div>
  );
}
