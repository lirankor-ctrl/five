import { cn } from "@/lib/cn";

export function SectionHeader({
  eyebrow,
  title,
  className,
}: {
  eyebrow: string;
  title: string;
  className?: string;
}) {
  return (
    <header className={cn("mx-auto max-w-[28ch] text-center", className)}>
      <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
        {eyebrow}
      </p>
      <h2 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-ink md:text-4xl">
        {title}
      </h2>
    </header>
  );
}
