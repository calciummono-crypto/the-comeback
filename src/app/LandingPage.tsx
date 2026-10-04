import Link from "next/link";
import { Logo, Wordmark } from "./Logo";

export const features = [
  {
    title: "Token to IGN",
    text: "Paste a session token and resolve the Minecraft name before launch.",
    tag: "Resolve",
  },
  {
    title: "Engine per server",
    text: "Mineflayer for 1.8.9, Azalea for modern sidecar runs, NMP for raw protocol sessions.",
    tag: "Engines",
  },
  {
    title: "Console in the card",
    text: "Join logs, kicks, reconnects, and inventory syncs stay beside the bot.",
    tag: "Logs",
  },
  {
    title: "Live controls",
    text: "Send chat, change hotbar slot, use or drop items, move, and inspect inventory.",
    tag: "Control",
  },
  {
    title: "Flows",
    text: "Run opener scripts, wait for replies, send closing scripts, and dedupe contacts.",
    tag: "Flow",
  },
  {
    title: "License slots",
    text: "Redeem keys and see used slots, remaining slots, and active time.",
    tag: "Access",
  },
];

const bots = [
  { name: "vyrex_", skin: "wisp", server: "eu.minemen.club", engine: "Mineflayer", version: "1.8.9", state: "online" },
  { name: "aero_clip", skin: "xNestorio", server: "mc.hypixel.net", engine: "Azalea", version: "1.20.4", state: "joining" },
  { name: "noxline", skin: "Stimpy", server: "catpvp.net", engine: "NMP", version: "raw", state: "idle" },
];

const logs = [
  "12:44:01 · resolving profile: vyrex_",
  "12:44:02 · connecting eu.minemen.club:25565",
  "12:44:03 · join success · version 1.8.9",
  "12:44:03 · inventory synced · hotbar slot 1 active",
];

