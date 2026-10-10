"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo, Wordmark } from "./Logo";

export const features = [
  {
    title: "Resolve account",
    text: "Paste a session token and Z-BEAM turns it into the Minecraft IGN before launch.",
    tag: "Resolve",
    icon: "resolve",
    detail: "token → IGN",
    visual: "skin",
  },
  {
    title: "Pick server",
    text: "Choose Minemen, CatPvP, PvP HQ, or your saved target and continue without extra clutter.",
    tag: "Launch",
    icon: "server",
    detail: "server profile",
    visual: "server",
  },
  {
    title: "Watch live logs",
    text: "Join attempts, kicks, reconnects, and chat events stay readable beside the bot.",
    tag: "Logs",
    icon: "logs",
    detail: "live console",
  },
  {
    title: "Control session",
    text: "Open the bot to send chat, use hotbar actions, move, inspect inventory, and stop safely.",
    tag: "Control",
    icon: "control",
    detail: "chat + inventory",
  },
  {
    title: "Run flows",
    text: "Use opener scripts, wait for replies, send closing messages, and dedupe contacts cleanly.",
    tag: "Flow",
    icon: "flow",
    detail: "scripted steps",
  },
  {
    title: "Manage access",
    text: "Redeem keys, see used slots, free slots, and the remaining active time in one place.",
    tag: "Access",
    icon: "access",
    detail: "license slots",
  },
];

const bots = [
  { name: "vyrex_", skin: "wisp", server: "eu.minemen.club", region: "EU", mode: "1v1", state: "online", note: "Chat, inventory and controls are live." },
  { name: "aero_clip", skin: "xNestorio", server: "mc.hypixel.net", region: "NA", mode: "Lobby", state: "joining", note: "Resolving profile and joining server." },
  { name: "noxline", skin: "Stimpy", server: "catpvp.net", region: "AS", mode: "Manual", state: "idle", note: "Ready for launch when you are." },
];

const logs = [
  "12:44:01 · resolving profile",
  "12:44:02 · connecting server",
  "12:44:03 · join success",
];

