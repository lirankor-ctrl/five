import { LinkButton } from "@/components/Button";
import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { eventCategories } from "@/data/live/categories";

export const metadata = {
  title: "five live event — momentum that moves through people",
  description:
    "Light social momentum. People doing their five together, without the noise of a social platform.",
};

const BRAND_STATEMENTS = [
  "Small moments. Shared momentum.",
  "Do your Five together.",
  "Five people. Five minutes. Real movement.",
  "You are not alone in your Five.",
];

export default function LiveLanding() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-16 md:pb-32 md:pt-24">
        {/* Hero */}
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five live event
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-6xl">
            Momentum that moves
            <br />
            through people.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Not a social platform. Not a webinar. Not a community to belong to. A small layer that lets people do their Five together — quietly, briefly, without performance.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <LinkButton href="/cubes/live-event/discover" variant="primary" size="lg">
              Discover lives
            </LinkButton>
            <LinkButton href="/cubes/live-event/create" variant="secondary" size="lg">
              Host one
            </LinkButton>
          </div>
        </header>

        {/* Statements */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-center text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            light social momentum
          </p>
          <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {BRAND_STATEMENTS.map((s) => (
              <li
                key={s}
                className="rounded-3xl border border-line bg-surface p-7 text-[17px] font-light italic leading-relaxed text-ink-soft md:text-lg"
              >
                {s}
              </li>
            ))}
          </ul>
        </section>

        {/* What it is / isn't */}
        <section className="mx-auto mt-24 max-w-3xl md:mt-32">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            our thesis
          </p>
          <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
            People sustain momentum better when they are not alone.
          </h2>
          <div className="mt-8 space-y-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            <p>
              Modern people also do not want another heavy community. No more endless Zoom calls. No more groups demanding daily participation. No more performance for an audience.
            </p>
            <p>
              five live event is the opposite shape. Five minutes. Optional camera. Optional name. No likes. No follower counts. No infinite feed. Just other humans, somewhere, doing the same small thing at the same time.
            </p>
            <p>
              Better small and alive than big and abandoned.
            </p>
          </div>
        </section>

        {/* Seven kinds of lives */}
        <section className="mt-24 md:mt-32">
          <header className="mb-12 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              seven kinds of lives
            </p>
            <h2 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-4xl">
              Seven ways to move together.
            </h2>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {eventCategories.map((c) => (
              <Card key={c.id} className="bg-surface">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line text-lg font-light text-ink-soft"
                  >
                    {c.glyph}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      {c.oneLine}
                    </p>
                    <h3 className="mt-1 text-lg font-light tracking-brand text-ink">
                      {c.label}
                    </h3>
                    <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                      {c.body}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Promise */}
        <section className="mx-auto mt-24 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:mt-32 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            what we will not become
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            Not a feed. Not a follower count. Not a popularity machine.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            No likes. No vanity metrics. No infinite scroll. No influencer mechanics. Optional anonymous mode. Default: no recording. Reactions are limited to a small handful of human signals — thanks, fire, see you next five, with you. That is enough.
          </p>
        </section>

        {/* Done mechanism */}
        <section className="mx-auto mt-20 max-w-3xl">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the done principle
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            The event exists to support action — not replace it.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Every live ends with one small confirmation: <em>I did my Five.</em> Watching is not the point. Returning is. The room is here to make it slightly easier to come back tomorrow.
          </p>
        </section>

        <section className="mt-16 flex flex-col items-center gap-4 border-t border-line/70 pt-12 text-center">
          <p className="text-sm font-light italic text-ink-mute">
            There are other people, somewhere, doing their Five with you right now.
          </p>
          <LinkButton href="/cubes/live-event/discover" variant="primary" size="md">
            See who is on →
          </LinkButton>
        </section>
      </Container>
    </div>
  );
}
