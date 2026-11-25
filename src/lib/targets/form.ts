/**
 * Add / edit target form: the editable fields, conversion to and from a Target, and validation.
 * Pure functions, so they can be tested without a browser.
 */
import type {
  Category,
  Channel,
  DealType,
  KeyDate,
  Ownership,
  Priority,
  Region,
  RiskFlag,
  SizeBand,
  Source,
  Stage,
  Target,
} from "@/lib/model";

export type TargetForm = {
  name: string;
  oneLiner: string;
  hq: string;
  founded: string;
  sizeBand: SizeBand;
  ownership: Ownership;
  dealType: DealType;
  source: Source;
  stage: Stage;
  categories: Category[];
  regions: Region[];
  channels: Channel[];
  rationale: string;
  founderName: string;
  founderRole: string;
  communication: string;
  founderNotes: string;
  priorities: { priority: Priority; note: string }[];
  /** One per line. */
  concerns: string;
  keyDates: KeyDate[];
  risks: RiskFlag[];
};

export const MAX_PRIORITIES = 3;

export function emptyForm(): TargetForm {
  return {
    name: "",
    oneLiner: "",
    hq: "",
    founded: "",
    sizeBand: "Under $5M",
    ownership: "founder-led",
    dealType: "add-on",
    source: "direct-outreach",
    stage: "identified",
    categories: [],
    regions: [],
    channels: [],
    rationale: "",
    founderName: "",
    founderRole: "Founder",
    communication: "",
    founderNotes: "",
    priorities: [],
    concerns: "",
    keyDates: [],
    risks: [],
  };
}

export function formFromTarget(t: Target): TargetForm {
  return {
    name: t.name,
    oneLiner: t.oneLiner,
    hq: t.hq,
    founded: t.founded ? String(t.founded) : "",
    sizeBand: t.sizeBand,
    ownership: t.ownership,
    dealType: t.dealType,
    source: t.source,
    stage: t.stage,
    categories: [...t.categories],
    regions: [...t.regions],
    channels: t.channels.map((c) => c.channel),
    rationale: t.rationale,
    founderName: t.founder.name,
    founderRole: t.founder.role,
    communication: t.founder.communication,
    founderNotes: t.founder.notes,
    priorities: t.founder.priorities.map((p) => ({ ...p })),
    concerns: t.founder.concerns.join("\n"),
    keyDates: t.founder.keyDates.map((k) => ({ ...k })),
    risks: t.risks.map((r) => ({ ...r })),
  };
}

export type FormErrors = Partial<Record<"name" | "founderName" | "categories" | "regions" | "founded" | "keyDates" | "risks", string>>;

export function validateForm(f: TargetForm, thisYear: number): FormErrors {
  const e: FormErrors = {};
  if (!f.name.trim()) e.name = "Add the company name.";
  if (!f.founderName.trim()) e.founderName = "Add the founder's name.";
  if (f.categories.length === 0) e.categories = "Pick at least one category.";
  if (f.regions.length === 0) e.regions = "Pick at least one region.";
  if (f.founded.trim()) {
    const y = Number(f.founded);
    if (!Number.isInteger(y) || y < 1800 || y > thisYear) e.founded = `Use a year between 1800 and ${thisYear}.`;
  }
  if (f.keyDates.some((k) => !k.date || !k.label.trim())) e.keyDates = "Each key date needs a date and a label.";
  if (f.risks.some((r) => !r.label.trim())) e.risks = "Each risk needs a description.";
  return e;
}

/** A url-safe id from the company name, unique among existing ids. */
export function makeId(name: string, existing: Iterable<string>): string {
  const taken = new Set(existing);
  const base =
    name
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "target";
  if (!taken.has(base)) return base;
  for (let n = 2; ; n++) if (!taken.has(`${base}-${n}`)) return `${base}-${n}`;
}

/** Splits 100% evenly across channels, keeping existing shares if the channel set hasn't changed. */
function channelShares(channels: Channel[], previous?: Target["channels"]): Target["channels"] {
  if (previous && previous.length === channels.length && previous.every((p) => channels.includes(p.channel))) {
    return previous.map((p) => ({ ...p }));
  }
  if (channels.length === 0) return [];
  const each = Math.floor(100 / channels.length);
  return channels.map((channel, i) => ({ channel, share: i === 0 ? 100 - each * (channels.length - 1) : each }));
}

const trimLines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

/**
 * Builds a Target from the form. With `base`, edits that target and keeps everything the form doesn't cover
 * (touchpoints, fit ratings, notes); without it, creates a new custom target.
 */
export function targetFromForm(f: TargetForm, opts: { id: string; base?: Target }): Target {
  const { id, base } = opts;
  const founded = Number(f.founded);
  return {
    ...(base ?? {
      touchpoints: [],
      fit: {
        categoryFit: null,
        brandStrength: null,
        communityAlignment: null,
        leadershipFit: null,
        integrationEase: null,
        growthPotential: null,
      },
      fitNotes: {},
      reachOutIdeas: [],
      custom: true,
    }),
    id,
    name: f.name.trim(),
    oneLiner: f.oneLiner.trim(),
    hq: f.hq.trim(),
    founded: Number.isInteger(founded) && founded > 0 ? founded : 0,
    sizeBand: f.sizeBand,
    ownership: f.ownership,
    dealType: f.dealType,
    source: f.source,
    stage: f.stage,
    categories: [...f.categories],
    regions: [...f.regions],
    channels: channelShares(f.channels, base?.channels),
    rationale: f.rationale.trim(),
    founder: {
      ...(base?.founder ?? { background: "", built: "" }),
      name: f.founderName.trim(),
      role: f.founderRole.trim() || "Founder",
      communication: f.communication.trim(),
      notes: f.founderNotes.trim(),
      priorities: f.priorities.slice(0, MAX_PRIORITIES).map((p) => ({ priority: p.priority, note: p.note.trim() })),
      concerns: trimLines(f.concerns),
      keyDates: f.keyDates.map((k) => ({ date: k.date, label: k.label.trim() })).sort((a, b) => a.date.localeCompare(b.date)),
    },
    risks: f.risks.map((r) => ({ label: r.label.trim(), severity: r.severity })),
    ...(base ? { edited: true } : {}),
  };
}
