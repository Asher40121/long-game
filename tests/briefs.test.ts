import { describe, expect, it } from "vitest";
import { PORTFOLIO } from "@/data/portfolio";
import { SEED, materializeSeed } from "@/data/seed";
import { SAMPLE_BRIEFS } from "@/data/samples/briefs";
import { BRIEF_HEADINGS, assembleBrief, getBrief } from "@/lib/brief/brief";
import { scoreFit } from "@/lib/fit/score";
import { reachOutSuggestions, relationshipHealth } from "@/lib/health/health";

const TODAY = "2026-11-24";
const targets = materializeSeed(TODAY);
const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const numbers = (s: string) => s.match(/\d+(?:\.\d+)?/g) ?? [];

/**
 * Numbers a brief may use that aren't literally in the target's data, each derived from it.
 * Keep this list short; anything else must come from the data.
 */
const DERIVED: Record<string, string[]> = {
  emberline: ["20"], // relationship length: first touch ~610 days ago
  graywater: ["45"], // the Building stage's cadence
  harborlight: ["12"], // "at least a year" stated as 12 months
  wildmoor: ["11"], // anniversary in 75 days ≈ 11 weeks
};

describe("sample decision briefs", () => {
  it("exist for every seeded target", () => {
    expect(Object.keys(SAMPLE_BRIEFS).sort()).toEqual(SEED.map((t) => t.id).sort());
  });

  for (const t of targets) {
    const brief = SAMPLE_BRIEFS[t.id];
    const fit = scoreFit(t, PORTFOLIO);

    describe(t.name, () => {
      it("is 450 words or fewer", () => expect(words(brief)).toBeLessThanOrEqual(450));

      it("opens with a recommendation and has every section in order", () => {
        expect(brief.startsWith("**Recommendation:** ")).toBe(true);
        const positions = BRIEF_HEADINGS.map((h) => brief.indexOf(`### ${h}`));
        positions.forEach((p, i) => expect(p, BRIEF_HEADINGS[i]).toBeGreaterThan(0));
        expect([...positions].sort((a, b) => a - b)).toEqual(positions);
      });

      it("quotes the calculated fit exactly", () => {
        expect(brief).toContain(`**Fit ${fit.score}, ${fit.band}.** ${fit.why}`);
      });

      it("uses no numbers that aren't in the target's data", () => {
        const source = JSON.stringify(SEED.find((s) => s.id === t.id)) + ` ${fit.score} ${fit.why}`;
        const allowed = new Set([...numbers(source), ...(DERIVED[t.id] ?? [])]);
        const invented = numbers(brief).filter((n) => !allowed.has(n));
        expect(invented, `numbers not found in ${t.id}'s data`).toEqual([]);
      });

      it("states no price, multiple or valuation", () => {
        expect(brief).not.toMatch(/\bmultiple\b|EBITDA|\bvalu(ed|ation) (at|of)\b/i);
        // The only dollar figure allowed is the target's own revenue band.
        const band = new RegExp(t.sizeBand.replace(/[$.*+?^()[\]{}|\\]/g, "\\$&"), "gi");
        const withoutBand = brief.replace(band, "");
        expect(withoutBand).not.toContain("$");
      });
    });
  }
});

describe("getBrief", () => {
  const t = targets.find((x) => x.id === "emberline")!;
  const args = [scoreFit(t, PORTFOLIO), relationshipHealth(t, TODAY), reachOutSuggestions(t, TODAY)] as const;

  it("returns the sample for an unedited seeded target", () => expect(getBrief(t, ...args).kind).toBe("sample"));
  it("marks the sample stale once the target is edited", () => expect(getBrief({ ...t, edited: true }, ...args).kind).toBe("stale"));
  it("assembles a brief for a custom target", () => expect(getBrief({ ...t, custom: true, id: "new-1" }, ...args).kind).toBe("assembled"));
});

describe("assembleBrief", () => {
  it("uses every heading and lists what's missing instead of inventing it", () => {
    const t = { ...targets.find((x) => x.id === "foilscope")!, custom: true };
    const md = assembleBrief(t, scoreFit(t, PORTFOLIO), relationshipHealth(t, TODAY), reachOutSuggestions(t, TODAY));
    BRIEF_HEADINGS.forEach((h) => expect(md).toContain(`### ${h}`));
    expect(md).toContain("2 fit criteria not yet assessed");
    expect(md).toContain("What matters to the founder in a deal");
    expect(md).toContain("Financials beyond the revenue band");
  });

  it("puts re-engagement first for a relationship that has gone quiet", () => {
    const t = targets.find((x) => x.id === "ashby")!;
    const md = assembleBrief(t, scoreFit(t, PORTFOLIO), relationshipHealth(t, TODAY), reachOutSuggestions(t, TODAY));
    expect(md).toMatch(/^\*\*Recommendation:\*\* Re-engage before anything else/);
  });
});
