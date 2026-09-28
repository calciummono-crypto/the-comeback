export type DiscordEventType = "bot" | "purchase" | "license" | "user" | "system" | string;

export function logDiscordEvent(type: DiscordEventType, payload: unknown): void {
  console.warn(`[discord-event:${type}]`, payload);
}

export function refreshDiscordPanels(): void {
  // Discord panel renderer is optional at runtime; no-op when the bot is not running.
}
