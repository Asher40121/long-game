# Long Game: Project Status

**Current phase:** Phase 2, Design and plan (awaiting approval)
**Last updated:** 2026-11-24

## Decisions
- 2026-11-20: Samples first; live AI later (v1.0 "Could").
- 2026-11-20: Ship in about 1 week (target 2026-11-27), so scope is cut to the core flow (see the MoSCoW table in docs/PRODUCT_BRIEF.md).
- 2026-11-20: Fictional hobby holding company as the acquirer, with deliberate portfolio gaps.
- 2026-11-20: "About me" draws on founder experience, toy/hobby industry work (no client names), and the goal of organizing long-term acquisitions and relationships.
- 2026-11-24: Product Brief approved. Name: Long Game. Repo: `Asher40121/long-game`, public, MIT.
- 2026-11-24: Stack: Next.js 16 + TypeScript + Tailwind 4 + Vitest; static export to GitHub Pages (`npm run build:demo`). Moving to Vercel only if live AI is added.
- 2026-11-24: Secrets scan is `npm run scan` (built-in tools only); run before every push.
- 2026-11-24: Fictional acquirer "Larkspur Hobby Group" with 5 brands; 12 targets. Names checked by web search against real sector companies; renamed "Northgate" → Ashby Collector Shows, "Vaultwell" → Brightkeep Supplies, "Slabwise" → Foilscope to avoid near-matches.
- 2026-11-24: Fit = weighted tally of 7 criteria (expansion computed from portfolio gaps) minus capped risk penalties. Health = days since last touch vs. stage cadence; gone quiet at 60+ days past cadence.
- 2026-11-24: Target pages use `/target/?id=` so visitor-created targets work on a static site.

## Open questions
- [ ] Optional: install gitleaks for a stronger secrets scan (needs your permission to download it).

## Phase 2 deliverables
- docs/WIREFRAMES.md, docs/ARCHITECTURE.md, docs/ROADMAP.md
- src/data/seed.ts (12 targets), src/data/portfolio.ts
- docs/prompts/decision-brief.md (with a reference brief for Emberline), docs/prompts/conversation-prep.md
- Fit and health logic with 32 tests (pulled forward from Phase 3 to validate the seed data)
- GitHub: 3 milestones, 17 issues with acceptance criteria

## Next actions
- Your approval of Phase 2.
- Phase 3: v0.1 issues #1–#7, then v0.2 #8–#14.
