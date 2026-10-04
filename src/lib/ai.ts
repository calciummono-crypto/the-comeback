// AI text provider for beam conversations.
//
// Providers (tried in order, env-configured; defaults baked in per owner):
//   POLLINATIONS_API_KEYS   comma-separated keys (default: one baked-in key)
//   POLLINATIONS_API_KEY    single key alias; used by both Test AI and beam replies
//   POLLINATIONS_MODEL      default "deepseek-pro"
//   TOKEN_HARBOR_API_KEY    Token Harbor key (Anthropic-compatible /v1/messages)
//   TOKEN_HARBOR_MODEL      default "deepseek-v4.1-flash:free"
//   TOKEN_HARBOR_BASE_URL   default "https://tokenharbor.ai"
//   OPENROUTER_API_KEY      emergency fallback provider
//   AI_MODEL                openrouter model, default "nvidia/nemotron-3.5-lightning:free"
//   AI_PROVIDER             "pollinations" | "tokenharbor" | "openrouter" | "auto" (default auto)

const POLLINATIONS_BASE = "https://gen.pollinations.ai/text";
const TOKEN_HARBOR_BASE = "https://tokenharbor.ai";

const DEFAULT_POLLINATIONS_KEYS = [
  "sk_2v71KHgtGXfsHlXkJVpzrV37BtXC2YiF",
];
const DEFAULT_OPENROUTER_KEY = "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";
// "deepseek-pro" is live-verified fast/reliable on both keys; the earlier
// default (MarcosFRG/deepseek-v4-pro) hangs for tens of seconds or 500s
// intermittently — that caused the "This operation was aborted" cascade.
const DEFAULT_POLLINATIONS_MODEL = "deepseek-pro";
const DEFAULT_TOKEN_HARBOR_MODEL = "deepseek-v4.1-flash:free";
const DEFAULT_OPENROUTER_MODEL = "nvidia/nemotron-3.5-lightning:free";

function pollinationsKeys(): string[] {
  const env = [
    ...(process.env.POLLINATIONS_API_KEYS || "").split(","),
    process.env.POLLINATIONS_API_KEY || "",
  ]
    .map((s) => s.trim())
    .filter(Boolean);
  const unique = Array.from(new Set(env));
  return unique.length > 0 ? unique : DEFAULT_POLLINATIONS_KEYS;
}

function tokenHarborKey(): string {
  return (process.env.TOKEN_HARBOR_API_KEY || "").trim();
}

function tokenHarborBase(): string {
  return (process.env.TOKEN_HARBOR_BASE_URL || TOKEN_HARBOR_BASE).replace(/\/+$/, "");
}

// Sticky key = index of the key that last WORKED. Free-tier keys get rate
// limited at random; preferring the healthy one halves the failure surface.
let stickyKeyIdx = 0;
let lastPolError = "";
let lastThError = "";
let lastOrError = "";

// Provider error chains — never overwritten, so the console shows the
// FULL reason (e.g. pollinations rate-limit + tokenharbor missing key + openrouter key dead).
export function lastAiError(): string {
  return [lastPolError, lastThError, lastOrError].filter(Boolean).join(" | ");
}

export function aiStatus(): { pollinations: boolean; tokenharbor: boolean; openrouter: boolean } {
  return {
    pollinations: pollinationsKeys().length > 0,
    tokenharbor: Boolean(tokenHarborKey()),
    openrouter: Boolean((process.env.OPENROUTER_API_KEY || "").trim() || DEFAULT_OPENROUTER_KEY),
  };
}

