export type ThemePreset = {
  id: string;
  label: string;
  ramp: Record<string, string>;
  /**
   * Minecraft sunset scene, derived from this preset's accent. The wallpaper
   * look (dark blocky sky -> hot horizon -> sun glow -> treeline -> water) is
   * driven entirely from these, so picking a color re-tints the whole world.
   */
  sunset: {
    /** deep sky at the very top */
    zenith: string;
    /** mid sky */
    dusk: string;
    /** sky just above the horizon */
    horizon: string;
    /** the hot band where the sun sits */
    glow: string;
    /** the sun disc itself */
    sun: string;
    /** water, below the horizon */
    water: string;
    /** reflected light on the water */
    shimmer: string;
    /** treeline / terrain silhouette */
    silhouette: string;
  };
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "sunset",
    label: "Sunset",
    ramp: { "200": "#ffd3e4", "300": "#ff9ecb", "400": "#ff5fa8", "500": "#ff2e7e", "600": "#e01561", "700": "#b3114d", "900": "#6b0b33", "950": "#45071f" },
    sunset: {
      zenith: "#07040a",
      dusk: "#2a0e2c",
      horizon: "#7a1445",
      glow: "#ff2e7e",
      sun: "#ffc98a",
      water: "#180a1c",
      shimmer: "#ff6aa5",
      silhouette: "#0a050d",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    ramp: { "200": "#a7f3d0", "300": "#6ee7b7", "400": "#34d399", "500": "#10b981", "600": "#059669", "700": "#047857", "900": "#064e3b", "950": "#022c22" },
    sunset: {
      zenith: "#04080a",
      dusk: "#0d2a24",
      horizon: "#14614a",
      glow: "#22d3a7",
      sun: "#ffe6a3",
      water: "#08171a",
      shimmer: "#5ff0c4",
      silhouette: "#04100d",
    },
  },
  {
    id: "cyan",
    label: "Cyan",
    ramp: { "200": "#a5f3fc", "300": "#67e8f9", "400": "#22d3ee", "500": "#06b6d4", "600": "#0891b2", "700": "#0e7490", "900": "#164e63", "950": "#083344" },
    sunset: {
      zenith: "#04070c",
      dusk: "#0b2740",
      horizon: "#11618c",
      glow: "#22d3ee",
      sun: "#d7fbff",
      water: "#07161f",
      shimmer: "#7ef0ff",
      silhouette: "#040d14",
    },
  },
  {
    id: "violet",
    label: "Violet",
    ramp: { "200": "#ddd6fe", "300": "#c4b5fd", "400": "#a78bfa", "500": "#8b5cf6", "600": "#7c3aed", "700": "#6d28d9", "900": "#4c1d95", "950": "#2e1065" },
    sunset: {
      zenith: "#07050d",
      dusk: "#1e1046",
      horizon: "#43238c",
      glow: "#a78bfa",
      sun: "#ffd9f5",
      water: "#120a22",
      shimmer: "#c4b5fd",
      silhouette: "#080511",
    },
  },
  {
    id: "fuchsia",
    label: "Fuchsia",
    ramp: { "200": "#f5d0fe", "300": "#f0abfc", "400": "#e879f9", "500": "#d946ef", "600": "#c026d3", "700": "#a21caf", "900": "#701a75", "950": "#4a044e" },
    sunset: {
      zenith: "#09040c",
      dusk: "#2c0c40",
      horizon: "#63137a",
      glow: "#e879f9",
      sun: "#ffe4b8",
      water: "#170a1e",
      shimmer: "#f0abfc",
      silhouette: "#0c0510",
    },
  },
];

export const DEFAULT_THEME_ID = "sunset";

const STORAGE_KEY = "mcbm:theme";

export function loadThemeId(): string {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME_ID;
}

export function saveThemeId(id: string): void {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
}

export function findPreset(id: string): ThemePreset {
  return (
    THEME_PRESETS.find((p) => p.id === id) ||
    THEME_PRESETS.find((p) => p.id === DEFAULT_THEME_ID) ||
    THEME_PRESETS[0]
  );
}

/**
 * Writes both the legacy accent families (so every emerald/violet/... class
 * in the app re-tints) and the Minecraft sunset scene variables.
 */
export function applyThemePreset(id: string): void {
  if (typeof document === "undefined") return;
  const preset = findPreset(id);
  const families = ["emerald", "teal", "cyan", "violet", "indigo", "fuchsia", "purple"];
  const stops = ["200", "300", "400", "500", "600", "700", "900", "950"];
  const root = document.documentElement;
  for (const family of families) {
    for (const stop of stops) {
      root.style.setProperty(
        `--color-${family}-${stop}`,
        preset.ramp[stop] || preset.ramp["500"],
      );
    }
  }
  applySunset(preset);
}

/** Paints the Minecraft sunset scene from a preset. */
export function applySunset(preset: ThemePreset): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const s = preset.sunset;
  root.style.setProperty("--mc-zenith", s.zenith);
  root.style.setProperty("--mc-dusk", s.dusk);
  root.style.setProperty("--mc-horizon", s.horizon);
  root.style.setProperty("--mc-glow", s.glow);
  root.style.setProperty("--mc-sun", s.sun);
  root.style.setProperty("--mc-water", s.water);
  root.style.setProperty("--mc-shimmer", s.shimmer);
  root.style.setProperty("--mc-silhouette", s.silhouette);
}
