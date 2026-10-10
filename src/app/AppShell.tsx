"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Bot as BotIcon,
  BrainCircuit,
  ChevronLeft,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
} from "lucide-react";
import BotDashboard from "./BotDashboard";
import AdminPanel from "./AdminPanel";
import SettingsPanel from "./SettingsPanel";
import TrainAiPanel from "./TrainAiPanel";
import { Logo } from "./Logo";
import { TextRoll } from "@/components/ui/skiper/text-roll";
import { AnimatedLink } from "@/components/ui/skiper/animated-link";

type Me = {
  id: string;
  username: string;
  avatar: string | null;
  role: string;
  botSlots: number;
  botCount: number;
  isGuest: boolean;
};

type Tab = "dashboard" | "admin" | "train" | "settings";

type SessionPayload = {
  user: Me | null;
  discordConfigured?: boolean;
};

const TAB_META: Record<Tab, { label: string; icon: React.ReactNode }> = {
  dashboard: { label: "Bots", icon: <BotIcon size={16} strokeWidth={1.75} /> },
  admin: {
    label: "Admin",
    icon: <ShieldCheck size={16} strokeWidth={1.75} />,
  },
  train: {
    label: "Train AI",
    icon: <BrainCircuit size={16} strokeWidth={1.75} />,
  },
  settings: {
    label: "Settings",
    icon: <Settings size={16} strokeWidth={1.75} />,
  },
};

