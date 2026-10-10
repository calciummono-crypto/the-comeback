import Link from "next/link";
import { Logo, Wordmark } from "../Logo";
import { features } from "../LandingPage";
import MinecraftBackdrop from "../MinecraftBackdrop";

export const dynamic = "force-dynamic";

const flow = [
  "Paste session token",
  "Resolve Minecraft IGN",
  "Choose server profile",
  "Start and watch logs",
  "Control chat / inventory",
];

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-slate-100">
      <MinecraftBackdrop />

      <nav className="fixed left-1/2 top-4 z-50 flex w-[min(1180px,calc(100%_-_24px))] -translate-x-1/2 items-center justify-between rounded-[1.6rem] border border-white/10 bg-[#0b1020]/78 px-4 py-3 shadow-[0_22px_70px_-28px_rgba(0,0,0,.9)] ring-1 ring-white/[0.03] backdrop-blur-2xl sm:px-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Logo size={26} />
          </div>
          <div>
            <Wordmark height={24} />
            <p className="mt-0.5 text-[11px] text-slate-500">features</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white">Home</Link>
          <Link href="/dashboard" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-indigo-100">Dashboard</Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto max-w-3xl text-center animate-slide-up">
          <p className="text-sm font-medium text-indigo-300">User-facing features</p>
          <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white sm:text-6xl">
            Everything users need to run bots cleanly.
          </h1>
          <p className="mt-5 text-base leading-8 text-slate-400">
            No admin filler here — just the parts that matter when someone logs in, adds a bot, starts it, and controls the session.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="animate-slide-up rounded-[1.75rem] border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl hover:border-indigo-200/20 hover:bg-white/[0.055]"
              style={{ animationDelay: `${i * 55}ms` }}
            >
              <span className="rounded-full border border-indigo-200/15 bg-indigo-300/10 px-3 py-1 text-xs font-semibold text-indigo-200">{f.tag}</span>
              <h2 className="mt-7 text-xl font-bold tracking-tight text-white">{f.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-400">{f.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-6 rounded-[2rem] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-xl lg:grid-cols-[.8fr_1.2fr] lg:p-8">
          <div>
            <p className="text-sm font-medium text-indigo-300">Typical session</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] text-white">From token to live control in one flow.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              The dashboard keeps the boring setup steps visible so users understand what is happening before a bot reaches the server.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-5">
            {flow.map((step, i) => (
              <div key={step} className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <div className="mb-4 grid h-8 w-8 place-items-center rounded-xl bg-indigo-300/10 text-xs font-bold text-indigo-200">{i + 1}</div>
                <p className="text-sm font-medium text-slate-200">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
