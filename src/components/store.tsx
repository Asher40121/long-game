"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_WEIGHTS, type Criterion } from "@/lib/fit/score";
import type { FitRatings, Stage, Target, Touchpoint } from "@/lib/model";
import { browserStorage, freshState, loadState, localToday, saveState, type State } from "@/lib/storage/state";

type Store = {
  /** False until the client has loaded state and today's date (first paint shows a skeleton). */
  ready: boolean;
  today: string;
  state: State;
  /** False if the browser blocks storage; the demo still works in memory. */
  persisted: boolean;
  target(id: string): Target | undefined;
  addTouchpoint(id: string, tp: Omit<Touchpoint, "id">): void;
  setStage(id: string, stage: Stage): void;
  setRating(id: string, key: keyof FitRatings, value: number | null): void;
  setWeight(c: Criterion, w: number): void;
  resetWeights(): void;
  updateTarget(id: string, patch: Partial<Target>): void;
  addTarget(t: Target): void;
  /** Removes a visitor-created target. Seeded targets can't be removed (reset restores them anyway). */
  removeTarget(id: string): void;
  setStorySeen(seen: boolean): void;
  resetDemo(): void;
};

const Ctx = createContext<Store | null>(null);

const PLACEHOLDER_DAY = "2000-01-01";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState(PLACEHOLDER_DAY);
  const [state, setState] = useState<State>(() => ({ ...freshState(PLACEHOLDER_DAY), targets: [] }));
  const [persisted, setPersisted] = useState(true);

  // Load once on the client. Dates are read here, never during render.
  useEffect(() => {
    const t = localToday();
    const { state: s } = loadState(browserStorage(), t);
    /* eslint-disable react-hooks/set-state-in-effect -- one-time hydration from localStorage */
    setToday(t);
    setState(s);
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Save only after the initial load, so an empty placeholder never overwrites real data.
  useEffect(() => {
    if (!ready) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reflect whether storage is available
    setPersisted(saveState(browserStorage(), state));
  }, [state, ready]);

  const mapTarget = useCallback((id: string, fn: (t: Target) => Target) => {
    setState((s) => ({ ...s, targets: s.targets.map((t) => (t.id === id ? fn(t) : t)) }));
  }, []);

  const store = useMemo<Store>(
    () => ({
      ready,
      today,
      state,
      persisted,
      target: (id) => state.targets.find((t) => t.id === id),
      addTouchpoint: (id, tp) =>
        mapTarget(id, (t) => ({
          ...t,
          edited: true,
          touchpoints: [{ ...tp, id: `${id}-u${t.touchpoints.length + 1}-${tp.date}` }, ...t.touchpoints].sort((a, b) =>
            b.date.localeCompare(a.date),
          ),
        })),
      setStage: (id, stage) => mapTarget(id, (t) => ({ ...t, stage, edited: true })),
      setRating: (id, key, value) => mapTarget(id, (t) => ({ ...t, fit: { ...t.fit, [key]: value }, edited: true })),
      setWeight: (c, w) => setState((s) => ({ ...s, weights: { ...s.weights, [c]: w } })),
      resetWeights: () => setState((s) => ({ ...s, weights: { ...DEFAULT_WEIGHTS } })),
      updateTarget: (id, patch) => mapTarget(id, (t) => ({ ...t, ...patch, edited: true })),
      addTarget: (t) => setState((s) => ({ ...s, targets: [...s.targets, t] })),
      removeTarget: (id) => setState((s) => ({ ...s, targets: s.targets.filter((t) => t.id !== id || !t.custom) })),
      setStorySeen: (seen) => setState((s) => ({ ...s, storySeen: seen })),
      resetDemo: () => setState((s) => freshState(today, s.storySeen)),
    }),
    [ready, today, state, persisted, mapTarget],
  );

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
