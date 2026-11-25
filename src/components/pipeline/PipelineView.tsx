"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "@/components/store";
import { targetHref, useInsights, type Insight } from "@/components/useInsights";
import { Card, FitScore, HealthChip, HealthDot, SectionTitle, Skeleton, buttonPrimary, relative, stageLabel } from "@/components/ui";
import { HEALTH_LABELS, type HealthStatus } from "@/lib/health/health";
import { CATEGORIES, SIZE_BANDS, STAGES, type Stage } from "@/lib/model";

const VIEW_KEY = "longgame:pipelineView";
const OWNERSHIP: Record<string, string> = { "founder-led": "Founder-led", "family-owned": "Family-owned", "pe-backed": "PE-backed" };
const DEAL: Record<string, string> = { platform: "Platform", "add-on": "Add-on" };
const SOURCE: Record<string, string> = { referral: "Referral", "direct-outreach": "Direct outreach", event: "Event", intermediary: "Intermediary" };
export const labels = { OWNERSHIP, DEAL, SOURCE };

export function PipelineView() {
  const { ready } = useStore();
  const insights = useInsights();
  const [view, setView] = useState<"board" | "table">("board");

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restore the saved view after mount
      if (localStorage.getItem(VIEW_KEY) === "table") setView("table");
    } catch {}
  }, []);
  const choose = (v: "board" | "table") => {
    setView(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {}
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
          <p className="mt-1 text-sm text-muted">Founder relationships by stage. The relationship comes first; the deal is the outcome.</p>
        </div>
        <div role="group" aria-label="View" className="ml-auto inline-flex rounded-lg border border-line bg-surface p-0.5 text-sm">
          {(["board", "table"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => choose(v)}
              className={`rounded-md px-3 py-1.5 capitalize ${view === v ? "bg-surface-2 font-medium text-ink" : "text-muted hover:text-ink"}`}
            >
              {v}
            </button>
          ))}
        </div>
        <Link href="/edit" className={buttonPrimary}>+ Add a company</Link>
      </div>

      {!ready ? (
        <div className="mt-6 space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-72" />
        </div>
      ) : (
        <>
          <NeedsAttention insights={insights} />
          {view === "board" ? <Board insights={insights} /> : <Table insights={insights} />}
        </>
      )}
    </div>
  );
}

