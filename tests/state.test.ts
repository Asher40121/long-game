import { describe, expect, it } from "vitest";
import { DEFAULT_WEIGHTS } from "@/lib/fit/score";
import { STORAGE_KEY, freshState, loadState, localToday, saveState, type KV } from "@/lib/storage/state";

function memory(): KV & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
}
const TODAY = "2026-11-24";

describe("state storage", () => {
  it("starts a fresh demo when nothing is saved", () => {
    const { state, fromStorage } = loadState(memory(), TODAY);
    expect(fromStorage).toBe(false);
    expect(state.targets).toHaveLength(12);
    expect(state.seededAt).toBe(TODAY);
  });

  it("round-trips saved state", () => {
    const kv = memory();
    const s = freshState(TODAY);
    s.targets[0].stage = "diligence";
    expect(saveState(kv, s)).toBe(true);
    const { state, fromStorage } = loadState(kv, "2026-12-01");
    expect(fromStorage).toBe(true);
    expect(state.targets[0].stage).toBe("diligence");
    expect(state.seededAt).toBe(TODAY);
  });

  it("ignores corrupt, outdated or empty saved state", () => {
    const kv = memory();
    for (const bad of ["{not json", JSON.stringify({ version: 0 }), JSON.stringify({ ...freshState(TODAY), targets: [] })]) {
      kv.setItem(STORAGE_KEY, bad);
      expect(loadState(kv, TODAY).fromStorage).toBe(false);
    }
  });

  it("fills in weights added in later versions", () => {
    const kv = memory();
    const s = freshState(TODAY) as unknown as { weights: Record<string, number> };
    delete s.weights.expansion;
    kv.setItem(STORAGE_KEY, JSON.stringify(s));
    expect(loadState(kv, TODAY).state.weights.expansion).toBe(DEFAULT_WEIGHTS.expansion);
  });

  it("works without storage", () => {
    expect(loadState(null, TODAY).state.targets).toHaveLength(12);
    expect(saveState(null, freshState(TODAY))).toBe(false);
    const throwing: KV = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("full"); }, removeItem: () => {} };
    expect(loadState(throwing, TODAY).fromStorage).toBe(false);
    expect(saveState(throwing, freshState(TODAY))).toBe(false);
  });

  it("formats today in local time", () => {
    expect(localToday(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
  });
});
