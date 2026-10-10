"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo, Wordmark } from "./Logo";
import { DISCORD_INVITE_URL } from "@/lib/config";
import "./landing.css";

export const features = [
  {
    title: "Resolve accounts",
    text: "Paste a session token and Z-BEAM turns it into the Minecraft IGN before launch.",
    tag: "Resolve",
  },
  {
    title: "Pick a server",
    text: "Choose Minemen, CatPvP, PvP HQ, or your saved target and continue without extra clutter.",
    tag: "Launch",
  },
  {
    title: "Watch live logs",
    text: "Join attempts, kicks, reconnects, and chat events stay readable beside the bot.",
    tag: "Logs",
  },
  {
    title: "Control the session",
    text: "Send chat, use hotbar actions, move, inspect inventory, and stop safely from one place.",
    tag: "Control",
  },
  {
    title: "Run flows",
    text: "Use opener scripts, wait for replies, send closing messages, and dedupe contacts cleanly.",
    tag: "Flow",
  },
  {
    title: "Manage access",
    text: "Redeem keys, see used and free slots, and the remaining active time in one place.",
    tag: "Access",
  },
];

const steps = [
  { title: "Paste a session", text: "Drop in a token or pick a saved account." },
  { title: "Choose a server", text: "Select a profile or enter your own target." },
  { title: "Launch the bot", text: "Z-BEAM resolves the IGN and joins the server." },
  { title: "Watch and control", text: "Follow the console and send commands live." },
];

const sessions = [
  { name: "vyrex_", server: "eu.minemen.club", state: "online", note: "Chat, inventory and controls are live." },
  { name: "aero_clip", server: "mc.hypixel.net", state: "joining", note: "Resolving profile and joining server." },
  { name: "noxline", server: "catpvp.net", state: "idle", note: "Ready for launch when you are." },
];

const consoleLines = [
  ["12:44:01", "resolving profile"],
  ["12:44:02", "connecting server"],
  ["12:44:03", "join success"],
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // The Minecraft scene is decorative and costs paint time on every frame.
  // The landing page is a static, content-first page, so hide it here.
  useEffect(() => {
    document.body.classList.add("home-no-scene");
    return () => document.body.classList.remove("home-no-scene");
  }, []);

  // Light header treatment after the first scroll. Passive listener, one
  // boolean state change, so it never re-renders on every scroll tick.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="lp">
      <a href="#main" className="lp-skip">Skip to content</a>

      <header className={`lp-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="lp-wrap lp-header-inner">
          <Link href="/" className="lp-brand" aria-label="Z-BEAM home">
            <Logo size={30} />
            <Wordmark height={20} />
          </Link>

          <button
            type="button"
            className="lp-menu-btn"
            aria-expanded={menuOpen}
            aria-controls="lp-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span aria-hidden className="lp-menu-bars" />
          </button>

          <nav id="lp-nav" className={`lp-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main">
            <a href="#how" onClick={closeMenu}>How it works</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <Link href="/license" onClick={closeMenu}>License</Link>
            <Link href="/dashboard" className="lp-btn lp-btn-primary lp-nav-cta" onClick={closeMenu}>
              Open dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="lp-hero">
          <div className="lp-wrap lp-hero-grid">
            <div className="lp-hero-copy">
              <p className="lp-eyebrow">Minecraft bot control panel</p>
              <h1>Paste a session. Pick a server. Run the bot.</h1>
              <p className="lp-lead">
                Z-BEAM keeps your bot sessions in one panel: resolve the IGN, choose the server,
                then watch the console and control the bot live.
              </p>
              <div className="lp-actions">
                <Link href="/dashboard" className="lp-btn lp-btn-primary">Open dashboard</Link>
                <a href="#how" className="lp-btn lp-btn-ghost">See how it works</a>
              </div>
              <ul className="lp-checks" aria-label="Highlights">
                <li>Launch from one panel</li>
                <li>Saved server choices</li>
                <li>Live logs and controls</li>
              </ul>
            </div>

            <div className="lp-panel" aria-label="Example session list">
              <div className="lp-panel-top">
                <span>Sessions</span>
                <span className="lp-count">{sessions.length} bots</span>
              </div>
              {sessions.map((s) => (
                <div className="lp-session" key={s.name}>
                  <div className="lp-session-head">
                    <span className="lp-avatar" aria-hidden>{s.name.slice(0, 2).toUpperCase()}</span>
                    <div className="lp-session-id">
                      <strong>{s.name}</strong>
                      <span>{s.server}</span>
                    </div>
                    <span className={`lp-state lp-state-${s.state}`}>{s.state}</span>
                  </div>
                  <p className="lp-session-note">{s.note}</p>
                </div>
              ))}
              <pre className="lp-console" aria-label="Example console output">
                {consoleLines.map(([t, msg]) => (
                  <span key={t}><time>{t}</time> {msg}{"\n"}</span>
                ))}
              </pre>
            </div>
          </div>
        </section>

        {DISCORD_INVITE_URL && (
          <section className="lp-wrap lp-discord" aria-label="Discord community">
            <div>
              <strong>Need setup help or release notes?</strong>
              <p>Join the Z-BEAM Discord for updates, license support and server-specific fixes.</p>
            </div>
            <a className="lp-btn lp-btn-ghost" href={DISCORD_INVITE_URL} target="_blank" rel="noreferrer">
              Join Discord
            </a>
          </section>
        )}

        <section id="how" className="lp-section lp-wrap">
          <header className="lp-section-head">
            <p className="lp-eyebrow">How it works</p>
            <h2>From session token to live bot in four steps.</h2>
          </header>
          <ol className="lp-steps">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="lp-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="features" className="lp-section lp-wrap">
          <header className="lp-section-head">
            <p className="lp-eyebrow">What the panel handles</p>
            <h2>Less switching around. More session state on screen.</h2>
          </header>
          <div className="lp-features">
            {features.map((f) => (
              <article className="lp-feature" key={f.title}>
                <span className="lp-feature-tag">{f.tag}</span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="lp-wrap lp-cta">
          <div>
            <h2>Ready when your sessions are.</h2>
            <p>Sign in, add a bot, and watch it join in a few clicks.</p>
          </div>
          <Link href="/dashboard" className="lp-btn lp-btn-primary">Open dashboard</Link>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer-inner">
          <span>Z-BEAM · Minecraft bot control</span>
          <nav aria-label="Footer">
            <Link href="/license">License</Link>
            <Link href="/features">Features</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
