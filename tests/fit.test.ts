import { describe, expect, it } from "vitest";
import { PORTFOLIO } from "@/data/portfolio";
import { materializeSeed } from "@/data/seed";
import { DEFAULT_WEIGHTS, expansionFor, portfolioGaps, scoreFit } from "@/lib/fit/score";
import type { PortfolioBrand, Target } from "@/lib/model";

const TODAY = "2026-11-24";
const seed = materializeSeed(TODAY);
const byId = (id: string) => seed.find((t) => t.id === id)!;

function target(over: Partial<Target> = {}): Target {
  return {
    ...byId("emberline"),
    risks: [],
    fit: { categoryFit: 3, brandStrength: 3, communityAlignment: 3, leadershipFit: 3, integrationEase: 3, growthPotential: 3 },
    ...over,
  };
}

describe("portfolioGaps", () => {
  it("lists categories, channels and regions no brand covers", () => {
    const g = portfolioGaps(PORTFOLIO);
    expect(g.categories).toContain("events");
    expect(g.categories).not.toContain("tcg-publishing");
    expect(g.channels).toEqual(expect.arrayContaining(["dtc", "marketplace", "events", "crowdfunding"]));
    expect(g.regions).toEqual(["uk", "europe", "apac"]);
  });

  it("treats US (national) as covering every US region", () => {
    const g = portfolioGaps([{ name: "x", oneLiner: "", categories: [], channels: [], regions: ["us-national"] }]);
    expect(g.regions).not.toContain("us-south");
    expect(g.regions).not.toContain("us-national");
  });
});

describe("expansionFor", () => {
  it("rewards new regions (Emberline: Europe and the UK)", () => {
    const e = expansionFor(byId("emberline"), PORTFOLIO);
    expect(e.newRegions).toEqual(["europe", "uk"]);
    expect(e.newCategories).toEqual([]);
    expect(e.rating).toBe(4);
  });

  it("ignores channels below the minimum share", () => {
    // Emberline's 12% DTC and 8% events are too small to count.
    expect(expansionFor(byId("emberline"), PORTFOLIO).newChannels).toEqual([]);
  });

  it("credits a region that's new for the target's category (retail add-on)", () => {
    const e = expansionFor(byId("red-clay"), PORTFOLIO);
    expect(e.newRegionForCategory).toBe("us-south");
    expect(e.rating).toBe(2);
  });

  it("caps the rating at 5 and floors it at 1", () => {
    expect(expansionFor(byId("paperhawk"), PORTFOLIO).rating).toBe(5);
    const none: PortfolioBrand[] = [
      { name: "all", oneLiner: "", categories: ["tcg-publishing"], channels: ["hobby-stores", "wholesale", "dtc", "events"], regions: ["us-national", "europe", "uk"] },
    ];
    expect(expansionFor(byId("emberline"), none).rating).toBe(1);
  });
});

describe("scoreFit", () => {
  it("is deterministic", () => {
    expect(scoreFit(byId("emberline"), PORTFOLIO)).toEqual(scoreFit(byId("emberline"), PORTFOLIO));
  });

  it("scores all-5 ratings with full expansion and no risks as 100", () => {
    const t = target({
      regions: ["europe", "uk", "apac"],
      fit: { categoryFit: 5, brandStrength: 5, communityAlignment: 5, leadershipFit: 5, integrationEase: 5, growthPotential: 5 },
    });
    expect(scoreFit(t, PORTFOLIO).score).toBe(100);
  });

  it("scores all-1 ratings as 0", () => {
    const t = target({
      regions: ["us-national"],
      channels: [{ channel: "hobby-stores", share: 100 }],
      fit: { categoryFit: 1, brandStrength: 1, communityAlignment: 1, leadershipFit: 1, integrationEase: 1, growthPotential: 1 },
    });
    expect(scoreFit(t, PORTFOLIO).score).toBe(0);
  });

  it("subtracts a capped risk penalty", () => {
    const clean = scoreFit(target(), PORTFOLIO);
    const risky = scoreFit(target({ risks: [{ label: "a", severity: "high" }, { label: "b", severity: "medium" }] }), PORTFOLIO);
    expect(clean.score - risky.score).toBe(7);
    const many = scoreFit(target({ risks: Array.from({ length: 10 }, (_, i) => ({ label: `r${i}`, severity: "high" as const })) }), PORTFOLIO);
    expect(many.riskPenalty).toBe(15);
  });

  it("excludes unassessed criteria and renormalizes the weights", () => {
    const r = scoreFit(byId("foilscope"), PORTFOLIO);
    expect(r.assessed).toBe(5);
    expect(r.contributions.brandStrength).toBeNull();
    expect(r.why).toContain("2 of 7 criteria not yet assessed");
  });

  it("respects custom weights (a zero weight removes a criterion)", () => {
    const t = byId("red-clay");
    const base = scoreFit(t, PORTFOLIO).score;
    const noExpansion = scoreFit(t, PORTFOLIO, { ...DEFAULT_WEIGHTS, expansion: 0 }).score;
    expect(noExpansion).toBeGreaterThan(base);
  });

  it("explains the score in one line", () => {
    const r = scoreFit(byId("emberline"), PORTFOLIO);
    expect(r.why).toBe("Strengths: close category fit and deep community ties. Held back by 1 high-severity risk.");
    expect(r.fills).toEqual(["Continental Europe", "United Kingdom"]);
  });

  it("produces the intended spread across the seed data", () => {
    const s = (id: string) => scoreFit(byId(id), PORTFOLIO);
    expect(s("emberline").band).toBe("Strong fit");
    expect(s("halden-voss").band).toBe("Mixed fit");
    expect(s("rookie-ridge").band).toBe("Weak fit");
    for (const t of seed) {
      const r = scoreFit(t, PORTFOLIO);
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });
});
