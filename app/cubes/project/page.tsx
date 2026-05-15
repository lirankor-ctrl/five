import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { projectTemplates } from "@/data/project/templates";

export const metadata = {
  title: "five project — where the dream becomes a rhythm",
  description:
    "Not a hobby tracker. Not a task manager. A calm system for keeping a meaningful project alive — five minutes at a time, inside the rest of your life.",
};

const STATEMENTS = [
  "Your dream does not need a perfect time. It needs five.",
  "Turn your someday into a five-minute step.",
  "Big dreams. Small steps. Living momentum.",
  "Don’t quit your life. Start your project inside it.",
];

export default function ProjectLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five project
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            Where the dream
            <br />
            becomes a rhythm.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            For the dream you have quietly carried for years. The book. The startup. The move abroad. The studio. The degree. You do not need to leave your life to begin it. You need to begin it inside your life — five minutes at a time.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/project/home" variant="primary" size="lg">
              Open your studio
            </LinkButton>
            <LinkButton href="/cubes/project/home?mode=template" variant="secondary" size="lg">
              Start from a template
            </LinkButton>
          </div>
        </header>

        {/* Statements */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {STATEMENTS.map((s) => (
              <li
                key={s}
                className="rounded-3xl border border-line bg-surface p-7 text-[17px] font-light italic leading-relaxed text-ink-soft md:text-lg"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* Why */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            why this exists
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            A big project does not need a free life. It needs a living rhythm.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              Most personal projects do not fail because people lack desire. They fail because the dream is larger than the energy available in an ordinary day. Modern life is built around heavy anchors — work, family, finances, exhaustion. Inside that reality, big personal projects start to feel too large, unrealistic, selfish, impossible.
            </p>
            <p>
              five project says something different. Big dreams require courage, clarity, learning, planning, decisions, persistence — but they do not need all of those at once. They need five minutes today.
            </p>
            <p>
              This is not a task manager. It is a relationship between a human and their dream — a calm studio where the project stays alive between the busy weeks, and the next step is always small enough to actually take.
            </p>
          </div>
        </section>

        {/* Three-layer structure */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              the three layers
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Vision · Milestones · Five Actions.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                layer a
              </p>
              <h3 className="mt-3 text-lg font-light tracking-brand text-ink md:text-xl">
                Vision
              </h3>
              <p className="mt-3 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
                The big dream. “I want to write a book.”
              </p>
            </Card>
            <Card>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                layer b
              </p>
              <h3 className="mt-3 text-lg font-light tracking-brand text-ink md:text-xl">
                Milestones
              </h3>
              <p className="mt-3 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
                The honest phases. Concept · Structure · Chapters · Edit.
              </p>
            </Card>
            <Card>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                layer c
              </p>
              <h3 className="mt-3 text-lg font-light tracking-brand text-ink md:text-xl">
                Five actions
              </h3>
              <p className="mt-3 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
                The smallest credible step today. “Write five possible titles.”
              </p>
            </Card>
          </div>
        </section>

        {/* Templates preview */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              real starting points
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Templates for the dreams people quietly carry.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projectTemplates.map((t) => (
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
                      {t.milestones.length} milestones
                    </p>
                    <h3 className="mt-1 text-lg font-light tracking-brand text-ink">
                      {t.name}
                    </h3>
                    <p className="mt-2 text-[14px] font-light italic leading-relaxed text-ink-soft">
                      {t.oneLine}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* I'm stuck principle */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the &ldquo;i&rsquo;m stuck&rdquo; principle
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            When life feels heavy, do not break the human. Reduce the step.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            When you press <em>I&rsquo;m stuck</em>, you do not get a motivational speech. You get a smaller version of the task. &ldquo;You do not need to decide about relocation today. Today just list your three biggest fears.&rdquo; That is enough.
          </p>
        </section>

        <section className="mt-20 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            You do not need to wait for life to calm down before beginning what matters.
          </p>
          <LinkButton href="/cubes/project/home" variant="primary" size="md">
            Open your studio →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
