import type { CampaignType, Role } from "@/lib/organizations/types";

export type CampaignTypeMeta = {
  id: CampaignType;
  label: string;
  glyph: string;
  /** Short, non-corporate one-liner shown on the type picker. */
  oneLine: string;
  /** Longer description shown when type is selected in the builder. */
  body: string;
  /** Default suggested role audience. */
  defaultRole?: Role;
  /** Sample KPIs the user can pick from. */
  kpiSuggestions: string[];
  /** Example "five-minute actions" the user could run inside this campaign. */
  actionExamples: string[];
};

/**
 * The six campaign archetypes from the spec.
 *
 * Each one is editorial copy, not corporate filler. The action examples
 * show what a five-minute version of the work actually looks like.
 */
export const campaignTypes: CampaignTypeMeta[] = [
  {
    id: "empowerment",
    label: "Employee empowerment",
    glyph: "✿",
    oneLine: "Five minutes of real attention from a manager.",
    body:
      "Managers run five-minute moments of recognition, appreciation, listening, or honest feedback — not in a workshop, in a Tuesday. Leadership becomes presence rather than pressure.",
    defaultRole: "manager",
    kpiSuggestions: [
      "Increase engagement",
      "Reduce burnout",
      "Improve manager–report trust",
      "Increase retention",
    ],
    actionExamples: [
      "A five-minute 1:1 outside the regular cadence.",
      "A specific, named thank-you for last week’s work.",
      "Ask one real question and actually listen.",
      "Acknowledge one piece of work that nobody noticed.",
    ],
  },
  {
    id: "lost-customer",
    label: "Lost customer",
    glyph: "◇",
    oneLine: "Five minutes to reconnect with a real human.",
    body:
      "Not a CRM workflow. A five-minute human reach-out to a customer who quietly left, a relationship that went cold, or an account that has been treated as a row in a sheet for too long.",
    kpiSuggestions: [
      "Improve customer satisfaction",
      "Recover dormant accounts",
      "Increase support trust",
      "Reduce silent churn",
    ],
    actionExamples: [
      "Call one customer who hasn’t opened your product in 30 days.",
      "Write one short, honest message — no template.",
      "Listen for five minutes, take no action.",
      "Send a specific thank-you to a long-standing account.",
    ],
  },
  {
    id: "innovation",
    label: "Innovation",
    glyph: "✺",
    oneLine: "Five minutes for a real new idea.",
    body:
      "Not an innovation off-site. Five honest minutes thinking about friction, process improvement, or one small product idea — written down, shared with two people, considered.",
    kpiSuggestions: [
      "Increase idea throughput",
      "Reduce process friction",
      "Improve cross-team ideas",
      "Speed up improvement cycles",
    ],
    actionExamples: [
      "Write one note about a piece of friction you noticed this week.",
      "Sketch one product idea on paper. Stop on time.",
      "Identify one thing the team does that nobody decided to do.",
      "Pick one process and ask: what would the smallest improvement be?",
    ],
  },
  {
    id: "learning",
    label: "Learning",
    glyph: "✦",
    oneLine: "Five minutes of company-shaped learning.",
    body:
      "A short daily learning moment: a customer story, a company value worked through one example, a peer-written tip, a tiny case study. Not training — culture.",
    kpiSuggestions: [
      "Strengthen values literacy",
      "Increase peer-to-peer learning",
      "Speed up onboarding",
      "Improve customer literacy",
    ],
    actionExamples: [
      "Read one customer support transcript end-to-end.",
      "Re-read one company value and write a single sentence about it.",
      "Share one tip with one specific person.",
      "Watch one five-minute internal video clip.",
    ],
  },
  {
    id: "appreciation",
    label: "Appreciation",
    glyph: "♡",
    oneLine: "Peer-to-peer recognition, five minutes at a time.",
    body:
      "Employees recognise each other directly — not through a quarterly nomination form. A specific message, a quick public note, a real thank-you. Daily action becomes culture.",
    kpiSuggestions: [
      "Increase peer recognition",
      "Improve team belonging",
      "Strengthen cross-team relationships",
      "Improve daily morale",
    ],
    actionExamples: [
      "Send one specific thank-you to a teammate.",
      "Name one piece of work that helped you this week.",
      "Recognise one quiet contribution publicly.",
      "Thank someone you have never thanked before.",
    ],
  },
  {
    id: "reflection",
    label: "Reflection",
    glyph: "◐",
    oneLine: "Five minutes of organizational pause.",
    body:
      "A short, structured pause — alone or in a team. What worked. What didn’t. What we learned. What deserves attention next week. Five minutes is enough.",
    kpiSuggestions: [
      "Improve retrospective quality",
      "Increase shared learning",
      "Reduce repeated mistakes",
      "Build a calmer team rhythm",
    ],
    actionExamples: [
      "Write three sentences: kept · changed · learned.",
      "Run a five-minute team reflection at end of standup.",
      "Identify one decision the team should revisit.",
      "Name one thing worth keeping.",
    ],
  },
];

export function getCampaignType(id: CampaignType): CampaignTypeMeta {
  return campaignTypes.find((c) => c.id === id) ?? campaignTypes[0];
}
