export type ThemePreset = {
  id: string;
  label: string;
  ramp: Record<string, string>;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "emerald",
    label: "Emerald",
    ramp: { "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "900": "#064e3b", "950": "#022c22" },
  },
  {
    id: "cyan",
    label: "Cyan",
    ramp: { "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "900": "#164e63", "950": "#083344" },
  },
  {
    id: "violet",
    label: "Violet",
    ramp: { "200": "#ddd6fe", "300": "#c4b5fd", "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9", "900": "#4c1d95", "950": "#2e1065" },
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    ramp: { "200": "#f5d0fe", "300": "#f0abfc", "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf", "900": "#701a75", "950": "#4a044e" },
  },
];

export const DEFAULT_THEME_ID = "violet";

const STORAGE_KEY = "mcbm:theme";

export function loadThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID;
}

export function saveThemeId(id: string): void {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
}

export function applyThemePreset(id: string): void {
  if (typeof document === "undefined") return;
  const preset = THEME_PRESETS.find((p) => p.id === id) || THEME_PRESETS.find((p) => p.id === DEFAULT_THEME_ID) || THEME_PRESETS[0];
  const families = ["emerald", "teal", "cyan", "violet", "indigo", "fuchsia", "purple"];
  const stops = ["200", "300", "400", "500", "600", "700", "900", "950"];
  for (const family of families) {
    for (const stop of stops) {
      document.documentElement.style.setProperty(`--color-${family}-${stop}`, preset.ramp[stop] || preset.ramp["500"]);
    }
  }
}
