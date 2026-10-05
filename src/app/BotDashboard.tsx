"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PlusIcon, LockIcon, TrashIcon, BotFaceIcon, GearIcon } from "./Icons";
import { SkeletonBotList } from "./Skeleton";
import AddBotWizard from "./AddBotWizard";
import { BotItem, BotStatus, LogEntry } from "./types";
import BotDetailView from "./BotDetailView";
import { toast } from "./toast";

const STATUS_META: Record<
  BotStatus,
  { label: string; dot: string; text: string; ring: string }
> = {
  online: {
    label: "Joined",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
    ring: "ring-emerald-500/30 bg-emerald-500/10",
  },
  connecting: {
    label: "Connecting",
    dot: "bg-amber-400 animate-pulse",
    text: "text-amber-300",
    ring: "ring-amber-500/30 bg-amber-500/10",
  },
  error: {
    label: "Failed",
    dot: "bg-rose-500",
    text: "text-rose-300",
    ring: "ring-rose-500/30 bg-rose-500/10",
  },
  offline: {
    label: "Stopped",
    dot: "bg-slate-500",
    text: "text-slate-400",
    ring: "ring-slate-600/40 bg-slate-700/20",
  },
};

const VERSIONS = [
  "1.21.11",
  "1.21.9",
  "1.21.8",
  "1.21.6",
  "1.21.5",
  "1.21.4",
  "1.21.3",
  "1.21.1",
  "1.21",
  "1.20.6",
  "1.20.4",
  "1.20.2",
  "1.20.1",
  "1.19.4",
  "1.19.2",
  "1.18.2",
  "1.17.1",
  "1.16.5",
  "1.12.2",
  "1.8.9",
];

