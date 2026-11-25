"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AUTHOR_GITHUB, AUTHOR_LINKEDIN, GITHUB_URL } from "@/lib/links";
import { useStore } from "@/components/store";
import { buttonPrimary, buttonSecondary } from "@/components/ui";

export type StoryStep = {
  href: string;
  /** data-story value of the element to spotlight; none = a centered card. */
  target?: string;
  title: string;
  body: React.ReactNode;
};

export const STEPS: StoryStep[] = [
  {
    href: "/relationships",
    target: "map",
    title: "Years of relationships, not a sales funnel",
    body: (
      <>
        In founder-led categories, the best deals come from relationships kept warm for years. Each row is a founder; each
        dot is a call, meeting, intro or note. Martin at Wildmoor took two and a half years of quarterly check-ins to say
        he&apos;d be &ldquo;ready to talk seriously&rdquo; after his next launch.
      </>
    ),
  },
  {
    href: "/pipeline",
    target: "attention",
    title: "Know who needs a call this week",
    body: (
      <>
        Relationship health compares the time since the last touch with the rhythm each stage needs. Walt Ashby has gone
        quiet, so Long Game suggests a low-pressure reason to reach out, by phone, which he prefers.
      </>
    ),
  },
  {
    href: "/target?id=emberline",
    target: "fit-card",
    title: "Fit measured against portfolio gaps",
    body: (
      <>
        Emberline scores 69, a strong fit: a close category, deep community ties, and it fills the portfolio&apos;s Europe and UK
        gaps. Every point is explained on the scorecard. A weighted tally, not a black box.
      </>
    ),
  },
  {
    href: "/target?id=emberline",
    target: "founder",
    title: "What the founder cares about",
    body: (
      <>
        Dana&apos;s priorities are her team, the game&apos;s integrity and staying creative director. Deals with founders are won or
        lost on this, so it&apos;s written down, in plain language, and carried into every brief.
      </>
    ),
  },
  {
    href: "/target?id=emberline&tab=brief",
    target: "generate",
    title: "Decision-ready in one page",
    body: (
      <>
        Try it: click <b>Generate decision brief</b>. You&apos;ll get a one-page memo for the CFO: why it fits, key risks, what we
        don&apos;t know yet, and a next step with an owner. Facts only; valuation and legal go to Finance and Legal.
      </>
    ),
  },
  {
    href: "/",
    title: "Why I built this",
    body: (
      <>
        I&apos;m Phil Albritton. I&apos;ve worked with toy, game and collectibles brands for years, and I&apos;ve been a founder myself,
        so I know the founder&apos;s side of the table. Long Game is how I&apos;d organize long-term acquisition relationships:
        relationship first, fit against real gaps, and clear briefs for leadership.
        <span className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <a className="text-accent hover:underline" href={AUTHOR_LINKEDIN}>LinkedIn</a>
          <a className="text-accent hover:underline" href={AUTHOR_GITHUB}>GitHub</a>
          <a className="text-accent hover:underline" href={GITHUB_URL}>Source code</a>
        </span>
      </>
    ),
  },
];

type StoryCtx = { step: number | null; start: () => void; stop: () => void };
// Default is a no-op so components still render during pre-rendering checks outside the provider.
const Ctx = createContext<StoryCtx>({ step: null, start: () => {}, stop: () => {} });

export function useStory(): StoryCtx {
  return useContext(Ctx);
}

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<number | null>(null);
  const { setStorySeen } = useStore();
  const start = useCallback(() => setStep(0), []);
  const stop = useCallback(() => {
    setStep(null);
    setStorySeen(true);
  }, [setStorySeen]);

  return (
    <Ctx.Provider value={{ step, start, stop }}>
      {children}
      {step != null && <StoryOverlay step={step} setStep={setStep} stop={stop} />}
    </Ctx.Provider>
  );
}

function StoryOverlay({ step, setStep, stop }: { step: number; setStep: (n: number) => void; stop: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { ready } = useStore();
  const s = STEPS[step];
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const last = step === STEPS.length - 1;

  // Navigate to the step's page.
  useEffect(() => {
    const here = pathname + window.location.search;
    const want = s.href.replace(/\?$/, "");
    const norm = (u: string) => u.replace(/\/(?=\?|$)/, "");
    if (norm(here) !== norm(want)) router.push(s.href, { scroll: false });
  }, [s.href, pathname, router]);

  // Find the spotlighted element (it may appear after navigation and data load), scroll to it, and track it.
  useLayoutEffect(() => {
    let raf = 0;
    let scrolled = false;
    const tick = () => {
      const el = s.target ? document.querySelector<HTMLElement>(`[data-story="${s.target}"]`) : null;
      if (el && !scrolled) {
        el.scrollIntoView({ block: "center", behavior: "instant" as ScrollBehavior });
        scrolled = true;
      }
      const r = el ? el.getBoundingClientRect() : null;
      setRect((prev) =>
        prev && r && prev.top === r.top && prev.left === r.left && prev.width === r.width && prev.height === r.height ? prev : r,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [s.target, pathname, ready]);

  useEffect(() => {
    cardRef.current?.focus();
  }, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") stop();
      // Leave arrow keys alone when they belong to a control on the page (sliders, fields, tabs, ratings).
      const el = e.target;
      if (el instanceof Element && el.closest("input, select, textarea, [role=tablist], [role=radiogroup]")) return;
      if (e.key === "ArrowRight" && !last) setStep(step + 1);
      if (e.key === "ArrowLeft" && step > 0) setStep(step - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, last, setStep, stop]);

  const pad = 8;
  return (
    <div className="no-print pointer-events-none fixed inset-0 z-50">
      {rect ? (
        <div
          aria-hidden
          className="absolute rounded-xl ring-2 ring-accent transition-all duration-200"
          style={{
            top: rect.top - pad,
            left: rect.left - pad,
            width: rect.width + pad * 2,
            height: rect.height + pad * 2,
            boxShadow: "0 0 0 9999px var(--scrim)",
          }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 bg-[var(--scrim)]" />
      )}

      <div
        ref={cardRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-labelledby="story-title"
        aria-live="polite"
        className={`pointer-events-auto absolute max-h-[calc(100vh-24px)] overflow-y-auto rounded-2xl border border-line bg-surface p-5 text-ink shadow-2xl outline-none ${
          s.target
            ? // Anchored: a bottom sheet on phones, the bottom-right corner on larger screens.
              "inset-x-3 bottom-3 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[420px]"
            : // No element to point at: centered on every screen size.
              "left-1/2 top-1/2 w-[min(460px,calc(100vw-24px))] -translate-x-1/2 -translate-y-1/2"
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted">Step {step + 1} of {STEPS.length}</span>
          <span className="flex gap-1" aria-hidden>
            {STEPS.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full ${i === step ? "w-5 bg-accent" : "w-1.5 bg-line-strong"}`} />
            ))}
          </span>
          <button type="button" onClick={stop} className="ml-auto text-xs text-muted hover:text-ink" aria-label="Close the tour">
            Close ✕
          </button>
        </div>
        <h2 id="story-title" className="mt-3 text-lg font-semibold leading-snug">{s.title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-muted [&_b]:text-ink">{s.body}</div>
        <div className="mt-4 flex items-center gap-2">
          {step > 0 && (
            <button type="button" className={buttonSecondary} onClick={() => setStep(step - 1)}>Back</button>
          )}
          {last ? (
            <Link href="/relationships" className={`${buttonPrimary} ml-auto`} onClick={stop}>Explore on my own</Link>
          ) : (
            <button type="button" className={`${buttonPrimary} ml-auto`} onClick={() => setStep(step + 1)}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}
