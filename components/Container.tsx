import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Size = "narrow" | "default" | "wide";

const widths: Record<Size, string> = {
  narrow: "max-w-3xl",
  default: "max-w-5xl",
  wide: "max-w-6xl",
};

export function Container({
  children,
  size = "default",
  className,
}: {
  children: ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6 md:px-10",
        widths[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
