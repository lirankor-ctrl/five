import Link from "next/link";
import { RiverLine } from "@/components/RiverLine";
import { ConceptCard } from "@/components/manifesto/ConceptCard";
import { ManifestoNav } from "@/components/manifesto/ManifestoNav";
import { Prose } from "@/components/manifesto/Prose";
import { Pullquote } from "@/components/manifesto/Pullquote";
import { concepts } from "@/data/manifesto/concepts";

export const metadata = {
  title: "micro-multipotentiality — five manifesto",
  description:
    "The right to be more than one thing, in small repeated returns across a lifetime. A short encyclopedia of related ideas.",
};

export default function MicroMultipotentialityPage() {
  const featured = concepts[0];
  const others = concepts.slice(1);

  return (
    <div className="bg-paper">
      <ManifestoNav section="micro-multipotentiality" />

      <header className="mx-auto max-w-3xl px-6 pb-12 pt-16 text-center md:px-10 md:pb-20 md:pt-24">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          section iii
        </p>
        <h1 className="mt-8 font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
          Micro-multipotentiality.
        </h1>
        <p className="mx-auto mt-8 max-w-[44ch] font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
          The right to be more than one thing, lightly, over a lifetime.
        </p>
        <div className="mx-auto mt-10 w-20">
          <RiverLine />
        </div>
      </header>

      <section className="px-6 pb-20 md:px-10 md:pb-28">
        <Prose>
          <p className="mb-7">
            The dominant career advice of the last fifty years has been a single sentence: <em>pick one thing.</em> Choose a niche. Specialise. Stay consistent. The advice is not wrong — it is narrow. It speaks to one kind of life, in one moment of history, in one labour market.
          </p>
          <p className="mb-7">
            five proposes a wider frame. A human can be quietly several things — across hours, weeks, decades — without abandoning the main thing. A doctor who plays piano for five minutes most days is not less a doctor. They are a doctor with a quiet second river running alongside.
          </p>
          <p className="mb-7">
            We call this <strong className="font-medium">micro-multipotentiality</strong>: identity composed not in dramatic reinventions, but in small repeated returns to many different things.
          </p>
        </Prose>
      </section>

      <Pullquote>You are allowed to be quietly several people, over time.</Pullquote>

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-5xl">
          <header className="mb-14 max-w-[40ch] md:mb-20">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              the encyclopedia
            </p>
            <h2 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-ink md:text-4xl">
              Related ideas.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[15px] font-light leading-relaxed text-ink-soft">
              A small, wikipedia-style world of concepts the manifesto rests on. Each entry stands on its own and links outward.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ConceptCard
              featured
              href={`/cubes/manifesto/micro-multipotentiality/${featured.id}`}
              title={featured.title}
              oneLine={featured.oneLine}
            />
            {others.map((c) => (
              <ConceptCard
                key={c.id}
                href={`/cubes/manifesto/micro-multipotentiality/${c.id}`}
                title={c.title}
                oneLine={c.oneLine}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-line/70 px-6 py-16 text-center md:px-10">
        <p className="font-serif text-base font-light italic text-ink-mute">
          A few minutes a day, with many things, over many years.
        </p>
        <Link
          href="/cubes/manifesto"
          className="mt-6 inline-block text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
        >
          ← back to the manifesto
        </Link>
      </footer>
    </div>
  );
}
