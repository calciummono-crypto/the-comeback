export const features = [
  {
    title: "Session token",
    text: "Paste a session token and resolve the Minecraft username before launch.",
    tag: "Resolve",
  },
  {
    title: "Engine selection",
    text: "Choose Mineflayer, Azalea, or NMP depending on version and server behavior.",
    tag: "Launch",
  },
  {
    title: "Live console",
    text: "Read join output, kicks, reconnects, and inventory syncs next to the bot.",
    tag: "Watch",
  },
  {
    title: "Bot controls",
    text: "Send chat, change hotbar slots, use or drop items, and move the bot.",
    tag: "Control",
  },
  {
    title: "License slots",
    text: "Redeem keys and see how many bot slots are available for the account.",
    tag: "Access",
  },
  {
    title: "Per-session state",
    text: "Keep server, engine, version, username, and status attached to the running bot.",
    tag: "State",
  },
];

const typewriterScript = `
(() => {
  const el = document.getElementById("typewriter-log");
  if (!el) return;
  const lines = [
    "$ resolving session → vyrex_",
    "$ connecting to eu.minemen.club:25565",
    "$ engine: Mineflayer 1.8.9",
    "✓ bot online",
  ];
  let line = 0;
  let char = 0;
  const tick = () => {
    const current = lines.slice(0, line).join("\n");
    const next = lines[line] ? lines[line].slice(0, char) : "";
    el.textContent = current + (current && next ? "\n" : "") + next;
    if (line >= lines.length) return;
    if (char < lines[line].length) {
      char += 1;
      window.setTimeout(tick, 30);
      return;
    }
    line += 1;
    char = 0;
    if (line < lines.length) window.setTimeout(tick, 400);
  };
  tick();
})();
`;

export default function LandingPage() {
  return (
    <main className="zbeam-home">
      <style>{landingCss}</style>

      <nav className="nav" aria-label="Primary navigation">
        <a className="brand" href="/">Z-BEAM</a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/license">License</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Paste a session. Pick an engine. Watch it join.</h1>
        <p className="hero-sub">
          Z-BEAM runs Mineflayer, Azalea, and NMP sessions from one panel. No terminal switching.
        </p>
        <a className="cta" href="/dashboard">Open dashboard</a>
        <pre id="typewriter-log" className="typewriter" aria-label="Console log preview" />
      </section>

      <section id="features" className="section engines" aria-labelledby="engines-title">
        <h2 id="engines-title">Engines</h2>
        <div className="engine-row">
          <div>
            <h3>Mineflayer</h3>
            <p>Node client for classic control, commonly used with 1.8.9 servers and familiar plugin behavior.</p>
          </div>
          <div>
            <h3>Azalea</h3>
            <p>Rust sidecar for modern sessions where a different client stack is useful.</p>
          </div>
          <div>
            <h3>NMP</h3>
            <p>Raw protocol path for lower-level sessions and server behavior testing.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="how-title">
        <h2 id="how-title">How it works</h2>
        <div className="info-table">
          <div className="row">
            <code>Resolve</code>
            <p>Paste the session token; the panel resolves the IGN before starting the bot.</p>
          </div>
          <div className="row">
            <code>Launch</code>
            <p>Pick the server and choose Mineflayer, Azalea, or NMP for the session.</p>
          </div>
          <div className="row">
            <code>Watch</code>
            <p>Join output, kicks, reconnects, and inventory syncs appear in the bot card.</p>
          </div>
          <div className="row">
            <code>Control</code>
            <p>Send chat, swap hotbar slots, use or drop items, and move the bot live.</p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="bot-title">
        <h2 id="bot-title">Bot card example</h2>
        <article className="bot-card">
          <header>
            <div>
              <h3>vyrex_</h3>
              <p><code>eu.minemen.club</code></p>
            </div>
            <code className="status">online</code>
          </header>
          <div className="bot-meta">
            <div><span>engine</span><code>Mineflayer</code></div>
            <div><span>version</span><code>1.8.9</code></div>
          </div>
          <pre className="console">[12:44:01] resolving profile: vyrex_
[12:44:02] connecting eu.minemen.club:25565
[12:44:03] join success · version 1.8.9
[12:44:03] inventory synced · hotbar slot 1 active</pre>
        </article>
      </section>

      <footer>Z-BEAM · Minecraft bot control · © 2026</footer>

      <script dangerouslySetInnerHTML={{ __html: typewriterScript }} />
    </main>
  );
}

