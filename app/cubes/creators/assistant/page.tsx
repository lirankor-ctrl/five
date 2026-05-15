import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { LinkButton } from "@/components/Button";
import { RiverLine } from "@/components/RiverLine";

export const metadata = {
  title: "assistant — five creators",
  description:
    "An AI creator assistant designed to help creators build small, momentum-friendly content — collaboratively, not automatically.",
};

const tools = [
  {
    eyebrow: "01",
    title: "Break a long course into Fives.",
    body:
      "Paste an existing module or table of contents. The assistant proposes a five-minute decomposition — one drop per session, each with a self-contained ending.",
    cta: "In development",
  },
  {
    eyebrow: "02",
    title: "Turn a book chapter into a thought drop.",
    body:
      "Suggests one short, calm reflection of a chapter — the kind of thing a reader could actually carry into the rest of their day.",
    cta: "In development",
  },
  {
    eyebrow: "03",
    title: "Turn a podcast episode into Fives.",
    body:
      "Imports an audio file or transcript. The assistant identifies the two or three most self-contained five-minute moments — and suggests how to release them.",
    cta: "Coming soon",
  },
  {
    eyebrow: "04",
    title: "Improve pacing and retention.",
    body:
      "Looks at a draft session and flags the moments most likely to lose attention. Suggests a smaller ending, a calmer middle, a more honest hook.",
    cta: "In development",
  },
  {
    eyebrow: "05",
    title: "Identify drop-off points across a course.",
    body:
      "Reads your impact reports across a multi-session course and proposes where to trim, re-order, or rest. Calm, not aggressive.",
    cta: "Coming soon",
  },
  {
    eyebrow: "06",
    title: "Generate small momentum-friendly titles.",
    body:
      "Drafts titles that feel honest, small, and human — not clickbait. You stay in charge of the final wording.",
    cta: "In development",
  },
];

export default function AssistantPage() {
  return (
    <Container size="default" className="pb-24 pt-10 md:pt-14">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          ai creator assistant
        </p>
        <h1 className="mt-8 font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-5xl">
          Collaborative, not automatic.
        </h1>
        <div className="mx-auto mt-10 w-20">
          <RiverLine />
        </div>
        <p className="mx-auto mt-10 max-w-[48ch] font-serif text-lg font-light leading-relaxed text-ink-soft md:text-xl">
          A future assistant designed to help small creators do their best small work — not to replace them, not to flood the platform with generic content. Below is the design of what it will do.
        </p>
      </header>

      <section className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => (
          <Card key={t.eyebrow}>
            <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {t.eyebrow}
            </p>
            <h3 className="mt-2 font-serif text-xl font-light leading-snug tracking-[-0.01em] text-ink md:text-2xl">
              {t.title}
            </h3>
            <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
              {t.body}
            </p>
            <p className="mt-5 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
              {t.cta}
            </p>
          </Card>
        ))}
      </section>

      {/* Promise */}
      <section className="mx-auto mt-20 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:p-12">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          the design promise
        </p>
        <h2 className="mt-5 font-serif text-2xl font-light leading-snug tracking-[-0.01em] text-ink md:text-3xl">
          We will not flood the platform with generic AI content.
        </h2>
        <p className="mt-6 text-[15.5px] font-light leading-relaxed text-ink-soft">
          The assistant is a collaborator. It proposes, suggests, structures, summarises. You decide what is published. We will publish neither the assistant&rsquo;s name on a session nor a generic AI-generated session under a real creator&rsquo;s identity.
        </p>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
        <p className="text-sm font-light italic text-ink-mute">
          Intelligent help, calmly delivered.
        </p>
        <LinkButton href="/cubes/creators/studio" variant="primary" size="md">
          Open the studio →
        </LinkButton>
      </div>
    </Container>
  );
}
