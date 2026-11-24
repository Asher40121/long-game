# Long Game: Project Status

**Current phase:** Phase 2, Design and plan
**Last updated:** 2026-11-24

## Decisions
- 2026-11-20: Samples first; live AI later (v1.0 "Could").
- 2026-11-20: Ship in about 1 week (target 2026-11-27), so scope is cut to the core flow (see the MoSCoW table in docs/PRODUCT_BRIEF.md).
- 2026-11-20: Fictional hobby holding company as the acquirer, with deliberate portfolio gaps.
- 2026-11-20: "About me" draws on founder experience, toy/hobby industry work (no client names), and the goal of organizing long-term acquisitions and relationships.
- 2026-11-24: Product Brief approved. Name: Long Game. Repo: `Asher40121/long-game`, public, MIT.
- 2026-11-24: Stack: Next.js 16 + TypeScript + Tailwind 4 + Vitest; static export to GitHub Pages (`npm run build:demo`). Moving to Vercel only if live AI is added.
- 2026-11-24: Secrets scan is `npm run scan` (built-in tools only); run before every push.

## Open questions
- [ ] Optional: install gitleaks for a stronger secrets scan (needs your permission to download it).

## Next actions
- Phase 2: wireframes, architecture, seed data (10 targets), AI prompt drafts, Issues backlog, milestones. Then stop for approval.
