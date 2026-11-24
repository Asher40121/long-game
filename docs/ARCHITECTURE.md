# Long Game: Architecture

## Shape
A static Next.js site. All logic runs in the visitor's browser; there's no server and no database in v1.

```
Browser
 ├─ UI (React components, Tailwind)
 ├─ Store (React context) ── localStorage "longgame:v1:state"
 ├─ Pure logic (tested)
 │   ├─ lib/fit       fit scorecard, portfolio gaps
 │   ├─ lib/health    relationship health, gone quiet, reach-out suggestions
 │   └─ lib/brief     sample lookup + "assembled from your data" brief
 └─ Data
     ├─ data/seed       12 fictional targets (relative dates)
     ├─ data/portfolio  fictional acquirer and 5 brands
     └─ data/samples    hand-written decision briefs (and later, prep notes)
```

## Key decisions
| Decision | Why | Tradeoff |
|---|---|---|
| Static export to GitHub Pages (`npm run build:demo`) | $0, no server to secure, nothing to rate-limit | Live AI needs a server later (Vercel) and a new demo URL |
| Target pages at `/target/?id=…` (query string) instead of `/target/[id]` | Static export can't pre-render pages for targets a visitor creates | Slightly less pretty URLs |
| Seed dates stored as "days ago" and materialized on load/reset | The demo never goes stale: "gone quiet" stays true whenever someone visits | Real dates appear only after materialization |
| `today` read once on the client after mount | Rendering stays deterministic (Next.js caching rules); no hydration mismatch | A first paint without dates (a skeleton) |
| Fit and health are pure functions with `today` and weights passed in | Easy to test and explain | None |
| Sample briefs keyed by target id plus a fingerprint of the seed fields | If a visitor edits a seeded target, the app says the sample no longer matches instead of showing stale claims | A little extra code |

## State
```ts
type State = {
  version: 1;
  targets: Target[];
  weights: Weights;        // fit criteria weights
  seededAt: string;        // yyyy-mm-dd the seed was materialized
  tourDone: boolean;
};
```
"Reset demo data" re-materializes the seed for today and resets weights. Storage access is wrapped in try/catch; if storage is blocked, the app runs in memory.

## Fit scorecard (lib/fit)
- Six criteria rated 1–5 by the user; **Channel & geographic expansion** is computed from portfolio gaps: new category 2 points, new region 1.5, new channel 1 (only at 15%+ of sales), a region new for the target's category 1. Rating = 1 + points, capped at 5.
- Score = Σ weight × (rating − 1) ÷ 4 over assessed criteria, scaled to 100, minus risk penalties (high 5, medium 2, low 1; max 15).
- Unassessed criteria are excluded and the weights renormalized; the "why" says how many are missing.
- Bands: 65+ Strong, 50–64 Good, 35–49 Mixed, under 35 Weak.

## Relationship health (lib/health)
- Expected cadence by stage: First Conversation 30 days, Building 45, Evaluating 21, Diligence 7, Closing 7, Integration 14, Nurture 90. Identified, Researching and Passed aren't tracked. A target can override its cadence.
- Healthy under 80% of cadence → Touch due soon up to 100% → Overdue → **Gone quiet** at 60+ days and past the cadence.
- Reach-out suggestions: founder key dates in the next 45 days first, then hand-written low-pressure ideas.

## AI (lib/brief)
- **Demo mode (v1):** returns the hand-written sample for a seeded target, labeled "Sample output". For new or edited targets, it assembles a brief only from the fields entered and lists what's missing. Never AI-labeled.
- **Live mode (v1.0, optional):** a Vercel route `/api/brief` calls Claude with the prompts in `docs/prompts/`, streaming the response. The API key lives only in a server environment variable. Rate limit per visitor plus a daily spend cap; when the cap is hit, the app says so and falls back to the sample. Request bodies are never logged.

## Testing
Vitest unit tests for fit scoring, portfolio gaps, relationship health, reach-out suggestions and seed integrity (`npm test`). Phase 4 adds a timed first-visit walkthrough, accessibility checks, mobile and dark mode.

## Security and privacy
- No accounts, no analytics, no server in v1; visitor data stays in localStorage.
- `npm run scan` checks every publishable file for key patterns and forbidden files before each push.
- `.env*` is ignored except `.env.example`.
