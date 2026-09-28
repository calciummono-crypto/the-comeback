import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { licenseKeys, licenses, bots, users } from "@/db/schema";

function expiry(days: number, hours: number): Date {
  const ms =
    (Number(days) || 0) * 24 * 60 * 60 * 1000 +
    (Number(hours) || 0) * 60 * 60 * 1000;
  return new Date(Date.now() + Math.max(ms, 60 * 60 * 1000));
}

function timeLeft(expiresAt: Date): string {
  const ms = Math.max(0, expiresAt.getTime() - Date.now());
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function normalizeLicense(row: typeof licenses.$inferSelect) {
  const isExpired = new Date(row.expiresAt).getTime() <= Date.now();
  return {
    ...row,
    active: row.active === "true",
    held: row.held === "true",
    isExpired,
    timeLeft: timeLeft(new Date(row.expiresAt)),
  };
}

function normalizeKey(row: typeof licenseKeys.$inferSelect) {
  return { ...row, active: row.active === "true", redeemed: row.redeemed === "true" };
}

export async function createLicense(input: {
  userId: string;
  slots: number;
  durationDays?: number;
  durationHours?: number;
  reason?: string;
  keyId?: string | null;
}) {
  const [lic] = await db
    .insert(licenses)
    .values({
      userId: input.userId,
      keyId: input.keyId ?? null,
      slots: Math.max(1, Math.floor(Number(input.slots) || 1)),
      durationDays: Math.max(0, Math.floor(Number(input.durationDays) || 0)),
      durationHours: Math.max(0, Math.floor(Number(input.durationHours) || 0)),
      reason: input.reason ?? "",
      expiresAt: expiry(Number(input.durationDays) || 0, Number(input.durationHours) || 0),
      active: "true",
      held: "false",
    })
    .returning();
  return normalizeLicense(lic);
}

export async function createLicenseKey(input: {
  slots: number;
  durationDays?: number;
  durationHours?: number;
  reason?: string;
  createdBy?: string;
}) {
  let key = "";
  for (let i = 0; i < 10; i++) {
    key = `abeam-key-${crypto.randomBytes(6).toString("hex")}`;
    const existing = await db
      .select()
      .from(licenseKeys)
      .where(eq(licenseKeys.key, key))
      .limit(1);
    if (existing.length === 0) break;
  }
  const [row] = await db
    .insert(licenseKeys)
    .values({
      key,
      slots: Math.max(1, Math.floor(Number(input.slots) || 1)),
      durationDays: Math.max(0, Math.floor(Number(input.durationDays) || 0)),
      durationHours: Math.max(0, Math.floor(Number(input.durationHours) || 0)),
      reason: input.reason ?? "",
      createdBy: input.createdBy,
      active: "true",
      redeemed: "false",
    })
    .returning();
  return normalizeKey(row);
}

export async function redeemLicenseKey(userId: string, key: string) {
  const [row] = await db
    .select()
    .from(licenseKeys)
    .where(eq(licenseKeys.key, key.trim()))
    .limit(1);
  if (!row) throw new Error("License key not found");
  if (row.active !== "true") throw new Error("License key is inactive");
  if (row.redeemed === "true") throw new Error("License key has already been redeemed");
  const lic = await createLicense({
    userId,
    slots: row.slots,
    durationDays: row.durationDays,
    durationHours: row.durationHours,
    reason: row.reason,
    keyId: row.id,
  });
  await db
    .update(licenseKeys)
    .set({ redeemed: "true", redeemedBy: userId, redeemedAt: new Date() })
    .where(eq(licenseKeys.id, row.id));
  return lic;
}

export async function getAllLicenseKeys() {
  return (await db.select().from(licenseKeys)).map(normalizeKey);
}

export async function getAllLicenses() {
  return (await db.select().from(licenses)).map(normalizeLicense);
}

export async function getUserLicenseStatus(userId: string) {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const rows = await db.select().from(licenses).where(eq(licenses.userId, userId));
  const allLicenses = rows.map(normalizeLicense);
  const activeLicenses = allLicenses.filter((l) => l.active && !l.held && !l.isExpired);
  const expiredLicenses = allLicenses.filter((l) => l.isExpired || !l.active || l.held);
  const licenseSlots = activeLicenses.reduce((sum, l) => sum + l.slots, 0);
  const adminSlots = user?.role === "admin" ? 999 : 0;
  const totalSlots = Math.max(licenseSlots, adminSlots);
  const ownedBots = await db.select({ id: bots.id }).from(bots).where(eq(bots.userId, userId));
  const usedSlots = ownedBots.length;
  const availableSlots = Math.max(0, totalSlots - usedSlots);
  const nextExpiry = activeLicenses.length
    ? activeLicenses
        .map((l) => new Date(l.expiresAt).getTime())
        .sort((a, b) => a - b)[0]
    : null;

  return {
    totalSlots,
    slots: totalSlots,
    usedSlots,
    used: usedSlots,
    availableSlots,
    canCreate: availableSlots > 0,
    hasActiveLicense: activeLicenses.length > 0 || user?.role === "admin",
    nextExpiry: nextExpiry ? new Date(nextExpiry).toISOString() : null,
    activeLicenses,
    expiredLicenses,
    licenses: allLicenses,
    active: activeLicenses,
  };
}

export async function canUserCreateBot(userId: string) {
  const status = await getUserLicenseStatus(userId);
  const allowed = status.canCreate;
  return {
    ok: allowed,
    allowed,
    slots: status.totalSlots,
    used: status.usedSlots,
    reason: allowed
      ? ""
      : status.totalSlots <= 0
        ? "No active license. Get a license first."
        : "You've used all available bot slots.",
  };
}

export async function revokeLicense(id: string) {
  await db.update(licenses).set({ active: "false" }).where(eq(licenses.id, id));
}
export async function deleteLicense(id: string) {
  await db.delete(licenses).where(eq(licenses.id, id));
}
export async function holdLicense(id: string) {
  await db.update(licenses).set({ held: "true" }).where(eq(licenses.id, id));
}
export async function unholdLicense(id: string) {
  await db.update(licenses).set({ held: "false" }).where(eq(licenses.id, id));
}
export async function revokeLicenseKey(id: string) {
  await db.update(licenseKeys).set({ active: "false" }).where(eq(licenseKeys.id, id));
}
export async function deleteLicenseKey(id: string) {
  await db.delete(licenseKeys).where(eq(licenseKeys.id, id));
}
export async function holdLicenseKey(id: string) {
  await db.update(licenseKeys).set({ active: "false" }).where(eq(licenseKeys.id, id));
}
export async function unholdLicenseKey(id: string) {
  await db.update(licenseKeys).set({ active: "true" }).where(eq(licenseKeys.id, id));
}
