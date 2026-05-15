import type { SoloInsight } from "@/lib/solo/types";

export function SoloInsights({ insights }: { insights: SoloInsight[] }) {
  if (insights.length === 0) return null;
  return (
    <ul className="space-y-3">
      {insights.map((it) => (
        <li
          key={it.kind}
          className="flex items-start gap-3 text-[15px] font-light leading-relaxed text-ink-soft"
        >
          <span
            aria-hidden="true"
            className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-ink/40"
          />
          <span>{it.body}</span>
        </li>
      ))}
    </ul>
  );
}
