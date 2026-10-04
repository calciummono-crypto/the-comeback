import Link from "next/link";
import { Logo, Wordmark } from "./Logo";

const stats = [
  ["Multi-engine", "Mineflayer, Azalea, and NMP where they fit"],
  ["Live console", "Logs, chat, actions, and state in one view"],
  ["Access-aware", "Licenses, slots, and login gates stay visible"],
];

const proofPoints = ["resolve token", "select engine", "watch logs", "control session"];

const workflowSteps = [
  ["01", "Resolve", "Paste the session, pull the IGN, and confirm the target server."],
  ["02", "Launch", "Pick the engine with version hints and server context already visible."],
  ["03", "Watch", "Follow joins, kicks, queue state, and reconnects from the same panel."],
  ["04", "Control", "Send chat, move, use items, start beam flows, or stop cleanly."],
];

const serverBadges = ["Minemen", "Hypixel", "CatPvP", "MCPVP", "Custom IP"];

export const features = [
  {
    title: "Add bots without guessing",
    text: "Paste a session token, resolve the IGN, pick a server, choose a version, and start from one guided flow.",
    tag: "Setup",
  },
  {
    title: "Engine choice per server",
    text: "Use Mineflayer for classic control, NMP for protocol-level sessions, or Azalea for the Rust sidecar on modern servers.",
    tag: "Engines",
  },
  {
    title: "Readable join logs",
    text: "Token validation, version hints, kicks, and disconnects are surfaced near the bot so failures are easy to read.",
    tag: "Debug",
  },
  {
    title: "Live bot controls",
    text: "Send chat, pick hotbar slots, use or drop items, move, inspect inventory, and keep the session visible.",
    tag: "Control",
  },
  {
    title: "Beam workflows",
    text: "Run beam flows with opener scripts, closing scripts, contact memory, AI replies, and safer retries.",
    tag: "Beam",
  },
  {
    title: "Licenses that make sense",
    text: "Users can redeem keys and see used slots, available slots, and active time without asking an owner.",
    tag: "Access",
  },
];

