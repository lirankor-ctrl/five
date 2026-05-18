"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/cn";

const links = [
  { href: "/home", label: "Home" },
  { href: "/cubes", label: "Cubes" },
  { href: "/reflection", label: "Reflection" },
  { href: "/cubes/manifesto", label: "Manifesto" },
  { href: "/cubes/organizations", label: "Organizations" },
];

export function NavBar() {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  const activeHref = links
    .filter(
      (l) => pathname === l.href || pathname.startsWith(`${l.href}/`),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <header
      className={cn(
        "sticky top-0 z-30 backdrop-blur-md",
        isLanding ? "bg-paper/60" : "bg-paper/80 border-b border-line/70",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        <Link
          href={isLanding ? "/" : "/home"}
          className="flex items-center gap-3"
          aria-label="five — home"
        >
          <Logo variant="wordmark" size="sm" />
        </Link>

        {!isLanding && (
          <nav className="flex items-center gap-1">
            {links.map((link) => {
              const active = link.href === activeHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-light transition-colors duration-300 ease-calm md:px-4",
                    active
                      ? "text-ink"
                      : "text-ink-mute hover:text-ink",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        {isLanding && (
          <Link
            href="/home"
            className="text-sm font-light text-ink-mute transition-colors hover:text-ink"
          >
            Enter
          </Link>
        )}
      </div>
    </header>
  );
}
