"use client";
import { DISCORD_INVITE_URL } from "@/lib/config";

import { useState } from "react";

export default function DiscordSupportBanner({ className = "" }: { className?: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <section
      className={`relative overflow-hidden rounded-[1.6rem] border border-[#5865F2]/30 bg-[linear-gradient(90deg,rgba(88,101,242,.18),rgba(255,255,255,.035))] p-4 shadow-[0_24px_80px_-60px_rgba(88,101,242,.9)] backdrop-blur-2xl ${className}`}
      aria-label="Discord support notice"
    >
      <div className="pointer-events-none absolute right-8 top-[-60px] h-36 w-36 rounded-full bg-[#5865F2]/20 blur-3xl" />
      <div className="flex flex-col gap-4 pr-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#5865F2] text-white shadow-[0_18px_50px_-32px_rgba(88,101,242,.95)] ring-1 ring-white/15">
            <DiscordIcon />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-black text-white">Join the Z-BEAM Discord</h3>
            <p className="mt-1 text-xs leading-5 text-indigo-100/75">
              Get license help, update notes, server-specific fixes and support without leaving the dashboard.
            </p>
          </div>
        </div>
        <a
          href={DISCORD_INVITE_URL || "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#5865F2] px-4 text-xs font-black text-white shadow-[0_16px_45px_-28px_rgba(88,101,242,.95)] transition hover:brightness-110 active:scale-[.985]"
        >
          <DiscordIcon small /> Discord
        </a>
      </div>
      <button
        type="button"
        onClick={() => setVisible(false)}
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full border border-[#5865F2]/35 bg-[#5865F2]/15 text-indigo-100 transition hover:bg-[#5865F2]/25 hover:text-white active:scale-[.96]"
        aria-label="Dismiss Discord notice"
      >
        ✕
      </button>
    </section>
  );
}

function DiscordIcon({ small = false }: { small?: boolean }) {
  return (
    <svg width={small ? 14 : 19} height={small ? 14 : 19} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