const botCards = [
  { name: "Drexlerr", skin: "Drexlerr", server: "eu.minemen.club", engine: "Mineflayer", status: "1.8.9 pinned", accent: "from-emerald-300 to-cyan-400" },
  { name: "KairoVex", skin: "Dream", server: "play.hypixel.net", engine: "Azalea", status: "sidecar online", accent: "from-indigo-300 to-violet-500" },
  { name: "NovaStrafe", skin: "Technoblade", server: "mc.hypixel.net", engine: "NMP", status: "raw protocol", accent: "from-sky-300 to-blue-500" },
  { name: "RiftedAsh", skin: "Sapnap", server: "na.minemen.club", engine: "Mineflayer", status: "auto reconnect", accent: "from-amber-200 to-orange-400" },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="app-bg" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.22),transparent_34rem)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(960px,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="landing-story-rail" aria-hidden />

      <nav className="fixed left-1/2 top-4 z-50 flex w-[min(1180px,calc(100%_-_24px))] -translate-x-1/2 items-center justify-between rounded-[1.6rem] border border-white/10 bg-[#0b1020]/78 px-4 py-3 shadow-[0_22px_70px_-28px_rgba(0,0,0,.9)] ring-1 ring-white/[0.03] backdrop-blur-2xl sm:px-5">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition group-hover:border-indigo-300/30 group-hover:bg-white/[0.07]">
            <Logo size={28} />
          </div>
          <div className="leading-tight">
            <Wordmark height={26} />
            <p className="mt-0.5 text-[11px] text-slate-500">beam control panel</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1 text-sm text-slate-400 backdrop-blur-xl md:flex">
          <Link href="/features" className="rounded-full px-4 py-2 hover:bg-white/[0.06] hover:text-white">Features</Link>
          <a href="#workflow" className="rounded-full px-4 py-2 hover:bg-white/[0.06] hover:text-white">Workflow</a>
          <a href="#showcase" className="rounded-full px-4 py-2 hover:bg-white/[0.06] hover:text-white">Showcase</a>
          <a href="#preview" className="rounded-full px-4 py-2 hover:bg-white/[0.06] hover:text-white">Preview</a>
          <Link href="/dashboard" className="rounded-full bg-white px-4 py-2 font-medium text-slate-950 hover:bg-indigo-100">Dashboard</Link>
        </div>
        <Link
          href="/dashboard"
          className="rounded-full border border-indigo-300/20 bg-indigo-400/10 px-4 py-2 text-sm font-semibold text-indigo-100 shadow-lg shadow-indigo-950/30 backdrop-blur transition hover:border-indigo-200/40 hover:bg-indigo-400/15"
        >
          Open dashboard
        </Link>
      </nav>

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:pb-20 lg:pt-32">
        <div className="animate-slide-up">
          <div className="landing-kicker mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(165,180,252,.9)]" />
            Built for live Minecraft bot sessions
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-black leading-[0.94] tracking-[-0.065em] text-white sm:text-6xl lg:text-7xl">
            Control Minecraft bot sessions without leaving the browser.
          </h1>
          <p className="landing-lede mt-6 max-w-2xl text-pretty text-base font-medium leading-8 text-slate-400 sm:text-lg">
            Z-BEAM keeps session setup, join logs, bot controls, and beam tools together so operators can see what is running and act without digging through terminal output.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className="btn-primary group inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-2xl shadow-indigo-950/30 hover:bg-indigo-100"
            >
              Enter dashboard
              <span className="ml-2 transition group-hover:translate-x-0.5">→</span>
            </Link>
            <a
              href="#showcase"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06]"
            >
              View sessions
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-medium text-slate-400">
            {proofPoints.map((point) => (
              <span key={point} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 backdrop-blur-xl">
                {point}
              </span>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {stats.map(([value, label]) => (
              <div key={value} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 backdrop-blur-xl">
                <p className="text-sm font-semibold text-white">{value}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <BotCardShowcase />
      </section>

      <section id="workflow" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-28 px-5 py-14 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
            <p className="text-sm font-medium text-indigo-300">Launch path</p>
            <h2 className="mt-2 max-w-xl text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-4xl">
              A clear path from account to session control.
            </h2>
            <p className="landing-copy mt-4 text-sm leading-7 text-slate-400 sm:text-base">
              Each block maps to a real operator step: resolve the account, launch the bot, watch the state, then control the session.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {serverBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 bg-slate-950/45 px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {workflowSteps.map(([num, title, text]) => (
              <article key={title} className="group rounded-[1.6rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl hover:border-indigo-200/20 hover:bg-white/[0.055]">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs text-indigo-200">{num}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,.8)]" />
                </div>
                <h3 className="text-lg font-bold tracking-tight text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
        <div className="grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-3 backdrop-blur-xl md:grid-cols-3">
          {[
            ["No black box", "Every start attempt leaves a readable log trail."],
            ["No tab hunting", "Controls, inventory state, and chat sit beside the bot."],
            ["No fake preview", "The landing mockup follows the same dashboard layout."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
              <p className="text-sm font-bold text-white">{title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="section-orb left-8 top-10" aria-hidden />
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-medium text-indigo-300">From setup to control</p>
          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-5xl">From token to running bot, every step stays visible.</h2>
          <p className="landing-copy mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Add the bot, pick the engine, watch the join, and control the session without jumping between tabs or terminal logs.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((f, i) => (
            <article
              key={f.title}
              className={`group animate-slide-up rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl hover:border-indigo-200/20 hover:bg-white/[0.055] ${
                i === 0 ? "md:col-span-2 xl:col-span-2 xl:row-span-2 xl:p-8" : ""
              } ${i === 1 ? "xl:col-span-2" : ""}`}
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="rounded-full border border-indigo-200/15 bg-indigo-300/10 px-3 py-1 text-xs font-semibold text-indigo-200">{f.tag}</span>
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/[0.04] text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white">→</span>
              </div>
              <h3 className={`${i === 0 ? "text-2xl" : "text-lg"} font-bold tracking-tight text-white`}>{f.title}</h3>
              <p className={`${i === 0 ? "mt-4 max-w-xl text-base leading-8" : "mt-3 text-sm leading-7"} text-slate-400`}>{f.text}</p>
              {i === 0 && (
                <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/45 p-4 font-mono text-xs text-slate-400">
                  <p className="text-emerald-200">› session resolved</p>
                  <p className="mt-1">› engine selected from server profile</p>
                  <p className="mt-1 text-indigo-200">› bot ready for live control</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="showcase" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="section-orb right-10 top-16" aria-hidden />
        <div className="grid items-center gap-10 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <p className="text-sm font-medium text-indigo-300">Live session cards</p>
            <h2 className="mt-2 text-4xl font-black tracking-[-0.045em] text-white">Bot cards show the details operators check first.</h2>
            <p className="landing-copy mt-4 text-sm leading-7 text-slate-400">
              Names, skins, server targets, engine labels, and status chips are arranged for quick scanning while sessions are live.
            </p>
            <Link href="/dashboard" className="mt-7 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-indigo-100">
              Open dashboard
            </Link>
          </div>
          <div className="relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
            <div className="absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-[#0b0d1a] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-28 bg-gradient-to-l from-[#0b0d1a] to-transparent z-10" />
            <div className="bot-card-track flex h-full items-center gap-5">
              {[...botCards, ...botCards].map((bot, idx) => (
                <div key={`${bot.name}-${idx}`} className="bot-showcase-card shrink-0">
                  <div className="mb-5 h-14 w-14 overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl shadow-indigo-950/40">
                    <img src={`https://minotar.net/helm/${bot.skin}/96.png`} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold tracking-tight text-white">{bot.name}</h3>
                      <p className="mt-1 text-sm text-slate-500">{bot.server}</p>
                    </div>
                    <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">online</span>
                  </div>
                  <div className="mt-7 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">Engine</p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">{bot.engine}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-3">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">State</p>
                      <p className="mt-1 text-sm font-semibold text-slate-200">{bot.status}</p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-2">
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-full w-[78%] rounded-full bg-indigo-300/60" /></div>
                    <div className="h-2 rounded-full bg-slate-800"><div className="h-full w-[54%] rounded-full bg-cyan-300/40" /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8">
        <div className="grid gap-3 rounded-[1.8rem] border border-white/10 bg-slate-950/40 p-4 backdrop-blur-xl md:grid-cols-4">
          {[
            ["Status", "Designed for live reconnects"],
            ["Access", "Slots and licenses visible"],
            ["AI", "Provider tests in admin"],
            ["Deploy", "Railway-ready runtime"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-200">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="preview" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-16 pt-16 sm:px-8">
        <div className="section-orb left-1/2 top-10" aria-hidden />
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-300">Product preview</p>
            <h2 className="mt-2 text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-4xl">A dashboard preview with real product structure.</h2>
          </div>
          <Link href="/dashboard" className="hidden rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] sm:inline-flex">Go to dashboard</Link>
        </div>
        <DashboardPreview />
      </section>

      <section className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-10 pt-8 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025))] p-6 shadow-[0_35px_100px_-55px_rgba(99,102,241,.7)] backdrop-blur-2xl sm:p-8">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-medium text-indigo-300">Ready when the bot is</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight tracking-[-0.045em] text-white sm:text-5xl">
                Open the panel, add a session, and keep the run visible.
              </h2>
              <p className="landing-copy mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Start with the dashboard. The bot list, console, controls, and beam tools are already grouped where an operator expects them.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-slate-400">
                <span className="rounded-full border border-white/10 px-3 py-1.5">no terminal jumping</span>
                <span className="rounded-full border border-white/10 px-3 py-1.5">real session state</span>
                <span className="rounded-full border border-white/10 px-3 py-1.5">fast login gate</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link href="/dashboard" className="btn-primary inline-flex justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-indigo-100">
                Enter dashboard
              </Link>
              <Link href="/features" className="inline-flex justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 hover:bg-white/[0.06]">
                View features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 pb-10 pt-2 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Logo size={26} />
          <div>
            <Wordmark height={18} />
            <p className="mt-1">Minecraft bot control with fewer tabs and clearer state.</p>
            <p className="mt-1">© 2026 Z-BEAM. All rights reserved.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/features" className="hover:text-slate-200">Features</Link>
          <Link href="/dashboard" className="hover:text-slate-200">Dashboard</Link>
          <Link href="/license" className="hover:text-slate-200">License</Link>
          <Link href="/shop" className="hover:text-slate-200">Shop</Link>
        </div>
      </footer>
    </main>
  );
}

function BotCardShowcase() {
  return (
    <div className="animate-slide-up scroll-mt-24 [animation-delay:120ms] lg:pl-6">
      <div className="relative mx-auto h-[470px] max-w-xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.035] p-6 shadow-[0_40px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(99,102,241,.23),transparent_22rem)]" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Live bots</p>
            <p className="text-xs text-slate-500">player skins + server targets</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">3 active</span>
        </div>
        <div className="relative mt-8 h-[350px]">
          {botCards.slice(0, 3).map((bot, i) => (
            <div key={bot.name} className={`hero-bot-card hero-bot-card-${i}`}>
              <div className="mb-5 h-16 w-16 overflow-hidden rounded-[1.4rem] border border-white/10 bg-slate-900 shadow-2xl shadow-indigo-950/50">
                <img src={`https://minotar.net/helm/${bot.skin}/128.png`} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white">{bot.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{bot.server}</p>
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">ready</span>
              </div>
              <div className="mt-7 flex items-center gap-2 text-xs text-slate-400">
                <span className="rounded-full bg-white/[0.06] px-3 py-1.5">{bot.engine}</span>
                <span className="rounded-full bg-white/[0.06] px-3 py-1.5">{bot.status}</span>
              </div>
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-3 font-mono text-xs text-slate-400">
                <p>› connected</p>
                <p className="mt-1 text-indigo-200">› chat + inventory synced</p>
              </div>
            </div>
          ))}
          <div className="absolute bottom-0 left-0 right-0 rounded-3xl border border-white/10 bg-slate-950/70 p-3 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="font-mono text-slate-400">/beam start --engine auto</span>
              <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 font-semibold text-emerald-200 ring-1 ring-emerald-300/20">ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  const sidebarItems = ["Dashboard", "Add Bots", "License", "Settings"];

  return (
    <div className="landing-cut-card relative mx-auto overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#070b16]/85 p-3 shadow-[0_40px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-2xl">
      <div className="absolute -left-24 top-16 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent" />

      <div className="relative grid overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,.92),rgba(2,6,23,.96))] lg:grid-cols-[210px_1fr]">
        <aside className="hidden border-r border-white/10 bg-slate-950/55 p-4 lg:block">
          <div className="mb-7 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
              <Logo size={26} />
            </div>
            <div>
              <Wordmark height={22} />
              <p className="mt-0.5 text-[10px] text-slate-500">control center</p>
            </div>
          </div>

          <div className="space-y-2">
            {sidebarItems.map((item, i) => (
              <div
                key={item}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-xs font-medium ${
                  i === 0 ? "border border-emerald-200/15 bg-white text-slate-950" : "border border-white/5 bg-white/[0.025] text-slate-400"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${i === 0 ? "bg-emerald-500" : "bg-slate-700"}`} />
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-slate-500">health</p>
            <div className="mt-4 h-2 rounded-full bg-slate-800">
              <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-300 to-indigo-300" />
            </div>
            <p className="mt-3 text-xs text-slate-400">3 online bots</p>
          </div>
        </aside>

        <div className="min-w-0 p-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-emerald-600/10 lg:hidden">
                <Logo size={30} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Wordmark height={24} />
                  <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-200">LIVE</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Same brand, sidebar rhythm, bot list, console, and control groups.</p>
              </div>
            </div>
            <div className="flex rounded-full border border-white/10 bg-white/[0.035] p-1 text-xs text-slate-500">
              {['Bots', 'Console', 'Beam'].map((x, i) => (
                <span key={x} className={`rounded-full px-4 py-2 ${i === 0 ? 'bg-white text-slate-950' : ''}`}>{x}</span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 border-b border-white/10 py-4 sm:grid-cols-3">
            {[
              ["Online", "3 bots"],
              ["Latency", "41 ms"],
              ["Queue", "auto"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
                <p className="mt-1 text-sm font-bold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 pt-4 xl:grid-cols-[.58fr_1fr]">
            <div className="space-y-3">
              {botCards.slice(0, 3).map((bot, i) => (
                <div key={bot.name} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-inner shadow-white/[0.02]">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
                      <img src={`https://minotar.net/helm/${bot.skin}/80.png`} alt="" className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white">{bot.name}</p>
                      <p className="truncate text-xs text-slate-500">{bot.server} · {bot.engine}</p>
                    </div>
                    <span className={`h-2.5 w-2.5 rounded-full ${i === 1 ? "bg-indigo-300" : "bg-emerald-300"} shadow-[0_0_14px_rgba(110,231,183,.7)]`} />
                  </div>
                  <div className="mt-3 flex gap-2 text-[11px] font-semibold">
                    <span className="rounded-full bg-white px-2.5 py-1 text-slate-950">view</span>
                    <span className="rounded-full border border-white/10 px-2.5 py-1 text-slate-400">stop</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-inner shadow-white/[0.02]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">Session console</p>
                  <p className="mt-1 text-xs text-slate-500">Readable logs, quick controls and beam status.</p>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">stable</div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-indigo-300/15 bg-indigo-400/10 p-5">
                  <p className="text-xs font-semibold text-indigo-100">Join log</p>
                  <div className="mt-5 space-y-2 font-mono text-[11px] text-slate-400">
                    <p>12:55 resolving profile</p>
                    <p className="text-emerald-200">12:56 connected to eu.minemen.club</p>
                    <p>12:56 inventory synced · slot 3 ready</p>
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                  <p className="text-xs font-semibold text-slate-300">Live controls</p>
                  <div className="mt-5 grid grid-cols-3 gap-2 text-[10px] font-semibold text-slate-400">
                    {['chat', 'slot', 'use', 'drop', 'move', 'beam'].map((x) => (
                      <span key={x} className="grid h-8 place-items-center rounded-xl bg-white/[0.06] ring-1 ring-white/[0.03]">{x}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Queue progress</span>
                  <span>72%</span>
                </div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-emerald-300/70 to-indigo-300/45" /></div>
                <div className="mt-3 h-2 w-full rounded-full bg-slate-800"><div className="h-full w-[48%] rounded-full bg-gradient-to-r from-indigo-300/60 to-emerald-300/25" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
