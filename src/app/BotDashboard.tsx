"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronLeft,
  CircleSlash,
  Play,
  Plus,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import { BotItem, BotStatus } from "./types";
import BotDetailView from "./BotDetailView";
import { AnimatedNumber } from "@/components/ui/skiper/animated-number";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
  BotStatus,
  { label: string; dot: string; text: string; chip: string }
> = {
  online: {
    label: "joined",
    dot: "bg-live",
    text: "text-live",
    chip: "border-live/35 bg-live/10",
  },
  connecting: {
    label: "connecting",
    dot: "bg-wait animate-blink",
    text: "text-wait",
    chip: "border-wait/35 bg-wait/10",
  },
  error: {
    label: "failed",
    dot: "bg-fail",
    text: "text-fail",
    chip: "border-fail/35 bg-fail/10",
  },
  offline: {
    label: "stopped",
    dot: "bg-dead",
    text: "text-ink-3",
    chip: "border-line bg-white/[0.03]",
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

export default function BotDashboard() {
  const [tab, setTab] = useState<"bots" | "about">("bots");
  const [items, setItems] = useState<BotItem[]>([]);
  const [slots, setSlots] = useState<number>(0);
  const [showAdd, setShowAdd] = useState(false);
  const [activeBotId, setActiveBotId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const applyBots = useCallback(
    (data: { bots?: BotItem[]; slots?: number } | null) => {
      setItems(data?.bots ?? []);
      if (typeof data?.slots === "number") setSlots(data.slots);
      setLoaded(true);
    },
    [],
  );

  const readBots = useCallback(
    () =>
      fetch("/api/bots", { cache: "no-store" }).then(
        (res) => res.json() as Promise<{ bots?: BotItem[]; slots?: number }>,
      ),
    [],
  );

  const refresh = useCallback(async () => {
    try {
      applyBots(await readBots());
    } catch {
      applyBots(null);
    }
  }, [applyBots, readBots]);

  const slotsFull = slots > 0 && items.length >= slots;
  const online = items.filter((b) => b.status === "online").length;

  useEffect(() => {
    let alive = true;
    const tick = () =>
      readBots()
        .then((data) => {
          if (alive) applyBots(data);
        })
        .catch(() => {
          /* ignore */
        });
    tick();
    const t = setInterval(tick, 2500);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [readBots, applyBots]);

  const activeBot = items.find((b) => b.id === activeBotId) ?? null;
  const editBot = items.find((b) => b.id === editId) ?? null;

  if (activeBot) {
    return (
      <div className="animate-rise">
        <button
          onClick={() => setActiveBotId(null)}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 transition-colors hover:text-ink"
        >
          <ChevronLeft size={15} /> Bots
        </button>
        <BotDetailView bot={activeBot} onChanged={refresh} />
      </div>
    );
  }

  return (
    <div>
      {/* ---- header ---- */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-3">
            control center
          </p>
          <h1 className="mt-1 text-[26px] font-semibold leading-none tracking-tight">
            My Bots
          </h1>
          <p className="mt-2 text-sm text-ink-2">
            {slots > 0 ? (
              <>
                <span
                  className={cn(
                    "font-mono font-semibold",
                    slotsFull ? "text-wait" : "text-ink",
                  )}
                >
                  <AnimatedNumber value={items.length} />/{slots}
                </span>{" "}
                slots in use ·{" "}
                <span className="font-mono font-semibold text-live">
                  <AnimatedNumber value={online} />
                </span>{" "}
                online
              </>
            ) : (
              "Spin up Minecraft bots and control them."
            )}
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          disabled={slotsFull}
          title={slotsFull ? "No bot slots left — ask an admin" : "Add a bot"}
          className="btn btn-primary"
        >
          <Plus size={15} strokeWidth={2.5} /> Add bot
        </button>
      </header>

      {/* ---- tabs ---- */}
      <nav className="mt-6 flex gap-6 border-b border-line">
        {(
          [
            ["bots", `Bots (${items.length})`],
            ["about", "How it works"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            aria-current={tab === key ? "true" : undefined}
            className={`relative -mb-px pb-2.5 text-[13px] font-medium transition-colors ${
              tab === key
                ? "text-ink"
                : "text-ink-3 hover:text-ink-2"
            }`}
          >
            {label}
            <span
              aria-hidden
              className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full transition-all ${
                tab === key ? "bg-sun" : "bg-transparent"
              }`}
            />
          </button>
        ))}
      </nav>

      {tab === "bots" ? (
        <section className="mt-5">
          {!loaded ? (
            <div className="space-y-2.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-[76px] rounded-lg" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState onAdd={() => setShowAdd(true)} />
          ) : (
            <ul className="grid gap-2.5">
              {items.map((bot) => (
                <BotRow
                  key={bot.id}
                  bot={bot}
                  onChanged={refresh}
                  onSelect={() => setActiveBotId(bot.id)}
                  onEdit={() => setEditId(bot.id)}
                />
              ))}
            </ul>
          )}
        </section>
      ) : (
        <AboutPanel />
      )}

      {showAdd && (
        <AddBotModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            refresh();
          }}
        />
      )}

      {editBot && (
        <EditBotModal
          bot={editBot}
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

/* -------------------------------------------------------------------------- */

export function StatusBadge({ status }: { status: BotStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]",
        meta.chip,
        meta.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
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

  const ring =
    status === "online"
      ? "border-live/40 bg-live/10"
      : status === "connecting"
        ? "border-wait/40 bg-wait/10"
        : status === "error"
          ? "border-fail/40 bg-fail/10"
          : "border-line bg-white/[0.03]";

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden border",
        ring,
        className,
      )}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://visage.surgeplay.com/bust/256/${username}?y=-40`}
          alt={username}
          onError={() => setError(true)}
          className="pixelated mt-2 h-full w-full scale-125 object-contain drop-shadow-md"
        />
      ) : (
        <span className="text-lg opacity-60" aria-hidden>
          ▦
        </span>
      )}
    </div>
  );
}

function BotRow({
  bot,
  onChanged,
  onSelect,
  onEdit,
}: {
  bot: BotItem;
  onChanged: () => void;
  onSelect: () => void;
  onEdit: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const running = bot.status === "online" || bot.status === "connecting";

  async function act(path: string, method = "POST") {
    setBusy(true);
    try {
      await fetch(path, { method });
      await onChanged();
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="panel heat rounded-lg">
      <div className="flex flex-wrap items-center gap-3 p-3 sm:p-4">
        <BotAvatar
          username={bot.username}
          status={bot.status}
          className="h-11 w-11 rounded-md text-lg"
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold tracking-tight">
              {bot.name}
            </h3>
            <StatusBadge status={bot.status} />
          </div>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-ink-3">
            <span className="text-ink-2">
              {bot.host}:{bot.port}
            </span>
            <span aria-hidden className="opacity-40">
              /
            </span>
            <span className="rounded border border-line bg-white/[0.03] px-1 py-px">
              {bot.version && bot.version !== "auto" ? bot.version : "auto"}
            </span>
            {bot.username && (
              <>
                <span aria-hidden className="opacity-40">
                  /
                </span>
                <span className="text-ink-2">{bot.username}</span>
              </>
            )}
            <span aria-hidden className="opacity-40">
              /
            </span>
            <span className="uppercase">{bot.engine}</span>
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <button onClick={onSelect} className="btn btn-primary !px-3 !py-2">
            Control
          </button>
          <button
            onClick={onEdit}
            className="btn btn-ghost !px-2.5 !py-2"
            title="Manage token & version"
            aria-label={`Manage ${bot.name}`}
          >
            <Settings2 size={14} />
          </button>
          {running ? (
            <button
              disabled={busy}
              onClick={() => act(`/api/bots/${bot.id}/stop`)}
              className="btn btn-ghost !px-2.5 !py-2"
              title="Stop"
              aria-label={`Stop ${bot.name}`}
            >
              <CircleSlash size={14} />
            </button>
          ) : (
            <button
              disabled={busy}
              onClick={() => act(`/api/bots/${bot.id}/start`)}
              className="btn btn-ghost !px-2.5 !py-2 !text-live"
              title="Start"
              aria-label={`Start ${bot.name}`}
            >
              <Play size={14} />
            </button>
          )}
          <button
            disabled={busy}
            onClick={() => {
              if (confirm(`Delete bot "${bot.name}"?`))
                act(`/api/bots/${bot.id}`, "DELETE");
            }}
            className="btn btn-ghost !px-2.5 !py-2 hover:!border-fail/40 hover:!text-fail"
            title="Delete bot"
            aria-label={`Delete ${bot.name}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {(bot.status === "error" && bot.lastError) || bot.joined ? (
        <div className="border-t border-line px-3 py-2 sm:px-4">
          {bot.status === "error" && bot.lastError && (
            <p className="font-mono text-xs leading-relaxed text-fail">
              {bot.lastError}
            </p>
          )}
          {bot.joined && (
            <p className="font-mono text-xs text-live">
              ✓ successfully joined the server
            </p>
          )}
        </div>
      ) : null}
    </li>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="panel grid animate-fade-in place-items-center rounded-lg border-dashed px-6 py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-md border border-line bg-white/[0.03] text-sun">
        <Plus size={22} strokeWidth={1.5} />
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">
        No bots yet
      </h3>
      <p className="mt-1.5 max-w-[44ch] text-sm leading-relaxed text-ink-2">
        Add a bot with your Minecraft token and a server address. It will try to
        join and report back here in real time.
      </p>
      <button onClick={onAdd} className="btn btn-primary mt-5">
        <Plus size={15} strokeWidth={2.5} /> Add your first bot
      </button>
    </div>
  );
}

function AboutPanel() {
  return (
    <section className="panel mt-5 space-y-4 rounded-lg p-5 text-sm leading-relaxed text-ink-2">
      <h2 className="text-[15px] font-semibold text-ink">How it works</h2>
      <ol className="space-y-2">
        {[
          <>
            Click <b className="text-ink">Add bot</b> and paste your Minecraft
            access token (the bearer / Yggdrasil token issued after you log in
            at minecraft.net).
          </>,
          <>
            Enter the <b className="text-ink">server IP</b>, e.g.{" "}
            <code className="font-mono text-xs text-sun">play.example.net</code>{" "}
            or <code className="font-mono text-xs text-sun">1.2.3.4:25565</code>
            .
          </>,
          <>
            The server validates the token against Minecraft services, resolves
            your username, and connects with{" "}
            <code className="font-mono text-xs text-sun">mineflayer</code>.
          </>,
          <>
            Each bot reports whether it <b className="text-ink">joined</b>, and
            you can open the <b className="text-ink">console</b> to watch chat
            and send messages.
          </>,
        ].map((step, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border border-line bg-white/[0.03] font-mono text-[10px] text-sun">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <p className="rounded-md border border-wait/30 bg-wait/10 px-3 py-2 text-xs leading-relaxed text-wait">
        Tokens are short-lived. If a join fails with an auth error, grab a fresh
        token. Bots only run while this server process is alive.
      </p>
      <p className="rounded-md border border-mod/30 bg-mod/10 px-3 py-2 text-xs leading-relaxed text-mod">
        Seeing <b>Disconnected: socketClosed</b>? That usually means a version
        mismatch behind the server&apos;s proxy. Re-create the bot and set the
        exact Minecraft version the server runs — the manager also fetches your
        chat-signing certificates automatically so chat works on 1.19+.
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function Overlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 animate-fade-in bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex w-full animate-rise justify-center"
      >
        {children}
      </div>
    </div>
  );
}

function ModalShell({
  title,
  subtitle,
  icon,
  onClose,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="premium-modal flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-xl">
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-line bg-white/[0.04] text-sun">
            {icon}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold tracking-tight">
              {title}
            </h2>
            <p className="truncate font-mono text-[11px] text-ink-3">
              {subtitle}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-ink-3 transition-colors hover:bg-white/5 hover:text-ink"
        >
          <X size={15} />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto p-5">{children}</div>

      <div className="flex justify-end gap-2 border-t border-line bg-black/25 px-5 py-4">
        {footer}
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
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink-2">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-xs leading-relaxed text-ink-3">
          {hint}
        </span>
      )}
    </label>
  );
}

/* -------------------------------------------------------------------------- */

function AddBotModal({
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
  const [engine, setEngine] = useState("mineflayer");
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
        body: JSON.stringify({
          name,
          token,
          host,
          port,
          version,
          proxy,
          discordUser,
          engine,
        }),
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
      <ModalShell
        title="Add a bot"
        subtitle="connect a minecraft account to a server"
        icon={<Plus size={17} />}
        onClose={onClose}
        footer={
          <>
            <button onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? "Creating…" : "Create & connect"}
            </button>
          </>
        }
      >
        <Field label="Bot name (optional)">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="My farming bot"
            className="field"
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
            className="field resize-none font-mono text-xs"
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Field label="Server IP / address">
              <input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="play.example.net"
                className="field"
              />
            </Field>
          </div>
          <Field label="Port">
            <input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="25565"
              inputMode="numeric"
              className="field font-mono"
            />
          </Field>
        </div>

        <Field
          label="Minecraft version"
          hint="Leave on auto-detect first. If you get a 'socketClosed' disconnect, pick the server's exact version here — that fixes most join failures on proxy/anticheat networks."
        >
          <select
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="field"
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
          hint="Route the connection through a SOCKS5/4 proxy, e.g. socks5://user:pass@1.2.3.4:1080. Leave blank for a direct connection. A proxy only changes your IP — it does not prevent anticheat bans, those are account-based."
        >
          <input
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            placeholder="socks5://user:pass@host:1080"
            className="field font-mono text-xs"
          />
        </Field>

        <Field
          label="Discord username (for Beam AI)"
          hint="The Discord tag the bot will ask the player to add."
        >
          <input
            value={discordUser}
            onChange={(e) => setDiscordUser(e.target.value)}
            placeholder="stood014"
            className="field"
          />
        </Field>

        <Field
          label="Bot engine"
          hint="Mineflayer includes radar/beam. Raw NMP uses the stealth bypass snippet (console only)."
        >
          <select
            value={engine}
            onChange={(e) => setEngine(e.target.value)}
            className="field"
          >
            <option value="mineflayer">Mineflayer (full features)</option>
            <option value="nmp">Raw NMP (stealth bypass)</option>
          </select>
        </Field>

        {error && (
          <p className="rounded-md border border-fail/35 bg-fail/10 px-3 py-2 text-xs text-fail">
            {error}
          </p>
        )}
      </ModalShell>
    </Overlay>
  );
}

export function EditBotModal({
  bot,
  onClose,
  onSaved,
}: {
  bot: BotItem;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [token, setToken] = useState("");
  const [version, setVersion] = useState(bot.version || "auto");
  const [host, setHost] = useState(bot.host);
  const [port, setPort] = useState(String(bot.port));
  const [proxy, setProxy] = useState(bot.proxy || "");
  const [ytChannel, setYtChannel] = useState(bot.ytChannel || "Alight.z");
  const [beamIp, setBeamIp] = useState(bot.beamIp || "badlion-pvp.xyz");
  const [discordUser, setDiscordUser] = useState(bot.discordUser || "stood014");
  const [beamType, setBeamType] = useState(bot.beamType || "ai");
  const [spamMessage, setSpamMessage] = useState(
    bot.spamMessage || "join my smp guys /msg me",
  );
  const [spamInterval, setSpamInterval] = useState(
    String(bot.spamInterval || 60000),
  );
  const [spamTriggerWord, setSpamTriggerWord] = useState(
    bot.spamTriggerWord || "123",
  );
  const [spamReplyMessage, setSpamReplyMessage] = useState(
    bot.spamReplyMessage || "add my discord stood014 to join",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setError(null);
    const payload: Record<string, string | number> = {};
    if (token.trim()) payload.token = token.trim();
    if (version !== bot.version) payload.version = version;
    if (host.trim() && host.trim() !== bot.host) payload.host = host.trim();
    if (port.trim() && Number(port) !== bot.port) payload.port = port.trim();
    if (proxy.trim() !== (bot.proxy || "")) payload.proxy = proxy.trim();
    if (ytChannel.trim() && ytChannel.trim() !== (bot.ytChannel || ""))
      payload.ytChannel = ytChannel.trim();
    if (beamIp.trim() && beamIp.trim() !== (bot.beamIp || ""))
      payload.beamIp = beamIp.trim();
    if (discordUser.trim() && discordUser.trim() !== (bot.discordUser || ""))
      payload.discordUser = discordUser.trim();
    if (beamType !== bot.beamType) payload.beamType = beamType;
    if (spamMessage.trim() && spamMessage.trim() !== (bot.spamMessage || ""))
      payload.spamMessage = spamMessage.trim();
    if (spamInterval && Number(spamInterval) !== bot.spamInterval)
      payload.spamInterval = Number(spamInterval);
    if (
      spamTriggerWord.trim() &&
      spamTriggerWord.trim() !== (bot.spamTriggerWord || "")
    )
      payload.spamTriggerWord = spamTriggerWord.trim();
    if (
      spamReplyMessage.trim() &&
      spamReplyMessage.trim() !== (bot.spamReplyMessage || "")
    )
      payload.spamReplyMessage = spamReplyMessage.trim();

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
      <ModalShell
        title={bot.name}
        subtitle={`${bot.host}:${bot.port}${bot.username ? ` · ${bot.username}` : ""}`}
        icon={<Settings2 size={17} />}
        onClose={onClose}
        footer={
          <>
            <button onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="btn btn-primary"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      >
        <Field
          label="New Minecraft token"
          hint="Paste a fresh minecraft.net / bearer (access) token. Leave blank to keep the current one."
        >
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="eyJraWQiOiJ... (leave blank to keep current)"
            rows={3}
            className="field resize-none font-mono text-xs"
          />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <Field label="Server IP / address">
              <input
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="play.example.net"
                className="field"
              />
            </Field>
          </div>
          <Field label="Port">
            <input
              value={port}
              onChange={(e) => setPort(e.target.value)}
              placeholder="25565"
              inputMode="numeric"
              className="field font-mono"
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
            className="field"
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
          hint="e.g. socks5://user:pass@1.2.3.4:1080. Clear it for a direct connection."
        >
          <input
            value={proxy}
            onChange={(e) => setProxy(e.target.value)}
            placeholder="socks5://user:pass@host:1080"
            className="field font-mono text-xs"
          />
        </Field>

        <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <Field
            label="YouTube channel"
            hint="Mentioned when a player asks for your channel."
          >
            <input
              value={ytChannel}
              onChange={(e) => setYtChannel(e.target.value)}
              placeholder="Alight.z"
              className="field"
            />
          </Field>
          <Field label="Beam fallback IP" hint="Shared with players without Discord.">
            <input
              value={beamIp}
              onChange={(e) => setBeamIp(e.target.value)}
              placeholder="badlion-pvp.xyz"
              className="field"
            />
          </Field>
        </div>

        <Field
          label="Discord username (for Beam AI)"
          hint="The Discord tag the bot will ask the player to add."
        >
          <input
            value={discordUser}
            onChange={(e) => setDiscordUser(e.target.value)}
            placeholder="stood014"
            className="field"
          />
        </Field>

        <div className="border-t border-line pt-4">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-3">
            beam settings
          </p>
          <div className="space-y-4">
            <Field label="Beam type">
              <select
                value={beamType}
                onChange={(e) => setBeamType(e.target.value)}
                className="field"
              >
                <option value="ai">AI beaming (player-to-player)</option>
                <option value="spam">Spam beaming</option>
              </select>
            </Field>

            {beamType === "spam" && (
              <>
                <Field label="Spam message" hint="Sent periodically to chat.">
                  <input
                    value={spamMessage}
                    onChange={(e) => setSpamMessage(e.target.value)}
                    className="field"
                  />
                </Field>
                <Field
                  label="Spam interval (ms)"
                  hint="How often to send it. 60000 = 1 minute."
                >
                  <input
                    type="number"
                    value={spamInterval}
                    onChange={(e) => setSpamInterval(e.target.value)}
                    className="field font-mono"
                  />
                </Field>
                <Field
                  label="Trigger word"
                  hint="If a player says this in chat, the bot whispers them the reply."
                >
                  <input
                    value={spamTriggerWord}
                    onChange={(e) => setSpamTriggerWord(e.target.value)}
                    className="field"
                  />
                </Field>
                <Field label="Reply message" hint="Whisper sent on trigger.">
                  <input
                    value={spamReplyMessage}
                    onChange={(e) => setSpamReplyMessage(e.target.value)}
                    className="field"
                  />
                </Field>
              </>
            )}
          </div>
        </div>

        {error && (
          <p className="rounded-md border border-fail/35 bg-fail/10 px-3 py-2 text-xs text-fail">
            {error}
          </p>
        )}

        <p className="rounded-md border border-line bg-white/[0.03] px-3 py-2 text-xs text-ink-3">
          If the bot is running, it will restart with the new settings.
        </p>
      </ModalShell>
    </Overlay>
  );
}