// Clean a raw model reply: drop reasoning, unwrap code fences (instead of
// discarding them), extract JSON message fields, strip surrounding quotes.
function stripReasoning(raw: string): string {
  let t = raw
    .replace(/<think>[\s\S]*?<\/think>/gi, "")
    .trim();
  const fence = t.match(/```[a-zA-Z]*\n?([\s\S]*?)```/);
  if (fence && fence[1].trim()) t = fence[1].trim();
  if (t.startsWith("{") && t.endsWith("}")) {
    try {
      const o = JSON.parse(t);
      const inner = o.reply ?? o.message ?? o.text ?? o.response;
      if (typeof inner === "string" && inner.trim()) t = inner.trim();
    } catch {
      // not JSON — keep as-is
    }
  }
  return t.replace(/^["'`]+|["'`]+$/g, "").trim();
}

async function pollinationsText(prompt: string, timeoutMs: number): Promise<string | null> {
  const keys = pollinationsKeys();
  if (keys.length === 0) return null;
  const model = process.env.POLLINATIONS_MODEL || DEFAULT_POLLINATIONS_MODEL;
  // per-attempt cap: attempts + breather must stay well under a chat turn
  timeoutMs = Math.min(timeoutMs, 7000);
  const errors: string[] = [];
  // Two passes with a short breather — the free endpoint is flaky (rate
  // limits / cold starts); a single 5xx must not kill the turn.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < keys.length; i++) {
      const idx = (stickyKeyIdx + i) % keys.length;
      const key = keys[idx];
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), timeoutMs);
        const url = `${POLLINATIONS_BASE}/${encodeURIComponent(prompt)}?model=${encodeURIComponent(model)}&key=${encodeURIComponent(key)}`;
        const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
        clearTimeout(timer);
        if (res.ok) {
          const text = stripReasoning(await res.text());
          if (text) {
            stickyKeyIdx = idx;
            lastPolError = "";
            return text;
          }
          errors.push(`key#${idx + 1} empty reply`);
        } else {
          const body = (await res.text()).slice(0, 80).replace(/\s+/g, " ");
          errors.push(`key#${idx + 1} HTTP ${res.status}${body ? ` (${body})` : ""}`);
        }
      } catch (err) {
        errors.push(`key#${idx + 1} ${err instanceof Error ? err.message : String(err)}`);
      }
    }
    if (pass === 0) await new Promise((r) => setTimeout(r, 600));
  }
  lastPolError = `pollinations: ${errors.join("; ")}`.slice(0, 300);
  console.warn(`[ai] ${lastPolError}`);
  return null;
}