export default function AppShell() {
  const [me, setMe] = useState<Me | null>(null);
  const [discordConfigured, setDiscordConfigured] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);

  const applySession = useCallback((data: SessionPayload | null) => {
    setMe(data?.user ?? null);
    setDiscordConfigured(data?.discordConfigured ?? false);
    setLoaded(true);
  }, []);

  const readSession = useCallback(
    () =>
      fetch("/api/auth/me", { cache: "no-store" }).then(
        (res) => res.json() as Promise<SessionPayload>,
      ),
    [],
  );

  const loadMe = useCallback(async () => {
    try {
      applySession(await readSession());
    } catch {
      applySession(null);
    }
  }, [applySession, readSession]);

  useEffect(() => {
    let alive = true;
    readSession()
      .then((data) => {
        if (alive) applySession(data);
      })
      .catch(() => {
        if (alive) applySession(null);
      });
    return () => {
      alive = false;
    };
  }, [readSession, applySession]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setTab("dashboard");
  }

  if (!loaded) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size={52} className="animate-pulse" />
          <div className="flex items-center gap-2 font-mono text-xs text-ink-3">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/15 border-t-sun" />
            loading session
          </div>
        </div>
      </div>
    );
  }

  if (!me) {
    return (
      <LoginScreen discordConfigured={discordConfigured} onDevLogin={loadMe} />
    );
  }

  const navItems = (["dashboard", "admin", "train", "settings"] as Tab[]).filter(
    (k) => k === "dashboard" || k === "settings" || me.role === "admin",
  );

  return (
    <div className="flex min-h-dvh">
      {/* ---- sidebar ---- */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-line bg-void/85 backdrop-blur-xl transition-transform duration-300 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-4">
          <Logo size={34} />
          <div className="min-w-0 leading-tight">
            <div className="truncate text-[13px] font-semibold tracking-tight">
              <TextRoll>The Comeback</TextRoll>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              mc bot manager
            </div>
          </div>
          <button
            onClick={() => setMobileNav(false)}
            aria-label="Close navigation"
            className="ml-auto grid h-8 w-8 place-items-center rounded-md text-ink-3 hover:bg-white/5 hover:text-ink lg:hidden"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-2 py-2">
          <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            workspace
          </p>
          {navItems.map((key) => {
            const meta = TAB_META[key];
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setTab(key);
                  setMobileNav(false);
                }}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-white/[0.07] text-ink"
                    : "text-ink-2 hover:bg-white/[0.04] hover:text-ink"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full transition-all ${
                    active
                      ? "bg-sun opacity-100"
                      : "bg-sun opacity-0 group-hover:opacity-40"
                  }`}
                />
                <span
                  className={`grid h-7 w-7 place-items-center rounded-md transition-colors ${
                    active
                      ? "bg-sun/15 text-sun"
                      : "text-ink-3 group-hover:text-ink-2"
                  }`}
                >
                  {meta.icon}
                </span>
                {meta.label}
              </button>
            );
          })}
        </nav>

        {/* ---- user block ---- */}
        <div className="border-t border-line p-2">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            {me.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={me.avatar}
                alt=""
                className="h-8 w-8 rounded-md border border-line"
              />
            ) : (
              <div className="grid h-8 w-8 place-items-center rounded-md bg-gradient-to-b from-sun to-[#8d1046] text-[11px] font-bold text-void">
                {me.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate text-[13px] font-semibold">
                  {me.username}
                </span>
                {me.role === "admin" && (
                  <span className="rounded border border-mod/40 bg-mod/10 px-1 py-px font-mono text-[9px] font-bold uppercase tracking-wider text-mod">
                    admin
                  </span>
                )}
              </div>
              <div className="font-mono text-[10px] text-ink-3">
                {me.isGuest ? "guest" : "discord"} ·{" "}
                {me.botCount}/{me.botSlots} slots
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-md border border-transparent px-3 py-2 text-xs font-medium text-ink-3 transition-colors hover:border-fail/40 hover:text-fail"
          >
            <LogOut size={13} /> Log out
          </button>
        </div>
      </aside>

      {/* ---- mobile overlay ---- */}
      {mobileNav && (
        <div
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* ---- main ---- */}
      <div className="flex min-w-0 flex-1 flex-col lg:pl-[248px]">
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-void/80 px-4 py-2.5 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2">
            <Logo size={26} />
            <span className="text-[13px] font-semibold tracking-tight">
              The Comeback
            </span>
          </div>
          <button
            onClick={() => setMobileNav(true)}
            aria-label="Open navigation"
            className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-2"
          >
            <Menu size={16} />
          </button>
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-7 sm:px-8">
          <div key={tab} className="animate-fade-in">
            {tab === "dashboard" && <BotDashboard />}
            {tab === "admin" && me.role === "admin" && (
              <AdminPanel meId={me.id} />
            )}
            {tab === "train" && me.role === "admin" && <TrainAiPanel />}
            {tab === "settings" && (
              <SettingsPanel me={me} onChange={loadMe} />
            )}
          </div>
        </main>

        <footer className="border-t border-line px-4 py-5 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 text-xs text-ink-3 sm:flex-row sm:items-center">
            <span className="font-mono">
              the-comeback · build 0.1 · minecraft sunset edition
            </span>
            <div className="flex items-center gap-5">
              <AnimatedLink
                href="https://skiper-ui.com"
                className="hover:text-ink-2"
              >
                Skiper UI
              </AnimatedLink>
              <AnimatedLink
                href="https://nextjs.org"
                className="hover:text-ink-2"
              >
                Next.js
              </AnimatedLink>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function LoginScreen({
  discordConfigured,
  onDevLogin,
}: {
  discordConfigured: boolean;
  onDevLogin: () => void;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  async function devLogin() {
    setBusy(true);
    try {
      await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      onDevLogin();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-dvh place-items-center px-4 py-12">
      <div className="w-full max-w-[400px] animate-rise">
        <div className="mb-7 flex flex-col items-center text-center">
          <Logo size={64} />
          <h1 className="mt-4 text-[26px] font-semibold tracking-tight">
            The Comeback
          </h1>
          <p className="mt-1.5 max-w-[30ch] text-sm leading-relaxed text-ink-2">
            Spin up Minecraft bots, watch their console live, and run the beam —
            all from one console.
          </p>
        </div>

        <div className="panel rounded-xl p-5">
          {discordConfigured ? (
            <a
              href="/api/auth/discord/login"
              className="btn w-full bg-[#5865F2] text-white hover:bg-[#4752c4]"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Continue with Discord
            </a>
          ) : (
            <div className="space-y-3">
              <div className="rounded-md border border-wait/30 bg-wait/10 px-3 py-2 text-xs leading-relaxed text-wait">
                Discord OAuth isn&apos;t configured — use a guest login for now.
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && devLogin()}
                placeholder="Pick a username"
                aria-label="Guest username"
                className="field"
              />
              <button
                onClick={devLogin}
                disabled={busy}
                className="btn btn-primary w-full"
              >
                {busy ? "Signing in…" : "Continue as guest"}
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-3">
          Signed session · 30 days · the first account becomes admin
        </p>
      </div>
    </div>
  );
}
