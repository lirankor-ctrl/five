import type { OrganizationalInsight } from "@/lib/organizations/types";

const KIND_LABEL: Record<OrganizationalInsight["kind"], string> = {
  consistency: "Consistency",
  "high-performing-team": "Team momentum",
  "burnout-risk": "Capacity signal",
  "campaign-effectiveness": "Campaign effectiveness",
  "behavior-correlation": "Reflection theme",
  "momentum-trend": "Momentum",
  "early-momentum": "Early days",
};

export function InsightsPanel({
  insights,
}: {
  insights: OrganizationalInsight[];
}) {
  if (insights.length === 0) return null;
  return (
    <ul className="space-y-3">
      {insights.map((it) => (
        <li
          key={it.id}
          className="rounded-2xl border border-line bg-surface p-5"
        >
          <p className="text-[10px] font-light uppercase tracking-[0.25em] text-ink-mute">
            {KIND_LABEL[it.kind]}
          </p>
          <p className="mt-2 text-[15px] font-light leading-relaxed text-ink">
            {it.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
