import Link from "next/link";
import { RiverLine } from "@/components/RiverLine";
import { Block } from "@/components/manifesto/Block";
import { ManifestoNav } from "@/components/manifesto/ManifestoNav";
import { Prose } from "@/components/manifesto/Prose";
import { Pullquote } from "@/components/manifesto/Pullquote";
import { SectionHeader } from "@/components/manifesto/SectionHeader";
import { SectionLink } from "@/components/manifesto/SectionLink";
import { manifestoSections } from "@/data/manifesto/manifesto";

export const metadata = {
  title: "five manifesto — life happens in the little drops",
  description:
    "The philosophy of five. On the small moments between life’s anchors, and what becomes of a life when you take them back.",
};

export default function ManifestoLandingPage() {
  return (
    <div className="bg-paper">
      <ManifestoNav />

      {/* Hero */}
      <section className="px-6 pb-20 pt-20 md:px-10 md:pb-28 md:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the five manifesto
          </p>
          <h1 className="mt-10 font-serif text-5xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:mt-12 md:text-7xl">
            Life happens
            <br />
            in the little drops.
          </h1>
          <div className="mx-auto mt-12 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-12 max-w-[44ch] font-serif text-lg font-light leading-relaxed text-ink-soft md:text-xl">
            A small philosophy for a fragmented modern life. Read slowly.
          </p>
        </div>
      </section>

      {/* Manifesto body — long-form scroll */}
      <article className="px-6 pb-24 md:px-10 md:pb-32">
        {manifestoSections.map((section, sectionIdx) => (
          <section
            key={section.id}
            id={section.id}
            className="mx-auto mb-20 max-w-3xl md:mb-28"
          >
            <SectionHeader eyebrow={section.eyebrow} title={section.title} />
            <div className="mt-12 md:mt-16">
              <Prose>
                {section.blocks.map((block, i) => (
                  <Block key={`${section.id}-${i}`} block={block} />
                ))}
              </Prose>
            </div>
            {sectionIdx < manifestoSections.length - 1 && (
              <div
                aria-hidden="true"
                className="mx-auto mt-20 h-px w-12 bg-line md:mt-28"
              />
            )}
          </section>
        ))}
      </article>

      {/* Movement-defining close */}
      <section className="bg-surface px-6 py-24 md:px-10 md:py-32">
        <Pullquote>You are not one fixed identity.</Pullquote>
      </section>

      {/* Map to the rest of the cube */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <header className="mb-14 max-w-[40ch] md:mb-20">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              the cube
            </p>
            <h2 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-ink md:text-4xl">
              Four quieter rooms.
            </h2>
            <p className="mt-5 max-w-[48ch] text-[15px] font-light leading-relaxed text-ink-soft">
              The manifesto is the entrance. Inside, four longer worlds — read at the pace of a slow evening, not a feed.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SectionLink
              href="/cubes/manifesto/book"
              ordinal="i"
              title="The book."
              description="A small book about the moments between the moments. Seven chapters, written to be read in drops."
              meta="open the book"
            />
            <SectionLink
              href="/cubes/manifesto/micro-multipotentiality"
              ordinal="ii"
              title="Micro-multipotentiality."
              description="The case for being quietly several people across a lifetime. A short encyclopedia of related ideas."
              meta="enter the world"
            />
            <SectionLink
              href="/cubes/manifesto/research"
              ordinal="iii"
              title="Research & science."
              description="What the science actually says about attention, identity, learning, and momentum — without the noise."
              meta="read the evidence"
            />
            <SectionLink
              href="/cubes/manifesto/talks"
              ordinal="iv"
              title="Talks & media."
              description="A premium media world, in development. Short talks, conversations, mini-manifestos, audio reflections."
              meta="preview"
            />
          </div>
        </div>
      </section>

      <footer className="border-t border-line/70 px-6 py-16 text-center md:px-10">
        <p className="font-serif text-base font-light italic text-ink-mute">
          Take five. Not to do more. To return to what is already yours.
        </p>
        <Link
          href="/cubes"
          className="mt-6 inline-block text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
        >
          Back to the cube map
        </Link>
      </footer>
    </div>
  );
}
