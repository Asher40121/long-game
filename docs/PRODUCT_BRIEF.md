# Long Game: Product Brief

*A relationship-first deal pipeline for corporate development teams.*
**Demo with fictional data.** Every company, founder and figure is invented.

## Problem
Corporate development teams in founder-heavy sectors source deals over years, not quarters. The best targets aren't for sale today; they become available when a founder trusts you and the timing changes (succession, burnout, a growth wall, a partner exit). Today that relationship lives in a spreadsheet, a CRM built for sales pipelines, or one person's memory. Stage-and-numbers trackers miss what actually decides these deals: when you last spoke, what the founder cares about protecting, and whether the business fills a real gap in the portfolio. Relationships go cold without anyone noticing, and leadership gets fit arguments as opinion instead of a consistent, comparable case.

## Persona
**Corporate Development Manager** at a mid-size acquirer of hobby, collectibles and trading card brands. Reports to the CFO and works with the executive team. Manages 30–80 relationships at once, most in "nurture" for 6–36 months. Needs to (a) never let a good founder relationship lapse, (b) show leadership why a target fits, in one page, and (c) hand diligence and integration teams the context the relationship built.

## Jobs to be done
1. *When I start my week*, show me which founder relationships are going quiet and give me a natural reason to reach out, *so no relationship lapses.*
2. *When I prepare for a founder conversation*, brief me on their story, what matters to them and what not to push, *so I come across as a partner, not a buyer.*
3. *When leadership asks "why this one?"*, give me a transparent fit score measured against portfolio gaps, *so the case is consistent and comparable.*
4. *When a target is ready to move forward*, produce a one-page decision brief with risks, open questions and a clear next step, *so leadership can decide quickly.*
5. *When we go into diligence and integration*, carry forward what the founder wants to preserve, *so we don't lose the trust that got us the deal.*

## Fictional setting
**Acquirer:** an invented hobby holding company with 5–6 invented brands, mostly US and mostly trading cards, accessories and retail. That leaves deliberate gaps (Europe, live events, direct-to-consumer, tabletop/miniatures) for targets to fill.
**Targets:** 10 invented businesses (card game publishers, grading and storage accessories, hobby retailers, a convention organizer, a European distributor and others), each with a founder story, touchpoint history spanning months to years, and a hand-written decision brief.

## MVP scope (MoSCoW), sized for a 1-week build
| | Scope |
|---|---|
| **Must** | Landing screen (one-sentence pitch, "Explore the demo" button, 3-step tour) · Pipeline board and table across 10 relationship stages · Target page with founder profile and touchpoint timeline · Relationship health (recency vs. expected cadence) and a "Gone quiet" list with low-pressure reasons to reach out · Fit scorecard: weighted criteria, one-line "why", portfolio-gap view · Decision brief: hand-written sample output per seeded target, labeled "Sample output" · "Demo with fictional data" label, "Reset demo data", "How this works and what's stored" footer · localStorage only · Unit tests for scoring and relationship health · README, MIT license, CHANGELOG |
| **Should** | Log a touchpoint and edit a target · Adjustable criterion weights · Dark mode · Conversation prep samples for 3–4 targets |
| **Could** | Diligence and integration checklist (5 workstreams, owner, status, "needs leadership decision") · Live AI mode on Vercel with rate limit and daily spend cap |
| **Won't (v1)** | Accounts, teams, CRM/email integrations, real data connectors, financial modeling, document upload, billing |

**Brief for a visitor-created target:** demo mode has no pre-written sample for it, so Long Game assembles a brief only from the facts entered, and lists what's missing and what to ask. It never invents filler, and it's labeled as assembled, not AI.

## Success metric
A first-time visitor loads the demo, understands what it is, and completes the core flow (open a target → see its fit score and why → open its decision brief) in **under 3 minutes with no instructions**. I'll test this in Phase 4 with fresh-eyes walkthroughs and time each step.

## How corp dev teams track deals today (alternatives)
| Alternative | What it does well | Where it falls short for this job |
|---|---|---|
| Excel / Google Sheets | Flexible, free, CFO-friendly | No cadence tracking, no history, fit logic hidden in cells |
| Salesforce / HubSpot, customized | Contacts, activity logging | Built for sales funnels and quarterly velocity, not multi-year founder relationships |
| DealCloud (Intapp), Navatar | Deal management for PE, banks and corp dev | Heavy, expensive, admin-intensive; stage and number centric |
| Affinity, 4Degrees | Relationship intelligence from email and calendar data | Measures network strength, not strategic fit or founder motives |
| Midaxo, DealRoom | Pipeline plus diligence and integration project management | Strong once a deal is live; weak at the long nurture before it |
| Grata, SourceScrub | Data for finding private companies | Sourcing lists, not relationships |

**Long Game's angle:** the founder relationship is the main record, fit is scored against portfolio gaps, and nurture is a first-class stage that can last years. It's a focused showcase of judgment, not a replacement for an enterprise system.

## Key decisions
| Decision | Why | Tradeoff |
|---|---|---|
| Samples first, live AI later | $0, no key, no abuse risk; the 3-minute flow is identical | Visitors can't generate a new AI brief in v1 |
| Next.js + TypeScript + Tailwind, static export to GitHub Pages | Free, already working for Attune, fast to ship | Live AI later means moving to Vercel (new demo URL); code is structured so that's a deploy change, not a rewrite |
| Deterministic fit scoring and health in code | Transparent and explainable, testable, instant | Less "magic" than AI scoring, which is the point for a CFO |
| Relationship stages, not deal stages | The core insight; Nurture and Passed are real outcomes | Less familiar to people expecting a sales funnel |
| Valuation and legal shown as inputs for Finance and Legal | That's how real corp dev works; avoids overreach | Briefs never state a price |

## Risks and mitigations
| Risk | Mitigation |
|---|---|
| Looks like a generic CRM clone | Open on judgment: "Gone quiet" with reasons, fit vs. gaps, brief one click away; founder motives front and center |
| Seed data reads as naive about M&A | Realistic sector detail: ownership types, platform vs. add-on, size bands, real-feeling succession and earnout concerns, without numbers that imply a valuation |
| Fictional names collide with real companies | Check every name against real companies in the sector before it ships |
| Implied affiliation with any real acquirer | No real names or branding; the acquirer is invented; README says "built independently" |
| Tight timeline | Ship Musts first, each step committable; Shoulds only once the core flow passes the 3-minute test |

## Naming options
1. **Long Game** (current): memorable, says "patience" immediately. It's a common phrase, so it's hard to own; fine for a portfolio piece.
2. **Groundwork**: the work done long before a deal.
3. **Fieldbook**: a corp dev's working notebook of founders and markets.
4. **Tended**: relationships you keep up. Short, but less self-explanatory.

*No trademark search has been done; that only matters if this becomes a product.*

## Roadmap
**v0.1** pipeline, target pages, founder profile, timeline, health → **v0.2** fit scorecard, portfolio gaps, decision briefs, landing and tour, deploy → **v1.0** conversation prep, diligence and integration checklist, polish, optional live AI with spend cap.
