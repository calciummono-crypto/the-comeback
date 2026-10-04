import Link from "next/link";
import { Logo, Wordmark } from "./Logo";

export const features = [
  {
    title: "Session token → IGN",
    text: "Paste the session token; the panel resolves the Minecraft name before anything is started.",
    tag: "Auth",
  },
  {
    title: "Engine per bot",
    text: "Pick Mineflayer for 1.8.9, Azalea for modern sidecar runs, or NMP for raw protocol sessions.",
    tag: "Runtime",
  },
  {
    title: "Console inside the card",
    text: "Join output, kicks, reconnects, and flow messages stay next to the bot they belong to.",
    tag: "Logs",
  },
  {
    title: "Controls after join",
    text: "Send chat, change hotbar slot, use or drop items, move, and inspect inventory from the same view.",
    tag: "Control",
  },
  {
    title: "Flows, not magic",
    text: "A flow sends an opener script, waits for a reply, runs a closing script, and deduplicates contacts across sessions.",
    tag: "Flows",
  },
  {
    title: "License slots",
    text: "Keys unlock slots; the dashboard shows used slots, remaining slots, and active time.",
    tag: "Access",
  },
];

const facts = [
  ["Session token", "Resolves the IGN first so the operator knows which account is being launched."],
  ["Mineflayer", "Use it for classic 1.8.9 sessions where plugin behavior is predictable."],
  ["Azalea", "Rust sidecar path for modern versions and servers that need a different client stack."],
  ["NMP", "Raw protocol mode for lower-level sessions and testing server behavior."],
  ["Live console", "The bot card owns its log output instead of hiding it in a separate terminal."],
  ["Controls", "Chat, hotbar, use/drop, movement, and inventory actions sit beside the running bot."],
  ["Flows", "Opener script → wait for reply → closing script; memory prevents re-contacting the same player."],
  ["License slots", "Redeemed keys gate access and show how many bot slots are still available."],
];

const consoleLines = [
  "12:55:06 · profile resolved: vanta_qp",
  "12:55:07 · mineflayer selected: 1.8.9",
  "12:55:09 · connecting to eu.minemen.club",
  "12:55:10 · joined lobby · hotbar synced",
];

