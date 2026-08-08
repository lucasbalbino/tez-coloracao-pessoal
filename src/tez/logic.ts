// Tez — color, theme and scoring helpers, ported from Tez.dc.html.
import { INST, SEASON_BY_KEY, SEASONS, MAIN_LABEL, META, type Product, type Season } from "./data";

// --- color helpers ---
function rgb(h: string): [number, number, number] {
  const s = h.replace("#", "");
  return [parseInt(s.substr(0, 2), 16), parseInt(s.substr(2, 2), 16), parseInt(s.substr(4, 2), 16)];
}
function hex(r: number, g: number, b: number): string {
  const c = (v: number) => ("0" + Math.round(Math.max(0, Math.min(255, v))).toString(16)).slice(-2);
  return "#" + c(r) + c(g) + c(b);
}
export function mix(a: string, b: string, t: number): string {
  const A = rgb(a), B = rgb(b);
  return hex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}
function lum(h: string): number {
  const [r, g, b] = rgb(h);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
// darken a cartela color until it holds white text / reads on a light ground
function readable(h: string): string {
  let c = h, g = 0;
  while (lum(c) > 0.5 && g++ < 10) c = mix(c, "#1b1a18", 0.26);
  return c;
}
export function inkFor(h: string): string {
  const [r, g, b] = rgb(h);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#1b1a18" : "#ffffff";
}

export interface Theme {
  bg: string;
  surface: string;
  sunken: string;
  ink: string;
  muted: string;
  faint: string;
  line: string;
  accent: string;
  btnBg: string;
  btnFg: string;
  seasonInk: string;
  seasonAccent: string;
  warm: boolean;
  depth: number;
  hue: number;
  swatches: string[];
  fontDisplay: string;
}

// Chrome is ALWAYS institutional. The season only supplies identity tokens
// (seasonInk for the user's own labels/score) + the values scoreOf() reads.
export function makeTheme(seasonKey: string | null): Theme {
  const I = INST;
  if (!seasonKey) {
    return {
      ...I,
      seasonInk: I.ink,
      seasonAccent: I.accent,
      btnBg: I.ink,
      btnFg: I.bg,
      warm: false,
      depth: 0.5,
      hue: 0,
      swatches: [],
    };
  }
  const s = SEASON_BY_KEY[seasonKey];
  const acc = readable(s.accent);
  return {
    ...I,
    bg: mix(I.bg, s.accent, 0.07),
    surface: mix(I.surface, s.accent, 0.035),
    sunken: mix(I.sunken, s.accent, 0.06),
    line: mix(I.line, s.accent, 0.2),
    accent: acc,
    btnBg: acc,
    btnFg: "#ffffff",
    seasonInk: s.famInk,
    seasonAccent: s.accent,
    warm: s.warm,
    depth: s.depth,
    hue: s.hue,
    swatches: s.swatches,
  };
}

export function scoreOf(p: Product, s: { hue: number; warm: boolean; depth: number }): number {
  let d = Math.abs(p.hue - s.hue);
  if (d > 180) d = 360 - d;
  const v = 100 - d * 0.26 - (p.warm !== s.warm ? 24 : 0) - Math.abs(p.depth - s.depth) * 30;
  return Math.max(9, Math.min(99, Math.round(v)));
}

// Result-accent: the selected cartela's own color dresses user-content results.
export function resultAccent(seasonKey: string | null, theme: Theme): string {
  return seasonKey ? theme.seasonAccent : theme.accent;
}

export interface CardTheme {
  surface: string;
  ink: string;
  accent: string;
  line: string;
  muted: string;
  fontDisplay: string;
}

export function cardTheme(seasonKey: string | null, theme: Theme): CardTheme {
  return {
    surface: theme.surface,
    ink: theme.ink,
    accent: resultAccent(seasonKey, theme),
    line: theme.line,
    muted: theme.muted,
    fontDisplay: theme.fontDisplay,
  };
}

export interface RankRow {
  key: string;
  label: string;
  main: string;
  rawMain: string;
  accent: string;
  score: number;
}

export function ranking(p: Product): RankRow[] {
  return SEASONS.map((s: Season) => ({
    key: s.key,
    label: s.label,
    main: MAIN_LABEL[s.main],
    rawMain: s.main,
    accent: s.accent,
    score: scoreOf(p, s),
  })).sort((a, b) => b.score - a.score);
}

export { META };
