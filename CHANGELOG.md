# Changelog

All notable changes to this project are documented here. Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]
### Added
- Add and edit companies (`/edit`): company, founder, priorities, concerns, key dates (upcoming ones show on the map) and risks; delete companies you added. Closes #12.
- 90-second video script, shot list and recording checklist (docs/VIDEO_SCRIPT.md).
### Changed
- The demo always opens in dark mode; the toggle switches to light for the visit and is no longer saved.
- Fit scores with fewer than three hand-rated criteria are labeled Preliminary instead of given a band.
- Founder and business cards hide sections with nothing entered.
- README with screenshots, AI guardrails and About me; LinkedIn link in the footer and tour.
- Live demo on GitHub Pages: landing page, Relationship map, pipeline, target pages, fit scorecard, portfolio gaps, decision briefs, guided tour.
- Project scaffold: Next.js, TypeScript, Tailwind CSS, Vitest; static export for GitHub Pages.
- Fictional seed data: an acquirer with 5 brands and 12 targets with founders and touchpoint histories.
- Fit scorecard and portfolio-gap logic; relationship health, gone quiet and reach-out logic; 32 unit tests.
- Wireframes, architecture, roadmap and AI prompt drafts.
- Product brief, project status, MIT license, `.env.example`, pre-push secrets scan (`npm run scan`).
