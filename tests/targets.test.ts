import { describe, expect, it } from "vitest";
import { PORTFOLIO } from "@/data/portfolio";
import { materializeSeed } from "@/data/seed";
import { assembleBrief } from "@/lib/brief/brief";
import { PRELIMINARY, scoreFit } from "@/lib/fit/score";
import { reachOutSuggestions, relationshipHealth } from "@/lib/health/health";
import { emptyForm, formFromTarget, makeId, targetFromForm, validateForm, type TargetForm } from "@/lib/targets/form";

const TODAY = "2026-11-24";
const filled = (): TargetForm => ({
  ...emptyForm(),
  name: "Copperline Tokens",
  founderName: "Sam Ortiz",
  categories: ["rpg-accessories"],
  regions: ["canada"],
  channels: ["hobby-stores", "dtc", "crowdfunding"],
  priorities: [{ priority: "team", note: "Keep the workshop crew. " }, { priority: "legacy", note: "" }],
  concerns: "Losing the brand voice\n\n  Moving production  ",
  keyDates: [{ date: "2027-02-10", label: " Spring catalog launch " }, { date: "2026-12-05", label: "Holiday show" }],
  risks: [{ label: "Single supplier", severity: "high" }],
});

describe("add / edit target form", () => {
  it("requires company, founder, a category and a region", () => {
    const e = validateForm(emptyForm(), 2026);
    expect(Object.keys(e).sort()).toEqual(["categories", "founderName", "name", "regions"]);
    expect(validateForm(filled(), 2026)).toEqual({});
  });

  it("checks the founded year, key dates and risks", () => {
    const e = validateForm({ ...filled(), founded: "2031", keyDates: [{ date: "", label: "x" }], risks: [{ label: " ", severity: "low" }] }, 2026);
    expect(Object.keys(e).sort()).toEqual(["founded", "keyDates", "risks"]);
  });

  it("makes unique, url-safe ids", () => {
    expect(makeId("Café & Co. Games!", [])).toBe("cafe-co-games");
    expect(makeId("Emberline", ["emberline", "emberline-2"])).toBe("emberline-3");
    expect(makeId("!!!", [])).toBe("target");
  });

  it("creates a custom target with nothing assessed and tidy fields", () => {
    const t = targetFromForm(filled(), { id: "copperline" });
    expect(t.custom).toBe(true);
    expect(t.edited).toBeUndefined();
    expect(t.touchpoints).toEqual([]);
    expect(Object.values(t.fit).every((v) => v === null)).toBe(true);
    expect(t.channels.reduce((s, c) => s + c.share, 0)).toBe(100);
    expect(t.founder.concerns).toEqual(["Losing the brand voice", "Moving production"]);
    expect(t.founder.keyDates.map((k) => k.label)).toEqual(["Holiday show", "Spring catalog launch"]);
    expect(t.founder.priorities[0].note).toBe("Keep the workshop crew.");
  });

  it("works end to end: health, a preliminary fit score and an assembled brief", () => {
    const t = targetFromForm(filled(), { id: "copperline" });
    const fit = scoreFit(t, PORTFOLIO);
    expect(fit.band).toBe(PRELIMINARY);
    const health = relationshipHealth(t, TODAY);
    const brief = assembleBrief(t, fit, health, reachOutSuggestions(t, TODAY));
    expect(brief).toContain("team (Keep the workshop crew)");
    expect(brief).toContain("crew); legacy."); // a priority with no note has no empty brackets
    expect(brief).not.toContain("()");
    expect(brief).toContain("no touchpoints logged");
  });

  it("gives a band once three criteria are rated", () => {
    const t = targetFromForm(filled(), { id: "copperline" });
    t.fit = { ...t.fit, categoryFit: 4, communityAlignment: 4, leadershipFit: 3 };
    expect(scoreFit(t, PORTFOLIO).band).not.toBe(PRELIMINARY);
  });

  it("edits a seeded target without losing what the form doesn't cover", () => {
    const seed = materializeSeed(TODAY).find((x) => x.id === "emberline")!;
    const f = formFromTarget(seed);
    const t = targetFromForm({ ...f, oneLiner: "Changed." }, { id: seed.id, base: seed });
    expect(t.oneLiner).toBe("Changed.");
    expect(t.edited).toBe(true);
    expect(t.custom).toBeUndefined();
    expect(t.touchpoints).toEqual(seed.touchpoints);
    expect(t.fit).toEqual(seed.fit);
    expect(t.fitNotes).toEqual(seed.fitNotes);
    expect(t.channels).toEqual(seed.channels); // same channels keep their real shares
    expect(t.founder.background).toBe(seed.founder.background);
    expect(scoreFit(t, PORTFOLIO).score).toBe(scoreFit(seed, PORTFOLIO).score);
  });
});
