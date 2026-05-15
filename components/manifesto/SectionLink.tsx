import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  ordinal: string;
  title: string;
  description: string;
  meta?: string;
  className?: string;
};

/**
 * A premium editorial card that links to another section of the manifesto.
 * Used on the landing page to gesture out to The Book, Research, etc.
 */
export function SectionLink({
  href,
  ordinal,
  title,
  description,
  meta,
  className,
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-5 rounded-2xl border border-line bg-surface p-7 transition-all duration-500 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-9",
        className,
      )}
    >
      <span className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
        {ordinal}
      </span>
      <h3 className="font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink md:text-3xl">
        {title}
      </h3>
      <p className="max-w-[40ch] text-[15px] font-light leading-relaxed text-ink-soft">
        {description}
      </p>
      <div className="mt-2 flex items-center justify-between text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
        <span>{meta ?? "Enter"}</span>
        <span
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5"
        >
          →
        </span>
      </div>
    </Link>
  );
}
