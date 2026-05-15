"use client";

import { getCategory } from "@/data/content/categories";
import { TYPE_LABEL } from "@/lib/content/format";
import type {
  ContentType,
  SavedContentPath,
} from "@/lib/content/types";

type Props = {
  paths: SavedContentPath[];
  onOpen: (path: SavedContentPath) => void;
  onRemove: (pathId: string) => void;
};

export function SavedPaths({ paths, onOpen, onRemove }: Props) {
  if (paths.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
        <p className="text-[14px] font-light text-ink-soft">
          Save any content card with the ✦ button to start a recurring path.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {paths.map((p) => {
        const cat = p.categoryId ? getCategory(p.categoryId) : undefined;
        const type = p.contentType as ContentType | undefined;
        return (
          <li
            key={p.id}
            className="flex items-start justify-between gap-3 rounded-2xl border border-line bg-surface p-5"
          >
            <button
              type="button"
              onClick={() => onOpen(p)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-[15px] font-light text-ink">
                {p.label}
              </p>
              <p className="mt-1 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {cat ? cat.label : "any category"}
                <span aria-hidden="true"> · </span>
                {type ? TYPE_LABEL[type] : "any type"}
                {p.freeOnly && (
                  <>
                    <span aria-hidden="true"> · </span>free
                  </>
                )}
              </p>
            </button>
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              aria-label="Remove saved path"
              className="text-xs font-light uppercase tracking-[0.2em] text-ink-mute hover:text-ink"
            >
              remove
            </button>
          </li>
        );
      })}
    </ul>
  );
}
