import type { ManifestoBlock } from "@/lib/manifesto/types";
import { Pullquote } from "./Pullquote";

/**
 * Render a single content block.
 *
 * The reader (chapter pages) can wrap individual block renders with
 * highlight-saving behaviour; the manifesto landing page renders them
 * plainly. This keeps the editorial primitives composable.
 */
export function Block({ block }: { block: ManifestoBlock }) {
  switch (block.kind) {
    case "lead":
      return (
        <p className="mb-8 text-[20px] font-light italic leading-[1.6] text-ink md:text-[22px]">
          {block.body}
        </p>
      );
    case "paragraph":
      return <p className="mb-7 last:mb-0">{block.body}</p>;
    case "pullquote":
      return <Pullquote attribution={block.attribution}>{block.body}</Pullquote>;
    case "section":
      return (
        <header className="mb-6 mt-16">
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-ink-mute">
            {block.eyebrow}
          </p>
          <h3 className="mt-3 font-serif text-2xl font-light leading-tight tracking-[-0.01em] text-ink md:text-3xl">
            {block.title}
          </h3>
        </header>
      );
    case "list":
      return (
        <ul className="mb-7 space-y-3 border-l border-line pl-6 last:mb-0">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="font-serif text-[17px] font-light leading-[1.7] text-ink-soft md:text-[18px]"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "rule":
      return (
        <div
          aria-hidden="true"
          className="mx-auto my-14 h-px w-16 bg-line md:my-20"
        />
      );
  }
}
