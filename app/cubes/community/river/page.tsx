import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { RiverMap } from "@/components/community/RiverMap";

export const metadata = {
  title: "river map — five community",
  description:
    "A soft flowing map of communities. Tributaries by interest type, nodes by people. No leaderboards.",
};

export default function RiverPage() {
  return (
    <Container size="wide" className="pb-24 pt-10 md:pt-14">
      <header className="mx-auto max-w-3xl">
        <p className="text-[11px] font-light uppercase tracking-[0.3em] text-ink-mute">
          the river map
        </p>
        <h1 className="mt-5 text-3xl font-light leading-tight tracking-brand text-ink md:text-5xl">
          A soft map of where people are flowing.
        </h1>
        <p className="mt-5 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft">
          Not a feed. Not a leaderboard. Each community is a small node along a tributary — the size hints at how many people are in it, not how loud they are. Hover any node to see what it is. Tap to enter.
        </p>
        <div className="mt-8 w-20">
          <RiverLine />
        </div>
      </header>

      <div className="mt-10">
        <RiverMap />
      </div>

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          A future server-driven river will replace this with real-time flows. The shape is here.
        </p>
      </div>
    </Container>
  );
}
