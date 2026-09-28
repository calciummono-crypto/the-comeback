import Link from "next/link";
import { Logo } from "./Logo";

const stats = [
  ["3 engines", "Mineflayer, NMP and Azalea routing"],
  ["Live view", "Inventory, chat, hotbar and beam controls"],
  ["Railway ready", "Postgres migrations and health checks included"],
];

const features = [
  {
    title: "Session control",
    text: "Create bots, pin versions, route proxies, and see useful join logs without digging through deploy output.",
  },
  {
    title: "Beam workspace",
    text: "Scripted openers, AI replies, contact memory and operator tools live in one clean control surface.",
  },
  {
    title: "Owner console",
    text: "Licenses, shop plans, users, instances, bans and provider tests are separated from the user dashboard.",
  },
];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <div className="app-bg" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,.20),transparent_36rem)]" />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-indigo-950/40 backdrop-blur-xl transition group-hover:border-indigo-300/30 group-hover:bg-white/[0.07]">
            <Logo size={28} />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight text-white">MC Bot Manager</p>
            <p className="text-[11px] text-slate-500">control panel</p>
          </div>
        </Link>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] p-1 text-sm text-slate-400 backdrop-blur-xl md:flex">
          <a href="#features" className="rounded-full px-4 py-2 hover:bg-white/[0.06] hover:text-white">Features</a>
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

      <section className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-12 sm:px-8 lg:grid-cols-[1.02fr_.98fr] lg:pb-28 lg:pt-20">
        <div className="animate-slide-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-xl">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_16px_rgba(165,180,252,.9)]" />
            Clean rebuild · smoother operations · less clutter
          </div>
          <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            A sharper control room for your Minecraft bots.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-base leading-8 text-slate-400 sm:text-lg">
            Manage engines, licenses, sessions and AI workflows from a dashboard that feels deliberate: calmer surfaces, better hierarchy, and smooth motion without noisy neon clutter.
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
              href="#preview"
              className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-semibold text-slate-200 backdrop-blur-xl hover:border-white/20 hover:bg-white/[0.06]"
            >
              View layout
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

        <div id="preview" className="animate-slide-up scroll-mt-24 [animation-delay:120ms] lg:pl-6">
          <div className="landing-cut-card relative mx-auto max-w-xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[#070b16]/85 p-3 shadow-[0_40px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-2xl">
            <div className="absolute -left-24 top-16 h-44 w-44 rounded-full bg-indigo-400/20 blur-3xl" />
            <div className="absolute -right-20 bottom-10 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-indigo-200/60 to-transparent" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,.92),rgba(2,6,23,.96))] p-4">
              <div className="absolute right-5 top-5 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
              </div>
              <div className="flex items-center justify-between border-b border-white/10 pb-5 pr-20">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-300 to-indigo-500 shadow-2xl shadow-indigo-600/25">
                    <div className="h-5 w-5 rounded-lg bg-white/80" />
                  </div>
                  <div>
                    <div className="h-3 w-36 rounded-full bg-white/80" />
                    <div className="mt-2 h-2 w-24 rounded-full bg-white/20" />
                  </div>
                </div>
                <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">online</div>
              </div>
              <div className="grid gap-4 pt-4 md:grid-cols-[.58fr_1fr]">
                <div className="space-y-2.5">
                  {['Dashboard', 'License', 'Shop', 'Admin'].map((x, i) => (
                    <div key={x} className={`flex items-center gap-2 rounded-2xl px-3 py-3 text-sm ${i === 0 ? 'bg-indigo-400/15 text-indigo-100 ring-1 ring-indigo-300/20' : 'bg-white/[0.035] text-slate-500'}`}>
                      <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-indigo-300' : 'bg-slate-700'}`} />
                      {x}
                    </div>
                  ))}
                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                    <div className="mb-2 h-2 w-16 rounded-full bg-white/25" />
                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
                      <div className="h-full w-3/4 rounded-full bg-indigo-300" />
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-inner shadow-white/[0.02]">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="h-3 w-28 rounded-full bg-white/70" />
                        <div className="mt-2 h-2 w-40 rounded-full bg-white/15" />
                      </div>
                      <div className="h-8 w-24 rounded-full bg-indigo-400/25 ring-1 ring-indigo-300/20" />
                    </div>
                    <div className="space-y-2.5">
                      {[86, 64, 76].map((w, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/80 p-2.5">
                          <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-indigo-300/50 to-cyan-300/20" />
                          <div className="h-2.5 flex-1 rounded-full bg-slate-800">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-300/50 to-cyan-300/10" style={{ width: `${w}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-3xl border border-indigo-300/15 bg-indigo-400/10 p-4">
                      <div className="h-2 w-14 rounded-full bg-indigo-200/50" />
                      <div className="mt-8 h-8 w-8 rounded-2xl bg-indigo-200/20" />
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-4">
                      <div className="h-2 w-16 rounded-full bg-white/30" />
                      <div className="mt-8 flex gap-1">
                        <span className="h-8 w-3 rounded-full bg-emerald-300/40" />
                        <span className="h-8 w-3 rounded-full bg-indigo-300/50" />
                        <span className="h-8 w-3 rounded-full bg-sky-300/30" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 mx-auto w-full max-w-7xl scroll-mt-24 px-5 pb-24 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-300">Built for operating</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Everything has a clear place.</h2>
          </div>
          <Link href="/dashboard" className="hidden rounded-2xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-white/[0.05] sm:inline-flex">Go to dashboard</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((f, i) => (
            <article key={f.title} className="animate-slide-up rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="mb-8 h-10 w-10 rounded-2xl border border-indigo-200/15 bg-indigo-300/10" />
              <h3 className="text-lg font-semibold text-white">{f.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{f.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
