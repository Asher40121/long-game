"use client";

import { useStore } from "@/components/store";
import type { Insight } from "@/components/useInsights";
import { Card, FitScore, SectionTitle, buttonSecondary } from "@/components/ui";
import { CRITERIA, DEFAULT_WEIGHTS, RISK_PENALTY, RISK_PENALTY_CAP, type Criterion } from "@/lib/fit/score";
import type { FitRatings } from "@/lib/model";

const SEVERITY_TONE = { high: "bg-bad-soft text-bad", medium: "bg-warn-soft text-warn", low: "bg-idle-soft text-muted" } as const;

export function FitTab({ insight }: { insight: Insight }) {
  const { state, setRating, setWeight, resetWeights } = useStore();
  const { target: t, fit } = insight;
  const weightsChanged = CRITERIA.some((c) => state.weights[c.id] !== DEFAULT_WEIGHTS[c.id]);

  return (
    <div className="space-y-4">
      <Card className="p-5" data-story="fit-detail">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-2">
          <FitScore score={fit.score} band={fit.band} size="lg" />
          <p className="min-w-0 flex-1 text-sm leading-relaxed">{fit.why}</p>
        </div>
        {fit.fills.length > 0 && (
          <p className="mt-3 text-sm text-muted">
            <span className="font-medium text-ink">Fills portfolio gaps: </span>
            {fit.fills.join(" · ")}
          </p>
        )}
      </Card>

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Fit criteria, weights, ratings and points</caption>
          <thead className="border-b border-line text-xs text-muted">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Criterion</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Weight</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Rating (1–5)</th>
              <th scope="col" className="px-4 py-2.5 text-right font-medium">Points</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {CRITERIA.map((c) => {
              const rating = fit.ratings[c.id];
              const pts = fit.contributions[c.id];
              const note =
                c.id === "expansion"
                  ? fit.fills.length ? `Calculated: fills ${fit.fills.join(", ")}.` : "Calculated: fills no portfolio gaps."
                  : t.fitNotes[c.id as keyof FitRatings];
              return (
                <tr key={c.id} className="align-top">
                  <th scope="row" className="px-4 py-3 font-medium">
                    {c.label}
                    <p className="mt-0.5 text-xs font-normal text-muted">{c.help}</p>
                  </th>
                  <td className="px-4 py-3">
                    <label className="flex items-center gap-2">
                      <span className="sr-only">Weight for {c.label}</span>
                      <input
                        type="range"
                        min={0}
                        max={30}
                        step={5}
                        value={state.weights[c.id]}
                        onChange={(e) => setWeight(c.id as Criterion, Number(e.target.value))}
                        className="w-24 accent-[var(--accent)]"
                      />
                      <span className="w-6 tabular-nums text-muted">{state.weights[c.id]}</span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    {c.computed ? (
                      <span className="tabular-nums">{rating} <span className="text-xs text-muted">auto</span></span>
                    ) : (
                      <RatingInput
                        label={c.label}
                        value={rating}
                        onChange={(v) => setRating(t.id, c.id as keyof FitRatings, v)}
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{pts == null ? "—" : pts.toFixed(1)}</td>
                  <td className="px-4 py-3 text-muted">{note ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card className="p-5">
        <SectionTitle>Risk flags</SectionTitle>
        {t.risks.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No risks flagged.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {t.risks.map((r) => (
              <li key={r.label} className="flex items-start gap-3 text-sm">
                <span className={`mt-0.5 w-16 shrink-0 rounded-full px-2 py-0.5 text-center text-xs font-medium capitalize ${SEVERITY_TONE[r.severity]}`}>{r.severity}</span>
                <span className="flex-1">{r.label}</span>
                <span className="tabular-nums text-muted">−{RISK_PENALTY[r.severity]}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 border-t border-line pt-3 text-sm">
          Risk penalty: <span className="font-medium tabular-nums">−{fit.riskPenalty}</span>
          <span className="text-muted"> (max {RISK_PENALTY_CAP})</span>
        </p>
      </Card>

      <Card className="p-5 text-sm leading-relaxed text-muted">
        <SectionTitle>How it&apos;s calculated</SectionTitle>
        <p className="mt-2">
          Each criterion earns <b className="text-ink">weight × (rating − 1) ÷ 4</b> points. The total is scaled to 100 over the
          criteria that have been assessed, then risk penalties are subtracted (high 5, medium 2, low 1; at most 15).
          Channel &amp; geographic expansion is calculated from the gaps in the portfolio: a new category is worth 2, a new
          region 1.5, a new channel with at least 15% of sales 1, and a region that&apos;s new for this category 1.
        </p>
        <p className="mt-2">Bands: 65+ Strong · 50–64 Good · 35–49 Mixed · under 35 Weak. Weights apply to every target.</p>
        {weightsChanged && (
          <button type="button" className={`${buttonSecondary} mt-3`} onClick={resetWeights}>Reset weights</button>
        )}
      </Card>
    </div>
  );
}

function RatingInput({ label, value, onChange }: { label: string; value: number | null; onChange: (v: number | null) => void }) {
  return (
    <div role="radiogroup" aria-label={`Rating for ${label}`} className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}`}
          onClick={() => onChange(n)}
          className={`size-7 rounded-md border text-xs tabular-nums ${
            value != null && n <= value ? "border-accent bg-accent text-accent-ink" : "border-line text-muted hover:border-line-strong"
          }`}
        >
          {n}
        </button>
      ))}
      <button
        type="button"
        role="radio"
        aria-checked={value == null}
        onClick={() => onChange(null)}
        className={`ml-1 whitespace-nowrap rounded-md px-1.5 text-xs ${value == null ? "font-medium text-ink" : "text-faint hover:text-muted"}`}
      >
        Not assessed
      </button>
    </div>
  );
}
