"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { RiverLine } from "@/components/RiverLine";
import { cn } from "@/lib/cn";
import { drops as seededDrops } from "@/data/community/drops";
import { journals } from "@/data/community/journals";
import { mentors } from "@/data/community/mentors";
import { paths } from "@/data/community/paths";
import { threads } from "@/data/community/threads";
import {
  COMMUNITY_TYPE_LABEL,
  timeAgo,
} from "@/lib/community/format";
import {
  generateId,
  loadState,
  postDrop,
  saveState,
  toggleJoin,
} from "@/lib/community/storage";
import type {
  Community,
  CommunityState,
  DropUpdate,
} from "@/lib/community/types";

type Tab = "drops" | "threads" | "journals" | "paths" | "members";

const DEFAULT_STATE: CommunityState = {
  joinedCommunities: [],
  myDrops: [],
  myJournal: null,
  followedPaths: [],
  pathProgress: {},
  version: 1,
};

type Props = {
  community: Community;
};

export function SingleCommunity({ community: c }: Props) {
  const [state, setState] = useState<CommunityState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [tab, setTab] = useState<Tab>("drops");
  const [dropText, setDropText] = useState("");
  const [dropAnon, setDropAnon] = useState(true);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CommunityState) => {
    setState(next);
    saveState(next);
  }, []);

  const joined = state.joinedCommunities.includes(c.id);

  const communityDrops = useMemo<DropUpdate[]>(() => {
    const all = [
      ...seededDrops.filter((d) => d.communityId === c.id),
      ...state.myDrops.filter((d) => d.communityId === c.id),
    ];
    return all
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }, [c.id, state.myDrops]);

  const communityThreads = useMemo(
    () => threads.filter((t) => t.communityId === c.id),
    [c.id],
  );
  const communityJournals = useMemo(
    () => journals.filter((j) => j.communityId === c.id),
    [c.id],
  );
  const communityPaths = useMemo(
    () => paths.filter((p) => p.communityId === c.id),
    [c.id],
  );
  const communityMentors = useMemo(
    () => mentors.filter((m) => m.communityIds.includes(c.id)),
    [c.id],
  );

  function postQuickDrop() {
    const text = dropText.trim();
    if (text.length === 0) return;
    const drop: DropUpdate = {
      id: generateId("md"),
      communityId: c.id,
      authorId: dropAnon ? "u-me-anon" : "u-me",
      authorName: dropAnon ? "a quiet five-er" : "You",
      anonymous: dropAnon,
      body: text,
      createdAt: new Date().toISOString(),
    };
    persist(postDrop(state, drop));
    setDropText("");
  }

  return (
    <Container size="wide" className="pb-24 pt-10 md:pt-14">
      {/* Header */}
      <header className="border-b border-line/60 pb-8">
        <Link
          href="/cubes/community/discover"
          className="text-[12px] font-light uppercase tracking-[0.22em] text-ink-mute hover:text-ink"
        >
          ← discover
        </Link>
        <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-line text-xl font-light text-ink-soft"
            >
              {c.glyph}
            </span>
            <div>
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                {COMMUNITY_TYPE_LABEL[c.type]}
              </p>
              <h1 className="mt-2 text-3xl font-light tracking-brand text-ink md:text-4xl">
                {c.name}
              </h1>
              <p className="mt-2 max-w-prose text-[15px] font-light italic leading-relaxed text-ink-soft md:text-base">
                {c.oneLine}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => persist(toggleJoin(state, c.id))}
            disabled={!hydrated}
            className={cn(
              "inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-light transition-colors",
              joined
                ? "border-ink bg-ink text-paper"
                : "border-line text-ink hover:border-ink/40",
            )}
          >
            {joined ? "Joined" : "Join the community"}
          </button>
        </div>

        <p className="mt-6 max-w-prose text-[15px] font-light leading-relaxed text-ink-soft md:text-base">
          {c.description}
        </p>

        {/* Quiet presence */}
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <PresenceStat
            label="members"
            value={c.memberCount.toLocaleString()}
          />
          <PresenceStat label="days active" value={String(c.daysActive)} />
          <PresenceStat
            label="drops this week"
            value={String(c.weeklyDrops)}
          />
          <PresenceStat
            label="mentors"
            value={String(communityMentors.length)}
          />
        </div>

        {c.presence.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {c.presence.map((p, i) => (
              <span
                key={i}
                className="inline-flex h-7 items-center rounded-full border border-line bg-paper px-3 text-[11.5px] font-light text-ink-soft"
              >
                <span className="text-ink">{p.count}</span>
                <span className="ml-1">{p.activity}</span>
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="mt-10 flex flex-wrap gap-2 border-b border-line/60 pb-3">
        {(["drops", "threads", "journals", "paths", "members"] as Tab[]).map(
          (t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-3 py-1.5 text-[12px] font-light uppercase tracking-[0.22em] transition-colors",
                tab === t
                  ? "bg-ink text-paper"
                  : "text-ink-mute hover:text-ink",
              )}
            >
              {t}
            </button>
          ),
        )}
      </div>

      {/* Tab contents */}
      {tab === "drops" && (
        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div>
            {/* Quick drop composer */}
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                share one small drop
              </p>
              <textarea
                value={dropText}
                onChange={(e) => setDropText(e.target.value)}
                rows={2}
                placeholder='"I read five minutes today." "Returned to my notebook after weeks."'
                className="mt-3 w-full resize-none rounded-md border border-line bg-paper p-3 text-[15px] font-light leading-relaxed text-ink placeholder:text-ink-mute/70 focus:border-ink/40 focus:outline-none"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-light text-ink-soft">
                  <input
                    type="checkbox"
                    checked={dropAnon}
                    onChange={(e) => setDropAnon(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span>Post anonymously</span>
                </label>
                <button
                  type="button"
                  onClick={postQuickDrop}
                  disabled={dropText.trim().length === 0}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full bg-ink px-4 text-[13px] font-light text-paper hover:bg-accent",
                    dropText.trim().length === 0 &&
                      "cursor-not-allowed opacity-40",
                  )}
                >
                  Drop
                </button>
              </div>
            </div>

            <ul className="mt-6 space-y-3">
              {communityDrops.map((d) => (
                <li
                  key={d.id}
                  className="rounded-2xl border border-line bg-surface p-5"
                >
                  <p className="text-[15px] font-light leading-relaxed text-ink">
                    {d.body}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    <span className="text-ink-soft">{d.authorName}</span>
                    {d.authorIsMentor && (
                      <span className="rounded-full border border-line bg-paper px-2 py-0.5 text-[10px]">
                        mentor of momentum
                      </span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>{timeAgo(d.createdAt)}</span>
                    {d.tag && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-ink">#{d.tag}</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Side: quiet presence + reactions philosophy */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                quiet presence
              </p>
              <p className="mt-3 text-[14.5px] font-light leading-relaxed text-ink-soft">
                {c.presence.length === 0
                  ? "Quiet right now."
                  : c.presence
                      .map((p) => `${p.count} ${p.activity}`)
                      .join(" · ")}
              </p>
              <p className="mt-3 text-[12px] font-light italic leading-relaxed text-ink-mute">
                No live chat. No comment threads on drops. Just the subtle sense of not being alone.
              </p>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-5">
              <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                what we do not do here
              </p>
              <ul className="mt-3 space-y-1.5 text-[13px] font-light leading-relaxed text-ink-soft">
                <li>· no likes, no follower counts</li>
                <li>· no comment chains on drops</li>
                <li>· no leaderboards</li>
                <li>· anonymous mode welcome</li>
              </ul>
            </div>
          </aside>
        </section>
      )}

      {tab === "threads" && (
        <section className="mt-8">
          {communityThreads.length === 0 ? (
            <EmptyPanel body="No threads yet. Drops are enough for now." />
          ) : (
            <ul className="space-y-4">
              {communityThreads.map((t) => (
                <li
                  key={t.id}
                  className="rounded-2xl border border-line bg-surface p-6 md:p-7"
                >
                  <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    momentum thread · {timeAgo(t.createdAt)}
                  </p>
                  <h3 className="mt-2 text-lg font-light tracking-brand text-ink md:text-xl">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-[15px] font-light leading-relaxed text-ink-soft">
                    {t.openerBody}
                  </p>
                  <p className="mt-2 text-[11.5px] font-light italic text-ink-mute">
                    — {t.openerAuthorName}
                  </p>
                  <ul className="mt-4 space-y-3 border-t border-line/60 pt-4">
                    {t.replies.map((r) => (
                      <li key={r.id} className="rounded-xl bg-paper/60 p-4">
                        <p className="text-[14.5px] font-light leading-relaxed text-ink">
                          {r.body}
                        </p>
                        <p className="mt-2 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                          <span className="text-ink-soft">{r.authorName}</span>
                          {r.authorIsMentor && (
                            <span className="ml-2 rounded-full border border-line bg-paper px-2 py-0.5 text-[10px]">
                              mentor of momentum
                            </span>
                          )}
                          <span className="ml-2">{timeAgo(r.createdAt)}</span>
                        </p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "journals" && (
        <section className="mt-8">
          {communityJournals.length === 0 ? (
            <EmptyPanel body="No journals tied to this community yet." />
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {communityJournals.map((j) => (
                <li
                  key={j.id}
                  className="rounded-2xl border border-line bg-surface p-6 md:p-7"
                >
                  <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    {j.authorName}
                    {j.authorIsMentor && (
                      <span className="ml-2 rounded-full border border-line bg-paper px-2 py-0.5 text-[10px]">
                        mentor
                      </span>
                    )}
                  </p>
                  <h3 className="mt-2 text-lg font-light tracking-brand text-ink md:text-xl">
                    {j.title}
                  </h3>
                  <p className="mt-2 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
                    {j.oneLine}
                  </p>
                  <ul className="mt-4 space-y-3 border-t border-line/60 pt-4">
                    {j.entries.slice(0, 3).map((e) => (
                      <li
                        key={e.id}
                        className="text-[14px] font-light leading-relaxed text-ink-soft"
                      >
                        <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                          {e.dropDate}
                        </p>
                        <p className="mt-1">{e.body}</p>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[12px] font-light text-ink-mute">
                    {j.entries.length} entries
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "paths" && (
        <section className="mt-8">
          {communityPaths.length === 0 ? (
            <EmptyPanel body="No curated paths in this community yet." />
          ) : (
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {communityPaths.map((p) => (
                <li
                  key={p.id}
                  className="rounded-2xl border border-line bg-surface p-6 md:p-7"
                >
                  <p className="text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    by {p.authorName}
                  </p>
                  <h3 className="mt-2 text-lg font-light tracking-brand text-ink md:text-xl">
                    <Link
                      href={`/cubes/community/paths/${p.id}`}
                      className="hover:underline underline-offset-4"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[14.5px] font-light italic leading-relaxed text-ink-soft">
                    {p.oneLine}
                  </p>
                  <p className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                    {p.steps.length} steps
                    {p.totalDays && (
                      <>
                        <span aria-hidden="true"> · </span>
                        {p.totalDays} days
                      </>
                    )}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/cubes/community/paths/${p.id}`}
                      className="inline-flex h-9 items-center rounded-full border border-line px-4 text-[13px] font-light text-ink hover:border-ink/40"
                    >
                      Open path →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {tab === "members" && (
        <section className="mt-8">
          {communityMentors.length === 0 ? (
            <EmptyPanel body="No mentors yet. Communities develop them slowly." />
          ) : (
            <>
              <p className="mb-5 max-w-prose text-[13px] font-light italic leading-relaxed text-ink-mute">
                Mentors of momentum are long-active members who help others continue. Reputation here is built only on consistency and helping — never on follower counts.
              </p>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {communityMentors.map((m) => (
                  <li
                    key={m.id}
                    className="rounded-2xl border border-line bg-surface p-5"
                  >
                    <p className="text-[15px] font-light tracking-brand text-ink">
                      {m.name}
                    </p>
                    <p className="mt-1 text-[13.5px] font-light italic leading-relaxed text-ink-soft">
                      {m.oneLine}
                    </p>
                    <p className="mt-3 text-[11px] font-light uppercase tracking-[0.22em] text-ink-mute">
                      {m.daysActive} days active
                      <span aria-hidden="true"> · </span>
                      {m.dropsContributed} drops
                      <span aria-hidden="true"> · </span>
                      helped {m.helpedCount} people
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      )}

      <div className="mt-16 flex flex-col items-center gap-3 border-t border-line/70 pt-12 text-center">
        <RiverLine />
        <p className="mt-4 text-sm font-light italic text-ink-mute">
          Drop after drop. Quietly, with other humans.
        </p>
      </div>
    </Container>
  );
}

function PresenceStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-[10px] font-light uppercase tracking-[0.22em] text-ink-mute">
        {label}
      </p>
      <p className="mt-2 text-xl font-thin tracking-brand text-ink md:text-2xl">
        {value}
      </p>
    </div>
  );
}

function EmptyPanel({ body }: { body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper/40 p-6 text-center">
      <p className="text-[14px] font-light text-ink-soft">{body}</p>
    </div>
  );
}
