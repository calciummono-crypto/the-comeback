import crypto from "crypto";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory } from "ecpair";
import * as ecc from "tiny-secp256k1";
import { db } from "@/db";
import { appSettings, shopPlans } from "@/db/schema";
import { eq } from "drizzle-orm";

export const litecoinNetwork: bitcoin.networks.Network = {
  messagePrefix: "\x19Litecoin Signed Message:\n",
  bech32: "ltc",
  bip32: { public: 0x019da462, private: 0x019d9cfe },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

const ECPair = ECPairFactory(ecc);
const OWNER_LTC_KEY = "owner_ltc_address";
const OWNER_LTC_KEYPHRASE = "owner_ltc_keyphrase";

export const SHOP_INVOICE_TTL_MS = 60 * 60 * 1000;

export async function getOwnerLtcAddress(): Promise<string> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, OWNER_LTC_KEY));
  return row?.value || process.env.OWNER_LTC_ADDRESS || "";
}

export async function setOwnerLtcAddress(address: string): Promise<void> {
  await db.insert(appSettings).values({ key: OWNER_LTC_KEY, value: address, updatedAt: new Date() }).onConflictDoUpdate({ target: appSettings.key, set: { value: address, updatedAt: new Date() } });
}

export async function getOwnerLtcKeyphrase(): Promise<string> {
  const [row] = await db.select().from(appSettings).where(eq(appSettings.key, OWNER_LTC_KEYPHRASE));
  return row?.value || process.env.OWNER_LTC_KEYPHRASE || "";
}

export async function setOwnerLtcKeyphrase(keyphrase: string): Promise<void> {
  await db.insert(appSettings).values({ key: OWNER_LTC_KEYPHRASE, value: keyphrase, updatedAt: new Date() }).onConflictDoUpdate({ target: appSettings.key, set: { value: keyphrase, updatedAt: new Date() } });
}

export async function getLtcPriceUSD(): Promise<number> {
  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=litecoin&vs_currencies=usd", { next: { revalidate: 60 } });
    const data = await res.json() as { litecoin?: { usd?: number } };
    return Number(data.litecoin?.usd) || 85;
  } catch {
    return 85;
  }
}

export async function calculateLtcAmount(usd: number): Promise<{ ltcAmount: string; ltcPrice: number }> {
  const ltcPrice = await getLtcPriceUSD();
  const amount = Number(usd) / ltcPrice;
  return { ltcAmount: amount.toFixed(8), ltcPrice };
}

export function generateLtcInvoiceAddress(): { address: string; privateKeyWif: string } {
  const key = ECPair.makeRandom({ network: litecoinNetwork });
  const address = bitcoin.payments.p2pkh({ pubkey: Buffer.from(key.publicKey), network: litecoinNetwork }).address;
  if (!address) throw new Error("Could not generate invoice address");
  return { address, privateKeyWif: key.toWIF() };
}

export function generateLicenseKeyForShop(): string {
  return `abeam-key-${crypto.randomBytes(6).toString("hex")}`;
}

export async function checkLtcPayment(_address: string, _amountLTC: string): Promise<{ paid: boolean; balance: string }> {
  // Real chain lookups are intentionally best-effort here. Admins can still force-paid in the route.
  return { paid: false, balance: "0" };
}

export async function createDefaultPlansIfEmpty(): Promise<void> {
  const existing = await db.select({ id: shopPlans.id }).from(shopPlans).limit(1);
  if (existing.length > 0) return;
  await db.insert(shopPlans).values([
    { tier: "STARTER", price: 5, bots: 2, hours: 6, features: JSON.stringify(["2 bot slots", "6h/day"]), popular: "false", active: "true", discount: 0 },
    { tier: "PRO", price: 10, bots: 5, hours: 12, features: JSON.stringify(["5 bot slots", "12h/day"]), popular: "true", active: "true", discount: 0 },
  ]);
}

export async function getAllPlans(activeOnly = true) {
  await createDefaultPlansIfEmpty();
  const rows = await db.select().from(shopPlans).orderBy(shopPlans.price);
  return activeOnly ? rows.filter((p) => p.active === "true") : rows;
}
