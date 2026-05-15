import { communities } from "@/data/community/communities";
import type {
  CommunityInsight,
  CommunityState,
} from "./types";

/**
 * Calm, momentum-shaped insights for the user. The point is "you may
 * connect with these people / paths" — never engagement metrics.
 */
export function generateCommunityInsights(
  state: CommunityState,
): CommunityInsight[] {
  const out: CommunityInsight[] = [];

  if (state.joinedCommunities.length === 0 && state.myDrops.length === 0) {
    out.push({
      kind: "early-momentum",
      body:
        "Join one community to begin. After a few drops, soft compatibility observations will surface here.",
    });
    return out;
  }

  if (state.joinedCommunities.length >= 1) {
    const joinedTypes = new Set(
      communities
        .filter((c) => state.joinedCommunities.includes(c.id))
        .map((c) => c.type),
    );
    if (joinedTypes.has("micro-multipotential") || joinedTypes.size >= 3) {
      out.push({
        kind: "variety-leaning",
        body:
          "Many people like you keep several quiet interests at once. Variety appears to be your engine.",
      });
    } else if (state.joinedCommunities.length === 1) {
      out.push({
        kind: "depth-leaning",
        body: "You seem to be leaning toward depth in one place. That is its own valid shape.",
      });
    }
  }

  if (state.myDrops.length >= 3) {
    const tags = state.myDrops.map((d) => d.tag).filter(Boolean) as string[];
    if (tags.includes("returning") || tags.includes("after-pause")) {
      out.push({
        kind: "returning-many",
        body:
          "Returns are showing up in your drops — many people here have travelled the same shape. You may connect with them.",
      });
    }
  }

  if (state.followedPaths.length >= 2) {
    out.push({
      kind: "compatibility",
      body: "You follow several curated paths. People who do this tend to stay around longer.",
    });
  }

  if (out.length === 0) {
    out.push({
      kind: "gentle-return",
      body: "A small rhythm is forming. Keep dripping.",
    });
  }
  return out;
}
