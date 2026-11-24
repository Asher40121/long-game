import { STAGES, type Stage, type Target } from "@/lib/model";

/**
 * Relationship health: how recently we've been in touch compared with the cadence
 * the relationship's stage calls for. Deterministic; `today` is passed in (yyyy-mm-dd).
 */

/** Expected days between touches, by stage. Stages not listed aren't tracked. */
export const STAGE_CADENCE: Partial<Record<Stage, number>> = {
  "first-conversation": 30,
  building: 45,
  evaluating: 21,
  diligence: 7,
  closing: 7,
  integration: 14,
  nurture: 90,
};

/** No contact for at least this many days, and past the cadence, means "gone quiet". */
export const GONE_QUIET_DAYS = 60;
/** Below this share of the cadence, the relationship is healthy; up to 100% a touch is due soon. */
export const DUE_SOON_RATIO = 0.8;
/** Founder key dates this close are suggested as reasons to reach out. */
export const KEY_DATE_WINDOW_DAYS = 45;

export type HealthStatus = "healthy" | "due-soon" | "overdue" | "gone-quiet" | "no-contact" | "not-tracked";

export const HEALTH_LABELS: Record<HealthStatus, string> = {
  healthy: "Healthy",
  "due-soon": "Touch due soon",
  overdue: "Overdue",
  "gone-quiet": "Gone quiet",
  "no-contact": "No contact yet",
  "not-tracked": "Not tracked",
};

export type Health = {
  status: HealthStatus;
  label: string;
  daysSince: number | null;
  cadence: number | null;
  lastTouch: string | null;
  /** When the next touch is due (yyyy-mm-dd); today if already overdue. */
  nextTouch: string | null;
  why: string;
};

export function daysBetween(from: string, to: string): number {
  const a = Date.UTC(+from.slice(0, 4), +from.slice(5, 7) - 1, +from.slice(8, 10));
  const b = Date.UTC(+to.slice(0, 4), +to.slice(5, 7) - 1, +to.slice(8, 10));
  return Math.round((b - a) / 86_400_000);
}

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function lastTouchDate(target: Target, today: string): string | null {
  const past = target.touchpoints.map((t) => t.date).filter((d) => d <= today);
  return past.length ? past.reduce((a, b) => (a > b ? a : b)) : null;
}

export function cadenceFor(target: Target): number | null {
  return target.cadenceDays ?? STAGE_CADENCE[target.stage] ?? null;
}

export function relationshipHealth(target: Target, today: string): Health {
  const cadence = cadenceFor(target);
  const lastTouch = lastTouchDate(target, today);
  const daysSince = lastTouch ? daysBetween(lastTouch, today) : null;
  const stageLabel = STAGES.find((s) => s.id === target.stage)!.label;

  const make = (status: HealthStatus, why: string, nextTouch: string | null = null): Health => ({
    status,
    label: HEALTH_LABELS[status],
    daysSince,
    cadence,
    lastTouch,
    nextTouch,
    why,
  });

  if (cadence == null) return make("not-tracked", `Relationship health isn't tracked at the ${stageLabel} stage.`);
  if (daysSince == null) return make("no-contact", "No touchpoints logged yet.", today);

  const due = addDays(lastTouch!, cadence);
  const nextTouch = due < today ? today : due;
  const ago = `Last touch ${daysSince} day${daysSince === 1 ? "" : "s"} ago`;
  const expected = `${stageLabel} expects a touch every ${cadence} days`;

  if (daysSince >= GONE_QUIET_DAYS && daysSince > cadence)
    return make("gone-quiet", `${ago}; ${expected.toLowerCase()}.`, nextTouch);
  if (daysSince > cadence) return make("overdue", `${ago}; ${expected.toLowerCase()}.`, nextTouch);
  if (daysSince >= cadence * DUE_SOON_RATIO) return make("due-soon", `${ago}; next touch due in ${cadence - daysSince} days.`, nextTouch);
  return make("healthy", `${ago}; next touch due in ${cadence - daysSince} days.`, nextTouch);
}

/** Active relationships with no contact for 60+ days, longest silence first. */
export function goneQuiet(targets: Target[], today: string): { target: Target; health: Health }[] {
  return targets
    .map((target) => ({ target, health: relationshipHealth(target, today) }))
    .filter((x) => x.health.status === "gone-quiet")
    .sort((a, b) => (b.health.daysSince ?? 0) - (a.health.daysSince ?? 0));
}

export type ReachOut = { reason: string; kind: "key-date" | "idea" };

/** Low-pressure reasons to reach out: upcoming founder key dates first, then hand-written ideas. */
export function reachOutSuggestions(target: Target, today: string): ReachOut[] {
  const dates = target.founder.keyDates
    .map((k) => ({ k, inDays: daysBetween(today, k.date) }))
    .filter((x) => x.inDays >= 0 && x.inDays <= KEY_DATE_WINDOW_DAYS)
    .sort((a, b) => a.inDays - b.inDays)
    .map(({ k, inDays }): ReachOut => ({
      reason: `${k.label} ${inDays === 0 ? "today" : `in ${inDays} day${inDays === 1 ? "" : "s"}`}.`,
      kind: "key-date",
    }));
  return [...dates, ...target.reachOutIdeas.map((reason): ReachOut => ({ reason, kind: "idea" }))];
}
