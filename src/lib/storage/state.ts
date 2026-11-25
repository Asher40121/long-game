import { materializeSeed } from "@/data/seed";
import { DEFAULT_WEIGHTS, type Weights } from "@/lib/fit/score";
import type { Target } from "@/lib/model";

/** Everything Long Game keeps, stored only in this browser. */
export type State = {
  version: 1;
  targets: Target[];
  weights: Weights;
  /** yyyy-mm-dd the demo data was generated. */
  seededAt: string;
  storySeen: boolean;
};

export const STORAGE_KEY = "longgame:v1:state";

/** Minimal storage interface so the logic can be tested without a browser. */
export type KV = { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void };

export function freshState(today: string, storySeen = false): State {
  return { version: 1, targets: materializeSeed(today), weights: { ...DEFAULT_WEIGHTS }, seededAt: today, storySeen };
}

function isState(x: unknown): x is State {
  const s = x as State;
  return !!s && s.version === 1 && Array.isArray(s.targets) && s.targets.length > 0 && typeof s.weights === "object" && typeof s.seededAt === "string";
}

/** Loads saved state, or a fresh demo if nothing valid is saved (or storage is blocked). */
export function loadState(storage: KV | null, today: string): { state: State; fromStorage: boolean } {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isState(parsed)) return { state: { ...parsed, weights: { ...DEFAULT_WEIGHTS, ...parsed.weights } }, fromStorage: true };
    }
  } catch {
    // Corrupt or unavailable storage: fall through to a fresh demo.
  }
  return { state: freshState(today), fromStorage: false };
}

/** Saves state; returns false if storage is unavailable or full. */
export function saveState(storage: KV | null, state: State): boolean {
  try {
    if (!storage) return false;
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

/** Today's date in the visitor's time zone, as yyyy-mm-dd. Call only on the client, after mount. */
export function localToday(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function browserStorage(): KV | null {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}
