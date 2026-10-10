"use client";

import { useEffect, useRef, useState } from "react";
import { Logo, Wordmark } from "./Logo";

const PHASES = [
  "Preparing your bots",
  "Loading your profile",
  "Syncing sessions",
  "Almost ready",
];

/**
 * Boot screen shown while the shell resolves the session.
 *
 * A slim indeterminate gradient track with a travelling highlight, a phase
 * line that advances every ~700ms, and a fading percentage. Progress is
 * cosmetic (the real signal is the session resolving), so it eases toward 92%
 * and never sits at 100% waiting.
 */
export default function BootLoader() {
  const [pct, setPct] = useState(6);
  const [phase, setPhase] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Deferred a tick: no synchronous setState inside the effect body.
      const settle = setTimeout(() => setPct(92), 0);
      return () => clearTimeout(settle);
    }

    const tick = setInterval(() => {
      setPct((p) => (p >= 92 ? 92 : p + Math.max(1, Math.round((92 - p) * 0.08))));
    }, 120);
    const next = setInterval(() => {
      setPhase((s) => (s + 1) % PHASES.length);
    }, 900);

    return () => {
      clearInterval(tick);
      clearInterval(next);
    };
  }, []);

  return (
    <div className="boot">
      <div className="boot-card">
        <div className="boot-mark">
          <Logo size={64} />
        </div>

        <div className="boot-brand">
          <Wordmark height={30} className="mx-auto" />
        </div>

        <div className="boot-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Loading">
          <div ref={barRef} className="boot-fill" style={{ width: `${pct}%` }} />
          <div className="boot-shimmer" />
        </div>

        <div className="boot-meta">
          {/* Single-height line so the phase swap never shifts layout. */}
          <span className="boot-phase" key={phase}>
            {PHASES[phase]}
          </span>
          <span className="boot-pct">{pct}%</span>
        </div>
      </div>
    </div>
  );
}
