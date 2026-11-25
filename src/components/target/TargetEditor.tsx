"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/components/store";
import { targetHref } from "@/components/useInsights";
import { Card, SectionTitle, Skeleton, buttonPrimary, buttonSecondary } from "@/components/ui";
import {
  CATEGORIES,
  CHANNELS,
  PRIORITY_LABELS,
  REGIONS,
  SIZE_BANDS,
  STAGES,
  type Priority,
  type RiskFlag,
  type Target,
} from "@/lib/model";
import { MAX_PRIORITIES, emptyForm, formFromTarget, makeId, targetFromForm, validateForm, type FormErrors, type TargetForm } from "@/lib/targets/form";

const field = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm";
const OWNERSHIP = { "founder-led": "Founder-led", "family-owned": "Family-owned", "pe-backed": "PE-backed" } as const;
const DEAL_TYPES = { "add-on": "Add-on", platform: "Platform" } as const;
const SOURCES = { "direct-outreach": "Direct outreach", referral: "Referral", event: "Event", intermediary: "Intermediary" } as const;

/** Add a new target (no ?id=) or edit an existing one (?id=...). */
export function TargetEditor() {
  const params = useSearchParams();
  const { ready, target } = useStore();
  const id = params.get("id");

  if (!ready) return <Skeleton className="h-96" />;
  const existing = id ? target(id) : undefined;
  if (id && !existing) {
    return (
      <Card className="p-8 text-center">
        <h1 className="text-lg font-semibold">Target not found</h1>
        <Link href="/pipeline" className="mt-4 inline-block text-sm text-accent hover:underline">← Back to the pipeline</Link>
      </Card>
    );
  }
  // Keyed so the form resets if the visitor switches between targets.
  return <EditorForm key={existing?.id ?? "new"} existing={existing} />;
}

