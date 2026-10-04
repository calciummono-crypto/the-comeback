"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- the Discord login anchor points at an API route that redirects to OAuth, not a page */

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BotDashboard from "./BotDashboard";
import AdminPanel from "./AdminPanel";
import SettingsPanel from "./SettingsPanel";
import TrainAiPanel from "./TrainAiPanel";
import LicensePanel from "./LicensePanel";
import ShopPanel from "./ShopPanel";
import HowItWorksPanel from "./HowItWorksPanel";
import AdminAddBotPanel from "./AdminAddBotPanel";
import ToastHost from "./ToastHost";
import { Logo, Wordmark } from "./Logo";

type Me = {
  id: string;
  username: string;
  avatar: string | null;
  role: string;
  botSlots: number;
  botCount: number;
  isGuest: boolean;
};

type NotificationItem = {
  id: string;
  title: string;
  text: string;
  time: string;
  tone?: "emerald" | "amber" | "rose" | "sky";
  invoiceId?: string;
};

type Tab = "dashboard" | "guide" | "license" | "shop" | "admin" | "addbot" | "train" | "settings";

// Tabs are URL-driven: /shop, /license, /admin… so links are shareable and
// the Discord buttons (…/#shop) land on the right tab.
const TAB_PATHS: Record<Tab, string> = {
  dashboard: "/dashboard",
  guide: "/how-it-works",
  license: "/license",
  shop: "/shop",
  admin: "/admin",
  addbot: "/addbot",
  train: "/train",
  settings: "/settings",
};
const PATH_TABS = new Map<string, Tab>(
  (Object.entries(TAB_PATHS) as [Tab, string][]).map(([tab, path]) => [path, tab]),
);

function tabFromPath(pathname: string): Tab {
  return PATH_TABS.get(pathname) ?? "dashboard";
}

