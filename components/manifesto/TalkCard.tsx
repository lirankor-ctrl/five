import { cn } from "@/lib/cn";
import type { Talk } from "@/lib/manifesto/types";
import { talkKindLabel } from "@/data/manifesto/talks";

export function TalkCard({ talk }: { talk: Talk }) {
  const statusLabel =
    talk.status === "in-development" ? "In development" : "Coming soon";

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl border border-line bg-surface p-7 transition-all duration-500 ease-calm md:p-9",
      )}
    >
      <div className="flex items-center justify-between gap-4 text-[11px] font-light uppercase tracking-[0.25em]">
        <span className="text-ink">{talkKindLabel[talk.kind]}</span>
        <span className="text-ink-mute">{statusLabel}</span>
      </div>

      <h3 className="font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink md:text-3xl">
        {talk.title}
      </h3>

      {talk.speaker && (
        <p className="font-serif text-base font-light italic text-ink-soft">
          {talk.speaker}
        </p>
      )}

      <p className="max-w-[44ch] text-[15px] font-light leading-relaxed text-ink-soft">
        {talk.summary}
      </p>

      <div className="mt-2 flex items-center justify-between gap-4 border-t border-line/70 pt-5 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
        <span>{talk.durationMin} min</span>
        <span aria-hidden="true">·</span>
        <span>preview only</span>
      </div>
    </article>
  );
}
