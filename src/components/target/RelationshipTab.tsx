"use client";

import { useState } from "react";
import { useStore } from "@/components/store";
import type { Insight } from "@/components/useInsights";
import { labels } from "@/components/pipeline/PipelineView";
import { Card, SectionTitle, buttonPrimary, buttonSecondary, formatDate, relative } from "@/components/ui";
import { daysBetween } from "@/lib/health/health";
import { CATEGORIES, CHANNELS, PRIORITY_LABELS, REGIONS, type TouchpointType } from "@/lib/model";

export const TOUCH_TYPES: Record<TouchpointType, { label: string; icon: string }> = {
  call: { label: "Call", icon: "☎" },
  meeting: { label: "Meeting", icon: "◆" },
  event: { label: "Event", icon: "★" },
  intro: { label: "Intro", icon: "⇄" },
  email: { label: "Email", icon: "✉" },
  "gift-note": { label: "Gift / note", icon: "✎" },
};

export function RelationshipTab({ insight }: { insight: Insight }) {
  const t = insight.target;
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <div className="space-y-4">
        <FounderCard insight={insight} />
        <BusinessCard insight={insight} />
      </div>
      <Timeline key={t.id} insight={insight} />
    </div>
  );
}

function FounderCard({ insight }: { insight: Insight }) {
  const { today } = useStore();
  const f = insight.target.founder;
  return (
    <Card className="p-5" data-story="founder">
      <SectionTitle>Founder</SectionTitle>
      <h3 className="mt-2 text-lg font-semibold">{f.name}</h3>
      <p className="text-sm text-muted">{f.role}</p>
      {f.background && <p className="mt-3 text-sm leading-relaxed">{f.background}</p>}
      {f.built && (
        <p className="mt-2 text-sm leading-relaxed">
          <span className="font-medium">What they built: </span>
          {f.built}
        </p>
      )}

      {f.priorities.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">What matters to them in a deal</h4>
          <ol className="mt-2 space-y-1.5">
            {f.priorities.map((p, i) => (
              <li key={p.priority} className="flex gap-3 text-sm">
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <span>
                  <span className="font-medium">{PRIORITY_LABELS[p.priority]}.</span> <span className="text-muted">{p.note}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {f.concerns.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Concerns</h4>
          <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm text-muted">
            {f.concerns.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </div>
      )}

      {f.communication && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Communication style</h4>
          <p className="mt-1 text-sm text-muted">{f.communication}</p>
        </div>
      )}

      {!f.priorities.length && !f.concerns.length && !f.communication && (
        <p className="mt-3 text-sm text-muted">Not much known yet. Use Edit to add what you learn about {f.name.split(" ")[0]}.</p>
      )}

      {f.keyDates.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Key dates</h4>
          <ul className="mt-1.5 space-y-1 text-sm">
            {f.keyDates.map((k, i) => {
              const d = daysBetween(today, k.date);
              return (
                <li key={`${k.date}-${i}`} className="flex justify-between gap-3">
                  <span className={d < 0 ? "text-muted" : ""}>{k.label}</span>
                  <span className="shrink-0 tabular-nums text-muted" title={formatDate(k.date)}>{relative(-d)}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {f.notes && (
        <div className="mt-4 rounded-lg bg-surface-2 p-3 text-sm leading-relaxed">
          <span className="font-medium">Notes: </span>
          {f.notes}
        </div>
      )}
    </Card>
  );
}

function BusinessCard({ insight }: { insight: Insight }) {
  const t = insight.target;
  const rows: [string, React.ReactNode][] = [
    ["Category", t.categories.map((c) => CATEGORIES[c]).join(", ")],
    ["Regions", t.regions.map((r) => REGIONS[r]).join(", ")],
    ["Size", `${t.sizeBand} revenue`],
    ["Ownership", labels.OWNERSHIP[t.ownership]],
    ["Deal type", labels.DEAL[t.dealType]],
    ["Source", labels.SOURCE[t.source]],
  ];
  return (
    <Card className="p-5">
      <SectionTitle>The business</SectionTitle>
      <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {t.channels.length > 0 && <div className="mt-4">
        <h4 className="text-sm font-semibold">Channel mix</h4>
        <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-surface-2" role="img" aria-label={t.channels.map((c) => `${CHANNELS[c.channel]} ${c.share}%`).join(", ")}>
          {t.channels.map((c, i) => (
            <span key={c.channel} style={{ width: `${c.share}%`, opacity: 1 - i * 0.2 }} className="h-full bg-accent first:rounded-l-full [&+span]:border-l-2 [&+span]:border-surface" />
          ))}
        </div>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
          {t.channels.map((c) => <li key={c.channel}>{CHANNELS[c.channel]} {c.share}%</li>)}
        </ul>
      </div>}
      {t.rationale && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold">Strategic rationale</h4>
          <p className="mt-1 text-sm leading-relaxed text-muted">{t.rationale}</p>
        </div>
      )}
    </Card>
  );
}

const ONE_YEAR = 365;

function Timeline({ insight }: { insight: Insight }) {
  const { today } = useStore();
  const t = insight.target;
  const [showAll, setShowAll] = useState(false);
  const [logging, setLogging] = useState(false);
  const first = t.touchpoints.at(-1);
  const span = first ? daysBetween(first.date, today) : 0;
  const recent = t.touchpoints.filter((tp) => daysBetween(tp.date, today) <= ONE_YEAR);
  const older = t.touchpoints.length - recent.length;
  const shown = showAll ? t.touchpoints : recent;

  return (
    <Card className="p-5" data-story="timeline">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <SectionTitle>Relationship timeline</SectionTitle>
          <p className="mt-1 text-sm text-muted">
            {t.touchpoints.length === 0
              ? "No touchpoints yet."
              : `${t.touchpoints.length} touchpoint${t.touchpoints.length === 1 ? "" : "s"} over ${relative(span).replace(" ago", "")}`}
          </p>
        </div>
        {!logging && (
          <button type="button" className={`${buttonSecondary} ml-auto`} onClick={() => setLogging(true)}>
            + Log a touchpoint
          </button>
        )}
      </div>

      {logging && <LogForm targetId={t.id} onDone={() => setLogging(false)} />}

      {t.touchpoints.length > 0 && (
        <ol className="relative mt-5 space-y-4 border-l border-line pl-6">
          {shown.map((tp, idx) => {
            const ago = daysBetween(tp.date, today);
            const prev = shown[idx + 1];
            const gap = prev ? daysBetween(prev.date, tp.date) : 0;
            return (
              <li key={tp.id} className="relative">
                <span aria-hidden className="absolute -left-[33px] top-0.5 inline-flex size-4.5 items-center justify-center rounded-full border border-line bg-surface text-[10px] text-accent">
                  {TOUCH_TYPES[tp.type].icon}
                </span>
                <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted">
                  <span className="font-medium text-ink">{TOUCH_TYPES[tp.type].label}</span>
                  <span>{formatDate(tp.date)}</span>
                  <span className="text-faint">· {relative(ago)}</span>
                </div>
                <p className="mt-0.5 text-sm leading-relaxed">{tp.summary}</p>
                {gap >= 60 && (
                  <p className="mt-2 text-xs text-faint">
                    <span aria-hidden>⋮ </span>
                    {gap} days before this
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      )}

      {older > 0 && (
        <button type="button" className="mt-4 text-sm text-accent hover:underline" onClick={() => setShowAll((s) => !s)}>
          {showAll ? "Show only the last year" : `Show ${older} earlier touchpoint${older === 1 ? "" : "s"} (over a year ago)`}
        </button>
      )}
    </Card>
  );
}

function LogForm({ targetId, onDone }: { targetId: string; onDone: () => void }) {
  const { today, addTouchpoint } = useStore();
  const [type, setType] = useState<TouchpointType>("call");
  const [date, setDate] = useState(today);
  const [summary, setSummary] = useState("");
  const field = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm";

  return (
    <form
      className="mt-4 space-y-3 rounded-lg border border-line bg-surface-2/50 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!summary.trim() || !date || date > today) return;
        addTouchpoint(targetId, { type, date, summary: summary.trim() });
        onDone();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Type</span>
          <select className={field} value={type} onChange={(e) => setType(e.target.value as TouchpointType)}>
            {Object.entries(TOUCH_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Date</span>
          <input type="date" className={field} value={date} max={today} onChange={(e) => setDate(e.target.value)} required />
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">What happened</span>
        <textarea className={field} rows={3} value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Plain language: what you talked about, what you learned, what's next." required />
      </label>
      <p className="text-xs text-muted">Saved only in this browser.</p>
      <div className="flex justify-end gap-2">
        <button type="button" className={buttonSecondary} onClick={onDone}>Cancel</button>
        <button type="submit" className={buttonPrimary}>Save touchpoint</button>
      </div>
    </form>
  );
}