export default function LandingPage() {
  return (
    <main className="home-shell">
      <style>{css}</style>

      <nav className="top-nav">
        <Link href="/" className="brand">
          <span className="brand-mark"><Logo size={28} /></span>
          <span>
            <Wordmark height={24} />
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

      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">session tokens · engines · live console</p>
          <h1>Paste a session. Pick an engine. Run the bot.</h1>
          <p className="lead">
            Z-BEAM keeps Minecraft bot sessions in one smooth panel: resolve the IGN, choose Mineflayer, Azalea, or NMP, then watch logs and control the bot live.
          </p>
          <div className="actions">
            <Link href="/dashboard" className="btn primary">Open dashboard</Link>
            <a href="#preview" className="btn ghost">See preview</a>
          </div>
          <div className="proof-row">
            <code>Mineflayer 1.8.9</code>
            <code>Azalea sidecar</code>
            <code>NMP raw</code>
          </div>
        </div>

        <div id="preview" className="hero-stage" aria-label="Animated bot cards preview">
          <div className="stage-glow" />
          {bots.map((bot, index) => (
            <article key={bot.name} className={`bot-card card-${index}`}>
              <div className="bot-head">
                <span className="bot-avatar">
                  <img src={`https://visage.surgeplay.com/bust/160/${bot.skin}`} alt="" />
                </span>
                <div>
                  <h2>{bot.name}</h2>
                  <p>{bot.server}</p>
                </div>
                <code>{bot.state}</code>
              </div>
              <div className="bot-meta">
                <span>{bot.engine}</span>
                <span>{bot.version}</span>
              </div>
              {index === 0 && (
                <pre className="mini-console">{logs.join("\n")}</pre>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="features">
        <div className="section-title">
          <p className="kicker">what the panel handles</p>
          <h2>Less switching around. More session state on screen.</h2>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <div className="feature-row" key={feature.title}>
              <code>{feature.tag}</code>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flow-band">
        <div>
          <p className="kicker">session flow</p>
          <h2>Resolve → launch → watch → control.</h2>
        </div>
        <div className="flow-line">
          <span>token</span>
          <span>engine</span>
          <span>console</span>
          <span>controls</span>
        </div>
      </section>

      <footer>
        <span>Z-BEAM · Minecraft bot control · © 2026</span>
      </footer>
    </main>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600;700&family=Inter:wght@400;500;600;700;800&display=swap');

  :root {
    --bg: #080a0d;
    --panel: #10141a;
    --panel-2: #0c1015;
    --line: rgba(34, 211, 238, 0.16);
    --text: #edf7fb;
    --muted: #7f9198;
    --accent: #22d3ee;
    --accent-soft: rgba(34, 211, 238, 0.12);
  }

  .home-shell {
    min-height: 100vh;
    overflow: hidden;
    background:
      radial-gradient(circle at 72% 12%, rgba(34, 211, 238, 0.13), transparent 28rem),
      linear-gradient(180deg, #080a0d 0%, #0b0e12 100%);
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .home-shell * { box-sizing: border-box; }

  .top-nav,
  .hero,
  .features,
  .flow-band,
  footer {
    width: min(1120px, calc(100% - 32px));
    margin: 0 auto;
  }

  .top-nav {
    position: sticky;
    top: 14px;
    z-index: 30;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: 14px;
    padding: 12px 14px;
    border: 1px solid var(--line);
    border-radius: 22px;
    background: rgba(8, 10, 13, 0.72);
    backdrop-filter: blur(18px);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 11px;
    color: var(--text);
    text-decoration: none;
  }

  .brand-mark {
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.035);
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
  }

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
    font-size: clamp(52px, 7.5vw, 92px);
    line-height: 0.92;
    letter-spacing: -0.07em;
    font-weight: 800;
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
    border-color: rgba(34, 211, 238, 0.55);
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

  .proof-row code {
    padding: 8px 10px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: rgba(34, 211, 238, 0.04);
    color: #bff7ff;
    font-size: 12px;
  }

  .hero-stage {
    position: relative;
    min-height: 520px;
  }

  .stage-glow {
    position: absolute;
    inset: 48px 10px 20px;
    border-radius: 999px;
    background: radial-gradient(circle, rgba(34, 211, 238, 0.22), transparent 62%);
    filter: blur(64px);
  }

  .bot-card {
    position: absolute;
    width: min(448px, 100%);
    border: 1px solid rgba(34, 211, 238, 0.18);
    border-radius: 28px;
    background:
      linear-gradient(180deg, rgba(18, 25, 31, 0.96), rgba(9, 13, 18, 0.97)),
      radial-gradient(circle at 20% 0%, rgba(34, 211, 238, 0.12), transparent 15rem);
    padding: 18px;
    backdrop-filter: blur(18px);
    box-shadow: 0 28px 90px rgba(0, 0, 0, 0.34);
    animation: card-float 6s ease-in-out infinite;
  }

  .card-0 { right: 18px; top: 28px; z-index: 3; }
  .card-1 { left: 0; top: 178px; z-index: 2; animation-delay: -1.8s; opacity: 0.88; }
  .card-2 { right: 34px; bottom: 2px; z-index: 1; animation-delay: -3.4s; opacity: 0.74; }

  @keyframes card-float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
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
      radial-gradient(circle at 50% 10%, rgba(34, 211, 238, 0.16), transparent 70%),
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

  .bot-head code {
    color: var(--accent);
    font-size: 12px;
    font-weight: 700;
  }

  .bot-meta {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .bot-meta span {
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 7px 9px;
    color: #c9f8ff;
    background: rgba(255, 255, 255, 0.025);
    font: 700 11px 'IBM Plex Mono', monospace;
  }

  .mini-console {
    margin: 18px 0 0;
    padding: 14px;
    border: 1px solid rgba(34, 211, 238, 0.12);
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

  .feature-list {
    border: 1px solid var(--line);
    border-radius: 24px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.018);
  }

  .feature-row {
    display: grid;
    grid-template-columns: 145px 1fr;
    gap: 26px;
    padding: 20px;
    border-bottom: 1px solid var(--line);
  }

  .feature-row:last-child { border-bottom: 0; }

  .feature-row code {
    color: var(--accent);
    font-weight: 800;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .feature-row h3 {
    font-size: 17px;
    letter-spacing: -0.03em;
  }

  .feature-row p {
    margin-top: 7px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.65;
  }

  .flow-band {
    display: grid;
    grid-template-columns: 0.8fr 1.2fr;
    gap: 32px;
    align-items: center;
  }

  .flow-line {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    border: 1px solid var(--line);
    border-radius: 20px;
    overflow: hidden;
    background: rgba(34, 211, 238, 0.035);
  }

  .flow-line span {
    padding: 18px 12px;
    color: #d7fbff;
    font-size: 12px;
    font-weight: 800;
    text-align: center;
    border-right: 1px solid var(--line);
  }

  .flow-line span:last-child { border-right: 0; }

  footer {
    border-top: 1px solid var(--line);
    padding: 24px 0 40px;
    color: var(--muted);
    font: 600 12px 'IBM Plex Mono', monospace;
  }

  @media (max-width: 880px) {
    .top-nav { align-items: flex-start; flex-direction: column; }
    .nav-links { flex-wrap: wrap; }
    .hero,
    .section-title,
    .flow-band { grid-template-columns: 1fr; }
    .hero-stage { min-height: 560px; }
    .card-0 { left: 0; right: auto; }
    .card-1 { left: 24px; }
    .card-2 { left: 0; right: auto; }
  }

  @media (max-width: 560px) {
    .top-nav,
    .hero,
    .features,
    .flow-band,
    footer { width: min(100% - 24px, 1120px); }
    h1 { font-size: 48px; }
    .hero { padding-top: 62px; }
    .hero-stage { min-height: 610px; }
    .bot-card { width: 100%; }
    .card-0 { top: 0; }
    .card-1 { left: 0; top: 210px; }
    .card-2 { left: 0; bottom: 0; }
    .feature-row { grid-template-columns: 1fr; gap: 8px; }
    .flow-line { grid-template-columns: 1fr 1fr; }
    .flow-line span:nth-child(2) { border-right: 0; }
    .flow-line span:nth-child(-n+2) { border-bottom: 1px solid var(--line); }
  }

  @media (prefers-reduced-motion: reduce) {
    .bot-card,
    .nav-links a,
    .btn { animation: none; transition: none; }
  }
`;
