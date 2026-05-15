import { cn } from "@/lib/cn";

/**
 * A large, calm pull quote. Used for manifesto-defining lines.
 */
export function Pullquote({
  children,
  attribution,
  className,
}: {
  children: React.ReactNode;
  attribution?: string;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "mx-auto my-16 max-w-[28ch] text-balance text-center md:my-24",
        className,
      )}
    >
      <blockquote className="font-serif text-3xl font-light leading-[1.25] tracking-[-0.01em] text-ink md:text-5xl">
        <span aria-hidden="true" className="text-ink-mute">
          “
        </span>
        {children}
        <span aria-hidden="true" className="text-ink-mute">
          ”
        </span>
      </blockquote>
      {attribution && (
        <figcaption className="mt-6 text-xs font-light uppercase tracking-[0.25em] text-ink-mute">
          {attribution}
        </figcaption>
      )}
    </figure>
  );
}