function EditorForm({ existing }: { existing?: Target }) {
  const router = useRouter();
  const { state, today, addTarget, updateTarget, removeTarget } = useStore();
  const [f, setF] = useState<TargetForm>(() => (existing ? formFromTarget(existing) : emptyForm()));
  const [errors, setErrors] = useState<FormErrors>({});
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = <K extends keyof TargetForm>(k: K, v: TargetForm[K]) => setF((x) => ({ ...x, [k]: v }));
  const toggle = <T extends string>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const cancelHref = existing ? targetHref(existing.id) : "/pipeline";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateForm(f, +today.slice(0, 4));
    setErrors(errs);
    if (Object.keys(errs).length) {
      document.querySelector<HTMLElement>("[data-error]")?.scrollIntoView({ block: "center" });
      return;
    }
    if (existing) {
      updateTarget(existing.id, targetFromForm(f, { id: existing.id, base: existing }));
      router.push(targetHref(existing.id));
    } else {
      const id = makeId(f.name, state.targets.map((t) => t.id));
      addTarget(targetFromForm(f, { id }));
      router.push(targetHref(id));
    }
  };

  return (
    <form onSubmit={submit} noValidate className="mx-auto max-w-3xl space-y-5">
      <div>
        <Link href={cancelHref} className="text-sm text-muted hover:text-ink">← {existing ? existing.name : "Pipeline"}</Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">{existing ? `Edit ${existing.name}` : "Add a company"}</h1>
        <p className="mt-1 text-sm text-muted">
          {existing
            ? "Changes are saved in this browser only."
            : "Add a founder you're getting to know. Only the company, founder, a category and a region are required; fill in the rest as you learn it. Saved in this browser only."}
        </p>
        {existing && !existing.custom && (
          <p className="mt-2 rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">
            This is a sample company. After you edit it, its sample decision brief is marked out of date.
          </p>
        )}
      </div>

      <Card className="space-y-4 p-5">
        <SectionTitle>The company</SectionTitle>
        <Text label="Company name" required value={f.name} onChange={(v) => set("name", v)} error={errors.name} />
        <Text label="One-line description" value={f.oneLiner} onChange={(v) => set("oneLiner", v)} placeholder="What they make and who buys it." />
        <div className="grid gap-4 sm:grid-cols-3">
          <Text label="Headquarters" value={f.hq} onChange={(v) => set("hq", v)} placeholder="City, state or country" />
          <Text label="Year founded" value={f.founded} onChange={(v) => set("founded", v)} inputMode="numeric" error={errors.founded} />
          <Select label="Revenue band" value={f.sizeBand} onChange={(v) => set("sizeBand", v)} options={Object.fromEntries(SIZE_BANDS.map((s) => [s, s]))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <Select label="Stage" value={f.stage} onChange={(v) => set("stage", v)} options={Object.fromEntries(STAGES.map((s) => [s.id, s.label]))} />
          <Select label="Ownership" value={f.ownership} onChange={(v) => set("ownership", v)} options={OWNERSHIP} />
          <Select label="Deal type" value={f.dealType} onChange={(v) => set("dealType", v)} options={DEAL_TYPES} />
          <Select label="Source" value={f.source} onChange={(v) => set("source", v)} options={SOURCES} />
        </div>
        <Checks legend="Categories" required options={CATEGORIES} values={f.categories} onToggle={(v) => set("categories", toggle(f.categories, v))} error={errors.categories} />
        <Checks legend="Regions" required options={REGIONS} values={f.regions} onToggle={(v) => set("regions", toggle(f.regions, v))} error={errors.regions} />
        <Checks
          legend="Sales channels"
          hint="Used to spot portfolio gaps. New companies get an even split; refine it later."
          options={CHANNELS}
          values={f.channels}
          onToggle={(v) => set("channels", toggle(f.channels, v))}
        />
        <Area label="Why it could fit" value={f.rationale} onChange={(v) => set("rationale", v)} placeholder="The strategic reason this company is worth knowing." />
      </Card>

      <Card className="space-y-4 p-5">
        <SectionTitle>The founder</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Name" required value={f.founderName} onChange={(v) => set("founderName", v)} error={errors.founderName} />
          <Text label="Role" value={f.founderRole} onChange={(v) => set("founderRole", v)} />
        </div>
        <Priorities value={f.priorities} onChange={(v) => set("priorities", v)} />
        <Area label="Concerns" hint="One per line." value={f.concerns} onChange={(v) => set("concerns", v)} placeholder="What worries them about selling." />
        <Text label="How they like to communicate" value={f.communication} onChange={(v) => set("communication", v)} placeholder="Phone or email, pace, what they enjoy talking about." />
        <KeyDates value={f.keyDates} onChange={(v) => set("keyDates", v)} error={errors.keyDates} />
        <Area label="Notes" value={f.founderNotes} onChange={(v) => set("founderNotes", v)} />
      </Card>

      <Card className="space-y-4 p-5">
        <SectionTitle>Risks</SectionTitle>
        <p className="text-sm text-muted">Each risk lowers the fit score: high 5, medium 2, low 1. Rate the fit criteria on the Fit scorecard tab after saving.</p>
        <Risks value={f.risks} onChange={(v) => set("risks", v)} error={errors.risks} />
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {existing?.custom &&
          (confirmDelete ? (
            <span className="flex flex-wrap items-center gap-2 text-sm">
              Delete {existing.name} and its timeline?
              <button
                type="button"
                className={`${buttonSecondary} border-bad text-bad`}
                onClick={() => {
                  removeTarget(existing.id);
                  router.push("/pipeline");
                }}
              >
                Yes, delete
              </button>
              <button type="button" className={buttonSecondary} onClick={() => setConfirmDelete(false)}>Keep it</button>
            </span>
          ) : (
            <button type="button" className="text-sm text-bad hover:underline" onClick={() => setConfirmDelete(true)}>Delete company</button>
          ))}
        <Link href={cancelHref} className={`${buttonSecondary} ml-auto`}>Cancel</Link>
        <button type="submit" className={buttonPrimary}>{existing ? "Save changes" : "Add company"}</button>
      </div>
    </form>
  );
}

function Label({ text, required, hint }: { text: string; required?: boolean; hint?: string }) {
  return (
    <span className="mb-1 block text-xs font-medium text-muted">
      {text}
      {required && <span className="text-bad"> *</span>}
      {hint && <span className="font-normal text-faint"> · {hint}</span>}
    </span>
  );
}

function ErrorText({ children }: { children?: string }) {
  if (!children) return null;
  return <span data-error role="alert" className="mt-1 block text-xs text-bad">{children}</span>;
}

function Text({
  label, value, onChange, required, error, placeholder, inputMode,
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; error?: string; placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label className="block text-sm">
      <Label text={label} required={required} />
      <input className={field} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} aria-invalid={!!error} />
      <ErrorText>{error}</ErrorText>
    </label>
  );
}

function Area({ label, value, onChange, placeholder, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string }) {
  return (
    <label className="block text-sm">
      <Label text={label} hint={hint} />
      <textarea className={field} rows={2} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  );
}

