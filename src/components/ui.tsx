import type { HealthStatus } from "@/lib/health/health";
import { STAGES, type Stage } from "@/lib/model";

export const stageLabel = (s: Stage) => STAGES.find((x) => x.id === s)!.label;

const HEALTH_TONE: Record<HealthStatus, { dot: string; chip: string }> = {
  healthy: { dot: "bg-good", chip: "bg-good-soft text-good" },
  "due-soon": { dot: "bg-warn", chip: "bg-warn-soft text-warn" },
  overdue: { dot: "bg-warn", chip: "bg-warn-soft text-warn" },
  "gone-quiet": { dot: "bg-bad", chip: "bg-bad-soft text-bad" },
  "no-contact": { dot: "bg-idle", chip: "bg-idle-soft text-muted" },
  "not-tracked": { dot: "bg-idle", chip: "bg-idle-soft text-muted" },
};

export function HealthDot({ status, label }: { status: HealthStatus; label: string }) {
  return (
    <span className="inline-flex items-center" title={label}>
      <span aria-hidden className={`inline-block size-2.5 rounded-full ${HEALTH_TONE[status].dot}`} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function HealthChip({ status, label }: { status: HealthStatus; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${HEALTH_TONE[status].chip}`}>
      <span aria-hidden className={`inline-block size-1.5 rounded-full ${HEALTH_TONE[status].dot}`} />
      {label}
    </span>
  );
}

export function fitTone(score: number) {
  if (score >= 65) return "text-good";
  if (score >= 50) return "text-accent";
  if (score >= 35) return "text-warn";
  return "text-bad";
}

export function FitScore({ score, band, size = "sm" }: { score: number; band?: string; size?: "sm" | "lg" }) {
  return (
    <span className="inline-flex items-baseline gap-1.5">
      <span className={`font-semibold tabular-nums ${fitTone(score)} ${size === "lg" ? "text-4xl" : "text-sm"}`}>{score}</span>
      {band && <span className={`${size === "lg" ? "text-base" : "text-xs"} text-muted`}>{band}</span>}
    </span>
  );
}

export function Card({ children, className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`rounded-xl border border-line bg-surface ${className}`} {...rest}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`text-xs font-semibold uppercase tracking-wider text-muted ${className}`}>{children}</h2>;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "Nov 12, 2026" from yyyy-mm-dd, without time-zone surprises. */
export function formatDate(iso: string): string {
  return `${MONTHS[+iso.slice(5, 7) - 1]} ${+iso.slice(8, 10)}, ${iso.slice(0, 4)}`;
}

/** "today", "3 days ago", "in 2 weeks", "1 year ago". */
export function relative(days: number): string {
  const abs = Math.abs(days);
  const unit =
    abs === 0
      ? null
      : abs < 14
        ? `${abs} day${abs === 1 ? "" : "s"}`
        : abs < 60
          ? `${Math.round(abs / 7)} weeks`
          : abs < 365
            ? `${Math.round(abs / 30)} months`
            : `${(abs / 365).toFixed(1).replace(/\.0$/, "")} year${abs >= 548 ? "s" : ""}`;
  if (!unit) return "today";
  return days < 0 ? `in ${unit}` : `${unit} ago`;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />;
}

export const buttonPrimary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-semibold text-accent-ink hover:opacity-90";
export const buttonSecondary =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line-strong bg-surface px-4 text-sm font-medium text-ink hover:bg-surface-2";
