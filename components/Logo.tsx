import { cn } from "@/lib/cn";

type LogoProps = {
  variant?: "wordmark" | "mark";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

/**
 * The "five" wordmark, rendered as thin sans-serif text to match the logo.
 * Use `variant="mark"` to render the rounded squircle app-icon version.
 */
export function Logo({
  variant = "wordmark",
  size = "md",
  className,
}: LogoProps) {
  if (variant === "mark") {
    return <LogoMark size={size} className={className} />;
  }
  return <LogoWordmark size={size} className={className} />;
}

const wordmarkSize: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-6xl",
  xl: "text-8xl",
};

function LogoWordmark({
  size = "md",
  className,
}: Pick<LogoProps, "size" | "className">) {
  return (
    <span
      aria-label="five"
      className={cn(
        "inline-block font-thin tracking-brand leading-none text-ink",
        wordmarkSize[size],
        className,
      )}
    >
      five
    </span>
  );
}

const markSize: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-9 w-9 text-base",
  md: "h-12 w-12 text-xl",
  lg: "h-20 w-20 text-3xl",
  xl: "h-28 w-28 text-5xl",
};

function LogoMark({
  size = "md",
  className,
}: Pick<LogoProps, "size" | "className">) {
  return (
    <span
      aria-label="five"
      className={cn(
        "inline-flex items-center justify-center rounded-squircle bg-ink text-paper shadow-soft",
        markSize[size],
        className,
      )}
    >
      <span className="font-thin tracking-brand leading-none">five</span>
    </span>
  );
}
