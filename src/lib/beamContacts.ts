import { db } from "@/db";
import { beamConversations } from "@/db/schema";

export async function getBeamStats() {
  const rows = await db.select().from(beamConversations);
  const byBot = new Map<string, { botId: string | null; total: number; success: number; failed: number }>();
  for (const row of rows) {
    const key = row.botId ?? "unknown";
    const cur = byBot.get(key) ?? { botId: row.botId, total: 0, success: 0, failed: 0 };
    cur.total++;
    if (row.outcome === "success") cur.success++;
    if (row.outcome === "failed") cur.failed++;
    byBot.set(key, cur);
  }
  return { total: rows.length, success: rows.filter((r) => r.outcome === "success").length, failed: rows.filter((r) => r.outcome === "failed").length, bots: [...byBot.values()] };
}
