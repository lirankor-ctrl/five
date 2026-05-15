import Link from "next/link";
import { RiverLine } from "@/components/RiverLine";
import { ManifestoNav } from "@/components/manifesto/ManifestoNav";
import { TalkCard } from "@/components/manifesto/TalkCard";
import { Prose } from "@/components/manifesto/Prose";
import { talks } from "@/data/manifesto/talks";

export const metadata = {
  title: "talks & media — five manifesto",
  description:
    "A premium media world in development — talks, conversations, mini-manifestos, audio reflections.",
};

export default function TalksPage() {
  return (
    <div className="bg-paper">
      <ManifestoNav section="talks" />

      <header className="mx-auto max-w-3xl px-6 pb-12 pt-16 md:px-10 md:pb-20 md:pt-24">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          section v
        </p>
        <h1 className="mt-8 font-serif text-4xl font-light leading-[1.05] tracking-[-0.02em] text-ink md:text-6xl">
          Talks & media.
        </h1>
        <p className="mt-6 max-w-[48ch] font-serif text-lg font-light italic leading-relaxed text-ink-soft md:text-xl">
          A small media world is being built — TED-style talks, long conversations, mini-manifestos, short films, audio reflections. Some are in development. None are noise.
        </p>
        <div className="mt-10 w-20">
          <RiverLine />
        </div>
      </header>

      <section className="px-6 pb-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <Prose>
            <p>
              The default of modern media is to fill empty minutes. We are interested in the opposite. What might short-form video, podcasting, and live audio look like if their purpose was to <em>protect</em> a few small moments rather than monetise them? This room is where we will find out.
            </p>
          </Prose>
        </div>
      </section>

      <section className="px-6 pb-24 pt-12 md:px-10 md:pb-32">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {talks.map((talk) => (
              <TalkCard key={talk.id} talk={talk} />
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-[44ch] text-center text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute">
            Each card is a placeholder. The structure is here so the first real piece can land without rebuilding the room.
          </p>
        </div>
      </section>

      <footer className="border-t border-line/70 px-6 py-16 text-center md:px-10">
        <p className="font-serif text-base font-light italic text-ink-mute">
          Calm media for a fragmented life.
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
