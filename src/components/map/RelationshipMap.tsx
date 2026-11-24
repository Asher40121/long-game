"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "@/components/store";
import { targetHref, type Insight } from "@/components/useInsights";
import { TOUCH_TYPES } from "@/components/target/RelationshipTab";
import { FitScore, HealthDot, formatDate, relative, stageLabel } from "@/components/ui";
import { addDays, daysBetween } from "@/lib/health/health";

type SortKey = "length" | "last" | "fit";
const QUIET_GAP = 60;
/** Days shown after today, so upcoming founder key dates are visible. */
const FUTURE_DAYS = 150;
const MIN_SPAN_DAYS = 365 * 3;

export type MapRow = {
  insight: Insight;
  first: string | null;
  last: string | null;
  spanDays: number;
  /** The current silence since the last touch, if it's 60+ days on a tracked relationship. */
  silence: { from: string; to: string } | null;
};

/** Builds the rows the map draws. Pure, so it can be tested. */
export function buildRows(insights: Insight[], today: string): MapRow[] {
  return insights.map((insight) => {
    const dates = insight.target.touchpoints.map((t) => t.date).filter((d) => d <= today).sort();
    const first = dates[0] ?? null;
    const last = dates.at(-1) ?? null;
    const tracked = !["identified", "researching", "passed"].includes(insight.target.stage);
    const silence = last && tracked && daysBetween(last, today) >= QUIET_GAP ? { from: last, to: today } : null;
    return { insight, first, last, spanDays: first ? daysBetween(first, today) : 0, silence };
  });
}

export function RelationshipMap({ insights, limit, compact = false }: { insights: Insight[]; limit?: number; compact?: boolean }) {
  const { today } = useStore();
  const [sort, setSort] = useState<SortKey>("length");
  const [showPassed, setShowPassed] = useState(false);

  const scroller = useRef<HTMLDivElement>(null);
  // On narrow screens, start scrolled to today so recent activity (and silences) are visible first.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);
  const allRows = useMemo(() => buildRows(insights, today), [insights, today]);
  const passedCount = allRows.filter((r) => r.insight.target.stage === "passed").length;
  const rows = useMemo(() => {
    const r = allRows.filter((x) => showPassed || x.insight.target.stage !== "passed");
    r.sort((a, b) =>
      sort === "length" ? b.spanDays - a.spanDays : sort === "fit" ? b.insight.fit.score - a.insight.fit.score : (b.last ?? "").localeCompare(a.last ?? ""),
    );
    return limit ? r.slice(0, limit) : r;
  }, [allRows, showPassed, sort, limit]);

  const earliest = allRows.reduce((m, r) => (r.first && r.first < m ? r.first : m), today);
  const start = daysBetween(earliest, today) > MIN_SPAN_DAYS ? addDays(earliest, -30) : addDays(today, -MIN_SPAN_DAYS);
  const end = addDays(today, FUTURE_DAYS);
  const total = daysBetween(start, end);
  const pct = (d: string) => (Math.min(Math.max(daysBetween(start, d), 0), total) / total) * 100;
  const x = (d: string) => `${pct(d)}%`;
  const years: string[] = [];
  for (let y = +start.slice(0, 4) + 1; y <= +end.slice(0, 4); y++) years.push(`${y}-01-01`);
  // Hide year labels that would collide with the "Today" label.
  const yearLabels = years.filter((y) => Math.abs(pct(y) - pct(today)) > 5);

  return (
    <div data-story="map">
      {!compact && (
        <div className="mb-3 flex flex-wrap items-center gap-3 text-sm">
          <label className="flex items-center gap-2">
            <span className="text-muted">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border border-line bg-surface px-2 py-1.5">
              <option value="length">Relationship length</option>
              <option value="last">Most recent touch</option>
              <option value="fit">Fit score</option>
            </select>
          </label>
          {passedCount > 0 && (
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" checked={showPassed} onChange={(e) => setShowPassed(e.target.checked)} className="accent-[var(--accent)]" />
              Show passed ({passedCount})
            </label>
          )}
          <Legend />
        </div>
      )}

      <div ref={scroller} className="overflow-x-auto rounded-xl border border-line bg-surface">
        <div className="min-w-[680px]">
          {/* Year axis */}
          <div className="flex border-b border-line text-xs text-faint">
            <div className="sticky left-0 z-10 w-40 shrink-0 bg-surface px-3 py-2 sm:w-64 sm:px-4">Founder · company</div>
            <div className="relative mx-4 flex-1">
              {yearLabels.map((y) => (
                <span key={y} className="absolute top-2 -translate-x-1/2 tabular-nums" style={{ left: x(y) }}>{y.slice(0, 4)}</span>
              ))}
              <span className="absolute top-2 -translate-x-1/2 font-semibold text-accent" style={{ left: x(today) }}>Today</span>
            </div>
          </div>

          <ul>
            {rows.map((r) => (
              <Row key={r.insight.target.id} row={r} x={x} years={years} today={today} end={end} compact={compact} />
            ))}
          </ul>
        </div>
      </div>
      {compact && <Legend className="mt-3" />}
    </div>
  );
}

