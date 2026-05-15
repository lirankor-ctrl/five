import Link from "next/link";
import { RiverLine } from "@/components/RiverLine";
import { BookIndex } from "@/components/manifesto/BookIndex";
import { ManifestoNav } from "@/components/manifesto/ManifestoNav";
import { bookChapters, bookMeta } from "@/data/manifesto/book";

export const metadata = {
  title: "the book — five manifesto",
  description: bookMeta.subtitle,
};

export default function BookIndexPage() {
  return (
    <div className="bg-paper">
      <ManifestoNav section="book" />
      <header className="mx-auto max-w-3xl px-6 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          a five book
        </p>
        <h1 className="mt-6 font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-7xl">
          {bookMeta.title}.
        </h1>
        <p className="mt-6 max-w-[44ch] font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
          {bookMeta.subtitle}
        </p>
        <div className="mt-10 w-20">
          <RiverLine />
        </div>
        <div className="mt-10 flex flex-wrap gap-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
          <span>{bookChapters.length} chapters</span>
          <span aria-hidden="true">·</span>
          <span>~{bookMeta.estimatedTotalMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>audio in development</span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 md:px-10 md:pb-32">
        <BookIndex chapters={bookChapters} />
        <div className="mt-16 text-center">
          <Link
            href="/cubes/manifesto"
            className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
          >
            ← back to the manifesto
          </Link>
        </div>
      </main>
    </div>
  );
}
