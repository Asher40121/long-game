"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { useStore } from "@/components/store";
import { useStory } from "@/components/story/Story";
import { THEME_KEY } from "@/lib/storage/state";
import { buttonPrimary, buttonSecondary } from "@/components/ui";

import { AUTHOR_GITHUB, GITHUB_URL } from "@/lib/links";

const NAV = [
  { href: "/relationships", label: "Relationships" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/portfolio", label: "Portfolio" },
];

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-warn/40 bg-warn-soft px-2.5 py-0.5 text-xs font-medium text-warn">
      Demo with fictional data
    </span>
  );
}

function ThemeToggle() {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(THEME_KEY, dark ? "dark" : "light");
    } catch {
      /* storage blocked: the choice lasts for this visit */
    }
  };
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      title="Light / dark"
      className="inline-flex size-9 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-ink"
    >
      <svg aria-hidden viewBox="0 0 20 20" className="size-4.5" fill="currentColor">
        <path d="M10 2a8 8 0 1 0 0 16V2Z" />
        <circle cx="10" cy="10" r="7.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const { start } = useStory();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-surface focus:px-3 focus:py-1.5">
        Skip to content
      </a>
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <Mark />
          <span className="hidden sm:inline">Long Game</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-0.5 sm:gap-1">
          {NAV.map((n) => {
            const active = pathname?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-2 py-1.5 text-sm sm:px-3 ${active ? "bg-surface-2 font-medium text-ink" : "text-muted hover:text-ink"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden md:inline-flex">
            <DemoBadge />
          </span>
          <button type="button" onClick={start} className="rounded-lg px-2 py-1.5 text-sm font-medium text-accent hover:bg-surface-2">
            Tour
          </button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

/** A small wordmark: a long arc ending in a dot (a relationship that lands). */
export function Mark({ className = "size-6" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={`${className} text-accent`} fill="none">
      <path d="M3 18c3-9 9-13 15-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 3.2" />
      <circle cx="19.5" cy="6" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Modal({
  dialogRef,
  title,
  children,
}: {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
      className="m-auto w-[min(560px,calc(100vw-32px))] rounded-2xl border border-line bg-surface p-0 text-ink shadow-2xl"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </dialog>
  );
}

export function Footer() {
  const { resetDemo, persisted } = useStore();
  const howRef = useRef<HTMLDialogElement>(null);
  const resetRef = useRef<HTMLDialogElement>(null);
  const [done, setDone] = useState(false);

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted sm:px-6">
        <button type="button" className="hover:text-ink" onClick={() => howRef.current?.showModal()}>
          How this works and what&apos;s stored
        </button>
        <button type="button" className="hover:text-ink" onClick={() => { setDone(false); resetRef.current?.showModal(); }}>
          Reset demo data
        </button>
        <a className="hover:text-ink" href={GITHUB_URL}>Source on GitHub</a>
        <span className="sm:ml-auto">
          Built by <a className="underline-offset-2 hover:text-ink hover:underline" href={AUTHOR_GITHUB}>Phil Albritton</a>
        </span>
        {!persisted && <span className="w-full text-xs text-warn">Your browser is blocking storage, so changes last only for this visit.</span>}
      </div>

      <Modal dialogRef={howRef} title="How this works and what's stored">
        <p>
          Long Game is a portfolio demo. <b className="text-ink">Every company, founder and number is fictional.</b> It isn&apos;t
          affiliated with any real company.
        </p>
        <p>
          <b className="text-ink">Stored only in your browser:</b> the demo data and any changes you make (touchpoints, ratings,
          weights) are saved in this browser&apos;s local storage. There are no accounts, no analytics and no server. Nothing you
          type is sent anywhere.
        </p>
        <p>
          <b className="text-ink">Scores are calculated, not guessed:</b> fit is a transparent weighted tally and relationship
          health compares days since the last touch with the cadence each stage calls for.
        </p>
        <p>
          <b className="text-ink">AI:</b> decision briefs in this demo are pre-written sample outputs, labeled as such. No AI
          calls are made and nothing costs money.
        </p>
        <div className="flex justify-end pt-2">
          <button type="button" className={buttonPrimary} onClick={() => howRef.current?.close()}>Got it</button>
        </div>
      </Modal>

      <Modal dialogRef={resetRef} title="Reset demo data?">
        {done ? (
          <>
            <p>The demo data is back to its original state, with dates refreshed for today.</p>
            <div className="flex justify-end pt-2">
              <button type="button" className={buttonPrimary} onClick={() => resetRef.current?.close()}>Done</button>
            </div>
          </>
        ) : (
          <>
            <p>This removes your changes (touchpoints, ratings, weights and any targets you added) and restores the original fictional data.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className={buttonSecondary} onClick={() => resetRef.current?.close()}>Cancel</button>
              <button type="button" className={buttonPrimary} onClick={() => { resetDemo(); setDone(true); }}>Reset demo data</button>
            </div>
          </>
        )}
      </Modal>
    </footer>
  );
}
