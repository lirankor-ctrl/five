import Link from "next/link";
import { notFound } from "next/navigation";
import { Block } from "@/components/manifesto/Block";
import { ConceptMap } from "@/components/manifesto/ConceptMap";
import { ManifestoNav } from "@/components/manifesto/ManifestoNav";
import { Prose } from "@/components/manifesto/Prose";
import { concepts, getConcept } from "@/data/manifesto/concepts";

type Params = { params: { conceptId: string } };

export function generateStaticParams() {
  return concepts.map((c) => ({ conceptId: c.id }));
}

export function generateMetadata({ params }: Params) {
  const c = getConcept(params.conceptId);
  if (!c) return { title: "five manifesto" };
  return { title: `${c.title} — five manifesto`, description: c.oneLine };
}

const REF_LABEL: Record<
  "ted" | "article" | "book" | "person",
  string
> = {
  ted: "TED",
  article: "Article",
  book: "Book",
  person: "Person",
};

export default function ConceptPage({ params }: Params) {
  const concept = getConcept(params.conceptId);
  if (!concept) notFound();

  const related = concept.related
    .map((id) => getConcept(id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  return (
    <div className="bg-paper">
      <ManifestoNav section={concept.title.toLowerCase()} />

      <header className="mx-auto max-w-3xl px-6 pb-12 pt-16 md:px-10 md:pb-16 md:pt-24">
        <Link
          href="/cubes/manifesto/micro-multipotentiality"
          className="text-xs font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          ← encyclopedia
        </Link>
        <p className="mt-10 text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          concept
        </p>
        <h1 className="mt-5 font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
          {concept.title}.
        </h1>
        <p className="mt-6 max-w-[44ch] font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
          {concept.oneLine}
        </p>
      </header>

      <article className="px-6 pb-20 md:px-10">
        <Prose>
          {concept.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </Prose>
      </article>

      {related.length > 0 && (
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              connected ideas
            </p>
            <h2 className="mt-5 font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink md:text-3xl">
              How this links outward.
            </h2>
            <div className="mt-10">
              <ConceptMap center={concept} related={related} />
            </div>
          </div>
        </section>
      )}

      {concept.references.length > 0 && (
        <section className="px-6 py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              references
            </p>
            <h2 className="mt-5 font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink md:text-3xl">
              A short reading shelf.
            </h2>
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {concept.references.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-6 py-4 text-[15px] font-light text-ink"
                >
                  <span className="font-serif">{r.label}</span>
                  <span className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    {REF_LABEL[r.kind]}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
              External links will appear here when this entry moves to a CMS.
            </p>
          </div>
        </section>
      )}

      <footer className="border-t border-line/70 px-6 py-16 text-center md:px-10">
        <Link
          href="/cubes/manifesto/micro-multipotentiality"
          className="text-xs font-light uppercase tracking-[0.25em] text-ink-mute transition-colors hover:text-ink"
        >
          ← back to the encyclopedia
        </Link>
      </footer>
    </div>
  );
}
