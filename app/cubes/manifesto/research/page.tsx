import Link from "next/link";
import { RiverLine } from "@/components/RiverLine";
import { ManifestoNav } from "@/components/manifesto/ManifestoNav";
import { Prose } from "@/components/manifesto/Prose";
import { researchStance, researchThemes } from "@/data/manifesto/research";

export const metadata = {
  title: "research & science — five manifesto",
  description:
    "Attention, learning, identity, well-being. What the science actually says — without the noise.",
};

export default function ResearchPage() {
  return (
    <div className="bg-paper">
      <ManifestoNav section="research" />

      <header className="mx-auto max-w-3xl px-6 pb-12 pt-16 md:px-10 md:pb-20 md:pt-24">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          section iv
        </p>
        <h1 className="mt-8 font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
          Research & science.
        </h1>
        <p className="mt-6 max-w-[48ch] font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
          A short tour of what is actually known about attention, learning, identity, and momentum — and what five takes from it.
        </p>
        <div className="mt-10 w-20">
          <RiverLine />
        </div>
      </header>

      <section className="px-6 pb-24 md:px-10 md:pb-32">
        {researchThemes.map((theme, idx) => (
          <article
            key={theme.id}
            className="mx-auto mb-20 max-w-3xl md:mb-28"
            id={theme.id}
          >
            <header className="mb-10">
              <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
                {theme.eyebrow}
              </p>
              <h2 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-ink md:text-4xl">
                {theme.title}
              </h2>
            </header>

            <Prose>
              <p>{theme.body}</p>
            </Prose>

            <ul className="mx-auto mt-12 max-w-[64ch] space-y-10">
              {theme.topics.map((topic) => (
                <li
                  key={topic.title}
                  className="border-l border-line pl-6 md:pl-8"
                >
                  <h3 className="font-serif text-xl font-light leading-tight tracking-[-0.01em] text-ink md:text-2xl">
                    {topic.title}
                  </h3>
                  <p className="mt-3 font-serif text-[17px] font-light leading-[1.75] text-ink-soft md:text-[18px]">
                    {topic.body}
                  </p>
                </li>
              ))}
            </ul>

            {idx < researchThemes.length - 1 && (
              <div
                aria-hidden="true"
                className="mx-auto mt-20 h-px w-12 bg-line md:mt-24"
              />
            )}
          </article>
        ))}
      </section>

      {/* Stance — not anti-technology */}
      <section className="bg-surface px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            our stance
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-[-0.01em] text-ink md:text-4xl">
            {researchStance.title}
          </h2>
          <Prose className="mt-10">
            <p>{researchStance.body}</p>
          </Prose>
        </div>
      </section>

      <footer className="border-t border-line/70 px-6 py-16 text-center md:px-10">
        <p className="font-serif text-base font-light italic text-ink-mute">
          Pace. Dosage. Direction. Momentum.
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