function Row({
  row,
  x,
  years,
  today,
  end,
  compact,
}: {
  row: MapRow;
  x: (d: string) => string;
  years: string[];
  today: string;
  end: string;
  compact: boolean;
}) {
  const { insight, first, silence, spanDays } = row;
  const t = insight.target;
  const passed = t.stage === "passed";
  const upcoming = t.founder.keyDates.filter((k) => k.date > today && k.date <= end);
  const summary = `${t.name}, ${t.founder.name}. ${t.touchpoints.length} touchpoints${first ? ` over ${relative(spanDays).replace(" ago", "")}` : ""}. ${insight.health.label}.`;

  return (
    <li className={`group flex border-b border-line last:border-0 ${passed ? "opacity-55" : ""}`}>
      <Link
        href={targetHref(t.id)}
        aria-label={summary}
        className="sticky left-0 z-10 flex w-40 shrink-0 items-center gap-2 bg-surface px-3 py-2.5 group-hover:bg-surface-2 sm:w-64 sm:gap-2.5 sm:px-4"
      >
        <HealthDot status={insight.health.status} label={insight.health.label} />
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium">{t.founder.name}</span>
          <span className="block truncate text-xs text-muted">
            {t.name} · {stageLabel(t.stage)}
          </span>
        </span>
        {!compact && <span className="ml-auto hidden pl-1 sm:inline"><FitScore score={insight.fit.score} /></span>}
      </Link>

      <div className="relative flex-1 group-hover:bg-surface-2/50" aria-hidden>
       <div className="absolute inset-y-0 left-4 right-4">
        {years.map((y) => <span key={y} className="absolute inset-y-0 w-px bg-line" style={{ left: x(y) }} />)}
        <span className="absolute inset-y-0 w-px bg-accent/50" style={{ left: x(today) }} />

        {/* The relationship's span */}
        {first && (
          <span
            className="absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full bg-accent/25"
            style={{ left: x(first), width: `calc(${x(today)} - ${x(first)})` }}
          />
        )}
        {/* The current silence */}
        {silence && (
          <span
            title={`${daysBetween(silence.from, silence.to)} days without contact`}
            className={`absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full ${insight.health.status === "gone-quiet" ? "bg-bad/60" : "bg-warn/50"}`}
            style={{ left: x(silence.from), width: `calc(${x(silence.to)} - ${x(silence.from)})` }}
          />
        )}
        {/* Touchpoints */}
        {t.touchpoints.filter((tp) => tp.date <= today).map((tp) => (
          <span
            key={tp.id}
            title={`${formatDate(tp.date)} · ${TOUCH_TYPES[tp.type].label}: ${tp.summary}`}
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-surface bg-accent"
            style={{ left: x(tp.date) }}
          />
        ))}
        {/* Upcoming founder key dates */}
        {upcoming.map((k) => (
          <span
            key={k.label}
            title={`${formatDate(k.date)} · ${k.label}`}
            className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-[1.5px] border-accent bg-surface"
            style={{ left: x(k.date) }}
          />
        ))}
       </div>
      </div>
    </li>
  );
}

function Legend({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted sm:ml-auto ${className}`}>
      <li className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-full bg-accent" /> Touchpoint</li>
      <li className="flex items-center gap-1.5"><span aria-hidden className="size-2.5 rotate-45 border-[1.5px] border-accent" /> Upcoming key date</li>
      <li className="flex items-center gap-1.5"><span aria-hidden className="h-1.5 w-5 rounded-full bg-bad/60" /> Gone quiet (60+ days)</li>
    </ul>
  );
}
