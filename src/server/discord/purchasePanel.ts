import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } from "discord.js";

type Plan = { id: string; tier: string; price: number; bots: number; hours: number; features: string; popular: string; discount: number };
function finalPrice(p: Plan): number { return Math.round(p.price * (1 - (p.discount || 0) / 100) * 100) / 100; }
function features(p: Plan): string { try { const arr = JSON.parse(p.features); return Array.isArray(arr) ? arr.map(String).join("\n") : String(p.features); } catch { return p.features; } }

export function buildPurchasePanelPayload(plans: Plan[], siteUrl: string) {
  const embed = new EmbedBuilder().setTitle("Buy ABeam licenses").setColor(0x10b981).setDescription("Pick a plan below and complete checkout on the dashboard.");
  for (const p of plans) embed.addFields({ name: `${p.tier}${p.popular === "true" ? " ⭐" : ""} — $${finalPrice(p)}/mo`, value: `${p.bots} bots · ${p.hours}h/day\n${features(p) || "License access"}`, inline: false });
  const select = new StringSelectMenuBuilder().setCustomId("plan:buy").setPlaceholder("Choose a plan").addOptions(plans.slice(0, 25).map((p) => ({ label: `${p.tier} - $${finalPrice(p)}/mo`, value: p.id, description: `${p.bots} bots · ${p.hours}h/day` })));
  const rows: any[] = [new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(select)];
  if (siteUrl) rows.push(new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`${siteUrl}/?tab=shop`).setLabel("Buy License"), new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(siteUrl).setLabel("Dashboard")));
  return { embeds: [embed], components: rows };
}

export function buildPlanDetailPayload(plan: Plan, siteUrl: string) {
  const embed = new EmbedBuilder().setTitle(`${plan.tier}${plan.popular === "true" ? " — most popular" : ""}`).setColor(0x10b981).addFields({ name: "Price", value: `$${finalPrice(plan)} / month`, inline: true }, { name: "Bots", value: String(plan.bots), inline: true }, { name: "Hours/day", value: String(plan.hours), inline: true }, { name: "Features", value: features(plan) || "License access", inline: false });
  const components = siteUrl ? [new ActionRowBuilder<ButtonBuilder>().addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(`${siteUrl}/?tab=shop&plan=${plan.id}`).setLabel("Buy License"))] : [];
  return { embeds: [embed], components };
}
