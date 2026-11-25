"use client";

import { RelationshipMap, buildRows } from "@/components/map/RelationshipMap";
import { NeedsAttention } from "@/components/pipeline/PipelineView";
import { useStore } from "@/components/store";
import { useInsights } from "@/components/useInsights";
import Link from "next/link";
import { Card, Skeleton, buttonSecondary, relative } from "@/components/ui";

export function RelationshipsView() {
  const { ready, today } = useStore();
  const insights = useInsights();
  if (!ready) return <Skeleton className="h-[480px]" />;

  const active = insights.filter((i) => i.target.stage !== "passed");
  const rows = buildRows(active, today);
  const longest = rows.reduce((a, b) => (b.spanDays > a.spanDays ? b : a), rows[0]);
  const touches = active.reduce((n, i) => n + i.target.touchpoints.length, 0);
  const quiet = active.filter((i) => i.health.status === "gone-quiet").length;
  const stats = [
    { value: String(active.length), label: "founder relationships" },
    { value: relative(longest.spanDays).replace(" ago", ""), label: `longest (${longest.insight.target.founder.name})` },
    { value: String(touches), label: "touchpoints logged" },
    { value: String(quiet), label: quiet === 1 ? "has gone quiet" : "have gone quiet" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Relationships</h1>
        <Link href="/edit" className={`${buttonSecondary} ml-auto`}>+ Add a company</Link>
      </div>
      <p className="mt-1 max-w-3xl text-sm text-muted">
        Every founder relationship across the years. Each dot is a call, meeting, intro or note. Good deals in founder-led
        businesses come from relationships kept warm for years, so the gaps matter as much as the dots.
      </p>
      <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="px-4 py-3">
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-2xl font-semibold tabular-nums">{s.value}</dd>
            <dd className="text-xs text-muted">{s.label}</dd>
          </Card>
        ))}
      </dl>
      <div className="mt-6">
        <RelationshipMap insights={insights} />
      </div>
      <div className="mt-6">
        <NeedsAttention insights={insights} compact />
      </div>
    </div>
  );
}
