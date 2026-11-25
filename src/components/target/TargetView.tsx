"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "@/components/store";
import { useInsights, type Insight } from "@/components/useInsights";
import { Card, FitScore, HealthChip, SectionTitle, Skeleton, buttonSecondary, formatDate } from "@/components/ui";
import { FitTab } from "@/components/target/FitTab";
import { RelationshipTab } from "@/components/target/RelationshipTab";
import { BriefTab } from "@/components/target/BriefTab";
import { STAGES, type Stage } from "@/lib/model";

const TABS = [
  { id: "relationship", label: "Relationship" },
  { id: "fit", label: "Fit scorecard" },
  { id: "brief", label: "Decision brief" },
] as const;
type Tab = (typeof TABS)[number]["id"];

export function TargetView() {
  const params = useSearchParams();
  const router = useRouter();
  const { ready, setStage } = useStore();
  const insights = useInsights();
  const id = params.get("id") ?? "";
  const tab = (TABS.find((t) => t.id === params.get("tab"))?.id ?? "relationship") as Tab;
  const insight = insights.find((i) => i.target.id === id);

  if (!ready) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-72" />
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }
  if (!insight) {
    return (
      <Card className="p-8 text-center">
        <h1 className="text-lg font-semibold">Target not found</h1>
        <p className="mt-1 text-sm text-muted">It may have been removed when the demo data was reset.</p>
        <Link href="/pipeline" className="mt-4 inline-block text-sm text-accent hover:underline">← Back to the pipeline</Link>
      </Card>
    );
  }

  const t = insight.target;
  const go = (next: Tab) => router.replace(`/target?id=${encodeURIComponent(id)}${next === "relationship" ? "" : `&tab=${next}`}`, { scroll: false });

  return (
    <div>
      <Link href="/pipeline" className="text-sm text-muted hover:text-ink">← Pipeline</Link>
      <div className="mt-3 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t.name}
            {t.custom && <span className="ml-2 align-middle rounded-full bg-surface-2 px-2 py-0.5 text-xs font-medium text-muted">Added by you</span>}
          </h1>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">{t.oneLiner}</p>
          <p className="mt-1 text-xs text-faint">
            {[t.hq, t.founded ? `founded ${t.founded}` : ""].filter(Boolean).join(" · ")}
          </p>
        </div>
        <Link href={`/edit?id=${encodeURIComponent(t.id)}`} className={`${buttonSecondary} self-end`}>Edit</Link>
        <label className="text-sm">
          <span className="mb-1 block text-xs font-medium text-muted">Stage</span>
          <select
            value={t.stage}
            onChange={(e) => setStage(t.id, e.target.value as Stage)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm font-medium"
          >
            {STAGES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
      </div>
      {t.stageNote && <p className="mt-3 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{t.stageNote}</p>}

      <SummaryCards insight={insight} onOpenFit={() => go("fit")} />

      <div role="tablist" aria-label="Target sections" className="mt-6 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            id={`tab-${x.id}`}
            aria-selected={tab === x.id}
            aria-controls={`panel-${x.id}`}
            data-story={x.id === "brief" ? "brief-tab" : undefined}
            onClick={() => go(x.id)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm ${
              tab === x.id ? "border-accent font-medium text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-4">
        {tab === "relationship" && <RelationshipTab insight={insight} />}
        {tab === "fit" && <FitTab insight={insight} />}
        {tab === "brief" && <BriefTab insight={insight} />}
      </div>
    </div>
  );
}

function SummaryCards({ insight, onOpenFit }: { insight: Insight; onOpenFit: () => void }) {
  const { fit, health, reach } = insight;
  return (
    <div className="mt-5 grid gap-3 md:grid-cols-3">
      <Card className="p-4" data-story="fit-card">
        <div className="flex items-center justify-between">
          <SectionTitle>Strategic fit</SectionTitle>
          <button type="button" onClick={onOpenFit} className="text-xs text-accent hover:underline">Scorecard →</button>
        </div>
        <div className="mt-2"><FitScore score={fit.score} band={fit.band} size="lg" /></div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{fit.why}</p>
        {fit.fills.length > 0 && <p className="mt-1.5 text-xs text-muted"><span className="font-medium text-ink">Fills:</span> {fit.fills.join(" · ")}</p>}
      </Card>
      <Card className="p-4" data-story="health-card">
        <SectionTitle>Relationship health</SectionTitle>
        <div className="mt-3"><HealthChip status={health.status} label={health.label} /></div>
        <p className="mt-2 text-sm leading-relaxed text-muted">{health.why}</p>
      </Card>
      <Card className="p-4">
        <SectionTitle>Next touch</SectionTitle>
        {health.nextTouch ? (
          <p className="mt-2 text-sm">
            <span className="font-medium">Due {formatDate(health.nextTouch)}</span>
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">Not scheduled at this stage.</p>
        )}
        {reach.length > 0 ? (
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            {reach.slice(0, 2).map((r) => (
              <li key={r.reason} className="flex gap-2">
                <span aria-hidden className="text-accent">{r.kind === "key-date" ? "◷" : "→"}</span>
                <span>{r.reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted">No outreach planned.</p>
        )}
      </Card>
    </div>
  );
}