export default function LandingPage() {
  return (
    <main className="zbeam-page">
      <style>{landingCss}</style>

      <nav className="topbar" aria-label="Primary navigation">
        <Link href="/" className="brand" aria-label="Z-BEAM home">
          <span className="brand-icon"><Logo size={28} /></span>
          <span>
            <Wordmark height={24} />
            <span className="brand-subtitle">minecraft bot control</span>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#facts">Facts</a>
          <a href="#session">Session</a>
          <a href="#flows">Flows</a>
          <Link href="/dashboard" className="nav-primary">Dashboard</Link>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Mineflayer · Azalea · NMP</p>
          <h1>Paste a session. Pick an engine. Watch it join.</h1>
          <p className="lede">
            Z-BEAM is a browser panel for running Minecraft bot sessions. Resolve the IGN, choose the server and engine, then keep logs and controls in the same place.
          </p>
          <div className="hero-actions">
            <Link href="/dashboard" className="button primary">Open dashboard</Link>
            <a href="#facts" className="button secondary">Read the facts</a>
          </div>
          <div className="terminal-line" aria-label="Example terminal log line">
            <span>12:55:10 · joined lobby · hotbar synced</span>
          </div>
        </div>

        <aside id="session" className="session-card" aria-label="Example bot session card">
          <div className="session-head">
            <div className="avatar" aria-hidden>VQ</div>
            <div>
              <h2>vanta_qp</h2>
              <p>eu.minemen.club · Mineflayer 1.8.9</p>
            </div>
            <span className="status">connected</span>
          </div>

          <div className="data-row">
            <span>engine</span>
            <code>mineflayer/1.8.9</code>
          </div>
          <div className="data-row">
            <span>server</span>
            <code>eu.minemen.club:25565</code>
          </div>
          <div className="data-row">
            <span>license</span>
            <code>connect a session to see slot usage</code>
          </div>

          <div className="console" aria-label="Example console output">
            {consoleLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="control-strip" aria-label="Available controls">
            {['chat', 'slot', 'use', 'drop', 'move', 'inventory'].map((item) => <span key={item}>{item}</span>)}
          </div>
        </aside>
      </section>

      <section id="facts" className="facts-section">
        <div className="section-head">
          <p className="eyebrow">What it actually does</p>
          <h2>No fake stats. No mystery features.</h2>
          <p>Live numbers only belong inside a connected dashboard. This page explains the controls and data the panel exposes.</p>
        </div>
        <div className="fact-table">
          {facts.map(([thing, meaning]) => (
            <div className="fact-row" key={thing}>
              <code>{thing}</code>
              <p>{meaning}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="flows" className="flow-section">
        <div>
          <p className="eyebrow">Flows</p>
          <h2>Opener, reply wait, closing script, memory.</h2>
        </div>
        <div className="flow-panel">
          <p><code>opener</code> Bot sends the configured first lines.</p>
          <p><code>wait</code> Incoming chat is watched for a reply from the target.</p>
          <p><code>closing</code> Positive reply triggers the configured closing script.</p>
          <p><code>memory</code> Contact history prevents repeating the same pitch across sessions.</p>
        </div>
      </section>

      <section className="empty-state">
        <div>
          <p className="eyebrow">Live stats</p>
          <h2>Connect a session to see live stats.</h2>
        </div>
        <p>Latency, online count, queue state, and slot usage should come from the running dashboard — not from hardcoded homepage numbers.</p>
      </section>

      <section className="cta">
        <h2>Use the panel when you need the bot state, not a pitch deck.</h2>
        <Link href="/dashboard" className="button primary">Go to dashboard</Link>
      </section>

      <footer>Z-BEAM · Minecraft bot control · © 2026</footer>
    </main>
  );
}

const landingCss = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&family=Inter:wght@400;500;600;700;800&display=swap');

  .zbeam-page {
    min-height: 100vh;
    background: #0d0d0f;
    color: #e8e8e8;
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    letter-spacing: -0.015em;
  }

  .zbeam-page * { box-sizing: border-box; }

  .topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 18px 0;
    background: linear-gradient(180deg, rgba(13,13,15,.98), rgba(13,13,15,.78));
    backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(232,232,232,.08);
  }

  .brand { display: flex; align-items: center; gap: 12px; color: inherit; text-decoration: none; }
  .brand-icon { display: grid; place-items: center; width: 40px; height: 40px; border: 1px solid rgba(232,232,232,.1); border-radius: 12px; background: rgba(255,255,255,.03); }
  .brand-subtitle { display: block; margin-top: 3px; color: #8b8b92; font: 500 11px/1.1 'IBM Plex Mono', monospace; letter-spacing: .02em; }

  .nav-links { display: flex; align-items: center; gap: 6px; padding: 4px; border: 1px solid rgba(232,232,232,.08); border-radius: 999px; background: rgba(255,255,255,.025); }
  .nav-links a { color: #a9a9b2; text-decoration: none; font-size: 13px; font-weight: 600; padding: 9px 13px; border-radius: 999px; }
  .nav-links a:hover { color: #e8e8e8; background: rgba(255,255,255,.06); }
  .nav-links .nav-primary { color: #07111f; background: #3b82f6; }
  .nav-links .nav-primary:hover { color: #07111f; background: #60a5fa; }

  .hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 520px); gap: 42px; width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 92px 0 56px; align-items: start; }
  .eyebrow { margin: 0 0 14px; color: #3b82f6; font: 700 12px/1.2 'IBM Plex Mono', monospace; text-transform: uppercase; letter-spacing: .12em; }
  h1, h2 { margin: 0; color: #f4f4f5; }
  h1 { max-width: 760px; font: 700 clamp(48px, 7vw, 86px)/.92 'IBM Plex Serif', Georgia, serif; letter-spacing: -0.06em; }
  .lede { max-width: 660px; margin: 24px 0 0; color: #b6b6bf; font-size: 17px; line-height: 1.75; }
  .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
  .button { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; padding: 0 18px; border-radius: 10px; font-size: 14px; font-weight: 800; text-decoration: none; }
  .button.primary { color: #07111f; background: #3b82f6; }
  .button.primary:hover { background: #60a5fa; }
  .button.secondary { color: #e8e8e8; border: 1px solid rgba(232,232,232,.12); background: rgba(255,255,255,.035); }
  .button.secondary:hover { border-color: rgba(59,130,246,.5); }

  .terminal-line { width: min(100%, 545px); margin-top: 34px; padding: 14px 16px; border: 1px solid rgba(59,130,246,.28); border-radius: 12px; background: #09090b; color: #bfdbfe; font: 600 13px/1.4 'IBM Plex Mono', monospace; overflow: hidden; }
  .terminal-line span { display: block; width: 0; white-space: nowrap; overflow: hidden; animation: terminal-type 2.2s steps(43, end) .35s forwards; }
  @keyframes terminal-type { to { width: 43ch; } }

  .session-card { border: 1px solid rgba(232,232,232,.1); border-radius: 18px; background: #111114; box-shadow: 0 28px 80px rgba(0,0,0,.35); overflow: hidden; }
  .session-head { display: grid; grid-template-columns: auto 1fr auto; gap: 14px; align-items: center; padding: 18px; border-bottom: 1px solid rgba(232,232,232,.08); }
  .avatar { display: grid; place-items: center; width: 48px; height: 48px; border: 1px solid rgba(59,130,246,.35); border-radius: 12px; background: rgba(59,130,246,.12); color: #bfdbfe; font: 800 14px 'IBM Plex Mono', monospace; }
  .session-head h2 { font: 800 20px/1.1 Inter, sans-serif; }
  .session-head p { margin: 5px 0 0; color: #8b8b92; font: 500 12px 'IBM Plex Mono', monospace; }
  .status { color: #bfdbfe; border: 1px solid rgba(59,130,246,.28); border-radius: 999px; padding: 6px 9px; font: 700 11px 'IBM Plex Mono', monospace; }
  .data-row { display: grid; grid-template-columns: 110px 1fr; gap: 12px; padding: 12px 18px; border-bottom: 1px solid rgba(232,232,232,.06); }
  .data-row span { color: #777780; font-size: 12px; }
  code { font-family: 'IBM Plex Mono', monospace; }
  .data-row code { color: #d7d7dd; font-size: 12px; word-break: break-word; }
  .console { margin: 18px; padding: 14px; border: 1px solid rgba(232,232,232,.08); border-radius: 12px; background: #09090b; }
  .console p { margin: 0; color: #a9a9b2; font: 500 12px/1.8 'IBM Plex Mono', monospace; }
  .console p:last-child { color: #bfdbfe; }
  .control-strip { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 18px 18px; }
  .control-strip span { border: 1px solid rgba(232,232,232,.08); border-radius: 8px; padding: 7px 9px; color: #b6b6bf; font: 700 11px 'IBM Plex Mono', monospace; background: rgba(255,255,255,.025); }

  .facts-section, .flow-section, .empty-state, .cta { width: min(1180px, calc(100% - 32px)); margin: 0 auto; }
  .facts-section { padding: 58px 0; border-top: 1px solid rgba(232,232,232,.08); }
  .section-head { display: grid; grid-template-columns: .8fr 1fr; gap: 32px; align-items: end; margin-bottom: 24px; }
  .section-head h2, .flow-section h2, .empty-state h2, .cta h2 { font: 800 clamp(28px, 4vw, 44px)/1 Inter, sans-serif; letter-spacing: -0.045em; }
  .section-head p:last-child { margin: 0; color: #a9a9b2; line-height: 1.7; }
  .fact-table { border: 1px solid rgba(232,232,232,.1); border-radius: 14px; overflow: hidden; background: #101013; }
  .fact-row { display: grid; grid-template-columns: 220px 1fr; gap: 24px; padding: 16px 18px; border-bottom: 1px solid rgba(232,232,232,.07); }
  .fact-row:last-child { border-bottom: 0; }
  .fact-row code { color: #bfdbfe; font-weight: 700; }
  .fact-row p { margin: 0; color: #b6b6bf; line-height: 1.6; }

  .flow-section { display: grid; grid-template-columns: .75fr 1fr; gap: 28px; padding: 42px 0 58px; border-top: 1px solid rgba(232,232,232,.08); }
  .flow-panel { border-left: 2px solid #3b82f6; padding-left: 18px; }
  .flow-panel p { margin: 0 0 14px; color: #b6b6bf; line-height: 1.65; }
  .flow-panel code { display: inline-block; min-width: 78px; color: #bfdbfe; font-weight: 700; }

  .empty-state { display: grid; grid-template-columns: .8fr 1fr; gap: 28px; padding: 28px; border: 1px dashed rgba(59,130,246,.35); border-radius: 16px; background: rgba(59,130,246,.045); }
  .empty-state p:last-child { margin: 0; color: #a9a9b2; line-height: 1.7; }

  .cta { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 58px 0; border-bottom: 1px solid rgba(232,232,232,.08); }
  .cta h2 { max-width: 760px; }
  footer { width: min(1180px, calc(100% - 32px)); margin: 0 auto; padding: 22px 0 36px; color: #777780; font: 600 12px 'IBM Plex Mono', monospace; }

  @media (max-width: 860px) {
    .topbar { align-items: flex-start; }
    .nav-links { display: none; }
    .hero, .section-head, .flow-section, .empty-state { grid-template-columns: 1fr; }
    .hero { padding-top: 58px; }
    .session-card { min-width: 0; }
    .fact-row { grid-template-columns: 1fr; gap: 8px; }
    .cta { align-items: flex-start; flex-direction: column; }
  }

  @media (max-width: 460px) {
    .hero { width: min(100% - 24px, 1180px); }
    h1 { font-size: 44px; }
    .data-row { grid-template-columns: 1fr; gap: 6px; }
    .terminal-line { font-size: 11px; }
    .terminal-line span { animation: none; width: auto; white-space: normal; }
  }
`;
