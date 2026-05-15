import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Reading container for long-form manifesto prose.
 *
 * Sets generous measure, line-height, and the scoped serif. Children should
 * be raw <p>/<h2> tags or composed editorial primitives — not arbitrary UI.
 */
export function Prose({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[64ch] font-serif text-[18px] font-light leading-[1.75] text-ink md:text-[19px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