export default function BotDashboard({
  meRole = "user",
  search = "",
}: {
  meRole?: string;
  search?: string;
}) {
  const [items, setItems] = useState<BotItem[]>([]);
  const [slots, setSlots] = useState<number>(0);
  const [licenseStatus, setLicenseStatus] = useState<any>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteBot, setDeleteBot] = useState<BotItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/bots", { cache: "no-store" });
      const data = await res.json();
      setItems(data.bots ?? []);
      if (typeof data.slots === "number") setSlots(data.slots);
      if (data.licenseStatus) setLicenseStatus(data.licenseStatus);
    } catch {
      /* ignore */
    } finally {
      setLoaded(true);
    }
  }, []);

  const slotsFull = slots > 0 && items.length >= slots;
  const noLicense = slots === 0;

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 2500);
    return () => clearInterval(t);
  }, [refresh]);

  const activeBot = items.find((b) => b.id === activeBotId) ?? null;
  const editBot = items.find((b) => b.id === editId) ?? null;
  const searchTerm = search.trim().toLowerCase();
  const visibleItems = searchTerm
    ? items.filter((bot) =>
        [
          bot.name,
          bot.username,
          bot.host,
          bot.status,
          bot.version,
          bot.beamType,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm),
      )
    : items;

  return (
    <div>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-200/80">dashboard</p>
          <h2 className="mt-1 text-2xl font-black tracking-[-0.04em] text-white">Bots</h2>
          <p className="mt-1 text-sm text-slate-400">
            {slots > 0 ? (
              <>
                Using{" "}
                <span
                  className={
                    slotsFull ? "font-semibold text-amber-300" : "text-slate-200"
                  }
                >
                  {items.length}/{slots}
                </span>{" "}
                bot slots
                {licenseStatus?.nextExpiry && (
                  <span className="ml-2 text-xs text-amber-300/70">
                    · expires {new Date(licenseStatus.nextExpiry).toLocaleDateString()}
                  </span>
                )}
              </>
            ) : (
              "Add sessions, pick servers, and control bots live."
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          disabled={slotsFull || noLicense}
          title={
            noLicense
              ? "No license - 0 slots. Go to License tab"
              : slotsFull
                ? "No bot slots left — ask an admin"
                : "Add a bot"
          }
          className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-5 text-sm font-black text-slate-950 shadow-[0_18px_50px_-26px_color-mix(in_srgb,var(--color-emerald-500)_90%,transparent)] transition hover:bg-emerald-200 active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <PlusIcon size={16} /> Add bot
        </button>
      </header>

      {noLicense && loaded && (
        <div className="mt-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <LockIcon size={20} />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-200">No bot slots - license required</h3>
              <p className="mt-1 text-xs leading-relaxed text-amber-200/70">
                You start with 0 slots. An admin must grant you a license with slots and duration (days/hours).
                <br />
                Go to <span className="font-semibold text-amber-300">License</span> tab in sidebar to see your status.
              </p>
            </div>
          </div>
        </div>
      )}

      {!activeBot ? (
        <section className="mt-6 animate-fade-in">
          {!loaded ? (
            <SkeletonBotList n={3} />
          ) : items.length === 0 ? (
            <EmptyState onAdd={() => setShowAdd(true)} />
          ) : visibleItems.length === 0 ? (
            <NoSearchResults query={search} />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((bot) => (
                <BotCard
                  key={bot.id}
                  bot={bot}
                  onChanged={refresh}
                  onSelect={() => setActiveBotId(bot.id)}
                  onManage={() => setEditId(bot.id)}
                  onDelete={() => setDeleteBot(bot)}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="mt-6 animate-pop-in">
          <button
            onClick={() => setActiveBotId(null)}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            ← Back to Bots
          </button>
          <BotDetailView bot={activeBot} onChanged={refresh} />
        </div>
      )}

      {showAdd && (
        <AddBotWizard
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            refresh();
          }}
        />
      )}

      {deleteBot && (
        <ConfirmDeleteModal
          bot={deleteBot}
          busy={deleting}
          onClose={() => setDeleteBot(null)}
          onConfirm={async () => {
            setDeleting(true);
            try {
              const res = await fetch(`/api/bots/${deleteBot.id}`, { method: "DELETE" });
              if (res.ok) {
                window.dispatchEvent(new CustomEvent("zbeam:notification", {
                  detail: {
                    title: "Bot deleted",
                    text: `${deleteBot.name} was removed from the dashboard.`,
                    tone: "rose",
                  },
                }));
              }
              setDeleteBot(null);
              await refresh();
            } finally {
              setDeleting(false);
            }
          }}
        />
      )}

      {editBot && (
        <EditBotModal
          bot={editBot}
          canEditEngine={meRole === "admin"}
          onClose={() => setEditId(null)}
          onSaved={() => {
            setEditId(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: BotStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${meta.ring} ${meta.text}`}
    >
      <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

export function BotAvatar({
  username,
  status,
  className,
}: {
  username: string | null;
  status: BotStatus;
  className: string;
}) {
  const [error, setError] = useState(false);
  const showImg = username && !error;
  
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ring-1 ${className} ${
        status === "online"
          ? "bg-emerald-500/15 ring-emerald-500/30"
          : status === "connecting"
            ? "bg-amber-500/15 ring-amber-500/30"
            : status === "error"
              ? "bg-rose-500/15 ring-rose-500/30"
              : "bg-slate-700/30 ring-slate-600/40"
      }`}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://visage.surgeplay.com/bust/256/${username}?y=-40`}
          alt={username}
          onError={() => setError(true)}
          className="mt-2 h-full w-full object-contain drop-shadow-md scale-125"
          style={{ imageRendering: "pixelated" }}
        />
      ) : (
        <BotFaceIcon size={28} className="text-slate-500" />
      )}
    </div>
  );
}


function BotCard({
  bot,
  onChanged,
  onSelect,
  onManage,
  onDelete,
}: {
  bot: BotItem;
  onChanged: () => void;
  onSelect: () => void;
  onManage: () => void;
  onDelete: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const running = bot.status === "online" || bot.status === "connecting";
  const version = bot.version && bot.version !== "auto" ? bot.version : "auto";
  const displayName = bot.username || bot.name;

  function notify(title: string, text: string, tone: "emerald" | "amber" | "rose" | "sky" = "sky") {
    window.dispatchEvent(new CustomEvent("zbeam:notification", { detail: { title, text, tone } }));
  }

  async function act(path: string, action: "start" | "stop", method = "POST") {
    setBusy(true);
    try {
      const res = await fetch(path, { method });
      if (!res.ok) {
        try {
          const data = await res.json();
          if (data?.error) toast(String(data.error), "error");
        } catch {
          // non-JSON error — the refresh below still reflects the state
        }
      } else {
        notify(
          action === "start" ? "Bot started" : "Bot stopped",
          `${bot.name} ${action === "start" ? "was started" : "was stopped"}.`,
          action === "start" ? "emerald" : "amber",
        );
      }
      await onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="group relative flex min-h-[246px] flex-col overflow-hidden rounded-[1.7rem] border border-white/[0.09] bg-[linear-gradient(180deg,rgba(15,23,42,.78),rgba(2,6,23,.9))] p-4 shadow-[0_28px_90px_-62px_rgba(0,0,0,.96)] transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-[0_32px_105px_-70px_color-mix(in_srgb,var(--color-emerald-500)_60%,rgba(0,0,0,.9))] sm:p-5">
      <div className="pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-emerald-300/8 blur-3xl transition group-hover:bg-emerald-300/12" />
      <div className="pointer-events-none absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-emerald-200/45 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <BotAvatar
            username={bot.username}
            status={bot.status}
            className="h-[70px] w-[58px] rounded-2xl text-lg"
          />
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h3 className="truncate text-lg font-black tracking-[-0.035em] text-white">{displayName}</h3>
              <StatusBadge status={bot.status} />
            </div>
            <p className="mt-2 truncate font-mono text-xs font-semibold text-slate-300">{bot.host}:{bot.port}</p>
          </div>
        </div>

        <button
          disabled={busy}
          onClick={onDelete}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-rose-400/30 bg-rose-500/12 text-rose-300 shadow-[0_12px_35px_-25px_rgba(244,63,94,.9)] transition hover:border-rose-300/55 hover:bg-rose-500/20 hover:text-rose-100 active:scale-[.96] disabled:opacity-50"
          title="Delete bot"
        >
          <TrashIcon size={14} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-slate-300">
          {version === "auto" ? "auto profile" : version}
        </span>
      </div>

      {bot.status === "error" && bot.lastError ? (
        <p className="mt-4 line-clamp-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs leading-5 text-rose-200">
          {bot.lastError}
        </p>
      ) : (
        <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/42 px-3 py-2.5">
          <p className="truncate text-xs font-medium text-slate-400">
            {running ? "Session active. Open for controls." : "Ready to start."}
          </p>
        </div>
      )}

      <div className="mt-auto grid grid-cols-[1fr_1fr_46px] gap-2 pt-4">
        {running ? (
          <button
            disabled={busy}
            onClick={() => act(`/api/bots/${bot.id}/stop`, "stop")}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-rose-400/30 bg-gradient-to-b from-rose-400/95 to-rose-600/85 px-3 text-sm font-black text-white shadow-[0_18px_50px_-32px_rgba(244,63,94,.9)] transition hover:brightness-110 active:scale-[.985] disabled:opacity-50"
          >
            Stop
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={() => act(`/api/bots/${bot.id}/start`, "start")}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-300/35 bg-gradient-to-b from-emerald-300 to-emerald-500 px-3 text-sm font-black text-slate-950 shadow-[0_18px_50px_-32px_color-mix(in_srgb,var(--color-emerald-500)_90%,transparent)] transition hover:brightness-110 active:scale-[.985] disabled:opacity-50"
          >
            Start
          </button>
        )}
        <button
          onClick={onSelect}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-indigo-300/25 bg-gradient-to-b from-indigo-400/18 to-indigo-500/10 px-3 text-sm font-black text-indigo-100 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition hover:border-indigo-200/45 hover:bg-indigo-300/18 active:scale-[.985]"
        >
          Open
        </button>
        <button
          onClick={onManage}
          disabled={busy}
          title="Manage bot"
          className="grid h-11 w-11 place-items-center rounded-2xl border border-sky-300/22 bg-sky-400/10 text-sky-200 shadow-[inset_0_1px_0_rgba(255,255,255,.04)] transition hover:border-sky-200/45 hover:bg-sky-300/16 hover:text-white active:scale-[.96] disabled:opacity-50"
        >
          <ManageGlyph />
        </button>
      </div>
    </article>
  );
}


function ManageGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="8" cy="17" r="2" />
    </svg>
  );
}

function NoSearchResults({ query }: { query: string }) {
  return (
    <div className="grid min-h-[240px] place-items-center rounded-[1.7rem] border border-white/[0.08] bg-white/[0.035] p-8 text-center">
      <div>
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.045] text-2xl">⌕</div>
        <h3 className="mt-4 text-lg font-bold text-white">No bots found</h3>
        <p className="mt-2 text-sm text-slate-400">Nothing matches “{query}”.</p>
        <p className="mt-4 text-xs text-slate-600">Use the search bar in the top bar to change the query.</p>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="grid animate-fade-in place-items-center rounded-3xl border border-dashed border-slate-700/60 bg-slate-900/30 px-6 py-20 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 text-4xl ring-1 ring-slate-700/50">
        🛰️
      </div>
      <h3 className="mt-5 text-lg font-semibold">No bots yet</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">
        Add a bot with your Minecraft token and a server address. It&apos;ll try
        to join and report back here in real-time.
      </p>
      <button
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-900/30 transition hover:bg-emerald-400 active:scale-[.98]"
      >
        <PlusIcon size={16} /> Add your first bot
      </button>
    </div>
  );
}

export function AddBotModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [token, setToken] = useState("");
  const [host, setHost] = useState("");
  const [port, setPort] = useState("25565");
  const [version, setVersion] = useState("auto");
  const [proxy, setProxy] = useState("");
  const [discordUser, setDiscordUser] = useState("stood014");
  const [engine, setEngine] = useState("azalea");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError(null);
    if (!token.trim()) return setError("Please paste your Minecraft token.");
    if (!host.trim()) return setError("Please enter the server IP / address.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, token, host, port, version, proxy, discordUser, engine }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create bot");
        return;
      }
      onCreated();
    } catch {
      setError("Network error while creating bot");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="premium-modal flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-[0_0_20px_-5px_color-mix(in_srgb,var(--color-emerald-500)_50%,transparent)]">
              <PlusIcon size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Add a bot</h2>
              <p className="text-xs font-medium text-slate-400">
                Connect a Minecraft account to a server
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5">
          <Field label="Bot name (optional)">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My farming bot"
              className={inputClass}
            />
          </Field>

          <Field
            label="Minecraft token"
            hint="Your minecraft.net / Yggdrasil / bearer (access) token. Used to authenticate the session."
          >
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJraWQiOiJ..."
              rows={3}
              className={`${inputClass} resize-none font-mono text-xs`}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Field label="Server IP / address">
                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="play.example.net"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Port">
              <input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="25565"
                inputMode="numeric"
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            label="Minecraft version"
            hint={
              "Leave on Auto-detect first. If you get a disconnect, pick the server's exact version here — that fixes most join failures on proxy networks."
            }
          >
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className={inputClass}
            >
              <option value="auto">Auto-detect</option>
              {VERSIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="SOCKS proxy (optional)"
            hint="Route the connection through a SOCKS5/4 proxy, e.g. socks5://user:pass@1.2.3.4:1080. Leave blank for a direct connection. Note: a proxy only changes your IP — it does NOT prevent anticheat bans (those are account-based)."
          >
            <input
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
              placeholder="socks5://user:pass@host:1080"
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>

          <Field
            label="Discord Username (for Beam AI)"
            hint="The Discord tag the bot will ask the player to add."
          >
            <input
              value={discordUser}
              onChange={(e) => setDiscordUser(e.target.value)}
              placeholder="stood014"
              className={inputClass}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-white/5 bg-black/20 p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-[0_0_20px_-5px_color-mix(in_srgb,var(--color-emerald-500)_40%,transparent)] transition hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create & connect"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function ConfirmDeleteModal({
  bot,
  busy,
  onClose,
  onConfirm,
}: {
  bot: BotItem;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const displayName = bot.username || bot.name;
  return (
    <Overlay onClose={onClose}>
      <div className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-rose-300/18 bg-slate-950/92 shadow-[0_35px_120px_-55px_rgba(0,0,0,.98)] backdrop-blur-2xl">
        <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-44 w-44 rounded-full bg-rose-500/18 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-rose-200/50 to-transparent" />

        <div className="relative flex items-start gap-4 border-b border-white/[0.06] bg-white/[0.025] px-6 py-5">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-rose-300/25 bg-rose-500/12 text-rose-200 shadow-[0_20px_70px_-38px_rgba(244,63,94,.95)]">
            <TrashIcon size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-rose-200/80">danger action</p>
            <h2 className="mt-1 text-xl font-black tracking-[-0.04em] text-white">Delete this bot?</h2>
            <p className="mt-1 text-xs leading-5 text-slate-400">This removes the bot card and stops any running session for this account.</p>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
            aria-label="Close delete confirmation"
          >
            ✕
          </button>
        </div>

        <div className="relative px-6 py-5">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4">
            <div className="flex items-center gap-3">
              <BotAvatar username={bot.username} status={bot.status} className="h-12 w-12 rounded-2xl text-lg" />
              <div className="min-w-0">
                <div className="truncate text-sm font-black text-white">{displayName}</div>
                <div className="mt-0.5 truncate font-mono text-[11px] text-slate-500">{bot.host}:{bot.port}</div>
              </div>
            </div>
          </div>
          <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/[0.08] px-4 py-3 text-xs leading-6 text-rose-100/85">
            This cannot be undone. You can add the account again later, but this saved bot entry and its local settings will be removed now.
          </p>
        </div>

        <div className="relative grid gap-2 border-t border-white/[0.06] bg-black/25 p-5 sm:grid-cols-2">
          <button
            onClick={onClose}
            disabled={busy}
            className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/[0.06] hover:text-white active:scale-[.985] disabled:opacity-50"
          >
            Keep bot
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className="rounded-2xl border border-rose-300/25 bg-gradient-to-b from-rose-400 to-rose-600 px-5 py-3 text-sm font-black text-white shadow-[0_18px_60px_-35px_rgba(244,63,94,.95)] transition hover:brightness-110 active:scale-[.985] disabled:opacity-50"
          >
            {busy ? "Deleting…" : "Delete permanently"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6">
      <div
        className="absolute inset-0 animate-fade-in bg-[#030712]/86 backdrop-blur-2xl"
        onClick={onClose}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex w-full animate-pop-in items-center justify-center"
      >
        {/* Subtle under-glow for the modal */}
        <div className="absolute -inset-1 z-[-1] rounded-[2rem] bg-gradient-to-b from-emerald-500/16 to-indigo-500/8 blur-2xl opacity-70" />
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <span className="mb-1.5 block text-sm font-medium text-slate-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-500">{hint}</span>}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-700/80 bg-slate-950/60 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 outline-none transition focus:border-emerald-500/60 focus:bg-slate-950/80 focus:ring-2 focus:ring-emerald-500/20";

const ENGINES: { id: string; title: string; blurb: string }[] = [
  {
    id: "azalea",
    title: "Azalea (Rust)",
    blurb: "Vanilla-like physics. Latest MC protocol. No npm/mineflayer.",
  },
  {
    id: "mineflayer",
    title: "Mineflayer",
    blurb: "Full radar, inventory, beam. Fingerprinted on many PvP networks.",
  },
  {
    id: "nmp",
    title: "Raw NMP",
    blurb: "Thin minecraft-protocol session. Console + chat only.",
  },
];

function EnginePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2">
      {ENGINES.map((e) => {
        const on = value === e.id;
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => onChange(e.id)}
            className={`rounded-xl border px-3.5 py-2.5 text-left transition ${
              on
                ? "border-emerald-500/50 bg-emerald-500/10 ring-1 ring-emerald-500/30"
                : "border-slate-700/80 bg-slate-950/60 hover:border-slate-500"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-100">
                {e.title}
              </span>
              {on && (
                <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-400">
                  selected
                </span>
              )}
            </div>
            <span className="mt-0.5 block text-xs text-slate-400">{e.blurb}</span>
          </button>
        );
      })}
    </div>
  );
}

function logColor(level: LogEntry["level"]) {
  switch (level) {
    case "error":
      return "text-rose-300";
    case "system":
      return "text-sky-300";
    case "chat":
      return "text-slate-200";
    default:
      return "text-slate-300";
  }
}

// Detect private-message (whisper) lines so we can highlight them.
// Returns "from" (incoming DM), "to" (outgoing DM), or null.
function whisperKind(line: string): "from" | "to" | null {
  const l = line.toLowerCase();
  // Don't color our own injected "<you → X>" log line.
  if (/<you\s*→/.test(line)) return null;
  if (/\(from\b/.test(l) || /^\s*from\s+\w+/.test(l) || /whispers to you/.test(l))
    return "from";
  if (/\(to\b/.test(l) || /\byou whisper to\b/.test(l)) return "to";
  return null;
}

export function EditBotModal({
  bot,
  onClose,
  onSaved,
  canEditEngine = false,
  isAdmin = false,
}: {
  bot: BotItem;
  onClose: () => void;
  onSaved: () => void;
  canEditEngine?: boolean;
  isAdmin?: boolean;
}) {
  const [token, setToken] = useState("");
  const [engine, setEngine] = useState(bot.engine || "azalea");
  const [version, setVersion] = useState(bot.version || "auto");
  const [host, setHost] = useState(bot.host);
  const [port, setPort] = useState(String(bot.port));
  const [proxy, setProxy] = useState(bot.proxy || "");
  const [beamIp, setBeamIp] = useState(bot.beamIp || "badlion-pvp.xyz");
  const [discordUser, setDiscordUser] = useState(bot.discordUser || "stood014");
  const [beamType, setBeamType] = useState(bot.beamType || "ai");
  const [spamMessage, setSpamMessage] = useState(bot.spamMessage || "type 123 in chat for tier test all mode");
  const [spamInterval, setSpamInterval] = useState(String(bot.spamInterval || 60000));
  const [spamTriggerWord, setSpamTriggerWord] = useState(bot.spamTriggerWord || "123");
  const [spamReplyMessage, setSpamReplyMessage] = useState(bot.spamReplyMessage || "add my discord stood014 to join");
  const [openerScript, setOpenerScript] = useState(bot.openerScript || "");
  const [closingScript, setClosingScript] = useState(bot.closingScript || "");
  const [lobbyMethods, setLobbyMethods] = useState(() => {
    try {
      const arr = JSON.parse(bot.lobbyMethods || "[]");
      return Array.isArray(arr) ? arr.join("\n") : "";
    } catch {
      return "";
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setError(null);
    const payload: {
      token?: string;
      engine?: string;
      version?: string;
      host?: string;
      port?: string;
      proxy?: string;
      beamIp?: string;
      discordUser?: string;
      beamType?: string;
      spamMessage?: string;
      spamInterval?: number;
      spamTriggerWord?: string;
      spamReplyMessage?: string;
      openerScript?: string;
      closingScript?: string;
      lobbyMethods?: string;
    } = {};
    if (token.trim()) payload.token = token.trim();
    if (engine !== bot.engine) payload.engine = engine;
    if (version !== bot.version) payload.version = version;
    if (host.trim() && host.trim() !== bot.host) payload.host = host.trim();
    if (port.trim() && Number(port) !== bot.port) payload.port = port.trim();
    if (proxy.trim() !== (bot.proxy || "")) payload.proxy = proxy.trim();
    if (beamIp.trim() && beamIp.trim() !== (bot.beamIp || ""))
      payload.beamIp = beamIp.trim();
    if (discordUser.trim() && discordUser.trim() !== (bot.discordUser || ""))
      payload.discordUser = discordUser.trim();
    if (beamType !== bot.beamType) payload.beamType = beamType;
    if (spamMessage.trim() && spamMessage.trim() !== (bot.spamMessage || ""))
      payload.spamMessage = spamMessage.trim();
    if (spamInterval && Number(spamInterval) !== bot.spamInterval)
      payload.spamInterval = Number(spamInterval);
    if (spamTriggerWord.trim() && spamTriggerWord.trim() !== (bot.spamTriggerWord || ""))
      payload.spamTriggerWord = spamTriggerWord.trim();
    if (spamReplyMessage.trim() && spamReplyMessage.trim() !== (bot.spamReplyMessage || ""))
      payload.spamReplyMessage = spamReplyMessage.trim();
    if (openerScript.trim() !== (bot.openerScript || ""))
      payload.openerScript = openerScript.trim();
    if (closingScript.trim() !== (bot.closingScript || ""))
      payload.closingScript = closingScript.trim();
    if (isAdmin) {
      const methodLines = lobbyMethods
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .slice(0, 10);
      if (JSON.stringify(methodLines) !== (bot.lobbyMethods || "[]")) {
        payload.lobbyMethods = JSON.stringify(methodLines);
      }
    }
      
    if (Object.keys(payload).length === 0) {
      setError("Change a field to save.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/bots/${bot.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update bot");
        return;
      }
      onSaved();
    } catch {
      setError("Network error while updating bot");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Overlay onClose={onClose}>
      <div className="premium-modal flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px]">
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 text-xl shadow-lg ring-1 ring-slate-600/50">
              <GearIcon size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-white">{bot.name}</h2>
              <p className="truncate text-xs font-medium text-slate-400">
                {bot.host}:{bot.port}
                {bot.username ? ` · ${bot.username}` : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-5">
          <Field
            label="New Minecraft token"
            hint="Paste a fresh minecraft.net / bearer (access) token. Leave blank to keep the current one."
          >
            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="eyJraWQiOiJ... (leave blank to keep current)"
              rows={3}
              className={`${inputClass} resize-none font-mono text-xs`}
            />
          </Field>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Field label="Server IP / address">
                <input
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="play.example.net"
                  className={inputClass}
                />
              </Field>
            </div>
            <Field label="Port">
              <input
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="25565"
                inputMode="numeric"
                className={inputClass}
              />
            </Field>
          </div>

          <Field
            label="Minecraft version"
            hint="If a join fails with 'socketClosed', set the server's exact version here."
          >
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className={inputClass}
            >
              <option value="auto">Auto-detect</option>
              {VERSIONS.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </Field>

          <Field
            label="SOCKS proxy (optional)"
            hint="e.g. socks5://user:pass@1.2.3.4:1080. Clear it for a direct connection. A proxy changes your IP only — it does not stop anticheat bans."
          >
            <input
              value={proxy}
              onChange={(e) => setProxy(e.target.value)}
              placeholder="socks5://user:pass@host:1080"
              className={`${inputClass} font-mono text-xs`}
            />
          </Field>

          <Field
            label="Server IP (Beam fallback)"
            hint="If a player can't use Discord, the beam AI shares this IP so they can still join."
          >
            <input
              value={beamIp}
              onChange={(e) => setBeamIp(e.target.value)}
              placeholder="badlion-pvp.xyz"
              className={inputClass}
            />
          </Field>

          <Field
            label="Discord Username (for Beam AI)"
            hint="The Discord tag the bot will ask the player to add."
          >
            <input
              value={discordUser}
              onChange={(e) => setDiscordUser(e.target.value)}
              placeholder="stood014"
              className={inputClass}
            />
          </Field>

          {canEditEngine && (
            <Field
              label="Bot Engine (admin)"
              hint="Changing engine restarts the bot if it's running. Azalea ignores the pinned version and always uses latest vanilla (MC 26.1)."
            >
              <EnginePicker value={engine} onChange={setEngine} />
            </Field>
          )}
          
          <div className="border-t border-slate-800 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Beam Settings</h3>
            <div className="space-y-4">
              <Field label="Beam Type">
                <select
                  value={beamType}
                  onChange={(e) => setBeamType(e.target.value)}
                  className={inputClass}
                >
                  <option value="ai">AI Beaming (Player-to-Player)</option>
                  <option value="spam">Spam Beaming</option>
                  <option value="lobby">Lobby Anti-AFK (Trigger Word)</option>
                </select>
              </Field>

              {beamType === "ai" && (
                <>
                  <Field
                    label="Opener Script"
                    hint="One message per line, up to 5 — sent as /msg to the opponent, one by one. Leave empty to spin between 5 built-in defaults."
                  >
                    <textarea
                      value={openerScript}
                      onChange={(e) => setOpenerScript(e.target.value)}
                      rows={4}
                      placeholder={"yo\ncan you help me ?\ncause I am in a 2v2 event and I need a teamate ;["}
                      className={inputClass + " resize-y font-mono text-xs"}
                    />
                  </Field>
                  <Field
                    label="Closing Messages"
                    hint="Sent after they agree — one per line, up to 3. {discord} = your discord, {ip} = the server IP. Leave empty for the default."
                  >
                    <textarea
                      value={closingScript}
                      onChange={(e) => setClosingScript(e.target.value)}
                      rows={2}
                      placeholder={"alr letme send you where to hop on, add me on discord {discord}\nlmk when sent"}
                      className={inputClass + " resize-y font-mono text-xs"}
                    />
                  </Field>
                </>
              )}

              {(beamType === "spam" || beamType === "lobby") && (
                <>
                  <Field
                    label={beamType === "lobby" ? "Lobby Message" : "Spam Message"}
                    hint={
                      beamType === "lobby"
                        ? "Periodic lobby chat message. Keeps the bot anti-AFK and advertises the trigger word. E.g., 'type 123 in chat for tier test all mode'."
                        : "The message to send periodically."
                    }
                  >
                    <input
                      value={spamMessage}
                      onChange={(e) => setSpamMessage(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  {beamType === "lobby" && isAdmin && (
                    <Field
                      label="Lobby Methods (rotation)"
                      hint="One rotating message per line, up to 10. When nobody says the trigger word for ~10 minutes the bot switches to the next line. Empty = only the single Lobby Message above. Admin only."
                    >
                      <textarea
                        value={lobbyMethods}
                        onChange={(e) => setLobbyMethods(e.target.value)}
                        rows={4}
                        placeholder={"2v2 event need 1 more player, msg me\ntier test all mode, type 123\nlooking for teammate for event rn"}
                        className={inputClass + " resize-y font-mono text-xs"}
                      />
                    </Field>
                  )}
                  <Field label="Send Interval (ms)" hint="How often to send the message. E.g., 60000 = 1 minute.">
                    <input
                      type="number"
                      value={spamInterval}
                      onChange={(e) => setSpamInterval(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Trigger Word" hint="If a player says this in chat, the bot will /msg them the reply message. E.g., 123.">
                    <input
                      value={spamTriggerWord}
                      onChange={(e) => setSpamTriggerWord(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Reply Message" hint="Sent as /msg <player> <this message> when the trigger word is said.">
                    <input
                      value={spamReplyMessage}
                      onChange={(e) => setSpamReplyMessage(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </>
              )}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300 ring-1 ring-rose-500/20">
              {error}
            </p>
          )}

          <p className="rounded-lg bg-sky-500/10 px-3 py-2 text-xs text-sky-300 ring-1 ring-sky-500/20">
            If the bot is running, it will automatically restart with the new
            settings.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-white/5 bg-black/20 p-5">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-[0_0_20px_-5px_color-mix(in_srgb,var(--color-emerald-500)_40%,transparent)] transition hover:from-emerald-300 hover:to-emerald-400 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

