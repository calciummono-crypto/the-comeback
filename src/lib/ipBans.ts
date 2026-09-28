import { db } from "@/db";
import { ipBans } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function listIpBans() {
  return db.select().from(ipBans);
}

export async function addIpBan(input: { ip: string; reason?: string; bannedBy?: string }) {
  const ip = input.ip.trim();
  if (!ip) throw new Error("IP is required");
  const values = { ip, reason: input.reason ?? "", bannedBy: input.bannedBy ?? "" };
  await db.insert(ipBans).values(values).onConflictDoUpdate({ target: ipBans.ip, set: values });
  return values;
}

export async function removeIpBan(ip: string) {
  await db.delete(ipBans).where(eq(ipBans.ip, ip));
}

export async function isIpBanned(ip: string): Promise<boolean> {
  if (!ip || ip === "unknown") return false;
  const [ban] = await db.select().from(ipBans).where(eq(ipBans.ip, ip)).limit(1);
  return Boolean(ban);
}
