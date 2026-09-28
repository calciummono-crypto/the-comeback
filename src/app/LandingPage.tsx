import Link from "next/link";
import { Logo } from "./Logo";

const stats = [
  ["Azalea + MF", "Pick the engine that fits the server"],
  ["Live console", "Chat, logs, hotbar and actions in one place"],
  ["Fast deploy", "Railway + Postgres startup handled"],
];

const features = [
  {
    title: "Add bots without guessing",
    text: "Paste a session token, resolve the IGN, pick a server, choose the version and start from a clean wizard.",
    tag: "Setup",
  },
  {
    title: "Engine choice per server",
    text: "Use Mineflayer for classic control, NMP for raw protocol tests, or Azalea for the Rust sidecar on modern servers.",
    tag: "Engines",
  },
  {
    title: "Readable join logs",
    text: "Token validation, version hints, kicks and disconnects show in the bot card so you know what failed instantly.",
    tag: "Debug",
  },
  {
    title: "Live bot controls",
    text: "Send chat, pick hotbar slots, use/drop items, move, inspect inventory and keep the session visible.",
    tag: "Control",
  },
  {
    title: "Beam workflows",
    text: "Run AI or spam-style beam flows with opener scripts, closing scripts, contact memory and safer retries.",
    tag: "Beam",
  },
  {
    title: "Licenses that make sense",
    text: "Users can redeem keys, see used slots, available slots and active time without needing owner help.",
    tag: "Access",
  },
];

const botCards = [
  { name: "matyr16", server: "eu.minemen.club", engine: "Mineflayer", status: "1.8.9 pinned", accent: "from-emerald-300 to-cyan-400" },
  { name: "beam_worker", server: "badlion-pvp.xyz", engine: "Azalea", status: "sidecar online", accent: "from-indigo-300 to-violet-500" },
  { name: "lobby-adbot", server: "play.example.net", engine: "NMP", status: "raw protocol", accent: "from-sky-300 to-blue-500" },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="app-bg" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.22),transparent_34rem)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-[min(960px,80vw)] -translate-x-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent" />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition group-hover:border-indigo-300/30 group-hover:bg-white/[0.07]">
            <Logo size={28} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-white">MC Bot Manager</p>
            <p className="text-[11px] text-slate-500">bot control panel</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1 text-sm text-slate-400 backdrop-blur-xl md:flex">
          <a href="#features" className="rounded-full px-4 py-2 hover:bg-white/[0.06] hover:text-white">Features</a>
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

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:pb-20 lg:pt-20">
        <div className="animate-slide-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(165,180,252,.9)]" />
            Smooth controls · real bot sessions · cleaner workflow
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Run Minecraft bots from a cleaner command center.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-400 sm:text-lg">
            Start accounts, choose engines, watch join logs, run beam flows and manage slots without opening terminal logs every time something happens.
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
              See bot cards
            </a>
          </div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
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

      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <p className="text-sm font-medium text-indigo-300">What the dashboard actually does</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-5xl">Useful features, no filler.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            The public page should explain the product, not list owner/admin internals. These are the things users feel every session.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="group animate-slide-up rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl hover:border-indigo-200/20 hover:bg-white/[0.055]"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <div className="mb-7 flex items-center justify-between">
                <span className="rounded-full border border-indigo-200/15 bg-indigo-300/10 px-3 py-1 text-xs font-semibold text-indigo-200">{f.tag}</span>
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/[0.04] text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-white">→</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="showcase" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 py-16 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[.82fr_1.18fr]">
          <div>
            <p className="text-sm font-medium text-indigo-300">Bot card flow</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-white">Cards slide, tilt, and show real state.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              The dashboard should feel like a control surface: compact bot cards, status at a glance, and motion that helps without screaming.
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
                  <div className={`mb-5 h-14 w-14 rounded-3xl bg-gradient-to-br ${bot.accent} shadow-2xl shadow-indigo-950/40`} />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{bot.name}</h3>
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

      <section id="preview" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-24 pt-16 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-300">Interface preview</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">A calmer dashboard layout.</h2>
          </div>
          <Link href="/dashboard" className="hidden rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] sm:inline-flex">Go to dashboard</Link>
        </div>
        <DashboardPreview />
      </section>
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
            <p className="text-xs text-slate-500">smooth card rotation</p>
          </div>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-400">3 active</span>
        </div>
        <div className="relative mt-8 h-[350px]">
          {botCards.map((bot, i) => (
            <div key={bot.name} className={`hero-bot-card hero-bot-card-${i}`}>
              <div className={`mb-5 h-16 w-16 rounded-[1.4rem] bg-gradient-to-br ${bot.accent} shadow-2xl shadow-indigo-950/50`} />
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
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="landing-cut-card relative mx-auto overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#070b16]/85 p-3 shadow-[0_40px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-2xl">
      <div className="absolute -left-24 top-16 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="absolute -right-20 bottom-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent" />
      <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,.92),rgba(2,6,23,.96))] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-indigo-500 shadow-2xl shadow-indigo-600/25">
              <div className="h-5 w-5 rounded-lg bg-white/80" />
            </div>
            <div>
              <div className="h-3 w-36 rounded-full bg-white/80" />
              <div className="mt-2 h-2 w-24 rounded-full bg-white/20" />
            </div>
          </div>
          <div className="flex rounded-full border border-white/10 bg-white/[0.035] p-1 text-xs text-slate-500">
            {['Bots', 'License', 'Shop'].map((x, i) => (
              <span key={x} className={`rounded-full px-4 py-2 ${i === 0 ? 'bg-white text-slate-950' : ''}`}>{x}</span>
            ))}
          </div>
        </div>
        <div className="grid gap-4 pt-4 lg:grid-cols-[.55fr_1fr]">
          <div className="space-y-3">
            {['matyr16', 'beam_worker', 'lobby-adbot'].map((x, i) => (
              <div key={x} className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${i === 0 ? 'from-emerald-300 to-cyan-400' : i === 1 ? 'from-indigo-300 to-violet-500' : 'from-sky-300 to-blue-500'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-white">{x}</p>
                    <p className="text-xs text-slate-500">online · console ready</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5 shadow-inner shadow-white/[0.02]">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="h-3 w-32 rounded-full bg-white/70" />
                <div className="mt-2 h-2 w-52 rounded-full bg-white/15" />
              </div>
              <div className="h-9 w-28 rounded-full bg-indigo-400/25 ring-1 ring-indigo-300/20" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-indigo-300/15 bg-indigo-400/10 p-5">
                <p className="text-xs text-indigo-200">Session log</p>
                <div className="mt-6 space-y-2">
                  <div className="h-2 w-4/5 rounded-full bg-indigo-200/35" />
                  <div className="h-2 w-2/3 rounded-full bg-indigo-200/20" />
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-5">
                <p className="text-xs text-slate-300">Live controls</p>
                <div className="mt-6 grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => <span key={i} className="h-8 rounded-xl bg-white/[0.06]" />)}
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/60 p-4">
              <div className="h-2 w-full rounded-full bg-slate-800"><div className="h-full w-[72%] rounded-full bg-gradient-to-r from-indigo-300/60 to-cyan-300/30" /></div>
              <div className="mt-3 h-2 w-full rounded-full bg-slate-800"><div className="h-full w-[48%] rounded-full bg-gradient-to-r from-emerald-300/50 to-indigo-300/20" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
