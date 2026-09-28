import crypto from "crypto";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { licenseKeys, licenses, bots } from "@/db/schema";

function expiry(days: number, hours: number): Date {
  const ms = (Number(days) || 0) * 24 * 60 * 60 * 1000 + (Number(hours) || 0) * 60 * 60 * 1000;
  return new Date(Date.now() + Math.max(ms, 60 * 60 * 1000));
}

function normalizeLicense(row: typeof licenses.$inferSelect) {
  const isExpired = new Date(row.expiresAt).getTime() <= Date.now();
  return { ...row, active: row.active === "true", held: row.held === "true", isExpired };
}

function normalizeKey(row: typeof licenseKeys.$inferSelect) {
  return { ...row, active: row.active === "true", redeemed: row.redeemed === "true" };
}

export async function createLicense(input: { userId: string; slots: number; durationDays?: number; durationHours?: number; reason?: string; keyId?: string | null }) {
  const [lic] = await db.insert(licenses).values({
    userId: input.userId,
    keyId: input.keyId ?? null,
    slots: Math.max(1, Math.floor(Number(input.slots) || 1)),
    durationDays: Math.max(0, Math.floor(Number(input.durationDays) || 0)),
    durationHours: Math.max(0, Math.floor(Number(input.durationHours) || 0)),
    reason: input.reason ?? "",
    expiresAt: expiry(Number(input.durationDays) || 0, Number(input.durationHours) || 0),
    active: "true",
    held: "false",
  }).returning();
  return normalizeLicense(lic);
}

export async function createLicenseKey(input: { slots: number; durationDays?: number; durationHours?: number; reason?: string; createdBy?: string }) {
  let key = "";
  for (let i = 0; i < 10; i++) {
    key = `abeam-key-${crypto.randomBytes(6).toString("hex")}`;
    const existing = await db.select().from(licenseKeys).where(eq(licenseKeys.key, key)).limit(1);
    if (existing.length === 0) break;
  }
  const [row] = await db.insert(licenseKeys).values({
    key,
    slots: Math.max(1, Math.floor(Number(input.slots) || 1)),
    durationDays: Math.max(0, Math.floor(Number(input.durationDays) || 0)),
    durationHours: Math.max(0, Math.floor(Number(input.durationHours) || 0)),
    reason: input.reason ?? "",
    createdBy: input.createdBy,
    active: "true",
    redeemed: "false",
  }).returning();
  return normalizeKey(row);
}

export async function redeemLicenseKey(userId: string, key: string) {
  const [row] = await db.select().from(licenseKeys).where(eq(licenseKeys.key, key.trim())).limit(1);
  if (!row) throw new Error("License key not found");
  if (row.active !== "true") throw new Error("License key is inactive");
  if (row.redeemed === "true") throw new Error("License key has already been redeemed");
  const lic = await createLicense({ userId, slots: row.slots, durationDays: row.durationDays, durationHours: row.durationHours, reason: row.reason, keyId: row.id });
  await db.update(licenseKeys).set({ redeemed: "true", redeemedBy: userId, redeemedAt: new Date() }).where(eq(licenseKeys.id, row.id));
  return lic;
}

export async function getAllLicenseKeys() {
  return (await db.select().from(licenseKeys)).map(normalizeKey);
}

export async function getAllLicenses() {
  return (await db.select().from(licenses)).map(normalizeLicense);
}

export async function getUserLicenseStatus(userId: string) {
  const rows = await db.select().from(licenses).where(eq(licenses.userId, userId));
  const userLicenses = rows.map(normalizeLicense);
  const active = userLicenses.filter((l) => l.active && !l.held && !l.isExpired);
  const slots = active.reduce((sum, l) => sum + l.slots, 0);
  const ownedBots = await db.select({ id: bots.id }).from(bots).where(eq(bots.userId, userId));
  return {
    licenses: userLicenses,
    active,
    slots,
    totalSlots: slots,
    used: ownedBots.length,
    canCreate: ownedBots.length < slots,
  };
}

export async function canUserCreateBot(userId: string) {
  const status = await getUserLicenseStatus(userId);
  const allowed = status.canCreate;
  return {
    ok: allowed,
    allowed,
    slots: status.totalSlots,
    used: status.used,
    reason: allowed ? "" : status.totalSlots <= 0 ? "No active license. Get a license first." : "You've used all available bot slots.",
  };
}

export async function revokeLicense(id: string) { await db.update(licenses).set({ active: "false" }).where(eq(licenses.id, id)); }
export async function deleteLicense(id: string) { await db.delete(licenses).where(eq(licenses.id, id)); }
export async function holdLicense(id: string) { await db.update(licenses).set({ held: "true" }).where(eq(licenses.id, id)); }
export async function unholdLicense(id: string) { await db.update(licenses).set({ held: "false" }).where(eq(licenses.id, id)); }
export async function revokeLicenseKey(id: string) { await db.update(licenseKeys).set({ active: "false" }).where(eq(licenseKeys.id, id)); }
export async function deleteLicenseKey(id: string) { await db.delete(licenseKeys).where(eq(licenseKeys.id, id)); }
export async function holdLicenseKey(id: string) { await db.update(licenseKeys).set({ active: "false" }).where(eq(licenseKeys.id, id)); }
export async function unholdLicenseKey(id: string) { await db.update(licenseKeys).set({ active: "true" }).where(eq(licenseKeys.id, id)); }
