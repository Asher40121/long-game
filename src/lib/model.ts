/**
 * Long Game data model. The founder relationship is the primary object; the deal is the outcome.
 * All seed data is fictional.
 */

export const STAGES = [
  { id: "identified", label: "Identified", active: false },
  { id: "researching", label: "Researching", active: false },
  { id: "first-conversation", label: "First Conversation", active: true },
  { id: "building", label: "Building Relationship", active: true },
  { id: "evaluating", label: "Evaluating", active: true },
  { id: "diligence", label: "Diligence", active: true },
  { id: "closing", label: "Closing", active: true },
  { id: "integration", label: "Integration Planning", active: true },
  { id: "nurture", label: "Nurture (not ready)", active: true },
  { id: "passed", label: "Passed", active: false },
] as const;
export type Stage = (typeof STAGES)[number]["id"];

export const CATEGORIES = {
  "tcg-publishing": "Trading card game publishing",
  "card-accessories": "Card protection & play accessories",
  "grading-storage": "Grading & archival storage",
  "hobby-retail": "Hobby retail",
  events: "Conventions & live events",
  distribution: "Distribution",
  miniatures: "Miniatures & tabletop wargaming",
  "board-games": "Board & party games",
  "collector-platforms": "Collector platforms & marketplaces",
  puzzles: "Puzzles",
  "rpg-accessories": "RPG dice & accessories",
} as const;
export type Category = keyof typeof CATEGORIES;

export const CHANNELS = {
  "hobby-stores": "Hobby stores",
  "mass-retail": "Mass retail",
  dtc: "Direct to consumer",
  marketplace: "Online marketplaces",
  events: "Event sales",
  wholesale: "Wholesale / distribution",
  crowdfunding: "Crowdfunding",
} as const;
export type Channel = keyof typeof CHANNELS;

export const REGIONS = {
  "us-midwest": "US Midwest",
  "us-west": "US West",
  "us-south": "US South",
  "us-east": "US East",
  "us-national": "US (national)",
  canada: "Canada",
  uk: "United Kingdom",
  europe: "Continental Europe",
  apac: "Asia-Pacific",
} as const;
export type Region = keyof typeof REGIONS;

export const SIZE_BANDS = ["Under $5M", "$5–15M", "$15–40M", "$40–100M"] as const;
export type SizeBand = (typeof SIZE_BANDS)[number];

export type Ownership = "founder-led" | "family-owned" | "pe-backed";
export type DealType = "platform" | "add-on";
export type Source = "referral" | "direct-outreach" | "event" | "intermediary";

export type Priority = "legacy" | "team" | "brand" | "liquidity" | "staying-involved";
export const PRIORITY_LABELS: Record<Priority, string> = {
  legacy: "Legacy",
  team: "Team",
  brand: "Brand",
  liquidity: "Liquidity",
  "staying-involved": "Staying involved",
};

export type TouchpointType = "call" | "meeting" | "event" | "intro" | "email" | "gift-note";
export type Touchpoint = {
  id: string;
  date: string; // ISO date (yyyy-mm-dd)
  type: TouchpointType;
  summary: string;
};

export type KeyDate = { date: string; label: string };

export type Founder = {
  name: string;
  role: string;
  background: string;
  built: string;
  /** What matters to them in a transaction, most important first. */
  priorities: { priority: Priority; note: string }[];
  concerns: string[];
  communication: string;
  keyDates: KeyDate[];
  notes: string;
};

/** 1–5 ratings entered by the user; null means "not yet assessed". */
export type FitRatings = {
  categoryFit: number | null;
  brandStrength: number | null;
  communityAlignment: number | null;
  leadershipFit: number | null;
  /** Higher = simpler to integrate (shown to users as "Integration complexity: low"). */
  integrationEase: number | null;
  growthPotential: number | null;
};

export type RiskFlag = { label: string; severity: "low" | "medium" | "high" };

export type Target = {
  id: string;
  name: string;
  oneLiner: string;
  categories: Category[];
  channels: { channel: Channel; share: number }[]; // share in %, sums to ~100
  regions: Region[];
  hq: string;
  founded: number;
  sizeBand: SizeBand;
  ownership: Ownership;
  dealType: DealType;
  source: Source;
  rationale: string;
  stage: Stage;
  stageNote?: string;
  /** Expected days between touches; overrides the stage default. */
  cadenceDays?: number;
  founder: Founder;
  touchpoints: Touchpoint[];
  fit: FitRatings;
  fitNotes: Partial<Record<keyof FitRatings, string>>;
  risks: RiskFlag[];
  /** Hand-written low-pressure reasons to reach out. */
  reachOutIdeas: string[];
};

/** The (fictional) acquirer's current portfolio, used to measure fit against gaps. */
export type PortfolioBrand = {
  name: string;
  oneLiner: string;
  categories: Category[];
  channels: Channel[];
  regions: Region[];
};
