import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type CardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  interactive?: boolean;
};

/** A quiet, paper-feeling card with hairline border. */
export function Card({ children, className, href, interactive }: CardProps) {
  const base =
    "block rounded-2xl bg-surface border border-line p-6 md:p-7 transition-all duration-300 ease-calm";
  const hover = interactive || href
    ? "hover:border-ink/30 hover:shadow-soft hover:-translate-y-[1px]"
    : "";

  if (href) {
    return (
      <Link href={href} className={cn(base, hover, className)}>
        {children}
      </Link>
    );
  }
  return <div className={cn(base, hover, className)}>{children}</div>;
}
