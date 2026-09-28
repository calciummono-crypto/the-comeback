export function smoothChannelName(input: string): string {
  let s = input.trim().toLowerCase();
  s = s.replace(/^[^a-z0-9]+-?/, "");
  s = s.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  if (!s) s = "channel";
  const rules: Array<[RegExp, string]> = [
    [/^general(\b|-)/, "💬"], [/^ticket/, "🎧"], [/^rules$/, "📜"], [/^ltc|payments|shop/, "🛒"],
    [/^logs?/, "📋"], [/^memes?$/, "😈"], [/^staff/, "🛡️"], [/^announcements?$/, "📢"],
    [/^voice/, "🔊"], [/^welcome$/, "👋"], [/^licenses?$/, "🔑"], [/^bug/, "🐞"],
  ];
  const emoji = rules.find(([re]) => re.test(s))?.[1] ?? "✨";
  return `${emoji}-${s}`;
}

export function parseDuration(raw: string): { days: number; hours: number } | null {
  const s = raw.trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return null;
  if (/^\d+$/.test(s)) {
    const days = Number(s);
    return days > 0 ? { days, hours: 0 } : null;
  }
  const m = s.match(/^(?:(\d+)d)?(?:(\d+)h)?$/);
  if (!m) return null;
  const days = Number(m[1] || 0);
  const hours = Number(m[2] || 0);
  return days || hours ? { days, hours } : null;
}

export function bullets(raw: string): string {
  return raw.split(/[\n,]/).map((x) => x.trim()).filter(Boolean).map((x) => `- ${x}`).join("\n");
}
