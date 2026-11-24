import { describe, expect, it } from "vitest";
import { SEED, materializeSeed } from "@/data/seed";
import { CATEGORIES, CHANNELS, REGIONS, STAGES } from "@/lib/model";

describe("seed data integrity", () => {
  it("has 8–12 targets with unique ids", () => {
    expect(SEED.length).toBeGreaterThanOrEqual(8);
    expect(SEED.length).toBeLessThanOrEqual(12);
    expect(new Set(SEED.map((t) => t.id)).size).toBe(SEED.length);
  });

  it("uses only known stages, categories, channels and regions", () => {
    const stages = STAGES.map((s) => s.id) as string[];
    for (const t of SEED) {
      expect(stages).toContain(t.stage);
      t.categories.forEach((c) => expect(CATEGORIES).toHaveProperty(c));
      t.channels.forEach((c) => expect(CHANNELS).toHaveProperty(c.channel));
      t.regions.forEach((r) => expect(REGIONS).toHaveProperty(r));
    }
  });

  it("has channel mixes that add up to 100%", () => {
    for (const t of SEED) expect(t.channels.reduce((s, c) => s + c.share, 0), t.name).toBe(100);
  });

  it("keeps ratings in range", () => {
    for (const t of SEED)
      for (const v of Object.values(t.fit)) {
        if (v == null) continue;
        expect(v).toBeGreaterThanOrEqual(1);
        expect(v).toBeLessThanOrEqual(5);
      }
  });

  it("materializes relative dates, newest touchpoint first", () => {
    const [ember] = materializeSeed("2026-11-24");
    expect(ember.touchpoints[0].date).toBe("2026-11-12"); // 12 days ago
    expect(ember.founder.keyDates[0].date).toBe("2026-12-17"); // in 23 days
  });
});
