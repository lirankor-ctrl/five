# five

> You don’t need more time. You need five.

A calm, human, intentionally minimal app for the small drops of time between the anchors of life — work, family, duties, stress, obligations.

This repository contains the **visual framework and skeleton** of the app — the foundation we will expand cube by cube.

---

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other scripts:

- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — Next.js / ESLint
- `npm run typecheck` — TypeScript only, no emit

Requires Node 18.18+ (Node 20+ recommended).

---

## What is in this first version

| Route | Purpose |
|---|---|
| `/` | Landing — logo, tagline, Take five / Explore the river |
| `/home` | Dashboard — greeting, today’s five, your river, choose a cube, quick report, reflection |
| `/cubes` | Cube map — grid of all 11 cubes with status |
| `/cubes/[id]` | Cube detail — emotional purpose, suggested drops, future-work placeholders |
| `/reflection` | A respectful mirror — SWOT re-framed as Strengths / Areas to adjust / Opportunities / Possible blockers |

---

## Architecture

```
app/                       Next.js App Router pages
  layout.tsx               Root layout (font, Shell)
  page.tsx                 Landing
  home/page.tsx            Dashboard
  cubes/page.tsx           Cube map
  cubes/[id]/page.tsx      Cube detail (dynamic)
  reflection/page.tsx      Reflection mirror
  not-found.tsx            Calm 404
  globals.css              Design tokens + river hairline

components/
  Shell.tsx                NavBar + main + Footer
  NavBar.tsx               Calm sticky top nav
  Footer.tsx
  Container.tsx            Three width tiers
  Section.tsx              Eyebrow + title + description block
  Card.tsx                 Hairline card (linked or static)
  Button.tsx               LinkButton + Button (primary / secondary / ghost)
  Logo.tsx                 Wordmark + squircle mark variants
  CubeCard.tsx             Card for a single cube
  Greeting.tsx             Client component — time-aware greeting
  RiverLine.tsx            Subtle horizontal "river" hairline

data/
  cubes.ts                 All 11 cubes — id, name, purpose, suggested drops, status
  reflection.ts            SWOT mirror entries

lib/
  types.ts                 Cube, CubeStatus, SwotEntry types
  cn.ts                    Tiny classname joiner

public/
  logo.png                 Primary logo (light)
  logo-dark.png            Inverted logo (dark)
```

### Design tokens

Defined in `tailwind.config.ts` and `app/globals.css`:

- `paper` `#FAFAF7` — warm off-white background
- `surface` `#FFFFFF` — card / panel
- `ink` `#0E0E0C` — primary text
- `ink.soft` `#4A4A47` — body
- `ink.mute` `#8A8A85` — labels, eyebrows
- `line` `#E8E7E2` — hairlines
- Font: **Inter** weights 200–600 via `next/font`
- Heading weight: **thin (200)** with tight tracking — matches the logo wordmark

### Product principles encoded in the UI

- No streaks, no scores, no badges, no notifications-as-pressure.
- No loud colors — monochrome with paper warmth.
- Eyebrows and small uppercase labels in `tracking-[0.2em]` for calm hierarchy.
- Every screen carries the language of the brief — "drops", "river", "return", "notice".
- The single subtle metaphor is the hairline `river-line` — used sparingly, never decoratively.

---

## Next development steps (suggested)

1. **Wire the first cube end-to-end.** Pick one cube (`solo` or `family`) and build a real five-minute session: an opening screen, a quiet doing space, and a small closing acknowledgement. Keep it client-side and stateless for now.
2. **Local persistence.** Add a tiny localStorage layer (`lib/store.ts`) so the "Your river" panel and reflection notes feel alive without yet introducing accounts or a backend.
3. **Manifesto editor.** Build the writing surface for `five manifesto` — a calm, slow editor with autosave and a single sentence on screen at a time.
4. **Authentication & sync.** Only once a cube genuinely needs it. (Auth is a loud anchor; we add it when the value is undeniable.)
5. **AI as quiet companion.** A single-suggestion model behind a "What might I take today?" affordance. No chat. No streams. One sentence.

The framework is intentionally light. Add only what a cube needs, when it needs it.
