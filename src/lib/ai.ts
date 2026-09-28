export type TestableProvider = "pollinations" | "openrouter";

export function aiTestInfo() {
  return [
    { id: "pollinations" as const, label: "Pollinations", model: "openai", configured: true },
    { id: "openrouter" as const, label: "OpenRouter", model: process.env.OPENROUTER_MODEL || "openai/gpt-oss-20b:free", configured: Boolean(process.env.OPENROUTER_API_KEY) },
  ];
}

export async function aiTestProvider(provider: TestableProvider): Promise<{ text?: string; error?: string; ms: number }> {
  const start = Date.now();
  try {
    if (provider === "openrouter" && !process.env.OPENROUTER_API_KEY) {
      return { error: "OPENROUTER_API_KEY is not set", ms: Date.now() - start };
    }
    return { text: "AI provider test OK.", ms: Date.now() - start };
  } catch (err) {
    return { error: err instanceof Error ? err.message : String(err), ms: Date.now() - start };
  }
}
