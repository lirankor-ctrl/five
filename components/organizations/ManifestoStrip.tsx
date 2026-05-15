import { cn } from "@/lib/cn";

/**
 * A compact strip of organizational manifesto quotes. Used on the
 * landing page and as a calm decorative footer on the analytics page.
 */
export function ManifestoStrip({
  variant = "stacked",
  className,
}: {
  variant?: "stacked" | "compact";
  className?: string;
}) {
  const items = [
    "Organizations don’t collapse in one moment. They erode in the absence of small human moments.",
    "Culture is not built in workshops. It is built in micro-actions.",
    "Five minutes of real attention can change an organization.",
    "The small drops inside organizations become the river of culture.",
    "You don’t need another organizational revolution. You need five.",
  ];

  if (variant === "compact") {
    return (
      <ul
        className={cn(
          "grid grid-cols-1 gap-3 text-[14px] font-light italic leading-relaxed text-ink-soft md:grid-cols-2",
          className,
        )}
      >
        {items.map((it, i) => (
          <li key={i} className="border-l border-line pl-4">
            {it}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul
      className={cn(
        "mx-auto flex max-w-3xl flex-col gap-10 text-balance text-center",
        className,
      )}
    >
      {items.map((it, i) => (
        <li
          key={i}
          className="text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl"
        >
          <span aria-hidden="true" className="text-ink-mute">“</span>
          {it}
          <span aria-hidden="true" className="text-ink-mute">”</span>
        </li>
      ))}
    </ul>
  );
}
