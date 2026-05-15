import { cn } from "@/lib/cn";

/**
 * Calm pulse dot for "live now" state. Uses Tailwind's animate-pulse,
 * intentionally muted (no red). Avoid the chat-app urgency.
 */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("relative inline-flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-ink" />
    </span>
  );
}
