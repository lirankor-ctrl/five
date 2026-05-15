import type { ResearchTheme } from "@/lib/manifesto/types";

/**
 * Research & science — Section 4.
 *
 * Editorial summaries, not citations. References are kept loose so a future
 * CMS can attach proper bibliographic entries without changing the shape.
 */
export const researchThemes: ResearchTheme[] = [
  {
    id: "attention",
    eyebrow: "01",
    title: "Attention & digital life",
    body:
      "The small moments that used to belong to us are now the most valuable real estate in the economy. Research over the past decade has begun to document what users have felt for years: fragmentation is not a side-effect of modern tools — it is, increasingly, their business model.",
    topics: [
      {
        title: "TikTok brain",
        body:
          "Short-form feeds train the attention system to expect novelty every few seconds. Recent studies in adolescents and adults show measurable reductions in sustained-attention tasks after heavy short-video use. The effect is not permanent. It is reversible by re-introducing windows of slower attention.",
      },
      {
        title: "The dopamine economy",
        body:
          "Infinite-scroll feeds operate on intermittent reinforcement schedules — the same psychological mechanism that makes slot machines profitable. Users are not weak; the systems are highly tuned. The honest framing is asymmetry of design, not personal failure.",
      },
      {
        title: "Attention fragmentation",
        body:
          "Even brief interruptions impose a measurable switching cost on the working brain. Across a day, these costs accumulate into the feeling of being busy without producing anything. five is, in part, a quiet practice of unfragmenting one small interval at a time.",
      },
    ],
  },
  {
    id: "learning",
    eyebrow: "02",
    title: "Learning & consistency",
    body:
      "The science of how skill is built is unusually clear. It is not built in long heroic sessions. It is built in short, repeated, attentive ones — especially when there is recovery time between them. Almost every modern productivity tool ignores this.",
    topics: [
      {
        title: "Micro-habits",
        body:
          "A small action attached to an existing routine has a far higher long-term survival rate than a large action requiring its own slot. five is designed around micro-habit principles: the unit is intentionally tiny, the friction is intentionally low.",
      },
      {
        title: "Spaced repetition",
        body:
          "Knowledge — and to a meaningful degree, identity — is consolidated through spacing, not cramming. A five-minute daily return outperforms a two-hour weekly session for most kinds of long-term retention.",
      },
      {
        title: "Behaviour loops",
        body:
          "Reliable behaviour change requires a cue, a low-friction action, and an honest acknowledgement of the return. Streaks and scoring tend to corrupt this loop. Gentle memory does not.",
      },
    ],
  },
  {
    id: "identity",
    eyebrow: "03",
    title: "Identity & growth",
    body:
      "Identity is not the stable thing folk-psychology suggests. The lived experience of being a person is closer to a slow process of composition — and the brain itself is far more plastic, well into adulthood, than twentieth-century models assumed.",
    topics: [
      {
        title: "Neuroplasticity",
        body:
          "The adult brain remains structurally adaptive across the lifespan. Small repeated experiences quietly rewire it. This is the biological substrate of micro-multipotentiality.",
      },
      {
        title: "Curiosity as engine",
        body:
          "Curiosity-driven exploration activates reward systems that pure goal-pursuit does not. Long-term growth tracks curiosity far more closely than discipline.",
      },
      {
        title: "Adaptive identity",
        body:
          "Recent narrative-identity research suggests that healthy adults regularly rewrite their personal story in response to experience. five takes this not as a finding to admire but as an operating principle.",
      },
    ],
  },
  {
    id: "wellbeing",
    eyebrow: "04",
    title: "Well-being & momentum",
    body:
      "Subjective well-being correlates less with achievement than with intentionality. People who report living well are not usually doing more; they are doing what they do on purpose.",
    topics: [
      {
        title: "Flow states",
        body:
          "Csíkszentmihályi’s body of work on flow shows that meaning correlates with absorption in chosen activity. five is built to make small, regular flow accessible — five honest minutes is often enough.",
      },
      {
        title: "Meaning",
        body:
          "Cross-cultural studies on meaning consistently identify two ingredients: connection to others, and effort towards something the person endorses. Drops are a low-friction vehicle for the second.",
      },
      {
        title: "Momentum psychology",
        body:
          "Self-efficacy — the felt sense that your actions matter — is built and maintained by small, achievable returns. It collapses under unrealistic goals. The five-minute unit is calibrated to keep self-efficacy intact even on hard weeks.",
      },
    ],
  },
];

export const researchStance = {
  title: "five is not anti-technology.",
  body:
    "We are not asking anyone to retreat. Modern tools are extraordinary, and we are not interested in nostalgia. The problem is not modern speed itself. The problem is loss of direction, loss of rhythm, loss of intentionality, and uncontrolled stimulation. five is a calm practice for taking pace, dosage, direction, and momentum back into your own hands — without leaving the world you live in.",
};
