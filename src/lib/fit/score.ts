import {
  CATEGORIES,
  CHANNELS,
  REGIONS,
  type Category,
  type Channel,
  type FitRatings,
  type PortfolioBrand,
  type Region,
  type RiskFlag,
  type Target,
} from "@/lib/model";

/**
 * Fit scorecard: a transparent weighted tally, deterministic and explainable.
 * Six criteria are rated 1–5 by the user; "Channel & geographic expansion" is computed
 * from the portfolio's gaps, so fit is measured against what the portfolio lacks.
 */

export type Criterion = keyof FitRatings | "expansion";

export const CRITERIA: { id: Criterion; label: string; computed?: boolean; help: string }[] = [
  { id: "categoryFit", label: "Category fit", help: "How close the business is to categories we know how to run." },
  { id: "expansion", label: "Channel & geographic expansion", computed: true, help: "Calculated from the portfolio gaps it fills: new categories, regions and channels." },
  { id: "brandStrength", label: "Brand strength", help: "Awareness and loyalty with its customers." },
  { id: "communityAlignment", label: "Community alignment", help: "How central the hobby community is to the business." },
  { id: "leadershipFit", label: "Leadership & culture fit", help: "Shared values and a workable partnership with the founder." },
  { id: "integrationEase", label: "Integration complexity", help: "Rated so that 5 means simple to integrate and 1 means very complex." },
  { id: "growthPotential", label: "Growth potential", help: "Room to grow with our support." },
];

export type Weights = Record<Criterion, number>;
export const DEFAULT_WEIGHTS: Weights = {
  categoryFit: 15,
  expansion: 15,
  brandStrength: 10,
  communityAlignment: 15,
  leadershipFit: 15,
  integrationEase: 15,
  growthPotential: 15,
};

export const RISK_PENALTY: Record<RiskFlag["severity"], number> = { high: 5, medium: 2, low: 1 };
export const RISK_PENALTY_CAP = 15;
/** A channel counts as a real presence only at or above this share of sales. */
export const CHANNEL_MIN_SHARE = 15;

export const BANDS = [
  { min: 65, label: "Strong fit" },
  { min: 50, label: "Good fit" },
  { min: 35, label: "Mixed fit" },
  { min: 0, label: "Weak fit" },
] as const;

export type Gaps = { categories: Category[]; channels: Channel[]; regions: Region[] };

const isUS = (r: Region) => r.startsWith("us-");

/** Regions covered by a set of brands; "US (national)" covers every US region. */
function covers(regions: Region[], r: Region): boolean {
  return regions.includes(r) || (isUS(r) && regions.includes("us-national"));
}

/** What the portfolio lacks: categories, channels and regions no brand covers. */
export function portfolioGaps(portfolio: PortfolioBrand[]): Gaps {
  const cats = new Set(portfolio.flatMap((b) => b.categories));
  const chans = new Set(portfolio.flatMap((b) => b.channels));
  const regions = portfolio.flatMap((b) => b.regions);
  return {
    categories: (Object.keys(CATEGORIES) as Category[]).filter((c) => !cats.has(c)),
    channels: (Object.keys(CHANNELS) as Channel[]).filter((c) => !chans.has(c)),
    regions: (Object.keys(REGIONS) as Region[]).filter((r) => r !== "us-national" && !covers(regions, r)),
  };
}

export type Expansion = {
  rating: number;
  newCategories: Category[];
  newChannels: Channel[];
  newRegions: Region[];
  /** A region the portfolio covers, but not in this target's category (e.g. a new retail region). */
  newRegionForCategory: Region | null;
};

export function expansionFor(target: Target, portfolio: PortfolioBrand[], gaps = portfolioGaps(portfolio)): Expansion {
  const newCategories = target.categories.filter((c) => gaps.categories.includes(c));
  const newChannels = target.channels
    .filter((c) => c.share >= CHANNEL_MIN_SHARE && gaps.channels.includes(c.channel))
    .map((c) => c.channel);
  const newRegions = target.regions.filter((r) => gaps.regions.includes(r));

  let newRegionForCategory: Region | null = null;
  const knownCats = target.categories.filter((c) => !newCategories.includes(c));
  if (knownCats.length > 0) {
    const catRegions = portfolio.filter((b) => b.categories.some((c) => knownCats.includes(c))).flatMap((b) => b.regions);
    newRegionForCategory =
      target.regions.find((r) => !newRegions.includes(r) && r !== "us-national" && !covers(catRegions, r)) ?? null;
  }

  const points =
    2 * newCategories.length + 1.5 * newRegions.length + 1 * newChannels.length + (newRegionForCategory ? 1 : 0);
  const rating = Math.min(5, Math.max(1, Math.round((1 + points) * 2) / 2));
  return { rating, newCategories, newChannels, newRegions, newRegionForCategory };
}