function Select<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: Record<string, string> }) {
  return (
    <label className="block text-sm">
      <Label text={label} />
      <select className={field} value={value} onChange={(e) => onChange(e.target.value as T)}>
        {Object.entries(options).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </label>
  );
}

function Checks<T extends string>({
  legend, options, values, onToggle, required, error, hint,
}: {
  legend: string; options: Record<T, string>; values: T[]; onToggle: (v: T) => void; required?: boolean; error?: string; hint?: string;
}) {
  return (
    <fieldset>
      <legend><Label text={legend} required={required} hint={hint} /></legend>
      <div className="flex flex-wrap gap-1.5">
        {(Object.entries(options) as [T, string][]).map(([k, v]) => {
          const on = values.includes(k);
          return (
            <label key={k} className={`cursor-pointer rounded-full border px-3 py-1 text-xs has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent ${on ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-line-strong"}`}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => onToggle(k)} />
              {v}
            </label>
          );
        })}
      </div>
      <ErrorText>{error}</ErrorText>
    </fieldset>
  );
}

function Priorities({ value, onChange }: { value: TargetForm["priorities"]; onChange: (v: TargetForm["priorities"]) => void }) {
  const unused = (Object.keys(PRIORITY_LABELS) as Priority[]).filter((p) => !value.some((v) => v.priority === p));
  return (
    <fieldset>
      <legend><Label text="What matters to them in a deal" hint={`most important first, up to ${MAX_PRIORITIES}`} /></legend>
      <ol className="space-y-2">
        {value.map((p, i) => (
          <li key={p.priority} className="flex flex-wrap items-center gap-2">
            <span className="w-28 text-sm font-medium">{i + 1}. {PRIORITY_LABELS[p.priority]}</span>
            <input
              className={`${field} min-w-0 flex-1`}
              aria-label={`Note for ${PRIORITY_LABELS[p.priority]}`}
              placeholder="In their words, if you can"
              value={p.note}
              onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))}
            />
            <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${PRIORITY_LABELS[p.priority]}`}>
              Remove
            </button>
          </li>
        ))}
      </ol>
      {value.length < MAX_PRIORITIES && (
        <div className={`flex flex-wrap gap-1.5 ${value.length ? "mt-2" : ""}`}>
          {unused.map((p) => (
            <button key={p} type="button" className="rounded-full border border-dashed border-line-strong px-3 py-1 text-xs text-muted hover:text-ink" onClick={() => onChange([...value, { priority: p, note: "" }])}>
              + {PRIORITY_LABELS[p]}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  );
}

function KeyDates({ value, onChange, error }: { value: TargetForm["keyDates"]; onChange: (v: TargetForm["keyDates"]) => void; error?: string }) {
  return (
    <fieldset>
      <legend><Label text="Key dates" hint="launches, trade shows, a scheduled call. Upcoming ones show on the map" /></legend>
      <ul className="space-y-2">
        {value.map((k, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2">
            <input type="date" aria-label="Date" className={`${field} w-auto`} value={k.date} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)))} />
            <input aria-label="What happens" placeholder="What happens" className={`${field} min-w-0 flex-1`} value={k.label} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => onChange(value.filter((_, j) => j !== i))}>Remove</button>
          </li>
        ))}
      </ul>
      <button type="button" className={`text-sm text-accent hover:underline ${value.length ? "mt-2" : ""}`} onClick={() => onChange([...value, { date: "", label: "" }])}>
        + Add a key date
      </button>
      <ErrorText>{error}</ErrorText>
    </fieldset>
  );
}

function Risks({ value, onChange, error }: { value: RiskFlag[]; onChange: (v: RiskFlag[]) => void; error?: string }) {
  return (
    <div>
      <ul className="space-y-2">
        {value.map((r, i) => (
          <li key={i} className="flex flex-wrap items-center gap-2">
            <select aria-label="Severity" className={`${field} w-auto`} value={r.severity} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, severity: e.target.value as RiskFlag["severity"] } : x)))}>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <input aria-label="Risk" placeholder="Describe the risk" className={`${field} min-w-0 flex-1`} value={r.label} onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
            <button type="button" className="text-xs text-muted hover:text-ink" onClick={() => onChange(value.filter((_, j) => j !== i))}>Remove</button>
          </li>
        ))}
      </ul>
      <button type="button" className={`text-sm text-accent hover:underline ${value.length ? "mt-2" : ""}`} onClick={() => onChange([...value, { label: "", severity: "medium" }])}>
        + Add a risk
      </button>
      <ErrorText>{error}</ErrorText>
    </div>
  );
}
