import { cn } from "@/lib/cn";

/** A whisper-thin horizontal line — the subtle "river" motif. */
export function RiverLine({ className }: { className?: string }) {
  return <div className={cn("river-line", className)} aria-hidden="true" />;
}
