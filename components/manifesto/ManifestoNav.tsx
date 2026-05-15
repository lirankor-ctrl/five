import Link from "next/link";

/**
 * Small in-cube breadcrumb. Lives at the top of every manifesto sub-page
 * to make the cube structure visible and easy to leave.
 */
export function ManifestoNav({ section }: { section?: string }) {
  return (
    <nav className="mx-auto flex max-w-5xl items-center gap-3 px-6 pt-8 text-xs font-light uppercase tracking-[0.2em] text-ink-mute md:px-10">
      <Link href="/cubes" className="hover:text-ink">
        cubes
      </Link>
      <span aria-hidden="true">·</span>
      <Link href="/cubes/manifesto" className="hover:text-ink">
        manifesto
      </Link>
      {section && (
        <>
          <span aria-hidden="true">·</span>
          <span className="text-ink">{section}</span>
        </>
      )}
    </nav>
  );
}
