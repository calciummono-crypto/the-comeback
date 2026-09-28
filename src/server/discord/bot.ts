import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export const BOT_TOKEN_KEY = "discord_bot_token";
export const SITE_URL_KEY = "discord_site_url";

let running = false;
let applicationId = "";
let lastError = "";

export async function getSetting(key: string): Promise<string> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, key));
  return row?.value || "";
}

export async function setSetting(key: string, value: string): Promise<void> {
  await db.insert(appSettings).values({ key, value, updatedAt: new Date() }).onConflictDoUpdate({ target: appSettings.key, set: { value, updatedAt: new Date() } });
}

export async function deleteSetting(key: string): Promise<void> {
  await db.delete(appSettings).where(eq(appSettings.key, key));
}

export function getBotStatus() { return { running, applicationId, lastError }; }

export async function startDiscordBot(token?: string): Promise<void> {
  const t = token || await getSetting(BOT_TOKEN_KEY);
  if (!t) throw new Error("Discord bot token is not set");
  running = true;
  applicationId = process.env.DISCORD_CLIENT_ID || "";
  lastError = "";
}

export async function stopDiscordBot(): Promise<void> { running = false; }
