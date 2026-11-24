"use client";

import Link from "next/link";
import { DemoBadge } from "@/components/AppShell";
import { RelationshipMap } from "@/components/map/RelationshipMap";
import { useStory } from "@/components/story/Story";
import { useStore } from "@/components/store";
import { targetHref, useInsights } from "@/components/useInsights";
import { Card, FitScore, HealthChip, SectionTitle, Skeleton, buttonPrimary, buttonSecondary } from "@/components/ui";

export function Landing() {
  const { ready } = useStore();
  const { start } = useStory();
  const insights = useInsights();
  const hero = insights.find((i) => i.target.id === "emberline");
  const quiet = insights.filter((i) => i.health.status === "gone-quiet").sort((a, b) => (b.health.daysSince ?? 0) - (a.health.daysSince ?? 0));

  return (
    <div className="pb-4">
      <section className="py-8 sm:py-14">
        <DemoBadge />
        <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight sm:text-5xl">
          The deal pipeline that treats the founder relationship as the asset.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Long Game tracks acquisition targets and their founders over years, scores strategic fit against what the portfolio
          lacks, flags relationships going quiet, and turns it all into a one-page brief for leadership.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button type="button" className={`${buttonPrimary} min-h-12 px-6 text-base`} onClick={start}>
            Take the 60-second tour
          </button>
          <Link href="/relationships" className={`${buttonSecondary} min-h-12 px-6 text-base`}>
            Explore on my own
          </Link>
        </div>
      </section>

      <section aria-labelledby="map-title">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-3">
          <h2 id="map-title" className="text-lg font-semibold">Years of relationships, at a glance</h2>
          <p className="text-sm text-muted">Each dot is a call, meeting, intro or note. Red means a founder has gone quiet.</p>
        </div>
        {ready ? <RelationshipMap insights={insights} limit={6} compact /> : <Skeleton className="h-80" />}
        <Link href="/relationships" className="mt-2 inline-block text-sm text-accent hover:underline">See all relationships →</Link>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3" aria-label="What Long Game does">
        <Card className="p-5">
          <SectionTitle>Relationships, not just stages</SectionTitle>
          <p className="mt-2 text-sm leading-relaxed">
            Relationship health compares time since the last touch with the rhythm each stage needs, and suggests a
            low-pressure reason to reach out.
          </p>
          {ready && quiet[0] && (
            <Link href={targetHref(quiet[0].target.id)} className="mt-3 block rounded-lg bg-surface-2 p-3 text-sm hover:bg-line/50">
              <HealthChip status={quiet[0].health.status} label={quiet[0].health.label} />
              <span className="mt-1.5 block font-medium">{quiet[0].target.founder.name} · {quiet[0].target.name}</span>
              <span className="block text-muted">{quiet[0].reach[0]?.reason}</span>
            </Link>
          )}
        </Card>
        <Card className="p-5">
          <SectionTitle>Fit measured against gaps</SectionTitle>
          <p className="mt-2 text-sm leading-relaxed">
            A transparent, weighted scorecard with a one-line &ldquo;why&rdquo;. Expansion is calculated from the categories,
            regions and channels the portfolio lacks.
          </p>
          {ready && hero && (
            <Link href={`${targetHref(hero.target.id)}&tab=fit`} className="mt-3 block rounded-lg bg-surface-2 p-3 text-sm hover:bg-line/50">
              <span className="font-medium">{hero.target.name}</span> <FitScore score={hero.fit.score} band={hero.fit.band} />
              <span className="block text-muted">Fills: {hero.fit.fills.join(", ")}</span>
            </Link>
          )}
        </Card>
        <Card className="p-5">
          <SectionTitle>Decision-ready in one page</SectionTitle>
          <p className="mt-2 text-sm leading-relaxed">
            What the business is, why it fits, what the founder cares about, key risks, what we don&apos;t know yet, and a
            recommended next step. Facts only; valuation and legal go to Finance and Legal.
          </p>
          {ready && hero && (
            <Link href={`${targetHref(hero.target.id)}&tab=brief`} className="mt-3 block rounded-lg bg-surface-2 p-3 text-sm hover:bg-line/50">
              <span className="font-medium">Read the {hero.target.name} brief →</span>
            </Link>
          )}
        </Card>
      </section>
    </div>
  );
}
