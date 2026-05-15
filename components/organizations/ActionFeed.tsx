import { cn } from "@/lib/cn";
import { getCampaignType } from "@/data/organizations/campaign-types";
import type {
  Campaign,
  CampaignAction,
  Member,
  ReflectionEntry,
} from "@/lib/organizations/types";

type Props = {
  actions: CampaignAction[];
  reflections: ReflectionEntry[];
  campaigns: Campaign[];
  members: Record<string, Member>;
  limit?: number;
};

/**
 * Calm feed of recent done-actions and reflections across the org. Used
 * on the console and (in lighter form) on the analytics page.
 */
export function ActionFeed({
  actions,
  reflections,
  campaigns,
  members,
  limit = 12,
}: Props) {
  const items = [
    ...actions
      .filter((a) => a.status === "done")
      .map((a) => ({
        id: a.id,
        kind: "action" as const,
        at: a.reportedAt,
        action: a,
      })),
    ...reflections.map((r) => ({
      id: r.id,
      kind: "reflection" as const,
      at: r.createdAt,
      reflection: r,
    })),
  ];

  items.sort((a, b) => (a.at < b.at ? 1 : -1));
  const visible = items.slice(0, limit);

  if (visible.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
        <p className="text-[14px] font-light text-ink-soft">
          Actions and reflections will appear here as they happen.
        </p>
      </div>
    );
  }

  const campaignMap = new Map(campaigns.map((c) => [c.id, c]));

  return (
    <ul className="divide-y divide-line border-y border-line">
      {visible.map((it) => {
        if (it.kind === "action") {
          const c = campaignMap.get(it.action.campaignId);
          const meta = c ? getCampaignType(c.type) : null;
          const member = members[it.action.actorId];
          return (
            <li key={it.id} className="flex items-start gap-4 py-4">
              <Dot tone="done" />
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-light text-ink">
                  <span className="text-ink-soft">{member?.name ?? "Someone"}</span>{" "}
                  ran a five in{" "}
                  <span className="text-ink">{c?.name ?? "a campaign"}</span>
                  {it.action.perceivedImpact && (
                    <span className="text-ink-mute">
                      {" "}
                      · {it.action.perceivedImpact} impact
                    </span>
                  )}
                  .
                </p>
                <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  {meta?.label}
                  <span aria-hidden="true"> · </span>
                  {timeAgoIso(it.action.reportedAt)}
                </p>
              </div>
            </li>
          );
        }
        const c = campaignMap.get(it.reflection.campaignId);
        const member = members[it.reflection.actorId];
        return (
          <li key={it.id} className="flex items-start gap-4 py-4">
            <Dot tone="reflection" />
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-light leading-relaxed text-ink">
                <span className="text-ink-soft">{member?.name ?? "Someone"}</span>{" "}
                wrote in <span className="text-ink">{c?.name ?? "a campaign"}</span>:
              </p>
              <p className="mt-1 text-[14px] font-light italic leading-relaxed text-ink-soft">
                “{it.reflection.text}”
              </p>
              <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {timeAgoIso(it.reflection.createdAt)}
                {it.reflection.tags && it.reflection.tags.length > 0 && (
                  <>
                    <span aria-hidden="true"> · </span>
                    <span>{it.reflection.tags.map((t) => `#${t}`).join(" ")}</span>
                  </>
                )}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Dot({ tone }: { tone: "done" | "reflection" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "mt-2 inline-block h-2 w-2 shrink-0 rounded-full",
        tone === "done" ? "bg-ink" : "bg-ink/30",
      )}
    />
  );
}

function timeAgoIso(iso: string): string {
  const t = new Date(iso).getTime();
  const diff = (Date.now() - t) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
