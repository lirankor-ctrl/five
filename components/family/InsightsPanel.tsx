import type { FamilyInsight } from "@/lib/family/types";

export function InsightsPanel({ insights }: { insights: FamilyInsight[] }) {
  if (insights.length === 0) return null;
  return (
    <ul className="space-y-3 rounded-3xl border border-hearth-200 bg-hearth-50 p-6">
      {insights.map((it) => (
        <li
          key={it.id}
          className="flex items-start gap-3 text-[15px] font-light leading-relaxed text-ink-soft"
        >
          <span
            aria-hidden="true"
            className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-hearth-500"
          />
          <span>{it.body}</span>
        </li>
      ))}
    </ul>
  );
}
