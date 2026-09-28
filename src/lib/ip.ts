import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export function getClientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for") || h.get("cf-connecting-ip") || h.get("x-real-ip") || "";
  return fwd.split(",")[0]?.trim() || "unknown";
}

export async function recordUserIp(userId: string, ip: string): Promise<void> {
  if (!userId || !ip || ip === "unknown") return;
  try {
    await db.update(users).set({ lastIp: ip }).where(eq(users.id, userId));
  } catch (err) {
    console.warn("recordUserIp failed", err);
  }
}
