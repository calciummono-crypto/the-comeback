"use client";

import { Logo, Wordmark } from "./Logo";
import { useState } from "react";
import { THEME_PRESETS, applyThemePreset, loadThemeId, saveThemeId } from "@/lib/theme";
import { toast } from "./toast";
import {
  GearIcon,
  BotFaceIcon,
  MessageIcon,
  TargetIcon,
  EyeIcon,
} from "./Icons";

type Me = {
  id: string;
  username: string;
  avatar: string | null;
  role: string;
  botSlots: number;
  botCount: number;
  isGuest: boolean;
};

export default function SettingsPanel({
  me,
  onChange,
}: {
  me: Me;
  onChange: () => void;
}) {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    onChange();
  }

  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const currentTheme = activeTheme ?? loadThemeId();

  function pickTheme(id: string) {
    applyThemePreset(id);
    saveThemeId(id);
    setActiveTheme(id);
    const preset = THEME_PRESETS.find((p) => p.id === id);
    toast(preset ? `${preset.label} theme applied` : "Theme applied", "success");
  }

  const usedPct = Math.min(100, Math.round((me.botCount / Math.max(me.botSlots, 1)) * 100));

  return (
    <div className="relative space-y-6">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-80px] top-[-80px] h-[300px] w-[300px] rounded-full bg-emerald-400/[0.07] blur-[90px]" />
        <div className="absolute right-[-40px] top-[120px] h-[240px] w-[240px] rounded-full bg-indigo-400/[0.06] blur-[90px]" />
      </div>

      <section className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(15,23,42,.74),rgba(2,6,23,.86))] p-5 shadow-[0_28px_100px_-70px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            {me.avatar ? (
              <img src={me.avatar} alt="" className="h-16 w-16 rounded-2xl ring-1 ring-white/10" />
            ) : (
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-300 text-xl font-black text-slate-950 shadow-[0_18px_60px_-35px_color-mix(in_srgb,var(--color-emerald-500)_80%,transparent)]">
                {me.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">settings</p>
              <h2 className="mt-1 text-3xl font-black tracking-[-0.055em] text-white">{me.username}</h2>
              <p className="mt-1 text-sm text-slate-400">{me.isGuest ? "Guest account" : "Discord account"} · {me.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-400/30 bg-rose-500/10 px-5 text-sm font-bold text-rose-200 transition hover:bg-rose-500/20 active:scale-[.985]"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <InfoTile label="Role" value={me.role} />
        <InfoTile label="Bot slots" value={String(me.botSlots)} />
        <InfoTile label="Bots used" value={`${me.botCount}/${me.botSlots}`} />
      </section>

      <section className="grid gap-5 lg:grid-cols-[.95fr_1.05fr]">
        <div className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
          <h3 className="text-base font-black text-white">Slot usage</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Quick view of how many bot slots are currently used on your account.</p>
          <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/55 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
              <span>Capacity</span>
              <span>{usedPct}%</span>
            </div>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-indigo-300 transition-[width]" style={{ width: `${usedPct}%` }} />
            </div>
          </div>
        </div>

        <div className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
          <h3 className="text-base font-black text-white">Appearance</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Accent color applies across homepage, dashboard, bot cards and controls.</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {THEME_PRESETS.map((preset) => {
              const on = currentTheme === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => pickTheme(preset.id)}
                  className={`flex items-center justify-between rounded-2xl border p-3 transition hover:-translate-y-0.5 ${
                    on
                      ? "border-emerald-300/35 bg-emerald-300/10 text-white ring-1 ring-emerald-300/15"
                      : "border-white/10 bg-slate-950/35 text-slate-400 hover:border-white/20 hover:text-slate-100"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 rounded-full ring-2 ring-white/10" style={{ backgroundColor: preset.ramp["500"] }} />
                    <span className="text-sm font-bold">{preset.label}</span>
                  </span>
                  {on && <span className="text-xs font-black text-emerald-200">active</span>}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl">
        <h3 className="text-base font-black text-white">Bot behavior</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Default dashboard tools available after a bot joins.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <FeatureRow icon={<BotFaceIcon size={18} />} title="Humanized timing" desc="Natural pacing and action delay" />
          <FeatureRow icon={<MessageIcon size={18} />} title="Chat support" desc="Replies stay short and on script" />
          <FeatureRow icon={<TargetIcon size={18} />} title="Target flow" desc="Server-ready setup during add bot" />
          <FeatureRow icon={<EyeIcon size={18} />} title="Live view" desc="Hotbar, inventory and controls" />
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 pt-2 text-xs text-slate-600">
        <Logo size={18} /> <Wordmark height={17} />
      </div>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 transition-colors hover:border-slate-700">
      <div className="text-[10px] uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-[15px] font-semibold capitalize text-slate-100">
        {value}
      </div>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700">
      <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/20">
        {icon}
      </span>
      <div>
        <div className="text-sm font-medium text-slate-200">{title}</div>
        <div className="mt-0.5 text-xs text-slate-500">{desc}</div>
      </div>
    </div>
  );
}
