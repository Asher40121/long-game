import { describe, expect, it } from "vitest";
import { materializeSeed } from "@/data/seed";
import { addDays, daysBetween, goneQuiet, reachOutSuggestions, relationshipHealth } from "@/lib/health/health";
import type { Target } from "@/lib/model";

const TODAY = "2026-11-24";
const seed = materializeSeed(TODAY);
const byId = (id: string) => seed.find((t) => t.id === id)!;

/** A target in `stage` whose last touch was `daysAgo` days before TODAY. */
function withTouch(stage: Target["stage"], daysAgo: number | null, over: Partial<Target> = {}): Target {
  return {
    ...byId("emberline"),
    stage,
    touchpoints: daysAgo == null ? [] : [{ id: "t", date: addDays(TODAY, -daysAgo), type: "call", summary: "" }],
    ...over,
  };
}

describe("date helpers", () => {
  it("counts days across months and years", () => {
    expect(daysBetween("2026-12-30", "2027-01-02")).toBe(3);
    expect(daysBetween("2026-03-01", "2026-02-27")).toBe(-2);
    expect(addDays("2026-02-27", 2)).toBe("2026-03-01");
  });
});

describe("relationshipHealth", () => {
  it("is healthy well inside the cadence", () => {
    const h = relationshipHealth(withTouch("evaluating", 5), TODAY);
    expect(h.status).toBe("healthy");
    expect(h.nextTouch).toBe(addDays(TODAY, 16));
  });

  it("is due soon at 80% of the cadence", () => {
    expect(relationshipHealth(withTouch("building", 36), TODAY).status).toBe("due-soon"); // 36/45 = 0.8
    expect(relationshipHealth(withTouch("building", 35), TODAY).status).toBe("healthy");
  });

  it("is overdue past the cadence but under 60 days", () => {
    const h = relationshipHealth(withTouch("building", 52), TODAY);
    expect(h.status).toBe("overdue");
    expect(h.nextTouch).toBe(TODAY);
  });

  it("has gone quiet at 60+ days and past the cadence", () => {
    expect(relationshipHealth(withTouch("first-conversation", 60), TODAY).status).toBe("gone-quiet");
    expect(relationshipHealth(withTouch("first-conversation", 59), TODAY).status).toBe("overdue");
  });

  it("lets nurture relationships run 90 days without alarm", () => {
    expect(relationshipHealth(withTouch("nurture", 75), TODAY).status).toBe("due-soon");
    expect(relationshipHealth(withTouch("nurture", 90), TODAY).status).toBe("due-soon");
    expect(relationshipHealth(withTouch("nurture", 91), TODAY).status).toBe("gone-quiet");
  });

  it("uses a per-target cadence override", () => {
    expect(relationshipHealth(withTouch("nurture", 100, { cadenceDays: 180 }), TODAY).status).toBe("healthy");
  });

  it("doesn't track identified, researching or passed targets", () => {
    for (const stage of ["identified", "researching", "passed"] as const)
      expect(relationshipHealth(withTouch(stage, 400), TODAY).status).toBe("not-tracked");
  });

  it("flags active relationships with no touchpoints", () => {
    expect(relationshipHealth(withTouch("building", null), TODAY).status).toBe("no-contact");
  });

  it("ignores touchpoints dated in the future", () => {
    const t = withTouch("evaluating", 30);
    t.touchpoints.push({ id: "f", date: addDays(TODAY, 3), type: "meeting", summary: "scheduled" });
    expect(relationshipHealth(t, TODAY).daysSince).toBe(30);
  });
});

describe("goneQuiet", () => {
  it("lists the seed's quiet relationships, longest silence first", () => {
    expect(goneQuiet(seed, TODAY).map((x) => x.target.id)).toEqual(["ashby", "halden-voss"]);
  });
});

describe("reachOutSuggestions", () => {
  it("puts upcoming founder key dates first, then hand-written ideas", () => {
    const s = reachOutSuggestions(byId("emberline"), TODAY);
    expect(s[0]).toEqual({ kind: "key-date", reason: "Ashveil 12th-anniversary set launches in 23 days." });
    expect(s.filter((x) => x.kind === "key-date")).toHaveLength(1); // the championship is 61 days out
    expect(s.at(-1)?.kind).toBe("idea");
  });

  it("skips key dates in the past", () => {
    const s = reachOutSuggestions(byId("harborlight"), TODAY);
    expect(s.some((x) => x.reason.startsWith("Deal closed"))).toBe(false);
  });
});