async function tokenHarborText(prompt: string, timeoutMs: number): Promise<string | null> {
  const key = tokenHarborKey();
  if (!key) {
    lastThError = "tokenharbor: TOKEN_HARBOR_API_KEY is not set";
    return null;
  }
  const model = process.env.TOKEN_HARBOR_MODEL || DEFAULT_TOKEN_HARBOR_MODEL;
  timeoutMs = Math.min(timeoutMs, 12000);
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch(`${tokenHarborBase()}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 160,
        temperature: 0.7,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: ctrl.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    if (res.ok) {
      const json = await res.json();
      const raw = Array.isArray(json?.content)
        ? json.content
            .map((part: { type?: string; text?: string }) => part?.text || "")
            .join("\n")
        : json?.completion || json?.message || json?.text || "";
      const text = stripReasoning(String(raw));
      if (text) {
        lastThError = "";
        return text;
      }
      lastThError = "tokenharbor: empty reply";
      console.warn(`[ai] ${lastThError}`);
    } else {
      const body = (await res.text()).slice(0, 120).replace(/\s+/g, " ");
      lastThError = `tokenharbor: HTTP ${res.status}${body ? ` (${body})` : ""}`.slice(0, 280);
      console.warn(`[ai] ${lastThError}`);
    }
  } catch (err) {
    lastThError = `tokenharbor: ${err instanceof Error ? err.message : String(err)}`.slice(0, 250);
    console.warn(`[ai] ${lastThError}`);
  }
  return null;
}

async function openRouterText(prompt: string, timeoutMs: number): Promise<string | null> {
  const key = (process.env.OPENROUTER_API_KEY || "").trim() || DEFAULT_OPENROUTER_KEY;
  if (!key) return null;
  const model = process.env.AI_MODEL || DEFAULT_OPENROUTER_MODEL;
  timeoutMs = Math.min(timeoutMs, 12000);
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 120,
      }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const json = await res.json();
      const raw = json?.choices?.[0]?.message?.content || "";
      const text = stripReasoning(String(raw));
      if (text) {
        lastOrError = "";
        return text;
      }
      lastOrError = "openrouter: empty reply";
      console.warn(`[ai] ${lastOrError}`);
    } else {
      const body = (await res.text()).slice(0, 80).replace(/\s+/g, " ");
      lastOrError = `openrouter: HTTP ${res.status}${body ? ` (${body})` : ""}`.slice(0, 250);
      console.warn(`[ai] ${lastOrError}`);
    }
  } catch (err) {
    lastOrError = `openrouter: ${err instanceof Error ? err.message : String(err)}`.slice(0, 250);
    console.warn(`[ai] ${lastOrError}`);
  }
  return null;
}

export type AiResult = { text: string | null; provider: string | null; ms: number };

// Generate a short reply from a prompt. Pollinations first (sticky-key
// failover + one retry pass), then Token Harbor (Anthropic-compatible), then
// OpenRouter. provider is null when everything failed — check lastAiError().
export async function aiText(prompt: string, timeoutMs = 18000): Promise<AiResult> {
  const started = Date.now();
  const prefer = (process.env.AI_PROVIDER || "auto").toLowerCase();
  const hasPol = pollinationsKeys().length > 0;
  const hasTh = Boolean(tokenHarborKey());
  const hasOr = Boolean((process.env.OPENROUTER_API_KEY || "").trim() || DEFAULT_OPENROUTER_KEY);

  const tryProvider = async (provider: "pollinations" | "tokenharbor" | "openrouter") => {
    if (provider === "pollinations") {
      const t = await pollinationsText(prompt, timeoutMs);
      if (t) return { text: t, provider, ms: Date.now() - started };
    }
    if (provider === "tokenharbor") {
      const t = await tokenHarborText(prompt, timeoutMs);
      if (t) return { text: t, provider, ms: Date.now() - started };
    }
    if (provider === "openrouter") {
      const t = await openRouterText(prompt, timeoutMs);
      if (t) return { text: t, provider, ms: Date.now() - started };
    }
    return null;
  };

  const ordered: ("pollinations" | "tokenharbor" | "openrouter")[] =
    prefer === "tokenharbor" ? ["tokenharbor", "pollinations", "openrouter"] :
    prefer === "openrouter" ? ["openrouter", "pollinations", "tokenharbor"] :
    prefer === "pollinations" ? ["pollinations", "tokenharbor", "openrouter"] :
    ["pollinations", "tokenharbor", "openrouter"];

  for (const provider of ordered) {
    if (provider === "pollinations" && !hasPol) continue;
    if (provider === "tokenharbor" && !hasTh) continue;
    if (provider === "openrouter" && !hasOr) continue;
    const result = await tryProvider(provider);
    if (result) return result;
  }
  return { text: null, provider: null, ms: Date.now() - started };
}

// --- Admin "Test AI" panel: probe one provider directly ---

export type TestableProvider = "pollinations" | "tokenharbor" | "openrouter";

// What the admin panel shows per provider (effective model incl. env override).
export function aiTestInfo(): { id: TestableProvider; label: string; model: string }[] {
  return [
    {
      id: "pollinations",
      label: "Pollinations",
      model: process.env.POLLINATIONS_MODEL || DEFAULT_POLLINATIONS_MODEL,
    },
    {
      id: "tokenharbor",
      label: "Token Harbor",
      model: process.env.TOKEN_HARBOR_MODEL || DEFAULT_TOKEN_HARBOR_MODEL,
    },
    {
      id: "openrouter",
      label: "OpenRouter",
      model: process.env.AI_MODEL || DEFAULT_OPENROUTER_MODEL,
    },
  ];
}

// Send a plain hello to EXACTLY one provider — no fallback chain — so the
// panel proves which provider is live and surfaces the raw failure reason.
export async function aiTestProvider(
  provider: TestableProvider,
  timeoutMs = 30000,
): Promise<{ text: string | null; ms: number; error: string | null }> {
  const prompt = "Say hello in one sentence.";
  const started = Date.now();
  if (provider === "pollinations") {
    lastPolError = "";
    const text = await pollinationsText(prompt, timeoutMs);
    return {
      text,
      ms: Date.now() - started,
      error: text ? null : lastPolError || "pollinations: no reply",
    };
  }
  if (provider === "tokenharbor") {
    lastThError = "";
    const text = await tokenHarborText(prompt, timeoutMs);
    return {
      text,
      ms: Date.now() - started,
      error: text ? null : lastThError || "tokenharbor: no reply",
    };
  }
  if (provider === "openrouter") {
    lastOrError = "";
    const text = await openRouterText(prompt, timeoutMs);
    return {
      text,
      ms: Date.now() - started,
      error: text ? null : lastOrError || "openrouter: no reply",
    };
  }
  return { text: null, ms: 0, error: "unknown provider" };
}
