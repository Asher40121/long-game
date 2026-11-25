import type { Founder, KeyDate, Target, Touchpoint, TouchpointType } from "@/lib/model";

/**
 * Fictional seed data. Every company, person, number and story is invented.
 * Dates are written relative to "today" (d = days ago, inDays = days from now) and
 * materialized when the demo loads or resets, so the demo never goes stale.
 */

type SeedTouch = { d: number; type: TouchpointType; summary: string };
type SeedFounder = Omit<Founder, "keyDates"> & { keyDates: { inDays: number; label: string }[] };
export type SeedTarget = Omit<Target, "touchpoints" | "founder"> & {
  founder: SeedFounder;
  touchpoints: SeedTouch[];
};

export const SEED: SeedTarget[] = [
  // ───────────────────────────── Evaluating (the demo's hero target)
  {
    id: "emberline",
    name: "Emberline Games",
    oneLiner:
      "Independent publisher of the fantasy trading card game Ashveil, with an organized-play network across US and European hobby stores.",
    categories: ["tcg-publishing"],
    channels: [
      { channel: "hobby-stores", share: 55 },
      { channel: "wholesale", share: 25 },
      { channel: "dtc", share: 12 },
      { channel: "events", share: 8 },
    ],
    regions: ["us-national", "europe", "uk"],
    hq: "Portland, Oregon",
    founded: 2014,
    sizeBand: "$15–40M",
    ownership: "founder-led",
    dealType: "add-on",
    source: "event",
    rationale:
      "A second card game franchise reduces our dependence on Fieldstone's single title, and Emberline's organized-play network of about 300 European stores is the fastest route into Europe, our largest regional gap.",
    stage: "evaluating",
    founder: {
      name: "Dana Okafor",
      role: "Founder & Creative Director",
      background:
        "Former lead designer at a mobile games studio. Left in 2013 to make the card game she wanted to play, and crowdfunded Ashveil's first starter set.",
      built:
        "Grew Ashveil from one crowdfunded set to 14 expansions and an organized-play program in six countries. Built a 38-person team, half of it in design and art.",
      priorities: [
        { priority: "team", note: "Keep the design team together, in Portland." },
        { priority: "legacy", note: "Protect Ashveil's world and design integrity; no rushed or \"cash-grab\" sets." },
        { priority: "staying-involved", note: "Wants to remain creative director for at least three years." },
        { priority: "liquidity", note: "Partial. She personally guarantees the company's print line of credit." },
      ],
      concerns: [
        "Being pushed into mass retail and losing hobby-store loyalty.",
        "A faster release schedule imposed from outside.",
        "Losing control of art direction.",
        "How Fieldstone's team would see a second card game in the house.",
      ],
      communication:
        "Thoughtful and story-driven. Prefers video or in person over email, and dislikes spreadsheets in early conversations. Opens up when asked about the game's world and its players.",
      keyDates: [
        { inDays: 23, label: "Ashveil 12th-anniversary set launches" },
        { inDays: 61, label: "Ashveil World Championship (Rotterdam)" },
      ],
      notes:
        "Has turned down two private equity approaches because, in her words, they \"wanted a release schedule, not a game.\" Her CFO, Marcus Bell, is the practical voice. Involve him early on anything numerical.",
    },
    touchpoints: [
      { d: 610, type: "event", summary: "Met Dana at a hobby trade show after her organized-play panel. Talked about store loyalty programs; no deal talk." },
      { d: 540, type: "email", summary: "Sent aggregate notes on hobby-store retention from Corner Pocket's tournament data. She replied with a question about league formats." },
      { d: 455, type: "call", summary: "First real conversation. She isn't selling, but is \"thinking about what the next ten years look like.\" The personal guarantee on the print line weighs on her." },
      { d: 360, type: "gift-note", summary: "Sent a handwritten note for Ashveil's 11th anniversary." },
      { d: 300, type: "meeting", summary: "Visited the Portland studio and met the design team. Her priority is clear: keep the team intact and keep creative control." },
      { d: 210, type: "intro", summary: "Introduced Dana to Fieldstone's head of organized play to compare judge programs. Both said it went well." },
      { d: 120, type: "meeting", summary: "Dinner with Dana and CFO Marcus Bell. Dana is open to \"exploring a partnership that keeps Ashveil Ashveil.\" Agreed to share high-level financials under NDA." },
      { d: 75, type: "email", summary: "NDA signed. Received a summary P&L and store-network data; Finance review started." },
      { d: 34, type: "call", summary: "Walked Marcus through our evaluation process and timeline. He flagged change-of-control clauses in their European distribution contracts." },
      { d: 12, type: "meeting", summary: "Video call with Dana on what an integration would and would not change. She asked for a written outline of creative-control commitments." },
    ],
    fit: { categoryFit: 5, brandStrength: 4, communityAlignment: 5, leadershipFit: 4, integrationEase: 3, growthPotential: 4 },
    fitNotes: {
      categoryFit: "Core category. A fantasy setting complements Fieldstone's science fiction instead of competing for the same players.",
      brandStrength: "Loyal following in hobby stores; little awareness outside the hobby channel.",
      communityAlignment: "Organized play is the heart of the business, the same playbook as Corner Pocket.",
      leadershipFit: "Mission-driven and collaborative. Heavy reliance on Dana's creative direction.",
      integrationEase: "Separate printers and European distributor contracts; shared fulfillment is possible in year two.",
      growthPotential: "European organized play is growing; direct-to-consumer sales are underdeveloped.",
    },
    risks: [
      { label: "Key-person dependence on the founder's creative direction", severity: "high" },
      { label: "Change-of-control clauses in European distribution contracts", severity: "medium" },
      { label: "Revenue concentrated in new-set launch months", severity: "medium" },
      { label: "Founder's personal guarantee on the print line must be resolved at close", severity: "low" },
    ],
    reachOutIdeas: [
      "Send the written outline of creative-control commitments she asked for.",
      "Congratulate the team when the 12th-anniversary set launches.",
      "Ask how World Championship qualifiers are going in Europe.",
    ],
  },

  // ───────────────────────────── Building Relationship
  {
    id: "graywater",
    name: "Graywater Archival",
    oneLiner: "Archival-grade storage for graded cards: slab cases, UV-filtering display frames and climate-safe boxes.",
    categories: ["grading-storage", "card-accessories"],
    channels: [
      { channel: "dtc", share: 60 },
      { channel: "marketplace", share: 25 },
      { channel: "hobby-stores", share: 15 },
    ],
    regions: ["us-national", "canada"],
    hq: "Asheville, North Carolina",
    founded: 2017,
    sizeBand: "$5–15M",
    ownership: "founder-led",
    dealType: "add-on",
    source: "referral",
    rationale:
      "Takes Brightkeep up-market into graded-card storage, where it has no products, and brings a direct-to-consumer business (60% of sales) that no portfolio brand has built.",
    stage: "building",
    founder: {
      name: "Luis Ferrante",
      role: "Founder & CEO",
      background:
        "Museum conservation technician for 11 years. Started Graywater after seeing collectors display valuable graded cards in sunlight that damages them.",
      built:
        "Designed a patented UV-filtering slab frame and built a direct-to-consumer brand with a devoted collector following. 14 people in a converted textile mill.",
      priorities: [
        { priority: "liquidity", note: "Most of his net worth is in the company; he wants to reduce that risk." },
        { priority: "brand", note: "Proud of the archival-quality reputation. Won't accept cheaper materials." },
        { priority: "staying-involved", note: "Would stay about two years, focused on product." },
      ],
      concerns: [
        "Brightkeep's mass-retail positioning cheapening the Graywater name.",
        "Manufacturing moving out of Asheville.",
        "Earnouts. He has \"heard horror stories.\"",
      ],
      communication:
        "Precise and detail-oriented. Likes data and written follow-ups. Takes time to decide; don't rush him.",
      keyDates: [
        { inDays: 48, label: "National card show (Graywater exhibits every year)" },
        { inDays: 95, label: "Asheville facility lease renewal decision" },
      ],
      notes: "Capacity is limited by a single production line. The lease decision is his natural moment to think about the future.",
    },
    touchpoints: [
      { d: 260, type: "intro", summary: "Introduced by a mutual contact at Brightkeep's packaging supplier." },
      { d: 245, type: "call", summary: "First call. Talked about archival materials and collector habits. He asked sharp questions about Brightkeep's retail buyers." },
      { d: 180, type: "meeting", summary: "Toured the Asheville mill. Quality is exceptional; capacity is constrained by one production line." },
      { d: 130, type: "email", summary: "Sent a study on UV damage he'd mentioned. He replied with his own test data." },
      { d: 52, type: "call", summary: "Raised, unprompted, that a larger accessories company has approached him. Not interested \"yet,\" but thinking about the lease decision." },
    ],
    fit: { categoryFit: 4, brandStrength: 4, communityAlignment: 3, leadershipFit: 4, integrationEase: 4, growthPotential: 4 },
    fitNotes: {
      categoryFit: "Adjacent to Brightkeep, in a premium segment it doesn't serve.",
      brandStrength: "Strong reputation with serious collectors; small overall awareness.",
      communityAlignment: "Collector-focused, but no events or community program.",
      leadershipFit: "Thoughtful, quality-first founder; deliberate decision-maker.",
      integrationEase: "Small team and simple operations; keep production in Asheville.",
      growthPotential: "Graded-card collecting is growing; capacity is the constraint.",
    },
    risks: [
      { label: "Single production line limits growth until capacity is added", severity: "medium" },
      { label: "A competing approach from a larger accessories company", severity: "medium" },
      { label: "Patent covers only the display-frame line", severity: "low" },
    ],
    reachOutIdeas: [
      "Ask whether he's exhibiting at the national card show in seven weeks, and offer to stop by the booth.",
      "Share anonymized Brightkeep retail data on graded-card accessory demand. He asked about retail buyers.",
      "Ask how the lease decision is shaping his plans, without pressing.",
    ],
  },

  // ───────────────────────────── Nurture, gone quiet
  {
    id: "ashby",
    name: "Ashby Collector Shows",
    oneLiner: "Family-run organizer of four regional sports card and trading card shows in the US East and Midwest.",
    categories: ["events"],
    channels: [
      { channel: "events", share: 85 },
      { channel: "dtc", share: 15 },
    ],
    regions: ["us-east", "us-midwest"],
    hq: "Columbus, Ohio",
    founded: 1994,
    sizeBand: "Under $5M",
    ownership: "family-owned",
    dealType: "platform",
    source: "direct-outreach",
    rationale:
      "Live events are a complete gap in our portfolio. Shows are where collectors spend and where our brands could meet them directly. Ashby could anchor a regional show network.",
    stage: "nurture",
    stageNote: "Walt says he's not ready for two to three years. Stay close without pressure.",
    founder: {
      name: "Walt Ashby",
      role: "Founder & President",
      background: "Ran a sports card shop for 15 years before starting his first show in a hotel ballroom in 1994.",
      built:
        "Four recurring shows averaging about 6,000 attendees each, long-term venue relationships and a loyal dealer base. His daughter Renee runs operations.",
      priorities: [
        { priority: "legacy", note: "The shows continue under the Ashby name." },
        { priority: "team", note: "A real future for Renee." },
        { priority: "liquidity", note: "Retirement." },
      ],
      concerns: [
        "A corporate owner raising table fees and driving out small dealers.",
        "Renee's role after a sale.",
        "Timing. He's not ready yet.",
      ],
      communication: "Old-school. Prefers phone calls to email, loves talking about the hobby's history, and has little patience for jargon.",
      keyDates: [
        { inDays: 120, label: "Spring Columbus show" },
        { inDays: 1000, label: "Walt's planned step-back (\"by 67,\" in his words)" },
      ],
      notes: "Renee is ambitious: she wants a fifth show and online ticketing. Any deal has to work for both of them.",
    },
    touchpoints: [
      { d: 900, type: "event", summary: "Met Walt at his Columbus show; walked the floor together for an hour." },
      { d: 780, type: "call", summary: "Walt said plainly he's not selling for \"a few years,\" but is happy to stay in touch." },
      { d: 600, type: "gift-note", summary: "Sent a note and a framed program from his first show, found at an auction." },
      { d: 420, type: "meeting", summary: "Lunch with Walt and Renee. Renee wants to add a fifth show and online ticketing." },
      { d: 280, type: "call", summary: "Walt mentioned a minor health scare; he's doing fine. Talked about succession more than before." },
      { d: 180, type: "email", summary: "Sent congratulations on record attendance at the fall show." },
      { d: 97, type: "call", summary: "Brief catch-up. A competitor approached Renee about a joint venture." },
    ],
    fit: { categoryFit: 3, brandStrength: 3, communityAlignment: 5, leadershipFit: 3, integrationEase: 3, growthPotential: 3 },
    fitNotes: {
      categoryFit: "Adjacent: events, not products, but central to collector life.",
      brandStrength: "Well known to regional dealers and collectors.",
      communityAlignment: "Shows are the hobby's community in person.",
      leadershipFit: "Walt is stepping back; Renee's fit is the real question.",
      integrationEase: "Simple operations, but venue relationships are personal.",
      growthPotential: "Room for a fifth show and online ticketing.",
    },
    risks: [
      { label: "Succession: depends on whether Renee stays and leads", severity: "medium" },
      { label: "Venue agreements may not transfer to a new owner", severity: "medium" },
      { label: "A competitor's joint-venture approach to Renee", severity: "medium" },
      { label: "Revenue concentrated in four weekends a year", severity: "low" },
    ],
    reachOutIdeas: [
      "Call Walt (he prefers the phone) and ask how planning for the spring show is going.",
      "Ask Renee whether online ticketing launched, and offer an intro to Corner Pocket's events lead.",
      "It's been over three months. A simple \"thinking of you, how are you feeling?\" call fits Walt.",
    ],
  },

  // ───────────────────────────── First Conversation (advisor-run), gone quiet
  {
    id: "halden-voss",
    name: "Halden & Voss Distribution",
    oneLiner: "Second-generation hobby distributor near Rotterdam supplying about 1,800 game and hobby stores in 12 European countries.",
    categories: ["distribution"],
    channels: [
      { channel: "wholesale", share: 90 },
      { channel: "marketplace", share: 10 },
    ],
    regions: ["europe", "uk"],
    hq: "Rotterdam, Netherlands",
    founded: 1987,
    sizeBand: "$40–100M",
    ownership: "family-owned",
    dealType: "platform",
    source: "intermediary",
    rationale:
      "A European platform: immediate distribution for all five portfolio brands in 12 countries where we have none today, and a base for future European add-ons.",
    stage: "first-conversation",
    stageNote: "Advisor-run process. Communicate through the advisor unless Pieter reaches out directly.",
    founder: {
      name: "Pieter Halden",
      role: "Managing Director (second generation)",
      background: "Trained as a logistics engineer; took over from his father in 2011.",
      built: "Expanded from the Benelux countries to 12, built a modern warehouse and a B2B ordering portal. About 140 employees.",
      priorities: [
        { priority: "team", note: "Protect the 140 employees." },
        { priority: "legacy", note: "The family name. His father still chairs the board." },
        { priority: "liquidity", note: "Sibling shareholders want an exit." },
      ],
      concerns: [
        "Losing independence with suppliers, including brands that compete with ours.",
        "His father's reaction to a sale.",
        "The advisor's timeline moving faster than the family.",
      ],
      communication: "Direct, formal and very prepared. Expects agendas in advance.",
      keyDates: [
        { inDays: 21, label: "Advisor's deadline for indications of interest" },
        { inDays: 150, label: "European hobby trade fair (Halden & Voss exhibits)" },
      ],
      notes: "A bigger, more complex deal than any we've done. Worth pursuing only if Finance supports the size.",
    },
    touchpoints: [
      { d: 140, type: "intro", summary: "Sell-side advisor sent a teaser. Signed an NDA and received the information memorandum." },
      { d: 95, type: "meeting", summary: "Management meeting with Pieter and the advisor in Rotterdam. Well-run business; Pieter guarded about family dynamics." },
      { d: 68, type: "email", summary: "Sent thanks and follow-up questions on supplier concentration, via the advisor." },
    ],
    fit: { categoryFit: 4, brandStrength: 3, communityAlignment: 3, leadershipFit: 3, integrationEase: 2, growthPotential: 4 },
    fitNotes: {
      categoryFit: "Distribution is a gap and a lever for every brand we own.",
      brandStrength: "Respected by European retailers; a trade brand, not a consumer one.",
      communityAlignment: "Serves the hobby-store community, but at arm's length.",
      leadershipFit: "Strong operator. Family dynamics are still unclear.",
      integrationEase: "Cross-border, large, and it carries competitors' products.",
      growthPotential: "Platform for European expansion and add-ons.",
    },
    risks: [
      { label: "Distributes competing brands; suppliers may leave after a deal", severity: "high" },
      { label: "Deal size is large relative to our past acquisitions", severity: "high" },
      { label: "Family shareholders may not agree on terms", severity: "medium" },
      { label: "Cross-border integration and currency exposure", severity: "medium" },
    ],
    reachOutIdeas: [
      "Ask the advisor for a call with Pieter on the open supplier questions before the deadline in three weeks.",
      "Send Pieter a short note on how we've kept teams intact at past acquisitions. No terms.",
    ],
  },

  // ───────────────────────────── Researching (no contact yet)
  {
    id: "paperhawk",
    name: "Paperhawk Miniatures",
    oneLiner: "UK maker of resin miniatures and modular wargaming terrain, sold mostly through crowdfunding and its own web store.",
    categories: ["miniatures"],
    channels: [
      { channel: "crowdfunding", share: 45 },
      { channel: "dtc", share: 40 },
      { channel: "hobby-stores", share: 15 },
    ],
    regions: ["uk", "europe", "us-national"],
    hq: "Leeds, United Kingdom",
    founded: 2016,
    sizeBand: "$5–15M",
    ownership: "founder-led",
    dealType: "platform",
    source: "direct-outreach",
    rationale:
      "Miniatures is a category gap with high spend per player and strong communities. Paperhawk's crowdfunding and direct-to-consumer skills are ones our portfolio lacks.",
    stage: "researching",
    founder: {
      name: "Imogen Hale",
      role: "Founder & Lead Sculptor",
      background: "Trained sculptor who worked in film prop making before launching Paperhawk's first crowdfunding campaign in 2016.",
      built: "Seven successful campaigns, a digital-sculpt-to-resin production pipeline and a 22-person studio.",
      priorities: [
        { priority: "brand", note: "From public interviews (unconfirmed): creative freedom matters most." },
        { priority: "team", note: "From public interviews (unconfirmed): proud of the studio's culture." },
      ],
      concerns: ["Unknown until a first conversation."],
      communication: "Unknown. Public posts suggest informal and community-first.",
      keyDates: [{ inDays: 35, label: "Next crowdfunding campaign launches (announced publicly)" }],
      notes: "No contact yet. Look for a warm introduction through Corner Pocket's miniatures players.",
    },
    touchpoints: [],
    fit: { categoryFit: 4, brandStrength: 3, communityAlignment: 4, leadershipFit: null, integrationEase: 2, growthPotential: 4 },
    fitNotes: {
      categoryFit: "Adjacent hobby category with crossover players.",
      brandStrength: "Strong among wargamers; niche overall.",
      communityAlignment: "Very community-driven campaigns.",
      integrationEase: "UK-based, crowdfunding-led model unlike ours.",
      growthPotential: "Category growing; US hobby-store distribution is underdeveloped.",
    },
    risks: [
      { label: "Crowdfunding revenue is lumpy and campaign-dependent", severity: "medium" },
      { label: "Piracy of 3D-printable files", severity: "medium" },
      { label: "Resin production health and safety compliance to verify", severity: "low" },
    ],
    reachOutIdeas: [
      "Ask Corner Pocket's miniatures players for an introduction. A warm intro beats a cold email.",
      "When the new campaign launches, send a short, genuine note of congratulations.",
    ],
  },

  // ───────────────────────────── Diligence
  {
    id: "red-clay",
    name: "Red Clay Hobby Co.",
    oneLiner: "Nine-store hobby retail chain in Texas and Oklahoma with large in-store play spaces and a growing web store.",
    categories: ["hobby-retail"],
    channels: [
      { channel: "hobby-stores", share: 78 },
      { channel: "dtc", share: 14 },
      { channel: "events", share: 8 },
    ],
    regions: ["us-south"],
    hq: "Dallas, Texas",
    founded: 2009,
    sizeBand: "$15–40M",
    ownership: "pe-backed",
    dealType: "add-on",
    source: "intermediary",
    rationale:
      "More than doubles Corner Pocket's store count and brings it into the US South. Shared buying and organized play across 15 stores should improve supplier terms.",
    stage: "diligence",
    stageNote: "Letter of intent signed; 60-day exclusivity.",
    founder: {
      name: "Carla Medina",
      role: "Co-founder & CEO",
      background: "Opened the first store in Denton with her brother after college. Took a minority private equity investment in 2021 to fund expansion.",
      built: "Nine stores, a reputation for safe, welcoming play spaces and a strong bench of store managers.",
      priorities: [
        { priority: "team", note: "Careers for her store managers." },
        { priority: "staying-involved", note: "Wants to help run the combined retail group." },
        { priority: "liquidity", note: "The investor needs an exit within two years, which drives the timing." },
      ],
      concerns: [
        "Losing the Red Clay name in Texas.",
        "The investor pushing price over fit.",
        "Changes to store staffing.",
      ],
      communication: "Energetic, fast and practical. Texts more than she emails and wants decisions made quickly.",
      keyDates: [
        { inDays: 9, label: "Quality of earnings report due" },
        { inDays: 26, label: "Exclusivity period ends" },
        { inDays: 33, label: "Red Clay store managers' summit" },
      ],
      notes: "Carla is the relationship. The investor is the process. Keep both informed.",
    },
    touchpoints: [
      { d: 400, type: "event", summary: "Met Carla at a hobby retailer conference; compared notes on store events." },
      { d: 300, type: "call", summary: "Carla shared that the investor is planning an exit in two to three years." },
      { d: 210, type: "meeting", summary: "Store visits in Dallas and Fort Worth with Corner Pocket's general manager." },
      { d: 150, type: "meeting", summary: "The investor started a sale process. We were invited in early because of the relationship." },
      { d: 90, type: "meeting", summary: "Management presentation. Strong same-store performance; two newer stores are below plan." },
      { d: 34, type: "email", summary: "Letter of intent signed with 60-day exclusivity." },
      { d: 20, type: "meeting", summary: "Diligence kickoff across Finance, Legal, Operations, People and Technology." },
      { d: 9, type: "call", summary: "Weekly diligence call. Lease review flagged two leases that need landlord consent." },
      { d: 3, type: "call", summary: "Weekly diligence call. Quality of earnings draft expected next week; inventory count scheduled." },
    ],
    fit: { categoryFit: 5, brandStrength: 3, communityAlignment: 5, leadershipFit: 4, integrationEase: 4, growthPotential: 3 },
    fitNotes: {
      categoryFit: "Same category as Corner Pocket, in a new region.",
      brandStrength: "Strong locally; unknown outside Texas and Oklahoma.",
      communityAlignment: "Play spaces and events are core to the model.",
      leadershipFit: "Carla is a proven operator who wants to stay.",
      integrationEase: "Same business model as Corner Pocket; separate systems.",
      growthPotential: "Solid same-store growth; new-store results are mixed.",
    },
    risks: [
      { label: "Two newer stores are below plan", severity: "medium" },
      { label: "Two leases require landlord consent to transfer", severity: "medium" },
      { label: "Investor's exit timeline compresses diligence", severity: "medium" },
      { label: "Inventory valuation to confirm in the count", severity: "low" },
    ],
    reachOutIdeas: [
      "Before the managers' summit, send Carla a note recognizing her store managers.",
      "Share a draft \"what stays the same\" list for store staff.",
    ],
  },

  // ───────────────────────────── Closing
  {
    id: "stormglass",
    name: "Stormglass Playmats",
    oneLiner: "Custom and art playmats and tournament mats, printed in-house in Colorado.",
    categories: ["card-accessories"],
    channels: [
      { channel: "dtc", share: 50 },
      { channel: "hobby-stores", share: 20 },
      { channel: "events", share: 20 },
      { channel: "marketplace", share: 10 },
    ],
    regions: ["us-national"],
    hq: "Fort Collins, Colorado",
    founded: 2018,
    sizeBand: "Under $5M",
    ownership: "founder-led",
    dealType: "add-on",
    source: "event",
    rationale:
      "Adds in-house printing and a custom-order business to Brightkeep, which currently outsources playmats at lower margins.",
    stage: "closing",
    founder: {
      name: "Jordan Reyes",
      role: "Founder",
      background: "Competitive card player turned print-shop owner. Started printing mats for local tournaments in a garage.",
      built: "A 9-person print shop with a fast custom-order process and partnerships with tournament organizers.",
      priorities: [
        { priority: "staying-involved", note: "Wants to keep running the print shop." },
        { priority: "team", note: "Keep his crew employed and in Fort Collins." },
        { priority: "liquidity", note: "Pay off equipment loans." },
      ],
      concerns: [
        "An earnout tied to Brightkeep's sales channels, which he doesn't control.",
        "Being asked to move the shop.",
      ],
      communication: "Casual, honest and quick to reply. Appreciates straight talk.",
      keyDates: [{ inDays: 14, label: "Target closing date (equipment loans paid off at close)" }],
      notes: "The earnout definition was the last open point. It now measures only Stormglass's own channels.",
    },
    touchpoints: [
      { d: 330, type: "event", summary: "Met Jordan at a regional tournament where Stormglass printed the event mats." },
      { d: 250, type: "call", summary: "Jordan asked about Brightkeep's playmat supplier; conversation turned to partnership." },
      { d: 170, type: "meeting", summary: "Visited the print shop. Fast, efficient, great team morale." },
      { d: 110, type: "email", summary: "Letter of intent signed." },
      { d: 60, type: "meeting", summary: "Diligence wrapped. No material issues; customer concentration noted." },
      { d: 25, type: "call", summary: "Purchase agreement redlines. Earnout definition still open." },
      { d: 6, type: "call", summary: "Agreed the earnout measures only Stormglass's own channels. Final redlines are with Legal." },
    ],
    fit: { categoryFit: 4, brandStrength: 2, communityAlignment: 4, leadershipFit: 5, integrationEase: 5, growthPotential: 3 },
    fitNotes: {
      categoryFit: "Extends Brightkeep's accessory range.",
      brandStrength: "Known to tournament organizers, not to consumers.",
      communityAlignment: "Deep ties to the tournament scene.",
      leadershipFit: "Jordan is open, practical and wants to stay.",
      integrationEase: "Small, self-contained; stays in Fort Collins.",
      growthPotential: "Steady; custom orders scale with events.",
    },
    risks: [
      { label: "Three tournament organizers account for a large share of revenue", severity: "medium" },
      { label: "Earnout definition agreed but awaiting Legal sign-off", severity: "low" },
    ],
    reachOutIdeas: ["Call Jordan to walk through day-one plans for his team before closing."],
  },

  // ───────────────────────────── Integration Planning
  {
    id: "harborlight",
    name: "Harborlight Comics & Cards",
    oneLiner: "Three-store comics and trading card retailer in the Pacific Northwest, family-owned for two generations.",
    categories: ["hobby-retail"],
    channels: [
      { channel: "hobby-stores", share: 85 },
      { channel: "dtc", share: 10 },
      { channel: "events", share: 5 },
    ],
    regions: ["us-west"],
    hq: "Tacoma, Washington",
    founded: 1981,
    sizeBand: "$5–15M",
    ownership: "family-owned",
    dealType: "add-on",
    source: "referral",
    rationale:
      "Corner Pocket's first West Coast presence. Harborlight's comics expertise and community events broaden what our stores offer.",
    stage: "integration",
    stageNote: "Closed three weeks ago. Integration plan in progress.",
    founder: {
      name: "Ruth Kowalski",
      role: "Owner (second generation)",
      background: "Grew up in the original store her parents opened in 1981; took it over in 2005.",
      built: "Grew from one store to three. Known for community events and staff who average nine years of tenure.",
      priorities: [
        { priority: "team", note: "No layoffs; respect for long-tenured staff." },
        { priority: "brand", note: "Keep the Harborlight name on the doors." },
        { priority: "legacy", note: "Her parents' store, and what it means to the neighborhood." },
      ],
      concerns: [
        "Corporate systems replacing staff judgment on ordering.",
        "A name change.",
      ],
      communication: "Warm and candid. Values in-person visits and writes long, thoughtful emails.",
      keyDates: [
        { inDays: -21, label: "Deal closed" },
        { inDays: 9, label: "30-day check-in with store staff" },
        { inDays: 60, label: "Point-of-sale system migration window" },
      ],
      notes: "Ruth told her staff \"nothing important changes.\" Our job is to make that true.",
    },
    touchpoints: [
      { d: 1100, type: "event", summary: "Met Ruth at a retailer event; she'd heard about Corner Pocket's tournament leagues." },
      { d: 900, type: "call", summary: "Ruth mentioned no family member wants to take over eventually." },
      { d: 700, type: "gift-note", summary: "Sent a note for the store's anniversary." },
      { d: 500, type: "meeting", summary: "Visited all three stores. Staff loyalty is the asset." },
      { d: 300, type: "meeting", summary: "Ruth is ready to talk. Began evaluation together." },
      { d: 180, type: "meeting", summary: "Diligence kickoff; agreed early on keeping the name and all staff." },
      { d: 21, type: "meeting", summary: "Closed. Ruth told staff \"nothing important changes.\"" },
      { d: 7, type: "call", summary: "Integration planning. Ruth asked that ordering decisions stay with store managers for at least a year." },
    ],
    fit: { categoryFit: 5, brandStrength: 3, communityAlignment: 5, leadershipFit: 5, integrationEase: 4, growthPotential: 3 },
    fitNotes: {
      categoryFit: "Same category as Corner Pocket, plus comics.",
      brandStrength: "Beloved locally.",
      communityAlignment: "Community events are its identity.",
      leadershipFit: "Ruth and her staff share our values.",
      integrationEase: "Small and similar; point-of-sale migration is the main task.",
      growthPotential: "Modest; a base for more West Coast stores.",
    },
    risks: [
      { label: "Point-of-sale migration could disrupt the stores", severity: "medium" },
      { label: "Staff anxiety about change", severity: "medium" },
      { label: "Comics buying expertise isn't in our playbook yet", severity: "low" },
    ],
    reachOutIdeas: ["Go to the 30-day staff check-in in person, not by video."],
  },

  // ───────────────────────────── Nurture, multi-year and healthy
  {
    id: "wildmoor",
    name: "Wildmoor Games",
    oneLiner: "Canadian publisher of family board games and a cooperative card game, sold through hobby and specialty toy stores.",
    categories: ["board-games"],
    channels: [
      { channel: "hobby-stores", share: 50 },
      { channel: "mass-retail", share: 20 },
      { channel: "dtc", share: 15 },
      { channel: "wholesale", share: 15 },
    ],
    regions: ["canada", "us-national"],
    hq: "Halifax, Nova Scotia",
    founded: 2011,
    sizeBand: "$5–15M",
    ownership: "founder-led",
    dealType: "add-on",
    source: "referral",
    rationale:
      "Board games are a category gap, and Wildmoor's specialty-toy network in Canada reaches stores our brands barely touch.",
    stage: "nurture",
    stageNote: "Martin wants to launch his next major title first. A two-and-a-half-year relationship so far.",
    founder: {
      name: "Martin Leclerc",
      role: "Co-founder & CEO",
      background: "Former teacher who designed games for his classroom. His first title became a specialty-toy bestseller in Canada.",
      built: "A catalog of 18 games, a strong specialty-toy network in Canada and a small design team.",
      priorities: [
        { priority: "staying-involved", note: "Wants to keep designing games." },
        { priority: "legacy", note: "Games that teach; he won't compromise on that." },
        { priority: "team", note: "His design team of five." },
      ],
      concerns: [
        "Not ready. He wants to launch two more titles first.",
        "Becoming \"a line in a catalog.\"",
      ],
      communication: "Patient, reflective and generous with his time. Enjoys hearing how our brands design products. Prefers quarterly check-ins.",
      keyDates: [
        { inDays: 75, label: "Wildmoor's founding anniversary" },
        { inDays: 210, label: "Next major title launches (Martin's milestone before any deal)" },
      ],
      notes: "Recently started asking how we handle integrations, which is a meaningful shift.",
    },
    touchpoints: [
      { d: 930, type: "intro", summary: "Introduced by a specialty-toy sales rep who works with Pinewick." },
      { d: 900, type: "call", summary: "Martin: \"Not for at least three years.\" Agreed to stay in touch." },
      { d: 810, type: "email", summary: "Shared an article on game-based learning he'd enjoy." },
      { d: 720, type: "meeting", summary: "Dinner at a toy fair. Talked about design, not deals." },
      { d: 630, type: "gift-note", summary: "Sent congratulations on a Canadian family-game award." },
      { d: 540, type: "call", summary: "Quarterly check-in. Mass-retail buyer changes are squeezing margins." },
      { d: 450, type: "email", summary: "Introduced him to Fieldstone's packaging supplier, which cut his costs." },
      { d: 360, type: "meeting", summary: "Visited the Halifax studio. Met the design team." },
      { d: 270, type: "call", summary: "Quarterly check-in. Two titles in development." },
      { d: 180, type: "email", summary: "Sent a note after his cooperative card game reprinted." },
      { d: 130, type: "call", summary: "Martin asked how we handled the Harborlight process: the first time he's asked about ours." },
      { d: 41, type: "meeting", summary: "Coffee in Toronto. Next title is ahead of schedule; he said he'd \"be ready to talk seriously after it launches.\"" },
    ],
    fit: { categoryFit: 3, brandStrength: 3, communityAlignment: 4, leadershipFit: 4, integrationEase: 3, growthPotential: 3 },
    fitNotes: {
      categoryFit: "Adjacent: family board games, not collectibles.",
      brandStrength: "Recognized in Canadian specialty toy stores.",
      communityAlignment: "Family and education focus fits our values.",
      leadershipFit: "Long, trusting relationship with Martin.",
      integrationEase: "Separate channels and a Canadian base.",
      growthPotential: "US specialty-toy expansion is untapped.",
    },
    risks: [
      { label: "Timing depends on a title launch seven months away", severity: "medium" },
      { label: "Concentration with Canadian mass-retail buyers", severity: "medium" },
      { label: "Currency exposure (CAD)", severity: "low" },
    ],
    reachOutIdeas: [
      "Congratulate Martin ahead of Wildmoor's founding anniversary.",
      "Share how Harborlight's first 30 days went. He asked about our integration approach.",
    ],
  },

  // ───────────────────────────── Passed (overlap)
  {
    id: "lumen",
    name: "Lumen Sleeve Works",
    oneLiner: "Premium card sleeves and deck boxes sold through hobby stores and online marketplaces.",
    categories: ["card-accessories"],
    channels: [
      { channel: "hobby-stores", share: 50 },
      { channel: "marketplace", share: 35 },
      { channel: "dtc", share: 15 },
    ],
    regions: ["us-national"],
    hq: "Tempe, Arizona",
    founded: 2015,
    sizeBand: "$5–15M",
    ownership: "pe-backed",
    dealType: "add-on",
    source: "intermediary",
    rationale: "Would strengthen Brightkeep's premium range.",
    stage: "passed",
    stageNote:
      "Passed after evaluation: overlaps Brightkeep's core range and channels, so the savings would mostly come from cutting jobs, which isn't how we build. Revisit if the sleeve market consolidates.",
    founder: {
      name: "Derek Holm",
      role: "Founder (minority owner after a private equity recapitalization)",
      background: "Product designer who started Lumen to make sleeves that don't split.",
      built: "A premium brand with strong marketplace reviews.",
      priorities: [
        { priority: "liquidity", note: "The investor controls the timing." },
        { priority: "brand", note: "Wants the Lumen name to survive." },
      ],
      concerns: ["Layoffs at Lumen after a sale."],
      communication: "Friendly and low-key.",
      keyDates: [],
      notes: "Parted on good terms. A possible supply partnership for Brightkeep's premium line.",
    },
    touchpoints: [
      { d: 400, type: "intro", summary: "Advisor sent a teaser on behalf of the investor." },
      { d: 350, type: "meeting", summary: "Met Derek and the investor's deal team." },
      { d: 300, type: "email", summary: "Received the information memorandum." },
      { d: 260, type: "meeting", summary: "Internal review: significant overlap with Brightkeep." },
      { d: 230, type: "email", summary: "Sent a respectful pass with our reasons. Offered to stay in touch about a supply partnership." },
      { d: 60, type: "email", summary: "Derek sent a holiday card; replied warmly." },
    ],
    fit: { categoryFit: 4, brandStrength: 3, communityAlignment: 2, leadershipFit: 3, integrationEase: 2, growthPotential: 2 },
    fitNotes: {
      categoryFit: "Same category as Brightkeep: too close.",
      communityAlignment: "Marketplace-led; little community presence.",
      integrationEase: "Overlap means consolidation, not combination.",
      growthPotential: "Mature segment.",
    },
    risks: [
      { label: "Overlaps Brightkeep's products and channels; would cannibalize sales", severity: "high" },
      { label: "Investor's price expectations", severity: "medium" },
    ],
    reachOutIdeas: ["Optional: explore a contract-manufacturing partnership for Brightkeep's premium line."],
  },

  // ───────────────────────────── Passed (risk)
  {
    id: "rookie-ridge",
    name: "Rookie Ridge Breaks",
    oneLiner: "Live-stream card-break company selling sports and trading card box breaks on streaming marketplaces.",
    categories: ["collector-platforms"],
    channels: [
      { channel: "marketplace", share: 90 },
      { channel: "dtc", share: 10 },
    ],
    regions: ["us-national"],
    hq: "Nashville, Tennessee",
    founded: 2020,
    sizeBand: "$15–40M",
    ownership: "founder-led",
    dealType: "platform",
    source: "direct-outreach",
    rationale: "Fast-growing direct channel to collectors.",
    stage: "passed",
    stageNote:
      "Passed: fast growth, but revenue depends on third-party platforms, and the regulatory and reputational questions around paid breaks are unresolved. Not a fit with the community-first brands we own.",
    founder: {
      name: "Tyler Brandt",
      role: "Founder & CEO",
      background: "Former sports card shop employee who began streaming breaks in 2020.",
      built: "A team of on-camera breakers and a large live audience.",
      priorities: [{ priority: "liquidity", note: "Wants to sell while growth is strong." }],
      concerns: ["Platform fee changes."],
      communication: "Fast and promotional.",
      keyDates: [],
      notes: "Inbound approach. Kept the door open politely, but no plans to revisit.",
    },
    touchpoints: [
      { d: 200, type: "call", summary: "Inbound call from Tyler looking for a buyer." },
      { d: 170, type: "meeting", summary: "Reviewed metrics. Growth is real; platform dependence is total." },
      { d: 150, type: "email", summary: "Passed, with thanks." },
    ],
    fit: { categoryFit: 2, brandStrength: 2, communityAlignment: 2, leadershipFit: 3, integrationEase: 2, growthPotential: 4 },
    fitNotes: {
      categoryFit: "Commerce model, not a product brand.",
      communityAlignment: "Audience-driven rather than community-driven.",
    },
    risks: [
      { label: "Regulatory scrutiny of paid breaks", severity: "high" },
      { label: "Total dependence on third-party streaming platforms", severity: "high" },
      { label: "Reputational risk for our brands", severity: "medium" },
      { label: "Depends on a few on-camera personalities", severity: "medium" },
    ],
    reachOutIdeas: [],
  },

  // ───────────────────────────── Identified
  {
    id: "foilscope",
    name: "Foilscope",
    oneLiner: "Price-guide and collection-tracking app for graded and raw trading cards, with a small seller marketplace.",
    categories: ["collector-platforms"],
    channels: [
      { channel: "marketplace", share: 60 },
      { channel: "dtc", share: 40 },
    ],
    regions: ["us-national", "uk"],
    hq: "Austin, Texas",
    founded: 2019,
    sizeBand: "Under $5M",
    ownership: "founder-led",
    dealType: "platform",
    source: "event",
    rationale:
      "A direct digital relationship with collectors, which no portfolio brand has. Collection data could guide product and acquisition decisions.",
    stage: "identified",
    founder: {
      name: "Nadia Brooks",
      role: "Co-founder & CEO",
      background: "Data engineer at a payments company; built Foilscope as a side project to value her own collection.",
      built: "The app, its pricing data pipeline and a 6-person team, funded by angel investors.",
      priorities: [],
      concerns: ["Unknown until a first conversation."],
      communication: "Unknown. A clear, data-driven speaker on industry panels.",
      keyDates: [],
      notes: "Not yet contacted.",
    },
    touchpoints: [
      { d: 30, type: "event", summary: "Heard Nadia speak on a collectibles industry panel about price transparency. Didn't approach." },
    ],
    fit: { categoryFit: 2, brandStrength: null, communityAlignment: 3, leadershipFit: null, integrationEase: 2, growthPotential: 4 },
    fitNotes: {
      categoryFit: "Software, far from our product brands.",
      communityAlignment: "Serves collectors directly.",
      integrationEase: "Technology and data skills we don't have in-house.",
      growthPotential: "Large user base; monetization unproven.",
    },
    risks: [
      { label: "Technology and data integration far from our core", severity: "medium" },
      { label: "User-data privacy obligations", severity: "medium" },
      { label: "Monetization unproven", severity: "medium" },
    ],
    reachOutIdeas: ["Send a short note referencing her panel talk and ask one genuine question about her pricing data."],
  },
];

function isoDaysFrom(today: string, offset: number): string {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return d.toISOString().slice(0, 10);
}

/** Turns relative seed dates into real dates, anchored on `today` (yyyy-mm-dd). */
export function materializeSeed(today: string, seed: SeedTarget[] = SEED): Target[] {
  return seed.map((t) => {
    const touchpoints: Touchpoint[] = t.touchpoints
      .map((tp, i) => ({ id: `${t.id}-tp${i + 1}`, date: isoDaysFrom(today, -tp.d), type: tp.type, summary: tp.summary }))
      .sort((a, b) => b.date.localeCompare(a.date));
    const keyDates: KeyDate[] = t.founder.keyDates.map((k) => ({ date: isoDaysFrom(today, k.inDays), label: k.label }));
    return { ...t, founder: { ...t.founder, keyDates }, touchpoints };
  });
}