export type FitResult = {
  score: number; // 0–100
  band: string;
  ratings: Record<Criterion, number | null>;
  contributions: Record<Criterion, number | null>; // points earned toward the score
  assessed: number;
  total: number;
  riskPenalty: number;
  expansion: Expansion;
  fills: string[]; // human-readable gaps filled
  why: string;
};

/** Plain phrases for the one-line "why": [as a strength, as a weakness]. */
const PHRASES: Record<Criterion, [string, string]> = {
  categoryFit: ["close category fit", "distant category"],
  expansion: ["fills portfolio gaps", "little new reach"],
  brandStrength: ["strong brand", "weak brand awareness"],
  communityAlignment: ["deep community ties", "weak community ties"],
  leadershipFit: ["leadership fit", "leadership concerns"],
  integrationEase: ["simple integration", "complex integration"],
  growthPotential: ["growth potential", "limited growth"],
};

const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

export const MIN_RATED_FOR_BAND = 3;
export const PRELIMINARY = "Preliminary";

export function scoreFit(
  target: Target,
  portfolio: PortfolioBrand[],
  weights: Weights = DEFAULT_WEIGHTS,
): FitResult {
  const expansion = expansionFor(target, portfolio);
  const ratings: Record<Criterion, number | null> = { ...target.fit, expansion: expansion.rating };

  let earned = 0;
  let assessedWeight = 0;
  const contributions = {} as Record<Criterion, number | null>;
  for (const { id } of CRITERIA) {
    const r = ratings[id];
    const w = Math.max(0, weights[id] ?? 0);
    if (r == null) {
      contributions[id] = null;
      continue;
    }
    const pts = (w * (r - 1)) / 4;
    contributions[id] = pts;
    earned += pts;
    assessedWeight += w;
  }

  const riskPenalty = Math.min(
    RISK_PENALTY_CAP,
    target.risks.reduce((sum, r) => sum + RISK_PENALTY[r.severity], 0),
  );
  const base = assessedWeight > 0 ? (earned / assessedWeight) * 100 : 0;
  const score = Math.round(Math.max(0, Math.min(100, base - riskPenalty)));
  // With fewer than three criteria rated by hand, the score leans on the calculated expansion rating alone,
  // so it's labeled preliminary instead of given a band.
  const rated = CRITERIA.filter((c) => !c.computed && target.fit[c.id as keyof FitRatings] != null).length;
  const band = rated < MIN_RATED_FOR_BAND ? PRELIMINARY : BANDS.find((b) => score >= b.min)!.label;

  const fills = [
    ...expansion.newCategories.map((c) => CATEGORIES[c]),
    ...expansion.newRegions.map((r) => REGIONS[r]),
    ...expansion.newChannels.map((c) => CHANNELS[c]),
    ...(expansion.newRegionForCategory ? [`${REGIONS[expansion.newRegionForCategory]} (new for this category)`] : []),
  ];

  const assessedIds = CRITERIA.filter((c) => ratings[c.id] != null && (weights[c.id] ?? 0) > 0).map((c) => c.id);
  const strongest = assessedIds
    .filter((id) => (ratings[id] ?? 0) >= 4)
    .sort((a, b) => (contributions[b] ?? 0) - (contributions[a] ?? 0) || (ratings[b] ?? 0) - (ratings[a] ?? 0))
    .slice(0, 2);
  const weakest = assessedIds
    .filter((id) => (ratings[id] ?? 5) <= 2)
    .sort((a, b) => (ratings[a] ?? 0) - (ratings[b] ?? 0))
    .slice(0, 2);
  const highRisks = target.risks.filter((r) => r.severity === "high").length;

  const drags = [
    ...(highRisks ? [`${highRisks} high-severity risk${highRisks > 1 ? "s" : ""}`] : []),
    ...weakest.map((id) => PHRASES[id][1]),
  ];
  const sentences: string[] = [];
  sentences.push(strongest.length ? `Strengths: ${list(strongest.map((id) => PHRASES[id][0]))}.` : "No standout strengths yet.");
  if (drags.length) sentences.push(`Held back by ${list(drags)}.`);
  const missing = CRITERIA.length - assessedIds.length;
  if (missing > 0) sentences.push(`${missing} of ${CRITERIA.length} criteria not yet assessed.`);
  const why = sentences.join(" ");

  return {
    score,
    band,
    ratings,
    contributions,
    assessed: assessedIds.length,
    total: CRITERIA.length,
    riskPenalty,
    expansion,
    fills,
    why,
  };
}
