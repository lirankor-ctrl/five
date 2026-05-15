import type { ContentInsight } from "@/lib/content/types";

export function ContentInsightsPanel({
  insights,
}: {
  insights: ContentInsight[];
}) {
  if (insights.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6">
        <p className="text-[14px] font-light text-ink-soft">
          A few completed sessions and quiet patterns will start surfacing here. Nothing pushy — just what your behaviour says.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3 rounded-2xl border border-line bg-surface p-6">
      {insights.map((it) => (
        <li
          key={it.kind + it.body}
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
