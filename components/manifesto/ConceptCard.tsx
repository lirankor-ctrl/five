import Link from "next/link";
import { cn } from "@/lib/cn";

export function ConceptCard({
  href,
  title,
  oneLine,
  featured,
  className,
}: {
  href: string;
  title: string;
  oneLine: string;
  featured?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border border-line bg-surface p-7 transition-all duration-500 ease-calm hover:-translate-y-[1px] hover:border-ink/30 hover:shadow-soft md:p-9",
        featured && "border-ink/30 bg-paper",
        className,
      )}
    >
      <h3 className="font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink md:text-3xl">
        {title}
      </h3>
      <p className="max-w-[44ch] font-serif text-[16px] font-light italic leading-relaxed text-ink-soft">
        {oneLine}
      </p>
      <div className="mt-2 text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute transition-colors group-hover:text-ink">
        read →
      </div>
    </Link>
  );
}