export default function LandingPage() {
  // The top bar is hidden by default and only slides in when the pointer
  // enters the strip along the top edge (or the bar itself, so the pointer
  // can travel into it without it snapping shut).
  const [navPeek, setNavPeek] = useState(false);

  // Scroll reveal: every [data-reveal] node fades/slides in once as it enters
  // the viewport. Unobserved after firing, and skipped entirely when the user
  // prefers reduced motion.
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (
      !nodes.length ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      nodes.forEach((n) => n.classList.add("is-revealed"));
      return;
    }
    // Once the entrance animation finishes, drop the reveal classes so the
    // element's own hover transforms aren't pinned by animation fill-mode.
    const reveal = (el: HTMLElement) => {
      if (el.classList.contains("is-revealed")) return;
      el.classList.add("is-revealed");
      el.addEventListener(
        "animationend",
        (e) => {
          if (e.target !== el) return;
          el.classList.remove("is-revealed", "reveal-pending");
        },
        { once: true },
      );
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          reveal(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    nodes.forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.9 && r.bottom > 0) {
        // Already on screen — animate it in now.
        reveal(n);
      } else {
        // Off screen — hide it until it scrolls in.
        n.classList.add("reveal-pending");
        io.observe(n);
      }
    });
    return () => io.disconnect();
  }, []);

  return (
    <main className="home-shell">
      <style>{css}</style>

      {/* A single blurred pill pinned to the top edge. Collapsed it is just
          the logo mark; hovering (or focusing, or tapping) expands it to the
          full bar. No separate trigger element, so there is nothing to get
          stuck half-open. */}
      <nav
        className={`top-nav ${navPeek ? "is-open" : ""}`}
        onMouseEnter={() => setNavPeek(true)}
        onMouseLeave={() => setNavPeek(false)}
        onFocus={() => setNavPeek(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            setNavPeek(false);
          }
        }}
        onClick={() => setNavPeek(true)}
        aria-label="Main"
      >
        <Link href="/" className="brand">
          <span className="brand-mark"><Logo size={26} /></span>
          <span className="brand-copy">
            <Wordmark height={23} />
            <small>minecraft bot panel</small>
          </span>
        </Link>
        <div className="nav-links">
          <a href="#preview">Preview</a>
          <a href="#features">Features</a>
          <Link href="/license">License</Link>
          <Link href="/dashboard" className="nav-cta">Dashboard</Link>
        </div>
      </nav>

      <section className="discord-banner" aria-label="Discord server notice">
        <div className="discord-copy">
          <span className="discord-icon" aria-hidden>
            <DiscordIcon />
          </span>
          <div>
            <strong>Join the Z-BEAM Discord</strong>
            <p>Updates, setup help, license support, release notes, and server-specific fixes.</p>
          </div>
        </div>
        <a className="discord-button" href="https://discord.gg/" target="_blank" rel="noreferrer">
          <DiscordIcon small />
          Discord
        </a>
      </section>

      <section className="hero">
        <div className="hero-copy" data-reveal>
          <p className="kicker">session tokens · servers · live console</p>
          <h1>Paste a session. Pick a server. Run the bot.</h1>
          <p className="lead">
            Z-BEAM keeps Minecraft bot sessions in one smooth panel: resolve the IGN, choose the server, then watch logs and control the bot live.
          </p>
          <div className="actions">
            <Link href="/dashboard" className="btn primary">Open dashboard</Link>
            <a href="#preview" className="btn ghost">See preview</a>
          </div>
          <div className="proof-row" aria-label="Quick benefits">
            <span>Launch from one panel</span>
            <span>Saved server choices</span>
            <span>Live logs and controls</span>
          </div>
        </div>

        <div id="preview" className="hero-stage" aria-label="Bot cards preview" data-reveal>
          <div className="stage-glow" />
          <div className="preview-panel">
            <div className="preview-topline">
              <span>live sessions</span>
              <code>theme linked</code>
            </div>
            <div className="preview-list">
              {bots.map((bot, index) => (
                <article key={bot.name} className={`bot-card card-${index}`}>
                  <div className="bot-head">
                    <span className="bot-avatar">
                      <img src={`https://visage.surgeplay.com/bust/180/${bot.skin}`} alt="" />
                    </span>
                    <div className="bot-title">
                      <h2>{bot.name}</h2>
                      <p>{bot.server}</p>
                    </div>
                    <code className={`state-pill ${bot.state}`}>{bot.state}</code>
                  </div>
                  <p className="bot-note">{bot.note}</p>
                  <div className="bot-meta">
                    <span>{bot.region}</span>
                    <span>{bot.mode}</span>
                    <span>{index === 0 ? "live" : "standby"}</span>
                  </div>
                  <div className="bot-actions" aria-hidden>
                    <button type="button" className={index === 0 ? "preview-btn stop" : "preview-btn start"}>{index === 0 ? "Stop" : "Start"}</button>
                    <button type="button" className="preview-btn open">Open</button>
                    <button type="button" className="preview-delete" title="Delete preview bot">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 7h16" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M6 7l1 14h10l1-14" />
                        <path d="M9 7V4h6v3" />
                      </svg>
                    </button>
                  </div>
                  {index === 0 && (
                    <pre className="mini-console">{logs.join("\n")}</pre>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="section-title" data-reveal>
          <p className="kicker">what the panel handles</p>
          <h2>Less switching around. More session state on screen.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature, index) => (
            <article
              className="feature-card"
              key={feature.title}
              data-reveal
              style={{ ["--d" as string]: `${(index % 3) * 80}ms` }}
            >
              <div className="feature-card-top">
                <span className="feature-icon" aria-hidden><FeatureIcon kind={feature.icon} /></span>
                <code>{String(index + 1).padStart(2, "0")}</code>
              </div>
              <span className="feature-tag">{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <div className="feature-detail">
                <span>{feature.detail}</span>
                <b>{index === 0 ? "resolved" : index === 1 ? "ready" : "synced"}</b>
              </div>
              {index === 0 && (
                <div className="resolve-preview" aria-label="Session resolve preview">
                  <span className="token-chip">eyJ...session</span>
                  <span className="resolve-arrow">→</span>
                  <span className="ign-chip">
                    <img src="https://visage.surgeplay.com/face/48/wisp" alt="" />
                    <strong>vyrex_</strong>
                  </span>
                </div>
              )}
              {index === 1 && (
                <div className="server-preview" aria-label="Server profile preview">
                  <img src="https://api.mcsrvstat.us/icon/eu.minemen.club" alt="" />
                  <div>
                    <strong>eu.minemen.club</strong>
                    <span>Minemen · EU profile</span>
                  </div>
                </div>
              )}
              {index === 2 && (
                <div className="logs-preview" aria-label="Logs preview">
                  <span>12:44:01</span><b>profile resolved</b>
                  <span>12:44:02</span><b>joining server</b>
                  <span>12:44:03</span><b>session live</b>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="flow-band" data-reveal>
        <div>
          <p className="kicker">session flow</p>
          <h2>Resolve → launch → watch → control.</h2>
        </div>
        <div className="flow-line">
          {["token", "server", "console", "controls"].map((step, index) => (
            <span key={step}>
              <b>{String(index + 1).padStart(2, "0")}</b>
              {step}
            </span>
          ))}
        </div>
      </section>

      <footer>
        <span>Z-BEAM · Minecraft bot control · © 2026</span>
      </footer>
    </main>
  );
}


function DiscordIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? 16 : 24} height={small ? 16 : 24} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function FeatureIcon({ kind }: { kind: string }) {
  if (kind === "resolve") {
    return <img src="https://visage.surgeplay.com/face/64/wisp" alt="" />;
  }
  if (kind === "server") {
    return <img src="https://api.mcsrvstat.us/icon/eu.minemen.club" alt="" />;
  }
  const paths: Record<string, string[]> = {
    logs: ["M4 5h16", "M4 12h16", "M4 19h10"],
    control: ["M6 12h12", "M12 6v12", "M5 5h14v14H5z"],
    flow: ["M13 2 4 14h7l-1 8 10-13h-7l0-7z"],
    access: ["M3 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z", "M13 5v14"],
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {(paths[kind] || paths.logs).map((d) => <path key={d} d={d} />)}
    </svg>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

  :root {
    --bg: #080a0d;
    --panel: #10141a;
    --panel-2: #0c1015;
    --line: color-mix(in srgb, var(--zb-accent-400) 16%, transparent);
    --text: #edf7fb;
    --muted: #7f9198;
    --accent: var(--zb-accent-400);
    --accent-soft: color-mix(in srgb, var(--zb-accent-400) 12%, transparent);
  }

  .home-shell {
    min-height: 100vh;
    overflow-x: clip;
    overflow-y: visible;
    /* Transparent: the Minecraft sunset backdrop (app-level) shows through.
       Only a soft veil is laid down so copy stays readable over the horizon. */
    background:
      radial-gradient(circle at 72% 12%, color-mix(in srgb, var(--accent) 10%, transparent), transparent 28rem),
      linear-gradient(180deg, rgba(8,4,12,0.35) 0%, rgba(6,3,10,0.55) 60%, rgba(4,2,7,0.72) 100%);
    color: var(--text);
    font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  }

  .home-shell { padding-top: 92px; }

  /* Scroll reveal. Nodes start hidden only once JS has marked them
     with reveal-pending, so the SSR HTML is never blank if scripts fail. */
  [data-reveal].reveal-pending {
    opacity: 0;
    transform: translateY(26px);
  }
  [data-reveal].is-revealed {
    animation: reveal-in 0.72s cubic-bezier(0.16, 1, 0.3, 1) both;
    animation-delay: var(--d, 0ms);
  }
  @keyframes reveal-in {
    from {
      opacity: 0;
      transform: translateY(26px);
      filter: blur(6px);
    }
    to {
      opacity: 1;
      transform: none;
      filter: none;
    }
  }

  .home-shell * { box-sizing: border-box; }

  .hero,
  .features,
  .flow-band,
  footer {
    width: min(1120px, calc(100vw - 32px));
    margin: 0 auto;
  }

  /* Collapsed state: a small blurred pill holding only the logo mark.
     Hovering or focusing it expands into the full bar. Driven by CSS
     :hover/:focus-within so the reaction is instant, with the is-open
     class covering touch where hover never fires. */
  .top-nav {
    position: fixed;
    top: 14px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 80;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 8px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(8, 10, 13, 0.72);
    box-shadow: 0 18px 60px -42px rgba(0, 0, 0, 0.95);
    backdrop-filter: blur(20px) saturate(120%);
    cursor: pointer;
    transition:
      gap 320ms cubic-bezier(0.16, 1, 0.3, 1),
      padding 320ms cubic-bezier(0.16, 1, 0.3, 1),
      border-color 260ms ease,
      background 260ms ease,
      box-shadow 260ms ease;
  }

  .top-nav:hover,
  .top-nav:focus-within,
  .top-nav.is-open {
    gap: 14px;
    padding: 8px 8px 8px 8px;
    border-color: color-mix(in srgb, var(--accent) 30%, var(--line));
    background: rgba(8, 10, 13, 0.88);
    box-shadow:
      0 18px 60px -42px rgba(0, 0, 0, 0.95),
      0 0 30px -16px color-mix(in srgb, var(--accent) 60%, transparent);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 0;
    color: var(--text);
    text-decoration: none;
    overflow: hidden;
    transition: gap 320ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .top-nav:hover .brand,
  .top-nav:focus-within .brand,
  .top-nav.is-open .brand {
    gap: 11px;
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    flex: 0 0 auto;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.045);
  }

  /* Wordmark + tagline are hidden until expansion; animated by max-width so
     the pill genuinely grows rather than having content pop in. */
  .brand-copy {
    display: block;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    max-width: 0;
    opacity: 0;
    transition:
      max-width 320ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 220ms ease;
  }

  .top-nav:hover .brand-copy,
  .top-nav:focus-within .brand-copy,
  .top-nav.is-open .brand-copy {
    max-width: 240px;
    opacity: 1;
  }

  .brand small {
    display: block;
    margin-top: 1px;
    color: var(--muted);
    font: 600 11px/1.1 'IBM Plex Mono', monospace;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 4px;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    max-width: 0;
    opacity: 0;
    transition:
      max-width 360ms cubic-bezier(0.16, 1, 0.3, 1),
      opacity 240ms ease;
  }

  .top-nav:hover .nav-links,
  .top-nav:focus-within .nav-links,
  .top-nav.is-open .nav-links {
    max-width: 520px;
    opacity: 1;
  }

  .discord-banner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    width: min(1120px, calc(100vw - 32px));
    min-height: 86px;
    margin: 18px auto 0;
    padding: 16px;
    border: 1px solid rgba(88, 101, 242, 0.32);
    border-radius: 24px;
    background:
      linear-gradient(90deg, rgba(88, 101, 242, 0.16), rgba(255,255,255,0.035)),
      rgba(8, 10, 13, 0.62);
    backdrop-filter: blur(18px);
  }

  .discord-copy {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
  }

  .discord-icon {
    display: grid;
    place-items: center;
    width: 52px;
    height: 52px;
    flex: 0 0 auto;
    border-radius: 18px;
    background: linear-gradient(135deg, #5865F2, #7983ff);
    color: #fff;
    box-shadow: 0 18px 55px -32px rgba(88,101,242,.95), inset 0 1px 0 rgba(255,255,255,.18);
  }

  .discord-icon svg,
  .discord-button svg { width: 22px; height: 22px; }

  .discord-copy strong {
    display: block;
    color: var(--text);
    font-size: 15px;
  }

  .discord-copy p {
    margin-top: 4px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.45;
  }

  .discord-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 44px;
    padding: 0 16px;
    border-radius: 15px;
    background: #5865F2;
    color: white;
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 18px 55px -30px rgba(88,101,242,.9);
    transition: transform 180ms ease, background 180ms ease;
  }

  .discord-button:hover { transform: translateY(-1px); background: #6673ff; }

  .nav-links a {
    color: var(--muted);
    text-decoration: none;
    padding: 10px 13px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 700;
    transition: color 180ms ease, background 180ms ease, transform 180ms ease;
  }

  .nav-links a:hover {
    color: var(--text);
    background: rgba(255, 255, 255, 0.045);
    transform: translateY(-1px);
  }

  .nav-links .nav-cta {
    color: #031316;
    background: var(--accent);
  }

  .hero {
    display: grid;
    grid-template-columns: minmax(0, 0.92fr) minmax(360px, 1.08fr);
    gap: 54px;
    align-items: center;
    padding: 92px 0 86px;
  }

  .kicker {
    margin: 0 0 14px;
    color: var(--accent);
    font: 700 12px/1.2 'IBM Plex Mono', monospace;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1,
  h2,
  h3,
  p { margin: 0; }

  h1 {
    max-width: 720px;
    font-size: clamp(40px, 5.4vw, 68px);
    line-height: 0.96;
    letter-spacing: -0.07em;
    font-weight: 800;
    font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  }

  .lead {
    max-width: 610px;
    margin-top: 24px;
    color: var(--muted);
    font-size: 17px;
    line-height: 1.75;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 32px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 46px;
    padding: 0 18px;
    border: 1px solid var(--line);
    border-radius: 14px;
    color: var(--text);
    text-decoration: none;
    font-size: 14px;
    font-weight: 800;
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .btn:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  }

  .btn.primary {
    color: #031316;
    background: var(--accent);
    border-color: var(--accent);
  }

  .btn.ghost {
    background: rgba(255, 255, 255, 0.025);
  }

  .proof-row {
    display: flex;
    flex-wrap: wrap;
    gap: 9px;
    margin-top: 24px;
  }

  code,
  .proof-row code,
  .bot-card code,
  .mini-console,
  .flow-line span,
  .feature-row code {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
  }

  .proof-row span {
    padding: 8px 10px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: color-mix(in srgb, var(--accent) 4%, transparent);
    color: #bff7ff;
    font: 700 12px 'IBM Plex Mono', ui-monospace, monospace;
  }

  .hero-stage {
    position: relative;
    min-height: 560px;
    perspective: 1200px;
  }

  .stage-glow {
    position: absolute;
    inset: 38px 14px 24px;
    border-radius: 999px;
    background: radial-gradient(circle, color-mix(in srgb, var(--accent) 20%, transparent), transparent 62%);
    filter: blur(64px);
  }

  .preview-panel {
    position: relative;
    overflow: visible;
    min-height: 560px;
    border: 1px solid var(--line);
    border-radius: 34px;
    background: linear-gradient(180deg, rgba(16, 20, 26, 0.78), rgba(6, 10, 14, 0.82));
    padding: 16px;
    backdrop-filter: blur(18px);
    transform: rotateX(5deg) rotateY(-8deg) rotateZ(0.5deg);
    transform-style: preserve-3d;
    box-shadow: 0 46px 110px -58px color-mix(in srgb, var(--accent) 60%, transparent), 0 34px 70px -50px rgba(0,0,0,.95);
  }

  .preview-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 6px 14px;
    color: var(--muted);
    font: 700 12px 'IBM Plex Mono', monospace;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .preview-topline code {
    color: var(--accent);
    font-size: 11px;
  }

  .preview-list {
    display: grid;
    gap: 18px;
    transform-style: preserve-3d;
  }

  .bot-card {
    position: relative;
    border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
    border-radius: 24px;
    background:
      radial-gradient(circle at 8% 0%, color-mix(in srgb, var(--accent) 13%, transparent), transparent 14rem),
      linear-gradient(180deg, rgba(18, 25, 31, 0.98), rgba(9, 13, 18, 0.98));
    padding: 16px;
    transform-style: preserve-3d;
    box-shadow: 0 28px 60px -44px rgba(0,0,0,.95), inset 0 1px 0 rgba(255,255,255,.05);
    animation: card-float 6s ease-in-out infinite;
  }

  .bot-card::after {
    content: "";
    position: absolute;
    inset: 10px;
    z-index: -1;
    border-radius: inherit;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    filter: blur(26px);
    transform: translateZ(-36px);
    opacity: .55;
  }

  .card-0 { z-index: 3; transform: translate3d(18px, 0, 54px) rotateY(7deg) rotateZ(-1deg); }
  .card-1 { z-index: 2; opacity: 0.94; animation-delay: -1.8s; transform: translate3d(-18px, 0, 22px) rotateY(-7deg) rotateZ(1.3deg); }
  .card-2 { z-index: 1; opacity: 0.9; animation-delay: -3.4s; transform: translate3d(26px, 0, -6px) rotateY(8deg) rotateZ(-1.5deg); }

  @keyframes card-float {
    0%, 100% { translate: 0 0; }
    50% { translate: 0 -10px; }
  }

  .bot-head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 12px;
    align-items: center;
  }

  .bot-avatar {
    display: grid;
    place-items: end center;
    width: 58px;
    height: 64px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 18px;
    background:
      radial-gradient(circle at 50% 10%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%),
      #090d12;
  }

  .bot-avatar img {
    width: 120%;
    height: 120%;
    object-fit: contain;
    object-position: center bottom;
    image-rendering: pixelated;
    filter: drop-shadow(0 12px 18px rgba(0,0,0,.45));
  }

  .bot-head h2 {
    font-size: 18px;
    letter-spacing: -0.03em;
  }

  .bot-head p {
    margin-top: 4px;
    color: var(--muted);
    font: 600 12px 'IBM Plex Mono', monospace;
  }

  .bot-title { min-width: 0; }

  .bot-head code,
  .state-pill {
    color: var(--accent);
    font-size: 12px;
    font-weight: 800;
  }

  .state-pill {
    border: 1px solid color-mix(in srgb, var(--accent) 22%, transparent);
    border-radius: 999px;
    padding: 7px 9px;
    background: color-mix(in srgb, var(--accent) 8%, transparent);
  }

  .bot-note {
    margin-top: 12px;
    color: #a4b2ba;
    font-size: 13px;
    line-height: 1.45;
  }

  .bot-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .bot-meta span {
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 7px 9px;
    color: #c9f8ff;
    background: rgba(255, 255, 255, 0.025);
    font: 700 11px 'IBM Plex Mono', monospace;
  }

  .bot-actions {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 8px;
    margin-top: 14px;
  }

  .preview-btn,
  .preview-delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 38px;
    border-radius: 14px;
    border: 0;
    font-size: 12px;
    font-weight: 900;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.04);
    cursor: pointer;
    transition: transform 160ms ease, filter 160ms ease, border-color 160ms ease;
  }

  .preview-btn:hover,
  .preview-delete:hover { transform: translateY(-1px); filter: brightness(1.08); }
  .preview-btn:active,
  .preview-delete:active { transform: translateY(0) scale(.985); }

  .preview-btn.start {
    border: 1px solid rgba(52, 211, 153, .35);
    background: linear-gradient(180deg, rgba(52, 211, 153, .95), rgba(16, 185, 129, .82));
    color: #02140f;
  }

  .preview-btn.stop {
    border: 1px solid rgba(248, 113, 113, .35);
    background: linear-gradient(180deg, rgba(248, 113, 113, .92), rgba(225, 29, 72, .82));
    color: #fff1f2;
  }

  .preview-btn.open {
    border: 1px solid color-mix(in srgb, var(--accent) 34%, transparent);
    background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 22%, transparent), color-mix(in srgb, var(--accent) 10%, transparent));
    color: #eef2ff;
  }

  .preview-delete {
    width: 38px;
    border: 1px solid rgba(248, 113, 113, .30);
    background: rgba(239, 68, 68, .12);
    color: #fca5a5;
  }

  .preview-delete svg {
    width: 15px;
    height: 15px;
  }

  .mini-console {
    margin: 14px 0 0;
    padding: 12px;
    border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
    border-radius: 18px;
    background: #06090d;
    color: #90a4ac;
    font-size: 12px;
    line-height: 1.75;
    white-space: pre-wrap;
  }

  .features,
  .flow-band {
    border-top: 1px solid var(--line);
    padding: 72px 0;
  }

  .section-title {
    display: grid;
    grid-template-columns: 0.9fr 1.1fr;
    gap: 28px;
    align-items: end;
    margin-bottom: 30px;
  }

  .section-title h2,
  .flow-band h2 {
    font-size: clamp(30px, 4vw, 48px);
    line-height: 1;
    letter-spacing: -0.06em;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
  }

  .feature-card {
    position: relative;
    min-height: 248px;
    overflow: hidden;
    border: 1px solid var(--line);
    border-radius: 26px;
    background:
      radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 13rem),
      rgba(255, 255, 255, 0.026);
    padding: 18px;
    box-shadow: 0 24px 70px -58px rgba(0,0,0,.95);
    transition: transform 180ms ease, border-color 180ms ease, background 180ms ease;
  }

  .feature-card:hover {
    transform: translateY(-4px);
    border-color: color-mix(in srgb, var(--accent) 34%, transparent);
    background:
      radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 13rem),
      rgba(255, 255, 255, 0.04);
  }

  .feature-card::after {
    content: "";
    position: absolute;
    inset: auto 18px 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 42%, transparent), transparent);
    opacity: 0;
    transition: opacity 180ms ease;
  }

  .feature-card:hover::after { opacity: 1; }

  .feature-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .feature-icon {
    display: grid;
    place-items: center;
    width: 46px;
    height: 46px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: color-mix(in srgb, var(--accent) 8%, transparent);
    color: var(--accent);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.05);
    overflow: hidden;
  }

  .feature-icon img {
    width: 32px;
    height: 32px;
    border-radius: 9px;
    image-rendering: pixelated;
  }

  .feature-icon svg {
    width: 22px;
    height: 22px;
  }

  .feature-card-top code {
    color: color-mix(in srgb, var(--accent) 70%, #fff);
    font: 800 12px 'IBM Plex Mono', monospace;
    opacity: .76;
  }

  .feature-tag {
    display: inline-flex;
    margin-top: 18px;
    border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
    border-radius: 999px;
    padding: 6px 9px;
    color: var(--accent);
    background: color-mix(in srgb, var(--accent) 6%, transparent);
    font: 800 11px 'IBM Plex Mono', monospace;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .feature-card h3 {
    margin-top: 14px;
    color: var(--text);
    font-size: 20px;
    line-height: 1.05;
    letter-spacing: -0.045em;
  }

  .feature-card p {
    margin-top: 10px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.65;
  }

  .feature-detail {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-top: 16px;
    border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
    border-radius: 16px;
    background: rgba(0,0,0,.18);
    padding: 10px 12px;
    font-size: 12px;
    color: #adbbc1;
  }

  .feature-detail span { white-space: nowrap; }

  .feature-detail b {
    color: var(--accent);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: .1em;
  }

  .resolve-preview,
  .server-preview {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
    border-radius: 18px;
    padding: 9px;
    background: #06090d;
  }

  .resolve-preview { font: 700 11px 'IBM Plex Mono', monospace; }

  .token-chip,
  .ign-chip {
    min-width: 0;
    border-radius: 13px;
    background: rgba(255,255,255,.045);
    padding: 8px 9px;
    color: #aebdc4;
  }

  .token-chip { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .resolve-arrow { color: var(--accent); }

  .ign-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: #edf7fb;
  }

  .ign-chip img,
  .server-preview img {
    border-radius: 6px;
    image-rendering: pixelated;
  }

  .ign-chip img { width: 20px; height: 20px; }

  .server-preview img { width: 34px; height: 34px; }

  .server-preview div {
    display: grid;
    min-width: 0;
    gap: 2px;
  }

  .server-preview strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #edf7fb;
    font-size: 12px;
  }

  .server-preview span {
    color: var(--muted);
    font-size: 11px;
  }

  .logs-preview {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 7px 10px;
    margin-top: 10px;
    border: 1px solid color-mix(in srgb, var(--accent) 12%, transparent);
    border-radius: 18px;
    background: #06090d;
    padding: 10px;
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 11px;
  }

  .logs-preview span { color: #60727b; }
  .logs-preview b { color: #c6d3d8; font-weight: 700; }

  .flow-band {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 32px;
    align-items: center;
  }

  .flow-line {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
  }

  .flow-line span {
    display: grid;
    gap: 8px;
    min-height: 82px;
    place-items: center;
    border: 1px solid var(--line);
    border-radius: 20px;
    background: color-mix(in srgb, var(--accent) 4%, transparent);
    color: #d7fbff;
    font-size: 12px;
    font-weight: 900;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: .08em;
  }

  .flow-line b {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--accent) 14%, transparent);
    color: var(--accent);
    font-size: 11px;
  }

  footer {
    border-top: 1px solid var(--line);
    padding: 24px 0 40px;
    color: var(--muted);
    font: 600 12px 'IBM Plex Mono', monospace;
  }

  @media (max-width: 880px) {
    .nav-links a { padding: 9px 10px; }
    .hero,
    .section-title,
    .flow-band { grid-template-columns: 1fr; }
    .feature-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .hero-stage { min-height: auto; perspective: none; }
    .preview-panel { min-height: auto; transform: none; overflow: hidden; }
    .preview-list { display: grid; height: auto; gap: 12px; }
    .bot-card { position: relative; top: auto; transform: none !important; }
  }

  @media (max-width: 640px) {
    .discord-banner { align-items: stretch; flex-direction: column; }
    .discord-button { width: 100%; }
  }

  @media (max-width: 560px) {
    .hero,
    .features,
    .flow-band,
    footer { width: min(calc(100vw - 20px), 1120px); }
    /* The pill can only grow so far before it runs off the viewport, so the
       links wrap into a compact grid underneath the brand row. */
    .top-nav { max-width: calc(100vw - 20px); border-radius: 22px; }
    .top-nav:hover,
    .top-nav:focus-within,
    .top-nav.is-open { flex-wrap: wrap; justify-content: center; }
    .nav-links { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); width: 100%; gap: 6px; }
    .nav-links a { display: flex; justify-content: center; padding: 8px; font-size: 12px; }
    .brand-mark { width: 36px; height: 36px; }
    .brand small { font-size: 10px; }
    .home-shell { padding-top: 92px; }
    h1 { font-size: clamp(34px, 11vw, 40px); letter-spacing: -0.055em; }
    .lead { font-size: 15px; line-height: 1.65; }
    .hero { gap: 34px; padding-top: 42px; padding-bottom: 56px; }
    .actions .btn { flex: 1 1 150px; }
    .proof-row span { font-size: 11px; }
    .hero-stage { min-height: auto; }
    .bot-card { width: 100%; }
    .bot-head { grid-template-columns: auto 1fr; }
    .state-pill { grid-column: 1 / -1; width: fit-content; }
    .feature-grid { grid-template-columns: 1fr; }
    .feature-detail, .resolve-preview { flex-wrap: wrap; }
    .logs-preview { grid-template-columns: 1fr; }
    .flow-line { grid-template-columns: 1fr 1fr; }
  }

  @media (prefers-reduced-motion: reduce) {
    .bot-card,
    .nav-links a,
    .btn { animation: none; transition: none; }
    [data-reveal].reveal-pending { opacity: 1; transform: none; }
    [data-reveal].is-revealed { animation: none; }
  }
`;
