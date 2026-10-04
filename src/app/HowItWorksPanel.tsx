"use client";

export default function HowItWorksPanel() {
  const steps = [
    {
      title: "Add account",
      text: "Paste a fresh session ID or sign in with the account login option. Z-BEAM checks the account and shows the Minecraft name before you continue.",
    },
    {
      title: "Choose target",
      text: "Pick the server and region profile you want. The bot card will show the account name, server, status, and controls in one place.",
    },
    {
      title: "Pick a method",
      text: "Use the 1v1 player flow for conversations, or the standing lobby flow for trigger-word replies. You can edit messages before launch.",
    },
    {
      title: "Run and monitor",
      text: "Start the bot from the Bots page, open it for live logs and controls, then stop it safely whenever you are done.",
    },
  ];

  return (
    <div className="relative mx-auto max-w-5xl space-y-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-emerald-400/[0.08] blur-[90px]" />
        <div className="absolute right-[-40px] top-[160px] h-64 w-64 rounded-full bg-indigo-400/[0.07] blur-[90px]" />
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(15,23,42,.76),rgba(2,6,23,.88))] p-6 shadow-[0_28px_100px_-70px_rgba(0,0,0,.95)] backdrop-blur-2xl">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">guide</p>
        <h2 className="mt-2 text-3xl font-black tracking-[-0.055em] text-white sm:text-4xl">How Z-BEAM works</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
          A simple flow for creating, launching, and controlling Minecraft bot sessions without crowding the Bots page.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <article
            key={step.title}
            className="group overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-emerald-300/25 hover:bg-white/[0.045]"
          >
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-300/10 font-mono text-xs font-black text-emerald-200 ring-1 ring-emerald-300/20">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-base font-black text-white">{step.title}</h3>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-400">{step.text}</p>
          </article>
        ))}
      </section>

      <section className="rounded-[1.6rem] border border-amber-500/18 bg-amber-500/[0.07] p-5 text-sm leading-7 text-amber-100/85">
        <b className="text-amber-200">Tip:</b> session IDs can expire. If an account fails auth, refresh the session and update the bot account before launching again.
      </section>
    </div>
  );
}