export function NeedsAttention({ insights, compact = false }: { insights: Insight[]; compact?: boolean }) {
  const rows = insights
    .filter((i) => ["gone-quiet", "overdue"].includes(i.health.status))
    .sort((a, b) => (b.health.daysSince ?? 0) - (a.health.daysSince ?? 0));
  if (rows.length === 0) return null;
  return (
    <Card className={`${compact ? "" : "mt-6"} p-4`} data-story="attention">
      <SectionTitle>Needs attention</SectionTitle>
      <ul className="mt-3 divide-y divide-line">
        {rows.map((i) => (
          <li key={i.target.id} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:w-80">
              <HealthChip status={i.health.status} label={i.health.label} />
              <Link href={targetHref(i.target.id)} className="truncate font-medium hover:underline">
                {i.target.name}
              </Link>
            </div>
            <p className="min-w-0 flex-1 text-sm text-muted">
              <span className="text-ink">{i.health.daysSince} days</span> since {i.target.founder.name.split(" ")[0]}
              &apos;s last touch.{" "}
              {i.reach[0] && <span>Reason to reach out: {i.reach[0].reason}</span>}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Board({ insights }: { insights: Insight[] }) {
  const [showPassed, setShowPassed] = useState(false);
  return (
    <div className="mt-6 -mx-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6">
      <div className="flex gap-3">
        {STAGES.map((s) => {
          const items = insights.filter((i) => i.target.stage === s.id).sort((a, b) => b.fit.score - a.fit.score);
          const collapsed = s.id === "passed" && !showPassed;
          return (
            <section key={s.id} aria-label={`${s.label}: ${items.length}`} className={`${collapsed ? "w-40" : "w-64"} shrink-0`}>
              <div className="mb-2 flex items-center justify-between px-1">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">{s.label}</h2>
                <span className="text-xs tabular-nums text-faint">{items.length}</span>
              </div>
              <div className="space-y-2 rounded-xl bg-surface-2/60 p-2">
                {collapsed ? (
                  <button type="button" onClick={() => setShowPassed(true)} className="w-full rounded-lg px-2 py-3 text-left text-xs text-muted hover:text-ink">
                    Show {items.length} passed
                  </button>
                ) : items.length === 0 ? (
                  <p className="px-2 py-3 text-xs text-faint">None</p>
                ) : (
                  items.map((i) => <TargetCard key={i.target.id} i={i} />)
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TargetCard({ i }: { i: Insight }) {
  const t = i.target;
  return (
    <Link
      href={targetHref(t.id)}
      data-story={t.id === "emberline" ? "hero-card" : undefined}
      className="block rounded-lg border border-line bg-surface p-3 shadow-sm transition hover:border-line-strong hover:shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium leading-snug">{t.name}</span>
        <HealthDot status={i.health.status} label={`Relationship health: ${i.health.label}`} />
      </div>
      <p className="mt-0.5 text-xs text-muted">{t.founder.name}</p>
      <p className="mt-2 text-xs text-muted">
        {CATEGORIES[t.categories[0]]} · {t.sizeBand}
      </p>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span>
          Fit <FitScore score={i.fit.score} />
        </span>
        <span className="text-faint">{i.health.daysSince != null ? relative(i.health.daysSince) : "No contact"}</span>
      </div>
    </Link>
  );
}

type SortKey = "name" | "stage" | "fit" | "health" | "last" | "size" | "ownership" | "deal" | "source";
type Sort = { key: SortKey; dir: 1 | -1 };

function Th({ k, sort, onSort, children }: { k: SortKey; sort: Sort; onSort: (k: SortKey) => void; children: React.ReactNode }) {
  return (
    <th scope="col" aria-sort={sort.key === k ? (sort.dir === 1 ? "ascending" : "descending") : "none"} className="px-3 py-2 font-medium">
      <button type="button" className="inline-flex items-center gap-1 hover:text-ink" onClick={() => onSort(k)}>
        {children}
        <span aria-hidden className="text-faint">{sort.key === k ? (sort.dir === 1 ? "▲" : "▼") : ""}</span>
      </button>
    </th>
  );
}
const HEALTH_ORDER: HealthStatus[] = ["gone-quiet", "overdue", "due-soon", "no-contact", "healthy", "not-tracked"];

function Table({ insights }: { insights: Insight[] }) {
  const [sort, setSort] = useState<Sort>({ key: "fit", dir: -1 });
  const onSort = (k: SortKey) => setSort((s) => ({ key: k, dir: s.key === k ? ((-s.dir) as 1 | -1) : k === "fit" ? -1 : 1 }));
  const [stage, setStage] = useState<Stage | "">("");
  const [health, setHealth] = useState<HealthStatus | "">("");
  const [ownership, setOwnership] = useState("");
  const [deal, setDeal] = useState("");

  const rows = useMemo(() => {
    const val = (i: Insight): string | number => {
      const t = i.target;
      switch (sort.key) {
        case "name": return t.name;
        case "stage": return STAGES.findIndex((s) => s.id === t.stage);
        case "fit": return i.fit.score;
        case "health": return HEALTH_ORDER.indexOf(i.health.status);
        case "last": return i.health.daysSince ?? 99999;
        case "size": return SIZE_BANDS.indexOf(t.sizeBand);
        case "ownership": return t.ownership;
        case "deal": return t.dealType;
        case "source": return t.source;
      }
    };
    return insights
      .filter((i) => (!stage || i.target.stage === stage) && (!health || i.health.status === health))
      .filter((i) => (!ownership || i.target.ownership === ownership) && (!deal || i.target.dealType === deal))
      .sort((a, b) => {
        const x = val(a), y = val(b);
        return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * sort.dir;
      });
  }, [insights, sort, stage, health, ownership, deal]);

  const select = "rounded-lg border border-line bg-surface px-2 py-1.5 text-sm";

  return (
    <div className="mt-6">
      <div className="mb-3 flex flex-wrap gap-2">
        <label className="sr-only" htmlFor="f-stage">Stage</label>
        <select id="f-stage" className={select} value={stage} onChange={(e) => setStage(e.target.value as Stage | "")}>
          <option value="">All stages</option>
          {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-health">Health</label>
        <select id="f-health" className={select} value={health} onChange={(e) => setHealth(e.target.value as HealthStatus | "")}>
          <option value="">Any health</option>
          {HEALTH_ORDER.map((h) => <option key={h} value={h}>{HEALTH_LABELS[h]}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-own">Ownership</label>
        <select id="f-own" className={select} value={ownership} onChange={(e) => setOwnership(e.target.value)}>
          <option value="">Any ownership</option>
          {Object.entries(OWNERSHIP).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="sr-only" htmlFor="f-deal">Deal type</label>
        <select id="f-deal" className={select} value={deal} onChange={(e) => setDeal(e.target.value)}>
          <option value="">Any deal type</option>
          {Object.entries(DEAL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left text-sm">
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <Th k="name" sort={sort} onSort={onSort}>Name</Th><Th k="stage" sort={sort} onSort={onSort}>Stage</Th><Th k="fit" sort={sort} onSort={onSort}>Fit</Th><Th k="health" sort={sort} onSort={onSort}>Health</Th><Th k="last" sort={sort} onSort={onSort}>Last touch</Th>
              <Th k="size" sort={sort} onSort={onSort}>Size</Th><Th k="ownership" sort={sort} onSort={onSort}>Ownership</Th><Th k="deal" sort={sort} onSort={onSort}>Deal</Th><Th k="source" sort={sort} onSort={onSort}>Source</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((i) => (
              <tr key={i.target.id} className="hover:bg-surface-2/60">
                <td className="px-3 py-2.5">
                  <Link href={targetHref(i.target.id)} className="font-medium hover:underline">{i.target.name}</Link>
                  <div className="text-xs text-muted">{i.target.founder.name}</div>
                </td>
                <td className="px-3 py-2.5">{stageLabel(i.target.stage)}</td>
                <td className="px-3 py-2.5"><FitScore score={i.fit.score} /></td>
                <td className="px-3 py-2.5"><HealthChip status={i.health.status} label={i.health.label} /></td>
                <td className="px-3 py-2.5 text-muted">{i.health.daysSince != null ? relative(i.health.daysSince) : "—"}</td>
                <td className="px-3 py-2.5 text-muted">{i.target.sizeBand}</td>
                <td className="px-3 py-2.5 text-muted">{OWNERSHIP[i.target.ownership]}</td>
                <td className="px-3 py-2.5 text-muted">{DEAL[i.target.dealType]}</td>
                <td className="px-3 py-2.5 text-muted">{SOURCE[i.target.source]}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-muted">No targets match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
