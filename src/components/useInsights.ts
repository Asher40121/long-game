"use client";

import { useMemo } from "react";
import { PORTFOLIO } from "@/data/portfolio";
import { scoreFit, type FitResult } from "@/lib/fit/score";
import { reachOutSuggestions, relationshipHealth, type Health, type ReachOut } from "@/lib/health/health";
import type { Target } from "@/lib/model";
import { useStore } from "@/components/store";

export type Insight = { target: Target; fit: FitResult; health: Health; reach: ReachOut[] };

/** Fit, health and reach-out suggestions for every target, recalculated when data changes. */
export function useInsights(): Insight[] {
  const { state, today } = useStore();
  return useMemo(
    () =>
      state.targets.map((target) => ({
        target,
        fit: scoreFit(target, PORTFOLIO, state.weights),
        health: relationshipHealth(target, today),
        reach: reachOutSuggestions(target, today),
      })),
    [state.targets, state.weights, today],
  );
}

export const targetHref = (id: string) => `/target?id=${encodeURIComponent(id)}`;
