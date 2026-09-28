import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getFlag(key: string): Promise<boolean> {
  try {
    const [row] = await db.select().from(appSettings).where(eq(appSettings.key, key));
    return row?.value === "true";
  } catch {
    return false;
  }
}

async function setFlag(key: string, value: boolean): Promise<void> {
  await db
    .insert(appSettings)
    .values({ key, value: value ? "true" : "false", updatedAt: new Date() })
    .onConflictDoUpdate({ target: appSettings.key, set: { value: value ? "true" : "false", updatedAt: new Date() } });
}

export const isMaintenanceOn = () => getFlag("maintenance");
export const setMaintenance = (value: boolean) => setFlag("maintenance", value);
export const isAiModeEnabled = () => getFlag("ai_mode");
export const setAiModeEnabled = (value: boolean) => setFlag("ai_mode", value);
