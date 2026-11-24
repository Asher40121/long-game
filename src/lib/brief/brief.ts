import { SAMPLE_BRIEFS } from "@/data/samples/briefs";
import type { FitResult } from "@/lib/fit/score";
import type { Health, ReachOut } from "@/lib/health/health";
import { CATEGORIES, CHANNELS, PRIORITY_LABELS, REGIONS, STAGES, type Target } from "@/lib/model";

/**
 * Decision briefs in demo mode.
 * - "sample": a hand-written brief for an unedited seeded target (labeled "Sample output").
 * - "stale": the visitor edited a seeded target, so the sample may no longer match its data.
 * - "assembled": built only from the fields entered, with gaps listed instead of invented filler.
 */
export type BriefKind = "sample" | "stale" | "assembled";
export type Brief = { kind: BriefKind; markdown: string; assembled: string };

export const BRIEF_HEADINGS = [
  "The business",
  "Why it fits",
  "What the founder cares about",
  "Key risks",
  "What we don't know yet",
  "Recommended next step",
] as const;

const OWNERSHIP: Record<Target["ownership"], string> = { "founder-led": "founder-led", "family-owned": "family-owned", "pe-backed": "private equity-backed" };
const stageLabel = (t: Target) => STAGES.find((s) => s.id === t.stage)!.label;

function recommendation(t: Target, fit: FitResult, health: Health): string {
  const first = t.founder.name.split(" ")[0];
  if (t.stage === "passed") return "Stay passed. Revisit only if the reasons recorded at the pass change.";
  if (health.status === "gone-quiet")
    return `Re-engage before anything else: we haven't been in touch with ${first} for ${health.daysSince} days.`;
  if (t.stage === "identified" || t.stage === "researching")
    return fit.score >= 50
      ? `Make a first, low-pressure contact with ${first}. The fit case is worth testing in conversation.`
      : "Keep on the watch list; the fit case isn't strong enough yet to prioritize outreach.";
  if (t.stage === "nurture") return `Keep nurturing the relationship on a ${health.cadence}-day rhythm; no deal activity until ${first} signals readiness.`;
  if (fit.score >= 50) return "Continue to the next stage, addressing the high-severity risks first.";
  return "Hold. Resolve the open questions below before investing more time.";
}

/** A brief built only from the target's data. Never invents facts; lists what's missing. */
export function assembleBrief(t: Target, fit: FitResult, health: Health, reach: ReachOut[]): string {
  const f = t.founder;
  const L: string[] = [];
  L.push(`**Recommendation:** ${recommendation(t, fit, health)}`, "");

  L.push("### The business");
  const bits = [
    t.oneLiner || null,
    `Based in ${t.hq || "an unrecorded location"}${t.founded ? `, founded ${t.founded}` : ""}; ${OWNERSHIP[t.ownership]}.`,
    `Revenue in the ${t.sizeBand} band.`,
    t.channels.length ? `Channel mix: ${t.channels.map((c) => `${CHANNELS[c.channel].toLowerCase()} ${c.share}%`).join(", ")}.` : null,
    t.regions.length ? `Regions: ${t.regions.map((r) => REGIONS[r]).join(", ")}.` : null,
  ].filter(Boolean);
  L.push(bits.join(" "), "");

  L.push("### Why it fits");
  L.push(`**Fit ${fit.score}, ${fit.band}.** ${fit.why}`);
  if (fit.fills.length) L.push(`- Fills portfolio gaps: ${fit.fills.join(", ")}.`);
  if (t.categories.length) L.push(`- Category: ${t.categories.map((c) => CATEGORIES[c]).join(", ")}.`);
  if (t.rationale) L.push(`- Rationale on file: ${t.rationale}`);
  L.push("");

  L.push("### What the founder cares about");
  if (f.priorities.length) L.push(`In order: ${f.priorities.map((p) => `${PRIORITY_LABELS[p.priority].toLowerCase()} (${p.note.replace(/\.$/, "")})`).join("; ")}.`);
  else L.push(`Not yet known. Learning what matters to ${f.name || "the founder"} is the first job.`);
  const concerns = f.concerns.filter((c) => !/^unknown/i.test(c));
  if (concerns.length) L.push(`Concerns: ${concerns.join(" ")}`);
  L.push("");

  L.push("### Key risks");
  if (t.risks.length) t.risks.forEach((r) => L.push(`- **${r.severity[0].toUpperCase() + r.severity.slice(1)}:** ${r.label}.`));
  else L.push("- None recorded yet.");
  L.push("");

  L.push("### What we don't know yet");
  const missing: string[] = [];
  const unassessed = (Object.entries(t.fit) as [string, number | null][]).filter(([, v]) => v == null).length;
  if (unassessed) missing.push(`${unassessed} fit criteria not yet assessed. Corporate Development.`);
  if (!f.priorities.length) missing.push("What matters to the founder in a deal. Corporate Development, in conversation.");
  if (t.touchpoints.length === 0) missing.push("Any direct contact: no touchpoints logged.");
  missing.push("Financials beyond the revenue band. Finance, under NDA when appropriate.");
  missing.push("The founder's expectations on structure and value. Finance, when the relationship is ready.");
  if (t.risks.some((r) => /contract|lease|legal|regulat|consent|patent/i.test(r.label)))
    missing.push("The legal position on the contract and consent risks above. Legal.");
  missing.forEach((m) => L.push(`- ${m}`));
  L.push("");

  L.push("### Recommended next step");
  const idea = reach[0]?.reason;
  L.push(
    idea
      ? `Corporate Development: ${idea}${health.nextTouch ? ` Next touch due ${health.nextTouch}.` : ""}`
      : `Corporate Development to agree the next step for this ${stageLabel(t).toLowerCase()} relationship.`,
  );
  return L.join("\n");
}

export function getBrief(t: Target, fit: FitResult, health: Health, reach: ReachOut[]): Brief {
  const assembled = assembleBrief(t, fit, health, reach);
  const sample = !t.custom ? SAMPLE_BRIEFS[t.id] : undefined;
  if (!sample) return { kind: "assembled", markdown: assembled, assembled };
  return { kind: t.edited ? "stale" : "sample", markdown: sample, assembled };
}
