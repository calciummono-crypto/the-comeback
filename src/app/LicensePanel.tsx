"use client";

import { useCallback, useEffect, useState } from "react";
import { LockIcon } from "./Icons";
import { SkeletonPanel } from "./Skeleton";

type LicenseInfo = {
  id: string;
  slots: number;
  durationDays: number;
  durationHours: number;
  expiresAt: string;
  active: boolean;
  reason: string;
  licenseKey?: string;
  createdAt: string;
  isExpired: boolean;
  timeLeft: string;
};

type LicenseStatus = {
  totalSlots: number;
  usedSlots: number;
  availableSlots: number;
  activeLicenses: LicenseInfo[];
  expiredLicenses: LicenseInfo[];
  hasActiveLicense: boolean;
  nextExpiry: string | null;
};

export default function LicensePanel() {
  const [status, setStatus] = useState<LicenseStatus | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [keyInput, setKeyInput] = useState("");
  const [redeemMsg, setRedeemMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/licenses", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 10000);
    return () => clearInterval(t);
  }, [refresh]);

  async function redeem() {
    const k = keyInput.trim();
    if (!k) {
      setRedeemMsg({ type: "error", text: "Enter a license key" });
      return;
    }
    if (!k.startsWith("abeam-key-")) {
      setRedeemMsg({ type: "error", text: "Invalid format - key should start with abeam-key-" });
      return;
    }
    setRedeeming(true);
    setRedeemMsg(null);
    try {
      const res = await fetch("/api/licenses/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: k }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRedeemMsg({ type: "error", text: data.error || "Failed to redeem" });
        return;
      }
      setRedeemMsg({ type: "success", text: `Redeemed! Got ${data.license.slots} slots for ${data.license.durationDays}d ${data.license.durationHours}h` });
      window.dispatchEvent(new CustomEvent("zbeam:notification", {
        detail: {
          title: "License key redeemed",
          text: `Unlocked ${data.license.slots} bot slots for ${data.license.durationDays}d ${data.license.durationHours}h.`,
          tone: "emerald",
        },
      }));
      setKeyInput("");
      await refresh();
    } catch {
      setRedeemMsg({ type: "error", text: "Network error" });
    } finally {
      setRedeeming(false);
    }
  }

  if (!loaded) {
    return <SkeletonPanel />;
  }

  if (!status) {
    return <p className="py-10 text-center text-slate-500">Failed to load.</p>;
  }

  const hasLicense = status.totalSlots > 0;

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-80px] top-[-80px] h-[320px] w-[320px] rounded-full bg-emerald-400/[0.08] blur-[90px]" />
        <div className="absolute right-[-40px] top-[120px] h-[240px] w-[240px] rounded-full bg-indigo-400/[0.07] blur-[90px]" />
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(15,23,42,.74),rgba(2,6,23,.86))] p-5 shadow-[0_28px_100px_-70px_rgba(0,0,0,.95)] backdrop-blur-2xl lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
              <span className={`h-2 w-2 rounded-full ${hasLicense ? "bg-emerald-300 shadow-[0_0_12px_color-mix(in_srgb,var(--color-emerald-400)_80%,transparent)]" : "bg-slate-500"}`} />
              {hasLicense ? `${status.totalSlots} slots active` : "No active license"}
            </div>
            <h2 className="mt-5 text-3xl font-black tracking-[-0.055em] text-white sm:text-4xl">License access</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
              Redeem your Z-BEAM key, unlock bot slots, and track how many sessions are used from one clean panel.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StatCard label="TOTAL" value={status.totalSlots} accent="text-emerald-300" sub="slots" icon={<SlotsIcon />} gradient="from-emerald-500/15 to-teal-500/10" />
              <StatCard label="USED" value={status.usedSlots} accent="text-slate-100" sub="active" icon={<UsedIcon />} gradient="from-slate-700/40 to-slate-800/20" />
              <StatCard label="FREE" value={status.availableSlots} accent="text-emerald-300" sub="ready" icon={<AvailableIcon />} gradient="from-emerald-500/15 to-teal-500/10" />
            </div>
          </div>

          <LicenseVisual hasLicense={hasLicense} slots={status.totalSlots} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="flex items-center gap-2 text-base font-black text-white">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200 ring-1 ring-emerald-300/20">
                  <KeyIcon />
                </span>
                Redeem license key
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Paste your key below. Slots update instantly after a successful redeem.
              </p>
            </div>
            <span className="hidden rounded-full border border-white/10 bg-slate-950/50 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200 sm:inline-flex">secure</span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && redeem()}
                placeholder="abeam-key-xxxxxxxxxx-xxxxxx"
                className="h-13 w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 pr-11 font-mono text-sm tracking-wide text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-emerald-300/45 focus:ring-2 focus:ring-emerald-300/10"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-600">
                <TicketSmallIcon />
              </div>
            </div>
            <button
              onClick={redeem}
              disabled={redeeming}
              className="h-13 rounded-2xl bg-emerald-300 px-6 text-sm font-black text-slate-950 shadow-[0_18px_55px_-30px_color-mix(in_srgb,var(--color-emerald-500)_90%,transparent)] transition hover:bg-emerald-200 active:scale-[.985] disabled:opacity-50"
            >
              {redeeming ? "Redeeming…" : "Redeem"}
            </button>
          </div>

          {redeemMsg && (
            <div className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm leading-relaxed ${redeemMsg.type === "success" ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20" : "bg-rose-500/10 text-rose-200 ring-1 ring-rose-500/20"}`}>
              <span className={`mt-0.5 grid h-5 w-5 place-items-center rounded-full text-[11px] ${redeemMsg.type === "success" ? "bg-emerald-500/20" : "bg-rose-500/20"}`}>
                {redeemMsg.type === "success" ? "✓" : "!"}
              </span>
              <span>{redeemMsg.text}</span>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">Need a key?</span>
            <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">Open Shop</span>
            <span className="rounded-full border border-[#5865F2]/25 bg-[#5865F2]/10 px-3 py-1.5 text-indigo-200">Ask Discord support</span>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
          <h3 className="text-base font-black text-white">Slot status</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {hasLicense
              ? `You have ${status.availableSlots} slots free out of ${status.totalSlots}.`
              : "You start with 0 slots. Redeem a key to unlock bot sessions."}
          </p>
          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Used slots</span>
              <span>{status.usedSlots}/{Math.max(status.totalSlots, 1)}</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-indigo-300"
                style={{ width: `${Math.min(100, Math.round((status.usedSlots / Math.max(status.totalSlots, 1)) * 100))}%` }}
              />
            </div>
            {status.nextExpiry && (
              <p className="mt-3 text-xs text-slate-500">Next expiry: {new Date(status.nextExpiry).toLocaleString()}</p>
            )}
          </div>
        </div>
      </section>

      {hasLicense ? (
        <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-white">Active licenses</h3>
              <p className="mt-1 text-sm text-slate-500">Current keys and remaining time.</p>
            </div>
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold text-emerald-200">{status.activeLicenses.length} active</span>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {status.activeLicenses.map((lic) => (
              <LicenseCard key={lic.id} lic={lic} />
            ))}
          </div>
        </section>
      ) : (
        <section className="grid place-items-center rounded-[1.7rem] border border-dashed border-white/[0.12] bg-white/[0.025] px-6 py-14 text-center backdrop-blur-xl">
          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-300/10 text-emerald-200 ring-1 ring-emerald-300/20"><LockIcon size={28} /></div>
          <h3 className="mt-5 text-lg font-black text-white">No active license yet</h3>
          <p className="mt-2 max-w-md text-sm leading-7 text-slate-400">Redeem a valid key above to unlock bot slots and start using the dashboard.</p>
        </section>
      )}
    </div>
  );
}

