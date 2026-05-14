export type CubeStatus = "start" | "explore" | "coming-soon";

export type Cube = {
  /** URL-safe id, e.g. "solo" — used in /cubes/[id]. */
  id: string;
  /** Display name, e.g. "five solo". */
  name: string;
  /** One-line human description shown on the cube card. */
  shortDescription: string;
  /** A longer emotional purpose statement shown on the cube detail page. */
  emotionalPurpose: string;
  /** Paragraph(s) describing what this cube is and isn't. */
  description: string;
  /** Current product status — drives the CTA on the card. */
  status: CubeStatus;
  /** Three to five calm action ideas a user might take in this cube. */
  suggestedActions: string[];
  /** Optional visual accent metadata for future styling. */
  accent?: {
    /** Soft surface tint used on hover or as a quiet background. */
    surface?: string;
    /** Single-character or short token glyph for the cube. */
    glyph?: string;
  };
};

export type SwotKey = "strengths" | "adjust" | "opportunities" | "blockers";

export type SwotEntry = {
  key: SwotKey;
  label: string;
  prompt: string;
  placeholders: string[];
};
