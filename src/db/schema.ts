import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  doublePrecision,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  discordId: text("discord_id"),
  username: text("username").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("user"),
  botSlots: integer("bot_slots").notNull().default(2),
  passwordHash: text("password_hash"),
  lastIp: text("last_ip"),
  banned: text("banned").notNull().default("false"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bots = pgTable("bots", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  name: text("name").notNull(),
  token: text("token").notNull(),
  username: text("username"),
  uuid: text("uuid"),
  host: text("host").notNull(),
  port: integer("port").notNull().default(25565),
  version: text("version").notNull().default("auto"),
  proxy: text("proxy").notNull().default(""),
  ytChannel: text("yt_channel").notNull().default("Alight.z"),
  beamIp: text("beam_ip").notNull().default("badlion-pvp.xyz"),
  discordUser: text("discord_user").notNull().default("stood014"),
  engine: text("engine").notNull().default("mineflayer"),
  beamType: text("beam_type").notNull().default("ai"),
  spamMessage: text("spam_message").notNull().default("join my smp guys /msg me"),
  spamInterval: integer("spam_interval").notNull().default(60000),
  spamTriggerWord: text("spam_trigger_word").notNull().default("123"),
  spamReplyMessage: text("spam_reply_message").notNull().default("add my discord stood014 to join"),
  openerScript: text("opener_script").notNull().default(""),
  closingScript: text("closing_script").notNull().default(""),
  lobbyMethods: text("lobby_methods").notNull().default(""),
  status: text("status").notNull().default("offline"),
  lastError: text("last_error"),
  enabled: text("enabled").notNull().default("false"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appSettings = pgTable("app_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const beamConversations = pgTable("beam_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  botId: uuid("bot_id"),
  target: text("target"),
  outcome: text("outcome").notNull().default("unknown"),
  transcript: text("transcript").notNull().default("[]"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const beamContacts = pgTable(
  "beam_contacts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull(),
    host: text("host").notNull(),
    outcome: text("outcome").notNull().default("messaged"),
    attempts: integer("attempts").notNull().default(0),
    method: text("method").notNull().default(""),
    botId: uuid("bot_id"),
    lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    userHostUnique: uniqueIndex("beam_contacts_username_host_unique").on(
      table.username,
      table.host,
    ),
  }),
);

export const beamAttempts = pgTable("beam_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  botId: uuid("bot_id"),
  host: text("host").notNull().default(""),
  username: text("username").notNull().default(""),
  method: text("method").notNull().default(""),
  stage: text("stage").notNull().default(""),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const licenseKeys = pgTable("license_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  slots: integer("slots").notNull().default(1),
  durationDays: integer("duration_days").notNull().default(0),
  durationHours: integer("duration_hours").notNull().default(0),
  reason: text("reason").notNull().default(""),
  active: text("active").notNull().default("true"),
  redeemed: text("redeemed").notNull().default("false"),
  redeemedBy: uuid("redeemed_by"),
  redeemedAt: timestamp("redeemed_at"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const licenses = pgTable("licenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  keyId: uuid("key_id"),
  slots: integer("slots").notNull().default(1),
  durationDays: integer("duration_days").notNull().default(0),
  durationHours: integer("duration_hours").notNull().default(0),
  reason: text("reason").notNull().default(""),
  active: text("active").notNull().default("true"),
  held: text("held").notNull().default("false"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const shopPlans = pgTable("shop_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  tier: text("tier").notNull(),
  price: doublePrecision("price").notNull().default(0),
  bots: integer("bots").notNull().default(1),
  hours: integer("hours").notNull().default(5),
  features: text("features").notNull().default("[]"),
  popular: text("popular").notNull().default("false"),
  active: text("active").notNull().default("true"),
  discount: integer("discount").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  planId: uuid("plan_id"),
  amountUSD: doublePrecision("amount_usd").notNull().default(0),
  amountLTC: text("amount_ltc").notNull().default("0"),
  ltcAddress: text("ltc_address").notNull(),
  ltcPrivateKey: text("ltc_private_key").notNull().default(""),
  ownerLtcAddress: text("owner_ltc_address").notNull().default(""),
  status: text("status").notNull().default("pending"),
  licenseKey: text("license_key"),
  licenseKeyId: uuid("license_key_id"),
  paidAt: timestamp("paid_at"),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ipBans = pgTable("ip_bans", {
  ip: text("ip").primaryKey(),
  reason: text("reason").notNull().default(""),
  bannedBy: text("banned_by").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Bot = typeof bots.$inferSelect;
export type NewBot = typeof bots.$inferInsert;
export type AppSetting = typeof appSettings.$inferSelect;
export type BeamConversation = typeof beamConversations.$inferSelect;
export type LicenseKey = typeof licenseKeys.$inferSelect;
export type License = typeof licenses.$inferSelect;
export type ShopPlan = typeof shopPlans.$inferSelect;
export type Invoice = typeof invoices.$inferSelect;