const landingCss = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,600;6..72,700&display=swap');

  :root {
    --z-bg: #0D0D0F;
    --z-surface: #131316;
    --z-border: #222228;
    --z-text: #E8E8E8;
    --z-muted: #6B6B75;
    --z-accent: #22D3EE;
    --z-accent-dim: #0E4F5C;
  }

  .zbeam-home {
    min-height: 100vh;
    background: var(--z-bg);
    color: var(--z-text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
  }

  .zbeam-home * {
    box-sizing: border-box;
  }

  .nav,
  .hero,
  .section,
  footer {
    width: min(900px, calc(100% - 32px));
    margin-inline: auto;
  }

  .nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 24px 0;
    border-top: 0;
  }

  .brand {
    color: var(--z-text);
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: -0.02em;
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 18px;
  }

  .nav-links a {
    color: var(--z-muted);
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
  }

  .nav-links a:hover {
    color: var(--z-text);
  }

  .hero {
    padding: 96px 0 72px;
  }

  h1 {
    max-width: 780px;
    margin: 0;
    color: var(--z-text);
    font-family: Newsreader, Georgia, serif;
    font-size: clamp(52px, 8vw, 92px);
    font-weight: 700;
    letter-spacing: -0.065em;
    line-height: 0.92;
  }

  .hero-sub {
    max-width: 620px;
    margin: 24px 0 0;
    color: var(--z-muted);
    font-size: 17px;
    line-height: 1.7;
  }

  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 28px;
    min-height: 44px;
    padding: 0 18px;
    border: 2px solid var(--z-border);
    border-radius: 2px;
    background: transparent;
    color: var(--z-text);
    font-family: Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: border-color 150ms ease;
  }

  .cta:hover {
    border-color: var(--z-accent);
  }

  .typewriter {
    min-height: 96px;
    margin: 34px 0 0;
    padding: 0;
    background: var(--z-bg);
    color: var(--z-accent);
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 14px;
    line-height: 1.7;
    text-align: left;
    white-space: pre-wrap;
  }

  .section {
    padding: 56px 0;
    border-top: 1px solid var(--z-border);
  }

  h2 {
    margin: 0 0 28px;
    color: var(--z-text);
    font-size: 24px;
    font-weight: 700;
    letter-spacing: -0.035em;
  }

  .engine-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  .engine-row h3,
  .bot-card h3,
  .status,
  code {
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
  }

  .engine-row h3 {
    margin: 0 0 10px;
    color: var(--z-text);
    font-size: 15px;
    font-weight: 700;
  }

  .engine-row p,
  .row p {
    margin: 0;
    color: var(--z-muted);
    font-size: 14px;
    line-height: 1.65;
  }

  .info-table {
    border-top: 1px solid var(--z-border);
  }

  .row {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 24px;
    padding: 18px 0;
    border-bottom: 1px solid var(--z-border);
  }

  .row code {
    color: var(--z-accent);
    font-size: 14px;
    font-weight: 700;
  }

  .bot-card {
    max-width: 620px;
    padding: 20px;
    border: 1px solid var(--z-border);
    background: var(--z-surface);
  }

  .bot-card header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--z-border);
  }

  .bot-card h3 {
    margin: 0;
    color: var(--z-text);
    font-size: 18px;
    font-weight: 700;
  }

  .bot-card header p {
    margin: 7px 0 0;
    color: var(--z-muted);
  }

  .status {
    color: var(--z-accent);
    font-size: 12px;
    font-weight: 700;
  }

  .bot-meta {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0;
    border-bottom: 1px solid var(--z-border);
  }

  .bot-meta div {
    padding: 16px 0;
  }

  .bot-meta span {
    display: block;
    margin-bottom: 6px;
    color: var(--z-muted);
    font-size: 12px;
  }

  .bot-meta code {
    color: var(--z-text);
    font-size: 13px;
  }

  .console {
    margin: 18px 0 0;
    padding: 0;
    background: transparent;
    color: var(--z-muted);
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 13px;
    line-height: 1.75;
    white-space: pre-wrap;
  }

  footer {
    padding: 28px 0 40px;
    border-top: 1px solid var(--z-border);
    color: var(--z-muted);
    font-family: 'IBM Plex Mono', ui-monospace, monospace;
    font-size: 12px;
  }

  @media (max-width: 720px) {
    .nav {
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
    }

    .nav-links {
      gap: 14px;
      flex-wrap: wrap;
    }

    .hero {
      padding: 64px 0 56px;
    }

    .engine-row,
    .row {
      grid-template-columns: 1fr;
    }

    .row {
      gap: 8px;
    }
  }

  @media (max-width: 430px) {
    .nav,
    .hero,
    .section,
    footer {
      width: min(900px, calc(100% - 24px));
    }

    h1 {
      font-size: 48px;
    }

    .bot-meta {
      grid-template-columns: 1fr;
    }
  }
`;
