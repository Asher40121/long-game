"use client";

import Link from "next/link";
import { ACQUIRER, PORTFOLIO } from "@/data/portfolio";
import { useStore } from "@/components/store";
import { targetHref, useInsights, type Insight } from "@/components/useInsights";
import { Card, FitScore, SectionTitle, Skeleton } from "@/components/ui";
import { expansionFor, portfolioGaps } from "@/lib/fit/score";
import { CATEGORIES, CHANNELS, REGIONS, type Category, type Channel, type Region } from "@/lib/model";

export function PortfolioView() {
  const { ready } = useStore();
  const insights = useInsights();
  const gaps = portfolioGaps(PORTFOLIO);
  const active = insights.filter((i) => i.target.stage !== "passed");

  const fillers = (kind: "categories" | "regions" | "channels", key: string): Insight[] =>
    active
      .filter((i) => {
        const e = expansionFor(i.target, PORTFOLIO, gaps);
        const list = kind === "categories" ? e.newCategories : kind === "regions" ? e.newRegions : e.newChannels;
        return (list as string[]).includes(key);
      })
      .sort((a, b) => b.fit.score - a.fit.score);

  const groups: { kind: "categories" | "regions" | "channels"; title: string; all: Record<string, string>; gaps: string[] }[] = [
    { kind: "categories", title: "Categories", all: CATEGORIES, gaps: gaps.categories as Category[] },
    { kind: "regions", title: "Regions", all: Object.fromEntries(Object.entries(REGIONS).filter(([k]) => !k.startsWith("us-") || k === "us-national")), gaps: gaps.regions as Region[] },
    { kind: "channels", title: "Channels", all: CHANNELS, gaps: gaps.channels as Channel[] },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-1 max-w-3xl text-sm text-muted">
        {ACQUIRER.name} is a fictional acquirer with {PORTFOLIO.length} brands. Fit is measured against what this portfolio
        lacks, so a target that fills a gap scores higher on expansion.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {PORTFOLIO.map((b) => (
          <Card key={b.name} className="p-4">
            <h2 className="font-medium">{b.name}</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">{b.oneLiner}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {groups.map((g) => (
          <section key={g.kind} aria-labelledby={`g-${g.kind}`}>
            <h2 id={`g-${g.kind}`} className="text-lg font-semibold">{g.title}</h2>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${g.title}: covered and gaps`}>
              {Object.entries(g.all).map(([k, label]) => {
                const gap = g.gaps.includes(k);
                return (
                  <li key={k} className={`rounded-full px-3 py-1 text-sm ${gap ? "border border-dashed border-line-strong text-muted" : "bg-accent-soft text-accent"}`}>
                    <span className="sr-only">{gap ? "Gap: " : "Covered: "}</span>
                    {label}
                  </li>
                );
              })}
            </ul>
            {ready ? (
              <Card className="mt-3 divide-y divide-line">
                {g.gaps.map((k) => {
                  const f = fillers(g.kind, k);
                  return (
                    <div key={k} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6">
                      <span className="text-sm font-medium sm:w-64">{g.all[k]}</span>
                      {f.length ? (
                        <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                          {f.map((i) => (
                            <Link key={i.target.id} href={targetHref(i.target.id)} className="hover:underline">
                              {i.target.name} <FitScore score={i.fit.score} />
                            </Link>
                          ))}
                        </span>
                      ) : (
                        <span className="text-sm text-faint">No target in the pipeline fills this gap yet.</span>
                      )}
                    </div>
                  );
                })}
              </Card>
            ) : (
              <Skeleton className="mt-3 h-32" />
            )}
          </section>
        ))}
      </div>
      <SectionTitle className="mt-8">Key</SectionTitle>
      <p className="mt-2 text-sm text-muted">Filled chips are covered by the portfolio; dashed chips are gaps. A channel counts only at 15% or more of a target&apos;s sales.</p>
    </div>
  );
}
