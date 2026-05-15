import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { SESSION_TYPE_LABEL } from "@/lib/creators/format";
import type { SessionType } from "@/lib/creators/types";

export const metadata = {
  title: "five creators — a calm creator economy",
  description:
    "Where new five-minute content is built for the FIVE philosophy. Not a content feed. Not an attention marketplace. A calm creator economy.",
};

const TYPES: Array<{ id: SessionType; glyph: string; body: string }> = [
  {
    id: "micro-course",
    glyph: "✦",
    body: "Courses built from dozens of five-minute sessions. Small consistent exposure over overwhelming mastery.",
  },
  {
    id: "guided-session",
    glyph: "◯",
    body: "Short guided experiences: meditation, breathing, mobility, focus resets, reflection prompts.",
  },
  {
    id: "challenge",
    glyph: "↗",
    body: "Consistency-based shapes — 7, 14, 21, 30 days — designed around human momentum, not streak shame.",
  },
  {
    id: "thought-drop",
    glyph: "¶",
    body: "Short philosophical or psychological reflections. Not motivational filler — small ideas that stay.",
  },
  {
    id: "parent-child",
    glyph: "✿",
    body: "Five-minute sessions for parents and children. Curiosity, values, science, presence — at the dinner table.",
  },
  {
    id: "organization-pack",
    glyph: "◇",
    body: "Enterprise-shaped packs that integrate cleanly with five organizations — leadership, feedback, onboarding.",
  },
];

export default function CreatorsLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five creators
          </p>
          <h1 className="mt-8 text-balance font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
            A calm creator economy.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[46ch] font-serif text-lg font-light leading-relaxed text-ink-soft md:text-xl">
            Not Udemy. Not YouTube. Not TikTok. A platform where teachers, coaches, parents, musicians, researchers and ordinary thoughtful humans build small five-minute drops that integrate into life instead of consuming it.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/creators/discover" variant="primary" size="lg">
              Discover sessions
            </LinkButton>
            <LinkButton href="/cubes/creators/studio" variant="secondary" size="lg">
              Open the studio
            </LinkButton>
          </div>
        </header>

        {/* Philosophy */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the philosophy
          </p>
          <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-[-0.01em] text-ink md:text-4xl">
            Humans don’t have a potential problem.
          </h2>
          <div className="mt-8 space-y-6 font-serif text-[17px] font-light leading-[1.75] text-ink-soft md:text-[19px]">
            <p>
              You do not need to master piano. You need five minutes of piano today. You do not need a twelve-hour course in philosophy. You need one good thought to chew on. You do not need to reinvent your life. You need one small drop of momentum.
            </p>
            <p>
              Modern creator culture is built around long form, virality, attention addiction and infinite feeds. five creators is built around the opposite premise — that short content can still be deep, that small value still matters, that consistency matters more than virality, and that human impact matters more than screen time.
            </p>
            <p>
              We are building the world’s largest micro-growth library. This is its calm front door.
            </p>
          </div>
        </section>

        {/* Six content types */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              six shapes of a five
            </p>
            <h2 className="mt-5 font-serif text-3xl font-light leading-tight tracking-[-0.01em] text-ink md:text-4xl">
              Small forms, designed on purpose.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TYPES.map((t) => (
              <Card key={t.id} className="bg-surface">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-lg font-light text-ink-soft"
                  >
                    {t.glyph}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      type
                    </p>
                    <h3 className="mt-1 font-serif text-xl font-light tracking-[-0.01em] text-ink md:text-2xl">
                      {SESSION_TYPE_LABEL[t.id]}
                    </h3>
                    <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                      {t.body}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* The creator we make space for */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            who is a creator here
          </p>
          <h2 className="mt-5 font-serif text-2xl font-light leading-snug tracking-[-0.01em] text-ink md:text-3xl">
            Not only influencers.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Teachers. Coaches. Parents. Psychologists. Students. Musicians. Researchers. Retirees. Thoughtful humans with life experience. We are interested in small but meaningful knowledge — and we are interested in paying it.
          </p>
        </section>

        {/* Impact-not-stars */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            a new rating system
          </p>
          <h2 className="mt-5 font-serif text-2xl font-light leading-snug tracking-[-0.01em] text-ink md:text-3xl">
            We do not use stars.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            We measure human impact. Did this session help you stay consistent? Did you return to it? Did it change something small in your day? Did it create momentum? Did it make you feel calmer? Did it create curiosity? Did it help a real-life action? Creators see those answers — not a five-star average.
          </p>
        </section>

        <section className="mt-20 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            Human growth does not need to consume life. It can flow gently inside it.
          </p>
          <LinkButton href="/cubes/creators/discover" variant="primary" size="md">
            Begin in discover →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
