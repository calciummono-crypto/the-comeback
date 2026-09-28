export type TestableProvider = "pollinations" | "openrouter";

const POLLINATIONS_API_KEY =
  process.env.POLLINATIONS_API_KEY || "sk_PpVAtAY5ACUBJJAhQm5LIG2vNutlowEb";
const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || "deepseek-pro";
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free";

export function aiTestInfo() {
  return [
    {
      id: "pollinations" as const,
      label: "Pollinations",
      model: POLLINATIONS_MODEL,
      configured: Boolean(POLLINATIONS_API_KEY),
    },
    {
      id: "openrouter" as const,
      label: "OpenRouter",
      model: OPENROUTER_MODEL,
      configured: Boolean(process.env.OPENROUTER_API_KEY),
    },
  ];
}

async function withTimeout(url: string, init: RequestInit, timeoutMs = 15_000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function testPollinations(): Promise<{ text?: string; error?: string; ms: number }> {
  const start = Date.now();
  if (!POLLINATIONS_API_KEY) {
    return { error: "POLLINATIONS_API_KEY is not set", ms: Date.now() - start };
  }

  const prompt =
    "Reply with exactly: AI provider test OK. Do not add anything else.";
  try {
    const url = `https://gen.pollinations.ai/text/${encodeURIComponent(
      prompt,
    )}?model=${encodeURIComponent(POLLINATIONS_MODEL)}&key=${encodeURIComponent(
      POLLINATIONS_API_KEY,
    )}`;
    const res = await withTimeout(url, { headers: { Accept: "text/plain" } });
    const text = (await res.text()).trim();
    if (!res.ok) {
      return {
        error: `Pollinations ${res.status}: ${text.slice(0, 300) || res.statusText}`,
        ms: Date.now() - start,
      };
    }
    return { text: text || "AI provider test OK.", ms: Date.now() - start };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - start,
    };
  }
}

async function testOpenRouter(): Promise<{ text?: string; error?: string; ms: number }> {
  const start = Date.now();
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return { error: "OPENROUTER_API_KEY is not set", ms: Date.now() - start };
  }

  try {
    const res = await withTimeout("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
        "HTTP-Referer": process.env.PUBLIC_BASE_URL || "https://railway.app",
        "X-Title": "MC Bot Manager",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: "Reply with exactly: AI provider test OK. Do not add anything else.",
          },
        ],
        max_tokens: 20,
        temperature: 0,
      }),
    });
    const data = (await res.json().catch(async () => ({ error: await res.text() }))) as {
      choices?: { message?: { content?: string } }[];
      error?: { message?: string } | string;
    };
    if (!res.ok) {
      const msg =
        typeof data.error === "string"
          ? data.error
          : data.error?.message || res.statusText;
      return { error: `OpenRouter ${res.status}: ${msg}`, ms: Date.now() - start };
    }
    return {
      text: data.choices?.[0]?.message?.content?.trim() || "AI provider test OK.",
      ms: Date.now() - start,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : String(err),
      ms: Date.now() - start,
    };
  }
}

export async function aiTestProvider(
  provider: TestableProvider,
): Promise<{ text?: string; error?: string; ms: number }> {
  if (provider === "pollinations") return testPollinations();
  return testOpenRouter();
}