function LicenseVisual({ hasLicense, slots }: { hasLicense: boolean; slots: number }) {
  return (
    <div className="relative min-h-[260px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-slate-950/55 p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_srgb,var(--color-emerald-400)_22%,transparent),transparent_18rem)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">access pass</span>
          <span className="rounded-full bg-emerald-300 px-3 py-1.5 text-xs font-black text-slate-950">{hasLicense ? "active" : "locked"}</span>
        </div>
        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-5xl font-black tracking-[-0.08em] text-white">{slots}</p>
            <p className="mt-1 text-sm font-semibold text-slate-400">bot slots</p>
          </div>
          <div className="flex -space-x-5">
            {['wisp', 'xNestorio', 'Stimpy'].map((name) => (
              <span key={name} className="grid h-20 w-16 place-items-end overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-xl">
                <img src={`https://visage.surgeplay.com/bust/120/${name}`} alt="" className="h-full w-full object-cover object-bottom [image-rendering:pixelated]" />
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-3 font-mono text-xs text-slate-500">
          abeam-key-••••••••••••••••
        </div>
      </div>
    </div>
  );
}

function LicenseCard({ lic, expired }: { lic: LicenseInfo; expired?: boolean }) {
  return (
    <div className={`group relative overflow-hidden rounded-[14px] border p-[1px] transition-all hover:-translate-y-[1px] ${expired ? "border-slate-800/60 bg-slate-900/30 opacity-60" : "border-slate-700/60 bg-slate-800/40 hover:border-slate-600/60 hover:bg-slate-800/60"}`}>
      <div className={`rounded-[13px] p-3.5 ${expired ? "bg-slate-900/40" : "bg-slate-900/60 backdrop-blur"}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className={`h-2 w-2 rounded-full ${expired ? "bg-slate-500" : "bg-emerald-400 shadow-[0_0_8px_color-mix(in_srgb,var(--color-emerald-400)_50%,transparent)]"}`} />
            <span className="text-[12px] font-semibold text-slate-200">{lic.slots} slots</span>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-500 ring-1 ring-slate-700/40">
              {lic.durationDays}d {lic.durationHours}h
            </span>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${expired ? "bg-slate-800 text-slate-500" : "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20"}`}>
            {lic.timeLeft}
          </span>
        </div>
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <ClockIcon /> {new Date(lic.expiresAt).toLocaleString()}
          </span>
          {lic.reason && (
            <span className="rounded bg-slate-800/60 px-1.5 py-0.5 text-slate-400 ring-1 ring-slate-700/30">{lic.reason}</span>
          )}
          {lic.licenseKey && <span className="font-mono text-emerald-300/50">· {lic.licenseKey.slice(0, 22)}...</span>}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent, sub, icon, gradient }: { label: string; value: number; accent: string; sub: string; icon: React.ReactNode; gradient: string }) {
  return (
    <div className="group relative overflow-hidden rounded-[16px] border border-slate-800 bg-slate-900/60 p-[1px] backdrop-blur transition-all hover:-translate-y-[1px] hover:border-slate-700">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
      <div className="relative rounded-[15px] bg-[#121526]/80 p-4">
        <div className="flex items-start justify-between">
          <div className={`grid h-8 w-8 place-items-center rounded-lg bg-slate-800 text-slate-400 ring-1 ring-slate-700/50`}>{icon}</div>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-widest text-slate-500 ring-1 ring-slate-700/30">{sub}</span>
        </div>
        <div className={`mt-3 text-[26px] font-bold leading-none tracking-tight ${accent}`}>{value}</div>
        <div className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">{label}</div>
      </div>
    </div>
  );
}

function TicketThumbIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  );
}
function TicketSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="7.5" r="4.5" />
      <path d="m21 21-5.5-5.5M10.5 7.5h3M7.5 10.5v-3" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function SlotsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function UsedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function AvailableIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
