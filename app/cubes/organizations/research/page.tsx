import { Card } from "@/components/Card";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { ManifestoStrip } from "@/components/organizations/ManifestoStrip";

export const metadata = {
  title: "research & pilots — five organizations",
  description:
    "The scientific arm of five organizations. Where the thesis that culture is built in micro-actions is measured, not asserted.",
};

const pilotKinds = [
  {
    label: "Banks",
    description:
      "Branch-level cultural pulse across multi-region retail networks.",
  },
  {
    label: "Hospitals",
    description:
      "Five-minute team reflection rituals in high-pressure clinical environments.",
  },
  {
    label: "Tech companies",
    description:
      "Engineering recognition campaigns and post-incident reflection rhythms.",
  },
  {
    label: "Service centres",
    description:
      "Lost-customer reconnection programs measured against satisfaction and silent-churn.",
  },
  {
    label: "Public organizations",
    description:
      "Frontline appreciation and learning practices across distributed agencies.",
  },
  {
    label: "Educational institutions",
    description:
      "Staff momentum and student-facing micro-presence rituals.",
  },
];

const measurableOutcomes = [
  "Employee satisfaction",
  "Engagement",
  "Burnout indicators",
  "Performance",
  "Retention",
  "Customer satisfaction",
  "Innovation throughput",
  "Sense of meaning",
  "Organizational trust",
];

export default function ResearchPage() {
  return (
    <div className="bg-paper">
      <Container size="default" className="pb-24 pt-12 md:pt-20">
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            five organizations · research
          </p>
          <h1 className="mt-8 text-balance text-4xl font-light leading-[1.05] tracking-brand text-ink md:text-5xl">
            We measure the small drops.
          </h1>
          <div className="mx-auto mt-10 w-20">
            <RiverLine />
          </div>
          <p className="mx-auto mt-10 max-w-[48ch] text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            Most cultural claims are unfalsifiable. five organizations is built on the opposite premise: human-momentum interventions can be defined, repeated, and measured. This page is the entry point to that scientific arm.
          </p>
        </header>

        {/* Thesis */}
        <section className="mx-auto mt-20 max-w-3xl">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            the research thesis
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            Organizational culture is not created in annual events.
          </h2>
          <p className="mt-6 text-[16px] font-light leading-relaxed text-ink-soft md:text-lg">
            It is created through repeated small drops of human attention — recognition, listening, reflection, learning, customer reconnection. five organizations gives those drops a shape, a cadence, a record, and a measurable footprint.
          </p>
        </section>

        {/* Pilots */}
        <section className="mt-20">
          <header className="mb-10 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              future pilots
            </p>
            <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
              Where we want to study this honestly.
            </h2>
            <p className="mt-4 max-w-[52ch] text-[14.5px] font-light leading-relaxed text-ink-soft">
              We are interested in pilots that span enough people and enough months to produce real signal — and the kind of organizations honest enough to publish what we find.
            </p>
          </header>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pilotKinds.map((p) => (
              <Card key={p.label}>
                <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  pilot kind
                </p>
                <h3 className="mt-2 text-lg font-light tracking-brand text-ink">
                  {p.label}
                </h3>
                <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                  {p.description}
                </p>
                <p className="mt-5 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                  In development
                </p>
              </Card>
            ))}
          </div>
        </section>

        {/* Measurable outcomes */}
        <section className="mt-20">
          <header className="mb-8 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              measurable outcomes
            </p>
            <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
              What we believe these moments move.
            </h2>
          </header>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {measurableOutcomes.map((o) => (
              <li
                key={o}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14.5px] font-light text-ink"
              >
                {o}
              </li>
            ))}
          </ul>
        </section>

        {/* AI organizational coach */}
        <section className="mx-auto mt-20 max-w-3xl rounded-3xl border border-line bg-surface p-8 md:p-12">
          <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            ai organizational coach · future layer
          </p>
          <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
            Observation, never surveillance.
          </h2>
          <p className="mt-6 text-[15.5px] font-light leading-relaxed text-ink-soft">
            A future AI coaching layer will sit on top of campaign data: which managers create stronger engagement; which behaviours correlate with retention; which teams are quietly burning out; which campaign types are landing. The tone is non-negotiable — intelligent, observational, non-invasive. Never a ranking. Never a performance review proxy.
          </p>
        </section>

        {/* Business model */}
        <section className="mt-20">
          <header className="mb-10 max-w-[40ch]">
            <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
              business model
            </p>
            <h2 className="mt-5 text-2xl font-light leading-snug tracking-brand text-ink md:text-3xl">
              An honest enterprise SaaS, sized by humans.
            </h2>
          </header>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              "Per-employee pricing — calm, transparent.",
              "Department and multi-org modules.",
              "Custom campaign templates per industry.",
              "Analytics layer (this page becomes Pro).",
              "AI organizational-coach layer (opt-in).",
              "Research partnerships with universities and pilot organizations.",
            ].map((it) => (
              <li
                key={it}
                className="rounded-xl border border-line bg-surface px-4 py-3 text-[14.5px] font-light text-ink"
              >
                {it}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20 border-t border-line/70 pt-12">
          <p className="mb-6 text-center text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
            what we keep returning to
          </p>
          <ManifestoStrip variant="compact" />
        </section>

        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <RiverLine />
          <p className="mt-4 text-sm font-light text-ink-mute">
            We do not claim that micro-actions work. We measure them.
          </p>
        </div>
      </Container>
    </div>
  );
}
