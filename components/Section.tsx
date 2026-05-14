import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
};

/** A calm content block with consistent heading rhythm. */
export function Section({
  eyebrow,
  title,
  description,
  action,
  children,
  className,
}: SectionProps) {
  return (
    <section className={cn("py-12 md:py-16", className)}>
      {(eyebrow || title || description || action) && (
        <header className="mb-8 flex flex-col gap-3 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-prose">
            {eyebrow && (
              <p className="mb-3 text-xs font-light uppercase tracking-[0.2em] text-ink-mute">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="text-2xl font-light tracking-brand text-ink md:text-3xl">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                {description}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
