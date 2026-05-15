"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const ITEMS = [
  { href: "/cubes/family", label: "Manifesto", exact: true },
  { href: "/cubes/family/home", label: "Home" },
  { href: "/cubes/family/journal", label: "Journal" },
];

export function FamilyNav() {
  const path = usePathname();
  return (
    <div className="border-b border-line/60 bg-paper">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-6 py-4 text-xs font-light uppercase tracking-[0.2em] md:px-10">
        <Link href="/cubes" className="mr-3 text-ink-mute hover:text-ink">
          ← cubes
        </Link>
        <span aria-hidden="true" className="mr-3 text-ink-mute">·</span>
        {ITEMS.map((it) => {
          const active = it.exact
            ? path === it.href
            : path === it.href || path.startsWith(`${it.href}/`);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={cn(
                "rounded-full px-3 py-1.5 transition-colors",
                active
                  ? "bg-hearth-700 text-paper"
                  : "text-ink-mute hover:text-ink",
              )}
            >
              {it.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