export default function AppShell() {
  const [me, setMe] = useState<Me | null>(null);
  const [discordConfigured, setDiscordConfigured] = useState(true);
  // Plan status shown as a bar under the account name in the sidebar.
  const [planBar, setPlanBar] = useState<{ pct: number; label: string } | null>(null);
  const [loaded, setLoaded] = useState(false);
  const pathname = usePathname();
  const [tab, setTabState] = useState<Tab>(() => tabFromPath(pathname));
  const [dashboardSearch, setDashboardSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // In-app tab switches push the URL without a Next navigation, so the shell
  // (and its loaded state) never remounts.
  const setTab = useCallback((next: Tab) => {
    setTabState(next);
    window.history.pushState({}, "", TAB_PATHS[next]);
  }, []);

  // Browser back/forward keeps the tab in sync.
  useEffect(() => {
    const onPop = () => setTabState(tabFromPath(window.location.pathname));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // External links (Discord Renew Now / Buy License) point at /#shop etc —
  // honor the hash once on load.
  useEffect(() => {
    const t = setTimeout(() => {
      const hash = window.location.hash.replace("#", "");
      if (!(hash in TAB_PATHS)) return;
      if (hash !== tabFromPath(window.location.pathname)) {
        window.history.replaceState({}, "", TAB_PATHS[hash as Tab]);
        setTabState(hash as Tab);
      }
    }, 0);
    return () => clearTimeout(t);
  }, []);
  const [mobileNav, setMobileNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem("mcbm:sidebar-collapsed") !== "1") return;
    } catch {
      return;
    }
    // deferred a tick: no sync setState in the effect, and the width
    // transition makes the restore look intentional instead of a pop
    const id = setTimeout(() => setCollapsed(true), 0);
    return () => clearTimeout(id);
  }, []);

  function toggleCollapsed() {
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem("mcbm:sidebar-collapsed", next ? "1" : "0");
      } catch {}
      return next;
    });
  }

  const loadMe = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await res.json();
      setMe(data.user ?? null);
      setDiscordConfigured(data.discordConfigured ?? false);
      if (data.user) {
        try {
          const lres = await fetch("/api/licenses", { cache: "no-store" });
          if (lres.ok) {
            const st = await lres.json();
            if (data.user.role === "admin") {
              setPlanBar({ pct: 100, label: "Admin · unlimited" });
            } else if (Array.isArray(st?.activeLicenses) && st.activeLicenses.length > 0) {
              const now = Date.now();
              const exp = (l: { expiresAt: string }) => new Date(l.expiresAt).getTime();
              const furthest = st.activeLicenses.reduce((a: { expiresAt: string; createdAt: string }, l: { expiresAt: string; createdAt: string }) => (exp(l) > exp(a) ? l : a));
              const total = Math.max(1, exp(furthest) - new Date(furthest.createdAt).getTime());
              const remaining = Math.max(0, exp(furthest) - now);
              const pct = Math.max(3, Math.min(100, Math.round((remaining / total) * 100)));
              const hrs = Math.floor(remaining / 3_600_000);
              const label = hrs >= 24 ? `${Math.floor(hrs / 24)}d ${hrs % 24}h left` : `${hrs}h left`;
              setPlanBar({ pct, label: `${st.totalSlots ?? 0} slots · ${label}` });
            } else {
              setPlanBar(null);
            }
          }
        } catch {
          // plan bar is cosmetic — ignore fetch errors
        }
      } else {
        setPlanBar(null);
      }
    } catch {
      setMe(null);
      setPlanBar(null);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const first = setTimeout(() => loadMe(), 0);
    return () => clearTimeout(first);
  }, [loadMe]);

  // Discourage casual inspection/saving: block the right-click menu (the
  // "Inspect" entry) and the save/view-source shortcuts. The app itself is a
  // JS-rendered shell behind auth, so a saved page contains no app content.
  // DevTools keyboard shortcuts stay available — the admin needs them.
  useEffect(() => {
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "u"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.data?.type === "mcbm:login-success") {
        loadMe();
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loadMe]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "success" && window.opener) {
      try {
        window.opener.postMessage({ type: "mcbm:login-success" }, "*");
      } catch {}
      window.history.replaceState({}, "", "/dashboard");
      setTimeout(() => {
        try {
          window.close();
        } catch {}
      }, 400);
    }
  }, []);

  useEffect(() => {
    if (!me) return;
    let alive = true;
    const accountNote: NotificationItem = {
      id: "account-ready",
      title: "Account signed in",
      text: `${me.username} is connected to Z-BEAM.`,
      time: "now",
      tone: "emerald",
    };
    setNotifications((current) => [accountNote, ...current.filter((item) => item.id !== "account-ready")].slice(0, 12));

    const loadPendingInvoices = async () => {
      try {
        const res = await fetch("/api/shop/invoices", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        const pending = (Array.isArray(data.invoices) ? data.invoices : [])
          .filter((inv: { id: string; status: string; expiresAt: string }) => inv.status === "pending" && new Date(inv.expiresAt).getTime() > Date.now())
          .slice(0, 3)
          .map((inv: { id: string; amountUSD: number; amountLTC: string; expiresAt: string; tier?: string }) => ({
            id: `invoice-${inv.id}`,
            title: "Pending invoice",
            text: `${inv.tier || "Shop"} checkout for $${inv.amountUSD} is still active. Click to reopen it before the 1 hour timer ends.`,
            time: "now",
            tone: "amber" as const,
            invoiceId: inv.id,
          }));
        if (alive) {
          setNotifications((current) => [
            ...current.filter((item) => !item.invoiceId),
            ...pending,
          ].slice(0, 12));
        }
      } catch {}
    };

    void loadPendingInvoices();
    const t = setInterval(loadPendingInvoices, 30_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [me?.id, me?.username]);

  useEffect(() => {
    const onNotify = (ev: Event) => {
      const detail = (ev as CustomEvent<Partial<NotificationItem>>).detail ?? {};
      setNotifications((current) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          title: detail.title || "Notification",
          text: detail.text || "Z-BEAM event updated.",
          time: "now",
          tone: detail.tone || "sky",
          invoiceId: detail.invoiceId,
        },
        ...current,
      ].slice(0, 12));
    };
    window.addEventListener("zbeam:notification", onNotify);
    return () => window.removeEventListener("zbeam:notification", onNotify);
  }, []);

  function openNotification(item: NotificationItem) {
    if (!item.invoiceId) return;
    setNotificationsOpen(false);
    setTab("shop");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("zbeam:open-invoice", { detail: { invoiceId: item.invoiceId } }));
    }, 80);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    setTab("dashboard");
  }

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="flex flex-col items-center gap-4">
          <Logo size={56} className="animate-pulse" />
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-600 border-t-emerald-400" />
            Loading…
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

  // Admin-only tabs fall back to the dashboard content for regular users.
  const activeTab: Tab =
    tab === "admin" || tab === "addbot" || tab === "train"
      ? me.role === "admin"
        ? tab
        : "dashboard"
      : tab;

  const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "dashboard", label: "Bots", icon: <BotIcon /> },
    { key: "guide", label: "How it works", icon: <GuideIcon /> },
    { key: "license", label: "License", icon: <TicketIcon /> },
    { key: "shop", label: "Shop", icon: <ShopIcon /> },
    ...(me.role === "admin"
      ? [
          { key: "admin" as Tab, label: "Admin", icon: <ShieldIcon /> },
          { key: "addbot" as Tab, label: "Add Bots", icon: <PlusBotIcon /> },
          { key: "train" as Tab, label: "Train AI", icon: <BrainIcon /> },
        ]
      : []),
    { key: "settings", label: "Settings", icon: <GearIcon /> },
  ];

  return (
    <div className="flex min-h-screen">
      <ToastHost />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-emerald-300/10 bg-[#070b10]/92 shadow-[18px_0_70px_-55px_color-mix(in_srgb,var(--color-emerald-500)_55%,transparent)] backdrop-blur-2xl transition-all duration-300 lg:translate-x-0 ${
          mobileNav ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "lg:w-[76px]" : "lg:w-64"}`}
      >
        <div className={`flex items-center gap-3 border-b border-white/[0.06] py-5 ${collapsed ? "justify-center px-3 lg:flex-col lg:gap-2" : "px-5"}`}>
          <Logo size={collapsed ? 32 : 40} className="drop-shadow-[0_4px_16px_color-mix(in_srgb,var(--color-emerald-500)_35%,transparent)]" />
          {!collapsed && (
            <div className="leading-tight">
              <Wordmark height={22} />
              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/55">session control</div>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden h-7 w-7 shrink-0 place-items-center rounded-lg border border-white/10 text-slate-500 transition hover:border-emerald-300/25 hover:text-slate-200 lg:grid ${
              collapsed ? "" : "ml-auto"
            }`}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              title={item.label}
              onClick={() => {
                setTab(item.key);
                setMobileNav(false);
              }}
              className={`group flex items-center rounded-xl text-sm font-medium transition-all ${
                collapsed
                  ? "justify-center px-0 py-2.5"
                  : "gap-3 px-3.5 py-2.5"
              } ${
                activeTab === item.key
                  ? "bg-emerald-300/10 text-emerald-100 ring-1 ring-emerald-300/20 shadow-[0_0_28px_-20px_color-mix(in_srgb,var(--color-emerald-500)_80%,transparent)]"
                  : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100"
              }`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg transition ${
                  activeTab === item.key
                    ? "bg-emerald-300/15 text-emerald-200"
                    : "bg-white/[0.045] text-slate-400 group-hover:text-slate-200"
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && item.label}
              {!collapsed && activeTab === item.key && (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_14px_color-mix(in_srgb,var(--color-emerald-500)_90%,transparent)]" />
              )}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <div className={`flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3 ${collapsed ? "lg:justify-center lg:gap-0 lg:p-2" : ""}`}>
            {me.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={me.avatar} alt="" className="h-9 w-9 rounded-full" />
            ) : (
              <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-300 text-xs font-bold text-slate-950">
                {me.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className={`min-w-0 flex-1 ${collapsed ? "lg:hidden" : ""}`}>
              <div className="flex items-center gap-1.5">
                <span className="truncate text-sm font-semibold">
                  {me.username}
                </span>
                {me.role === "admin" && (
                  <span className="rounded bg-fuchsia-500/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-fuchsia-300">
                    admin
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                {me.isGuest ? "guest account" : me.username.includes("local:") ? "local" : "discord"}
              </div>
              {planBar ? (
                <div className="mt-1.5">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-slate-700/50">
                    <div
                      className="h-full rounded-full bg-sky-400"
                      style={{ width: `${planBar.pct}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] font-medium text-slate-500">
                    {planBar.label}
                  </div>
                </div>
              ) : (
                me.role !== "admin" && (
                  <div className="mt-1 text-[10px] text-slate-600">No active plan</div>
                )
              )}
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className={`mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-rose-500/40 hover:text-rose-300 ${
              collapsed ? "lg:px-1" : ""
            }`}
          >
            <LogoutIcon /> {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {mobileNav && (
        <div
          onClick={() => setMobileNav(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className={`flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--color-emerald-500)_6%,transparent),transparent_34rem)] transition-all duration-300 ${collapsed ? "lg:pl-[76px]" : "lg:pl-64"}`}>
        <div className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <Wordmark height={22} />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setNotificationsOpen((v) => !v)}
              className="relative grid h-9 w-9 place-items-center rounded-lg border border-slate-800 text-slate-300"
              aria-label="Open notifications"
            >
              <BellIcon />
              {notifications.length > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-emerald-300" />}
            </button>
            <button
              onClick={() => setMobileNav(true)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-slate-800 text-slate-300"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        <div className="border-b border-white/[0.06] bg-slate-950/40 px-4 py-3 lg:hidden">
          <label className="flex h-11 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-slate-500">
            <SearchIcon />
            <input
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
              placeholder="Search bots..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-100 outline-none placeholder:text-slate-600"
            />
          </label>
          {notificationsOpen && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <p className="text-sm font-black text-white">Notifications</p>
                <button onClick={() => setNotifications([])} className="text-xs font-semibold text-slate-500">clear</button>
              </div>
              <div className="max-h-64 overflow-y-auto p-2">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications yet.</div>
                ) : notifications.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openNotification(item)}
                    className={`w-full rounded-xl border border-white/[0.06] bg-white/[0.035] p-3 text-left ${item.invoiceId ? "transition hover:border-amber-300/30 hover:bg-amber-300/[0.06]" : ""}`}
                  >
                    <p className="text-sm font-bold text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
                    {item.invoiceId && <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-amber-300">Open invoice</p>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky top-0 z-20 hidden border-b border-white/[0.06] bg-slate-950/55 px-8 py-4 backdrop-blur-2xl lg:block">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
            <label className="group flex h-12 w-full max-w-xl items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] px-4 text-slate-500 shadow-[0_18px_60px_-50px_rgba(0,0,0,.95)] transition focus-within:border-emerald-300/45 focus-within:bg-white/[0.055] focus-within:ring-2 focus-within:ring-emerald-300/10">
              <SearchIcon />
              <input
                value={dashboardSearch}
                onChange={(e) => setDashboardSearch(e.target.value)}
                placeholder="Search bots, servers, status..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-100 outline-none placeholder:text-slate-600"
              />
              {dashboardSearch && (
                <button
                  type="button"
                  onClick={() => setDashboardSearch("")}
                  className="rounded-full px-1.5 text-xs text-slate-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </label>

            <div className="relative">
              <button
                onClick={() => setNotificationsOpen((v) => !v)}
                className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-emerald-300/25 hover:bg-white/[0.065] hover:text-white"
                aria-label="Open notifications"
              >
                <BellIcon />
                {notifications.length > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_color-mix(in_srgb,var(--color-emerald-500)_90%,transparent)]" />
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-14 w-[360px] overflow-hidden rounded-3xl border border-white/10 bg-slate-950/92 shadow-[0_28px_100px_-50px_rgba(0,0,0,.95)] backdrop-blur-2xl">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                    <div>
                      <p className="text-sm font-black text-white">Notifications</p>
                      <p className="text-[11px] text-slate-500">keys, bots and account events</p>
                    </div>
                    <button
                      onClick={() => setNotifications([])}
                      className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] font-semibold text-slate-400 transition hover:text-white"
                    >
                      clear
                    </button>
                  </div>
                  <div className="max-h-[360px] overflow-y-auto p-2">
                    {notifications.length === 0 ? (
                      <div className="grid place-items-center px-6 py-10 text-center text-sm text-slate-500">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => openNotification(item)}
                          className={`w-full rounded-2xl border border-white/[0.06] bg-white/[0.035] p-3 text-left ${item.invoiceId ? "transition hover:border-amber-300/30 hover:bg-amber-300/[0.06]" : ""}`}
                        >
                          <div className="flex gap-3">
                            <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                              item.tone === "rose" ? "bg-rose-400" : item.tone === "amber" ? "bg-amber-300" : item.tone === "sky" ? "bg-sky-300" : "bg-emerald-300"
                            }`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="truncate text-sm font-bold text-slate-100">{item.title}</p>
                                <span className="shrink-0 font-mono text-[10px] text-slate-600">{item.time}</span>
                              </div>
                              <p className="mt-1 text-xs leading-5 text-slate-400">{item.text}</p>
                              {item.invoiceId && <p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-amber-300">Open invoice</p>}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-8 lg:py-8">
          {activeTab === "dashboard" && <DashboardDiscordBanner />}
          <div key={activeTab} className="animate-fade-in">
            {activeTab === "dashboard" && <BotDashboard meRole={me.role} search={dashboardSearch} />}
            {activeTab === "guide" && <HowItWorksPanel />}
            {activeTab === "license" && <LicensePanel />}
            {activeTab === "shop" && <ShopPanel onGoLicense={() => setTab("license")} />}
            {activeTab === "admin" && me.role === "admin" && (
              <AdminPanel meId={me.id} />
            )}
            {activeTab === "addbot" && me.role === "admin" && (
              <AdminAddBotPanel />
            )}
            {activeTab === "train" && me.role === "admin" && <TrainAiPanel />}
            {activeTab === "settings" && <SettingsPanel me={me} onChange={loadMe} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardDiscordBanner() {
  return (
    <section className="mb-6 overflow-hidden rounded-[1.6rem] border border-[#5865F2]/30 bg-[linear-gradient(90deg,rgba(88,101,242,.18),rgba(255,255,255,.035))] p-4 shadow-[0_24px_80px_-60px_rgba(88,101,242,.9)] backdrop-blur-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#5865F2] text-white shadow-[0_18px_50px_-28px_rgba(88,101,242,.9)]">
            <DiscordIcon />
          </div>
          <div>
            <p className="text-sm font-black text-white">Join the Z-BEAM Discord</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">Get license help, update notes, server-specific fixes and support without leaving the dashboard.</p>
          </div>
        </div>
        <a
          href="https://discord.gg/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#5865F2] px-4 text-sm font-black text-white transition hover:bg-[#6673ff] active:scale-[.985]"
        >
          <DiscordIcon /> Discord
        </a>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

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
    <div className="relative grid min-h-screen place-items-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-600/20 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-600/20 blur-[130px]" />
      </div>

      <div className="relative w-full max-w-[460px] animate-pop-in overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/58 p-6 shadow-[0_30px_110px_-60px_rgba(0,0,0,.95)] backdrop-blur-2xl sm:p-8">
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/50 to-transparent" />
        <div className="flex flex-col items-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-[1.6rem] border border-white/10 bg-white/[0.045] shadow-[0_20px_70px_-40px_color-mix(in_srgb,var(--color-emerald-500)_70%,transparent)]">
            <Logo size={58} />
          </div>
          <h1 className="mt-5 text-2xl font-bold tracking-tight">
            <Wordmark height={34} className="mx-auto" />
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-7 text-slate-400">
            Sign in to open the dashboard. Session tokens, bot controls and license slots stay behind auth.
          </p>
        </div>

        <div className="mt-7 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#5865F2] text-white">
                <DiscordIcon />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Discord login</p>
                <p className="text-xs text-slate-500">Recommended for Z-BEAM access</p>
              </div>
            </div>
            {discordConfigured ? (
              <a
                href="/api/auth/discord/login"
                className="zb-soft-button group flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[#5865F2] px-4 py-3.5 text-sm font-bold text-white shadow-[0_18px_60px_-32px_rgba(88,101,242,.9)] transition hover:bg-[#6773f6] active:scale-[.985]"
              >
                <DiscordIcon />
                Continue with Discord
              </a>
            ) : (
              <div className="space-y-3">
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-200">
                  Discord OAuth is not configured in this environment. Guest login is available for local testing only.
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && devLogin()}
                  placeholder="Guest username"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/15"
                />
                <button
                  onClick={devLogin}
                  disabled={busy}
                  className="zb-soft-button w-full rounded-2xl border border-white/10 bg-white px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-100 disabled:opacity-50"
                >
                  {busy ? "Signing in…" : "Continue as guest"}
                </button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-200">after login</p>
            <div className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-3">
              <span className="rounded-xl bg-white/[0.035] px-3 py-2">resolve token</span>
              <span className="rounded-xl bg-white/[0.035] px-3 py-2">pick server</span>
              <span className="rounded-xl bg-white/[0.035] px-3 py-2">control bot</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.369a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.036A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.1 13.1 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.127 12.3 12.3 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.331c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}
function GuideIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4.5h9a3 3 0 0 1 3 3v12H8a3 3 0 0 0-3-3z" />
      <path d="M5 4.5v12" />
      <path d="M9 8h4" />
      <path d="M9 11h5" />
    </svg>
  );
}

function PlusBotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M9 14h.01M15 14h.01M2 13v2M22 13v2" />
      <path d="M17 1v6M14 4h6" />
    </svg>
  );
}
function CollapseIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
    </svg>
  );
}
function BotIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="8" width="16" height="12" rx="3" />
      <path d="M12 4v4M9 14h.01M15 14h.01M2 13v2M22 13v2" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function BrainIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}
function TicketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2M13 17v2M13 11v2" />
    </svg>
  );
}
function ShopIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
