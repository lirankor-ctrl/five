"use client";

import { cn } from "@/lib/cn";
import { getCampaignType } from "@/data/organizations/campaign-types";
import {
  campaignAudience,
  engagementSeries,
  totalParticipation14d,
} from "@/lib/organizations/analytics";
import type { Campaign, CampaignAction, Organization } from "@/lib/organizations/types";

type Props = {
  campaign: Campaign;
  actions: CampaignAction[];
  org: Organization;
  onOpen: () => void;
};

export function CampaignCard({ campaign, actions, org, onOpen }: Props) {
  const meta = getCampaignType(campaign.type);
  const series = engagementSeries(campaign, actions, org, 14);
  const audience = campaignAudience(campaign, org);
  const participation = totalParticipation14d(campaign, actions, org);
  const totalActionsLast14 = series.reduce((a, s) => a + s.actionsCount, 0);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full flex-col rounded-2xl border border-line bg-surface p-6 text-left transition-all duration-300 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-7"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-base font-light text-ink-soft group-hover:border-ink/30 group-hover:text-ink"
          >
            {meta.glyph}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {meta.label} · {campaign.cadence}
            </p>
            <h3 className="mt-1 truncate text-[16.5px] font-light tracking-brand text-ink md:text-lg">
              {campaign.name}
            </h3>
          </div>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-light uppercase tracking-[0.2em]",
            campaign.active
              ? "border-ink/30 bg-paper text-ink"
              : "border-line text-ink-mute",
          )}
        >
          {campaign.active ? "active" : "paused"}
        </span>
      </div>

      <p className="mt-5 text-[14px] font-light leading-relaxed text-ink-soft">
        {campaign.goal}
      </p>

      <div className="mt-5 flex items-center gap-2">
        {series.map((s, i) => (
          <span
            key={s.date + i}
            className="block w-1.5 rounded-full bg-ink/70"
            style={{
              height: `${Math.max(2, Math.min(20, s.participationRate * 20))}px`,
              opacity: 0.25 + s.participationRate * 0.75,
            }}
            aria-hidden="true"
          />
        ))}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-4 border-t border-line/60 pt-5 text-[12px] font-light text-ink-soft">
        <Stat label="participation" value={`${Math.round(participation * 100)}%`} />
        <Stat label="actions · 14d" value={`${totalActionsLast14}`} />
        <Stat label="audience" value={`${audience.size}`} />
      </div>
    </button>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-1 text-base font-light tracking-brand text-ink md:text-lg">
        {value}
      </p>
    </div>
  );
}
