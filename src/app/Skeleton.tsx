// Content-shaped skeleton blocks — loads feel instant instead of spinner-y.

export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-slate-800/70 ${className}`}
      aria-hidden="true"
    />
  );
}

// Skeleton that matches the current compact bot card grid.
export function SkeletonBotCard() {
  return (
    <div className="relative flex min-h-[238px] flex-col overflow-hidden rounded-[1.45rem] border border-white/[0.085] bg-[linear-gradient(180deg,rgba(15,23,42,.58),rgba(2,6,23,.72))] p-4 shadow-[0_26px_80px_-60px_rgba(0,0,0,.95)] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <SkeletonRow className="h-[70px] w-[58px] shrink-0 rounded-2xl" />
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <SkeletonRow className="h-5 w-28" />
              <SkeletonRow className="h-6 w-20 rounded-full" />
            </div>
            <SkeletonRow className="h-3 w-24" />
            <SkeletonRow className="h-3 w-36" />
          </div>
        </div>
        <SkeletonRow className="h-8 w-8 shrink-0 rounded-full bg-rose-500/15" />
      </div>

      <div className="mt-4 flex gap-2">
        <SkeletonRow className="h-6 w-24 rounded-full" />
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/35 px-3 py-3">
        <SkeletonRow className="h-3 w-4/5" />
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <SkeletonRow className="h-11 rounded-2xl bg-emerald-400/20" />
        <SkeletonRow className="h-11 rounded-2xl bg-indigo-400/15" />
      </div>
    </div>
  );
}

export function SkeletonBotList({ n = 3 }: { n?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading bots">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonBotCard key={i} />
      ))}
    </div>
  );
}

// License-shaped skeleton: hero, stats, redeem card, slot progress.
export function SkeletonPanel() {
  return (
    <div className="animate-fade-in space-y-6" aria-busy="true" aria-label="Loading">
      <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(15,23,42,.50),rgba(2,6,23,.66))] p-5 sm:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <SkeletonRow className="h-7 w-36 rounded-full" />
            <SkeletonRow className="mt-5 h-10 w-56" />
            <SkeletonRow className="mt-3 h-4 w-3/4" />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <SkeletonRow className="h-28 rounded-2xl" />
              <SkeletonRow className="h-28 rounded-2xl" />
              <SkeletonRow className="h-28 rounded-2xl" />
            </div>
          </div>
          <SkeletonRow className="min-h-[260px] rounded-[1.6rem]" />
        </div>
      </section>
      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <SkeletonRow className="h-52 rounded-[1.7rem]" />
        <div className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5">
          <SkeletonRow className="h-5 w-28" />
          <SkeletonRow className="mt-3 h-4 w-2/3" />
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="flex items-end gap-4">
              <SkeletonRow className="h-12 w-20" />
              <div className="flex-1">
                <SkeletonRow className="h-4 rounded-full" />
                <div className="mt-3 grid grid-cols-12 gap-1.5">
                  {Array.from({ length: 12 }, (_, i) => <SkeletonRow key={i} className="h-2 rounded-full" />)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Table-shaped skeleton for lists of rows.
export function SkeletonTable({ n = 5 }: { n?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading rows">
      {Array.from({ length: n }, (_, i) => (
        <SkeletonRow key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
