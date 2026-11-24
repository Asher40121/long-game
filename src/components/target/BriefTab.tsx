"use client";

import { useState } from "react";
import { Markdown } from "@/components/Markdown";
import { useStore } from "@/components/store";
import type { Insight } from "@/components/useInsights";
import { Card, buttonPrimary, buttonSecondary, formatDate } from "@/components/ui";
import { getBrief } from "@/lib/brief/brief";
import { DEFAULT_WEIGHTS, CRITERIA } from "@/lib/fit/score";
import { ACQUIRER } from "@/data/portfolio";

export function BriefTab({ insight }: { insight: Insight }) {
  const { state, today } = useStore();
  const { target: t, fit, health, reach } = insight;
  const [generated, setGenerated] = useState(false);
  const [showAssembled, setShowAssembled] = useState(false);
  const [copied, setCopied] = useState(false);
  const brief = getBrief(t, fit, health, reach);
  const weightsChanged = CRITERIA.some((c) => state.weights[c.id] !== DEFAULT_WEIGHTS[c.id]);
  const body = brief.kind === "stale" && showAssembled ? brief.assembled : brief.markdown;

  if (!generated) {
    return (
      <Card className="flex flex-col items-center gap-3 p-10 text-center">
        <h2 className="text-lg font-semibold">One-page decision brief for leadership</h2>
        <p className="max-w-lg text-sm text-muted">
          What the business is, why it fits, what the founder cares about, the key risks, what we don&apos;t know yet, and a
          recommended next step. Built only from this target&apos;s data.
        </p>
        <button type="button" data-story="generate" className={`${buttonPrimary} mt-2`} onClick={() => setGenerated(true)}>
          Generate decision brief
        </button>
      </Card>
    );
  }

  const label =
    brief.kind === "assembled" || showAssembled
      ? { text: "Assembled from your data", note: "Built only from the fields entered, without AI. Gaps are listed, never filled in." }
      : { text: "Sample output", note: "Pre-written for this demo's fictional data. Live AI is off, so nothing is sent anywhere." };

  return (
    <div className="space-y-3">
      <div className="no-print flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-semibold text-accent">{label.text}</span>
        <span className="text-xs text-muted">{label.note}</span>
        <div className="ml-auto flex gap-2">
          <button
            type="button"
            className={buttonSecondary}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(body);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {}
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className={buttonSecondary} onClick={() => window.print()}>Print / PDF</button>
        </div>
      </div>

      {brief.kind === "stale" && (
        <p className="no-print rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">
          You&apos;ve changed this target since the sample was written, so the sample may not match its data.{" "}
          <button type="button" className="font-medium underline" onClick={() => setShowAssembled((s) => !s)}>
            {showAssembled ? "Show the original sample" : "Show a brief assembled from the current data"}
          </button>
        </p>
      )}
      {weightsChanged && brief.kind !== "assembled" && !showAssembled && (
        <p className="no-print rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">
          The sample uses the default weights. With your weights, the fit score is now {fit.score} ({fit.band}).
        </p>
      )}

      <Card className="mx-auto max-w-3xl p-6 sm:p-10" data-story="brief">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Decision brief · {ACQUIRER.name} (fictional)</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{t.name}</h2>
        <p className="mb-4 text-xs text-faint">Prepared for the CFO and executive team · {formatDate(today)}</p>
        <Markdown source={body} />
      </Card>
    </div>
  );
}
